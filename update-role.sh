#!/bin/bash
if [ -z "$1" ]; then
  echo "Please provide a user email"
  echo "Usage: ./update-role.sh user@example.com"
  exit 1
fi

node update-user-role.js "$1"