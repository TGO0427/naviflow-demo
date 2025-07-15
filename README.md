# 🚀 NaviFlow E-Commerce Shield Demo

**Weather-Intelligent Supply Chain Management for E-Commerce Sellers**

> *"Stop drowning in 'Where's my order?' emails. Auto-notify customers about weather delays before they contact you."*

## 🌟 Live Demo

**[🔗 View Live Demo](https://your-username.github.io/naviflow-demo)** *(Link will be updated after deployment)*

## 🎯 What is NaviFlow?

NaviFlow is a comprehensive e-commerce protection system that uses **weather intelligence** to automatically notify customers about shipping delays before they contact you. Protect your seller metrics, reduce customer service costs, and build customer trust with professional, branded notifications.

## ✨ Key Features

### 🌤️ **Weather Intelligence**
- Real-time weather monitoring across 23 major cargo airports
- Predictive delay alerts based on weather conditions
- Automated customer notifications before delays impact delivery

### 📱 **Professional Customer Notifications**
- **Email**: Branded weather delay alerts that look like Amazon
- **SMS**: Instant text notifications with tracking updates
- **WhatsApp**: Professional business messaging
- **Multi-channel**: Reach customers on their preferred platform

### 🛡️ **E-Commerce Protection**
- **Amazon/eBay Shield**: Auto-generate weather delay documentation for marketplace disputes
- **Review Protection**: Proactive communication prevents bad reviews
- **Seller Metrics**: Protect your performance ratings from weather-related delays

### 🔗 **Platform Integrations**
- **Shopify**: Direct API sync with real-time webhooks
- **WooCommerce**: Complete order management integration
- **Amazon FBA**: Seller Central API connections
- **Custom APIs**: Flexible integration options

## 🚀 Demo Features

### 📊 **Air Freight Intelligence**
- Track 89+ active shipments in real-time
- Weather impact analysis for aviation routes
- Automated customer notifications

### 🚢 **Sea Freight Intelligence**
- Monitor 127+ active containers across global routes
- Storm tracking and port delay alerts
- Major shipping line integration (MSC, MAERSK, EVERGREEN)

### 💬 **Live Chat Support**
- Real-time chat with founder Tino
- Instant demo support and questions
- WebSocket-powered messaging

## 🎮 How to Use the Demo

1. **Start Here**: Open `index.html` or click the live demo link
2. **Login**: Use Demo Mode or Guest Access
3. **Explore Features**:
   - Click "📦 Load Sample Orders" to see shipment tracking
   - Try the API connections (Shopify, WooCommerce, Amazon)
   - Test customer notifications
   - Chat with live support

## 🚀 How to View and Run the Application

### Method 1: Node.js Server (Recommended)
```bash
# Quick start
npm run serve

# Or use the startup script
./start-app.sh

# Or manually
node server.js
```

### Method 2: NPM Scripts
```bash
# Build environment first
npm run build

# Start the server
npm start
```

### Method 3: Python HTTP Server
```bash
# Using Python 3
python3 -m http.server 8080

# Using Python 2
python -m SimpleHTTPServer 8080
```

## 🌐 Access URLs

Once the server is running, access these URLs:

- **Main Application**: `http://localhost:3001/`
- **Weather API Test**: `http://localhost:3001/test-weather-api.html`
- **Security Report**: `http://localhost:3001/security-test-report.json`
- **Weather Report**: `http://localhost:3001/weather-api-test-report.json`

## 🔧 Configuration

### 1. API Keys Setup
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual API keys
nano .env
```

### 2. Required API Keys
- **OpenAI API Key**: For AI-powered cargo classification
- **Google API Key**: For Firebase and Maps integration
- **Weather API**: Open-Meteo (free, no key required)
- **WhatsApp API**: Optional for notifications
- **Shipping APIs**: Optional for enhanced tracking

### 3. Build Configuration
```bash
# Build environment configuration
npm run build
```

## 🎯 Features Available

### ✅ Currently Working
- **Real-time Weather Data** - Live marine weather from Open-Meteo API
- **Advanced Cargo Tracking** - Shipment monitoring and status updates
- **Security Framework** - Comprehensive security configuration
- **Aviation Data** - Live flight schedules and cargo capacity
- **Route Analysis** - Weather-aware route optimization

### 🔧 Requires Configuration
- **OpenAI Integration** - Set `OPENAI_API_KEY` in .env
- **WhatsApp Notifications** - Configure WhatsApp provider in .env
- **Google Services** - Set `GOOGLE_API_KEY` for full functionality

## 🧪 Testing

### Weather API Test
```bash
# Test weather integration
open http://localhost:3001/test-weather-api.html
```

### Security Test
```bash
# Run security tests
node test-security.js
```

### Weather API Test (Node.js)
```bash
# Test weather API directly
node test-weather-node.js
```

## 📱 Application Sections

1. **Dashboard** - Overview of all cargo operations
2. **Live Tracking** - Real-time shipment monitoring
3. **Weather Center** - Marine weather analysis
4. **Flight Schedules** - Live air cargo flights
5. **Analytics** - Performance metrics and insights
6. **Alerts** - Real-time notifications and warnings

## 🛠️ Development

### File Structure
```
air-freight-app/
├── air-freight-app.html          # Main application
├── server.js                     # Node.js server
├── aviation-config.js            # Aviation data configuration
├── aviation-provider.js          # Flight data provider
├── weather-api-service.js        # Weather API integration
├── cargo-tracking-system.js      # Cargo tracking system
├── security-config.js            # Security framework
├── env.js                        # Environment variables
├── test-weather-api.html         # Weather testing interface
├── test-security.js              # Security test suite
└── package.json                  # Dependencies
```

### Adding New Features
1. Create new JavaScript modules in the root directory
2. Include them in `air-freight-app.html`
3. Update `server.js` if needed for new routes
4. Add tests in appropriate test files

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Try a different port
PORT=3002 node server.js

# Or use the script which finds available ports
./start-app.sh
```

### Missing Dependencies
```bash
# Install dependencies
npm install

# Or install specific packages
npm install express
```

### API Keys Not Working
1. Check `.env` file exists and has correct keys
2. Run `npm run build` to regenerate `env.js`
3. Restart the server
4. Check browser console for errors

## 📊 Performance

- **Security Score**: 67%
- **Weather API**: 100% functional
- **Cargo Tracking**: Real-time updates
- **Aviation Data**: 50+ airlines, 40+ airports

## 🔒 Security

- Environment variable protection
- API key security
- Input validation
- CORS configuration
- Security headers

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Review security and weather test reports
3. Verify API key configuration
4. Check server logs for error messages

---

**Version**: 1.0.0  
**Last Updated**: ${new Date().toISOString().split('T')[0]}  
**Status**: ✅ Production Ready