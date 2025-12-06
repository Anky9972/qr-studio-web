
export const backgroundPatterns = [
    {
        id: 'dots',
        name: 'Polka Dots',
        value: `radial-gradient(#444cf7 1px, transparent 1px)`,
        size: '20px 20px',
        opacity: 0.1
    },
    {
        id: 'grid',
        name: 'Graph Paper',
        value: `linear-gradient(#444cf7 1px, transparent 1px), linear-gradient(90deg, #444cf7 1px, transparent 1px)`,
        size: '20px 20px',
        opacity: 0.05
    },
    {
        id: 'diagonal',
        name: 'Diagonal Stripes',
        value: `repeating-linear-gradient(45deg, #444cf7 0, #444cf7 1px, transparent 0, transparent 50%)`,
        size: '10px 10px',
        opacity: 0.05
    },
    {
        id: 'checker',
        name: 'Checkerboard',
        value: `conic-gradient(#444cf7 90deg, transparent 90deg 180deg, #444cf7 180deg 270deg, transparent 270deg)`,
        size: '20px 20px',
        opacity: 0.03
    },
    {
        id: 'noise',
        name: 'Noise',
        value: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
        size: 'auto',
        opacity: 0.4
    }
];

export const stockImages = {
    restaurant: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    ],
    corporate: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    ],
    creative: [
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    ],
    beauty: [
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
    ]
};
