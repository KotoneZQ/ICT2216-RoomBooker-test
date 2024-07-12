#!/bin/sh

# Function to check if a service is up
wait_for_service() {
  local url=$1
  local retries=30
  local wait=1
  local count=0

  until wget -q -O- $url > /dev/null; do
    count=$((count + 1))
    if [ $count -ge $retries ]; then
      echo "Service $url not responding after $retries attempts."
      exit 1
    fi
    echo "Waiting for $url..."
    sleep $wait
  done
}

# Activate the virtual environment
. venv/bin/activate

# Start FastAPI
uvicorn main:app --host 0.0.0.0 --port 8000 &
FASTAPI_PID=$!

# Wait for FastAPI to be up
wait_for_service http://localhost:8000

# Debug: List the contents of the root directory
echo "Listing contents of /:"
ls -la /

# Debug: List the contents of the app directory
echo "Listing contents of /app:"
ls -la /app

# Debug: List the contents of the frontend directory
echo "Listing contents of /app/frontend:"
ls -la /app/frontend

# Start Next.js in development mode
cd /app/frontend/material-ui-nextjs
if [ $? -ne 0 ]; then
  echo "Failed to change directory to /app/frontend/material-ui-nextjs"
  exit 1
fi

pwd
echo "Listing contents of " && pwd
ls -la
npm i
npm run dev &
NEXTJS_PID=$!

# Wait for Next.js to be up
wait_for_service http://localhost:3000

# Run pytest
cd /app
export PYTHONPATH=.
pytest tests/ -v

# Stop services
kill $FASTAPI_PID
kill $NEXTJS_PID
