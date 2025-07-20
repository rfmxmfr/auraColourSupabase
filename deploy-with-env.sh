#!/bin/bash

# Check for any remaining Firebase references
echo "Checking for Firebase references..."
FIREBASE_REFS=$(grep -r "from ['\"]firebase" --include="*.ts" --include="*.tsx" ./src)
if [ -n "$FIREBASE_REFS" ]; then
  echo "ERROR: Found Firebase imports that need to be removed:"
  echo "$FIREBASE_REFS"
  exit 1
fi

# Set environment variables for Vercel deployment
echo "Setting up environment variables for deployment..."

# Set default values for Stripe keys if not provided
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-"sk_test_example"}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET:-"whsec_example"}

# Deploy to Vercel with environment variables
vercel --prod \
  -e NEXT_PUBLIC_SUPABASE_URL="https://vqamddepfymdtfyphran.supabase.co" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxYW1kZGVwZnltZHRmeXBocmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMDMyMDMsImV4cCI6MjA2ODU3OTIwM30.Ax3ZrrkL_qorpjy4KXgHAH76WK-NNw9-EehKO39cd0Y" \
  -e SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxYW1kZGVwZnltZHRmeXBocmFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzAwMzIwMywiZXhwIjoyMDY4NTc5MjAzfQ.Yx_PVqjPxNsL3nq3m0bDQrQwV3yke4xhQgYyYQNSGt4}" \
  -e STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY" \
  -e STRIPE_WEBHOOK_SECRET="$STRIPE_WEBHOOK_SECRET"

echo "Deployment complete!"