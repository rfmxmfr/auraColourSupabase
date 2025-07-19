# Authentication Troubleshooting Guide

This guide helps resolve common authentication issues with the AuraStyle AI application.

## Common Error: "Firebase: Error (auth/invalid-credential)"

This error occurs when the provided email and password don't match any user in the Firebase authentication system.

### Solution:

1. **Create a test user** using the provided script:
   ```bash
   ./create-user.sh
   ```
   This will create a test user with email `test@example.com` and password `Test123!`

2. **Create an admin user** using the provided script:
   ```bash
   ./create-admin.sh
   ```
   This will create an admin user with email `admin@aurastyle.ai` and password `Admin123!`

3. **Check Firebase Authentication Console**:
   - Go to the Firebase Console
   - Select your project
   - Navigate to Authentication > Users
   - Verify that your users are listed there

## Other Common Authentication Issues

### 1. "Firebase: Error (auth/invalid-api-key)"

This error occurs when the Firebase API key is invalid or missing.

**Solution**:
- Check that your `.env.local` file contains the correct `NEXT_PUBLIC_FIREBASE_API_KEY`
- Verify that the API key is enabled in the Firebase Console

### 2. "Firebase: Error (auth/user-not-found)"

This error occurs when trying to sign in with an email that doesn't exist in Firebase Authentication.

**Solution**:
- Create a new user with the email you're trying to use
- Check for typos in the email address

### 3. "Firebase: Error (auth/wrong-password)"

This error occurs when the password is incorrect for the given email.

**Solution**:
- Reset the password for the user in the Firebase Console
- Make sure you're using the correct password

### 4. "Firebase: Error (auth/email-already-in-use)"

This error occurs when trying to create a user with an email that already exists.

**Solution**:
- Use a different email address
- Reset the password for the existing account

## Resetting User Password

If you need to reset a user's password:

1. Go to the Firebase Console
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