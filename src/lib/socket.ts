import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

/**
 * Initialize Socket.IO server
 * This sets up real-time communication for analytics
 */
export function initSocketIO(res: NextApiResponseServerIO): SocketIOServer {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');

    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Send initial metrics
      socket.emit('metrics:update', {
        scansLastMinute: 0,
        activeQRCodes: 0,
        currentViewers: io.engine.clientsCount,
        scansToday: 0,
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        
        // Broadcast updated viewer count
        io.emit('metrics:update', {
          currentViewers: io.engine.clientsCount,
        });
      });

      // Subscribe to specific QR code analytics
      socket.on('subscribe:qrcode', (qrCodeId: string) => {
        socket.join(`qrcode:${qrCodeId}`);
        console.log(`Client ${socket.id} subscribed to QR code ${qrCodeId}`);
      });

      socket.on('unsubscribe:qrcode', (qrCodeId: string) => {
        socket.leave(`qrcode:${qrCodeId}`);
        console.log(`Client ${socket.id} unsubscribed from QR code ${qrCodeId}`);
      });
    });

    res.socket.server.io = io;
    console.log('Socket.IO server initialized');

    return io;
  }

  return res.socket.server.io;
}

/**
 * Emit new scan event to real-time dashboard
 */
export function emitNewScan(
  io: SocketIOServer,
  qrCodeId: string,
  scanData: {
    timestamp: string;
    location: string;
    device: string;
    qrCodeName: string;
  }
) {
  // Emit to all connected clients
  io.emit('scan:new', scanData);
  
  // Emit to specific QR code subscribers
  io.to(`qrcode:${qrCodeId}`).emit('qrcode:scan', scanData);
}

/**
 * Update real-time metrics
 */
export function updateMetrics(
  io: SocketIOServer,
  metrics: {
    scansLastMinute?: number;
    activeQRCodes?: number;
    scansToday?: number;
  }
) {
  io.emit('metrics:update', {
    ...metrics,
    currentViewers: io.engine.clientsCount,
  });
}
