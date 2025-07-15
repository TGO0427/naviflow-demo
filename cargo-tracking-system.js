// Advanced Cargo Tracking System
// Real-time shipment monitoring and status updates for air freight

class CargoTrackingSystem {
    constructor() {
        this.shipments = new Map();
        this.trackingHistory = new Map();
        this.alertSubscriptions = new Map();
        this.initialized = false;
        this.updateInterval = null;
        
        this.init();
    }

    init() {
        console.log('📦 Initializing Advanced Cargo Tracking System...');
        this.loadSampleShipments();
        this.startRealTimeTracking();
        this.initialized = true;
        console.log('✅ Cargo tracking system ready with real-time monitoring');
    }

    // Load sample shipments for demonstration
    loadSampleShipments() {
        const sampleShipments = [
            {
                id: 'AFR-2025-001',
                awb: '180-1234-5678',
                customer: 'Tech Solutions Inc.',
                origin: 'HKG',
                destination: 'LAX',
                status: 'In Transit',
                priority: 'High',
                cargo: {
                    type: 'Electronics',
                    weight: '2.5 tons',
                    value: '$450,000',
                    dimensions: '2.4m x 1.8m x 1.2m',
                    hazardous: false,
                    temperature: 'Ambient'
                },
                flight: {
                    airline: 'CX',
                    flightNumber: 'CX884',
                    aircraft: 'B777F',
                    departure: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                    arrival: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString()
                },
                tracking: {
                    lastUpdate: new Date().toISOString(),
                    currentLocation: 'Hong Kong International Airport',
                    nextMilestone: 'Departure',
                    expectedDelivery: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(),
                    progress: 25
                },
                alerts: [],
                documents: [
                    { type: 'Air Waybill', status: 'Complete' },
                    { type: 'Commercial Invoice', status: 'Complete' },
                    { type: 'Export Declaration', status: 'Complete' }
                ]
            },
            {
                id: 'AFR-2025-002',
                awb: '180-2345-6789',
                customer: 'Global Pharmaceuticals',
                origin: 'FRA',
                destination: 'SIN',
                status: 'Departed',
                priority: 'Critical',
                cargo: {
                    type: 'Pharmaceuticals',
                    weight: '850 kg',
                    value: '$2,100,000',
                    dimensions: '1.8m x 1.2m x 0.8m',
                    hazardous: false,
                    temperature: '2-8°C'
                },
                flight: {
                    airline: 'SQ',
                    flightNumber: 'SQ326',
                    aircraft: 'A350F',
                    departure: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                    arrival: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString()
                },
                tracking: {
                    lastUpdate: new Date().toISOString(),
                    currentLocation: 'En Route - Over Middle East',
                    nextMilestone: 'Arrival in Singapore',
                    expectedDelivery: new Date(Date.now() + 11 * 60 * 60 * 1000).toISOString(),
                    progress: 65
                },
                alerts: [
                    {
                        type: 'Temperature Monitor',
                        message: 'Temperature maintained at 4°C',
                        severity: 'Info',
                        timestamp: new Date().toISOString()
                    }
                ],
                documents: [
                    { type: 'Air Waybill', status: 'Complete' },
                    { type: 'Pharmaceutical Certificate', status: 'Complete' },
                    { type: 'Temperature Log', status: 'Active' }
                ]
            },
            {
                id: 'AFR-2025-003',
                awb: '180-3456-7890',
                customer: 'Automotive Parts Ltd.',
                origin: 'NRT',
                destination: 'ORD',
                status: 'Delivered',
                priority: 'Standard',
                cargo: {
                    type: 'Automotive Parts',
                    weight: '4.2 tons',
                    value: '$125,000',
                    dimensions: '3.2m x 2.4m x 1.5m',
                    hazardous: false,
                    temperature: 'Ambient'
                },
                flight: {
                    airline: 'AA',
                    flightNumber: 'AA61',
                    aircraft: 'B767F',
                    departure: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
                    arrival: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
                },
                tracking: {
                    lastUpdate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    currentLocation: 'Chicago O\'Hare - Delivered',
                    nextMilestone: 'Complete',
                    expectedDelivery: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    progress: 100
                },
                alerts: [],
                documents: [
                    { type: 'Air Waybill', status: 'Complete' },
                    { type: 'Delivery Receipt', status: 'Complete' },
                    { type: 'Customs Clearance', status: 'Complete' }
                ]
            }
        ];

        // Store shipments
        sampleShipments.forEach(shipment => {
            this.shipments.set(shipment.id, shipment);
            this.generateTrackingHistory(shipment);
        });

        console.log(`📦 Loaded ${sampleShipments.length} sample shipments`);
    }

    // Generate tracking history for a shipment
    generateTrackingHistory(shipment) {
        const history = [];
        const now = new Date();
        
        // Generate historical tracking events
        const events = [
            { event: 'Shipment Created', hours: -24, location: 'Origin Office' },
            { event: 'Cargo Received', hours: -20, location: 'Warehouse' },
            { event: 'Documentation Complete', hours: -18, location: 'Cargo Terminal' },
            { event: 'Security Screening', hours: -16, location: 'Security Area' },
            { event: 'Loaded to Aircraft', hours: -12, location: 'Aircraft' },
            { event: 'Departure', hours: -10, location: shipment.origin },
            { event: 'In Transit', hours: -8, location: 'Airborne' },
            { event: 'Arrival', hours: -2, location: shipment.destination },
            { event: 'Customs Clearance', hours: -1, location: 'Customs' },
            { event: 'Delivered', hours: 0, location: 'Final Destination' }
        ];

        // Add events based on shipment status
        let eventsToAdd = [];
        switch (shipment.status) {
            case 'In Transit':
                eventsToAdd = events.slice(0, 4);
                break;
            case 'Departed':
                eventsToAdd = events.slice(0, 7);
                break;
            case 'Delivered':
                eventsToAdd = events;
                break;
            default:
                eventsToAdd = events.slice(0, 2);
        }

        eventsToAdd.forEach(event => {
            history.push({
                timestamp: new Date(now.getTime() + event.hours * 60 * 60 * 1000).toISOString(),
                event: event.event,
                location: event.location,
                details: `${event.event} at ${event.location}`,
                status: 'Completed'
            });
        });

        this.trackingHistory.set(shipment.id, history);
    }

    // Get shipment by ID
    getShipment(shipmentId) {
        return this.shipments.get(shipmentId);
    }

    // Get all shipments
    getAllShipments() {
        return Array.from(this.shipments.values());
    }

    // Search shipments
    searchShipments(query) {
        const results = [];
        const searchTerm = query.toLowerCase();
        
        for (const shipment of this.shipments.values()) {
            if (
                shipment.id.toLowerCase().includes(searchTerm) ||
                shipment.awb.toLowerCase().includes(searchTerm) ||
                shipment.customer.toLowerCase().includes(searchTerm) ||
                shipment.origin.toLowerCase().includes(searchTerm) ||
                shipment.destination.toLowerCase().includes(searchTerm) ||
                shipment.status.toLowerCase().includes(searchTerm)
            ) {
                results.push(shipment);
            }
        }
        
        return results;
    }

    // Get shipment tracking history
    getTrackingHistory(shipmentId) {
        return this.trackingHistory.get(shipmentId) || [];
    }

    // Update shipment status
    updateShipmentStatus(shipmentId, newStatus, location, details) {
        const shipment = this.shipments.get(shipmentId);
        if (!shipment) {
            throw new Error(`Shipment ${shipmentId} not found`);
        }

        // Update shipment
        shipment.status = newStatus;
        shipment.tracking.lastUpdate = new Date().toISOString();
        shipment.tracking.currentLocation = location;
        
        // Add to tracking history
        const history = this.trackingHistory.get(shipmentId) || [];
        history.push({
            timestamp: new Date().toISOString(),
            event: newStatus,
            location: location,
            details: details || `Status updated to ${newStatus}`,
            status: 'Completed'
        });
        
        this.trackingHistory.set(shipmentId, history);
        
        // Check for alerts
        this.checkForAlerts(shipment);
        
        // Notify subscribers
        this.notifySubscribers(shipmentId, 'status_update', {
            shipment: shipment,
            newStatus: newStatus,
            location: location,
            details: details
        });
        
        return shipment;
    }

    // Add alert to shipment
    addAlert(shipmentId, alert) {
        const shipment = this.shipments.get(shipmentId);
        if (!shipment) {
            throw new Error(`Shipment ${shipmentId} not found`);
        }

        alert.id = `alert_${Date.now()}`;
        alert.timestamp = new Date().toISOString();
        shipment.alerts.push(alert);
        
        // Notify subscribers
        this.notifySubscribers(shipmentId, 'alert', {
            shipment: shipment,
            alert: alert
        });
        
        return alert;
    }

    // Check for automated alerts
    checkForAlerts(shipment) {
        const now = new Date();
        const expectedDelivery = new Date(shipment.tracking.expectedDelivery);
        const timeDiff = expectedDelivery.getTime() - now.getTime();
        const hoursUntilDelivery = timeDiff / (1000 * 60 * 60);
        
        // Delivery delay alert
        if (hoursUntilDelivery < 0 && shipment.status !== 'Delivered') {
            this.addAlert(shipment.id, {
                type: 'Delivery Delay',
                message: `Shipment is ${Math.abs(hoursUntilDelivery).toFixed(1)} hours past expected delivery`,
                severity: 'High',
                actionRequired: true
            });
        }
        
        // High priority shipment alert
        if (shipment.priority === 'Critical' && hoursUntilDelivery < 2) {
            this.addAlert(shipment.id, {
                type: 'Critical Delivery',
                message: 'Critical shipment approaching delivery window',
                severity: 'Critical',
                actionRequired: true
            });
        }
    }

    // Subscribe to shipment updates
    subscribeToUpdates(shipmentId, callback) {
        if (!this.alertSubscriptions.has(shipmentId)) {
            this.alertSubscriptions.set(shipmentId, []);
        }
        
        this.alertSubscriptions.get(shipmentId).push(callback);
        
        return () => {
            const subscribers = this.alertSubscriptions.get(shipmentId);
            if (subscribers) {
                const index = subscribers.indexOf(callback);
                if (index > -1) {
                    subscribers.splice(index, 1);
                }
            }
        };
    }

    // Notify subscribers
    notifySubscribers(shipmentId, eventType, data) {
        const subscribers = this.alertSubscriptions.get(shipmentId);
        if (subscribers) {
            subscribers.forEach(callback => {
                try {
                    callback(eventType, data);
                } catch (error) {
                    console.error('Error notifying subscriber:', error);
                }
            });
        }
    }

    // Get shipment statistics
    getStatistics() {
        const shipments = Array.from(this.shipments.values());
        const totalShipments = shipments.length;
        
        const statusCounts = shipments.reduce((acc, shipment) => {
            acc[shipment.status] = (acc[shipment.status] || 0) + 1;
            return acc;
        }, {});
        
        const priorityCounts = shipments.reduce((acc, shipment) => {
            acc[shipment.priority] = (acc[shipment.priority] || 0) + 1;
            return acc;
        }, {});
        
        const totalValue = shipments.reduce((acc, shipment) => {
            const value = parseFloat(shipment.cargo.value.replace(/[$,]/g, ''));
            return acc + value;
        }, 0);
        
        const averageProgress = shipments.reduce((acc, shipment) => {
            return acc + shipment.tracking.progress;
        }, 0) / totalShipments;
        
        return {
            totalShipments,
            statusCounts,
            priorityCounts,
            totalValue: `$${totalValue.toLocaleString()}`,
            averageProgress: Math.round(averageProgress),
            activeAlerts: shipments.reduce((acc, shipment) => acc + shipment.alerts.length, 0),
            onTimeDeliveries: statusCounts['Delivered'] || 0,
            lastUpdated: new Date().toISOString()
        };
    }

    // Get shipments by status
    getShipmentsByStatus(status) {
        return Array.from(this.shipments.values()).filter(shipment => shipment.status === status);
    }

    // Get shipments by priority
    getShipmentsByPriority(priority) {
        return Array.from(this.shipments.values()).filter(shipment => shipment.priority === priority);
    }

    // Get active alerts
    getActiveAlerts() {
        const alerts = [];
        for (const shipment of this.shipments.values()) {
            shipment.alerts.forEach(alert => {
                alerts.push({
                    ...alert,
                    shipmentId: shipment.id,
                    customer: shipment.customer
                });
            });
        }
        return alerts.sort((a, b) => {
            const severityOrder = { 'Critical': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
            return severityOrder[b.severity] - severityOrder[a.severity];
        });
    }

    // Start real-time tracking updates
    startRealTimeTracking() {
        this.updateInterval = setInterval(() => {
            this.updateShipmentProgress();
        }, 60000); // Update every minute
        
        console.log('🔄 Real-time tracking updates started');
    }

    // Update shipment progress
    updateShipmentProgress() {
        const now = new Date();
        
        for (const shipment of this.shipments.values()) {
            if (shipment.status === 'In Transit' || shipment.status === 'Departed') {
                // Simulate progress updates
                const departureTime = new Date(shipment.flight.departure);
                const arrivalTime = new Date(shipment.flight.arrival);
                const totalDuration = arrivalTime.getTime() - departureTime.getTime();
                const elapsed = now.getTime() - departureTime.getTime();
                
                if (elapsed > 0) {
                    const progress = Math.min(90, Math.round((elapsed / totalDuration) * 100));
                    shipment.tracking.progress = progress;
                    
                    // Update current location based on progress
                    if (progress < 10) {
                        shipment.tracking.currentLocation = `${shipment.origin} - Preparing for departure`;
                    } else if (progress < 20) {
                        shipment.tracking.currentLocation = `${shipment.origin} - Departed`;
                    } else if (progress < 80) {
                        shipment.tracking.currentLocation = `En Route - ${progress}% complete`;
                    } else {
                        shipment.tracking.currentLocation = `Approaching ${shipment.destination}`;
                    }
                }
                
                // Check for alerts
                this.checkForAlerts(shipment);
            }
        }
    }

    // Stop real-time tracking
    stopRealTimeTracking() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
            console.log('🛑 Real-time tracking updates stopped');
        }
    }

    // Generate shipment report
    generateReport(format = 'summary') {
        const stats = this.getStatistics();
        const shipments = Array.from(this.shipments.values());
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: stats,
            details: {
                totalShipments: shipments.length,
                inTransit: this.getShipmentsByStatus('In Transit').length,
                delivered: this.getShipmentsByStatus('Delivered').length,
                delayed: shipments.filter(s => s.alerts.some(a => a.type === 'Delivery Delay')).length,
                criticalShipments: this.getShipmentsByPriority('Critical').length,
                activeAlerts: this.getActiveAlerts().length
            }
        };
        
        if (format === 'detailed') {
            report.shipments = shipments;
            report.alerts = this.getActiveAlerts();
        }
        
        return report;
    }
}

// Initialize the cargo tracking system
window.CargoTrackingSystem = new CargoTrackingSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CargoTrackingSystem;
}

console.log('📦 Cargo Tracking System loaded and ready!');
console.log('📊 Current Statistics:', window.CargoTrackingSystem.getStatistics());