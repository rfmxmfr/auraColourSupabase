#!/bin/bash

# Combined deployment script for both Supabase and Vercel
echo "Starting full deployment process..."

# 1. Set up Supabase
echo "Setting up Supabase..."
./init-db.sh

# 2. Apply anonymous submissions support
echo "Applying anonymous submissions support..."
./apply-anonymous-support.sh

# 3. Set up environment variables in Vercel
echo "Setting up Vercel environment variables..."
./setup-vercel-env.sh

# 4. Deploy to Vercel
echo "Deploying to Vercel..."
./deploy-to-vercel.sh

echo "Deployment complete! Your application should now be fully set up and deployed."