#!/bin/bash

# Air Freight Application Startup Script
echo "🚀 Starting Air Freight Application..."
echo "=" $(printf '=%.0s' {1..50})

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to run the application."
    exit 1
fi

# Build environment configuration
echo "🔧 Building environment configuration..."
npm run build

# Find available port
PORT=3001
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; do
    ((PORT++))
done

echo "📡 Starting server on port $PORT..."
echo "🌐 Access your application at: http://localhost:$PORT"
echo "🧪 Weather API Test: http://localhost:$PORT/test-weather-api.html"
echo ""
echo "💡 Tips:"
echo "   • Make sure to configure your API keys in .env file"
echo "   • Use Ctrl+C to stop the server"
echo "   • Check the console for any errors"
echo ""

# Start the server
PORT=$PORT node server.js