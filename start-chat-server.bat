@echo off
echo 🚀 NaviFlow Live Chat Server Starting...
echo.
echo 💬 This will enable LIVE chat for your demo launch!
echo 📱 Demo users will be able to chat directly with you
echo 🔗 Admin interface will be available at http://localhost:3001/admin
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo 📥 Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm packages are installed
if not exist node_modules (
    echo 📦 Installing required packages...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install packages
        pause
        exit /b 1
    )
)

echo ✅ Starting NaviFlow Live Chat Server...
echo.
echo 🎯 DEMO LAUNCH MODE ACTIVATED
echo 💬 Demo users can now chat with you LIVE!
echo 📊 Admin dashboard: http://localhost:3001/admin
echo.
echo Press Ctrl+C to stop the server
echo.

node live-chat-server.js
pause