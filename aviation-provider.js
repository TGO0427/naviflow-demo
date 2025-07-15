// Aviation Data Provider - Live Air Cargo Schedules & Tracking
// Simulates real-time air freight data for major cargo airlines

class AviationDataProvider {
    constructor() {
        this.flightSchedules = [];
        this.initialized = false;
        this.updateInterval = null;
        
        this.init();
    }
    
    init() {
        console.log('🛩️ Initializing Aviation Data Provider...');
        this.generateLiveFlightSchedules();
        this.startRealTimeUpdates();
        this.initialized = true;
        console.log('✅ Aviation data provider ready with live flight schedules');
    }
    
    // Generate realistic flight schedules for major cargo airlines
    generateLiveFlightSchedules() {
        const airlines = ['LH', 'EK', 'QR', 'SQ', 'CX', 'KE', 'TK', 'FX', 'UPS', 'CV'];
        const airports = Object.keys(window.AviationConfig.airports);
        const aircraftTypes = Object.keys(window.AviationConfig.aircraftTypes);
        
        this.flightSchedules = [];
        
        // Generate 50 realistic flight schedules
        for (let i = 0; i < 50; i++) {
            const airline = airlines[Math.floor(Math.random() * airlines.length)];
            const origin = airports[Math.floor(Math.random() * airports.length)];
            let destination = airports[Math.floor(Math.random() * airports.length)];
            
            // Ensure origin != destination
            while (destination === origin) {
                destination = airports[Math.floor(Math.random() * airports.length)];
            }
            
            const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
            const flightNumber = `${airline}${String(Math.floor(Math.random() * 9000) + 1000)}`;
            
            // Generate realistic departure time (next 7 days)
            const departureTime = new Date();
            departureTime.setTime(departureTime.getTime() + (Math.random() * 7 * 24 * 60 * 60 * 1000));
            
            // Flight duration (2-16 hours based on distance approximation)
            const flightDuration = Math.floor(Math.random() * 14 + 2) * 60; // minutes
            const arrivalTime = new Date(departureTime.getTime() + (flightDuration * 60 * 1000));
            
            // Available capacity (random percentage of aircraft capacity)
            const maxCapacity = parseInt(window.AviationConfig.aircraftTypes[aircraft].capacity);
            const availableCapacity = Math.floor(maxCapacity * (0.3 + Math.random() * 0.7));
            
            // Current status
            const statuses = ['Scheduled', 'Boarding', 'Departed', 'En Route', 'Landed', 'Delayed'];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            // Rate per kg (realistic air freight rates)
            const baseRate = 2.5 + Math.random() * 4; // $2.50 - $6.50 per kg
            const rate = Math.round(baseRate * 100) / 100;
            
            const flight = {
                id: `flight_${i + 1}`,
                flightNumber,
                airline,
                airlineName: window.AviationConfig.airlines[airline].name,
                origin,
                destination,
                originAirport: window.AviationConfig.airports[origin],
                destinationAirport: window.AviationConfig.airports[destination],
                aircraft,
                aircraftInfo: window.AviationConfig.aircraftTypes[aircraft],
                departureTime: departureTime.toISOString(),
                arrivalTime: arrivalTime.toISOString(),
                status,
                availableCapacity: `${availableCapacity} tons`,
                ratePerKg: `$${rate}`,
                transitTime: `${Math.floor(flightDuration / 60)}h ${flightDuration % 60}m`,
                serviceType: window.AviationConfig.serviceTypes[Math.floor(Math.random() * window.AviationConfig.serviceTypes.length)],
                bookingCutoff: new Date(departureTime.getTime() - (2 * 60 * 60 * 1000)).toISOString(), // 2 hours before
                weatherStatus: this.getWeatherStatus(),
                reliability: Math.floor(85 + Math.random() * 15), // 85-100%
                lastUpdated: new Date().toISOString()
            };
            
            this.flightSchedules.push(flight);
        }
        
        // Sort by departure time
        this.flightSchedules.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
    }
    
    getWeatherStatus() {
        const conditions = [
            { status: 'Clear', probability: 0.6, impact: 'No delays expected' },
            { status: 'Cloudy', probability: 0.2, impact: 'Minimal impact' },
            { status: 'Light Rain', probability: 0.1, impact: 'Possible minor delays' },
            { status: 'Thunderstorms', probability: 0.05, impact: 'Potential delays' },
            { status: 'Snow', probability: 0.03, impact: 'Weather delays possible' },
            { status: 'Fog', probability: 0.02, impact: 'Visibility delays possible' }
        ];
        
        const random = Math.random();
        let cumulative = 0;
        
        for (const condition of conditions) {
            cumulative += condition.probability;
            if (random <= cumulative) {
                return condition;
            }
        }
        
        return conditions[0]; // Default to clear
    }
    
    // Get live flight schedules
    getLiveSchedules(filters = {}) {
        let schedules = [...this.flightSchedules];
        
        // Apply filters
        if (filters.origin) {
            schedules = schedules.filter(f => f.origin === filters.origin);
        }
        
        if (filters.destination) {
            schedules = schedules.filter(f => f.destination === filters.destination);
        }
        
        if (filters.airline) {
            schedules = schedules.filter(f => f.airline === filters.airline);
        }
        
        if (filters.status) {
            schedules = schedules.filter(f => f.status === filters.status);
        }
        
        // Return next 20 flights
        return schedules.slice(0, 20);
    }
    
    // Get specific flight details
    getFlightDetails(flightId) {
        return this.flightSchedules.find(f => f.id === flightId);
    }
    
    // Get route analysis
    getRouteAnalysis(origin, destination) {
        const routeFlights = this.flightSchedules.filter(f => 
            f.origin === origin && f.destination === destination
        );
        
        if (routeFlights.length === 0) {
            return {
                route: `${origin} → ${destination}`,
                flightsAvailable: 0,
                avgRate: 0,
                avgTransitTime: 'N/A',
                nextDeparture: 'No flights found',
                recommendation: 'Consider alternative routing or contact airlines directly'
            };
        }
        
        // Calculate averages
        const avgRate = routeFlights.reduce((sum, f) => sum + parseFloat(f.ratePerKg.replace('$', '')), 0) / routeFlights.length;
        const nextFlight = routeFlights.find(f => new Date(f.departureTime) > new Date());
        
        return {
            route: `${origin} → ${destination}`,
            flightsAvailable: routeFlights.length,
            avgRate: `$${avgRate.toFixed(2)} per kg`,
            avgTransitTime: routeFlights[0].transitTime,
            nextDeparture: nextFlight ? new Date(nextFlight.departureTime).toLocaleString() : 'No upcoming flights',
            airlines: [...new Set(routeFlights.map(f => f.airlineName))],
            recommendation: this.getRouteRecommendation(routeFlights)
        };
    }
    
    getRouteRecommendation(flights) {
        const bestPrice = flights.reduce((min, f) => {
            const rate = parseFloat(f.ratePerKg.replace('$', ''));
            return rate < min.rate ? { flight: f, rate } : min;
        }, { rate: Infinity });
        
        const bestReliability = flights.reduce((max, f) => 
            f.reliability > max.reliability ? f : max
        );
        
        return `Best price: ${bestPrice.flight.airlineName} at ${bestPrice.flight.ratePerKg}. Most reliable: ${bestReliability.airlineName} (${bestReliability.reliability}% on-time)`;
    }
    
    // Get airline performance
    getAirlinePerformance(airline) {
        const airlineFlights = this.flightSchedules.filter(f => f.airline === airline);
        
        if (airlineFlights.length === 0) return null;
        
        const avgReliability = airlineFlights.reduce((sum, f) => sum + f.reliability, 0) / airlineFlights.length;
        const avgRate = airlineFlights.reduce((sum, f) => sum + parseFloat(f.ratePerKg.replace('$', '')), 0) / airlineFlights.length;
        
        return {
            airline: window.AviationConfig.airlines[airline].name,
            totalFlights: airlineFlights.length,
            avgReliability: `${avgReliability.toFixed(1)}%`,
            avgRate: `$${avgRate.toFixed(2)} per kg`,
            hub: window.AviationConfig.airlines[airline].hub,
            status: avgReliability > 90 ? 'Excellent' : avgReliability > 85 ? 'Good' : 'Fair'
        };
    }
    
    // Start real-time updates
    startRealTimeUpdates() {
        // Update flight statuses every 30 seconds
        this.updateInterval = setInterval(() => {
            this.updateFlightStatuses();
        }, 30000);
    }
    
    updateFlightStatuses() {
        const now = new Date();
        
        this.flightSchedules.forEach(flight => {
            const departureTime = new Date(flight.departureTime);
            const arrivalTime = new Date(flight.arrivalTime);
            
            // Update status based on time
            if (now < departureTime - 60 * 60 * 1000) { // More than 1 hour before
                flight.status = 'Scheduled';
            } else if (now < departureTime - 30 * 60 * 1000) { // 30 min - 1 hour before
                flight.status = Math.random() < 0.8 ? 'Boarding' : 'Delayed';
            } else if (now < departureTime) { // Less than 30 min before
                flight.status = Math.random() < 0.9 ? 'Boarding' : 'Delayed';
            } else if (now < arrivalTime) { // Between departure and arrival
                flight.status = Math.random() < 0.95 ? 'En Route' : 'Delayed';
            } else { // After arrival time
                flight.status = 'Landed';
            }
            
            flight.lastUpdated = now.toISOString();
        });
    }
    
    // Get capacity alerts
    getCapacityAlerts() {
        const alerts = this.flightSchedules
            .filter(f => {
                const capacity = parseInt(f.availableCapacity);
                return capacity < 5; // Less than 5 tons available
            })
            .slice(0, 5)
            .map(f => ({
                flightNumber: f.flightNumber,
                route: `${f.origin} → ${f.destination}`,
                departure: new Date(f.departureTime).toLocaleString(),
                availableCapacity: f.availableCapacity,
                urgency: parseInt(f.availableCapacity) < 2 ? 'Critical' : 'Warning'
            }));
        
        return alerts;
    }
    
    // Get weather alerts affecting flights
    getWeatherAlerts() {
        const weatherAlerts = this.flightSchedules
            .filter(f => f.weatherStatus.status !== 'Clear' && f.weatherStatus.status !== 'Cloudy')
            .slice(0, 5)
            .map(f => ({
                flightNumber: f.flightNumber,
                route: `${f.origin} → ${f.destination}`,
                departure: new Date(f.departureTime).toLocaleString(),
                condition: f.weatherStatus.status,
                impact: f.weatherStatus.impact
            }));
        
        return weatherAlerts;
    }
    
    // Get live statistics
    getStatistics() {
        const now = new Date();
        const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        const flightsNext24h = this.flightSchedules.filter(f => 
            new Date(f.departureTime) >= now && new Date(f.departureTime) <= next24Hours
        );
        
        const onTimeFlights = this.flightSchedules.filter(f => f.status !== 'Delayed').length;
        const totalFlights = this.flightSchedules.length;
        const onTimePercentage = Math.round((onTimeFlights / totalFlights) * 100);
        
        return {
            totalFlights: totalFlights,
            flightsNext24h: flightsNext24h.length,
            onTimePerformance: `${onTimePercentage}%`,
            activeAirlines: Object.keys(window.AviationConfig.airlines).length,
            coverageAirports: Object.keys(window.AviationConfig.airports).length,
            avgCapacityUtilization: '73%',
            lastUpdated: new Date().toLocaleString()
        };
    }
}

// Initialize the aviation data provider
window.AviationDataProvider = new AviationDataProvider();

console.log('🛩️ Aviation Data Provider loaded and ready!');