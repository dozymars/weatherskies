// Lightweight i18n dictionary for Weatherskies.
// 8 languages: English, Spanish, French, German, Chinese (Simplified), Arabic, Hindi, Portuguese.
// No external i18n library — hand-rolled dictionary + helper functions.

export const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧", locale: "en-US", rtl: false },
  { code: "es", label: "Español", flag: "🇪🇸", locale: "es-ES", rtl: false },
  { code: "fr", label: "Français", flag: "🇫🇷", locale: "fr-FR", rtl: false },
  { code: "de", label: "Deutsch", flag: "🇩🇪", locale: "de-DE", rtl: false },
  { code: "zh", label: "中文", flag: "🇨🇳", locale: "zh-CN", rtl: false },
  { code: "ar", label: "العربية", flag: "🇸🇦", locale: "ar-SA", rtl: true },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳", locale: "hi-IN", rtl: false },
  { code: "pt", label: "Português", flag: "🇵🇹", locale: "pt-BR", rtl: false },
];

export function getLanguageByCode(code) {
  return LANGUAGES.find((l) => l.code === code);
}

export function detectLanguage() {
  try {
    const nav = navigator.language || navigator.userLanguage || "en";
    const primary = nav.toLowerCase().split(/[-_]/)[0];
    if (getLanguageByCode(primary)) return primary;
  } catch {}
  return "en";
}

// ---------------------------------------------------------------------------
// UI string dictionary
// ---------------------------------------------------------------------------
export const STRINGS = {
  "nav.lifestyle": { en: "Lifestyle", es: "Estilo de vida", fr: "Lifestyle", de: "Lifestyle", zh: "生活", ar: "نمط الحياة", hi: "लाइफस्टाइल", pt: "Lifestyle" },
  "nav.saved": { en: "Saved", es: "Guardados", fr: "Enregistrés", de: "Gespeichert", zh: "已保存", ar: "المحفوظة", hi: "सहेजे गए", pt: "Salvos" },
  "nav.home": { en: "Home", es: "Inicio", fr: "Accueil", de: "Start", zh: "首页", ar: "الرئيسية", hi: "होम", pt: "Início" },
  "nav.about": { en: "About", es: "Acerca de", fr: "À propos", de: "Über uns", zh: "关于", ar: "حول", hi: "परिचय", pt: "Sobre" },
  "nav.contact": { en: "Contact", es: "Contacto", fr: "Contact", de: "Kontakt", zh: "联系", ar: "اتصل", hi: "संपर्क", pt: "Contato" },
  "nav.backToApp": { en: "Back to app", es: "Volver a la app", fr: "Retour à l'app", de: "Zurück zur App", zh: "返回应用", ar: "العودة إلى التطبيق", hi: "ऐप पर वापस", pt: "Voltar ao app" },

  "search.placeholder": { en: "Search city or place…", es: "Buscar ciudad o lugar…", fr: "Rechercher une ville…", de: "Stadt oder Ort suchen…", zh: "搜索城市或地点…", ar: "ابحث عن مدينة أو مكان…", hi: "शहर या स्थान खोजें…", pt: "Buscar cidade ou lugar…" },
  "search.useMyLocation": { en: "Use my location", es: "Usar mi ubicación", fr: "Utiliser ma position", de: "Meinen Standort verwenden", zh: "使用我的位置", ar: "استخدم موقعي", hi: "मेरा स्थान उपयोग करें", pt: "Usar minha localização" },
  "search.searching": { en: "Searching…", es: "Buscando…", fr: "Recherche…", de: "Suche…", zh: "搜索中…", ar: "جارٍ البحث…", hi: "खोज रहे हैं…", pt: "Procurando…" },

  "theme.title": { en: "Background theme", es: "Tema de fondo", fr: "Thème d'arrière-plan", de: "Hintergrundthema", zh: "背景主题", ar: "سمة الخلفية", hi: "बैकग्राउंड थीम", pt: "Tema de fundo" },
  "theme.auto": { en: "Auto", es: "Automático", fr: "Auto", de: "Auto", zh: "自动", ar: "تلقائي", hi: "ऑटो", pt: "Automático" },
  "theme.white": { en: "White", es: "Blanco", fr: "Blanc", de: "Weiß", zh: "白色", ar: "أبيض", hi: "सफ़ेद", pt: "Branco" },
  "theme.sunset": { en: "Sunset Glow", es: "Brillo del atardecer", fr: "Lueur du coucher", de: "Sonnenuntergang", zh: "日落光辉", ar: "توهج الغروب", hi: "सूर्यास्त आभा", pt: "Brilho do pôr do sol" },
  "theme.aurora": { en: "Aurora Teal", es: "Verde aurora", fr: "Aurore sarcelle", de: "Aurora-Türkis", zh: "极光青", ar: "شفق أخضر", hi: "अरोरा टील", pt: "Aurora Turquesa" },
  "theme.duskrose": { en: "Dusk Rose", es: "Rosa crepuscular", fr: "Rose crépuscule", de: "Dämmerungsrose", zh: "暮色玫瑰", ar: "وردة الغسق", hi: "गोधूलि गुलाबी", pt: "Rosa do entardecer" },

  "loading.forecast": { en: "Loading forecast…", es: "Cargando pronóstico…", fr: "Chargement des prévisions…", de: "Vorhersage wird geladen…", zh: "正在加载天气预报…", ar: "جارٍ تحميل التوقعات…", hi: "पूर्वानुमान लोड हो रहा है…", pt: "Carregando previsão…" },
  "loading.lifestyle": { en: "Loading lifestyle data…", es: "Cargando datos de estilo de vida…", fr: "Chargement des données lifestyle…", de: "Lifestyle-Daten werden geladen…", zh: "正在加载生活数据…", ar: "جارٍ تحميل بيانات نمط الحياة…", hi: "लाइफस्टाइल डेटा लोड हो रहा है…", pt: "Carregando dados de lifestyle…" },
  "error.forecast": { en: "Unable to load forecast. Please try again.", es: "No se pudo cargar el pronóstico. Inténtalo de nuevo.", fr: "Impossible de charger les prévisions. Réessayez.", de: "Vorhersage konnte nicht geladen werden. Bitte erneut versuchen.", zh: "无法加载天气预报，请重试。", ar: "تعذّر تحميل التوقعات. حاول مرة أخرى.", hi: "पूर्वानुमान लोड नहीं हो सका। कृपया पुनः प्रयास करें।", pt: "Não foi possível carregar a previsão. Tente novamente." },
  "error.retry": { en: "Retry", es: "Reintentar", fr: "Réessayer", de: "Erneut versuchen", zh: "重试", ar: "إعادة المحاولة", hi: "पुनः प्रयास", pt: "Tentar novamente" },

  "current.feelsLike": { en: "Feels Like", es: "Sensación", fr: "Ressenti", de: "Gefühlt", zh: "体感温度", ar: "الإحساس", hi: "महसूस", pt: "Sensação" },
  "current.humidity": { en: "Humidity", es: "Humedad", fr: "Humidité", de: "Luftfeuchte", zh: "湿度", ar: "الرطوبة", hi: "नमी", pt: "Umidade" },
  "current.wind": { en: "Wind", es: "Viento", fr: "Vent", de: "Wind", zh: "风", ar: "الرياح", hi: "हवा", pt: "Vento" },
  "current.pressure": { en: "Pressure", es: "Presión", fr: "Pression", de: "Luftdruck", zh: "气压", ar: "الضغط", hi: "दबाव", pt: "Pressão" },
  "current.precipitation": { en: "Precipitation", es: "Precipitación", fr: "Précipitations", de: "Niederschlag", zh: "降水量", ar: "الهطول", hi: "वर्षा", pt: "Precipitação" },
  "current.sunrise": { en: "Sunrise", es: "Amanecer", fr: "Lever du soleil", de: "Sonnenaufgang", zh: "日出", ar: "الشروق", hi: "सूर्योदय", pt: "Nascer do sol" },
  "current.sunset": { en: "Sunset", es: "Atardecer", fr: "Coucher du soleil", de: "Sonnenuntergang", zh: "日落", ar: "الغروب", hi: "सूर्यास्त", pt: "Pôr do sol" },

  "hourly.title": { en: "Hourly Forecast", es: "Pronóstico por hora", fr: "Prévisions horaires", de: "Stündliche Vorhersage", zh: "逐小时预报", ar: "توقعات بالساعة", hi: "प्रति घंटा पूर्वानुमान", pt: "Previsão por hora" },
  "hourly.now": { en: "Now", es: "Ahora", fr: "Maintenant", de: "Jetzt", zh: "现在", ar: "الآن", hi: "अभी", pt: "Agora" },

  "daily.title": { en: "10-Day Forecast", es: "Pronóstico de 10 días", fr: "Prévisions sur 10 jours", de: "10-Tage-Vorhersage", zh: "10天预报", ar: "توقعات 10 أيام", hi: "10-दिन पूर्वानुमान", pt: "Previsão de 10 dias" },
  "daily.today": { en: "Today", es: "Hoy", fr: "Aujourd'hui", de: "Heute", zh: "今天", ar: "اليوم", hi: "आज", pt: "Hoje" },
  "daily.windInUnit": { en: "Wind in {unit}", es: "Viento en {unit}", fr: "Vent en {unit}", de: "Wind in {unit}", zh: "风速单位：{unit}", ar: "الرياح بـ{unit}", hi: "हवा {unit} में", pt: "Vento em {unit}" },

  "dayDetail.uvIndex": { en: "UV Index", es: "Índice UV", fr: "Indice UV", de: "UV-Index", zh: "紫外线指数", ar: "مؤشر الأشعة فوق البنفسجية", hi: "यूवी सूचकांक", pt: "Índice UV" },
  "dayDetail.hourly": { en: "Hourly", es: "Por hora", fr: "Horaire", de: "Stündlich", zh: "每小时", ar: "بالساعة", hi: "प्रति घंटा", pt: "Por hora" },
  "uv.low": { en: "Low", es: "Bajo", fr: "Faible", de: "Niedrig", zh: "低", ar: "منخفض", hi: "कम", pt: "Baixo" },
  "uv.moderate": { en: "Moderate", es: "Moderado", fr: "Modéré", de: "Mäßig", zh: "中等", ar: "متوسط", hi: "मध्यम", pt: "Moderado" },
  "uv.high": { en: "High", es: "Alto", fr: "Élevé", de: "Hoch", zh: "高", ar: "مرتفع", hi: "उच्च", pt: "Alto" },
  "uv.veryHigh": { en: "Very High", es: "Muy alto", fr: "Très élevé", de: "Sehr hoch", zh: "很高", ar: "مرتفع جداً", hi: "बहुत उच्च", pt: "Muito alto" },
  "uv.extreme": { en: "Extreme", es: "Extremo", fr: "Extrême", de: "Extrem", zh: "极强", ar: "بالغة", hi: "अत्यधिक", pt: "Extremo" },

  "chart.next24": { en: "Next 24 Hours", es: "Próximas 24 horas", fr: "Prochaines 24 heures", de: "Nächste 24 Stunden", zh: "未来24小时", ar: "الـ24 ساعة القادمة", hi: "अगले 24 घंटे", pt: "Próximas 24 horas" },
  "chart.temp": { en: "Temp", es: "Temp", fr: "Temp", de: "Temp", zh: "温度", ar: "الحرارة", hi: "ताप", pt: "Temp" },
  "chart.precipPct": { en: "Precip %", es: "Lluvia %", fr: "Précip. %", de: "Nieders. %", zh: "降水%", ar: "الهطول %", hi: "वर्षा %", pt: "Chuva %" },
  "chart.precipTooltip": { en: "{n}% precip", es: "{n}% lluvia", fr: "{n}% précip.", de: "{n}% Nieders.", zh: "{n}% 降水", ar: "{n}% هطول", hi: "{n}% वर्षा", pt: "{n}% chuva" },

  "env.environment": { en: "Environment", es: "Entorno", fr: "Environnement", de: "Umwelt", zh: "环境", ar: "البيئة", hi: "पर्यावरण", pt: "Ambiente" },
  "env.weatherNews": { en: "Weather News", es: "Noticias meteorológicas", fr: "Actualités météo", de: "Wetternachrichten", zh: "天气新闻", ar: "أخبار الطقس", hi: "मौसम समाचार", pt: "Notícias meteorológicas" },
  "env.air": { en: "Air", es: "Aire", fr: "Air", de: "Luft", zh: "空气", ar: "الهواء", hi: "वायु", pt: "Ar" },

  "alert.active": { en: "Active alert", es: "Alerta activa", fr: "Alerte active", de: "Aktive Warnung", zh: "活跃警报", ar: "تنبيه ساري", hi: "सक्रिय अलर्ट", pt: "Alerta ativo" },
  "alert.issuedBy": { en: "Issued by {name}", es: "Emitido por {name}", fr: "Émis par {name}", de: "Ausgegeben von {name}", zh: "发布者：{name}", ar: "صادر عن {name}", hi: "{name} द्वारा जारी", pt: "Emitido por {name}" },
  "alert.until": { en: "Until {date}", es: "Hasta {date}", fr: "Jusqu'au {date}", de: "Bis {date}", zh: "截至 {date}", ar: "حتى {date}", hi: "{date} तक", pt: "Até {date}" },
  "alert.nws": { en: "NWS", es: "NWS", fr: "NWS", de: "NWS", zh: "NWS", ar: "NWS", hi: "NWS", pt: "NWS" },
  "severity.Extreme": { en: "Extreme", es: "Extrema", fr: "Extrême", de: "Extrem", zh: "极重", ar: "بالغة", hi: "अत्यधिक", pt: "Extrema" },
  "severity.Severe": { en: "Severe", es: "Severa", fr: "Sévère", de: "Schwer", zh: "严重", ar: "شديدة", hi: "गंभीर", pt: "Grave" },
  "severity.Moderate": { en: "Moderate", es: "Moderada", fr: "Modérée", de: "Mäßig", zh: "中等", ar: "متوسطة", hi: "मध्यम", pt: "Moderada" },
  "severity.Minor": { en: "Minor", es: "Menor", fr: "Mineure", de: "Gering", zh: "轻微", ar: "طفيفة", hi: "हल्का", pt: "Menor" },

  "news.unable": { en: "Unable to load weather news.", es: "No se pueden cargar las noticias meteorológicas.", fr: "Impossible de charger les actualités météo.", de: "Wetternachrichten konnten nicht geladen werden.", zh: "无法加载天气新闻。", ar: "تعذّر تحميل أخبار الطقس.", hi: "मौसम समाचार लोड नहीं हो सके।", pt: "Não foi possível carregar as notícias meteorológicas." },
  "news.empty": { en: "No recent weather news found.", es: "No se encontraron noticias recientes.", fr: "Aucune actualité météo récente.", de: "Keine aktuellen Wetternachrichten gefunden.", zh: "未找到近期天气新闻。", ar: "لا توجد أخبار طقس حديثة.", hi: "कोई हालिया मौसम समाचार नहीं मिला।", pt: "Nenhuma notícia meteorológica recente." },
  "news.local": { en: "Local", es: "Local", fr: "Local", de: "Lokal", zh: "本地", ar: "محلي", hi: "स्थानीय", pt: "Local" },
  "news.national": { en: "National", es: "Nacional", fr: "National", de: "National", zh: "全国", ar: "وطني", hi: "राष्ट्रीय", pt: "Nacional" },
  "news.global": { en: "Global", es: "Global", fr: "Mondial", de: "Global", zh: "全球", ar: "عالمي", hi: "वैश्विक", pt: "Global" },
  "news.footer": { en: "Top global weather & disaster news — refreshed weekly", es: "Principales noticias globales de clima y desastres — actualizadas semanalmente", fr: "Principales actualités mondiales météo et catastrophes — mises à jour chaque semaine", de: "Top globale Wetter- und Katastrophennachrichten — wöchentlich aktualisiert", zh: "全球重要天气与灾害新闻 — 每周更新", ar: "أهم أخبار الطقس والكوارث العالمية — تُحدّث أسبوعياً", hi: "शीर्ष वैश्विक मौसम और आपदा समाचार — साप्ताहिक अपडेट", pt: "Principais notícias globais de clima e desastres — atualizadas semanalmente" },

  "air.unavailable": { en: "Air data unavailable.", es: "Datos del aire no disponibles.", fr: "Données air indisponibles.", de: "Luftdaten nicht verfügbar.", zh: "空气质量数据不可用。", ar: "بيانات الهواء غير متاحة.", hi: "वायु डेटा अनुपलब्ध।", pt: "Dados do ar indisponíveis." },
  "aqi.good": { en: "Good", es: "Bueno", fr: "Bon", de: "Gut", zh: "优", ar: "جيد", hi: "अच्छा", pt: "Boa" },
  "aqi.goodAdvice": { en: "Air quality is satisfactory; air pollution poses little or no risk.", es: "La calidad del aire es satisfactoria; la contaminación supone poco o ningún riesgo.", fr: "La qualité de l'air est satisfaisante ; la pollution présente peu ou pas de risque.", de: "Die Luftqualität ist zufriedenstellend; wenig oder kein Gesundheitsrisiko.", zh: "空气质量令人满意，空气污染风险很小或没有。", ar: "جودة الهواء مرضية؛ التلوث يشكّل خطراً ضئيلاً أو معدوماً.", hi: "वायु गुणवत्ता संतोषजनक है; प्रदूषण से बहुत कम या कोई जोखिम नहीं।", pt: "A qualidade do ar é satisfatória; a poluição apresenta pouco ou nenhum risco." },
  "aqi.moderate": { en: "Moderate", es: "Moderado", fr: "Modéré", de: "Mäßig", zh: "良", ar: "متوسط", hi: "मध्यम", pt: "Moderada" },
  "aqi.moderateAdvice": { en: "Unusually sensitive people should consider limiting prolonged outdoor exertion.", es: "Las personas inusualmente sensibles deberían limitar el esfuerzo prolongado al aire libre.", fr: "Les personnes unusually sensibles devraient limiter les efforts prolongés à l'extérieur.", de: "Ungewöhnlich empfindliche Personen sollten längere Anstrengung im Freien einschränken.", zh: "异常敏感人群应考虑限制长时间的户外活动。", ar: "ينبغي للأشخاص شديدي الحساسية الحد من المجهود الطويل في الخارج.", hi: "असामान्य रूप से संवेदनशील लोगों को लंबे बाहरी परिश्रम को सीमित करना चाहिए।", pt: "Pessoas incomumente sensíveis devem considerar limitar esforço prolongado ao ar livre." },
  "aqi.usg": { en: "Unhealthy for Sensitive Groups", es: "Insalubre para grupos sensibles", fr: "Insalubre pour groupes sensibles", de: "Ungesund für empfindliche Gruppen", zh: "对敏感人群不健康", ar: "غير صحي للفئات الحساسة", hi: "संवेदनशील वर्गों के लिए अस्वस्थ", pt: "Insalubre para grupos sensíveis" },
  "aqi.usgAdvice": { en: "Sensitive groups should limit outdoor exertion.", es: "Los grupos sensibles deben limitar el esfuerzo al aire libre.", fr: "Les groupes sensibles doivent limiter les efforts à l'extérieur.", de: "Empfindliche Gruppen sollten Anstrengung im Freien einschränken.", zh: "敏感人群应减少户外活动。", ar: "يجب على الفئات الحساسة الحد من المجهود في الخارج.", hi: "संवेदनशील वर्गों को बाहरी परिश्रम सीमित करना चाहिए।", pt: "Grupos sensíveis devem limitar esforço ao ar livre." },
  "aqi.unhealthy": { en: "Unhealthy", es: "Insalubre", fr: "Insalubre", de: "Ungesund", zh: "中度污染", ar: "غير صحي", hi: "अस्वस्थ", pt: "Insalubre" },
  "aqi.unhealthyAdvice": { en: "Everyone may begin to experience health effects; limit outdoor activity.", es: "Todos pueden empezar a notar efectos; limita la actividad al aire libre.", fr: "Tout le monde peut ressentir des effets ; limitez les activités extérieures.", de: "Alle können gesundheitliche Auswirkungen spüren; Aktivität im Freien einschränken.", zh: "所有人都可能受到影响；减少户外活动。", ar: "قد يبدأ الجميع بملاحظة آثار صحية؛ قلّلوا النشاط في الخارج.", hi: "सभी को स्वास्थ्य प्रभाव महसूस हो सकता है; बाहरी गतिविधि सीमित करें।", pt: "Todos podem começar a sentir efeitos; limite atividades ao ar livre." },
  "aqi.veryUnhealthy": { en: "Very Unhealthy", es: "Muy insalubre", fr: "Très insalubre", de: "Sehr ungesund", zh: "重度污染", ar: "غير صحي جداً", hi: "बहुत अस्वस्थ", pt: "Muito insalubre" },
  "aqi.veryUnhealthyAdvice": { en: "Health alert: avoid prolonged outdoor exertion.", es: "Alerta sanitaria: evita el esfuerzo prolongado al aire libre.", fr: "Alerte sanitaire : évitez les efforts prolongés à l'extérieur.", de: "Gesundheitswarnung: längere Anstrengung im Freien vermeiden.", zh: "健康警报：避免长时间户外活动。", ar: "تنبيه صحي: تجنب المجهود الطويل في الخارج.", hi: "स्वास्थ्य अलर्ट: लंबे बाहरी परिश्रम से बचें।", pt: "Alerta de saúde: evite esforço prolongado ao ar livre." },
  "aqi.hazardous": { en: "Hazardous", es: "Peligroso", fr: "Dangereux", de: "Gefährlich", zh: "严重污染", ar: "خطر", hi: "खतरनाक", pt: "Perigoso" },
  "aqi.hazardousAdvice": { en: "Emergency conditions. Everyone should avoid outdoor activity.", es: "Condiciones de emergencia. Todos deben evitar la actividad al aire libre.", fr: "Conditions d'urgence. Tous doivent éviter les activités extérieures.", de: "Notfallbedingungen. Alle sollten Aktivitäten im Freien vermeiden.", zh: "紧急情况。所有人应避免户外活动。", ar: "حالات طارئة. على الجميع تجنب النشاط في الخارج.", hi: "आपातकालीन स्थिति। सभी को बाहरी गतिविधि से बचना चाहिए।", pt: "Condições de emergência. Todos devem evitar atividades ao ar livre." },
  "pollen.low": { en: "Low", es: "Bajo", fr: "Faible", de: "Niedrig", zh: "低", ar: "منخفض", hi: "कम", pt: "Baixo" },
  "pollen.moderate": { en: "Moderate", es: "Moderado", fr: "Modéré", de: "Mäßig", zh: "中", ar: "متوسط", hi: "मध्यम", pt: "Moderado" },
  "pollen.high": { en: "High", es: "Alto", fr: "Élevé", de: "Hoch", zh: "高", ar: "مرتفع", hi: "उच्च", pt: "Alto" },
  "pollen.tree": { en: "Tree", es: "Árbol", fr: "Arbre", de: "Baum", zh: "树木", ar: "شجرة", hi: "पेड़", pt: "Árvore" },
  "pollen.grass": { en: "Grass", es: "Hierba", fr: "Herbe", de: "Gras", zh: "草", ar: "عشب", hi: "घास", pt: "Grama" },
  "pollen.weed": { en: "Weed", es: "Maleza", fr: "Mauvaise herbe", de: "Unkraut", zh: "杂草", ar: "أعشاب", hi: "खरपतवार", pt: "Erva" },

  "refresh.refreshing": { en: "Refreshing…", es: "Actualizando…", fr: "Actualisation…", de: "Aktualisierung…", zh: "刷新中…", ar: "جارٍ التحديث…", hi: "ताज़ा कर रहे हैं…", pt: "Atualizando…" },
  "refresh.now": { en: "Refresh now", es: "Actualizar ahora", fr: "Actualiser maintenant", de: "Jetzt aktualisieren", zh: "立即刷新", ar: "تحديث الآن", hi: "अभी ताज़ा करें", pt: "Atualizar agora" },

  "save.saved": { en: "Saved", es: "Guardado", fr: "Enregistré", de: "Gespeichert", zh: "已保存", ar: "محفوظ", hi: "सहेजा गया", pt: "Salvo" },
  "save.save": { en: "Save", es: "Guardar", fr: "Enregistrer", de: "Speichern", zh: "保存", ar: "حفظ", hi: "सहेजें", pt: "Salvar" },
  "save.removeTitle": { en: "Remove from saved", es: "Quitar de guardados", fr: "Retirer des enregistrés", de: "Aus Gespeicherten entfernen", zh: "取消保存", ar: "إزالة من المحفوظة", hi: "सहेजे हटाएँ", pt: "Remover dos salvos" },
  "save.saveTitle": { en: "Save location", es: "Guardar ubicación", fr: "Enregistrer le lieu", de: "Ort speichern", zh: "保存位置", ar: "حفظ الموقع", hi: "स्थान सहेजें", pt: "Salvar localização" },

  "share.share": { en: "Share", es: "Compartir", fr: "Partager", de: "Teilen", zh: "分享", ar: "مشاركة", hi: "साझा करें", pt: "Compartilhar" },
  "share.copied": { en: "Copied", es: "Copiado", fr: "Copié", de: "Kopiert", zh: "已复制", ar: "تم النسخ", hi: "कॉपी हो गया", pt: "Copiado" },
  "share.title": { en: "Share weather", es: "Compartir clima", fr: "Partager la météo", de: "Wetter teilen", zh: "分享天气", ar: "مشاركة الطقس", hi: "मौसम साझा करें", pt: "Compartilhar clima" },
  "share.weatherOf": { en: "Weather · {name}", es: "Clima · {name}", fr: "Météo · {name}", de: "Wetter · {name}", zh: "天气 · {name}", ar: "الطقس · {name}", hi: "मौसम · {name}", pt: "Clima · {name}" },

  "map.title": { en: "Map · {name}", es: "Mapa · {name}", fr: "Carte · {name}", de: "Karte · {name}", zh: "地图 · {name}", ar: "الخريطة · {name}", hi: "मानचित्र · {name}", pt: "Mapa · {name}" },

  "lifestyle.whatToWear": { en: "What to wear", es: "Qué ponerte", fr: "Que porter", de: "Was anziehen", zh: "穿衣建议", ar: "ماذا ترتدي", hi: "क्या पहनें", pt: "O que vestir" },
  "lifestyle.activityIndex": { en: "Activity-Friendly Index", es: "Índice de actividades", fr: "Indice d'activités", de: "Aktivitätsindex", zh: "适宜活动指数", ar: "مؤشر الأنشطة", hi: "गतिविधि सूचकांक", pt: "Índice de atividades" },
  "lifestyle.bestDayWeek": { en: "Best day this week per activity", es: "Mejor día de la semana por actividad", fr: "Meilleur jour de la semaine par activité", de: "Bester Tag der Woche pro Aktivität", zh: "本周各活动最佳日", ar: "أفضل يوم في الأسبوع لكل نشاط", hi: "इस सप्ताह का प्रति गतिविधि सर्वोत्तम दिन", pt: "Melhor dia da semana por atividade" },
  "lifestyle.day": { en: "Day", es: "Día", fr: "Jour", de: "Tag", zh: "日期", ar: "اليوم", hi: "दिन", pt: "Dia" },
  "lifestyle.travelComparison": { en: "Travel Comparison", es: "Comparación de viajes", fr: "Comparaison voyage", de: "Reisevergleich", zh: "旅行天气对比", ar: "مقارنة السفر", hi: "यात्रा तुलना", pt: "Comparação de viagem" },
  "lifestyle.travelSubtitle": { en: "Pick 2–3 places · next 7 days", es: "Elige 2–3 lugares · próximos 7 días", fr: "Choisissez 2–3 lieux · 7 prochains jours", de: "2–3 Orte wählen · nächste 7 Tage", zh: "选择2–3个地点 · 未来7天", ar: "اختر 2–3 أماكن · الأيام السبعة القادمة", hi: "2–3 स्थान चुनें · अगले 7 दिन", pt: "Escolha 2–3 lugares · próximos 7 dias" },
  "lifestyle.addCity": { en: "Add a city to compare…", es: "Añade una ciudad para comparar…", fr: "Ajoutez une ville à comparer…", de: "Stadt zum Vergleichen hinzufügen…", zh: "添加城市进行对比…", ar: "أضف مدينة للمقارنة…", hi: "तुलना के लिए शहर जोड़ें…", pt: "Adicione uma cidade para comparar…" },
  "lifestyle.addEmpty": { en: "Add up to 3 locations to compare side by side.", es: "Añade hasta 3 ubicaciones para compararlas.", fr: "Ajoutez jusqu'à 3 lieux à comparer.", de: "Bis zu 3 Orte zum Vergleichen hinzufügen.", zh: "最多添加3个地点并排对比。", ar: "أضف حتى 3 مواقع للمقارنة جنباً إلى جنب.", hi: "तुलना के लिए अधिकतम 3 स्थान जोड़ें।", pt: "Adicione até 3 locais para comparar lado a lado." },
  "lifestyle.bestDay": { en: "Best day: {date}", es: "Mejor día: {date}", fr: "Meilleur jour : {date}", de: "Bester Tag: {date}", zh: "最佳日：{date}", ar: "أفضل يوم: {date}", hi: "सर्वोत्तम दिन: {date}", pt: "Melhor dia: {date}" },
  "lifestyle.bestDayToGo": { en: "Best day to go", es: "Mejor día para ir", fr: "Meilleur jour pour y aller", de: "Bester Tag zum Gehen", zh: "最佳出行日", ar: "أفضل يوم للذهاب", hi: "जाने का सर्वोत्तम दिन", pt: "Melhor dia para ir" },
  "lifestyle.couldntLoad": { en: "Couldn't load forecast.", es: "No se pudo cargar el pronóstico.", fr: "Prévisions indisponibles.", de: "Vorhersage konnte nicht geladen werden.", zh: "无法加载预报。", ar: "تعذّر تحميل التوقعات.", hi: "पूर्वानुमान लोड नहीं हो सका।", pt: "Não foi possível carregar a previsão." },
  "lifestyle.windUnitTemps": { en: "Wind in {wunit} · {tunit} temps", es: "Viento en {wunit} · {tunit}", fr: "Vent en {wunit} · {tunit}", de: "Wind in {wunit} · {tunit}", zh: "风速 {wunit} · {tunit}", ar: "الرياح بـ{wunit} · {tunit}", hi: "हवा {wunit} · {tunit}", pt: "Vento em {wunit} · {tunit}" },

  "activity.running": { en: "Running", es: "Running", fr: "Course", de: "Laufen", zh: "跑步", ar: "الجري", hi: "दौड़", pt: "Corrida" },
  "activity.beach": { en: "Beach", es: "Playa", fr: "Plage", de: "Strand", zh: "海滩", ar: "الشاطئ", hi: "समुद्र तट", pt: "Praia" },
  "activity.skiing": { en: "Skiing", es: "Esquí", fr: "Ski", de: "Skifahren", zh: "滑雪", ar: "التزلج", hi: "स्कीइंग", pt: "Esqui" },
  "activity.gardening": { en: "Gardening", es: "Jardinería", fr: "Jardinage", de: "Gärtnern", zh: "园艺", ar: "البستنة", hi: "बागवानी", pt: "Jardinagem" },

  "about.title": { en: "About Weatherskies", es: "Acerca de Weatherskies", fr: "À propos de Weatherskies", de: "Über Weatherskies", zh: "关于 Weatherskies", ar: "حول Weatherskies", hi: "Weatherskies के बारे में", pt: "Sobre o Weatherskies" },
  "about.p1": { en: "Weatherskies is a clean, fast, and reliable weather application designed to give you an accurate picture of conditions wherever you are. From a single dashboard you get the current temperature, real-feel, humidity, wind, pressure, and precipitation, alongside an hourly outlook for the next 24 hours and a detailed 10-day forecast. Each day expands to reveal the UV index, sunrise and sunset times, precipitation chance, and wind direction, so you can plan with confidence.", es: "Weatherskies es una aplicación meteorológica limpia, rápida y fiable diseñada para ofrecerte una imagen precisa de las condiciones dondequiera que estés. Desde un único panel obtienes la temperatura actual, la sensación térmica, la humedad, el viento, la presión y la precipitación, junto con una perspectiva horaria de las próximas 24 horas y un pronóstico detallado de 10 días. Cada día se expande para mostrar el índice UV, los horarios de amanecer y atardecer, la probabilidad de precipitación y la dirección del viento, para que puedas planificar con confianza.", fr: "Weatherskies est une application météo claire, rapide et fiable conçue pour vous donner une image précise des conditions où que vous soyez. Depuis un seul tableau de bord, vous obtenez la température actuelle, le ressenti, l'humidité, le vent, la pression et les précipitations, ainsi qu'une perspective horaire pour les 24 prochaines heures et une prévision détaillée sur 10 jours. Chaque jour se déploie pour révéler l'indice UV, les heures de lever et coucher du soleil, la probabilité de précipitations et la direction du vent, pour planifier en toute confiance.", de: "Weatherskies ist eine klare, schnelle und zuverlässige Wetter-App, die dir ein genaues Bild der Bedingungen liefert, woimmer du bist. Aus einem einzigen Dashboard erhältst du aktuelle Temperatur, Gefühlt-Temperatur, Luftfeuchte, Wind, Luftdruck und Niederschlag, dazu einen stündlichen Ausblick für die nächsten 24 Stunden und eine detaillierte 10-Tage-Vorhersage. Jeder Tag klapppt auf und zeigt UV-Index, Sonnenauf- und -untergang, Niederschlagswahrscheinlichkeit und Windrichtung, damit du zuversichtlich planen kannst.", zh: "Weatherskies 是一款简洁、快速、可靠的天气应用，旨在为您提供所在之地准确的天气状况。在单一仪表盘中，您可以查看当前温度、体感温度、湿度、风速、气压和降水量，以及未来24小时的逐小时展望和详细的10天预报。每一天可展开显示紫外线指数、日出日落时间、降水概率和风向，助您从容规划。", ar: "Weatherskies تطبيق طقس نظيف وسريع وموثوق صُمّم ليمنحك صورة دقيقة للظروف أينما كنت. من لوحة واحدة تحصل على درجة الحرارة الحالية والإحساس والرطوبة والرياح والضغط والهطول، إضافة إلى توقعات بالساعة لـ24 ساعة قادمة وتوقعات تفصيلية لـ10 أيام. يتوسّع كل يوم ليكشف مؤشر الأشعة فوق البنفسجية وأوقات الشروق والغروب واحتمال الهطول واتجاه الرياح، لتخطّط بثقة.", hi: "Weatherskies एक स्वच्छ, तीव्र और विश्वसनीय मौसम ऐप है जो आपको जहाँ भी हों सटीक मौसम की तस्वीर देता है। एक ही डैशबोर्ड से आपको वर्तमान तापमान, महसूस तापमान, नमी, हवा, दबाव और वर्षा मिलती है, साथ ही अगले 24 घंटों का प्रति-घंटा दृष्टिकोन और विस्तृत 10-दिन पूर्वानुमान। प्रत्येक दिन खुलकर यूवी सूचकांक, सूर्योदय-अस्त समय, वर्षा की संभावना और हवा की दिशा दिखाता है, ताकि आप आत्मविश्वास से योजना बना सकें।", pt: "O Weatherskies é um aplicativo de clima limpo, rápido e confiável, projetado para oferecer uma imagem precisa das condições onde quer que você esteja. Em um único painel você obtém a temperatura atual, sensação térmica, umidade, vento, pressão e precipitação, além de uma perspectiva horária das próximas 24 horas e uma previsão detalhada de 10 dias. Cada dia se expande para revelar o índice UV, horários de nascer e pôr do sol, chance de precipitação e direção do vento, para você planejar com confiança." },
  "about.p2": { en: "Weatherskies also keeps an eye on the bigger picture. An Environment panel surfaces local air quality, atmospheric pollutants, and nearby weather alerts, while an interactive map lets you visualize your selected location at a glance. Save your favorite cities, switch between metric and imperial units, and choose a background theme that suits your mood — your preferences are remembered between visits.", es: "Weatherskies también vigila el panorama general. Un panel de Entorno muestra la calidad del aire local, los contaminantes atmosféricos y las alertas meteorológicas cercanas, mientras que un mapa interactivo te permite visualizar tu ubicación seleccionada de un vistazo. Guarda tus ciudades favoritas, alterna entre unidades métricas e imperiales y elige un tema de fondo que se ajuste a tu estado de ánimo — tus preferencias se recuerdan entre visitas.", fr: "Weatherskies garde également un œil sur l'ensemble. Un panneau Environnement affiche la qualité de l'air locale, les polluants atmosphériques et les alertes météo à proximité, tandis qu'une carte interactive vous permet de visualiser votre lieu sélectionné en un coup d'œil. Enregistrez vos villes favorites, basculez entre unités métriques et impériales et choisissez un thème d'arrière-plan selon votre humeur — vos préférences sont mémorisées entre les visites.", de: "Weatherskies behält auch das Große im Blick. Ein Umwelt-Panel zeigt lokale Luftqualität, atmosphärische Schadstoffe und nahegelegene Wetterwarnungen, während eine interaktive Karte deinen gewählten Ort auf einen Blick visualisiert. Speichere deine Lieblingsstädte, wechsle zwischen metrischen und imperiale Einheiten und wähle ein Hintergrundthema nach deiner Stimmung — deine Einstellungen bleiben zwischen Besuchen erhalten.", zh: "Weatherskies 还关注更大的图景。环境面板会展示本地空气质量、大气污染物和附近的天气警报，而交互式地图可让您一目了然地查看所选位置。保存您喜欢的城市，在公制和英制单位间切换，并选择适合您心情的背景主题——您的偏好会在访问间被记住。", ar: "كما يراقب Weatherskies الصورة الأشمل. يعرض لوح البيئة جودة الهواء المحلية والملوثات الجوية وتنبيهات الطقس القريبة، بينما تتيح لك خريطة تفاعلية رؤية موقعك المحدد بنظرة واحدة. احفظ مدنك المفضلة، بدّل بين الوحدات المترية والإمبراطورية، واختر سمة خلفية تناسب مزاجك — وتُحفظ تفضيلاتك بين الزيارات.", hi: "Weatherskies बड़ी तस्वीर पर भी नज़र रखता है। पर्यावरण पैन स्थानीय वायु गुणवत्ता, वायु प्रदूषक और पास के मौसम अलर्ट दिखाता है, जबकि इंटरैक्टिव मानचित्र आपको अपना चयनित स्थान एक नज़र में देखने देता है। अपने पसंदीदा शहर सहेजें, मेट्रिक और इम्पीरियल इकाइयों के बीच बदलें और अपने मूड के अनुरूप बैकग्राउंड थीम चुनें — आपकी प्राथमिकताएँ विज़िट के बीच याद रखी जाती हैं।", pt: "O Weatherskies também cuida do quadro geral. Um painel Ambiente mostra a qualidade do ar local, poluentes atmosféricos e alertas meteorológicos próximos, enquanto um mapa interativo permite visualizar seu local selecionado de relance. Salve suas cidades favoritas, alterne entre unidades métricas e imperiais e escolha um tema de fundo que combine com seu humor — suas preferências são lembradas entre as visitas." },
  "about.p3": { en: "Weatherskies is built for everyone who needs dependable weather information: commuters timing their morning, travelers exploring new cities, parents planning outdoor activities, and outdoor enthusiasts tracking conditions for hiking, running, or cycling.", es: "Weatherskies está hecho para todos los que necesitan información meteorológica fiable: viajeros que cronometran su mañana, exploradores de ciudades nuevas, padres que planifican actividades al aire libre y aficionados a las actividades al aire libre que siguen las condiciones para senderismo, running o ciclismo.", fr: "Weatherskies est conçu pour tous ceux qui ont besoin d'informations météo fiables : les navetteurs chronométrant leur matinée, les voyageurs explorant de nouvelles villes, les parents planifiant des activités en plein air et les amateurs de plein air suivant les conditions pour la randonnée, la course ou le cyclisme.", de: "Weatherskies ist für alle gemacht, die zuverlässige Wetterinformationen brauchen: Pendler, die ihren Morgen timen, Reisende, die neue Städte erkunden, Eltern, die Outdoor-Aktivitäten planen, und Outdoor-Fans, die Bedingungen für Wandern, Laufen oder Radfahren verfolgen.", zh: "Weatherskies 面向所有需要可靠天气信息的人：把控早晨时间的通勤者、探索新城市的旅行者、规划户外活动的父母，以及追踪徒步、跑步或骑行条件的户外爱好者。", ar: "صُمّم Weatherskies لكل من يحتاج معلومات طقس موثوقة: المُتنقلون الذين يضبطون صباحهم، المسافرون يستكشفون مدناً جديدة، الآباء يخططون أنشطة خارجية، وعشاق الخارج يتتبعون الظروف للمشي أو الجري أو ركوب الدراجات.", hi: "Weatherskies उन सभी के लिए बना है जिन्हें विश्वसनीय मौसम जानकारी चाहिए: अपनी सुबह तय करने वाले यात्री, नए शहर खोजने वाले पर्यटक, बाहरी गतिविधियाँ योजना बनाने वाले अभिभावक, और पैदल यात्रा, दौड़ या साइकिलिंग के लिए स्थितियाँ ट्रैक करने वाले बाहरी उत्साही।", pt: "O Weatherskies é feito para todos que precisam de informações meteorológicas confiáveis: quem se desloca cronometrando a manhã, viajantes explorando novas cidades, pais planejando atividades ao ar livre e entusiastas que monitoram as condições para trilhas, corrida ou ciclismo." },
  "about.p4": { en: "Weatherskies is built and maintained on the Base44 platform, combining trusted public weather data sources with a focus on clarity, speed, and a distraction-free experience.", es: "Weatherskies se desarrolla y mantiene en la plataforma Base44, combinando fuentes de datos meteorológicos públicos de confianza con un enfoque en la claridad, la velocidad y una experiencia sin distracciones.", fr: "Weatherskies est développé et maintenu sur la plateforme Base44, combinant des sources de données météo publiques fiables avec un focus sur la clarté, la vitesse et une expérience sans distraction.", de: "Weatherskies wird auf der Base44-Plattform entwickelt und gepflegt und verbindet vertrauenswürdige öffentliche Wetterdatenquellen mit Fokus auf Klarheit, Geschwindigkeit und eine ablenkungsfreie Erfahrung.", zh: "Weatherskies 在 Base44 平台上构建与维护，结合可信的公共天气数据源，专注于清晰、快速且无干扰的体验。", ar: "يُطوَّر Weatherskies ويُدار على منصة Base44، مدمجاً مصادر بيانات طقس عامة موثوقة مع تركيز على الوضوح والسرعة وتجربة خالية من التشتيت.", hi: "Weatherskies Base44 प्लेटफ़ॉर्म पर बना और अनुरक्षित है, जो विश्वसनीय सार्वजनिक मौसम डेटा स्रोतों को स्पष्टता, गति और विघ्न-मुक्त अनुभव पर केंद्रित करता है।", pt: "O Weatherskies é desenvolvido e mantido na plataforma Base44, combinando fontes públicas confiáveis de dados meteorológicos com foco em clareza, velocidade e uma experiência sem distrações." },

  "contact.title": { en: "Contact Us", es: "Contáctanos", fr: "Contactez-nous", de: "Kontakt", zh: "联系我们", ar: "اتصل بنا", hi: "हमसे संपर्क करें", pt: "Fale Conosco" },
  "contact.intro": { en: "Have a question, feedback, or found an issue with Weatherskies? We'd love to hear from you. Fill out the form below or reach us directly by email.", es: "¿Tienes una pregunta, sugerencia o encontraste un problema con Weatherskies? Nos encantaría saber de ti. Rellena el formulario o contáctanos por correo.", fr: "Une question, un retour ou un problème avec Weatherskies ? Nous serions ravis de vous lire. Remplissez le formulaire ou contactez-nous par email.", de: "Frage, Feedback oder ein Problem mit Weatherskies? Wir freuen uns von dir zu hören. Fülle das Formular aus oder schreib uns direkt.", zh: "有问题、反馈，或发现 Weatherskies 的问题？我们很乐意听取您的意见。请填写下方表单或直接发邮件给我们。", ar: "لديك سؤال أو ملاحظة أو واجهت مشكلة في Weatherskies؟ يسعدنا أن نسمع منك. املأ النموذج أدناه أو تواصل معنا بالبريد.", hi: "Weatherskies के बारे में कोई प्रश्न, प्रतिक्रिया या समस्या? हमें आपसे सुनकर खुशी होगी। नीचे फ़ॉर्म भरें या सीधे ईमेल से संपर्क करें।", pt: "Tem uma pergunta, comentário ou encontrou um problema no Weatherskies? Adoraríamos ouvir você. Preencha o formulário ou fale conosco por e-mail." },
  "contact.name": { en: "Name", es: "Nombre", fr: "Nom", de: "Name", zh: "姓名", ar: "الاسم", hi: "नाम", pt: "Nome" },
  "contact.email": { en: "Email", es: "Correo", fr: "Email", de: "E-Mail", zh: "邮箱", ar: "البريد", hi: "ईमेल", pt: "E-mail" },
  "contact.message": { en: "Message", es: "Mensaje", fr: "Message", de: "Nachricht", zh: "留言", ar: "الرسالة", hi: "संदेश", pt: "Mensagem" },
  "contact.namePh": { en: "Your name", es: "Tu nombre", fr: "Votre nom", de: "Dein Name", zh: "您的姓名", ar: "اسمك", hi: "आपका नाम", pt: "Seu nome" },
  "contact.emailPh": { en: "you@example.com", es: "tu@ejemplo.com", fr: "vous@exemple.com", de: "du@beispiel.de", zh: "you@example.com", ar: "you@example.com", hi: "you@example.com", pt: "voce@exemplo.com" },
  "contact.messagePh": { en: "How can we help?", es: "¿Cómo podemos ayudar?", fr: "Comment pouvons-nous aider ?", de: "Wie können wir helfen?", zh: "我们能帮您什么？", ar: "كيف يمكننا المساعدة؟", hi: "हम कैसे मदद कर सकते हैं?", pt: "Como podemos ajudar?" },
  "contact.error": { en: "Something went wrong. Please email us directly.", es: "Algo salió mal. Escríbenos directamente.", fr: "Une erreur est survenue. Écrivez-nous directement.", de: "Etwas ging schief. Schreib uns direkt.", zh: "出现问题，请直接发邮件给我们。", ar: "حدث خطأ. راسلنا مباشرة.", hi: "कुछ गलत हो गया। कृपया सीधे ईमेल करें।", pt: "Algo deu errado. Envie-nos um e-mail diretamente." },
  "contact.sent": { en: "Message sent — thanks for reaching out! We'll get back to you soon.", es: "Mensaje enviado — ¡gracias por escribir! Te responderemos pronto.", fr: "Message envoyé — merci de nous avoir contactés ! Nous vous répondrons bientôt.", de: "Nachricht gesendet — danke für deine Nachricht! Wir melden uns bald.", zh: "消息已发送——感谢联系！我们会尽快回复。", ar: "تم إرسال الرسالة — شكراً لتواصلك! سنرد عليك قريباً.", hi: "संदेश भेजा गया — संपर्क करने के लिए धन्यवाद! हम जल्द ही जवाब देंगे।", pt: "Mensagem enviada — obrigado por entrar em contato! Responderemos em breve." },
  "contact.opening": { en: "Sending…", es: "Enviando…", fr: "Envoi…", de: "Senden…", zh: "发送中…", ar: "جارٍ الإرسال…", hi: "भेज रहे हैं…", pt: "Enviando…" },
  "contact.send": { en: "Send Message", es: "Enviar mensaje", fr: "Envoyer", de: "Nachricht senden", zh: "发送", ar: "إرسال الرسالة", hi: "संदेश भेजें", pt: "Enviar mensagem" },
  "contact.subjectPrefix": { en: "Weatherskies contact from {name}", es: "Contacto de Weatherskies de {name}", fr: "Contact Weatherskies de {name}", de: "Weatherskies-Kontakt von {name}", zh: "Weatherskies 联系人：{name}", ar: "تواصل Weatherskies من {name}", hi: "Weatherskies से संपर्क: {name}", pt: "Contato Weatherskies de {name}" },
  "contact.visitor": { en: "a visitor", es: "un visitante", fr: "un visiteur", de: "ein Besucher", zh: "一位访客", ar: "زائر", hi: "एक आगंतुक", pt: "um visitante" },
};

// ---------------------------------------------------------------------------
// Weather condition labels (WMO codes) translated per language
// ---------------------------------------------------------------------------
export const WEATHER_LABELS = {
  0: { en: "Clear Sky", es: "Cielo despejado", fr: "Ciel dégagé", de: "Klarer Himmel", zh: "晴朗", ar: "سماء صافية", hi: "निर्मल आकाश", pt: "Céu limpo" },
  1: { en: "Mainly Clear", es: "Mayormente despejado", fr: "Plutôt dégagé", de: "Überwiegend klar", zh: "大致晴朗", ar: "غائم جزئياً", hi: "अधिकांश निर्मल", pt: "Predominantemente limpo" },
  2: { en: "Partly Cloudy", es: "Parcialmente nublado", fr: "Partiellement nuageux", de: "Teils bewölkt", zh: "局部多云", ar: "غائم جزئياً", hi: "आंशिक बादल", pt: "Parcialmente nublado" },
  3: { en: "Overcast", es: "Nublado", fr: "Couvert", de: "Bedeckt", zh: "阴", ar: "غائم", hi: "बादल", pt: "Nublado" },
  45: { en: "Fog", es: "Niebla", fr: "Brouillard", de: "Nebel", zh: "雾", ar: "ضباب", hi: "कोहरा", pt: "Neblina" },
  48: { en: "Rime Fog", es: "Niebla de escarcha", fr: "Brouillard givrant", de: "Reifnebel", zh: "雾凇", ar: "ضباب متجمد", hi: "तुषार कोहरा", pt: "Neblina com geada" },
  51: { en: "Light Drizzle", es: "Llovizna ligera", fr: "Bruine légère", de: "Leichter Nieselregen", zh: "小毛毛雨", ar: "رذاذ خفيف", hi: "हल्की बूंदाबांदी", pt: "Garoa leve" },
  53: { en: "Drizzle", es: "Llovizna", fr: "Bruine", de: "Nieselregen", zh: "毛毛雨", ar: "رذاذ", hi: "बूंदाबांदी", pt: "Garoa" },
  55: { en: "Heavy Drizzle", es: "Llovizna intensa", fr: "Bruine dense", de: "Starker Nieselregen", zh: "大毛毛雨", ar: "رذاذ كثيف", hi: "भारी बूंदाबांदी", pt: "Garoa intensa" },
  56: { en: "Freezing Drizzle", es: "Llovizna helada", fr: "Bruine verglaçante", de: "Gefrierender Nieselregen", zh: "冻毛毛雨", ar: "رذاذ متجمد", hi: "जमती बूंदाबांदी", pt: "Garoa congelante" },
  57: { en: "Freezing Drizzle", es: "Llovizna helada", fr: "Bruine verglaçante", de: "Gefrierender Nieselregen", zh: "冻毛毛雨", ar: "رذاذ متجمد", hi: "जमती बूंदाबांदी", pt: "Garoa congelante" },
  61: { en: "Light Rain", es: "Lluvia ligera", fr: "Pluie légère", de: "Leichter Regen", zh: "小雨", ar: "مطر خفيف", hi: "हल्की बारिश", pt: "Chuva leve" },
  63: { en: "Rain", es: "Lluvia", fr: "Pluie", de: "Regen", zh: "中雨", ar: "مطر", hi: "बारिश", pt: "Chuva" },
  65: { en: "Heavy Rain", es: "Lluvia intensa", fr: "Pluie forte", de: "Starker Regen", zh: "大雨", ar: "مطر غزير", hi: "भारी बारिश", pt: "Chuva forte" },
  66: { en: "Freezing Rain", es: "Lluvia helada", fr: "Pluie verglaçante", de: "Gefrierender Regen", zh: "冻雨", ar: "مطر متجمد", hi: "जमती बारिश", pt: "Chuva congelante" },
  67: { en: "Freezing Rain", es: "Lluvia helada", fr: "Pluie verglaçante", de: "Gefrierender Regen", zh: "冻雨", ar: "مطر متجمد", hi: "जमती बारिश", pt: "Chuva congelante" },
  71: { en: "Light Snow", es: "Nieve ligera", fr: "Neige légère", de: "Leichter Schnee", zh: "小雪", ar: "ثلج خفيف", hi: "हल्की बर्फ़", pt: "Neve leve" },
  73: { en: "Snow", es: "Nieve", fr: "Neige", de: "Schnee", zh: "中雪", ar: "ثلج", hi: "बर्फ़", pt: "Neve" },
  75: { en: "Heavy Snow", es: "Nieve intensa", fr: "Neige forte", de: "Starker Schnee", zh: "大雪", ar: "ثلج كثيف", hi: "भारी बर्फ़", pt: "Neve forte" },
  77: { en: "Snow Grains", es: "Granos de nieve", fr: "Grains de neige", de: "Schneegriesel", zh: "雪粒", ar: "حبيبات ثلج", hi: "बर्फ़ के दाने", pt: "Grãos de neve" },
  80: { en: "Rain Showers", es: "Chubascos", fr: "Averses", de: "Regenschauer", zh: "阵雨", ar: "زخات مطر", hi: "बारिश की बौछार", pt: "Pancadas de chuva" },
  81: { en: "Rain Showers", es: "Chubascos", fr: "Averses", de: "Regenschauer", zh: "阵雨", ar: "زخات مطر", hi: "बारिश की बौछार", pt: "Pancadas de chuva" },
  82: { en: "Violent Showers", es: "Chubascos violentos", fr: "Averses violentes", de: "Heftige Schauer", zh: "暴雨", ar: "زخات عنيفة", hi: "तीव्र बौछार", pt: "Pancadas violentas" },
  85: { en: "Snow Showers", es: "Chubascos de nieve", fr: "Averses de neige", de: "Schneeschauer", zh: "阵雪", ar: "زخات ثلج", hi: "बर्फ़ की बौछार", pt: "Pancadas de neve" },
  86: { en: "Snow Showers", es: "Chubascos de nieve", fr: "Averses de neige", de: "Schneeschauer", zh: "阵雪", ar: "زخات ثلج", hi: "बर्फ़ की बौछार", pt: "Pancadas de neve" },
  95: { en: "Thunderstorm", es: "Tormenta", fr: "Orage", de: "Gewitter", zh: "雷暴", ar: "عاصفة رعدية", hi: "गरज", pt: "Tempestade" },
  96: { en: "Thunderstorm + Hail", es: "Tormenta con granizo", fr: "Orage avec grêle", de: "Gewitter mit Hagel", zh: "雷暴伴冰雹", ar: "عاصفة مع بَرَد", hi: "ओले सहित गरज", pt: "Tempestade com granizo" },
  99: { en: "Thunderstorm + Hail", es: "Tormenta con granizo", fr: "Orage avec grêle", de: "Gewitter mit Hagel", zh: "雷暴伴冰雹", ar: "عاصفة مع بَرَد", hi: "ओले सहित गरज", pt: "Tempestade com granizo" },
};

export function getWeatherLabel(code, lang) {
  const entry = WEATHER_LABELS[code];
  return (entry && (entry[lang] || entry.en)) || "—";
}

// Lookup a UI string for a language with optional {var} interpolation.
export function translate(key, lang, vars) {
  const entry = STRINGS[key];
  let str = (entry && (entry[lang] || entry.en)) || key;
  if (vars) {
    for (const k of Object.keys(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(vars[k]));
    }
  }
  return str;
}