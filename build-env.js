// Build script to generate env.js with environment variables
import fs from 'fs';
import path from 'path';

// Load .env file if it exists
function loadEnvFile() {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf8');
        const envVars = {};
        
        envFile.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value && !key.startsWith('#') && !key.startsWith(' ')) {
                envVars[key.trim()] = value.trim();
            }
        });
        
        // Merge with process.env
        Object.assign(process.env, envVars);
        console.log('✅ Loaded .env file');
    } else {
        console.log('⚠️  No .env file found, using defaults');
    }
}

// Load environment variables
loadEnvFile();

// Generate client-side environment configuration
const envContent = `// Environment variables for client-side usage
// SECURITY NOTE: In production, use server-side proxy for sensitive API keys
window.ENV = {
    // AI & Intelligence APIs
    OPENAI_API_KEY: '${process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY'}',
    GOOGLE_API_KEY: '${process.env.GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY'}',
    
    // Shipping & Logistics APIs
    AISHUB_USERNAME: '${process.env.AISHUB_USERNAME || 'YOUR_AISHUB_USERNAME'}',
    DATALASTIC_API_KEY: '${process.env.DATALASTIC_API_KEY || 'YOUR_DATALASTIC_API_KEY'}',
    SEARATES_API_KEY: '${process.env.SEARATES_API_KEY || 'YOUR_SEARATES_API_KEY'}',
    
    // Weather APIs (Open-Meteo is free, no key needed)
    WEATHER_API_ENABLED: ${process.env.WEATHER_API_ENABLED || 'true'},
    WEATHER_API_PROVIDER: '${process.env.WEATHER_API_PROVIDER || 'open-meteo'}',
    
    // WhatsApp Integration APIs
    WHATSAPP_PROVIDER: '${process.env.WHATSAPP_PROVIDER || 'none'}', // 'meta', 'twilio', 'chatapi', or 'none'
    META_ACCESS_TOKEN: '${process.env.META_ACCESS_TOKEN || 'YOUR_META_ACCESS_TOKEN'}',
    META_PHONE_NUMBER_ID: '${process.env.META_PHONE_NUMBER_ID || 'YOUR_PHONE_NUMBER_ID'}',
    TWILIO_ACCOUNT_SID: '${process.env.TWILIO_ACCOUNT_SID || 'YOUR_TWILIO_ACCOUNT_SID'}',
    TWILIO_AUTH_TOKEN: '${process.env.TWILIO_AUTH_TOKEN || 'YOUR_TWILIO_AUTH_TOKEN'}',
    CHATAPI_INSTANCE_ID: '${process.env.CHATAPI_INSTANCE_ID || 'YOUR_CHATAPI_INSTANCE_ID'}',
    CHATAPI_TOKEN: '${process.env.CHATAPI_TOKEN || 'YOUR_CHATAPI_TOKEN'}',
    
    // Application Settings
    APP_VERSION: '${process.env.APP_VERSION || '1.0.0'}',
    DEBUG_MODE: ${process.env.DEBUG_MODE || 'true'},
    CACHE_DURATION: ${process.env.CACHE_DURATION || '600000'}, // 10 minutes
    API_TIMEOUT: ${process.env.API_TIMEOUT || '30000'}, // 30 seconds
    RATE_LIMIT_ENABLED: ${process.env.RATE_LIMIT_ENABLED || 'true'},
    
    // Security Settings
    ENABLE_API_KEY_VALIDATION: ${process.env.ENABLE_API_KEY_VALIDATION || 'true'},
    ALLOW_DEMO_MODE: ${process.env.ALLOW_DEMO_MODE || 'true'}, // Use fallback data when APIs unavailable
    LOG_API_CALLS: ${process.env.LOG_API_CALLS || 'false'} // Set to false in production
};

// API Status Checker
window.ENV.checkAPIStatus = function() {
    const status = {
        openai: this.OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY',
        aishub: this.AISHUB_USERNAME !== 'YOUR_AISHUB_USERNAME',
        datalastic: this.DATALASTIC_API_KEY !== 'YOUR_DATALASTIC_API_KEY',
        searates: this.SEARATES_API_KEY !== 'YOUR_SEARATES_API_KEY',
        weather: this.WEATHER_API_ENABLED,
        whatsapp: this.WHATSAPP_PROVIDER !== 'none'
    };
    
    const configured = Object.values(status).filter(Boolean).length;
    const total = Object.keys(status).length;
    
    return {
        ...status,
        configuredCount: configured,
        totalAPIs: total,
        configurationComplete: configured === total,
        summary: \`\${configured}/\${total} APIs configured\`
    };
};

// Initialize API status check
if (window.ENV.DEBUG_MODE) {
    console.log('🔧 Environment Configuration Loaded');
    console.log('📊 API Status:', window.ENV.checkAPIStatus());
}`;

// Write the generated environment file
fs.writeFileSync('env.js', envContent);

// Check API configuration status
const apiStatus = {
    openai: (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY'),
    aishub: (process.env.AISHUB_USERNAME && process.env.AISHUB_USERNAME !== 'YOUR_AISHUB_USERNAME'),
    datalastic: (process.env.DATALASTIC_API_KEY && process.env.DATALASTIC_API_KEY !== 'YOUR_DATALASTIC_API_KEY'),
    searates: (process.env.SEARATES_API_KEY && process.env.SEARATES_API_KEY !== 'YOUR_SEARATES_API_KEY'),
    weather: (process.env.WEATHER_API_ENABLED !== 'false'),
    whatsapp: (process.env.WHATSAPP_PROVIDER && process.env.WHATSAPP_PROVIDER !== 'none')
};

const configuredAPIs = Object.values(apiStatus).filter(Boolean).length;
const totalAPIs = Object.keys(apiStatus).length;

console.log('🚀 Generated env.js with environment variables');
console.log(`📊 API Configuration Status: ${configuredAPIs}/${totalAPIs} APIs configured`);

if (configuredAPIs === 0) {
    console.log('⚠️  No APIs configured - using demo mode');
    console.log('💡 Copy .env.example to .env and add your API keys');
} else if (configuredAPIs < totalAPIs) {
    console.log('🔧 Partial configuration - some APIs will use fallback data');
} else {
    console.log('✅ All APIs configured - ready for production!');
}

// Show which APIs are configured
console.log('\n📋 API Status:');
Object.entries(apiStatus).forEach(([api, configured]) => {
    console.log(`   ${configured ? '✅' : '❌'} ${api.toUpperCase()}`);
});

if (process.env.DEBUG_MODE === 'true') {
    console.log('\n🐛 Debug mode enabled - detailed logging active');
}