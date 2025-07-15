// WooCommerce Integration for Nerva E-Commerce Shield
// Handles customer and order import from WooCommerce stores

class WooCommerceIntegration {
    constructor() {
        this.apiVersion = 'wc/v3';
        this.baseUrl = null; // Will be set during connection
        this.consumerKey = null;
        this.consumerSecret = null;
        this.isConnected = false;
        this.lastSync = null;
        this.syncedOrders = [];
        this.syncedCustomers = [];
        
        this.init();
    }

    init() {
        console.log('🛒 Initializing WooCommerce Integration...');
        
        // Check for existing connection
        const savedAuth = this.loadSavedAuth();
        if (savedAuth) {
            this.baseUrl = savedAuth.baseUrl;
            this.consumerKey = savedAuth.consumerKey;
            this.consumerSecret = savedAuth.consumerSecret;
            this.isConnected = true;
            console.log(`✅ WooCommerce connected: ${this.baseUrl}`);
        }
    }

    // Authentication Flow for WooCommerce
    async authenticate(storeUrl, consumerKey, consumerSecret) {
        console.log(`🔐 Starting WooCommerce authentication for ${storeUrl}...`);
        
        // Clean up the store URL
        const cleanUrl = this.cleanStoreUrl(storeUrl);
        this.baseUrl = `${cleanUrl}/wp-json/wc/v3`;
        
        return new Promise((resolve) => {
            const modal = this.createAuthModal(cleanUrl, consumerKey);
            document.body.appendChild(modal);
            
            // Simulate authentication process
            setTimeout(() => {
                this.completeAuth(cleanUrl, consumerKey, consumerSecret);
                modal.remove();
                resolve(true);
            }, 3000);
        });
    }

    createAuthModal(storeUrl, consumerKey) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div class="p-6 text-center">
                    <div class="text-6xl mb-4">🛒</div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Connecting to WooCommerce</h2>
                    <p class="text-gray-600 mb-6">Connecting to <strong>${storeUrl}</strong></p>
                    
                    <div class="space-y-3 mb-6">
                        <div class="flex items-center justify-center text-sm text-gray-600">
                            <div class="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                            Authenticating with WooCommerce REST API...
                        </div>
                        <div class="text-xs text-gray-500">
                            Validating API credentials and permissions
                        </div>
                    </div>
                    
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p class="text-sm text-blue-800">
                            <strong>API Access:</strong><br>
                            • Read orders and order details<br>
                            • Read customer information<br>
                            • Access product data<br>
                            • Read/Write access: ${consumerKey ? 'Enabled' : 'Demo Mode'}
                        </p>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    completeAuth(storeUrl, consumerKey, consumerSecret) {
        this.baseUrl = `${storeUrl}/wp-json/wc/v3`;
        this.consumerKey = consumerKey || 'demo_consumer_key';
        this.consumerSecret = consumerSecret || 'demo_consumer_secret';
        this.isConnected = true;
        
        // Save auth data
        this.saveAuth();
        
        console.log(`✅ WooCommerce authentication completed for ${storeUrl}`);
        
        // Start initial sync
        this.syncAllData();
    }

    // Clean and validate store URL
    cleanStoreUrl(url) {
        // Remove protocol if present
        let cleanUrl = url.replace(/^https?:\/\//, '');
        
        // Remove trailing slashes
        cleanUrl = cleanUrl.replace(/\/+$/, '');
        
        // Add https protocol
        return `https://${cleanUrl}`;
    }

    // Sync all data from WooCommerce
    async syncAllData() {
        console.log('🔄 Starting WooCommerce data sync...');
        
        try {
            // Show loading state
            this.showSyncModal();
            
            // Simulate API calls (in production, these would be real WooCommerce REST API calls)
            const [orders, customers] = await Promise.all([
                this.fetchOrders(),
                this.fetchCustomers()
            ]);
            
            this.syncedOrders = orders;
            this.syncedCustomers = customers;
            this.lastSync = new Date();
            
            // Save data
            this.saveData();
            
            // Show success
            this.showSyncResults(orders, customers);
            
            console.log(`✅ WooCommerce sync completed: ${orders.length} orders, ${customers.length} customers`);
            
        } catch (error) {
            console.error('❌ WooCommerce sync failed:', error);
            this.showSyncError(error);
        }
    }

    // Fetch orders from WooCommerce API
    async fetchOrders() {
        console.log('📦 Fetching WooCommerce orders...');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate sample WooCommerce orders
        const sampleOrders = [
            {
                id: 1001,
                number: "1001",
                status: "processing",
                currency: "USD",
                total: "89.99",
                date_created: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                billing: {
                    first_name: "Emma",
                    last_name: "Johnson",
                    email: "emma.johnson@gmail.com",
                    phone: "+1-555-0199",
                    address_1: "123 Oak Street",
                    city: "Portland",
                    state: "OR",
                    postcode: "97201",
                    country: "US"
                },
                shipping: {
                    first_name: "Emma",
                    last_name: "Johnson",
                    address_1: "123 Oak Street",
                    city: "Portland", 
                    state: "OR",
                    postcode: "97201",
                    country: "US"
                },
                line_items: [
                    {
                        id: 1,
                        name: "Wireless Bluetooth Earbuds Pro",
                        quantity: 1,
                        price: "89.99",
                        sku: "WBE-PRO-001"
                    }
                ],
                customer_id: 101
            },
            {
                id: 1002,
                number: "1002", 
                status: "on-hold",
                currency: "USD",
                total: "149.99",
                date_created: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                billing: {
                    first_name: "Marcus",
                    last_name: "Chen",
                    email: "marcus.chen@outlook.com",
                    phone: "+1-555-0287",
                    address_1: "456 Pine Avenue",
                    city: "San Diego",
                    state: "CA", 
                    postcode: "92101",
                    country: "US"
                },
                shipping: {
                    first_name: "Marcus",
                    last_name: "Chen",
                    address_1: "456 Pine Avenue",
                    city: "San Diego",
                    state: "CA",
                    postcode: "92101", 
                    country: "US"
                },
                line_items: [
                    {
                        id: 2,
                        name: "Smart Fitness Watch Series 5",
                        quantity: 1,
                        price: "149.99",
                        sku: "SFW-S5-001"
                    }
                ],
                customer_id: 102
            },
            {
                id: 1003,
                number: "1003",
                status: "processing",
                currency: "USD", 
                total: "79.99",
                date_created: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
                billing: {
                    first_name: "Sofia",
                    last_name: "Rodriguez",
                    email: "sofia.rodriguez@yahoo.com",
                    phone: "+1-555-0344",
                    address_1: "789 Maple Drive",
                    city: "Austin",
                    state: "TX",
                    postcode: "73301",
                    country: "US"
                },
                shipping: {
                    first_name: "Sofia", 
                    last_name: "Rodriguez",
                    address_1: "789 Maple Drive",
                    city: "Austin",
                    state: "TX",
                    postcode: "73301",
                    country: "US"
                },
                line_items: [
                    {
                        id: 3,
                        name: "Premium Phone Case with MagSafe",
                        quantity: 2,
                        price: "39.99",
                        sku: "PPC-MAG-001"
                    }
                ],
                customer_id: 103
            }
        ];
        
        return sampleOrders;
    }

    // Fetch customers from WooCommerce API
    async fetchCustomers() {
        console.log('👥 Fetching WooCommerce customers...');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate sample WooCommerce customers
        const sampleCustomers = [
            {
                id: 101,
                email: "emma.johnson@gmail.com",
                first_name: "Emma",
                last_name: "Johnson",
                username: "emma_j",
                date_created: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
                orders_count: 3,
                total_spent: "267.97",
                billing: {
                    first_name: "Emma",
                    last_name: "Johnson",
                    company: "",
                    address_1: "123 Oak Street",
                    city: "Portland",
                    state: "OR",
                    postcode: "97201",
                    country: "US",
                    email: "emma.johnson@gmail.com",
                    phone: "+1-555-0199"
                },
                shipping: {
                    first_name: "Emma",
                    last_name: "Johnson", 
                    company: "",
                    address_1: "123 Oak Street",
                    city: "Portland",
                    state: "OR",
                    postcode: "97201",
                    country: "US"
                }
            },
            {
                id: 102,
                email: "marcus.chen@outlook.com",
                first_name: "Marcus",
                last_name: "Chen",
                username: "marcus_chen",
                date_created: new Date(Date.now() - 1296000000).toISOString(), // 15 days ago
                orders_count: 1,
                total_spent: "149.99",
                billing: {
                    first_name: "Marcus",
                    last_name: "Chen",
                    company: "Tech Solutions Inc",
                    address_1: "456 Pine Avenue",
                    city: "San Diego", 
                    state: "CA",
                    postcode: "92101",
                    country: "US",
                    email: "marcus.chen@outlook.com",
                    phone: "+1-555-0287"
                },
                shipping: {
                    first_name: "Marcus",
                    last_name: "Chen",
                    company: "Tech Solutions Inc",
                    address_1: "456 Pine Avenue",
                    city: "San Diego",
                    state: "CA", 
                    postcode: "92101",
                    country: "US"
                }
            },
            {
                id: 103,
                email: "sofia.rodriguez@yahoo.com",
                first_name: "Sofia",
                last_name: "Rodriguez",
                username: "sofia_r",
                date_created: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
                orders_count: 2,
                total_spent: "159.98",
                billing: {
                    first_name: "Sofia",
                    last_name: "Rodriguez",
                    company: "",
                    address_1: "789 Maple Drive",
                    city: "Austin",
                    state: "TX",
                    postcode: "73301", 
                    country: "US",
                    email: "sofia.rodriguez@yahoo.com",
                    phone: "+1-555-0344"
                },
                shipping: {
                    first_name: "Sofia",
                    last_name: "Rodriguez",
                    company: "",
                    address_1: "789 Maple Drive", 
                    city: "Austin",
                    state: "TX",
                    postcode: "73301",
                    country: "US"
                }
            }
        ];
        
        return sampleCustomers;
    }

    // Show sync progress modal
    showSyncModal() {
        const existingModal = document.querySelector('.woocommerce-sync-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 woocommerce-sync-modal';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div class="p-6 text-center">
                    <div class="text-6xl mb-4">🔄</div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Syncing WooCommerce Data</h2>
                    <p class="text-gray-600 mb-6">Importing orders and customers from your store...</p>
                    
                    <div class="space-y-3">
                        <div class="flex items-center justify-between text-sm">
                            <span>📦 Orders</span>
                            <div class="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                            <span>👥 Customers</span>
                            <div class="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                            <span>📊 Analytics</span>
                            <div class="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Show sync results
    showSyncResults(orders, customers) {
        const modal = document.querySelector('.woocommerce-sync-modal');
        if (modal) {
            modal.innerHTML = `
                <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                    <div class="p-6 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <h2 class="text-2xl font-bold text-gray-800">✅ WooCommerce Sync Complete</h2>
                            <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                    </div>
                    
                    <div class="p-6">
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class="bg-blue-50 rounded-lg p-4 text-center">
                                <div class="text-3xl font-bold text-blue-900">${orders.length}</div>
                                <div class="text-sm text-blue-600">Orders Imported</div>
                            </div>
                            <div class="bg-green-50 rounded-lg p-4 text-center">
                                <div class="text-3xl font-bold text-green-900">${customers.length}</div>
                                <div class="text-sm text-green-600">Customers Imported</div>
                            </div>
                        </div>
                        
                        <div class="space-y-3 mb-6">
                            <h3 class="font-semibold text-gray-800">Recent Orders:</h3>
                            ${orders.slice(0, 3).map(order => `
                                <div class="bg-gray-50 rounded-lg p-3">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <span class="font-medium">#${order.number}</span>
                                            <span class="text-sm text-gray-600">- ${order.billing.first_name} ${order.billing.last_name}</span>
                                        </div>
                                        <span class="text-green-600 font-semibold">$${order.total}</span>
                                    </div>
                                    <div class="text-sm text-gray-500">${order.line_items[0].name}</div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="flex space-x-3">
                            <button onclick="this.closest('.fixed').remove(); window.goToDashboard();" 
                                    class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                📊 Continue to Dashboard
                            </button>
                            <button onclick="this.closest('.fixed').remove()" 
                                    class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Show sync error
    showSyncError(error) {
        const modal = document.querySelector('.woocommerce-sync-modal');
        if (modal) {
            modal.innerHTML = `
                <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                    <div class="p-6 text-center">
                        <div class="text-6xl mb-4">❌</div>
                        <h2 class="text-2xl font-bold text-red-800 mb-4">Sync Failed</h2>
                        <p class="text-gray-600 mb-6">Unable to sync WooCommerce data.</p>
                        <p class="text-sm text-gray-500 mb-6">${error.message}</p>
                        <button onclick="this.closest('.fixed').remove()" 
                                class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                            Close
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // Save authentication data
    saveAuth() {
        const authData = {
            baseUrl: this.baseUrl,
            consumerKey: this.consumerKey,
            consumerSecret: this.consumerSecret,
            connectedAt: new Date().toISOString()
        };
        localStorage.setItem('woocommerce_auth', JSON.stringify(authData));
    }

    // Load saved authentication
    loadSavedAuth() {
        try {
            const saved = localStorage.getItem('woocommerce_auth');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading saved WooCommerce auth:', error);
            return null;
        }
    }

    // Save synced data
    saveData() {
        const data = {
            orders: this.syncedOrders,
            customers: this.syncedCustomers,
            lastSync: this.lastSync.toISOString()
        };
        localStorage.setItem('woocommerce_data', JSON.stringify(data));
    }

    // Load saved data
    loadData() {
        try {
            const saved = localStorage.getItem('woocommerce_data');
            if (saved) {
                const data = JSON.parse(saved);
                this.syncedOrders = data.orders || [];
                this.syncedCustomers = data.customers || [];
                this.lastSync = data.lastSync ? new Date(data.lastSync) : null;
                return true;
            }
        } catch (error) {
            console.error('Error loading WooCommerce data:', error);
        }
        return false;
    }

    // Get all customers for search/dropdown
    getAllCustomers() {
        // Load data if not already loaded
        if (this.syncedCustomers.length === 0) {
            this.loadData();
        }
        
        return this.syncedCustomers.map(customer => ({
            id: customer.id,
            name: `${customer.first_name} ${customer.last_name}`,
            email: customer.email,
            city: customer.billing.city,
            state: customer.billing.state,
            orders: customer.orders_count,
            totalSpent: customer.total_spent,
            platform: 'WooCommerce'
        }));
    }

    // Disconnect
    disconnect() {
        this.isConnected = false;
        this.baseUrl = null;
        this.consumerKey = null;
        this.consumerSecret = null;
        this.syncedOrders = [];
        this.syncedCustomers = [];
        this.lastSync = null;
        
        localStorage.removeItem('woocommerce_auth');
        localStorage.removeItem('woocommerce_data');
        
        console.log('🛒 WooCommerce disconnected');
    }

    // Get connection status
    getStatus() {
        return {
            connected: this.isConnected,
            platform: 'WooCommerce',
            storeUrl: this.baseUrl ? this.baseUrl.replace('/wp-json/wc/v3', '') : null,
            lastSync: this.lastSync,
            orderCount: this.syncedOrders.length,
            customerCount: this.syncedCustomers.length
        };
    }
}

// Export for use in browser or Node.js
if (typeof window !== 'undefined') {
    window.WooCommerceIntegration = WooCommerceIntegration;
} else {
    module.exports = WooCommerceIntegration;
}

console.log('🛒 WooCommerce Integration loaded successfully');