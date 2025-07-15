// NaviFlow Live Chat Server
// Real-time chat system for demo launch
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

class LiveChatServer {
    constructor() {
        this.port = 3001;
        this.clients = new Map();
        this.adminClients = new Set();
        this.chatHistory = [];
        this.init();
    }

    init() {
        // Create HTTP server for admin interface
        this.httpServer = http.createServer((req, res) => {
            if (req.url === '/admin' || req.url === '/admin/') {
                this.serveAdminInterface(res);
            } else if (req.url === '/admin/chat.js') {
                this.serveAdminScript(res);
            } else {
                res.writeHead(404);
                res.end('Not Found');
            }
        });

        // Create WebSocket server
        this.wss = new WebSocket.Server({ server: this.httpServer });
        
        this.wss.on('connection', (ws, req) => {
            console.log('🔗 New connection established');
            
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleMessage(ws, data);
                } catch (error) {
                    console.error('❌ Invalid message format:', error);
                }
            });

            ws.on('close', () => {
                this.handleDisconnect(ws);
            });

            ws.on('error', (error) => {
                console.error('❌ WebSocket error:', error);
            });
        });

        this.httpServer.listen(this.port, () => {
            console.log(`🚀 NaviFlow Live Chat Server running on port ${this.port}`);
            console.log(`📱 Admin interface: http://localhost:${this.port}/admin`);
            console.log(`🎯 Demo users will connect automatically via the app`);
        });
    }

    handleMessage(ws, data) {
        switch (data.type) {
            case 'register':
                this.registerClient(ws, data);
                break;
            case 'message':
                this.handleChatMessage(ws, data);
                break;
            case 'admin_join':
                this.registerAdmin(ws, data);
                break;
            case 'typing':
                this.handleTyping(ws, data);
                break;
            case 'get_history':
                this.sendChatHistory(ws);
                break;
        }
    }

    registerClient(ws, data) {
        const clientId = this.generateClientId();
        const clientInfo = {
            id: clientId,
            ws: ws,
            name: data.name || 'Demo User',
            email: data.email || 'demo@naviflow.com',
            joinTime: new Date().toISOString(),
            lastSeen: new Date().toISOString(),
            isOnline: true
        };

        this.clients.set(clientId, clientInfo);
        ws.clientId = clientId;
        ws.clientType = 'user';

        // Send welcome message
        this.sendToClient(ws, {
            type: 'registered',
            clientId: clientId,
            message: 'Connected to NaviFlow support. How can I help you today?'
        });

        // Notify admin of new user
        this.notifyAdmins({
            type: 'user_joined',
            client: {
                id: clientId,
                name: clientInfo.name,
                email: clientInfo.email,
                joinTime: clientInfo.joinTime
            }
        });

        console.log(`👤 New user registered: ${clientInfo.name} (${clientId})`);
    }

    registerAdmin(ws, data) {
        ws.clientType = 'admin';
        ws.adminName = data.name || 'Tino';
        this.adminClients.add(ws);

        // Send current users list
        const usersList = Array.from(this.clients.values()).map(client => ({
            id: client.id,
            name: client.name,
            email: client.email,
            joinTime: client.joinTime,
            isOnline: client.isOnline
        }));

        this.sendToClient(ws, {
            type: 'admin_registered',
            users: usersList,
            totalUsers: usersList.length
        });

        console.log(`👨‍💼 Admin connected: ${ws.adminName}`);
    }

    handleChatMessage(ws, data) {
        const timestamp = new Date().toISOString();
        const message = {
            id: this.generateMessageId(),
            clientId: ws.clientId || 'admin',
            sender: ws.clientType === 'admin' ? ws.adminName : this.clients.get(ws.clientId)?.name,
            content: data.content,
            timestamp: timestamp,
            type: 'message'
        };

        // Store in history
        this.chatHistory.push(message);

        // Keep only last 100 messages
        if (this.chatHistory.length > 100) {
            this.chatHistory = this.chatHistory.slice(-100);
        }

        if (ws.clientType === 'admin') {
            // Admin sending message to user
            const targetClient = this.clients.get(data.targetClientId);
            if (targetClient && targetClient.ws.readyState === WebSocket.OPEN) {
                this.sendToClient(targetClient.ws, {
                    type: 'message',
                    sender: ws.adminName,
                    content: data.content,
                    timestamp: timestamp,
                    isAdmin: true
                });
            }

            // Confirm to admin
            this.sendToClient(ws, {
                type: 'message_sent',
                messageId: message.id,
                targetClientId: data.targetClientId
            });
        } else {
            // User sending message to admin
            this.notifyAdmins({
                type: 'message',
                clientId: ws.clientId,
                sender: this.clients.get(ws.clientId)?.name,
                content: data.content,
                timestamp: timestamp
            });
        }

        console.log(`💬 Message from ${message.sender}: ${data.content}`);
    }

    handleTyping(ws, data) {
        if (ws.clientType === 'admin') {
            // Admin typing to user
            const targetClient = this.clients.get(data.targetClientId);
            if (targetClient && targetClient.ws.readyState === WebSocket.OPEN) {
                this.sendToClient(targetClient.ws, {
                    type: 'typing',
                    isTyping: data.isTyping,
                    sender: ws.adminName
                });
            }
        } else {
            // User typing to admin
            this.notifyAdmins({
                type: 'typing',
                clientId: ws.clientId,
                sender: this.clients.get(ws.clientId)?.name,
                isTyping: data.isTyping
            });
        }
    }

    handleDisconnect(ws) {
        if (ws.clientType === 'admin') {
            this.adminClients.delete(ws);
            console.log(`👨‍💼 Admin disconnected: ${ws.adminName}`);
        } else if (ws.clientId) {
            const client = this.clients.get(ws.clientId);
            if (client) {
                client.isOnline = false;
                client.lastSeen = new Date().toISOString();
                
                // Notify admin
                this.notifyAdmins({
                    type: 'user_left',
                    clientId: ws.clientId,
                    name: client.name
                });
                
                console.log(`👤 User disconnected: ${client.name} (${ws.clientId})`);
            }
        }
    }

    sendToClient(ws, data) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    }

    notifyAdmins(data) {
        this.adminClients.forEach(adminWs => {
            if (adminWs.readyState === WebSocket.OPEN) {
                this.sendToClient(adminWs, data);
            }
        });
    }

    generateClientId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateMessageId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    serveAdminInterface(res) {
        const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NaviFlow Live Chat Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .message-bubble {
            animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .typing-indicator {
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    </style>
</head>
<body class="bg-gray-100">
    <div class="min-h-screen flex">
        <!-- Users List -->
        <div class="w-1/3 bg-white border-r border-gray-200">
            <div class="p-4 border-b border-gray-200 bg-blue-600 text-white">
                <h2 class="text-lg font-semibold">📱 NaviFlow Live Chat</h2>
                <p class="text-sm text-blue-100">Admin Dashboard</p>
            </div>
            <div class="p-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold text-gray-800">Active Users</h3>
                    <span id="userCount" class="bg-green-500 text-white px-2 py-1 rounded-full text-xs">0</span>
                </div>
                <div id="usersList" class="space-y-2">
                    <!-- Users will be populated here -->
                </div>
            </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 flex flex-col">
            <!-- Chat Header -->
            <div class="p-4 border-b border-gray-200 bg-white">
                <div id="chatHeader" class="flex items-center">
                    <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        👤
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-800">Select a user to chat</h3>
                        <p class="text-sm text-gray-500">Choose from the users list</p>
                    </div>
                </div>
            </div>

            <!-- Messages Area -->
            <div class="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div id="messagesContainer" class="space-y-4">
                    <div class="text-center text-gray-500 text-sm py-8">
                        Select a user to start chatting
                    </div>
                </div>
            </div>

            <!-- Message Input -->
            <div class="p-4 bg-white border-t border-gray-200">
                <div class="flex items-center space-x-2">
                    <input
                        type="text"
                        id="messageInput"
                        placeholder="Type your message..."
                        class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        disabled
                    >
                    <button
                        id="sendButton"
                        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        disabled
                    >
                        Send
                    </button>
                </div>
                <div id="typingIndicator" class="text-sm text-gray-500 mt-2 hidden">
                    <span class="typing-indicator">User is typing...</span>
                </div>
            </div>
        </div>
    </div>

    <script src="/admin/chat.js"></script>
</body>
</html>
        `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(adminHtml);
    }

    serveAdminScript(res) {
        const adminScript = `
let ws = null;
let currentUser = null;
let users = new Map();

// Initialize WebSocket connection
function initializeWebSocket() {
    ws = new WebSocket('ws://localhost:3001');
    
    ws.onopen = function() {
        console.log('🔗 Connected to chat server');
        // Register as admin
        ws.send(JSON.stringify({
            type: 'admin_join',
            name: 'Tino'
        }));
    };

    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        handleMessage(data);
    };

    ws.onclose = function() {
        console.log('❌ Disconnected from chat server');
        setTimeout(initializeWebSocket, 3000); // Reconnect after 3 seconds
    };

    ws.onerror = function(error) {
        console.error('❌ WebSocket error:', error);
    };
}

function handleMessage(data) {
    switch(data.type) {
        case 'admin_registered':
            updateUsersList(data.users);
            break;
        case 'user_joined':
            addUser(data.client);
            showNotification('👤 New user joined: ' + data.client.name);
            break;
        case 'user_left':
            removeUser(data.clientId);
            break;
        case 'message':
            displayMessage(data);
            showNotification('💬 New message from ' + data.sender);
            break;
        case 'typing':
            showTypingIndicator(data.isTyping, data.sender);
            break;
    }
}

function updateUsersList(usersList) {
    const container = document.getElementById('usersList');
    const userCount = document.getElementById('userCount');
    
    users.clear();
    container.innerHTML = '';
    
    usersList.forEach(user => {
        users.set(user.id, user);
        addUserToList(user);
    });
    
    userCount.textContent = usersList.length;
}

function addUser(user) {
    users.set(user.id, user);
    addUserToList(user);
    document.getElementById('userCount').textContent = users.size;
}

function removeUser(userId) {
    users.delete(userId);
    document.getElementById('user-' + userId)?.remove();
    document.getElementById('userCount').textContent = users.size;
}

function addUserToList(user) {
    const container = document.getElementById('usersList');
    const userElement = document.createElement('div');
    userElement.id = 'user-' + user.id;
    userElement.className = 'p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors';
    userElement.innerHTML = \`
        <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                \${user.name.charAt(0).toUpperCase()}
            </div>
            <div class="flex-1">
                <h4 class="font-semibold text-gray-800">\${user.name}</h4>
                <p class="text-xs text-gray-500">\${user.email}</p>
                <p class="text-xs text-green-600">Online</p>
            </div>
        </div>
    \`;
    
    userElement.addEventListener('click', () => selectUser(user));
    container.appendChild(userElement);
}

function selectUser(user) {
    currentUser = user;
    
    // Update header
    document.getElementById('chatHeader').innerHTML = \`
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
            \${user.name.charAt(0).toUpperCase()}
        </div>
        <div>
            <h3 class="font-semibold text-gray-800">\${user.name}</h3>
            <p class="text-sm text-gray-500">\${user.email}</p>
        </div>
    \`;
    
    // Clear messages
    document.getElementById('messagesContainer').innerHTML = '';
    
    // Enable input
    document.getElementById('messageInput').disabled = false;
    document.getElementById('sendButton').disabled = false;
    document.getElementById('messageInput').focus();
    
    // Highlight selected user
    document.querySelectorAll('#usersList > div').forEach(el => {
        el.classList.remove('bg-blue-100', 'border-blue-300');
    });
    document.getElementById('user-' + user.id).classList.add('bg-blue-100', 'border-blue-300');
}

function displayMessage(data) {
    const container = document.getElementById('messagesContainer');
    const messageElement = document.createElement('div');
    messageElement.className = 'message-bubble';
    
    const isFromCurrentUser = data.clientId === currentUser?.id;
    const isAdmin = data.sender === 'Tino';
    
    if (isAdmin) {
        messageElement.innerHTML = \`
            <div class="flex justify-end">
                <div class="bg-blue-600 text-white px-4 py-2 rounded-lg max-w-xs">
                    <p>\${data.content}</p>
                    <p class="text-xs text-blue-100 mt-1">\${new Date(data.timestamp).toLocaleTimeString()}</p>
                </div>
            </div>
        \`;
    } else {
        messageElement.innerHTML = \`
            <div class="flex justify-start">
                <div class="bg-white border px-4 py-2 rounded-lg max-w-xs">
                    <p class="text-sm font-semibold text-gray-800">\${data.sender}</p>
                    <p>\${data.content}</p>
                    <p class="text-xs text-gray-500 mt-1">\${new Date(data.timestamp).toLocaleTimeString()}</p>
                </div>
            </div>
        \`;
    }
    
    container.appendChild(messageElement);
    container.scrollTop = container.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message && currentUser && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'message',
            content: message,
            targetClientId: currentUser.id
        }));
        
        // Display message immediately
        displayMessage({
            sender: 'Tino',
            content: message,
            timestamp: new Date().toISOString(),
            isAdmin: true
        });
        
        input.value = '';
    }
}

function showTypingIndicator(isTyping, sender) {
    const indicator = document.getElementById('typingIndicator');
    if (isTyping) {
        indicator.textContent = sender + ' is typing...';
        indicator.classList.remove('hidden');
    } else {
        indicator.classList.add('hidden');
    }
}

function showNotification(message) {
    // Simple notification - you can enhance this
    if (Notification.permission === 'granted') {
        new Notification('NaviFlow Chat', { body: message });
    }
}

// Event listeners
document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Request notification permission
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

// Initialize connection
initializeWebSocket();
        `;

        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(adminScript);
    }
}

// Start the server
new LiveChatServer();