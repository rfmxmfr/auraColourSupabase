#!/bin/bash

echo "=== Setting up AuraStyle AI with Supabase ==="

echo -e "\n1. Checking Supabase connection..."
./check-supabase.sh
if [ $? -ne 0 ]; then
  echo "Warning: Supabase connection check had issues, but we'll continue setup."
  echo "You may need to manually set up the database schema and users."
  read -p "Press Enter to continue or Ctrl+C to abort..."
fi

echo -e "\n2. Initializing database schema..."
./init-db.sh
if [ $? -ne 0 ]; then
  echo "Warning: Database initialization had issues."
  echo "You may need to manually run the SQL commands in the Supabase SQL editor."
  read -p "Press Enter to continue or Ctrl+C to abort..."
fi

echo -e "\n3. Creating admin user..."
./create-admin.sh
if [ $? -ne 0 ]; then
  echo "Warning: Admin user creation had issues."
  echo "You may need to manually create an admin user."
  read -p "Press Enter to continue or Ctrl+C to abort..."
fi

echo -e "\n4. Creating test user..."
./create-user.sh
if [ $? -ne 0 ]; then
  echo "Warning: Test user creation had issues."
  echo "You may need to manually create a test user."
  read -p "Press Enter to continue or Ctrl+C to abort..."
fi

echo -e "\n=== Setup completed! ==="
echo "You can now start the development server with: npm run dev"