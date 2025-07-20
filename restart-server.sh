#!/bin/bash

# Check if port 9002 is in use
if lsof -Pi :9002 -sTCP:LISTEN -t >/dev/null ; then
    echo "Port 9002 is in use. Killing the process..."
    # Find and kill the process using port 9002
    pid=$(lsof -Pi :9002 -sTCP:LISTEN -t)
    kill -9 $pid
    echo "Process $pid killed"
    sleep 2
fi

# Start the server
echo "Starting the server on port 9002..."
npm run dev