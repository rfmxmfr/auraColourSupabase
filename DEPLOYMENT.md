# Deployment Guide

This guide provides detailed instructions for deploying the AuraStyle AI application to Vercel with Supabase integration.

## Prerequisites

- GitHub account
- Vercel account
- Supabase account
- Firebase project (for backward compatibility)

## Step 1: Prepare Your Repository

1. Fork or clone this repository to your GitHub account
2. Ensure all files are committed and pushed to your repository

## Step 2: Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL commands from the `supabase-schema.sql` file to set up the database schema
4. Navigate to Settings > API to get your Supabase URL and API keys
5. Make note of:
   - Supabase URL
   - Supabase Anon Key
   - Supabase Service Role Key

## Step 3: Deploy to Vercel

### Option 1: Manual Deployment

1. Sign up or log in to Vercel at https://vercel.com
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the following environment variables:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click "Deploy"

### Option 2: Using GitHub Actions

1. In your GitHub repository, go to Settings > Secrets and variables > Actions
2. Add the following secrets:
   - `VERCEL_TOKEN` (Get this from your Vercel account settings)
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Push to your main branch to trigger the deployment workflow

## Step 4: Verify Deployment

1. Once deployed, Vercel will provide you with a URL for your application
2. Visit the URL to ensure the application is working correctly
3. Test the authentication and database functionality

## Troubleshooting

- If you encounter issues with Firebase authentication, check that your Firebase API keys are correctly set in the environment variables
- If database operations fail, verify your Supabase connection details and ensure the SQL schema has been properly applied
- For deployment issues, check the Vercel deployment logs for specific error messages

## Migrating Data from Firebase to Supabase

If you have existing data in Firebase that you want to migrate to Supabase:

1. Export your Firebase data using the Firebase console or Firebase Admin SDK
2. Transform the data to match the Supabase schema
3. Import the data into Supabase using the Supabase client or direct SQL commands

Note: The application is currently configured to work with both Firebase and Supabase simultaneously during the transition period.