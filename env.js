// Environment variables for client-side usage
// SECURITY NOTE: In production, use server-side proxy for sensitive API keys
window.ENV = {
    // AI & Intelligence APIs
    OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY',
    GOOGLE_API_KEY: 'YOUR_GOOGLE_API_KEY',
    
    // Shipping & Logistics APIs
    AISHUB_USERNAME: 'YOUR_AISHUB_USERNAME',
    DATALASTIC_API_KEY: 'YOUR_DATALASTIC_API_KEY',
    SEARATES_API_KEY: 'YOUR_SEARATES_API_KEY',
    
    // Weather APIs (Open-Meteo is free, no key needed)
    WEATHER_API_ENABLED: true,
    WEATHER_API_PROVIDER: 'open-meteo',
    
    // WhatsApp Integration APIs
    WHATSAPP_PROVIDER: 'none', // 'meta', 'twilio', 'chatapi', or 'none'
    META_ACCESS_TOKEN: 'YOUR_META_ACCESS_TOKEN',
    META_PHONE_NUMBER_ID: 'YOUR_PHONE_NUMBER_ID',
    TWILIO_ACCOUNT_SID: 'YOUR_TWILIO_ACCOUNT_SID',
    TWILIO_AUTH_TOKEN: 'YOUR_TWILIO_AUTH_TOKEN',
    CHATAPI_INSTANCE_ID: 'YOUR_CHATAPI_INSTANCE_ID',
    CHATAPI_TOKEN: 'YOUR_CHATAPI_TOKEN',
    
    // Application Settings
    APP_VERSION: '1.0.0',
    DEBUG_MODE: true,
    CACHE_DURATION: 600000, // 10 minutes
    API_TIMEOUT: 30000, // 30 seconds
    RATE_LIMIT_ENABLED: true,
    
    // Security Settings
    ENABLE_API_KEY_VALIDATION: true,
    ALLOW_DEMO_MODE: true, // Use fallback data when APIs unavailable
    LOG_API_CALLS: false // Set to false in production
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
        summary: `${configured}/${total} APIs configured`
    };
};

// Initialize API status check
if (window.ENV.DEBUG_MODE) {
    console.log('🔧 Environment Configuration Loaded');
    console.log('📊 API Status:', window.ENV.checkAPIStatus());
}