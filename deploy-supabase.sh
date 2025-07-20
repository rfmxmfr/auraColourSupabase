#!/bin/bash

echo "Preparing for Supabase deployment..."

# Check for any remaining Firebase references
echo "Checking for Firebase references..."
FIREBASE_REFS=$(grep -r "from ['\"]firebase" --include="*.ts" --include="*.tsx" ./src)
if [ -n "$FIREBASE_REFS" ]; then
  echo "ERROR: Found Firebase imports that need to be removed:"
  echo "$FIREBASE_REFS"
  exit 1
fi

# Deploy with environment variables
echo "Setting up environment variables for deployment..."
vercel deploy --prod

echo "Deployment complete!"