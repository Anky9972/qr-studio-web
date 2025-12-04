import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page for unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('should show sign up form', async ({ page }) => {
    await page.goto('/signup');
    
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('should validate email format on sign up', async ({ page }) => {
    await page.goto('/signup');
    
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Should show validation error
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('should validate password requirements', async ({ page }) => {
    await page.goto('/signup');
    
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('123'); // Too short
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Should show password requirement error
    await expect(page.getByText(/password must be/i)).toBeVisible();
  });

  test('should show OAuth providers', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /github/i })).toBeVisible();
  });

  test('should navigate between login and signup', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL(/\/signup/);
    
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display forgot password link', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByRole('link', { name: /forgot password/i })).toBeVisible();
  });

  test('should handle login errors gracefully', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel(/email/i).fill('nonexistent@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Authenticated User Flow', () => {
  test.use({ storageState: 'tests/e2e/.auth/user.json' });

  test('should access dashboard when authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('should display user menu', async ({ page }) => {
    await page.goto('/dashboard');
    
    await page.getByRole('button', { name: /user menu/i }).click();
    await expect(page.getByRole('menuitem', { name: /settings/i })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /sign out/i })).toBeVisible();
  });

  test('should sign out successfully', async ({ page }) => {
    await page.goto('/dashboard');
    
    await page.getByRole('button', { name: /user menu/i }).click();
    await page.getByRole('menuitem', { name: /sign out/i }).click();
    
    // Should redirect to home or login
    await expect(page).toHaveURL(/\/(login|$)/);
  });
});
