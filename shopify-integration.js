// Shopify Integration for NaviFlow E-Commerce Shield
// Handles customer and order import from Shopify stores

class ShopifyIntegration {
    constructor() {
        this.apiVersion = '2024-01';
        this.baseUrl = 'https://{shop}.myshopify.com/admin/api/' + this.apiVersion;
        this.accessToken = null;
        this.shopDomain = null;
        this.isConnected = false;
        this.lastSync = null;
        this.syncedOrders = [];
        this.syncedCustomers = [];
        
        this.init();
    }

    init() {
        console.log('🛍️ Initializing Shopify Integration...');
        
        // Check for existing connection
        const savedAuth = this.loadSavedAuth();
        if (savedAuth) {
            this.accessToken = savedAuth.accessToken;
            this.shopDomain = savedAuth.shopDomain;
            this.isConnected = true;
            console.log(`✅ Shopify connected: ${this.shopDomain}`);
        }
    }

    // OAuth Authentication Flow
    async authenticate(shopDomain) {
        console.log(`🔐 Starting Shopify OAuth for ${shopDomain}...`);
        
        // In production, this would redirect to Shopify OAuth
        // For demo, we'll simulate the process
        return new Promise((resolve) => {
            const modal = this.createAuthModal(shopDomain);
            document.body.appendChild(modal);
            
            // Simulate OAuth process
            setTimeout(() => {
                const demoToken = 'shpat_' + Math.random().toString(36).substr(2, 32);
                
                // Store reference to this for proper context
                const integration = this;
                integration.completeAuth(shopDomain, demoToken);
                modal.remove();
                resolve(true);
            }, 3000);
        });
    }

    createAuthModal(shopDomain) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div class="p-6 text-center">
                    <div class="text-6xl mb-4">🛍️</div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Connecting to Shopify</h2>
                    <p class="text-gray-600 mb-6">Connecting to <strong>${shopDomain}.myshopify.com</strong></p>
                    
                    <div class="space-y-3 mb-6">
                        <div class="flex items-center justify-center text-sm text-gray-600">
                            <div class="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full mr-2"></div>
                            Authenticating with Shopify...
                        </div>
                        <div class="text-xs text-gray-500">
                            Requesting permissions for orders and customers
                        </div>
                    </div>
                    
                    <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p class="text-sm text-green-800">
                            <strong>Permissions requested:</strong><br>
                            • Read orders and order details<br>
                            • Read customer information<br>
                            • Receive webhook notifications
                        </p>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    completeAuth(shopDomain, accessToken) {
        this.shopDomain = shopDomain;
        this.accessToken = accessToken;
        this.isConnected = true;
        
        // Save auth data
        this.saveAuth();
        
        console.log(`✅ Shopify authentication completed for ${shopDomain}`);
        
        // Start initial sync
        this.syncAllData();
    }

    saveAuth() {
        const authData = {
            shopDomain: this.shopDomain,
            accessToken: this.accessToken,
            connectedAt: new Date().toISOString()
        };
        localStorage.setItem('shopify_auth', JSON.stringify(authData));
    }

    loadSavedAuth() {
        const saved = localStorage.getItem('shopify_auth');
        return saved ? JSON.parse(saved) : null;
    }

    // API Request Helper
    async makeAPIRequest(endpoint, options = {}) {
        if (!this.isConnected) {
            throw new Error('Shopify not connected. Please authenticate first.');
        }

        const url = this.baseUrl.replace('{shop}', this.shopDomain) + endpoint;
        
        // For demo purposes, we'll simulate API responses
        return this.simulateAPIResponse(endpoint, options);
    }

    // Simulate Shopify API responses for demo
    simulateAPIResponse(endpoint, options) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (endpoint.includes('/orders.json')) {
                    resolve({
                        orders: this.generateSampleOrders()
                    });
                } else if (endpoint.includes('/customers.json')) {
                    resolve({
                        customers: this.generateSampleCustomers()
                    });
                } else if (endpoint.includes('/shop.json')) {
                    resolve({
                        shop: {
                            name: this.shopDomain,
                            email: 'owner@' + this.shopDomain + '.com',
                            domain: this.shopDomain + '.myshopify.com',
                            currency: 'USD',
                            timezone: 'America/New_York'
                        }
                    });
                }
            }, 1000 + Math.random() * 1000);
        });
    }

    generateSampleOrders() {
        return [
            {
                id: 1001,
                order_number: '#1001',
                email: 'sarah.m.johnson@gmail.com',
                created_at: '2024-01-15T10:30:00Z',
                updated_at: '2024-01-15T10:30:00Z',
                total_price: '89.99',
                currency: 'USD',
                financial_status: 'paid',
                fulfillment_status: 'fulfilled',
                customer: {
                    id: 101,
                    first_name: 'Sarah',
                    last_name: 'Johnson',
                    email: 'sarah.m.johnson@gmail.com',
                    phone: '+1-312-555-0187'
                },
                shipping_address: {
                    first_name: 'Sarah',
                    last_name: 'Johnson',
                    address1: '123 N Michigan Ave',
                    city: 'Chicago',
                    province: 'Illinois',
                    country: 'United States',
                    zip: '60601'
                },
                line_items: [
                    {
                        id: 2001,
                        title: 'iPhone 15 Pro Max Clear Case (2-pack)',
                        quantity: 1,
                        price: '89.99',
                        vendor: 'TechProtect',
                        product_id: 301
                    }
                ],
                fulfillments: [
                    {
                        id: 3001,
                        tracking_number: '1Z999AA1234567890',
                        tracking_company: 'UPS',
                        tracking_url: 'https://www.ups.com/track?tracknum=1Z999AA1234567890',
                        created_at: '2024-01-16T08:00:00Z'
                    }
                ]
            },
            {
                id: 1002,
                order_number: '#1002',
                email: 'mike.chen.tech@gmail.com',
                created_at: '2024-01-14T15:45:00Z',
                updated_at: '2024-01-14T15:45:00Z',
                total_price: '149.99',
                currency: 'USD',
                financial_status: 'paid',
                fulfillment_status: 'shipped',
                customer: {
                    id: 102,
                    first_name: 'Mike',
                    last_name: 'Chen',
                    email: 'mike.chen.tech@gmail.com',
                    phone: '+1-415-555-0234'
                },
                shipping_address: {
                    first_name: 'Mike',
                    last_name: 'Chen',
                    address1: '456 Market Street',
                    city: 'San Francisco',
                    province: 'California',
                    country: 'United States',
                    zip: '94105'
                },
                line_items: [
                    {
                        id: 2002,
                        title: 'SteelSeries Arctis 7P Wireless Gaming Headset',
                        quantity: 1,
                        price: '149.99',
                        vendor: 'SteelSeries',
                        product_id: 302
                    }
                ],
                fulfillments: [
                    {
                        id: 3002,
                        tracking_number: '1ZE312345678901234',
                        tracking_company: 'UPS',
                        tracking_url: 'https://www.ups.com/track?tracknum=1ZE312345678901234',
                        created_at: '2024-01-15T14:30:00Z'
                    }
                ]
            },
            {
                id: 1003,
                order_number: '#1003',
                email: 'emily.rodriguez@outlook.com',
                created_at: '2024-01-13T09:15:00Z',
                updated_at: '2024-01-13T09:15:00Z',
                total_price: '199.99',
                currency: 'USD',
                financial_status: 'paid',
                fulfillment_status: 'pending',
                customer: {
                    id: 103,
                    first_name: 'Emily',
                    last_name: 'Rodriguez',
                    email: 'emily.rodriguez@outlook.com',
                    phone: '+1-512-555-0567'
                },
                shipping_address: {
                    first_name: 'Emily',
                    last_name: 'Rodriguez',
                    address1: '789 Congress Ave',
                    city: 'Austin',
                    province: 'Texas',
                    country: 'United States',
                    zip: '78701'
                },
                line_items: [
                    {
                        id: 2003,
                        title: 'Fitbit Versa 4 Fitness Smartwatch',
                        quantity: 1,
                        price: '199.99',
                        vendor: 'Fitbit',
                        product_id: 303
                    }
                ]
            }
        ];
    }

    generateSampleCustomers() {
        return [
            {
                id: 101,
                first_name: 'Sarah',
                last_name: 'Johnson',
                email: 'sarah.m.johnson@gmail.com',
                phone: '+1-312-555-0187',
                created_at: '2023-08-15T10:30:00Z',
                updated_at: '2024-01-15T10:30:00Z',
                orders_count: 5,
                total_spent: '450.25',
                last_order_id: 1001,
                last_order_name: '#1001',
                state: 'enabled',
                addresses: [
                    {
                        first_name: 'Sarah',
                        last_name: 'Johnson',
                        address1: '123 N Michigan Ave',
                        city: 'Chicago',
                        province: 'Illinois',
                        country: 'United States',
                        zip: '60601',
                        default: true
                    }
                ]
            },
            {
                id: 102,
                first_name: 'Mike',
                last_name: 'Chen',
                email: 'mike.chen.tech@gmail.com',
                phone: '+1-415-555-0234',
                created_at: '2023-06-20T15:45:00Z',
                updated_at: '2024-01-14T15:45:00Z',
                orders_count: 8,
                total_spent: '1,247.92',
                last_order_id: 1002,
                last_order_name: '#1002',
                state: 'enabled'
            },
            {
                id: 103,
                first_name: 'Emily',
                last_name: 'Rodriguez',
                email: 'emily.rodriguez@outlook.com',
                phone: '+1-512-555-0567',
                created_at: '2023-11-10T09:15:00Z',
                updated_at: '2024-01-13T09:15:00Z',
                orders_count: 3,
                total_spent: '567.48',
                last_order_id: 1003,
                last_order_name: '#1003',
                state: 'enabled'
            }
        ];
    }

    // Sync all data from Shopify
    async syncAllData() {
        console.log('🔄 Starting full Shopify data sync...');
        
        try {
            // Sync orders first
            await this.syncOrders();
            console.log('📦 Orders synced, count:', this.syncedOrders.length);
            
            // Then sync customers
            await this.syncCustomers();
            console.log('👥 Customers synced, count:', this.syncedCustomers.length);
            
            this.lastSync = new Date().toISOString();
            localStorage.setItem('shopify_last_sync', this.lastSync);
            
            // Verify data was stored properly
            const storedOrders = this.getStoredOrders();
            const storedCustomers = this.getStoredCustomers();
            console.log('✅ Stored orders:', storedOrders.length);
            console.log('✅ Stored customers:', storedCustomers.length);
            
            console.log('✅ Shopify sync completed successfully');
            this.showSyncResults();
            
        } catch (error) {
            console.error('❌ Shopify sync failed:', error);
            throw error;
        }
    }

    // Sync orders from Shopify
    async syncOrders() {
        console.log('📦 Syncing orders from Shopify...');
        
        const response = await this.makeAPIRequest('/orders.json?status=any&limit=250');
        this.syncedOrders = response.orders;
        
        // Process orders for our system
        this.processOrders(this.syncedOrders);
        
        console.log(`✅ Synced ${this.syncedOrders.length} orders`);
    }

    // Sync customers from Shopify
    async syncCustomers() {
        console.log('👥 Syncing customers from Shopify...');
        
        const response = await this.makeAPIRequest('/customers.json?limit=250');
        this.syncedCustomers = response.customers;
        
        // Process customers for our system
        this.processCustomers(this.syncedCustomers);
        
        console.log(`✅ Synced ${this.syncedCustomers.length} customers`);
    }

    // Process orders into our format
    processOrders(orders) {
        const processedOrders = orders.map(order => ({
            orderId: order.order_number,
            shopifyOrderId: order.id,
            customerName: `${order.customer.first_name} ${order.customer.last_name}`,
            customerEmail: order.customer.email,
            customerPhone: order.customer.phone,
            orderValue: `$${order.total_price}`,
            orderDate: order.created_at,
            status: order.fulfillment_status || 'pending',
            shippingAddress: order.shipping_address,
            products: order.line_items.map(item => ({
                name: item.title,
                quantity: item.quantity,
                price: item.price
            })),
            tracking: order.fulfillments?.[0] ? {
                number: order.fulfillments[0].tracking_number,
                carrier: order.fulfillments[0].tracking_company,
                url: order.fulfillments[0].tracking_url
            } : null,
            platform: 'shopify'
        }));

        // Store in localStorage for the demo
        localStorage.setItem('nerva_orders', JSON.stringify(processedOrders));
        return processedOrders;
    }

    // Process customers into our format
    processCustomers(customers) {
        const processedCustomers = customers.map(customer => ({
            customerId: customer.id,
            name: `${customer.first_name} ${customer.last_name}`,
            email: customer.email,
            phone: customer.phone,
            ordersCount: customer.orders_count,
            totalSpent: customer.total_spent,
            lastOrderId: customer.last_order_name,
            joinDate: customer.created_at,
            addresses: customer.addresses || [],
            platform: 'shopify'
        }));

        // Store in localStorage for the demo
        localStorage.setItem('nerva_customers', JSON.stringify(processedCustomers));
        return processedCustomers;
    }

    // Show sync results to user
    showSyncResults() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                <div class="p-6">
                    <div class="text-center mb-6">
                        <div class="text-6xl mb-4">✅</div>
                        <h2 class="text-2xl font-bold text-gray-800">Shopify Sync Complete!</h2>
                        <p class="text-gray-600 mt-2">Your store data has been imported successfully</p>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h3 class="font-semibold text-green-800">Orders Imported</h3>
                                    <p class="text-sm text-green-600">Recent orders with tracking info</p>
                                </div>
                                <div class="text-2xl font-bold text-green-800">${this.syncedOrders.length}</div>
                            </div>
                        </div>
                        
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h3 class="font-semibold text-blue-800">Customers Imported</h3>
                                    <p class="text-sm text-blue-600">Customer profiles and contact info</p>
                                </div>
                                <div class="text-2xl font-bold text-blue-800">${this.syncedCustomers.length}</div>
                            </div>
                        </div>
                        
                        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h3 class="font-semibold text-purple-800">Auto-Notifications</h3>
                                    <p class="text-sm text-purple-600">Weather alerts now enabled</p>
                                </div>
                                <div class="text-2xl text-purple-800">🔔</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 class="font-semibold text-yellow-800 mb-2">🚀 What's Next?</h4>
                        <div class="text-sm text-yellow-700 space-y-1">
                            <p>• Weather alerts will automatically notify customers about delays</p>
                            <p>• Search customers by name, email, or product in Order Tracking</p>
                            <p>• Review protection activated for marketplace orders</p>
                        </div>
                    </div>
                    
                    <button onclick="startUsingWeatherAlerts(); this.closest('.fixed').remove();" 
                            class="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium">
                        Start Using Weather Alerts
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 10000);
    }

    // Get stored orders and customers
    getStoredOrders() {
        const stored = localStorage.getItem('nerva_orders');
        return stored ? JSON.parse(stored) : [];
    }

    getStoredCustomers() {
        const stored = localStorage.getItem('nerva_customers');
        return stored ? JSON.parse(stored) : [];
    }

    // Disconnect from Shopify
    disconnect() {
        this.accessToken = null;
        this.shopDomain = null;
        this.isConnected = false;
        this.syncedOrders = [];
        this.syncedCustomers = [];
        
        localStorage.removeItem('shopify_auth');
        localStorage.removeItem('shopify_last_sync');
        localStorage.removeItem('nerva_orders');
        localStorage.removeItem('nerva_customers');
        
        console.log('🔌 Disconnected from Shopify');
    }

    // Get connection status
    getStatus() {
        return {
            connected: this.isConnected,
            shopDomain: this.shopDomain,
            lastSync: this.lastSync,
            ordersCount: this.syncedOrders.length,
            customersCount: this.syncedCustomers.length,
            apiVersion: this.apiVersion
        };
    }

    // Webhook handler for real-time updates (would be server-side in production)
    handleWebhook(event, data) {
        console.log(`📡 Shopify webhook received: ${event}`, data);
        
        switch (event) {
            case 'orders/create':
                this.handleNewOrder(data);
                break;
            case 'orders/updated':
                this.handleOrderUpdate(data);
                break;
            case 'orders/fulfilled':
                this.handleOrderFulfillment(data);
                break;
            default:
                console.log(`Unhandled webhook event: ${event}`);
        }
    }

    handleNewOrder(order) {
        console.log('📦 New order received from Shopify:', order.order_number);
        // Add to our orders list and trigger weather monitoring
    }

    handleOrderUpdate(order) {
        console.log('📝 Order updated:', order.order_number);
        // Update existing order data
    }

    handleOrderFulfillment(order) {
        console.log('🚚 Order fulfilled:', order.order_number);
        // Start tracking shipment for weather delays
    }
}

// Initialize Shopify integration
window.ShopifyIntegration = new ShopifyIntegration();

// Global functions for UI
window.connectToShopify = async function(shopDomain) {
    if (!shopDomain) {
        shopDomain = prompt('Enter your Shopify store domain (without .myshopify.com):');
        if (!shopDomain) return;
    }
    
    try {
        await window.ShopifyIntegration.authenticate(shopDomain);
        console.log('✅ Successfully connected to Shopify');
    } catch (error) {
        console.error('❌ Failed to connect to Shopify:', error);
        alert('Failed to connect to Shopify. Please try again.');
    }
};

window.syncShopifyData = async function() {
    try {
        await window.ShopifyIntegration.syncAllData();
    } catch (error) {
        console.error('❌ Shopify sync failed:', error);
        alert('Sync failed. Please check your connection.');
    }
};

window.disconnectShopify = function() {
    if (confirm('Are you sure you want to disconnect from Shopify?')) {
        window.ShopifyIntegration.disconnect();
        alert('Disconnected from Shopify');
    }
};

// Function to handle "Start Using Weather Alerts" button
window.startUsingWeatherAlerts = function() {
    console.log('🚀 Starting weather alerts for imported customers...');
    
    // Debug: Check Shopify integration status
    console.log('🔍 Shopify Integration status:', {
        exists: !!window.ShopifyIntegration,
        isConnected: window.ShopifyIntegration?.isConnected,
        shopDomain: window.ShopifyIntegration?.shopDomain
    });
    
    // Get imported order data
    let orders = window.ShopifyIntegration ? window.ShopifyIntegration.getStoredOrders() : [];
    let customers = window.ShopifyIntegration ? window.ShopifyIntegration.getStoredCustomers() : [];
    
    console.log('📊 Initial data check:', {
        ordersFound: orders.length,
        customersFound: customers.length
    });
    
    if (orders.length === 0) {
        console.log('⚠️ No orders found in storage');
        
        // Check if Shopify is connected but data wasn't synced properly
        if (window.ShopifyIntegration && window.ShopifyIntegration.isConnected) {
            console.log('🔄 Shopify connected but no stored data, re-syncing...');
            
            // Force a re-sync
            window.ShopifyIntegration.syncedOrders = window.ShopifyIntegration.generateSampleOrders();
            window.ShopifyIntegration.syncedCustomers = window.ShopifyIntegration.generateSampleCustomers();
            window.ShopifyIntegration.processOrders(window.ShopifyIntegration.syncedOrders);
            window.ShopifyIntegration.processCustomers(window.ShopifyIntegration.syncedCustomers);
            
            // Reload orders
            orders = window.ShopifyIntegration.getStoredOrders();
            customers = window.ShopifyIntegration.getStoredCustomers();
            
            console.log('🔄 After re-sync:', {
                ordersCount: orders.length,
                customersCount: customers.length
            });
        } else {
            console.log('🆕 No Shopify connection, loading sample data...');
            
            if (window.ShopifyIntegration) {
                // Generate sample data for demo
                window.ShopifyIntegration.syncedOrders = window.ShopifyIntegration.generateSampleOrders();
                window.ShopifyIntegration.syncedCustomers = window.ShopifyIntegration.generateSampleCustomers();
                window.ShopifyIntegration.processOrders(window.ShopifyIntegration.syncedOrders);
                window.ShopifyIntegration.processCustomers(window.ShopifyIntegration.syncedCustomers);
                
                // Reload orders
                orders = window.ShopifyIntegration.getStoredOrders();
                customers = window.ShopifyIntegration.getStoredCustomers();
            }
        }
        
        if (orders.length === 0) {
            alert('⚠️ No orders found. Please connect your store first or load sample data.');
            return;
        }
    }
    
    console.log('✅ Final data for weather alerts:', {
        ordersCount: orders.length,
        customersCount: customers.length,
        sampleOrder: orders[0]
    });
    
    // Show weather monitoring setup modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-2xl font-bold text-gray-800">🌤️ Weather Alert System Active</h2>
                <p class="text-gray-600 mt-2">Your orders are now being monitored for weather delays</p>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Active Orders Monitoring -->
                    <div class="space-y-4">
                        <h3 class="font-semibold text-gray-800 mb-3">📦 Orders Being Monitored</h3>
                        <div class="space-y-3">
                            ${orders.slice(0, 3).map(order => `
                                <div class="border rounded-lg p-3 bg-gradient-to-r from-blue-50 to-blue-100">
                                    <div class="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 class="font-medium text-blue-900">${order.customerName || 'Customer'}</h4>
                                            <p class="text-sm text-blue-700">${order.products?.[0]?.name || 'Product'}</p>
                                        </div>
                                        <span class="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
                                            ${order.status === 'fulfilled' ? '🚚 Shipped' : '📦 Processing'}
                                        </span>
                                    </div>
                                    <div class="text-xs text-blue-600 space-y-1">
                                        <p><strong>Order:</strong> ${order.orderId}</p>
                                        <p><strong>Tracking:</strong> ${order.tracking?.number || 'Not shipped yet'}</p>
                                        <p><strong>Route:</strong> ${order.tracking?.carrier || 'TBD'} → Customer</p>
                                    </div>
                                </div>
                            `).join('')}
                            ${orders.length > 3 ? `
                                <div class="text-center text-gray-500 text-sm">
                                    + ${orders.length - 3} more orders being monitored
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- Weather Alert Features -->
                    <div class="space-y-4">
                        <h3 class="font-semibold text-gray-800 mb-3">🛡️ Protection Features</h3>
                        
                        <div class="space-y-3">
                            <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                                <h4 class="font-medium text-green-800 mb-1">✅ Auto Customer Notifications</h4>
                                <p class="text-sm text-green-700">Customers get proactive emails/SMS before they contact you about delays</p>
                            </div>
                            
                            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <h4 class="font-medium text-blue-800 mb-1">🛡️ Review Protection Shield</h4>
                                <p class="text-sm text-blue-700">Weather delays won't hurt your seller ratings - automatic documentation</p>
                            </div>
                            
                            <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                <h4 class="font-medium text-purple-800 mb-1">💰 Customer Credits</h4>
                                <p class="text-sm text-purple-700">Automatic credits keep customers happy during weather delays</p>
                            </div>
                            
                            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <h4 class="font-medium text-yellow-800 mb-1">📊 Marketplace Protection</h4>
                                <p class="text-sm text-yellow-700">Amazon, eBay, Shopify - all platforms protected from weather-related metrics drops</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Weather Monitoring Status -->
                <div class="mt-6 bg-gray-50 rounded-lg p-4">
                    <h3 class="font-semibold text-gray-800 mb-3">🌤️ Current Weather Monitoring</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div class="text-center">
                            <div class="text-2xl mb-1">🚚</div>
                            <p class="font-medium">Hub Monitoring</p>
                            <p class="text-gray-600">Memphis, Louisville, Chicago</p>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl mb-1">⚡</div>
                            <p class="font-medium">Real-time Alerts</p>
                            <p class="text-gray-600">Storms, ice, fog detection</p>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl mb-1">📱</div>
                            <p class="font-medium">Customer Notify</p>
                            <p class="text-gray-600">Email, SMS, store messages</p>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button onclick="alert('📦 Order tracking feature - navigate to Order Tracking page')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        📦 View All Orders
                    </button>
                    <button onclick="alert('⚡ Test weather alert sent!')" class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm">
                        ⚡ Test Weather Alert
                    </button>
                    <button onclick="alert('⚙️ Alert settings feature coming soon!')" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm">
                        ⚙️ Alert Settings
                    </button>
                </div>
                
                <div class="mt-6 text-center">
                    <button onclick="goToDashboard(); this.closest('.fixed').remove();" 
                            class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
                        Continue to Dashboard
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Show success message with fallback
    setTimeout(() => {
        const message = '🌤️ Weather monitoring active for ' + orders.length + ' orders';
        if (typeof window.showToast === 'function') {
            window.showToast(message, 'success');
        } else {
            console.log(message);
            // Create a simple toast notification if showToast doesn't exist
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
            toast.innerHTML = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }
    }, 1000);
    
    // Enable weather monitoring features
    console.log('🌤️ Weather monitoring enabled for orders:', orders);
    localStorage.setItem('weather_monitoring_active', 'true');
    localStorage.setItem('monitored_orders', JSON.stringify(orders));
};

// Function to navigate to main dashboard
window.goToDashboard = function() {
    console.log('📊 Navigating to main dashboard...');
    
    // IMPORTANT: Close any open modals first
    const modals = document.querySelectorAll('.fixed.inset-0');
    modals.forEach(modal => {
        console.log('🗑️ Closing modal:', modal.className);
        modal.remove();
    });
    
    // Debug: Check current state
    console.log('🔍 Dashboard navigation debug:', {
        showPageExists: typeof window.showPage === 'function',
        currentURL: window.location.href,
        aviationWeatherPage: !!document.getElementById('aviation-weather'),
        initCustomerSearchExists: typeof window.initializeCustomerSearch === 'function',
        modalsRemoved: modals.length
    });
    
    // Check if we're in the main application with showPage function
    if (typeof window.showPage === 'function') {
        console.log('✅ showPage function found, navigating to aviation-weather page...');
        
        try {
            // Navigate to Order Tracking page (main functionality)
            window.showPage('aviation-weather');
            console.log('✅ Page navigation completed');
            
            // Verify the page is actually visible
            const aviationPage = document.getElementById('aviation-weather');
            if (aviationPage && aviationPage.classList.contains('active')) {
                console.log('✅ Aviation-weather page is now active and should be visible');
                
                // Force scroll to top to ensure visibility
                window.scrollTo(0, 0);
                
                // Double-check no modals are blocking the view
                const remainingModals = document.querySelectorAll('.fixed.inset-0');
                if (remainingModals.length > 0) {
                    console.log('⚠️ Found remaining modals, removing them...');
                    remainingModals.forEach(modal => modal.remove());
                }
                
            } else {
                console.error('❌ Aviation-weather page failed to activate');
                console.log('Page state:', {
                    exists: !!aviationPage,
                    classes: aviationPage?.className,
                    style: aviationPage?.style.display
                });
            }
            
            // IMPORTANT: Refresh customer search with latest Shopify data
            setTimeout(() => {
                console.log('🔄 Refreshing customer search with imported data...');
                
                // Re-initialize customer search to pick up new Shopify data
                if (typeof window.initializeCustomerSearch === 'function') {
                    try {
                        window.initializeCustomerSearch();
                        console.log('✅ Customer search refreshed with Shopify data');
                    } catch (error) {
                        console.error('❌ Customer search initialization failed:', error);
                    }
                } else {
                    console.error('❌ initializeCustomerSearch function not found');
                }
                
                // Verify the data is available
                const orders = window.ShopifyIntegration ? window.ShopifyIntegration.getStoredOrders() : [];
                const customers = window.ShopifyIntegration ? window.ShopifyIntegration.getStoredCustomers() : [];
                console.log('📊 Available for search:', {
                    ordersCount: orders.length,
                    customersCount: customers.length,
                    sampleCustomer: customers[0]?.name
                });
                
                // Show success message
                const message = `🎉 Weather alerts active! ${orders.length} orders monitored, ${customers.length} customers searchable.`;
                if (typeof window.showToast === 'function') {
                    window.showToast(message, 'success');
                } else {
                    console.log(message);
                    // Create a simple toast notification
                    const toast = document.createElement('div');
                    toast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                    toast.innerHTML = message;
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 4000);
                }
            }, 500);
            
        } catch (error) {
            console.error('❌ Error during page navigation:', error);
            alert('Navigation error. Please check console for details.');
        }
        
    } else {
        console.log('⚠️ showPage function not found, trying alternative navigation...');
        
        // If showPage doesn't exist, try to navigate to the main app
        if (window.location.pathname.includes('index.html')) {
            console.log('📍 On login page, redirecting to main app...');
            window.location.href = 'air-freight-clean.html';
        } else {
            console.log('📍 Already in main app, just closing modal...');
            // We're already in the main app, just close modal and show message
            console.log('🎉 Weather monitoring is now active for your orders!');
        }
    }
};

console.log('🛍️ Shopify Integration loaded and ready!');