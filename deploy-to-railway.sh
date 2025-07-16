#!/bin/bash

# NaviFlow Chat Server - Railway Deployment Script
echo "🚀 Deploying NaviFlow Chat Server to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "🔑 Logging in to Railway..."
railway login

# Create new project
echo "📦 Creating new Railway project..."
railway new

# Deploy the application
echo "🚀 Deploying to Railway..."
railway up

# Get the deployment URL
echo "🔗 Getting deployment URL..."
railway status

echo "✅ Deployment complete!"
echo "📱 Your admin interface will be available at: https://your-app-name.railway.app/admin"
echo "🔧 Don't forget to update the WebSocket URL in your code!"