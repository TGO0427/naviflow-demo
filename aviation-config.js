// Aviation Configuration for Air Freight Application
// Major cargo airports and airlines configuration

window.AviationConfig = {
    // Major cargo airports worldwide
    airports: {
        // North America
        'ANC': { name: 'Ted Stevens Anchorage International', city: 'Anchorage', country: 'USA', flag: '🇺🇸', timezone: 'AKST' },
        'MIA': { name: 'Miami International Airport', city: 'Miami', country: 'USA', flag: '🇺🇸', timezone: 'EST' },
        'LAX': { name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', flag: '🇺🇸', timezone: 'PST' },
        'ORD': { name: 'O\'Hare International Airport', city: 'Chicago', country: 'USA', flag: '🇺🇸', timezone: 'CST' },
        'JFK': { name: 'John F. Kennedy International', city: 'New York', country: 'USA', flag: '🇺🇸', timezone: 'EST' },
        'YYZ': { name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada', flag: '🇨🇦', timezone: 'EST' },
        
        // Europe
        'FRA': { name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', flag: '🇩🇪', timezone: 'CET' },
        'CDG': { name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', flag: '🇫🇷', timezone: 'CET' },
        'AMS': { name: 'Amsterdam Schiphol Airport', city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', timezone: 'CET' },
        'LHR': { name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', flag: '🇬🇧', timezone: 'GMT' },
        'IST': { name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', flag: '🇹🇷', timezone: 'TRT' },
        'LGG': { name: 'Liège Airport', city: 'Liège', country: 'Belgium', flag: '🇧🇪', timezone: 'CET' },
        
        // Asia Pacific
        'HKG': { name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', flag: '🇭🇰', timezone: 'HKT' },
        'ICN': { name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', flag: '🇰🇷', timezone: 'KST' },
        'PVG': { name: 'Shanghai Pudong International', city: 'Shanghai', country: 'China', flag: '🇨🇳', timezone: 'CST' },
        'NRT': { name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', timezone: 'JST' },
        'SIN': { name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', flag: '🇸🇬', timezone: 'SGT' },
        'BOM': { name: 'Chhatrapati Shivaji International', city: 'Mumbai', country: 'India', flag: '🇮🇳', timezone: 'IST' },
        'SYD': { name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', flag: '🇦🇺', timezone: 'AEDT' },
        
        // Middle East & Africa
        'DXB': { name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', flag: '🇦🇪', timezone: 'GST' },
        'DOH': { name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', flag: '🇶🇦', timezone: 'AST' },
        'CAI': { name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', flag: '🇪🇬', timezone: 'EET' },
        'JNB': { name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa', flag: '🇿🇦', timezone: 'SAST' },
        'CPT': { name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa', flag: '🇿🇦', timezone: 'SAST' },
        
        // South America
        'GRU': { name: 'São Paulo/Guarulhos International', city: 'São Paulo', country: 'Brazil', flag: '🇧🇷', timezone: 'BRT' },
        'BOG': { name: 'El Dorado International Airport', city: 'Bogotá', country: 'Colombia', flag: '🇨🇴', timezone: 'COT' }
    },
    
    // Major cargo airlines
    airlines: {
        'LH': { name: 'Lufthansa Cargo', country: 'Germany', flag: '🇩🇪', hub: 'FRA', color: '#f9ba00' },
        'EK': { name: 'Emirates SkyCargo', country: 'UAE', flag: '🇦🇪', hub: 'DXB', color: '#d71921' },
        'QR': { name: 'Qatar Airways Cargo', country: 'Qatar', flag: '🇶🇦', hub: 'DOH', color: '#5c1633' },
        'SQ': { name: 'Singapore Airlines Cargo', country: 'Singapore', flag: '🇸🇬', hub: 'SIN', color: '#003366' },
        'CX': { name: 'Cathay Pacific Cargo', country: 'Hong Kong', flag: '🇭🇰', hub: 'HKG', color: '#00351f' },
        'KE': { name: 'Korean Air Cargo', country: 'South Korea', flag: '🇰🇷', hub: 'ICN', color: '#0f4c96' },
        'TK': { name: 'Turkish Cargo', country: 'Turkey', flag: '🇹🇷', hub: 'IST', color: '#e30613' },
        'FX': { name: 'FedEx Express', country: 'USA', flag: '🇺🇸', hub: 'MEM', color: '#4d148c' },
        'UPS': { name: 'UPS Airlines', country: 'USA', flag: '🇺🇸', hub: 'SDF', color: '#351c15' },
        'CV': { name: 'Cargolux', country: 'Luxembourg', flag: '🇱🇺', hub: 'LUX', color: '#005491' },
        'AF': { name: 'Air France Cargo', country: 'France', flag: '🇫🇷', hub: 'CDG', color: '#002157' },
        'BA': { name: 'British Airways World Cargo', country: 'UK', flag: '🇬🇧', hub: 'LHR', color: '#2e5f9a' }
    },
    
    // Aircraft types for air cargo
    aircraftTypes: {
        'B747F': { name: 'Boeing 747-8F', capacity: '140 tons', volume: '858 m³' },
        'B777F': { name: 'Boeing 777F', capacity: '103 tons', volume: '653 m³' },
        'B767F': { name: 'Boeing 767-300F', capacity: '52 tons', volume: '438 m³' },
        'A330F': { name: 'Airbus A330-200F', capacity: '70 tons', volume: '475 m³' },
        'MD11F': { name: 'McDonnell Douglas MD-11F', capacity: '91 tons', volume: '610 m³' },
        'B737F': { name: 'Boeing 737-800F', capacity: '23 tons', volume: '239 m³' },
        'ATR72F': { name: 'ATR 72-600F', capacity: '7.5 tons', volume: '69 m³' }
    },
    
    // Cargo categories for air freight
    cargoCategories: [
        'General Cargo',
        'Pharmaceuticals',
        'Perishables',
        'Live Animals',
        'Dangerous Goods',
        'High Value Cargo',
        'Temperature Controlled',
        'Express/Documents',
        'Automotive Parts',
        'Electronics'
    ],
    
    // Air freight incoterms
    incoterms: [
        'EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'
    ],
    
    // Weight breaks for air freight pricing
    weightBreaks: [
        { min: 0, max: 45, label: 'Under 45kg' },
        { min: 45, max: 100, label: '45-100kg' },
        { min: 100, max: 300, label: '100-300kg' },
        { min: 300, max: 500, label: '300-500kg' },
        { min: 500, max: 1000, label: '500-1000kg' },
        { min: 1000, max: Infinity, label: 'Over 1000kg' }
    ],
    
    // Common service types
    serviceTypes: [
        'Standard Air Freight',
        'Express Air Freight',
        'Next Flight Out',
        'Hand Carry',
        'Charter Flight',
        'Consolidation',
        'Door-to-Door',
        'Airport-to-Airport'
    ]
};

console.log('🛩️ Aviation configuration loaded');