#!/bin/bash
if [ "$#" -ne 2 ]; then
  echo "Usage: ./make-admin.sh email@example.com password"
  exit 1
fi

node make-admin.js "$1" "$2"