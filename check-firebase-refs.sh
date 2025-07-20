#!/bin/bash

echo "Checking for Firebase references in the codebase..."
echo "=================================================="

# Check for imports from Firebase
echo "Checking for Firebase imports:"
grep -r "from ['\"]firebase" --include="*.ts" --include="*.tsx" ./src || echo "No Firebase imports found."

# Check for Firebase references
echo -e "\nChecking for Firebase references:"
grep -r "firebase" --include="*.ts" --include="*.tsx" ./src | grep -v "// For migration" | grep -v "Compatibility layer"

echo -e "\nDone checking for Firebase references."