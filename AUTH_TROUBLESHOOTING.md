# Authentication Troubleshooting Guide

This guide helps resolve common authentication issues with the AuraStyle AI application.

## Common Error: "Invalid login credentials"

This error occurs when the provided email and password don't match any user in the Supabase authentication system.

### Solution:

1. **Create a test user** using the provided script:
   ```bash
   node create-test-user.js
   ```
   This will create a test user with email `test@example.com` and password `Test123!`

2. **Create an admin user** using the provided script:
   ```bash
   node create-admin-user.js
   ```
   This will create an admin user with email `admin@aurastyle.ai` and password `Admin123!`

3. **Check Supabase Authentication Console**:
   - Go to the Supabase Dashboard
   - Select your project
   - Navigate to Authentication > Users
   - Verify that your users are listed there

## Other Common Authentication Issues

### 1. "Invalid API key"

This error occurs when the Supabase API key is invalid or missing.

**Solution**:
- Check that your `.env.local` file contains the correct `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verify that the API key is enabled in the Supabase Dashboard

### 2. "User not found"

This error occurs when trying to sign in with an email that doesn't exist in Supabase Authentication.

**Solution**:
- Create a new user with the email you're trying to use
- Check for typos in the email address

### 3. "Invalid password"

This error occurs when the password is incorrect for the given email.

**Solution**:
- Reset the password for the user in the Supabase Dashboard
- Make sure you're using the correct password

### 4. "Email already in use"

This error occurs when trying to create a user with an email that already exists.

**Solution**:
- Use a different email address
- Reset the password for the existing account

## Resetting User Password

If you need to reset a user's password:

1. Go to the Supabase Dashboard
2. Navigate to Authentication > Users
3. Find the user and click the three dots menu
4. Select "Reset Password"
5. Follow the prompts to reset the password

## Testing Authentication

To test if authentication is working properly:

1. Clear your browser cookies and local storage
2. Try logging in with the test user credentials
3. If successful, you should be redirected to the dashboard or home page
4. If you encounter an error, check the browser console for specific error messages