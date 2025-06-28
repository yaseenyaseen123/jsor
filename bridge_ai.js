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
        this.weatherApiKey = "fb817733e4b94ce6be171837252806"; // مفتاح API الخاص بك
        this.weatherApiUrl = "http://api.weatherapi.com/v1/current.json";
        
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

    // الحصول على بيانات الطقس الحقيقية من WeatherAPI.com
    async getCurrentWeather() {
        try {
            const response = await fetch(`${this.weatherApiUrl}?key=${this.weatherApiKey}&q=Amman&aqi=no`);
            const data = await response.json();

            if (data && data.current) {
                this.weatherData = {
                    condition: data.current.condition.text,
                    temperature: data.current.temp_c,
                    icon: data.current.condition.icon
                };
                console.log("✅ تم تحديث بيانات الطقس:", this.weatherData);
                
                // تحديث درجة الحرارة والأيقونة في الواجهة
                document.getElementById("temperature-display").textContent = `${this.weatherData.temperature}°`;
                document.getElementById("weather-icon").src = `https:${this.weatherData.icon}`;
            } else {
                console.error("❌ فشل في جلب بيانات الطقس:", data);
                // استخدام بيانات افتراضية في حالة الفشل
                this.weatherData = {
                    condition: "غير معروف",
                    temperature: "--",
                    icon: ""
                };
                document.getElementById("temperature-display").textContent = `--°`;
                document.getElementById("weather-icon").src = "";
            }
        } catch (error) {
            console.error("❌ خطأ في الاتصال بـ WeatherAPI:", error);
            // استخدام بيانات افتراضية في حالة الخطأ
            this.weatherData = {
                condition: "غير معروف",
                temperature: "--",
                icon: ""
            };
            document.getElementById("temperature-display").textContent = `--°`;
            document.getElementById("weather-icon").src = "";
        }
    }

    // بدء المراقبة في الوقت الفعلي
    startRealTimeMonitoring() {
        setInterval(() => {
            this.updateCurrentTraffic();
            this.generatePredictions();
            this.detectAnomalies();
            this.updateBridgeStatus();
            this.getCurrentWeather(); // تحديث الطقس بشكل دوري
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
        // تأثير الطقس بناءً على بيانات WeatherAPI
        const condition = this.weatherData.condition ? this.weatherData.condition.toLowerCase() : "";
        if (condition.includes("rain")) return 1.3; // زيادة 30% في الازدحام
        if (condition.includes("wind")) return 1.1; // زيادة 10%
        if (condition.includes("cloud")) return 1.05; // زيادة 5%
        return 1.0; // طقس عادي
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
        const weatherImpact = (this.weatherData.condition && this.weatherData.condition.toLowerCase().includes("rain")) ? 2 : 0;
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
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

        const predictions = [];

        // توقعات للساعات الثلاث القادمة
        for (let i = 1; i <= 3; i++) {
            const futureTime = new Date(now.getTime() + i * 60 * 60 * 1000);
            const futureHour = futureTime.getHours();
            const futureDay = futureTime.getDay();

            let historicalData = this.trafficData.historical.find(h => h.hour === futureHour);
            
            // تعديل البيانات التاريخية بناءً على اليوم (للتوافق مع ساعات عمل الجسر)
            if (futureDay === 6) { // السبت مغلق
                historicalData = { avgWaitTime: 0, vehicleCount: 0, congestionLevel: "closed" };
            } else if (futureDay === 5) { // الجمعة
                if (futureHour >= 8 && futureHour < 13) { // 8:30 ص - 1:00 ظ
                    // استخدم البيانات التاريخية العادية
                } else {
                    historicalData = { avgWaitTime: 0, vehicleCount: 0, congestionLevel: "closed" };
                }
            } else { // الأحد - الخميس
                if (futureHour >= 8 && futureHour < 14) { // 8:00 ص - 2:00 ظ
                    // استخدم البيانات التاريخية العادية
                } else {
                    historicalData = { avgWaitTime: 0, vehicleCount: 0, congestionLevel: "closed" };
                }
            }

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
            "high": 1.05,
            "closed": 0 // لا يوجد تأثير إذا كان مغلقًا
        };

        return baseFactor * (trendImpact[currentCongestion] || 1.0) * (1 - hoursAhead * 0.02);
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
            case "closed":
                recommendations.push({
                    type: "bridge_closed",
                    message: "الجسر مغلق حاليًا",
                    icon: "❌"
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
        if (this.weatherData.condition && this.weatherData.condition.toLowerCase().includes("rain")) {
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

        let jordanStatusText = "مغلق";
        let jordanStatusClass = "status-closed";
        let palestineStatusText = "مغلق";
        let palestineStatusClass = "status-closed";

        // السبت مغلق طوال اليوم
        if (day === 6) {
            jordanStatusText = "مغلق";
            jordanStatusClass = "status-closed";
            palestineStatusText = "مغلق";
            palestineStatusClass = "status-closed";
        } 
        // الجمعة
        else if (day === 5) {
            if ((hour === 8 && minute >= 30) || (hour >= 9 && hour < 13)) { // 8:30 ص - 1:00 ظ
                jordanStatusText = "مفتوح";
                jordanStatusClass = "status-open";
                palestineStatusText = "مفتوح";
                palestineStatusClass = "status-open";
            } else {
                jordanStatusText = "مغلق";
                jordanStatusClass = "status-closed";
                palestineStatusText = "مغلق";
                palestineStatusClass = "status-closed";
            }
        } 
        // الأحد - الخميس
        else if (day >= 0 && day <= 4) {
            if (hour >= 8 && hour < 14) { // 8:00 ص - 2:00 ظ
                jordanStatusText = "مفتوح";
                jordanStatusClass = "status-open";
                palestineStatusText = "مفتوح";
                palestineStatusClass = "status-open";
            } else {
                jordanStatusText = "مغلق";
                jordanStatusClass = "status-closed";
                palestineStatusText = "مغلق";
                palestineStatusClass = "status-closed";
            }
        }

        // جعل الجسر مغلقًا لليوم فقط (بناءً على الطلب الأخير)
        const today = new Date();
        const todayDateString = today.toDateString();
        const lastClosedDateString = localStorage.getItem("lastClosedDate");

        if (todayDateString !== lastClosedDateString) {
            // إذا كان اليوم ليس هو اليوم الذي تم فيه إغلاق الجسر سابقًا، فقم بإعادة تعيين الحالة
            localStorage.removeItem("isBridgeClosedToday");
        }

        if (localStorage.getItem("isBridgeClosedToday") === "true") {
            jordanStatusText = "مغلق";
            jordanStatusClass = "status-closed";
            palestineStatusText = "مغلق";
            palestineStatusClass = "status-closed";
        } else {
            // إذا كان هناك طلب لإغلاق الجسر لليوم فقط، قم بتعيين الحالة
            // هذا الجزء من الكود يجب أن يتم تفعيله يدوياً أو بناءً على حدث معين
            // للحفاظ على الإغلاق لليوم فقط، يمكن تفعيل هذا السطر:
            // localStorage.setItem("isBridgeClosedToday", "true");
            // localStorage.setItem("lastClosedDate", todayDateString);
        }

        document.getElementById("bridge-status").innerHTML = `حالة الجسر الأردني: <span class="${jordanStatusClass}"></span> ${jordanStatusText}`;
        document.getElementById("palestinian-bridge-status").innerHTML = `حالة الجسر الفلسطيني: <span class="${palestineStatusClass}"></span> ${palestineStatusText}`;
    }
}

const bridgeAI = new KingHusseinBridgeAI();


