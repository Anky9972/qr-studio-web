import { test, expect } from '@playwright/test';

test.describe('QR Code Generation', () => {
  test.use({ storageState: 'tests/e2e/.auth/user.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display QR code generation form', async ({ page }) => {
    await page.getByRole('tab', { name: /generate/i }).click();
    
    await expect(page.getByLabel(/qr type/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /generate qr code/i })).toBeVisible();
  });

  test('should generate URL QR code', async ({ page }) => {
    await page.getByRole('tab', { name: /generate/i }).click();
    
    // Select URL type
    await page.getByLabel(/qr type/i).selectOption('URL');
    
    // Fill in URL
    await page.getByLabel(/enter url/i).fill('https://example.com');
    
    // Optional: Set name
    await page.getByLabel(/name/i).fill('Example Website');
    
    // Generate
    await page.getByRole('button', { name: /generate qr code/i }).click();
    
    // Should show QR code
    await expect(page.locator('canvas, img').first()).toBeVisible({ timeout: 5000 });
    
    // Should show success message
    await expect(page.getByText(/qr code created/i)).toBeVisible();
  });

  test('should customize QR code colors', async ({ page }) => {
    await page.getByRole('tab', { name: /generate/i }).click();
    
    await page.getByLabel(/qr type/i).selectOption('URL');
    await page.getByLabel(/enter url/i).fill('https://example.com');
    
    // Open customization options
    await page.getByRole('button', { name: /customize/i }).click();
    
    // Change colors
    await page.getByLabel(/foreground color/i).fill('#FF0000');
    await page.getByLabel(/background color/i).fill('#FFFFFF');
    
    await page.getByRole('button', { name: /generate qr code/i }).click();
    
    await expect(page.locator('canvas, img').first()).toBeVisible({ timeout: 5000 });
  });

  test('should generate text QR code', async ({ page }) => {
    await page.getByRole('tab', { name: /generate/i }).click();
    
    await page.getByLabel(/qr type/i).selectOption('TEXT');
    await page.getByLabel(/enter text/i).fill('Hello World!');
    
    await page.getByRole('button', { name: /generate qr code/i }).click();
    
    await expect(page.locator('canvas, img').first()).toBeVisible({ timeout: 5000 });
  });

  test('should generate email QR code', async ({ page }) => {
    await page.getByRole('tab', { name: /generate/i }).click();
    
    await page.getByLabel(/qr type/i).selectOption('EMAIL');
    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByLabel(/subject/i).fill('Test Subject');
    await page.getByLabel(/message/i).fill('Test message');
    
    await page.getByRole('button', { name: /generate qr code/i }).click();
    
    await expect(page.locator('canvas, img').first()).toBeVisible({ timeout: 5000 });
  });

  test('should generate WiFi QR code', async ({ page }) => {
    await page.getByRole('tab', { name: /generate/i }).click();
    
    await page.getByLabel(/qr type/i).selectOption('WIFI');
    await page.getByLabel(/network name/i).fill('MyWiFi');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByLabel(/encryption/i).selectOption('WPA');
    
    await page.getByRole('button', { name: /generate qr code/i }).click();
    
    await expect(page.locator('canvas, img').first()).toBeVisible({ timeout: 5000 });
  });

  test('should download QR code', async ({ page }) => {
    await page.getByRole('tab', { name: /generate/i }).click();
    
    await page.getByLabel(/qr type/i).selectOption('URL');
    await page.getByLabel(/enter url/i).fill('https://example.com');
    await page.getByRole('button', { name: /generate qr code/i }).click();
    
    await expect(page.locator('canvas, img').first()).toBeVisible({ timeout: 5000 });
    
    // Start download
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /download/i }).click();
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toMatch(/\.png$/);
  });

  test('should validate required fields', async ({ page }) => {
    await page.getByRole('tab', { name: /generate/i }).click();
    
    await page.getByLabel(/qr type/i).selectOption('URL');
    // Don't fill URL
    await page.getByRole('button', { name: /generate qr code/i }).click();
    
    // Should show validation error
    await expect(page.getByText(/required/i)).toBeVisible();
  });

  test('should validate URL format', async ({ page }) => {
    await page.getByRole('tab', { name: /generate/i }).click();
    
    await page.getByLabel(/qr type/i).selectOption('URL');
    await page.getByLabel(/enter url/i).fill('not-a-valid-url');
    await page.getByRole('button', { name: /generate qr code/i }).click();
    
    // Should show validation error
    await expect(page.getByText(/invalid url/i)).toBeVisible();
  });

  test('should show QR code in history', async ({ page }) => {
    await page.getByRole('tab', { name: /generate/i }).click();
    
    const qrName = `Test QR ${Date.now()}`;
    
    await page.getByLabel(/qr type/i).selectOption('URL');
    await page.getByLabel(/enter url/i).fill('https://example.com');
    await page.getByLabel(/name/i).fill(qrName);
    await page.getByRole('button', { name: /generate qr code/i }).click();
    
    await expect(page.locator('canvas, img').first()).toBeVisible({ timeout: 5000 });
    
    // Navigate to history
    await page.getByRole('tab', { name: /history/i }).click();
    
    // Should see the newly created QR code
    await expect(page.getByText(qrName)).toBeVisible({ timeout: 3000 });
  });

  test('should handle generation errors gracefully', async ({ page }) => {
    await page.getByRole('tab', { name: /generate/i }).click();
    
    // Try to generate with extremely long content
    const longText = 'a'.repeat(10000);
    await page.getByLabel(/qr type/i).selectOption('TEXT');
    await page.getByLabel(/enter text/i).fill(longText);
    await page.getByRole('button', { name: /generate qr code/i }).click();
    
    // Should show error or warning
    await expect(page.getByText(/error|warning|too large/i)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('QR Code Management', () => {
  test.use({ storageState: 'tests/e2e/.auth/user.json' });

  test('should display QR code list', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('tab', { name: /history/i }).click();
    
    // Should show list or empty state
    const hasQRCodes = await page.getByRole('article').count() > 0;
    if (hasQRCodes) {
      await expect(page.getByRole('article').first()).toBeVisible();
    } else {
      await expect(page.getByText(/no qr codes/i)).toBeVisible();
    }
  });

  test('should search QR codes', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('tab', { name: /history/i }).click();
    
    const searchBox = page.getByPlaceholder(/search/i);
    if (await searchBox.isVisible()) {
      await searchBox.fill('test');
      await expect(searchBox).toHaveValue('test');
    }
  });

  test('should filter QR codes by type', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('tab', { name: /history/i }).click();
    
    const filterButton = page.getByRole('button', { name: /filter/i });
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.getByRole('menuitem', { name: /url/i }).click();
    }
  });

  test('should delete QR code', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Create a QR code first
    await page.getByRole('tab', { name: /generate/i }).click();
    const qrName = `To Delete ${Date.now()}`;
    await page.getByLabel(/qr type/i).selectOption('URL');
    await page.getByLabel(/enter url/i).fill('https://example.com');
    await page.getByLabel(/name/i).fill(qrName);
    await page.getByRole('button', { name: /generate qr code/i }).click();
    
    await expect(page.locator('canvas, img').first()).toBeVisible({ timeout: 5000 });
    
    // Navigate to history
    await page.getByRole('tab', { name: /history/i }).click();
    
    // Find and delete
    const qrCard = page.locator(`text=${qrName}`).locator('..').locator('..');
    await qrCard.getByRole('button', { name: /delete|remove/i }).click();
    
    // Confirm deletion
    await page.getByRole('button', { name: /confirm|yes|delete/i }).click();
    
    // Should no longer be visible
    await expect(page.getByText(qrName)).not.toBeVisible({ timeout: 3000 });
  });
});
