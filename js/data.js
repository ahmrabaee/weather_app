// ============================================
// Early Warning System - Data Management
// localStorage-based data persistence
// ============================================

const DataManager = {
    // Keys for localStorage
    KEYS: {
        ALERTS: 'ews_alerts',
        USER: 'ews_current_user',
        DISSEMINATION_LOG: 'ews_dissemination_log'
    },

    // ============================================
    // Alert Management
    // ============================================

    // Get all alerts
    getAllAlerts() {
        const alertsJson = localStorage.getItem(this.KEYS.ALERTS);
        return alertsJson ? JSON.parse(alertsJson) : [];
    },

    // Get active alerts only
    getActiveAlerts() {
        const alerts = this.getAllAlerts();
        const now = new Date();
        return alerts.filter(alert => {
            const validTo = new Date(alert.validTo);
            return alert.status === 'Active' && validTo > now;
        });
    },

    // Get alert by ID
    getAlertById(id) {
        const alerts = this.getAllAlerts();
        return alerts.find(alert => alert.id === id);
    },

    // Create new alert
    createAlert(alertData) {
        const alerts = this.getAllAlerts();
        const newAlert = {
            id: this.generateAlertId(),
            ...alertData,
            issuedBy: this.getCurrentUser().role,
            issueTime: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            statusBySector: this.initializeSectorStatuses(alertData.status),
            dissemination: {
                sms: { sent: false, timestamp: null },
                whatsapp: { sent: false, timestamp: null },
                email: { sent: false, timestamp: null }
            }
        };

        alerts.push(newAlert);
        localStorage.setItem(this.KEYS.ALERTS, JSON.stringify(alerts));
        return newAlert;
    },

    // Update existing alert
    updateAlert(id, updates) {
        const alerts = this.getAllAlerts();
        const index = alerts.findIndex(alert => alert.id === id);

        if (index === -1) {
            console.error(`Alert not found: ${id}`);
            return null;
        }

        alerts[index] = {
            ...alerts[index],
            ...updates,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem(this.KEYS.ALERTS, JSON.stringify(alerts));
        return alerts[index];
    },

    // Delete alert
    deleteAlert(id) {
        const alerts = this.getAllAlerts();
        const filtered = alerts.filter(alert => alert.id !== id);
        localStorage.setItem(this.KEYS.ALERTS, JSON.stringify(filtered));
        return true;
    },

    // Update sector status for an alert
    updateSectorStatus(alertId, sector, status, notes = '') {
        const alert = this.getAlertById(alertId);
        if (!alert) return null;

        alert.statusBySector[sector] = status;
        if (notes) {
            if (!alert.sectorNotes) {
                alert.sectorNotes = {};
            }
            alert.sectorNotes[sector] = notes;
        }

        return this.updateAlert(alertId, {
            statusBySector: alert.statusBySector,
            sectorNotes: alert.sectorNotes
        });
    },

    // Initialize sector statuses
    initializeSectorStatuses(alertStatus) {
        const sectors = [
            "Meteorology",
            "Civil Defense",
            "Ministry of Agriculture",
            "Water Authority",
            "Environmental Quality Authority",
            "Security Authority"
        ];

        const statuses = {};
        sectors.forEach(sector => {
            if (sector === "Meteorology") {
                statuses[sector] = alertStatus === 'Active' ? 'Issued' : 'Draft';
            } else {
                statuses[sector] = 'Pending';
            }
        });

        return statuses;
    },

    // Generate unique alert ID
    generateAlertId() {
        const alerts = this.getAllAlerts();
        const maxId = alerts.reduce((max, alert) => {
            const num = parseInt(alert.id.replace('ALERT-', ''));
            return num > max ? num : max;
        }, 0);

        return `ALERT-${String(maxId + 1).padStart(4, '0')}`;
    },

    // ============================================
    // User Session Management
    // ============================================

    // Set current user
    setCurrentUser(userData) {
        localStorage.setItem(this.KEYS.USER, JSON.stringify(userData));
    },

    // Get current user
    getCurrentUser() {
        const userJson = localStorage.getItem(this.KEYS.USER);
        return userJson ? JSON.parse(userJson) : null;
    },

    // Logout
    logout() {
        localStorage.removeItem(this.KEYS.USER);
        window.location.href = 'index.html';
    },

    // Check if user is logged in
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },

    // Require login (redirect if not logged in)
    requireLogin() {
        if (!this.isLoggedIn()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    // Check if user has specific role
    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    },

    // ============================================
    // Dissemination Management
    // ============================================

    // Record dissemination
    recordDissemination(alertId, channel, contacts) {
        const alert = this.getAlertById(alertId);
        if (!alert) return null;

        const timestamp = new Date().toISOString();

        // Update alert dissemination status
        alert.dissemination[channel] = {
            sent: true,
            timestamp: timestamp,
            contacts: contacts
        };

        this.updateAlert(alertId, {
            dissemination: alert.dissemination
        });

        // Add to dissemination log
        const log = this.getDisseminationLog();
        log.push({
            id: `LOG-${Date.now()}`,
            alertId: alertId,
            alertTitle: alert.title,
            level: alert.level,
            channel: channel,
            timestamp: timestamp,
            contacts: contacts,
            status: 'OK'
        });

        localStorage.setItem(this.KEYS.DISSEMINATION_LOG, JSON.stringify(log));

        return alert;
    },

    // Get dissemination log
    getDisseminationLog() {
        const logJson = localStorage.getItem(this.KEYS.DISSEMINATION_LOG);
        return logJson ? JSON.parse(logJson) : [];
    },

    // ============================================
    // Mock Data Generation
    // ============================================

    // Initialize with sample data
    initializeSampleData() {
        // Check if data already exists
        if (this.getAllAlerts().length > 0) {
            return; // Don't overwrite existing data
        }

        const sampleAlerts = [
            {
                title: {
                    ar: "موجة حر في رام الله",
                    en: "Heatwave in Ramallah"
                },
                hazardType: "Heatwave",
                level: "Orange",
                validFrom: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
                validTo: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
                affectedAreas: ["Ramallah", "Bethlehem"],
                description: {
                    ar: "موجة حر شديدة متوقعة. ابق رطبًا وتجنب السفر غير الضروري.",
                    en: "Severe heatwave expected. Stay hydrated and avoid unnecessary travel."
                },
                publicAdvice: {
                    ar: ["ابق رطبًا", "تجنب التعرض المباشر للشمس", "راقب كبار السن"],
                    en: ["Stay hydrated", "Avoid direct sun exposure", "Check on elderly people"]
                },
                sectorRecommendations: {
                    "Civil Defense": {
                        ar: "جهز فرق الطوارئ للحالات المرتبطة بالحرارة",
                        en: "Prepare emergency teams for heat-related cases"
                    },
                    "Ministry of Agriculture": {
                        ar: "انصح المزارعين بري المحاصيل بالليل",
                        en: "Advise farmers to irrigate crops at night"
                    },
                    "Water Authority": {
                        ar: "راقب مستويات المياه والاستهلاك",
                        en: "Monitor water levels and consumption"
                    }
                },
                status: "Active"
            },
            {
                title: {
                    ar: "فيضانات محتملة في الأغوار",
                    en: "Potential Flooding in Jordan Valley"
                },
                hazardType: "Flood",
                level: "Yellow",
                validFrom: new Date(Date.now() + 7200000).toISOString(),
                validTo: new Date(Date.now() + 172800000).toISOString(), // 48 hours
                affectedAreas: ["Jericho", "Jordan Valley"],
                description: {
                    ar: "أمطار غزيرة متوقعة قد تؤدي إلى فيضانات في الوديان.",
                    en: "Heavy rainfall expected which may lead to flash floods in valleys."
                },
                publicAdvice: {
                    ar: ["تجنب عبور الوديان", "ابق على اطلاع بالأخبار الرسمية"],
                    en: ["Avoid wadi crossings", "Stay tuned to official channels"]
                },
                sectorRecommendations: {
                    "Civil Defense": {
                        ar: "جهز فرق الإنقاذ بالقرب من الوديان المعرضة للفيضانات",
                        en: "Prepare rescue teams near flood-prone wadis"
                    },
                    "Water Authority": {
                        ar: "راقب مقاييس الفيضانات وحالة الخزانات",
                        en: "Monitor flood gauges and reservoir status"
                    }
                },
                status: "Active"
            }
        ];

        sampleAlerts.forEach(alertData => this.createAlert(alertData));
    },

    // Clear all data
    clearAllData() {
        localStorage.removeItem(this.KEYS.ALERTS);
        localStorage.removeItem(this.KEYS.DISSEMINATION_LOG);
        // Don't clear user session
    },

    // Export data (for debugging)
    exportData() {
        return {
            alerts: this.getAllAlerts(),
            user: this.getCurrentUser(),
            disseminationLog: this.getDisseminationLog()
        };
    }
};

// Initialize sample data on first load
document.addEventListener('DOMContentLoaded', () => {
    DataManager.initializeSampleData();
});
