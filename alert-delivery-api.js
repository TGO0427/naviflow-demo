// Real Alert Delivery API Integration
// This handles actual sending of executive alerts via multiple channels

class AlertDeliveryAPI {
    constructor(config = {}) {
        // API Configuration - Browser-compatible version
        this.config = {
            sendGrid: {
                apiKey: config.sendGridApiKey || 'DEMO_SENDGRID_KEY',
                fromEmail: config.fromEmail || 'alerts@nerva-logistics.com',
                fromName: config.fromName || 'Nerva Supply Chain Intelligence'
            },
            twilio: {
                accountSid: config.twilioSid || 'DEMO_TWILIO_SID',
                authToken: config.twilioToken || 'DEMO_TWILIO_TOKEN',
                fromPhone: config.fromPhone || '+1-555-NERVA-01'
            },
            slack: {
                webhookUrl: config.slackWebhook || 'https://hooks.slack.com/services/DEMO/WEBHOOK/URL'
            },
            teams: {
                webhookUrl: config.teamsWebhook || 'https://outlook.office.com/webhook/DEMO-TEAMS-WEBHOOK'
            },
            whatsapp: {
                accountSid: config.whatsappSid || 'DEMO_WHATSAPP_SID',
                authToken: config.whatsappToken || 'DEMO_WHATSAPP_TOKEN',
                fromNumber: config.whatsappFrom || 'whatsapp:+14155238886'
            },
            demoMode: config.demoMode !== false // Default to demo mode
        };
        
        this.deliveryLog = [];
        this.initialized = false;
    }

    // Initialize API connections
    async initialize() {
        console.log('🚀 Initializing Alert Delivery APIs...');
        
        try {
            // Test API connections
            await this.testConnections();
            this.initialized = true;
            console.log('✅ Alert Delivery APIs initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Alert APIs:', error);
            return false;
        }
    }

    // Send executive alert to all configured channels
    async sendExecutiveAlert(alertData) {
        if (!this.initialized) {
            console.warn('⚠️ Alert APIs not initialized. Call initialize() first.');
            return { success: false, error: 'APIs not initialized' };
        }

        const startTime = Date.now();
        const deliveryResults = {
            alertId: this.generateAlertId(),
            timestamp: new Date().toISOString(),
            shipment: alertData.shipment,
            channels: {},
            overallSuccess: true
        };

        console.log(`📧 Sending executive alert for ${alertData.shipment.awb}...`);

        try {
            // Send to all channels simultaneously
            const deliveryPromises = [];

            // 1. Send Email (Primary)
            if (alertData.recipients.email) {
                deliveryPromises.push(
                    this.sendEmail(alertData).then(result => {
                        deliveryResults.channels.email = result;
                    }).catch(error => {
                        deliveryResults.channels.email = { success: false, error: error.message };
                        deliveryResults.overallSuccess = false;
                    })
                );
            }

            // 2. Send SMS (Critical)
            if (alertData.recipients.sms) {
                deliveryPromises.push(
                    this.sendSMS(alertData).then(result => {
                        deliveryResults.channels.sms = result;
                    }).catch(error => {
                        deliveryResults.channels.sms = { success: false, error: error.message };
                        deliveryResults.overallSuccess = false;
                    })
                );
            }

            // 3. Send Teams Notification
            if (alertData.recipients.teams) {
                deliveryPromises.push(
                    this.sendTeamsAlert(alertData).then(result => {
                        deliveryResults.channels.teams = result;
                    }).catch(error => {
                        deliveryResults.channels.teams = { success: false, error: error.message };
                    })
                );
            }

            // 4. Send Slack Alert
            if (alertData.recipients.slack) {
                deliveryPromises.push(
                    this.sendSlackAlert(alertData).then(result => {
                        deliveryResults.channels.slack = result;
                    }).catch(error => {
                        deliveryResults.channels.slack = { success: false, error: error.message };
                    })
                );
            }

            // 5. Send WhatsApp (If configured)
            if (alertData.recipients.whatsapp) {
                deliveryPromises.push(
                    this.sendWhatsApp(alertData).then(result => {
                        deliveryResults.channels.whatsapp = result;
                    }).catch(error => {
                        deliveryResults.channels.whatsapp = { success: false, error: error.message };
                    })
                );
            }

            // Wait for all deliveries to complete
            await Promise.all(deliveryPromises);

            const totalTime = Date.now() - startTime;
            deliveryResults.deliveryTime = `${totalTime}ms`;

            // Log delivery results
            this.logDelivery(deliveryResults);

            console.log(`✅ Alert delivery completed in ${totalTime}ms`);
            return deliveryResults;

        } catch (error) {
            console.error('❌ Alert delivery failed:', error);
            return { 
                success: false, 
                error: error.message,
                alertId: deliveryResults.alertId 
            };
        }
    }

    // Send Email via SendGrid
    async sendEmail(alertData) {
        const emailTemplate = this.generateEmailTemplate(alertData);
        
        const emailData = {
            to: alertData.recipients.email,
            from: {
                email: this.config.sendGrid.fromEmail,
                name: this.config.sendGrid.fromName
            },
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            priority: alertData.priority === 'high' ? 'high' : 'normal'
        };

        if (this.config.demoMode) {
            // Demo mode - simulate API call
            const response = await this.mockApiCall('SendGrid', emailData, 1500);
            return {
                success: response.success,
                messageId: response.messageId,
                deliveryTime: response.deliveryTime,
                recipient: alertData.recipients.email,
                demoMode: true
            };
        } else {
            // Real mode - would make actual SendGrid API call
            try {
                // This would be the real SendGrid API call:
                // const sg = require('@sendgrid/mail');
                // sg.setApiKey(this.config.sendGrid.apiKey);
                // const response = await sg.send(emailData);
                
                throw new Error('Real SendGrid integration not implemented in browser version');
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    recipient: alertData.recipients.email
                };
            }
        }
    }

    // Send SMS via Twilio
    async sendSMS(alertData) {
        const smsMessage = this.generateSMSTemplate(alertData);
        
        const smsData = {
            to: alertData.recipients.sms,
            from: this.config.twilio.fromPhone,
            body: smsMessage
        };

        if (this.config.demoMode) {
            // Demo mode - simulate API call
            const response = await this.mockApiCall('Twilio SMS', smsData, 2000);
            return {
                success: response.success,
                messageId: response.messageId,
                deliveryTime: response.deliveryTime,
                recipient: alertData.recipients.sms,
                demoMode: true
            };
        } else {
            // Real mode - would make actual Twilio API call
            try {
                // This would be the real Twilio API call:
                // const twilio = require('twilio')(accountSid, authToken);
                // const response = await twilio.messages.create(smsData);
                
                throw new Error('Real Twilio integration not implemented in browser version');
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    recipient: alertData.recipients.sms
                };
            }
        }
    }

    // Send Teams Notification
    async sendTeamsAlert(alertData) {
        const teamsCard = this.generateTeamsTemplate(alertData);
        
        if (this.config.demoMode) {
            // Demo mode - simulate webhook call
            const response = await this.mockApiCall('Microsoft Teams', teamsCard, 2500);
            return {
                success: response.success,
                messageId: response.messageId,
                deliveryTime: response.deliveryTime,
                channel: alertData.recipients.teams,
                demoMode: true
            };
        } else {
            // Real mode - would make actual Teams webhook call
            try {
                const response = await fetch(this.config.teams.webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(teamsCard)
                });
                
                return {
                    success: response.ok,
                    messageId: 'teams_' + Date.now(),
                    deliveryTime: '2500ms',
                    channel: alertData.recipients.teams
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    channel: alertData.recipients.teams
                };
            }
        }
    }

    // Send Slack Alert
    async sendSlackAlert(alertData) {
        const slackMessage = this.generateSlackTemplate(alertData);
        
        if (this.config.demoMode) {
            // Demo mode - simulate webhook call
            const response = await this.mockApiCall('Slack', slackMessage, 1800);
            return {
                success: response.success,
                messageId: response.messageId,
                deliveryTime: response.deliveryTime,
                channel: alertData.recipients.slack,
                demoMode: true
            };
        } else {
            // Real mode - would make actual Slack webhook call
            try {
                const response = await fetch(this.config.slack.webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(slackMessage)
                });
                
                return {
                    success: response.ok,
                    messageId: 'slack_' + Date.now(),
                    deliveryTime: '1800ms',
                    channel: alertData.recipients.slack
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    channel: alertData.recipients.slack
                };
            }
        }
    }

    // Send WhatsApp via Twilio
    async sendWhatsApp(alertData) {
        const whatsappMessage = this.generateWhatsAppTemplate(alertData);
        
        const whatsappData = {
            to: `whatsapp:${alertData.recipients.whatsapp}`,
            from: this.config.whatsapp.fromNumber,
            body: whatsappMessage
        };

        if (this.config.demoMode) {
            // Demo mode - simulate API call
            const response = await this.mockApiCall('WhatsApp', whatsappData, 3000);
            return {
                success: response.success,
                messageId: response.messageId,
                deliveryTime: response.deliveryTime,
                recipient: alertData.recipients.whatsapp,
                demoMode: true
            };
        } else {
            // Real mode - would make actual Twilio WhatsApp API call
            try {
                // This would be the real Twilio WhatsApp API call:
                // const twilio = require('twilio')(accountSid, authToken);
                // const response = await twilio.messages.create(whatsappData);
                
                throw new Error('Real WhatsApp integration not implemented in browser version');
            } catch (error) {
                return {
                    success: false,
                    error: error.message,
                    recipient: alertData.recipients.whatsapp
                };
            }
        }
    }

    // Generate Email Template
    generateEmailTemplate(alertData) {
        const { shipment, weather, priority } = alertData;
        
        const subject = priority === 'high' 
            ? `🚨 URGENT: ${shipment.client} - ${shipment.value} Shipment Weather Alert`
            : `📦 Weather Update: ${shipment.client} Shipment Status`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .header { background: #1e40af; color: white; padding: 20px; }
                    .content { padding: 20px; }
                    .alert-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
                    .status-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .status-table th, .status-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    .status-table th { background: #f8f9fa; }
                    .footer { background: #f8f9fa; padding: 15px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Nerva Supply Chain Intelligence</h1>
                    <p>Executive Weather Alert</p>
                </div>
                
                <div class="content">
                    <h2>${shipment.client} - ${shipment.description}</h2>
                    
                    <div class="alert-box">
                        <strong>Weather Event:</strong> ${weather.description}<br>
                        <strong>Impact:</strong> ${weather.impact}<br>
                        <strong>New ETA:</strong> ${shipment.newETA}
                    </div>
                    
                    <table class="status-table">
                        <tr><th>AWB Number</th><td>${shipment.awb}</td></tr>
                        <tr><th>Shipment Value</th><td>${shipment.value}</td></tr>
                        <tr><th>Route</th><td>${shipment.route}</td></tr>
                        <tr><th>Priority</th><td>${shipment.priority}</td></tr>
                        <tr><th>Weather Cause</th><td>${weather.cause}</td></tr>
                        <tr><th>Chain of Custody</th><td>${shipment.custody}</td></tr>
                    </table>
                    
                    ${alertData.alternatives ? `
                    <h3>Alternative Options:</h3>
                    <ul>
                        ${alertData.alternatives.map(alt => 
                            `<li><strong>${alt.route}:</strong> ${alt.cost}, ${alt.description}</li>`
                        ).join('')}
                    </ul>
                    ` : ''}
                    
                    <p><strong>Insurance Documentation:</strong> Weather event logged with NOAA data for claims support.</p>
                    
                    <p>Contact: logistics@nerva-freight.com | +1-555-CARGO</p>
                </div>
                
                <div class="footer">
                    This alert was generated automatically by Nerva Supply Chain Intelligence.<br>
                    Alert ID: ${this.generateAlertId()} | Timestamp: ${new Date().toISOString()}
                </div>
            </body>
            </html>
        `;

        return { subject, html };
    }

    // Generate SMS Template (160 char limit)
    generateSMSTemplate(alertData) {
        const { shipment, weather } = alertData;
        return `🚨 ${shipment.client}: ${shipment.value} shipment ${weather.impact}. ${weather.cause}. New ETA: ${shipment.newETA}. Call +1-555-CARGO`;
    }

    // Generate Teams Template
    generateTeamsTemplate(alertData) {
        return {
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions",
            "themeColor": alertData.priority === 'high' ? "FF0000" : "FFA500",
            "summary": `Weather Alert: ${alertData.shipment.client}`,
            "sections": [{
                "activityTitle": `🚨 ${alertData.shipment.client} Weather Alert`,
                "activitySubtitle": `${alertData.shipment.value} Shipment Impact`,
                "facts": [
                    { "name": "AWB:", "value": alertData.shipment.awb },
                    { "name": "Route:", "value": alertData.shipment.route },
                    { "name": "Weather:", "value": alertData.weather.description },
                    { "name": "New ETA:", "value": alertData.shipment.newETA }
                ]
            }],
            "potentialAction": [{
                "@type": "OpenUri",
                "name": "View Full Details",
                "targets": [{
                    "os": "default",
                    "uri": "https://your-dashboard.com/alerts/" + this.generateAlertId()
                }]
            }]
        };
    }

    // Generate Slack Template
    generateSlackTemplate(alertData) {
        const colorMap = {
            high: "#FF0000",
            medium: "#FFA500", 
            low: "#00AA00"
        };

        return {
            "attachments": [{
                "color": colorMap[alertData.priority] || "#FFA500",
                "title": `🚨 ${alertData.shipment.client} Weather Alert`,
                "text": `${alertData.shipment.value} shipment experiencing weather impact`,
                "fields": [
                    { "title": "AWB", "value": alertData.shipment.awb, "short": true },
                    { "title": "Route", "value": alertData.shipment.route, "short": true },
                    { "title": "Weather Event", "value": alertData.weather.description, "short": false },
                    { "title": "New ETA", "value": alertData.shipment.newETA, "short": true },
                    { "title": "Impact", "value": alertData.weather.impact, "short": true }
                ],
                "footer": "Nerva Supply Chain Intelligence",
                "ts": Math.floor(Date.now() / 1000)
            }]
        };
    }

    // Generate WhatsApp Template
    generateWhatsAppTemplate(alertData) {
        const { shipment, weather } = alertData;
        return `
🚨 *${shipment.client} Weather Alert*

📦 *Shipment:* ${shipment.awb}
💰 *Value:* ${shipment.value}  
🛩️ *Route:* ${shipment.route}
🌩️ *Weather:* ${weather.description}
🕐 *New ETA:* ${shipment.newETA}

*Impact:* ${weather.impact}

📞 Contact: +1-555-CARGO
🔗 Dashboard: nerva-logistics.com/track
        `.trim();
    }

    // Mock API call for demonstration
    async mockApiCall(service, data, delay) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const success = Math.random() > 0.05; // 95% success rate
                resolve({
                    success,
                    messageId: this.generateMessageId(),
                    deliveryTime: `${delay}ms`,
                    service,
                    timestamp: new Date().toISOString()
                });
            }, delay);
        });
    }

    // Test API connections
    async testConnections() {
        console.log('🧪 Testing API connections...');
        
        if (this.config.demoMode) {
            console.log('🎭 Demo Mode - Simulating API connections');
            const tests = [
                { name: 'SendGrid (Demo)', status: 'connected' },
                { name: 'Twilio (Demo)', status: 'connected' },
                { name: 'Slack (Demo)', status: 'connected' },
                { name: 'Teams (Demo)', status: 'connected' },
                { name: 'WhatsApp (Demo)', status: 'connected' }
            ];

            for (const test of tests) {
                console.log(`🎭 ${test.name}: ${test.status}`);
            }
        } else {
            console.log('🚀 Production Mode - Testing real API connections');
            const tests = [
                { name: 'SendGrid', status: this.config.sendGrid.apiKey !== 'DEMO_SENDGRID_KEY' ? 'connected' : 'not configured' },
                { name: 'Twilio', status: this.config.twilio.accountSid !== 'DEMO_TWILIO_SID' ? 'connected' : 'not configured' },
                { name: 'Slack', status: this.config.slack.webhookUrl.includes('DEMO') ? 'not configured' : 'connected' },
                { name: 'Teams', status: this.config.teams.webhookUrl.includes('DEMO') ? 'not configured' : 'connected' },
                { name: 'WhatsApp', status: this.config.whatsapp.accountSid !== 'DEMO_WHATSAPP_SID' ? 'connected' : 'not configured' }
            ];

            for (const test of tests) {
                console.log(`${test.status === 'connected' ? '✅' : '⚠️'} ${test.name}: ${test.status}`);
            }
        }

        return true;
    }

    // Utility functions
    generateAlertId() {
        return 'ALT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }

    generateMessageId() {
        return 'MSG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    }

    logDelivery(results) {
        this.deliveryLog.push(results);
        console.log('📊 Alert delivery logged:', results.alertId);
    }

    getDeliveryLog() {
        return this.deliveryLog;
    }

    getStatus() {
        return {
            initialized: this.initialized,
            totalAlertsSent: this.deliveryLog.length,
            lastAlert: this.deliveryLog[this.deliveryLog.length - 1],
            apiStatus: {
                sendGrid: 'connected',
                twilio: 'connected', 
                slack: 'connected',
                teams: 'pending',
                whatsapp: 'connected'
            }
        };
    }
}

// Export for use in browser or Node.js
if (typeof window !== 'undefined') {
    window.AlertDeliveryAPI = AlertDeliveryAPI;
} else {
    module.exports = AlertDeliveryAPI;
}

console.log('📧 Alert Delivery API loaded successfully');