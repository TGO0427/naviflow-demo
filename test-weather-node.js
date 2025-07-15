// Node.js Weather API Test Script
// This script tests the Open-Meteo Marine Weather API directly

import https from 'https';
import fs from 'fs';

// Test coordinates for Singapore
const testCoordinates = {
    'Singapore': { lat: 1.3521, lon: 103.8198 },
    'Hong Kong': { lat: 22.3193, lon: 114.1694 },
    'Shanghai': { lat: 31.2304, lon: 121.4737 }
};

// Test function
async function testWeatherAPI() {
    console.log('🌊 Testing Open-Meteo Marine Weather API...\n');
    
    for (const [portName, coords] of Object.entries(testCoordinates)) {
        console.log(`📍 Testing weather for ${portName}...`);
        
        try {
            const weatherData = await fetchWeatherData(coords.lat, coords.lon);
            console.log(`✅ ${portName} - Success!`);
            console.log(`   Wave Height: ${weatherData.current.wave_height}m`);
            console.log(`   Sea Temperature: ${weatherData.current.sea_surface_temperature}°C`);
            console.log(`   Ocean Current: ${weatherData.current.ocean_current_velocity}m/s`);
            console.log('');
        } catch (error) {
            console.log(`❌ ${portName} - Error: ${error.message}`);
            console.log('');
        }
    }
}

// Fetch weather data from Open-Meteo API
function fetchWeatherData(lat, lon) {
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period,ocean_current_velocity,ocean_current_direction,sea_surface_temperature&forecast_days=1`;
    
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error(`JSON Parse Error: ${error.message}`));
                }
            });
        }).on('error', (error) => {
            reject(new Error(`HTTP Request Error: ${error.message}`));
        });
    });
}

// Test route analysis
async function testRouteAnalysis() {
    console.log('🗺️ Testing Route Weather Analysis...\n');
    
    try {
        const originWeather = await fetchWeatherData(
            testCoordinates['Singapore'].lat,
            testCoordinates['Singapore'].lon
        );
        
        const destinationWeather = await fetchWeatherData(
            testCoordinates['Hong Kong'].lat,
            testCoordinates['Hong Kong'].lon
        );
        
        console.log('✅ Route Analysis: Singapore → Hong Kong');
        console.log(`   Origin Wave Height: ${originWeather.current.wave_height}m`);
        console.log(`   Destination Wave Height: ${destinationWeather.current.wave_height}m`);
        console.log(`   Average Wave Height: ${((originWeather.current.wave_height + destinationWeather.current.wave_height) / 2).toFixed(2)}m`);
        console.log(`   Route Assessment: ${getRouteAssessment(originWeather.current.wave_height, destinationWeather.current.wave_height)}`);
        
    } catch (error) {
        console.log(`❌ Route Analysis Error: ${error.message}`);
    }
}

// Get route assessment
function getRouteAssessment(originWave, destWave) {
    const maxWave = Math.max(originWave, destWave);
    if (maxWave <= 1) return 'Excellent conditions';
    if (maxWave <= 2) return 'Good conditions';
    if (maxWave <= 3) return 'Moderate conditions';
    if (maxWave <= 4) return 'Rough conditions';
    return 'Difficult conditions';
}

// Test API rate limiting
async function testRateLimiting() {
    console.log('⚡ Testing API Rate Limiting...\n');
    
    const startTime = Date.now();
    let successCount = 0;
    let errorCount = 0;
    
    // Make 5 rapid requests
    for (let i = 0; i < 5; i++) {
        try {
            await fetchWeatherData(testCoordinates['Singapore'].lat, testCoordinates['Singapore'].lon);
            successCount++;
        } catch (error) {
            errorCount++;
        }
    }
    
    const duration = Date.now() - startTime;
    console.log(`✅ Rate Limit Test completed in ${duration}ms`);
    console.log(`   Successful requests: ${successCount}`);
    console.log(`   Failed requests: ${errorCount}`);
    console.log(`   API appears to be ${errorCount === 0 ? 'stable' : 'rate-limited'}`);
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Air Freight Weather API Test Suite\n');
    console.log('=' .repeat(50));
    
    await testWeatherAPI();
    await testRouteAnalysis();
    await testRateLimiting();
    
    console.log('=' .repeat(50));
    console.log('✅ All tests completed!\n');
    
    // Generate test report
    const report = {
        timestamp: new Date().toISOString(),
        apiProvider: 'Open-Meteo Marine Weather API',
        testStatus: 'Completed',
        testedPorts: Object.keys(testCoordinates),
        features: [
            'Wave height monitoring',
            'Sea temperature tracking',
            'Ocean current analysis',
            'Route weather assessment'
        ]
    };
    
    fs.writeFileSync('weather-api-test-report.json', JSON.stringify(report, null, 2));
    console.log('📊 Test report saved to weather-api-test-report.json');
}

// Run tests
runAllTests().catch(console.error);