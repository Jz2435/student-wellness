#!/bin/bash

echo "Testing backend connection..."
echo ""

# Test if backend is running
BACKEND_URL="http://localhost:8001"

echo "Checking if backend is running at $BACKEND_URL..."
response=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL)

if [ $response -eq 200 ]; then
    echo "✓ Backend is running and accessible!"
    echo ""
    echo "Backend response:"
    curl -s $BACKEND_URL | jq .
    echo ""
else
    echo "✗ Backend is not accessible (HTTP $response)"
    echo ""
    echo "Please start the backend with:"
    echo "  cd backend"
    echo "  uvicorn main:app --reload --host 0.0.0.0 --port 8001"
    echo ""
    exit 1
fi

echo "Testing /test endpoint..."
curl -s $BACKEND_URL/test | jq .
echo ""

echo "All tests passed! Backend is ready."
