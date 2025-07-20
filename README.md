# AuraStyle AI - Supabase Version

This is a NextJS application for color analysis and style recommendations, using Supabase for authentication and database.

## Deployment Instructions

### Vercel Deployment

#### Option 1: Automatic Deployment

1. Fork this repository to your GitHub account
2. Sign up for a Vercel account at https://vercel.com if you don't have one
3. Connect your GitHub account to Vercel
4. Create a new project in Vercel and select this repository
5. Configure the following environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
6. Deploy the application

#### Option 2: Using the Deployment Script

1. Install the Vercel CLI: `npm install -g vercel`
2. Log in to Vercel: `vercel login`
3. Run the deployment script: `./deploy-to-vercel.sh`
4. Follow the prompts to complete the deployment
5. After deployment, add the required environment variables in the Vercel dashboard

#### Option 3: GitHub Actions

1. Fork this repository to your GitHub account
2. Set up the following secrets in your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
3. Push to the main branch to trigger automatic deployment
4. Add the required environment variables in the Vercel dashboard

### Supabase Setup

1. Sign up for a Supabase account at https://supabase.com if you don't have one
2. Create a new project in Supabase
3. Run the SQL commands in `supabase-schema.sql` in the Supabase SQL editor to set up the database schema and policies
4. Get your Supabase URL and API keys from the project settings
5. Add them to your environment variables

## Local Development

To get started locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with the required environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase-dashboard
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase-dashboard
   ```
   
   You can find these values in your Supabase project dashboard under Project Settings > API
4. Verify your Supabase connection: `./check-supabase.sh`
5. Initialize the database schema: `./init-db.sh`
   
   If the automated setup fails, you can manually set up the database:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `enhanced-schema.sql` (recommended) or `manual-setup.sql`
   - Run the SQL commands
   
   The `enhanced-schema.sql` file contains a comprehensive schema with advanced features like:
   - Audit logging for all changes
   - Enhanced security with row-level security policies
   - Comprehensive indexes for better performance
   - Additional metadata fields for better tracking
5. Create an admin user: `./create-admin.sh`
6. Create a test user: `./create-user.sh`
7. Run the development server: `npm run dev`
8. Open [http://localhost:9876](http://localhost:9876) in your browser

## Migration from Firebase

If you're migrating from Firebase to Supabase, follow these steps:

1. Export your Firebase users to a JSON file
2. Place the JSON file in the root directory as `firebase-users.json`
3. Run the migration script: `node scripts/migrate-users.js`
4. Update any references to Firebase UIDs in your database to use Supabase UUIDs

## Authentication

This application uses Supabase Authentication for user management. The main authentication flows are:

- Sign up: `/signup`
- Sign in: `/login`
- Protected routes: `/admin/*` (requires admin role)

Row Level Security (RLS) policies are set up in Supabase to control access to data based on the user's role and ID.

## Anonymous Submissions

The application supports anonymous submissions, allowing users to complete the questionnaire without creating an account:

1. Users can access the questionnaire directly without logging in
2. They can complete all steps and optionally provide an email address
3. After payment, they're given the option to create an account
4. If they create an account, their submission is automatically linked to their new account
5. If they provided an email but didn't create an account, results are sent to their email

To enable anonymous submissions support:

1. Run the migration script: `./apply-anonymous-support.sh`
2. This will update the database schema and policies to handle anonymous users
3. It will also update the admin dashboard views to properly display anonymous submissions

The anonymous submission flow improves user experience by reducing friction in the initial questionnaire process while still providing a path for users to create accounts later.