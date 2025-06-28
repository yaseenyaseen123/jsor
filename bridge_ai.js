// نظام الذكاء الاصطناعي المتقدم لمراقبة جسر الملك حسين
class KingHusseinBridgeAI {
    constructor() {
        this.trafficData = {
            historical: [],
            current: {},
            predictions: {}
        };
        this.weatherData = {};
        this.eventData = [];
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        console.log("🤖 تهيئة نظام الذكاء الاصطناعي...");
        await this.loadHistoricalData();
        await this.getCurrentWeather();
        this.startRealTimeMonitoring();
        this.isInitialized = true;
        console.log("✅ تم تهيئة النظام بنجاح");
    }

    // محاكاة تحميل البيانات التاريخية
    async loadHistoricalData() {
        return new Promise(resolve => {
            setTimeout(() => {
                // بيانات تاريخية محاكاة لأنماط الازدحام
                this.trafficData.historical = [
                    { hour: 8, avgWaitTime: 15, vehicleCount: 120, congestionLevel: "low" },
                    { hour: 9, avgWaitTime: 25, vehicleCount: 180, congestionLevel: "medium" },
                    { hour: 10, avgWaitTime: 20, vehicleCount: 150, congestionLevel: "medium" },
                    { hour: 11, avgWaitTime: 18, vehicleCount: 140, congestionLevel: "low" },
                    { hour: 12, avgWaitTime: 30, vehicleCount: 200, congestionLevel: "high" },
                    { hour: 13, avgWaitTime: 35, vehicleCount: 220, congestionLevel: "high" },
                    { hour: 14, avgWaitTime: 12, vehicleCount: 80, congestionLevel: "low" }
                ];
                resolve();
            }, 500);
        });
    }

    // محاكاة الحصول على بيانات الطقس
    async getCurrentWeather() {
        return new Promise(resolve => {
            setTimeout(() => {
                const weatherConditions = ["sunny", "cloudy", "rainy", "windy"];
                this.weatherData = {
                    condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
                    temperature: Math.floor(Math.random() * 20) + 20, // 20-40 درجة
                    visibility: Math.floor(Math.random() * 5) + 5, // 5-10 كم
                    windSpeed: Math.floor(Math.random() * 20) + 5 // 5-25 كم/س
                };
                resolve();
            }, 300);
        });
    }

    // بدء المراقبة في الوقت الفعلي
    startRealTimeMonitoring() {
        setInterval(() => {
            this.updateCurrentTraffic();
            this.generatePredictions();
            this.detectAnomalies();
            this.updateBridgeStatus(); // إضافة تحديث حالة الجسر
        }, 30000); // تحديث كل 30 ثانية
        this.updateBridgeStatus(); // تحديث فوري عند التحميل
    }

    // تحديث بيانات الازدحام الحالية
    updateCurrentTraffic() {
        const currentHour = new Date().getHours();
        const baseData = this.trafficData.historical.find(h => h.hour === currentHour) || 
                        this.trafficData.historical[0];

        // إضافة عشوائية للمحاكاة
        const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
        const weatherImpact = this.getWeatherImpact();

        this.trafficData.current = {
            timestamp: new Date(),
            waitTime: Math.round(baseData.avgWaitTime * randomFactor * weatherImpact),
            vehicleCount: Math.round(baseData.vehicleCount * randomFactor * weatherImpact),
            congestionLevel: this.calculateCongestionLevel(baseData.avgWaitTime * randomFactor * weatherImpact),
            roadConditions: this.assessRoadConditions(),
            estimatedProcessingTime: this.calculateProcessingTime()
        };
    }

    // تأثير الطقس على الازدحام
    getWeatherImpact() {
        switch(this.weatherData.condition) {
            case "rainy": return 1.3; // زيادة 30% في الازدحام
            case "windy": return 1.1; // زيادة 10%
            case "cloudy": return 1.05; // زيادة 5%
            default: return 1.0; // طقس عادي
        }
    }

    // حساب مستوى الازدحام
    calculateCongestionLevel(waitTime) {
        if (waitTime < 15) return "low";
        if (waitTime < 25) return "medium";
        return "high";
    }

    // تقييم حالة الطرق
    assessRoadConditions() {
        const conditions = ["excellent", "good", "fair", "poor"];
        const weatherImpact = this.weatherData.condition === "rainy" ? 2 : 0;
        const index = Math.min(Math.floor(Math.random() * 2) + weatherImpact, 3);
        return conditions[index];
    }

    // حساب وقت المعالجة المتوقع
    calculateProcessingTime() {
        const baseTime = 5; // 5 دقائق أساسية
        const congestionMultiplier = {
            "low": 1,
            "medium": 1.5,
            "high": 2.2
        };
        
        return Math.round(baseTime * congestionMultiplier[this.trafficData.current.congestionLevel]);
    }

    // توليد التوقعات
    generatePredictions() {
        const currentHour = new Date().getHours();
        const predictions = [];

        // توقعات للساعات الثلاث القادمة
        for (let i = 1; i <= 3; i++) {
            const futureHour = (currentHour + i) % 24;
            const historicalData = this.trafficData.historical.find(h => h.hour === futureHour);
            
            if (historicalData) {
                const trendFactor = this.calculateTrendFactor(i);
                predictions.push({
                    hour: futureHour,
                    predictedWaitTime: Math.round(historicalData.avgWaitTime * trendFactor),
                    predictedCongestion: this.calculateCongestionLevel(historicalData.avgWaitTime * trendFactor),
                    confidence: Math.round((95 - i * 5) + Math.random() * 10) // تقل الثقة مع الوقت
                });
            }
        }

        this.trafficData.predictions = predictions;
    }

    // حساب عامل الاتجاه
    calculateTrendFactor(hoursAhead) {
        const currentCongestion = this.trafficData.current.congestionLevel;
        const baseFactor = 1.0;
        
        // تأثير الاتجاه الحالي
        const trendImpact = {
            "low": 0.95,
            "medium": 1.0,
            "high": 1.05
        };

        return baseFactor * trendImpact[currentCongestion] * (1 - hoursAhead * 0.02);
    }

    // كشف الشذوذ
    detectAnomalies() {
        const current = this.trafficData.current;
        const currentHour = new Date().getHours();
        const expected = this.trafficData.historical.find(h => h.hour === currentHour);

        if (expected && current.waitTime > expected.avgWaitTime * 1.5) {
            this.triggerAlert({
                type: "high_congestion",
                message: "تم رصد ازدحام غير عادي في الجسر",
                severity: "warning",
                timestamp: new Date(),
                recommendations: [
                    "تجنب السفر في الوقت الحالي إن أمكن",
                    "استخدام طرق بديلة",
                    "انتظار تحسن الأوضاع خلال 30-45 دقيقة"
                ]
            });
        }
    }

    // إطلاق التنبيهات
    triggerAlert(alert) {
        console.log("🚨 تنبيه:", alert);
        
        // إضافة التنبيه إلى واجهة المستخدم
        const alertContainer = document.getElementById("alerts-container");
        if (alertContainer) {
            const alertElement = document.createElement("div");
            alertElement.className = `alert alert-${alert.severity}`;
            alertElement.innerHTML = `
                <div class="alert-header">
                    <span class="alert-icon">⚠️</span>
                    <span class="alert-title">${alert.type}</span>
                    <span class="alert-time">${alert.timestamp.toLocaleTimeString("ar-JO")}</span>
                </div>
                <div class="alert-message">${alert.message}</div>
                <div class="alert-recommendations">
                    ${alert.recommendations.map(rec => `<li>${rec}</li>`).join("")}
                </div>
            `;
            alertContainer.appendChild(alertElement);
        }
    }

    // الحصول على التوصيات الذكية
    getSmartRecommendations() {
        const current = this.trafficData.current;
        const predictions = this.trafficData.predictions;
        const recommendations = [];

        // توصيات بناءً على الوضع الحالي
        switch(current.congestionLevel) {
            case "low":
                recommendations.push({
                    type: "optimal_time",
                    message: "الوقت الحالي مثالي للسفر",
                    icon: "✅"
                });
                break;
            case "medium":
                recommendations.push({
                    type: "moderate_delay",
                    message: "توقع تأخير طفيف، يُنصح بالصبر",
                    icon: "⏳"
                });
                break;
            case "high":
                recommendations.push({
                    type: "avoid_travel",
                    message: "يُنصح بتأجيل السفر إن أمكن",
                    icon: "🚫"
                });
                break;
        }

        // توصيات بناءً على التوقعات
        if (predictions.length > 0) {
            const nextHourPrediction = predictions[0];
            if (nextHourPrediction.predictedCongestion === "low" && current.congestionLevel !== "low") {
                recommendations.push({
                    type: "wait_suggestion",
                    message: `الأوضاع ستتحسن خلال ساعة (الساعة ${nextHourPrediction.hour}:00)`,
                    icon: "⏰"
                });
            }
        }

        // توصيات بناءً على الطقس
        if (this.weatherData.condition === "rainy") {
            recommendations.push({
                type: "weather_warning",
                message: "احذر من الأمطار، قد تؤثر على أوقات السفر",
                icon: "🌧️"
            });
        }

        return recommendations;
    }

    // الحصول على إحصائيات شاملة
    getComprehensiveStats() {
        return {
            current: this.trafficData.current,
            predictions: this.trafficData.predictions,
            weather: this.weatherData,
            recommendations: this.getSmartRecommendations(),
            systemStatus: {
                isOnline: true,
                lastUpdate: new Date(),
                dataQuality: "high",
                aiConfidence: Math.round(85 + Math.random() * 10) // 85-95%
            }
        };
    }

    // تحديث حالة الجسر بناءً على اليوم والوقت
    updateBridgeStatus() {
        const now = new Date();
        const day = now.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        const hour = now.getHours();
        const minute = now.getMinutes();

        let statusText = "مغلق";
        let statusClass = "status-closed";

        const jordanStatusTextElement = document.getElementById("status-text");
        const jordanStatusIndicatorElement = document.getElementById("status-indicator");
        const palStatusTextElement = document.getElementById("pal-status-text");
        const palStatusIndicatorElement = document.getElementById("pal-status-indicator");

        if (jordanStatusTextElement && jordanStatusIndicatorElement) {
            jordanStatusTextElement.textContent = statusText;
            jordanStatusIndicatorElement.className = `status-indicator ${statusClass}`;
        }

        if (palStatusTextElement && palStatusIndicatorElement) {
            palStatusTextElement.textContent = statusText;
            palStatusIndicatorElement.className = `status-indicator ${statusClass}`;
        }
    }
}

// تهيئة النظام
const bridgeAI = new KingHusseinBridgeAI();

// تصدير للاستخدام العام
window.bridgeAI = bridgeAI;



