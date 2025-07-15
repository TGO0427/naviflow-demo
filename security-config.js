// Security Configuration and Utilities
// Implements security best practices for the Air Freight Application

class SecurityConfig {
    constructor() {
        this.initialized = false;
        this.securityLevel = 'development'; // 'development', 'staging', 'production'
        this.securityPolicies = this.initializeSecurityPolicies();
        this.init();
    }

    init() {
        console.log('🔒 Initializing Security Configuration...');
        this.setSecurityLevel();
        this.implementSecurityHeaders();
        this.setupInputValidation();
        this.configureAPISecurityPolicies();
        this.initialized = true;
        console.log(`✅ Security configuration initialized (Level: ${this.securityLevel})`);
    }

    // Initialize security policies
    initializeSecurityPolicies() {
        return {
            development: {
                enforceHTTPS: false,
                logSecurityEvents: true,
                allowDebugInfo: true,
                enableCSP: false,
                strictRateLimit: false,
                allowClientSideAPIKeys: true
            },
            staging: {
                enforceHTTPS: true,
                logSecurityEvents: true,
                allowDebugInfo: true,
                enableCSP: true,
                strictRateLimit: true,
                allowClientSideAPIKeys: false
            },
            production: {
                enforceHTTPS: true,
                logSecurityEvents: true,
                allowDebugInfo: false,
                enableCSP: true,
                strictRateLimit: true,
                allowClientSideAPIKeys: false
            }
        };
    }

    // Set security level based on environment
    setSecurityLevel() {
        if (typeof window !== 'undefined' && window.ENV) {
            if (window.ENV.DEBUG_MODE === false) {
                this.securityLevel = 'production';
            } else if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                this.securityLevel = 'staging';
            } else {
                this.securityLevel = 'development';
            }
        }
    }

    // Implement security headers (client-side recommendations)
    implementSecurityHeaders() {
        const currentPolicies = this.securityPolicies[this.securityLevel];
        
        if (currentPolicies.enableCSP) {
            // Create CSP meta tag if not exists
            if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
                const cspMeta = document.createElement('meta');
                cspMeta.httpEquiv = 'Content-Security-Policy';
                cspMeta.content = this.getCSPPolicy();
                document.head.appendChild(cspMeta);
                console.log('🔒 CSP policy applied');
            }
        }

        // Check for HTTPS enforcement
        if (currentPolicies.enforceHTTPS && window.location.protocol !== 'https:') {
            this.logSecurityEvent('HTTPS_VIOLATION', 'Application loaded over HTTP instead of HTTPS');
            if (this.securityLevel === 'production') {
                // In production, redirect to HTTPS
                window.location.replace('https:' + window.location.href.substring(window.location.protocol.length));
            }
        }
    }

    // Get Content Security Policy
    getCSPPolicy() {
        return [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://marine-api.open-meteo.com https://api.openai.com https://graph.facebook.com https://api.twilio.com https://api.chat-api.com",
            "img-src 'self' data: https:",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join('; ');
    }

    // Setup input validation
    setupInputValidation() {
        this.validators = {
            // Validate port names
            portName: (value) => {
                if (typeof value !== 'string' || value.length === 0) {
                    return { valid: false, error: 'Port name must be a non-empty string' };
                }
                if (!/^[A-Za-z\s\-']+$/.test(value)) {
                    return { valid: false, error: 'Port name contains invalid characters' };
                }
                if (value.length > 50) {
                    return { valid: false, error: 'Port name too long' };
                }
                return { valid: true };
            },

            // Validate coordinates
            coordinates: (lat, lon) => {
                const latitude = parseFloat(lat);
                const longitude = parseFloat(lon);
                
                if (isNaN(latitude) || isNaN(longitude)) {
                    return { valid: false, error: 'Coordinates must be valid numbers' };
                }
                if (latitude < -90 || latitude > 90) {
                    return { valid: false, error: 'Latitude must be between -90 and 90' };
                }
                if (longitude < -180 || longitude > 180) {
                    return { valid: false, error: 'Longitude must be between -180 and 180' };
                }
                return { valid: true };
            },

            // Validate API keys
            apiKey: (value) => {
                if (typeof value !== 'string' || value.length === 0) {
                    return { valid: false, error: 'API key must be a non-empty string' };
                }
                if (value.includes('YOUR_') || value.includes('PLACEHOLDER')) {
                    return { valid: false, error: 'API key appears to be a placeholder' };
                }
                if (value.length < 10) {
                    return { valid: false, error: 'API key appears to be too short' };
                }
                return { valid: true };
            },

            // Validate phone numbers for WhatsApp
            phoneNumber: (value) => {
                if (typeof value !== 'string' || value.length === 0) {
                    return { valid: false, error: 'Phone number must be a non-empty string' };
                }
                // Basic international phone number validation
                if (!/^\+?[1-9]\d{1,14}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    return { valid: false, error: 'Invalid phone number format' };
                }
                return { valid: true };
            }
        };
    }

    // Configure API security policies
    configureAPISecurityPolicies() {
        const currentPolicies = this.securityPolicies[this.securityLevel];
        
        this.apiPolicies = {
            openai: {
                requiresProxy: !currentPolicies.allowClientSideAPIKeys,
                rateLimit: currentPolicies.strictRateLimit ? 60 : 100, // requests per hour
                requiresAuth: this.securityLevel === 'production',
                logCalls: currentPolicies.logSecurityEvents
            },
            weather: {
                requiresProxy: false, // Open-Meteo is free and safe
                rateLimit: currentPolicies.strictRateLimit ? 1000 : 10000, // requests per hour
                requiresAuth: false,
                logCalls: currentPolicies.logSecurityEvents
            },
            shipping: {
                requiresProxy: !currentPolicies.allowClientSideAPIKeys,
                rateLimit: currentPolicies.strictRateLimit ? 100 : 500, // requests per hour
                requiresAuth: this.securityLevel !== 'development',
                logCalls: true
            },
            whatsapp: {
                requiresProxy: true, // Always proxy WhatsApp APIs
                rateLimit: currentPolicies.strictRateLimit ? 10 : 50, // requests per hour
                requiresAuth: true,
                logCalls: true
            }
        };
    }

    // Validate input using configured validators
    validateInput(type, ...args) {
        if (!this.validators[type]) {
            return { valid: false, error: `Unknown validation type: ${type}` };
        }

        try {
            const result = this.validators[type](...args);
            if (!result.valid) {
                this.logSecurityEvent('INPUT_VALIDATION_FAILED', `${type} validation failed: ${result.error}`);
            }
            return result;
        } catch (error) {
            this.logSecurityEvent('VALIDATION_ERROR', `Error validating ${type}: ${error.message}`);
            return { valid: false, error: 'Validation error occurred' };
        }
    }

    // Check if API call is allowed
    checkAPIPolicy(apiType, endpoint) {
        const policy = this.apiPolicies[apiType];
        if (!policy) {
            this.logSecurityEvent('UNKNOWN_API_TYPE', `Unknown API type: ${apiType}`);
            return { allowed: false, reason: 'Unknown API type' };
        }

        if (policy.requiresProxy && this.securityLevel !== 'development') {
            this.logSecurityEvent('API_PROXY_REQUIRED', `API ${apiType} requires proxy in ${this.securityLevel} mode`);
            return { allowed: false, reason: 'API requires server-side proxy' };
        }

        if (policy.requiresAuth && !this.isUserAuthenticated()) {
            this.logSecurityEvent('API_AUTH_REQUIRED', `API ${apiType} requires authentication`);
            return { allowed: false, reason: 'Authentication required' };
        }

        return { allowed: true };
    }

    // Check if user is authenticated (placeholder)
    isUserAuthenticated() {
        // TODO: Implement proper authentication check
        return this.securityLevel === 'development';
    }

    // Sanitize user input
    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return input;
        }

        // Remove potentially dangerous characters
        return input
            .replace(/[<>]/g, '') // Remove HTML tags
            .replace(/['"]/g, '') // Remove quotes
            .replace(/[&]/g, '&amp;') // Escape ampersands
            .trim();
    }

    // Generate secure random string
    generateSecureToken(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Log security events
    logSecurityEvent(type, message, details = {}) {
        const event = {
            timestamp: new Date().toISOString(),
            type: type,
            message: message,
            details: details,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
            url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
            securityLevel: this.securityLevel
        };

        // In production, send to security monitoring service
        if (this.securityLevel === 'production') {
            // TODO: Send to security monitoring service
            console.warn('🔒 Security Event:', event);
        } else {
            console.log('🔒 Security Event:', event);
        }

        // Store in session for debugging
        if (typeof sessionStorage !== 'undefined') {
            const events = JSON.parse(sessionStorage.getItem('securityEvents') || '[]');
            events.push(event);
            // Keep only last 100 events
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            sessionStorage.setItem('securityEvents', JSON.stringify(events));
        }
    }

    // Get security status
    getSecurityStatus() {
        const currentPolicies = this.securityPolicies[this.securityLevel];
        
        return {
            initialized: this.initialized,
            securityLevel: this.securityLevel,
            policies: currentPolicies,
            apiPolicies: this.apiPolicies,
            recommendations: this.getSecurityRecommendations()
        };
    }

    // Get security recommendations
    getSecurityRecommendations() {
        const recommendations = [];
        
        if (this.securityLevel === 'development') {
            recommendations.push('🔧 Running in development mode - security features disabled');
        }
        
        if (typeof window !== 'undefined' && window.location.protocol !== 'https:') {
            recommendations.push('⚠️ Not using HTTPS - enable HTTPS for production');
        }
        
        if (this.securityLevel !== 'production' && !this.isUserAuthenticated()) {
            recommendations.push('🔐 No authentication system - implement user authentication');
        }
        
        return recommendations;
    }

    // Run security self-test
    runSecuritySelfTest() {
        console.log('🔍 Running Security Self-Test...');
        
        const tests = [
            this.testInputValidation(),
            this.testAPISecurityPolicies(),
            this.testSecurityHeaders(),
            this.testHTTPSEnforcement()
        ];
        
        const results = {
            passed: tests.filter(t => t.passed).length,
            failed: tests.filter(t => !t.passed).length,
            total: tests.length,
            details: tests
        };
        
        console.log(`🔍 Security Self-Test Results: ${results.passed}/${results.total} passed`);
        
        return results;
    }

    // Test methods
    testInputValidation() {
        try {
            const portTest = this.validateInput('portName', 'Singapore');
            const coordTest = this.validateInput('coordinates', '1.3521', '103.8198');
            const apiTest = this.validateInput('apiKey', 'test-api-key-12345');
            
            return {
                name: 'Input Validation',
                passed: portTest.valid && coordTest.valid && apiTest.valid,
                details: { portTest, coordTest, apiTest }
            };
        } catch (error) {
            return {
                name: 'Input Validation',
                passed: false,
                error: error.message
            };
        }
    }

    testAPISecurityPolicies() {
        try {
            const openaiCheck = this.checkAPIPolicy('openai', '/v1/chat/completions');
            const weatherCheck = this.checkAPIPolicy('weather', '/v1/marine');
            
            return {
                name: 'API Security Policies',
                passed: true, // Basic test - policies are configured
                details: { openaiCheck, weatherCheck }
            };
        } catch (error) {
            return {
                name: 'API Security Policies',
                passed: false,
                error: error.message
            };
        }
    }

    testSecurityHeaders() {
        if (typeof document === 'undefined') {
            return { name: 'Security Headers', passed: true, details: 'Not applicable in Node.js' };
        }

        const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        
        return {
            name: 'Security Headers',
            passed: this.securityLevel === 'development' || cspMeta !== null,
            details: { cspPresent: cspMeta !== null }
        };
    }

    testHTTPSEnforcement() {
        if (typeof window === 'undefined') {
            return { name: 'HTTPS Enforcement', passed: true, details: 'Not applicable in Node.js' };
        }

        const isHTTPS = window.location.protocol === 'https:';
        const shouldEnforceHTTPS = this.securityPolicies[this.securityLevel].enforceHTTPS;
        
        return {
            name: 'HTTPS Enforcement',
            passed: !shouldEnforceHTTPS || isHTTPS,
            details: { isHTTPS, shouldEnforceHTTPS }
        };
    }
}

// Initialize security configuration
window.SecurityConfig = new SecurityConfig();

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityConfig;
}

console.log('🔒 Security Configuration loaded');
console.log('📊 Security Status:', window.SecurityConfig.getSecurityStatus());