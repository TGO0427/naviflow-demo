// 📱 WhatsApp Integration Configuration
// Replace these values with your actual API credentials

window.WhatsAppConfig = {
    // Option 1: Meta WhatsApp Business API (Recommended)
    meta: {
        phoneNumberId: 'YOUR_PHONE_NUMBER_ID', // Get from Facebook Business Manager
        accessToken: 'YOUR_ACCESS_TOKEN',       // Get from Facebook App
        apiUrl: 'https://graph.facebook.com/v17.0'
    },
    
    // Option 2: Twilio WhatsApp API (Easy Setup)
    twilio: {
        accountSid: 'YOUR_TWILIO_ACCOUNT_SID',
        authToken: 'YOUR_TWILIO_AUTH_TOKEN',
        fromNumber: 'whatsapp:+14155238886', // Twilio sandbox number
        apiUrl: 'https://api.twilio.com/2010-04-01'
    },
    
    // Option 3: ChatAPI.com (Third-party)
    chatapi: {
        instanceId: 'instance123456',
        token: 'YOUR_CHATAPI_TOKEN',
        apiUrl: 'https://api.chat-api.com'
    },
    
    // Default settings
    settings: {
        retryAttempts: 3,
        retryDelay: 2000, // 2 seconds
        enableFailover: true,
        logFailedMessages: true
    }
};

// Quick Setup Instructions:
console.log(`
📱 WhatsApp Setup Instructions:

1. FASTEST (ChatAPI.com):
   - Go to chat-api.com
   - Scan QR code with your phone
   - Copy instance ID and token
   - Update chatapi config above

2. BUSINESS (Meta WhatsApp Business API):
   - Create Facebook Business Account
   - Set up WhatsApp Business API
   - Get Phone Number ID and Access Token
   - Update meta config above

3. DEVELOPER (Twilio):
   - Create Twilio account
   - Enable WhatsApp in console
   - Get Account SID and Auth Token
   - Update twilio config above

4. Test with your phone:
   - Add your number: +27123456789
   - Run the alert system
   - Receive actual WhatsApp messages!
`);