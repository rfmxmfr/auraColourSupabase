#!/bin/bash

# Apply the anonymous submissions support migrations
echo "Applying anonymous submissions support migrations..."

# Get the Supabase URL and service role key from .env.local
SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '=' -f2)
SUPABASE_SERVICE_ROLE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d '=' -f2)

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: Supabase URL or service role key not found in .env.local"
  exit 1
fi

# Apply the migrations
echo "Applying schema changes for anonymous submissions..."
curl -X POST \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/sql" \
  --data-binary @migrations/anonymous-submissions-support.sql \
  "$SUPABASE_URL/rest/v1/sql"

echo "Applying admin dashboard view updates..."
curl -X POST \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/sql" \
  --data-binary @admin-setup.sql \
  "$SUPABASE_URL/rest/v1/sql"

echo "Applying anonymous submission linking functions..."
curl -X POST \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/sql" \
  --data-binary @link-anonymous-submissions.sql \
  "$SUPABASE_URL/rest/v1/sql"

echo "Migrations applied successfully!"