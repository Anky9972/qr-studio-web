-- Add database indexes for performance optimization
-- Run this migration to improve query performance

-- QRCode table indexes
CREATE INDEX IF NOT EXISTS "QRCode_userId_createdAt_idx" ON "QRCode"("userId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "QRCode_userId_scanCount_idx" ON "QRCode"("userId", "scanCount" DESC);
CREATE INDEX IF NOT EXISTS "QRCode_type_idx" ON "QRCode"("type");
CREATE INDEX IF NOT EXISTS "QRCode_campaignId_idx" ON "QRCode"("campaignId") WHERE "campaignId" IS NOT NULL;

-- Scan table indexes
CREATE INDEX IF NOT EXISTS "Scan_qrCodeId_scannedAt_idx" ON "Scan"("qrCodeId", "scannedAt" DESC);
CREATE INDEX IF NOT EXISTS "Scan_scannedAt_idx" ON "Scan"("scannedAt" DESC);
CREATE INDEX IF NOT EXISTS "Scan_country_idx" ON "Scan"("country") WHERE "country" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "Scan_city_idx" ON "Scan"("city") WHERE "city" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "Scan_device_idx" ON "Scan"("device") WHERE "device" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "Scan_ipAddress_idx" ON "Scan"("ipAddress") WHERE "ipAddress" IS NOT NULL;

-- User table indexes (if not already exists)
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_plan_idx" ON "User"("plan");
CREATE INDEX IF NOT EXISTS "User_createdAt_idx" ON "User"("createdAt" DESC);

-- ApiKey table indexes
CREATE INDEX IF NOT EXISTS "ApiKey_userId_idx" ON "ApiKey"("userId");
CREATE INDEX IF NOT EXISTS "ApiKey_key_idx" ON "ApiKey"("key");

-- Webhook table indexes
CREATE INDEX IF NOT EXISTS "Webhook_userId_idx" ON "Webhook"("userId");
CREATE INDEX IF NOT EXISTS "Webhook_isActive_idx" ON "Webhook"("isActive") WHERE "isActive" = true;

-- WebhookLog table indexes
CREATE INDEX IF NOT EXISTS "WebhookLog_webhookId_createdAt_idx" ON "WebhookLog"("webhookId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "WebhookLog_status_idx" ON "WebhookLog"("status");

-- Campaign table indexes (if exists)
CREATE INDEX IF NOT EXISTS "Campaign_userId_idx" ON "Campaign"("userId") WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Campaign');
CREATE INDEX IF NOT EXISTS "Campaign_startDate_endDate_idx" ON "Campaign"("startDate", "endDate") WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Campaign');

-- Template table indexes (if exists)
CREATE INDEX IF NOT EXISTS "Template_userId_idx" ON "Template"("userId") WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Template');
CREATE INDEX IF NOT EXISTS "Template_category_idx" ON "Template"("category") WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Template');

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS "QRCode_userId_favorite_idx" ON "QRCode"("userId", "favorite") WHERE "favorite" = true;
CREATE INDEX IF NOT EXISTS "Scan_qrCodeId_ipAddress_idx" ON "Scan"("qrCodeId", "ipAddress");

-- Analyze tables to update statistics
ANALYZE "User";
ANALYZE "QRCode";
ANALYZE "Scan";
ANALYZE "ApiKey";
ANALYZE "Webhook";
ANALYZE "WebhookLog";
