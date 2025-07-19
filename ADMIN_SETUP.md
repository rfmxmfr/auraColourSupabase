# Admin Setup Guide for Supabase

This guide explains how to set up admin users and dashboards in Supabase for the AuraStyle AI application.

## Setting Up Admin User

1. Log in to your Supabase project dashboard
2. Go to the SQL Editor
3. Run the SQL commands from the `admin-setup.sql` file
4. Create an admin user by running:

```sql
SELECT create_admin_user('admin@aurastyle.ai', 'your_secure_password', 'Admin User');
```

Replace `'admin@aurastyle.ai'`, `'your_secure_password'`, and `'Admin User'` with your preferred admin email, password, and name.

## Admin Dashboard Views

The SQL setup creates two dashboard views:

1. `admin_dashboard_submissions` - Shows all user submissions with details
2. `admin_dashboard_reports` - Shows all generated reports with details

These views are accessible to users with the admin role.

## Accessing the Admin Dashboard

1. Log in to the application using your admin credentials
2. Navigate to `/admin` to access the admin dashboard
3. You'll see tabs for Submissions and Reports

## Admin Permissions

Admin users have the following permissions:

- View all user submissions
- View all generated reports
- Update submission status
- Generate reports for submissions
- View user profiles

## Security Considerations

- Admin passwords should be strong and regularly updated
- Admin accounts should use email addresses with your domain (e.g., `@aurastyle.ai`)
- Consider enabling two-factor authentication for admin accounts

## Troubleshooting

If you encounter issues with admin access:

1. Verify the user has been properly created in the auth.users table
2. Check that the admin role has been granted to the user
3. Ensure the RLS policies are correctly configured
4. Check the Supabase logs for any authentication or permission errors