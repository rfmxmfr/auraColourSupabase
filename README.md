# AuraStyle AI - Supabase Version

This is a NextJS application for color analysis and style recommendations, using Supabase for authentication and database.

## Deployment Instructions

### Vercel Deployment

1. Fork this repository to your GitHub account
2. Sign up for a Vercel account at https://vercel.com if you don't have one
3. Connect your GitHub account to Vercel
4. Create a new project in Vercel and select this repository
5. Configure the following environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Deploy the application

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
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
4. Run the development server: `npm run dev`
5. Open [http://localhost:9002](http://localhost:9002) in your browser

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