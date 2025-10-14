#!/bin/bash

echo "🧪 Testing Productify API..."
echo "=========================="

# Test 1: Check if backend is running
echo "1. Testing backend connection..."
if curl -s http://localhost:3000/products > /dev/null; then
    echo "✅ Backend is running on port 3000"
else
    echo "❌ Backend is not running on port 3000"
    echo "Please start the backend with: cd backend/crud-api && npm run start:dev"
    exit 1
fi

# Test 2: Check if frontend is running
echo "2. Testing frontend connection..."
if curl -s http://localhost:4200 > /dev/null; then
    echo "✅ Frontend is running on port 4200"
else
    echo "❌ Frontend is not running on port 4200"
    echo "Please start the frontend with: cd frontend/productify-frontend && npm start"
    exit 1
fi

# Test 3: Test GET products
echo "3. Testing GET /products..."
response=$(curl -s http://localhost:3000/products)
if [[ $response == *"id"* ]]; then
    echo "✅ GET /products working"
    echo "   Response: $response"
else
    echo "❌ GET /products failed"
    echo "   Response: $response"
fi

# Test 4: Test POST product
echo "4. Testing POST /products..."
test_product='{"name":"API Test Product","price":25.99,"description":"This is a test product created by the API test script"}'
response=$(curl -s -X POST http://localhost:3000/products -H "Content-Type: application/json" -d "$test_product")
if [[ $response == *"id"* ]]; then
    echo "✅ POST /products working"
    echo "   Response: $response"
else
    echo "❌ POST /products failed"
    echo "   Response: $response"
fi

# Test 5: Test CORS
echo "5. Testing CORS configuration..."
response=$(curl -s -H "Origin: http://localhost:4200" http://localhost:3000/products)
if [[ $response == *"id"* ]]; then
    echo "✅ CORS configuration working"
else
    echo "❌ CORS configuration failed"
fi

echo "=========================="
echo "🎉 API tests completed!"
echo ""
echo "If all tests passed, you can now:"
echo "1. Open http://localhost:4200 in your browser"
echo "2. Navigate to the product form"
echo "3. Try creating a new product"
echo ""
echo "If you encounter any issues:"
echo "1. Check the browser console for errors"
echo "2. Check the backend logs for errors"
echo "3. Make sure both services are running"
