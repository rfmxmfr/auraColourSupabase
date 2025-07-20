#!/bin/bash

# Script to set up environment variables in Vercel
echo "Setting up environment variables in Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Ensure the user is logged in
vercel whoami || vercel login

# Get the project name
PROJECT_NAME="aura-colour-supabase"

# Get environment variables from .env.local
if [ -f .env.local ]; then
    echo "Found .env.local file. Using variables from there."
    
    # Extract variables
    SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '=' -f2)
    SUPABASE_ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d '=' -f2)
    SUPABASE_SERVICE_ROLE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d '=' -f2)
    STRIPE_SECRET_KEY=$(grep STRIPE_SECRET_KEY .env.local | cut -d '=' -f2)
    STRIPE_WEBHOOK_SECRET=$(grep STRIPE_WEBHOOK_SECRET .env.local | cut -d '=' -f2)
    
    # Set environment variables in Vercel
    echo "Setting NEXT_PUBLIC_SUPABASE_URL..."
    vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "$SUPABASE_URL"
    
    echo "Setting NEXT_PUBLIC_SUPABASE_ANON_KEY..."
    vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY"
    
    echo "Setting SUPABASE_SERVICE_ROLE_KEY..."
    vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "$SUPABASE_SERVICE_ROLE_KEY"
    
    if [ ! -z "$STRIPE_SECRET_KEY" ]; then
        echo "Setting STRIPE_SECRET_KEY..."
        vercel env add STRIPE_SECRET_KEY production <<< "$STRIPE_SECRET_KEY"
    fi
    
    if [ ! -z "$STRIPE_WEBHOOK_SECRET" ]; then
        echo "Setting STRIPE_WEBHOOK_SECRET..."
        vercel env add STRIPE_WEBHOOK_SECRET production <<< "$STRIPE_WEBHOOK_SECRET"
    fi
    
    echo "Environment variables set successfully!"
else
    echo "No .env.local file found. Please set up environment variables manually in the Vercel dashboard."
fi