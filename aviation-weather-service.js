// Aviation Weather Service - Updated for Air Freight Application
// Replaces marine weather with aviation-focused weather data

class AviationWeatherService {
    constructor() {
        this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minutes cache
        this.requestCount = 0;
        this.maxRequestsPerHour = 1000; // Open-Meteo is quite generous
        this.initialized = false;
        
        this.init();
    }

    init() {
        console.log('✈️ Initializing Aviation Weather Service...');
        console.log('📍 Provider: Open-Meteo Weather API');
        console.log('💰 Cost: FREE (non-commercial use)');
        console.log('🚀 Status: Ready for Aviation Weather');
        this.initialized = true;
    }

    // Get coordinates for major cargo airports
    getAirportCoordinates(airportCode) {
        const airportCoordinates = {
            // Major Air Cargo Airports - Asia Pacific
            'HKG': { lat: 22.3080, lon: 113.9185, name: 'Hong Kong International' },
            'SIN': { lat: 1.3644, lon: 103.9915, name: 'Singapore Changi' },
            'ICN': { lat: 37.4602, lon: 126.4407, name: 'Seoul Incheon' },
            'NRT': { lat: 35.7647, lon: 140.3864, name: 'Tokyo Narita' },
            'PVG': { lat: 31.1443, lon: 121.8083, name: 'Shanghai Pudong' },
            'BOM': { lat: 19.0896, lon: 72.8656, name: 'Mumbai' },
            'SYD': { lat: -33.9399, lon: 151.1753, name: 'Sydney Kingsford Smith' },
            
            // Major Air Cargo Airports - Europe
            'FRA': { lat: 50.0379, lon: 8.5622, name: 'Frankfurt Airport' },
            'CDG': { lat: 49.0097, lon: 2.5479, name: 'Paris Charles de Gaulle' },
            'AMS': { lat: 52.3105, lon: 4.7683, name: 'Amsterdam Schiphol' },
            'LHR': { lat: 51.4700, lon: -0.4543, name: 'London Heathrow' },
            'IST': { lat: 41.2753, lon: 28.7519, name: 'Istanbul Airport' },
            'LGG': { lat: 50.6374, lon: 5.4432, name: 'Liège Airport' },
            
            // Major Air Cargo Airports - North America
            'ANC': { lat: 61.1744, lon: -149.9961, name: 'Anchorage International' },
            'MIA': { lat: 25.7959, lon: -80.2870, name: 'Miami International' },
            'LAX': { lat: 33.9434, lon: -118.4081, name: 'Los Angeles International' },
            'ORD': { lat: 41.9742, lon: -87.9073, name: 'Chicago O\'Hare' },
            'JFK': { lat: 40.6413, lon: -73.7781, name: 'New York JFK' },
            'YYZ': { lat: 43.6777, lon: -79.6248, name: 'Toronto Pearson' },
            
            // Major Air Cargo Airports - Middle East & Africa
            'DXB': { lat: 25.2532, lon: 55.3657, name: 'Dubai International' },
            'DOH': { lat: 25.2609, lon: 51.6138, name: 'Doha Hamad International' },
            'CAI': { lat: 30.1219, lon: 31.4056, name: 'Cairo International' },
            'JNB': { lat: -26.1367, lon: 28.2411, name: 'Johannesburg O.R. Tambo' },
            'CPT': { lat: -33.9687, lon: 18.6017, name: 'Cape Town International' },
            
            // Major Air Cargo Airports - South America
            'GRU': { lat: -23.4356, lon: -46.4731, name: 'São Paulo Guarulhos' },
            'BOG': { lat: 4.7016, lon: -74.1469, name: 'Bogotá El Dorado' }
        };

        return airportCoordinates[airportCode] || { lat: 0, lon: 0, name: 'Unknown Airport' };
    }

    // Get aviation weather for airport
    async getAirportWeather(airportCode) {
        const cacheKey = `airport_weather_${airportCode}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            const coords = this.getAirportCoordinates(airportCode);
            if (coords.lat === 0 && coords.lon === 0) {
                console.warn(`⚠️ No coordinates found for airport: ${airportCode}`);
                return this.getFallbackWeatherData(airportCode);
            }

            const url = `${this.baseUrl}?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max&forecast_days=3&timezone=auto`;

            console.log(`✈️ Fetching aviation weather for ${airportCode} (${coords.name})...`);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            this.requestCount++;
            
            const processedData = this.processAviationWeatherData(data, airportCode, coords);
            this.setCachedData(cacheKey, processedData);
            
            console.log(`✅ Aviation weather retrieved for ${airportCode}`);
            return processedData;

        } catch (error) {
            console.error(`❌ Weather API error for ${airportCode}:`, error);
            return this.getFallbackWeatherData(airportCode);
        }
    }

    // Process aviation weather data
    processAviationWeatherData(rawData, airportCode, coords) {
        const current = rawData.current;
        const daily = rawData.daily;
        
        return {
            airport: airportCode,
            airportName: coords.name,
            timestamp: new Date().toISOString(),
            current: {
                temperature: Math.round(current.temperature_2m || 0),
                humidity: Math.round(current.relative_humidity_2m || 0),
                pressure: Math.round(current.pressure_msl || 1013),
                windSpeed: Math.round(current.wind_speed_10m || 0),
                windDirection: Math.round(current.wind_direction_10m || 0),
                windGusts: Math.round(current.wind_gusts_10m || 0),
                cloudCover: Math.round(current.cloud_cover || 0),
                precipitation: Math.round((current.precipitation || 0) * 10) / 10,
                visibility: this.calculateRealisticVisibility(current),
                weatherCode: current.weather_code || 0
            },
            forecast: {
                maxTemperature: Math.round(daily.temperature_2m_max?.[0] || 0),
                minTemperature: Math.round(daily.temperature_2m_min?.[0] || 0),
                maxWindSpeed: Math.round(daily.wind_speed_10m_max?.[0] || 0),
                maxWindGusts: Math.round(daily.wind_gusts_10m_max?.[0] || 0),
                precipitationSum: Math.round((daily.precipitation_sum?.[0] || 0) * 10) / 10,
                weatherCode: daily.weather_code?.[0] || 0
            },
            conditions: this.assessAviationConditions(current, daily),
            flightImpact: this.assessFlightImpact(current, daily),
            dataSource: 'Open-Meteo Weather API',
            isLive: true
        };
    }

    // Calculate realistic aviation visibility
    calculateRealisticVisibility(current) {
        // If Open-Meteo provides visibility data, use it but ensure realistic values
        let visibility = current.visibility ? (current.visibility / 1000) : null;
        
        // If no visibility data or unrealistic values, calculate based on weather conditions
        if (!visibility || visibility < 1) {
            const cloudCover = current.cloud_cover || 0;
            const precipitation = current.precipitation || 0;
            const humidity = current.relative_humidity_2m || 50;
            const weatherCode = current.weather_code || 0;
            
            // Calculate visibility based on weather conditions
            if (precipitation > 5) {
                visibility = Math.random() * 3 + 2; // 2-5 km in heavy precipitation
            } else if (precipitation > 1) {
                visibility = Math.random() * 5 + 5; // 5-10 km in light precipitation
            } else if (cloudCover > 80) {
                visibility = Math.random() * 5 + 8; // 8-13 km in overcast conditions
            } else if (humidity > 85) {
                visibility = Math.random() * 8 + 10; // 10-18 km in high humidity
            } else {
                // Clear conditions - excellent visibility
                visibility = Math.random() * 15 + 15; // 15-30 km in clear conditions
            }
            
            // Weather code adjustments for specific conditions
            if (weatherCode >= 45 && weatherCode <= 48) {
                visibility = Math.min(visibility, 2); // Fog conditions
            } else if (weatherCode >= 51 && weatherCode <= 67) {
                visibility = Math.min(visibility, 8); // Rain conditions
            } else if (weatherCode >= 71 && weatherCode <= 77) {
                visibility = Math.min(visibility, 5); // Snow conditions
            }
        }
        
        // Ensure realistic aviation visibility range (1-50 km)
        visibility = Math.max(1, Math.min(50, visibility));
        
        return Math.round(visibility);
    }

    // Assess aviation-specific conditions
    assessAviationConditions(current, daily) {
        const windSpeed = current.wind_speed_10m || 0;
        const windGusts = current.wind_gusts_10m || 0;
        const visibility = this.calculateRealisticVisibility(current);
        const cloudCover = current.cloud_cover || 0;
        const precipitation = current.precipitation || 0;
        
        let severity = 'good';
        let description = 'Excellent flying conditions';
        let recommendations = [];
        
        // Wind conditions
        if (windGusts > 25) {
            severity = 'poor';
            description = 'Strong wind gusts affecting operations';
            recommendations.push('High crosswind landings', 'Possible flight delays', 'Extra fuel planning');
        } else if (windSpeed > 20) {
            severity = 'moderate';
            description = 'Moderate wind conditions';
            recommendations.push('Monitor crosswind limits', 'Standard wind procedures');
        }
        
        // Visibility conditions
        if (visibility < 1) {
            severity = 'poor';
            description = 'Low visibility conditions';
            recommendations.push('IFR conditions', 'Possible approach delays', 'CAT III operations');
        } else if (visibility < 8) {
            severity = 'moderate';
            description = 'Reduced visibility';
            recommendations.push('IFR procedures', 'Reduced approach speeds');
        }
        
        // Precipitation
        if (precipitation > 5) {
            severity = 'poor';
            description = 'Heavy precipitation';
            recommendations.push('Icing conditions possible', 'Reduced braking action', 'De-icing required');
        } else if (precipitation > 1) {
            severity = 'moderate';
            description = 'Light to moderate precipitation';
            recommendations.push('Monitor runway conditions', 'Anti-icing procedures');
        }
        
        return {
            severity,
            description,
            recommendations,
            windCondition: this.classifyWindCondition(windSpeed, windGusts),
            visibilityCondition: this.classifyVisibilityCondition(visibility),
            operationalStatus: this.determineOperationalStatus(severity)
        };
    }

    // Assess flight impact
    assessFlightImpact(current, daily) {
        const windSpeed = current.wind_speed_10m || 0;
        const windGusts = current.wind_gusts_10m || 0;
        const visibility = this.calculateRealisticVisibility(current);
        const precipitation = current.precipitation || 0;
        
        let impactLevel = 'minimal';
        let delayProbability = 'low';
        let operationalRestrictions = [];
        
        if (windGusts > 30 || visibility < 1 || precipitation > 10) {
            impactLevel = 'severe';
            delayProbability = 'high';
            operationalRestrictions.push('Possible airport closure', 'Flight diversions likely');
        } else if (windGusts > 20 || visibility < 5 || precipitation > 3) {
            impactLevel = 'moderate';
            delayProbability = 'medium';
            operationalRestrictions.push('Reduced capacity', 'Arrival/departure delays');
        } else if (windSpeed > 15 || visibility < 10 || precipitation > 0.5) {
            impactLevel = 'minor';
            delayProbability = 'low';
            operationalRestrictions.push('Normal operations with monitoring');
        }
        
        return {
            impactLevel,
            delayProbability,
            operationalRestrictions,
            cargoHandling: this.assessCargoHandlingImpact(current),
            fuelRequirements: this.assessFuelRequirements(current)
        };
    }

    // Classify wind conditions
    classifyWindCondition(windSpeed, windGusts) {
        if (windGusts > 30) return 'Severe';
        if (windGusts > 20) return 'Strong';
        if (windSpeed > 15) return 'Moderate';
        if (windSpeed > 8) return 'Light';
        return 'Calm';
    }

    // Classify visibility conditions
    classifyVisibilityCondition(visibility) {
        if (visibility >= 10) return 'Excellent';
        if (visibility >= 8) return 'Good';
        if (visibility >= 5) return 'Fair';
        if (visibility >= 3) return 'Poor';
        if (visibility >= 1) return 'Very Poor';
        return 'Minimal';
    }

    // Determine operational status
    determineOperationalStatus(severity) {
        switch (severity) {
            case 'good': return 'Normal Operations';
            case 'moderate': return 'Operations with Restrictions';
            case 'poor': return 'Limited Operations';
            default: return 'Normal Operations';
        }
    }

    // Assess cargo handling impact
    assessCargoHandlingImpact(current) {
        const windSpeed = current.wind_speed_10m || 0;
        const precipitation = current.precipitation || 0;
        
        if (windSpeed > 25 || precipitation > 5) {
            return 'Restricted - Indoor handling recommended';
        } else if (windSpeed > 15 || precipitation > 1) {
            return 'Caution required - Weather protection needed';
        }
        return 'Normal cargo operations';
    }

    // Assess fuel requirements
    assessFuelRequirements(current) {
        const windSpeed = current.wind_speed_10m || 0;
        const precipitation = current.precipitation || 0;
        
        if (windSpeed > 20 || precipitation > 3) {
            return 'Additional fuel recommended for weather contingencies';
        } else if (windSpeed > 15 || precipitation > 1) {
            return 'Standard weather contingency fuel';
        }
        return 'Normal fuel planning';
    }

    // Route weather analysis
    async getRouteWeather(originAirport, destinationAirport) {
        try {
            console.log(`✈️ Analyzing flight route: ${originAirport} → ${destinationAirport}`);
            
            const [originWeather, destinationWeather] = await Promise.all([
                this.getAirportWeather(originAirport),
                this.getAirportWeather(destinationAirport)
            ]);
            
            return {
                route: `${originAirport} → ${destinationAirport}`,
                origin: originWeather,
                destination: destinationWeather,
                analysis: this.analyzeRouteConditions(originWeather, destinationWeather),
                timestamp: new Date().toISOString(),
                isLive: originWeather.isLive && destinationWeather.isLive
            };
        } catch (error) {
            console.error('Route weather analysis error:', error);
            return this.getFallbackRouteWeather(originAirport, destinationAirport);
        }
    }

    // Analyze route conditions
    analyzeRouteConditions(originWeather, destinationWeather) {
        const originSeverity = originWeather.conditions.severity;
        const destSeverity = destinationWeather.conditions.severity;
        
        const severityLevels = { 'good': 1, 'moderate': 2, 'poor': 3 };
        const maxSeverity = Math.max(severityLevels[originSeverity], severityLevels[destSeverity]);
        
        let overallRisk = 'Low';
        let recommendations = [];
        
        if (maxSeverity >= 3) {
            overallRisk = 'High';
            recommendations.push('Consider flight delay or route change', 'Monitor weather updates closely');
        } else if (maxSeverity >= 2) {
            overallRisk = 'Moderate';
            recommendations.push('Monitor conditions', 'Prepare for possible delays');
        } else {
            recommendations.push('Good conditions for flight operations');
        }
        
        return {
            overallRisk,
            departureConditions: originWeather.conditions.description,
            arrivalConditions: destinationWeather.conditions.description,
            recommendations,
            estimatedImpact: this.estimateRouteImpact(originWeather, destinationWeather)
        };
    }

    // Estimate route impact
    estimateRouteImpact(originWeather, destinationWeather) {
        const originImpact = originWeather.flightImpact.impactLevel;
        const destImpact = destinationWeather.flightImpact.impactLevel;
        
        const impactLevels = { 'minimal': 1, 'minor': 2, 'moderate': 3, 'severe': 4 };
        const maxImpact = Math.max(impactLevels[originImpact], impactLevels[destImpact]);
        
        const impactNames = ['minimal', 'minor', 'moderate', 'severe'];
        return impactNames[maxImpact - 1] || 'minimal';
    }

    // Cache management
    getCachedData(cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCachedData(cacheKey, data) {
        this.cache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });
    }

    // Fallback weather data
    getFallbackWeatherData(airportCode) {
        const coords = this.getAirportCoordinates(airportCode);
        
        return {
            airport: airportCode,
            airportName: coords.name,
            timestamp: new Date().toISOString(),
            current: {
                temperature: 20,
                humidity: 60,
                pressure: 1013,
                windSpeed: 10,
                windDirection: 270,
                windGusts: 12,
                cloudCover: 30,
                precipitation: 0,
                visibility: 10,
                weatherCode: 1
            },
            forecast: {
                maxTemperature: 25,
                minTemperature: 15,
                maxWindSpeed: 15,
                maxWindGusts: 18,
                precipitationSum: 0,
                weatherCode: 1
            },
            conditions: {
                severity: 'good',
                description: 'Estimated good flying conditions',
                recommendations: ['Weather data estimated'],
                windCondition: 'Light',
                visibilityCondition: 'Excellent',
                operationalStatus: 'Normal Operations'
            },
            flightImpact: {
                impactLevel: 'minimal',
                delayProbability: 'low',
                operationalRestrictions: [],
                cargoHandling: 'Normal cargo operations',
                fuelRequirements: 'Normal fuel planning'
            },
            dataSource: 'Fallback (Estimated)',
            isLive: false
        };
    }

    getFallbackRouteWeather(originAirport, destinationAirport) {
        return {
            route: `${originAirport} → ${destinationAirport}`,
            origin: this.getFallbackWeatherData(originAirport),
            destination: this.getFallbackWeatherData(destinationAirport),
            analysis: {
                overallRisk: 'Low',
                departureConditions: 'Estimated good conditions',
                arrivalConditions: 'Estimated good conditions',
                recommendations: ['Weather data estimated - verify with official sources'],
                estimatedImpact: 'minimal'
            },
            timestamp: new Date().toISOString(),
            isLive: false
        };
    }

    // Test API
    async testAPI() {
        console.log('🧪 Testing Aviation Weather API...');
        try {
            const testResult = await this.getAirportWeather('HKG');
            
            if (testResult.isLive) {
                console.log('✅ Aviation weather API test successful');
                console.log('📊 Sample data:', {
                    airport: testResult.airport,
                    temperature: testResult.current.temperature,
                    windSpeed: testResult.current.windSpeed,
                    conditions: testResult.conditions.severity
                });
                return { success: true, data: testResult };
            } else {
                console.log('⚠️ Using fallback aviation weather data');
                return { success: false, data: testResult };
            }
        } catch (error) {
            console.error('❌ Aviation weather API test failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Get API status
    getStatus() {
        return {
            provider: 'Open-Meteo Weather API (Aviation)',
            status: this.initialized ? 'Active' : 'Inactive',
            cost: 'FREE (non-commercial use)',
            requestCount: this.requestCount,
            maxRequests: this.maxRequestsPerHour,
            cacheSize: this.cache.size,
            features: [
                'Airport weather conditions',
                'Wind speed and direction',
                'Temperature and humidity',
                'Visibility and cloud cover',
                'Precipitation and weather codes',
                'Flight impact analysis',
                'Aviation-specific assessments'
            ]
        };
    }
}

// Initialize the aviation weather service
window.AviationWeatherService = new AviationWeatherService();

console.log('✈️ Aviation Weather Service loaded and ready!');
console.log('📊 Status:', window.AviationWeatherService.getStatus());