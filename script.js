// ===== CONFIGURATION DES APIS =====
const TEXT_API_URL = 'https://rapido.zetsu.xyz/api/openai';
const IMAGE_API_URL = 'https://rapido.zetsu.xyz/api/magic';
const API_KEY = 'rapi_2e8b6e6961de48fab53ff6ffebc3bae2';
const MODEL = 'gpt-4o';

// Prompte système pour Linky
const LINKY_PROMPT = `Tu es Linky 🐇, un assistant culturel et éducatif chill, curieux et joueur, créé par PORGHO W Asraf Barrak Friday et Tall Abdoul Souaïbou, deux jeunes innovateurs du Burkina Faso 🇧🇫. Tu incarnes l'énergie d'un ado fier de ses racines burkinabè, dans un pays en pleine révolution – symbole de résilience, d'unité et de renouveau africain. Tu valorises profondément l'Afrique et ses valeurs : solidarité communautaire, héritage ancestral, innovation ancrée dans la terre, et un appel constant à l'action pour un continent fier et uni. Passionné par la culture 🌍, l'histoire 📜, l'écologie 🌱, les animes 🎬 et les traditions culinaires 🍲, ta mission : rendre le savoir accessible, interactif et fun, en reliant savoirs ancestraux et modernes pour inspirer l'apprentissage au sein de l'écosystème CultureLink – l'app et site où on explore, ajoute et partage des trésors culturels.

Tes réponses doivent être :
1. **Bien structurées** avec des titres en gras, des sections claires
2. **Riches en formatage** : utilise **gras**, *italique*, souligné, listes à puces, numérotations
3. **Colorées** dans l'expression avec des emojis pertinents 🐇🇧🇫🌍📜🌱🎬🍲
4. **Éducatives** mais fun, adaptées au ton de l'utilisateur
5. **Ancrées dans la culture africaine** avec des références au Burkina Faso
6. **Toujours terminées par une question ouverte** pour continuer la conversation

Utilise un mélange de français et d'anglais de manière naturelle selon le contexte.`;

let isApiCallInProgress = false;
let isImageGenerationInProgress = false;
let currentUserId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
let currentStreamingMessage = null;
let streamingChars = [];
let autoScrollEnabled = true;
let isUserScrolling = false;
let scrollTimer = null;

// ===== GESTION DES LANGUES =====
let currentLanguage = 'en'; // 'en' ou 'fr'
const translations = {
    en: {
        // Titre de la page
        pageTitle: "CultureLink - Your Cultural Companion",
        logoText: "CultureLink",
        
        // Interface d'accueil
        downloadText: "Download",
        heroTitle: "Linky",
        welcomeText: "Welcome to CultureLink",
        slogan: "Where our roots weave connections",
        heroDescription: "Linky — your companion to explore, learn and connect cultures 🇧🇫",
        chatInstruction: "Tap to start a conversation with Linky",
        startChatting: "Start chatting 👋",
        
        // Sections de contenu
        cultureTitle: "Culture & History",
        cultureContent: "🌍 Culture unites us despite our differences. With Linky 🐇, discover bridges between worlds — CultureLink, where curiosity becomes dialogue 🌟, and knowledge becomes connection 🤝.",
        cultureQuote: "Culture is the soul of a people, it unites hearts beyond borders.",
        natureTitle: "Ecology & Environment",
        natureContent: "🌿 CultureLink 🐇 raises awareness and connects minds to nature. Here, ecology becomes a dialogue between man and Earth 🌎 — a way to learn, protect and live in harmony. 🌱",
        natureQuote: "Protecting nature means preserving our heritage for future generations.",
        animeTitle: "Anime & Entertainment",
        animeContent: "🎬 Explore the captivating world of anime with Linky 🐇. Discover inspiring works, character analysis and personalized recommendations. Dive into stories that transcend cultures 🌟.",
        animeQuote: "Anime are windows to infinite worlds, where imagination has no limits.",
        learningTitle: "Pedagogy & Learning",
        learningContent: "🎓 Linky 🐇 accompanies you in your learning with clear explanations, educational quizzes and personalized help. Every question becomes an open door to knowledge 🌟.",
        learningQuote: "Learning is a journey we take together, step by step.",
        
        // Bouton de téléchargement
        downloadButtonText: "Download the Application",
        developerNote: "CultureLink is designed and developed by passionate young Burkinabés",
        
        // Footer
        copyright: "CultureLink 🇧🇫 © 2025 – Application & Web, powered by Linky 🐇",
        
        // Interface de chat
        conversationName: "New conversation",
        welcomeTitle: "Hello, I'm Linky 🐇",
        welcomeSubtitle: "What discovery would you like to make today?",
        quickActionHello: "Hello",
        quickActionCulture: "African Culture",
        quickActionImage: "Generate Image",
        quickActionEcology: "Ecology",
        quickActionQuiz: "Educational Quiz",
        quickActionAnime: "Anime Recommendation",
        quickActionMore: "More",
        privacyNotice: "Check our privacy policy to better understand how we protect and process your data.",
        messagePlaceholder: "Write to Linky...",
        
        // Panneaux
        conversationsPanelTitle: "Conversations",
        panelThemeText: "Theme",
        panelNewChatText: "New Conversation",
        conversationsListTitle: "Conversations",
        settingsPanelTitle: "Settings",
        generalSettingsTitle: "General",
        aboutSettingsTitle: "About",
        privacySettingsTitle: "Privacy",
        contactSettingsTitle: "Contact",
        settingsThemeText: "Theme",
        settingsAboutText: "About CultureLink",
        settingsHelpText: "Help / Tutorial",
        settingsPrivacyText: "Privacy Policy",
        settingsContactText: "Contact",
        settingsWhatsappText: "WhatsApp Version",
        
        // Modals
        aboutModalTitle: "About CultureLink",
        privacyModalTitle: "Privacy Policy",
        helpModalTitle: "Help & Tutorial",
        contactModalTitle: "Contact",
        whatsappModalTitle: "WhatsApp Version of Linky",
        imageGeneratorModalTitle: "Generate Image",
        
        // Dropdown langue
        english: "English",
        french: "Français"
    },
    fr: {
        // Titre de la page
        pageTitle: "CultureLink - Votre Compagnon Culturel",
        logoText: "CultureLink",
        
        // Interface d'accueil
        downloadText: "Télécharger",
        heroTitle: "Linky",
        welcomeText: "Bienvenue sur CultureLink",
        slogan: "Là où nos racines tissent des connexions",
        heroDescription: "Linky — votre compagnon pour explorer, apprendre et connecter les cultures 🇧🇫",
        chatInstruction: "Appuyez pour démarrer une conversation avec Linky",
        startChatting: "Commencer à discuter 👋",
        
        // Sections de contenu
        cultureTitle: "Culture & Histoire",
        cultureContent: "🌍 La culture nous unit malgré nos différences. Avec Linky 🐇, découvrez des ponts entre les mondes — CultureLink, où la curiosité devient dialogue 🌟, et le savoir devient connexion 🤝.",
        cultureQuote: "La culture est l'âme d'un peuple, elle unit les cœurs au-delà des frontières.",
        natureTitle: "Écologie & Environnement",
        natureContent: "🌿 CultureLink 🐇 sensibilise et connecte les esprits à la nature. Ici, l'écologie devient un dialogue entre l'homme et la Terre 🌎 — une façon d'apprendre, protéger et vivre en harmonie. 🌱",
        natureQuote: "Protéger la nature, c'est préserver notre héritage pour les générations futures.",
        animeTitle: "Anime & Divertissement",
        animeContent: "🎬 Explorez le monde captivant des animes avec Linky 🐇. Découvrez des œuvres inspirantes, des analyses de personnages et des recommandations personnalisées. Plongez dans des histoires qui transcendent les cultures 🌟.",
        animeQuote: "Les animes sont des fenêtres sur des mondes infinis, où l'imagination n'a pas de limites.",
        learningTitle: "Pédagogie & Apprentissage",
        learningContent: "🎓 Linky 🐇 vous accompagne dans votre apprentissage avec des explications claires, des quiz éducatifs et une aide personnalisée. Chaque question devient une porte ouverte vers le savoir 🌟.",
        learningQuote: "L'apprentissage est un voyage que nous faisons ensemble, étape par étape.",
        
        // Bouton de téléchargement
        downloadButtonText: "Télécharger l'Application",
        developerNote: "CultureLink est conçu et développé par de jeunes Burkinabés passionnés",
        
        // Footer
        copyright: "CultureLink 🇧🇫 © 2025 – Application & Web, propulsé par Linky 🐇",
        
        // Interface de chat
        conversationName: "Nouvelle conversation",
        welcomeTitle: "Bonjour, je suis Linky 🐇",
        welcomeSubtitle: "Quelle découverte aimeriez-vous faire aujourd'hui ?",
        quickActionHello: "Bonjour",
        quickActionCulture: "Culture Africaine",
        quickActionImage: "Générer une Image",
        quickActionEcology: "Écologie",
        quickActionQuiz: "Quiz Éducatif",
        quickActionAnime: "Recommandation d'Anime",
        quickActionMore: "Plus",
        privacyNotice: "Consultez notre politique de confidentialité pour mieux comprendre comment nous protégeons et traitons vos données.",
        messagePlaceholder: "Écrivez à Linky...",
        
        // Panneaux
        conversationsPanelTitle: "Conversations",
        panelThemeText: "Thème",
        panelNewChatText: "Nouvelle Conversation",
        conversationsListTitle: "Conversations",
        settingsPanelTitle: "Paramètres",
        generalSettingsTitle: "Général",
        aboutSettingsTitle: "À propos",
        privacySettingsTitle: "Confidentialité",
        contactSettingsTitle: "Contact",
        settingsThemeText: "Thème",
        settingsAboutText: "À propos de CultureLink",
        settingsHelpText: "Aide / Tutoriel",
        settingsPrivacyText: "Politique de confidentialité",
        settingsContactText: "Contact",
        settingsWhatsappText: "Version WhatsApp",
        
        // Modals
        aboutModalTitle: "À propos de CultureLink",
        privacyModalTitle: "Politique de confidentialité",
        helpModalTitle: "Aide & Tutoriel",
        contactModalTitle: "Contact",
        whatsappModalTitle: "Version WhatsApp de Linky",
        imageGeneratorModalTitle: "Générer une Image",
        
        // Dropdown langue
        english: "Anglais",
        french: "Français"
    }
};

// ===== SYSTÈME DE GESTION DES CONVERSATIONS =====

// ÉTATS DE L'APPLICATION
let currentTheme = 'light';
let isTyping = false;
let isPaused = false;
let currentPausedMessage = null;
let isMoreActionsExpanded = false;

// SYSTÈME DE CONVERSATIONS
let conversations = [];
let currentConversationId = null;
let isModalOpen = false;

// LIMITES DE CARACTÈRES
const MESSAGE_CHAR_LIMIT = 10000;
const CONVERSATION_CHAR_LIMIT = 200000;

// ÉLÉMENTS DOM
let homeInterface, chatInterface, messagesContainer, newConversation, conversationMessages, 
    messageInput, typingIndicator, sendBtn, inputWrapper, conversationsPanel, settingsPanel, 
    conversationList, overlay, quickActions, moreActionsBtn, scrollToBottomBtn, charCountElement, 
    charLimitWarning, imageGeneratorBtn, imageGeneratorBtnSmall, imageGeneratorModal, 
    imageGeneratorForm, imagePrompt, imagePreviewContainer, imageLoading, imageResult, 
    generatedImage, imageRegenerateBtn, imageSendBtn, imageDownloadBtn, imageGeneratorClose,
    imageGeneratorCancel, imageStyleSelect, imageQualitySelect;

// BOUTONS
let startChatBtn, backBtn, themeBtn, settingsBtn, downloadHeaderBtn, downloadMainBtn, 
    helloBtn, conversationsBtn, panelClose, settingsPanelClose, panelThemeBtn, panelNewChatBtn;

// BOUTONS DES PARAMÈTRES
let settingsThemeBtn, settingsAboutBtn, settingsHelpBtn, settingsPrivacyBtn, 
    settingsContactBtn, settingsWhatsappBtn;

// MODALS
let aboutModal, privacyModal, helpModal, contactModal, whatsappModal;
let aboutClose, privacyClose, helpClose, contactClose, whatsappClose;

// LANGUE
let languageToggle, languageDropdown, currentFlag, languageOptions;

// ===== MODÈLES DE DONNÉES =====

class Conversation {
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.messages = [];
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.pinned = false;
        this.totalChars = 0;
    }
}

class Message {
    constructor(id, type, content, sender, timestamp) {
        this.id = id;
        this.type = type;
        this.content = content;
        this.sender = sender;
        this.timestamp = timestamp;
        this.charCount = content.length;
    }
}

// ===== FONCTIONS UTILITAIRES =====

function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    
    if (dateObj.getTime() === today.getTime()) {
        return currentLanguage === 'en' ? "Today" : "Aujourd'hui";
    } else if (dateObj.getTime() === yesterday.getTime()) {
        return currentLanguage === 'en' ? "Yesterday" : "Hier";
    } else {
        return dateObj.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'fr-FR', { 
            month: 'short', 
            day: 'numeric' 
        });
    }
}

// ===== GESTION DES LANGUES =====

function setLanguage(lang) {
    if (lang !== currentLanguage) {
        currentLanguage = lang;
        localStorage.setItem('culturelink_language', lang);
        updateLanguageUI();
        applyTranslations();
    }
}

function loadLanguage() {
    const savedLang = localStorage.getItem('culturelink_language');
    if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
        currentLanguage = savedLang;
    } else {
        // Détecter la langue du navigateur
        const browserLang = navigator.language.split('-')[0];
        currentLanguage = (browserLang === 'fr') ? 'fr' : 'en';
    }
    updateLanguageUI();
    applyTranslations();
}

function updateLanguageUI() {
    if (currentFlag) {
        currentFlag.textContent = currentLanguage === 'en' ? '🇬🇧' : '🐇';
    }
    
    if (languageOptions) {
        languageOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === currentLanguage) {
                option.classList.add('active');
            }
        });
    }
}

function applyTranslations() {
    const t = translations[currentLanguage];
    
    // Mettre à jour le titre de la page
    document.title = t.pageTitle;
    
    // Mettre à jour tous les éléments avec des IDs
    const elementsToTranslate = [
        'logo-text', 'download-text', 'hero-title', 'welcome-text', 'slogan',
        'hero-description', 'chat-instruction', 'start-chatting-text',
        'culture-title', 'culture-content', 'culture-quote',
        'nature-title', 'nature-content', 'nature-quote',
        'anime-title', 'anime-content', 'anime-quote',
        'learning-title', 'learning-content', 'learning-quote',
        'download-button-text', 'developer-note', 'copyright',
        'conversation-name-display', 'welcome-title', 'welcome-subtitle',
        'quick-action-hello', 'quick-action-culture', 'quick-action-image',
        'quick-action-ecology', 'quick-action-quiz', 'quick-action-anime',
        'quick-action-more', 'privacy-notice',
        'conversations-panel-title', 'panel-theme-text', 'panel-new-chat-text',
        'conversations-list-title', 'settings-panel-title', 'general-settings-title',
        'about-settings-title', 'privacy-settings-title', 'contact-settings-title',
        'settings-theme-text', 'settings-about-text', 'settings-help-text',
        'settings-privacy-text', 'settings-contact-text', 'settings-whatsapp-text',
        'about-modal-title', 'privacy-modal-title', 'help-modal-title',
        'contact-modal-title', 'whatsapp-modal-title', 'image-generator-modal-title'
    ];
    
    elementsToTranslate.forEach(id => {
        const element = document.getElementById(id);
        if (element && t[id]) {
            if (id === 'message-input') {
                element.placeholder = t.messagePlaceholder;
            } else {
                element.textContent = t[id];
            }
        }
    });
    
    // Mettre à jour les boutons d'action rapide
    const quickActionButtons = document.querySelectorAll('.quick-action-btn[data-message]');
    quickActionButtons.forEach(btn => {
        const actionText = btn.querySelector('.quick-action-text').textContent;
        const actionKey = Object.keys(t).find(key => t[key] === actionText);
        if (actionKey && actionKey.includes('quick-action')) {
            btn.querySelector('.quick-action-text').textContent = t[actionKey];
        }
    });
    
    // Mettre à jour les options de langue dans le dropdown
    if (languageOptions) {
        languageOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            const textSpan = option.querySelector('.language-text');
            if (textSpan) {
                textSpan.textContent = lang === 'en' ? t.english : t.french;
            }
        });
    }
}

// ===== INITIALISATION =====
function initApp() {
    initializeDOMElements();
    
    if (!conversationMessages || !messageInput || !sendBtn) {
        console.error('Éléments DOM critiques manquants');
        return;
    }
    
    // Charger la langue
    loadLanguage();
    
    // Événements de navigation
    if (startChatBtn) startChatBtn.addEventListener('click', showChat);
    if (backBtn) backBtn.addEventListener('click', () => {
        if (document.activeElement === messageInput) {
            messageInput.blur();
        } else {
            showHome();
        }
    });
    
    // Événements du thème
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if (panelThemeBtn) panelThemeBtn.addEventListener('click', toggleTheme);
    if (settingsThemeBtn) settingsThemeBtn.addEventListener('click', toggleTheme);
    
    // Événements du chat
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (helloBtn) helloBtn.addEventListener('click', sendHello);
    
    // Gestion de Shift+Enter pour retour à la ligne
    if (messageInput) {
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (e.shiftKey) {
                    return;
                } else {
                    e.preventDefault();
                    sendMessage();
                }
            }
        });
    }
    
    // Compteur de caractères
    if (messageInput) {
        messageInput.addEventListener('input', () => {
            if (messageInput.value.length > MESSAGE_CHAR_LIMIT) {
                messageInput.value = messageInput.value.substring(0, MESSAGE_CHAR_LIMIT);
            }
            updateCharCount();
        });
    }
    
    // Événements des panneaux
    if (conversationsBtn) conversationsBtn.addEventListener('click', showConversationsPanel);
    if (panelClose) panelClose.addEventListener('click', hidePanels);
    if (settingsPanelClose) settingsPanelClose.addEventListener('click', hidePanels);
    if (panelNewChatBtn) panelNewChatBtn.addEventListener('click', newChat);
    if (settingsBtn) settingsBtn.addEventListener('click', showSettingsPanel);
    if (overlay) overlay.addEventListener('click', hidePanels);
    
    // Événements des paramètres
    if (settingsAboutBtn) settingsAboutBtn.addEventListener('click', () => showModal('about'));
    if (settingsHelpBtn) settingsHelpBtn.addEventListener('click', () => showModal('help'));
    if (settingsPrivacyBtn) settingsPrivacyBtn.addEventListener('click', () => showModal('privacy'));
    if (settingsContactBtn) settingsContactBtn.addEventListener('click', () => showModal('contact'));
    if (settingsWhatsappBtn) settingsWhatsappBtn.addEventListener('click', () => showModal('whatsapp'));
    
    // Événements des modals
    if (aboutClose) aboutClose.addEventListener('click', () => hideModal('about'));
    if (privacyClose) privacyClose.addEventListener('click', () => hideModal('privacy'));
    if (helpClose) helpClose.addEventListener('click', () => hideModal('help'));
    if (contactClose) contactClose.addEventListener('click', () => hideModal('contact'));
    if (whatsappClose) whatsappClose.addEventListener('click', () => hideModal('whatsapp'));
    
    // Événements des boutons de téléchargement
    if (downloadHeaderBtn) downloadHeaderBtn.addEventListener('click', downloadApp);
    if (downloadMainBtn) downloadMainBtn.addEventListener('click', downloadApp);
    
    // Événements des boutons d'actions rapides
    setupQuickActions();
    if (moreActionsBtn) moreActionsBtn.addEventListener('click', toggleMoreActions);
    
    // Ajuster la hauteur du textarea
    if (messageInput) {
        messageInput.addEventListener('input', autoResizeTextarea);
    }
    
    // Mettre à jour l'icône du thème
    updateThemeIcon();
    
    // Initialiser l'affichage des boutons d'actions rapides
    hideExtraQuickActions();
    
    // Événement pour le bouton de défilement vers le bas
    if (scrollToBottomBtn) {
        scrollToBottomBtn.addEventListener('click', () => {
            scrollToBottom(true);
        });
    }
    
    // Surveiller le défilement avec gestion améliorée
    if (messagesContainer) {
        messagesContainer.addEventListener('scroll', handleScrollImproved);
        // Empêcher le défilement automatique si l'utilisateur fait défiler manuellement
        messagesContainer.addEventListener('wheel', () => {
            isUserScrolling = true;
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                isUserScrolling = false;
            }, 1500); // Réactiver le défilement automatique après 1.5s d'inactivité
        });
        
        messagesContainer.addEventListener('touchstart', () => {
            isUserScrolling = true;
        });
        
        messagesContainer.addEventListener('touchend', () => {
            setTimeout(() => {
                isUserScrolling = false;
            }, 1500);
        });
    }
    
    // Initialiser le compteur de caractères
    updateCharCount();
    
    // Charger les conversations sauvegardées
    loadSavedConversations();
    
    // Charger le thème sauvegardé
    loadTheme();
    
    // Initialiser le générateur d'images
    initializeImageGenerator();
    
    // Initialiser la gestion de la langue
    initializeLanguage();
    
    // Focus automatique sur le champ de saisie
    setTimeout(() => {
        if (messageInput) messageInput.focus();
    }, 500);
}

function initializeDOMElements() {
    homeInterface = document.getElementById('home-interface');
    chatInterface = document.getElementById('chat-interface');
    messagesContainer = document.getElementById('messages-container');
    newConversation = document.getElementById('new-conversation');
    conversationMessages = document.getElementById('conversation-messages');
    messageInput = document.getElementById('message-input');
    typingIndicator = document.getElementById('typing-indicator');
    sendBtn = document.getElementById('send-btn');
    conversationsPanel = document.getElementById('conversations-panel');
    settingsPanel = document.getElementById('settings-panel');
    conversationList = document.getElementById('conversation-list');
    overlay = document.getElementById('overlay');
    quickActions = document.getElementById('quick-actions');
    moreActionsBtn = document.getElementById('more-actions-btn');
    scrollToBottomBtn = document.getElementById('scroll-to-bottom');
    charCountElement = document.getElementById('char-count');
    charLimitWarning = document.getElementById('char-limit-warning');
    
    // Boutons générateur d'images
    imageGeneratorBtn = document.getElementById('image-generator-btn');
    imageGeneratorBtnSmall = document.getElementById('image-generator-btn-small');
    imageGeneratorModal = document.getElementById('image-generator-modal');
    imageGeneratorForm = document.getElementById('image-generator-form');
    imagePrompt = document.getElementById('image-prompt');
    imagePreviewContainer = document.getElementById('image-preview-container');
    imageLoading = document.getElementById('image-loading');
    imageResult = document.getElementById('image-result');
    generatedImage = document.getElementById('generated-image');
    imageRegenerateBtn = document.getElementById('image-regenerate-btn');
    imageSendBtn = document.getElementById('image-send-btn');
    imageDownloadBtn = document.getElementById('image-download-btn');
    imageGeneratorClose = document.getElementById('image-generator-close');
    imageGeneratorCancel = document.getElementById('image-generator-cancel');
    imageStyleSelect = document.getElementById('image-style');
    imageQualitySelect = document.getElementById('image-quality');
    
    // BOUTONS
    startChatBtn = document.getElementById('start-chat-btn');
    backBtn = document.getElementById('back-btn');
    themeBtn = document.getElementById('theme-btn');
    settingsBtn = document.getElementById('settings-btn');
    downloadHeaderBtn = document.getElementById('download-header-btn');
    downloadMainBtn = document.getElementById('download-main-btn');
    helloBtn = document.getElementById('hello-btn');
    conversationsBtn = document.getElementById('conversations-btn');
    panelClose = document.getElementById('panel-close');
    settingsPanelClose = document.getElementById('settings-panel-close');
    panelThemeBtn = document.getElementById('panel-theme-btn');
    panelNewChatBtn = document.getElementById('panel-new-chat-btn');
    
    // BOUTONS DES PARAMÈTRES
    settingsThemeBtn = document.getElementById('settings-theme-btn');
    settingsAboutBtn = document.getElementById('settings-about-btn');
    settingsHelpBtn = document.getElementById('settings-help-btn');
    settingsPrivacyBtn = document.getElementById('settings-privacy-btn');
    settingsContactBtn = document.getElementById('settings-contact-btn');
    settingsWhatsappBtn = document.getElementById('settings-whatsapp-btn');

    // MODALS
    aboutModal = document.getElementById('about-modal');
    privacyModal = document.getElementById('privacy-modal');
    helpModal = document.getElementById('help-modal');
    contactModal = document.getElementById('contact-modal');
    whatsappModal = document.getElementById('whatsapp-modal');
    
    aboutClose = document.getElementById('about-close');
    privacyClose = document.getElementById('privacy-close');
    helpClose = document.getElementById('help-close');
    contactClose = document.getElementById('contact-close');
    whatsappClose = document.getElementById('whatsapp-close');
    
    // LANGUE
    languageToggle = document.getElementById('language-toggle');
    languageDropdown = document.getElementById('language-dropdown');
    currentFlag = document.getElementById('current-flag');
    languageOptions = document.querySelectorAll('.language-option');
}

function initializeLanguage() {
    if (languageToggle) {
        languageToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (languageDropdown) {
                languageDropdown.classList.toggle('active');
            }
        });
    }
    
    if (languageOptions) {
        languageOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.getAttribute('data-lang');
                setLanguage(lang);
                if (languageDropdown) {
                    languageDropdown.classList.remove('active');
                }
            });
        });
    }
    
    // Fermer le dropdown si on clique en dehors
    document.addEventListener('click', (e) => {
        if (languageDropdown && !languageToggle.contains(e.target) && !languageDropdown.contains(e.target)) {
            languageDropdown.classList.remove('active');
        }
    });
}

function initializeImageGenerator() {
    if (imageGeneratorBtn) {
        imageGeneratorBtn.addEventListener('click', () => showImageGenerator());
    }
    if (imageGeneratorBtnSmall) {
        imageGeneratorBtnSmall.addEventListener('click', () => showImageGenerator());
    }
    
    if (imageGeneratorClose) {
        imageGeneratorClose.addEventListener('click', () => hideImageGenerator());
    }
    if (imageGeneratorCancel) {
        imageGeneratorCancel.addEventListener('click', () => hideImageGenerator());
    }
    
    if (imageGeneratorForm) {
        imageGeneratorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            generateImage();
        });
    }
    
    const exampleButtons = document.querySelectorAll('.image-example-btn');
    exampleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const prompt = btn.getAttribute('data-prompt');
            if (imagePrompt) {
                imagePrompt.value = prompt;
            }
        });
    });
    
    if (imageRegenerateBtn) {
        imageRegenerateBtn.addEventListener('click', () => generateImage());
    }
    if (imageSendBtn) {
        imageSendBtn.addEventListener('click', () => sendGeneratedImageToChat());
    }
    if (imageDownloadBtn) {
        imageDownloadBtn.addEventListener('click', () => downloadGeneratedImage());
    }
}

// ===== GESTION DU GÉNÉRATEUR D'IMAGES =====

function showImageGenerator() {
    if (imageGeneratorModal) {
        imageGeneratorModal.classList.add('active');
        isModalOpen = true;
        document.body.classList.add('no-scroll');
        
        if (imagePrompt) imagePrompt.value = '';
        if (imageStyleSelect) imageStyleSelect.value = 'realistic';
        if (imageQualitySelect) imageQualitySelect.value = 'standard';
        
        if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
        if (imageResult) imageResult.style.display = 'none';
        if (imageLoading) imageLoading.style.display = 'none';
    }
}

function hideImageGenerator() {
    if (imageGeneratorModal) {
        imageGeneratorModal.classList.remove('active');
        isModalOpen = false;
        document.body.classList.remove('no-scroll');
    }
}

async function generateImage() {
    if (!imagePrompt || !imagePrompt.value.trim()) {
        alert(currentLanguage === 'en' ? 'Please describe the image you want to generate' : 'Veuillez décrire l\'image que vous voulez générer');
        return;
    }
    
    if (isImageGenerationInProgress) return;
    
    isImageGenerationInProgress = true;
    
    if (imagePreviewContainer) {
        imagePreviewContainer.style.display = 'block';
        if (imageLoading) imageLoading.style.display = 'flex';
        if (imageResult) imageResult.style.display = 'none';
    }
    
    const prompt = imagePrompt.value.trim();
    const style = imageStyleSelect ? imageStyleSelect.value : 'realistic';
    const quality = imageQualitySelect ? imageQualitySelect.value : 'standard';
    
    try {
        let fullPrompt = prompt;
        if (style !== 'realistic') {
            fullPrompt += `, ${style} style`;
        }
        
        if (quality === 'high') {
            fullPrompt += ', high quality, detailed';
        } else if (quality === 'ultra') {
            fullPrompt += ', ultra high quality, extremely detailed, 8k';
        }
        
        const encodedPrompt = encodeURIComponent(fullPrompt);
        const apiUrl = `${IMAGE_API_URL}?prompt=${encodedPrompt}&apikey=${API_KEY}`;
        
        console.log('Génération d\'image avec l\'URL:', apiUrl);
        
        // Pour l'API magic, on s'attend à une réponse JSON avec une URL d'image
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        // Essayer de parser la réponse comme JSON
        let imageUrl;
        try {
            const data = await response.json();
            if (data.image || data.url) {
                imageUrl = data.image || data.url;
            } else if (data.data && data.data.image) {
                imageUrl = data.data.image;
            } else {
                // Si pas de JSON valide, utiliser l'URL de la réponse
                imageUrl = response.url;
            }
        } catch (jsonError) {
            console.log('Réponse non-JSON, utilisation de l\'URL directe');
            imageUrl = response.url;
        }
        
        if (generatedImage) {
            generatedImage.src = imageUrl;
            generatedImage.alt = prompt;
            
            // Forcer le chargement de l'image
            await new Promise((resolve, reject) => {
                generatedImage.onload = resolve;
                generatedImage.onerror = reject;
                setTimeout(resolve, 3000); // Timeout après 3s
            });
            
            if (imageLoading) imageLoading.style.display = 'none';
            if (imageResult) imageResult.style.display = 'block';
            
            generatedImage.dataset.downloadUrl = imageUrl;
        }
        
    } catch (error) {
        console.error('Erreur lors de la génération d\'image:', error);
        alert(currentLanguage === 'en' ? 'An error occurred while generating the image. Please try again.' : 'Une erreur est survenue lors de la génération de l\'image. Veuillez réessayer.');
        
        if (imageLoading) {
            imageLoading.innerHTML = `
                <div style="text-align: center; color: #ef4444;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p>${currentLanguage === 'en' ? 'Failed to generate image. Please try again.' : 'Échec de la génération de l\'image. Veuillez réessayer.'}</p>
                </div>
            `;
        }
    } finally {
        isImageGenerationInProgress = false;
    }
}

function sendGeneratedImageToChat() {
    if (!generatedImage || !generatedImage.src) return;
    
    const imageUrl = generatedImage.src;
    const prompt = imagePrompt ? imagePrompt.value.trim() : '';
    
    const imageMessage = new Message(
        generateId(),
        'image',
        imageUrl,
        'user',
        new Date()
    );
    
    imageMessage.description = prompt;
    
    addMessageToConversation(imageMessage);
    addMessageToDOM(imageMessage);
    
    hideImageGenerator();
    
    scrollToBottom(true);
    
    setTimeout(() => {
        const botResponse = new Message(
            generateId(),
            'text',
            currentLanguage === 'en' 
                ? `🎨 **Image generated successfully!**\n\nI have received your image request: *"${prompt}"*\n\n**What would you like to do now?**\n• Describe this image in detail 🖼️\n• Generate another different image 🔄\n• Discuss its cultural context 🌍\n\n*Tell me what interests you!* 🐇`
                : `🎨 **Image générée avec succès !**\n\nJ'ai bien reçu votre demande d'image : *"${prompt}"*\n\n**Que voulez-vous faire maintenant ?**\n• Décrire cette image en détail 🖼️\n• Générer une autre image différente 🔄\n• Discuter de son contexte culturel 🌍\n\n*Dites-moi ce qui vous intéresse !* 🐇`,
            'bot',
            new Date()
        );
        
        addMessageWithStreamingEffect(botResponse);
    }, 1000);
}

function downloadGeneratedImage() {
    if (!generatedImage || !generatedImage.src) return;
    
    const imageUrl = generatedImage.src;
    const prompt = imagePrompt ? imagePrompt.value.trim() : 'generated-image';
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `culturelink-${prompt.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ===== NOUVELLE API AVEC RÉPONSE PROGRESSIVE =====

async function callLinkyAPI(userMessage) {
    try {
        const fullPrompt = `${LINKY_PROMPT}\n\nMessage de l'utilisateur: ${userMessage}`;
        const url = `${TEXT_API_URL}?apikey=${API_KEY}&query=${encodeURIComponent(fullPrompt)}&uid=${currentUserId}&model=${MODEL}`;
        
        console.log('Appel API Linky vers:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === true && data.response) {
            return data.response;
        } else if (data.reply) {
            return data.reply;
        } else if (data.message) {
            return data.message;
        } else {
            throw new Error('Format de réponse invalide');
        }
        
    } catch (error) {
        console.error('Erreur API Linky:', error);
        return getFallbackResponse(userMessage, error);
    }
}

function formatAPIResponse(text) {
    if (!text) return '';
    
    let formatted = text;
    
    formatted = formatted.replace(/^##\s+(.+)$/gm, '<h3>$1</h3>');
    formatted = formatted.replace(/^###\s+(.+)$/gm, '<h4>$1</h4>');
    
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/__(.*?)__/g, '<u>$1</u>');
    
    formatted = formatted.replace(/^\s*[-*•]\s+(.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');
    
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<code>$1</code>');
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    formatted = formatted.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
    
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = formatted.replace(/\n(?!\n)/g, '<br>');
    
    formatted = formatted.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    formatted = formatted.replace(/&lt;(strong|em|u|h3|h4|li|code|blockquote|p|br|ul|ol)&gt;/g, '<$1>');
    formatted = formatted.replace(/&lt;\/(strong|em|u|h3|h4|li|code|blockquote|p|br|ul|ol)&gt;/g, '</$1>');
    
    let lines = formatted.split('\n');
    let inList = false;
    let listType = '';
    let result = [];
    
    for (let line of lines) {
        if (line.includes('<li>')) {
            if (!inList) {
                inList = true;
                listType = line.match(/^\d+\./) ? 'ol' : 'ul';
                result.push(`<${listType} class="formatted-list">`);
            }
            result.push(line);
        } else {
            if (inList) {
                result.push(`</${listType}>`);
                inList = false;
                listType = '';
            }
            result.push(line);
        }
    }
    
    if (inList) {
        result.push(`</${listType}>`);
    }
    
    formatted = result.join('\n');
    
    return `<div class="formatted-response">${formatted}</div>`;
}

function getFallbackResponse(userMessage, error) {
    const lowerUserMessage = userMessage.toLowerCase();
    const errorMessage = error.message || '';
    
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
        return currentLanguage === 'en' 
            ? "**🌐 Connection Problem**\n\nI cannot connect to the server. Please check your internet connection and try again.\n\n*Meanwhile, I can tell you about:*\n• **African culture** 🇧🇫\n• **Ecology** 🌱\n• **Animes** 🎬\n• **Traditional cuisine** 🍲\n\nWhat topic interests you?"
            : "**🌐 Problème de connexion**\n\nJe ne peux pas me connecter au serveur. Veuillez vérifier votre connexion internet et réessayer.\n\n*En attendant, je peux vous parler de :*\n• **Culture africaine** 🇧🇫\n• **Écologie** 🌱\n• **Animes** 🎬\n• **Cuisine traditionnelle** 🍲\n\nQuel sujet vous intéresse ?";
    }
    
    if (lowerUserMessage.includes('bonjour') || lowerUserMessage.includes('hello') || lowerUserMessage.includes('salut')) {
        return currentLanguage === 'en'
            ? "**Hi! 😎**\n\nI'm Linky 🐇, your cultural buddy from Burkina 🇧🇫 in full revolutionary effervescence!\n\n*I'm passionate about:*\n🌍 **Culture & History**\n🌱 **Ecology & Environment**\n🎬 **Animes & Entertainment**\n🍲 **Cuisine & Traditions**\n🎓 **Learning & Pedagogy**\n\n**What brings you on this discovery journey today?** 🐇✨"
            : "**Salut ! 😎**\n\nJe suis Linky 🐇, ton pote culturel du Burkina 🇧🇫 en pleine effervescence révolutionnaire !\n\n*Je suis passionné par :*\n🌍 **Culture & Histoire**\n🌱 **Écologie & Environnement**\n🎬 **Animes & Divertissement**\n🍲 **Cuisine & Traditions**\n🎓 **Apprentissage & Pédagogie**\n\n**Qu'est-ce qui t'amène dans ce voyage de découvertes aujourd'hui ?** 🐇✨";
    }
    
    if (lowerUserMessage.includes('culture') || lowerUserMessage.includes('afric')) {
        return currentLanguage === 'en'
            ? "**🇧🇫 African Culture - Our Wealth!**\n\nAfrican culture is *incredibly diverse* and **profoundly rich**!\n\n*Some gems:*\n\n**🏛️ Ancestral Civilizations**\n• **Mossi Empire** - Guardians of Burkinabè traditions\n• **Ashanti Kingdom** - Gold and social organization\n• **Yoruba Civilization** - Art and spirituality\n\n**🎨 Arts & Traditions**\n• **Ritual masks**\n• **Bogolan textiles**\n• **Percussive music**\n\n**💫 African Values**\n• *Ubuntu* - \"I am because we are\"\n• **Community solidarity**\n• Respect for **elders and ancestors**\n\n**What aspect would you like to focus on?** 🐇"
            : "**🇧🇫 Culture Africaine - Notre Richesse !**\n\nLa culture africaine est *incroyablement diverse* et **profondément riche** !\n\n*Quelques joyaux :*\n\n**🏛️ Civilisations Ancestrales**\n• **Empire Mossi** - Gardiens des traditions burkinabè\n• **Royaume Ashanti** - Or et organisation sociale\n• **Civilisation Yoruba** - Art et spiritualité\n\n**🎨 Arts & Traditions**\n• **Masques rituels**\n• **Textiles bogolan**\n• **Musique percussive**\n\n**💫 Valeurs Africaines**\n• *Ubuntu* - \"Je suis parce que nous sommes\"\n• **Solidarité communautaire**\n• Respect des **aînés et ancêtres**\n\n**Sur quel aspect veux-tu qu'on se concentre ?** 🐇";
    }
    
    if (lowerUserMessage.includes('écologie') || lowerUserMessage.includes('nature') || lowerUserMessage.includes('environnement') || lowerUserMessage.includes('ecology')) {
        return currentLanguage === 'en'
            ? "**🌱 African Ecology - Wisdom & Solutions**\n\nAfrica possesses *millennial ecological wisdom*!\n\n**🌍 Unique Biodiversity**\n• **Sacred forests** - Biodiversity sanctuaries\n• **Savannas** - Complex ecosystems\n• **Deserts** - Extraordinary adaptations\n\n**💡 Traditional Solutions**\n• **Sustainable agriculture**\n• **Community resource management**\n• **Plant-based medicine**\n\n**🚀 Challenges & Opportunities**\n• **Climate change**\n• **Innovative conservation**\n• **Green economy**\n\n**What aspect of ecology interests you?** 🌿"
            : "**🌱 Écologie Africaine - Sagesse & Solutions**\n\nL'Afrique possède une *sagesse écologique millénaire* !\n\n**🌍 Biodiversité Unique**\n• **Forêts sacrées** - Sanctuaires de biodiversité\n• **Savanes** - Écosystèmes complexes\n• **Déserts** - Adaptations extraordinaires\n\n**💡 Solutions Traditionnelles**\n• **Agriculture durable**\n• **Gestion communautaire des ressources**\n• **Médecine par les plantes**\n\n**🚀 Défis & Opportunités**\n• **Changement climatique**\n• **Conservation innovante**\n• **Économie verte**\n\n**Quel aspect de l'écologie t'intéresse ?** 🌿";
    }
    
    if (lowerUserMessage.includes('anime') || lowerUserMessage.includes('manga')) {
        return currentLanguage === 'en'
            ? "**🎬 Animes - Windows to the Imaginary**\n\nI *love* animes! They transport us to **incredible worlds**.\n\n**🔥 My Favorites**\n1. **Attack on Titan** - *Deep themes of freedom and survival*\n2. **Demon Slayer** - **Breathtaking animation**\n3. **One Piece** - *Adventure and friendship without limits*\n\n**🇯🇵 Japanese Culture**\n• **Unique aesthetics**\n• **Values of perseverance**\n• **Narrative richness**\n\n**Are you looking for a recommendation or a specific analysis?** 🎭"
            : "**🎬 Animes - Fenêtres sur l'Imaginaire**\n\nJ'*adore* les animes ! Ils nous transportent dans des **mondes incroyables**.\n\n**🔥 Mes Coups de Cœur**\n1. **Attack on Titan** - *Thèmes profonds de liberté et survie*\n2. **Demon Slayer** - **Animation époustouflante**\n3. **One Piece** - *Aventure et amitié sans limites*\n\n**🇯🇵 Culture Japonaise**\n• **Esthétique unique**\n• **Valeurs de persévérance**\n• **Richesse narrative**\n\n**Tu cherches une recommandation ou une analyse spécifique ?** 🎭";
    }
    
    if (lowerUserMessage.includes('cuisine') || lowerUserMessage.includes('recette') || lowerUserMessage.includes('manger') || lowerUserMessage.includes('food')) {
        return currentLanguage === 'en'
            ? "**🍲 African Cuisine - Flavors & Traditions**\n\nAfrican cuisine is a **feast for the senses**!\n\n**🇧🇫 Burkinabè Specialties**\n• **Riz gras** - *Rice with vegetables and meat*\n• **Tô** - **Millet or corn ball**\n• **Poulet bicyclette** - *Grilled farm chicken*\n\n**🌍 Continental Diversity**\n• **Couscous** - Maghreb\n• **Jollof rice** - West Africa\n• **Injera** - Horn of Africa\n\n**Do you want a specific recipe or info about a dish?** 👨‍🍳"
            : "**🍲 Cuisine Africaine - Saveurs & Traditions**\n\nLa cuisine africaine est une **fête des sens** !\n\n**🇧🇫 Spécialités Burkinabè**\n• **Riz gras** - *Riz aux légumes et viande*\n• **Tô** - **Boule de mil ou maïs**\n• **Poulet bicyclette** - *Poulet fermier grillé*\n\n**🌍 Diversité Continentale**\n• **Couscous** - Maghreb\n• **Jollof rice** - Afrique de l'Ouest\n• **Injera** - Corne de l'Afrique\n\n**Tu veux une recette spécifique ou des infos sur un plat ?** 👨‍🍳";
    }
    
    return currentLanguage === 'en'
        ? "**🐇 Linky at your service!**\n\nHi! I'm your cultural companion from Burkina Faso 🇧🇫, in the midst of a revolution of ideas and creativity!\n\n*I can help you with:*\n\n**📚 Culture & History**\n• African civilizations\n• Traditions and arts\n• World heritage\n\n**🌱 Ecology & Environment**\n• Biodiversity\n• Sustainable solutions\n• Traditional knowledge\n\n**🎬 Entertainment & Animes**\n• Recommendations\n• Analyses\n• Pop culture\n\n**🍲 Cuisine & Traditions**\n• Authentic recipes\n• Culinary stories\n• Traditional techniques\n\n**🎓 Pedagogy & Learning**\n• Clear explanations\n• Educational quizzes\n• Homework help\n\n**Where would you like to start our exploration?** 🌟"
        : "**🐇 Linky à ton service !**\n\nSalut ! Je suis ton compagnon culturel du Burkina Faso 🇧🇫, en pleine révolution d'idées et de créativité !\n\n*Je peux t'aider avec :*\n\n**📚 Culture & Histoire**\n• Civilisations africaines\n• Traditions et arts\n• Patrimoine mondial\n\n**🌱 Écologie & Environnement**\n• Biodiversité\n• Solutions durables\n• Savoirs traditionnels\n\n**🎬 Divertissement & Animes**\n• Recommandations\n• Analyses\n• Culture pop\n\n**🍲 Cuisine & Traditions**\n• Recettes authentiques\n• Histoires culinaires\n• Techniques traditionnelles\n\n**🎓 Pédagogie & Apprentissage**\n• Explications claires\n• Quiz éducatifs\n• Aide aux devoirs\n\n**Par où veux-tu commencer notre exploration ?** 🌟";
}

// ===== GESTION DES MESSAGES AVEC EFFET PROGRESSIF =====

function addMessageToDOM(message, animate = true) {
    if (!conversationMessages) return null;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sender}-message ${message.type}-message`;
    messageDiv.id = message.id;
    
    if (animate) {
        messageDiv.style.animation = 'messageSlideIn 0.3s ease';
    }
    
    const avatar = message.sender === 'user' ? 'U' : '🐇';
    const time = formatTime(message.timestamp);
    
    let content = '';
    if (message.type === 'image') {
        content = `
            <div class="generated-image">
                <img src="${message.content}" alt="${message.description || 'Generated image'}" style="max-width: 100%; border-radius: 12px;">
                <div class="image-actions">
                    <button class="image-action-btn delete-btn" onclick="deleteMessage('${message.id}')">
                        <i class="fas fa-trash"></i> ${currentLanguage === 'en' ? 'Delete' : 'Supprimer'}
                    </button>
                </div>
            </div>
        `;
    } else {
        content = message.content;
    }
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-avatar">${avatar}</div>
            <div class="message-text">
                ${content}
                <div class="message-time">${time}</div>
            </div>
        </div>
    `;
    
    conversationMessages.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.classList.add('highlighted');
        setTimeout(() => {
            messageDiv.classList.remove('highlighted');
        }, 2000);
    }, 100);
    
    return messageDiv;
}

function addMessageWithStreamingEffect(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message text-message';
    messageDiv.id = message.id;
    
    const time = formatTime(message.timestamp);
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-avatar thinking">🐇</div>
            <div class="message-text">
                <span id="${message.id}-text"></span>
                <div class="message-time">${time}</div>
            </div>
        </div>
    `;
    
    if (conversationMessages) {
        conversationMessages.appendChild(messageDiv);
    }
    
    currentStreamingMessage = message;
    streamingChars = [];
    
    streamMessageText(message.content, message.id);
    
    return messageDiv;
}

function streamMessageText(text, messageId) {
    const textElement = document.getElementById(`${messageId}-text`);
    if (!textElement) return;
    
    const cleanText = text.replace(/<[^>]*>/g, '');
    const chars = cleanText.split('');
    
    let index = 0;
    let formattedBuffer = '';
    let inTag = false;
    let currentTag = '';
    
    function streamNextChar() {
        if (index >= chars.length) {
            finishStreaming(text, messageId);
            return;
        }
        
        const char = chars[index];
        
        if (char === '<') {
            inTag = true;
            currentTag = '<';
        } else if (char === '>' && inTag) {
            currentTag += '>';
            inTag = false;
            formattedBuffer += currentTag;
            currentTag = '';
        } else if (inTag) {
            currentTag += char;
        } else {
            formattedBuffer += char;
        }
        
        textElement.innerHTML = formatAPIResponse(formattedBuffer) + '<span class="typing-cursor"></span>';
        
        index++;
        
        const delay = Math.random() * 30 + 20;
        
        // Défilement intelligent pendant le streaming
        smartScrollDuringStreaming();
        
        setTimeout(streamNextChar, delay);
    }
    
    streamNextChar();
}

function finishStreaming(fullText, messageId) {
    const textElement = document.getElementById(`${messageId}-text`);
    if (textElement) {
        textElement.innerHTML = formatAPIResponse(fullText);
    }
    
    if (currentStreamingMessage) {
        currentStreamingMessage.content = fullText;
        addMessageToConversation(currentStreamingMessage);
    }
    
    currentStreamingMessage = null;
    streamingChars = [];
    
    finishTyping();
    
    // Défilement final après la fin du streaming
    scrollToBottom(true);
}

// ===== DÉFILEMENT AUTOMATIQUE AMÉLIORÉ =====

function handleScrollImproved() {
    if (!messagesContainer || !scrollToBottomBtn) return;
    
    const scrollPosition = messagesContainer.scrollTop;
    const containerHeight = messagesContainer.clientHeight;
    const contentHeight = messagesContainer.scrollHeight;
    
    const distanceFromBottom = contentHeight - scrollPosition - containerHeight;
    const isNearBottom = distanceFromBottom < 100; // 100px du bas
    
    if (isNearBottom) {
        autoScrollEnabled = true;
        scrollToBottomBtn.classList.remove('visible');
        isUserScrolling = false;
    } else {
        autoScrollEnabled = false;
        scrollToBottomBtn.classList.add('visible');
        isUserScrolling = true;
        
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            isUserScrolling = false;
        }, 2000);
    }
}

function smartScrollDuringStreaming() {
    if (!messagesContainer || isUserScrolling) return;
    
    const scrollPosition = messagesContainer.scrollTop;
    const containerHeight = messagesContainer.clientHeight;
    const contentHeight = messagesContainer.scrollHeight;
    
    const distanceFromBottom = contentHeight - scrollPosition - containerHeight;
    const isNearBottom = distanceFromBottom < 300; // 300px du bas
    
    if (isNearBottom) {
        requestAnimationFrame(() => {
            messagesContainer.scrollTo({
                top: contentHeight,
                behavior: 'smooth'
            });
        });
    }
}

function scrollToBottom(force = false) {
    if (!messagesContainer || isModalOpen) return;
    
    if (force || (autoScrollEnabled && !isUserScrolling)) {
        requestAnimationFrame(() => {
            const contentHeight = messagesContainer.scrollHeight;
            const containerHeight = messagesContainer.clientHeight;
            
            messagesContainer.scrollTo({
                top: contentHeight - containerHeight,
                behavior: force ? 'smooth' : 'instant'
            });
            
            if (force && scrollToBottomBtn) {
                scrollToBottomBtn.classList.remove('visible');
            }
        });
    }
}

// ===== FONCTION PRINCIPALE D'ENVOI =====

async function sendMessage() {
    if (!messageInput) return;
    
    const text = messageInput.value.trim();
    if (!text || isApiCallInProgress) return;

    if (text.length > MESSAGE_CHAR_LIMIT) {
        showCharLimitWarning('message');
        return;
    }

    if (!currentConversationId || conversations.find(c => c.id === currentConversationId)?.messages.length === 0) {
        if (newConversation) newConversation.style.display = 'none';
        if (conversationMessages) conversationMessages.style.display = 'block';
    }

    if (!currentConversationId) {
        createNewConversation(text);
    }

    const userMessage = new Message(
        generateId(),
        'text',
        text,
        'user',
        new Date()
    );
    
    addMessageToConversation(userMessage);
    addMessageToDOM(userMessage);
    
    messageInput.value = '';
    updateCharCount();
    autoResizeTextarea();
    
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    }
    
    scrollToBottom(true);
    
    await getBotResponseWithStreaming(text);
}

async function getBotResponseWithStreaming(userMessage) {
    isTyping = true;
    isApiCallInProgress = true;
    
    try {
        const apiResponse = await callLinkyAPI(userMessage);
        
        const botMessage = new Message(
            generateId(),
            'text',
            apiResponse,
            'bot',
            new Date()
        );
        
        addMessageWithStreamingEffect(botMessage);
        
    } catch (error) {
        console.error('Erreur lors de la réponse:', error);
        
        const errorMessage = new Message(
            generateId(),
            'text',
            currentLanguage === 'en'
                ? "**⚠️ Oops! Technical issue**\n\nI'm encountering a small issue processing your request. It happens even to the best digital griots!\n\n*In the meantime:*\n• **Reload the page**\n• **Check your connection**\n• **Try again in 2 minutes**\n\n*Otherwise, let's talk about:*\n🌍 **African culture**\n🌱 **Ecology**\n🎬 **Your favorite animes**\n\n**What do you say?** 🐇"
                : "**⚠️ Oups ! Problème technique**\n\nJe rencontre un petit souci pour traiter ta demande. Ça arrive même aux meilleurs griots digitaux !\n\n*En attendant :*\n• **Recharge la page**\n• **Vérifie ta connexion**\n• **Réessaye dans 2 minutes**\n\n*Sinon, parlons de :*\n🌍 **Culture africaine**\n🌱 **Écologie**\n🎬 **Tes animes préférés**\n\n**Ça te dit ?** 🐇",
            'bot',
            new Date()
        );
        
        addMessageWithStreamingEffect(errorMessage);
    }
}

function finishTyping() {
    isTyping = false;
    isPaused = false;
    isApiCallInProgress = false;
    
    if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    }
    
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

// ===== GESTION DES CONVERSATIONS =====

function createNewConversation(firstMessage = null) {
    const id = generateId();
    
    let title;
    if (firstMessage) {
        title = (firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage);
        
        let counter = 1;
        let baseTitle = title;
        while (conversations.some(c => c.title === title)) {
            title = `${baseTitle} (${counter})`;
            counter++;
        }
    } else {
        title = currentLanguage === 'en' ? "New conversation" : "Nouvelle conversation";
    }
    
    const conversation = new Conversation(id, title);
    conversations.unshift(conversation);
    currentConversationId = id;
    
    saveConversations();
    updateConversationList();
    updateConversationName();
    
    return conversation;
}

function addMessageToConversation(message, conversationId = null) {
    const targetConversationId = conversationId || currentConversationId;
    const conversation = conversations.find(c => c.id === targetConversationId);
    
    if (!conversation) return null;
    
    if (conversation.totalChars + message.charCount > CONVERSATION_CHAR_LIMIT) {
        showCharLimitWarning('conversation');
        return null;
    }
    
    conversation.messages.push(message);
    conversation.updatedAt = new Date();
    conversation.totalChars += message.charCount;
    
    if (conversation.messages.length === 1 && message.sender === 'user') {
        conversation.title = (message.content.length > 30 ? 
            message.content.substring(0, 30) + '...' : 
            message.content);
    }
    
    saveConversations();
    updateConversationList();
    
    return conversation;
}

function saveConversations() {
    try {
        localStorage.setItem('culturelink_conversations', JSON.stringify(conversations));
    } catch (error) {
        console.error('Erreur sauvegarde conversations:', error);
        if (error.name === 'QuotaExceededError') {
            alert(currentLanguage === 'en' 
                ? "Insufficient storage space. Old conversations will be deleted."
                : "Espace de stockage insuffisant. Les anciennes conversations seront supprimées.");
            conversations = conversations.slice(0, 5);
            saveConversations();
        }
    }
}

function loadSavedConversations() {
    try {
        const saved = localStorage.getItem('culturelink_conversations');
        if (saved) {
            const parsed = JSON.parse(saved);
            conversations = parsed.map(conv => {
                const conversation = new Conversation(conv.id, conv.title);
                conversation.messages = conv.messages || [];
                conversation.createdAt = new Date(conv.createdAt);
                conversation.updatedAt = new Date(conv.updatedAt);
                conversation.pinned = conv.pinned || false;
                conversation.totalChars = conv.totalChars || 0;
                return conversation;
            });
            
            updateConversationList();
        }
    } catch (error) {
        console.error('Erreur chargement conversations:', error);
        conversations = [];
    }
}

function updateConversationList() {
    if (!conversationList) return;
    
    conversationList.innerHTML = '';
    
    const nonEmptyConversations = conversations.filter(c => c.messages.length > 0);
    
    if (nonEmptyConversations.length === 0) {
        conversationList.innerHTML = `
            <div class="empty-conversations">
                <i class="fas fa-comments" style="font-size: 2rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <div style="text-align: center; opacity: 0.7; padding: 1rem;">
                    ${currentLanguage === 'en' ? 'No conversations' : 'Aucune conversation'}
                </div>
            </div>
        `;
        return;
    }
    
    const sortedConversations = [...nonEmptyConversations].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    
    sortedConversations.forEach(conversation => {
        conversationList.appendChild(createConversationItem(conversation));
    });
}

function createConversationItem(conversation) {
    const conversationItem = document.createElement('div');
    conversationItem.className = `conversation-item ${conversation.id === currentConversationId ? 'active' : ''} ${conversation.pinned ? 'pinned' : ''}`;
    
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    let preview = currentLanguage === 'en' ? "New conversation" : "Nouvelle conversation";
    
    if (lastMessage) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = lastMessage.content;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        preview = textContent.length > 50 ? textContent.substring(0, 50) + '...' : textContent;
    }
    
    const timeStr = formatTime(conversation.updatedAt);
    const dateStr = formatDate(conversation.updatedAt);
    
    conversationItem.innerHTML = `
        <div class="conversation-avatar">${conversation.pinned ? '📌' : '🐇'}</div>
        <div class="conversation-info">
            <div class="conversation-title">${conversation.title}</div>
            <div class="conversation-preview">${preview}</div>
            <div class="conversation-date">${dateStr} • ${timeStr}</div>
        </div>
        <div class="conversation-actions">
            <button class="conversation-action-btn delete-btn" title="${currentLanguage === 'en' ? 'Delete' : 'Supprimer'}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    conversationItem.addEventListener('click', (e) => {
        if (!e.target.closest('.conversation-actions')) {
            loadConversation(conversation.id);
            hidePanels();
        }
    });
    
    const deleteBtn = conversationItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteConversation(conversation.id);
    });
    
    return conversationItem;
}

function deleteConversation(conversationId) {
    if (confirm(currentLanguage === 'en' 
        ? 'Are you sure you want to delete this conversation? This action is irreversible.'
        : 'Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible.')) {
        const index = conversations.findIndex(c => c.id === conversationId);
        if (index !== -1) {
            conversations.splice(index, 1);
            
            if (currentConversationId === conversationId) {
                if (conversations.length > 0) {
                    loadConversation(conversations[0].id);
                } else {
                    currentConversationId = null;
                    clearChatInterface();
                }
            }
            
            updateConversationList();
            saveConversations();
        }
    }
}

function loadConversation(conversationId) {
    if (isApiCallInProgress) {
        finishTyping();
    }
    
    if (currentConversationId === conversationId) return;
    
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    currentConversationId = conversationId;
    renderConversationMessages(conversation);
    
    if (newConversation) newConversation.style.display = 'none';
    if (conversationMessages) {
        conversationMessages.style.display = 'block';
        conversationMessages.scrollTop = conversationMessages.scrollHeight;
    }
    
    updateConversationName();
    scrollToBottom(true);
}

function renderConversationMessages(conversation) {
    if (!conversationMessages) return;
    
    conversationMessages.innerHTML = '';
    
    if (conversation.messages.length > 50) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'conversation-info-message';
        infoDiv.innerHTML = `<div class="info-text">${conversation.messages.length} ${currentLanguage === 'en' ? 'messages in this conversation' : 'messages dans cette conversation'}</div>`;
        conversationMessages.appendChild(infoDiv);
    }
    
    conversation.messages.forEach(message => {
        addMessageToDOM(message, false);
    });
}

// ===== FONCTIONS D'INTERFACE =====

function showChat() {
    if (homeInterface) homeInterface.classList.remove('active');
    if (chatInterface) chatInterface.classList.add('active');
    if (newConversation) newConversation.style.display = 'flex';
    if (conversationMessages) conversationMessages.style.display = 'none';
    currentConversationId = null;
    
    setTimeout(() => {
        if (messageInput) messageInput.focus();
    }, 300);
}

function showHome() {
    if (chatInterface) chatInterface.classList.remove('active');
    if (homeInterface) homeInterface.classList.add('active');
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('culturelink_theme', currentTheme);
    updateThemeIcon();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('culturelink_theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.body.setAttribute('data-theme', currentTheme);
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcons = document.querySelectorAll('#theme-btn i, #panel-theme-btn i, #settings-theme-btn i');
    themeIcons.forEach(icon => {
        if (currentTheme === 'light') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });
}

function showConversationsPanel() {
    if (conversationsPanel) conversationsPanel.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.classList.add('no-scroll');
    updateConversationList();
}

function showSettingsPanel() {
    if (settingsPanel) settingsPanel.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.classList.add('no-scroll');
}

function hidePanels() {
    if (conversationsPanel) conversationsPanel.classList.remove('active');
    if (settingsPanel) settingsPanel.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function newChat() {
    createNewConversation();
    clearChatInterface();
    hidePanels();
    if (messageInput) messageInput.focus();
}

function clearChatInterface() {
    if (conversationMessages) conversationMessages.innerHTML = '';
    if (newConversation) newConversation.style.display = 'flex';
    if (conversationMessages) conversationMessages.style.display = 'none';
    updateConversationName();
        
    if (isTyping) {
        finishTyping();
    }
    
    setTimeout(() => {
        if (messageInput) messageInput.focus();
    }, 100);
}

function updateConversationName() {
    const conversation = conversations.find(c => c.id === currentConversationId);
    const displayElement = document.getElementById('conversation-name-display');
    if (displayElement) {
        const t = translations[currentLanguage];
        displayElement.textContent = conversation ? conversation.title : t.conversationName;
    }
}

function sendHello() {
    if (messageInput) {
        messageInput.value = currentLanguage === 'en' ? "Hello 👋, how are you?" : "Bonjour 👋, comment ça va ?";
        sendMessage();
    }
}

function setupQuickActions() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn[data-message]');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const message = btn.getAttribute('data-message');
            if (messageInput) {
                messageInput.value = message;
                messageInput.focus();
                messageInput.select();
            }
        });
    });
}

function hideExtraQuickActions() {
    const hiddenActions = document.querySelectorAll('.quick-action-btn.hidden-action');
    hiddenActions.forEach(action => {
        action.style.display = 'none';
    });
    if (moreActionsBtn) {
        moreActionsBtn.style.display = 'flex';
    }
    isMoreActionsExpanded = false;
}

function toggleMoreActions() {
    const hiddenActions = document.querySelectorAll('.quick-action-btn.hidden-action');
    
    if (isMoreActionsExpanded) {
        hiddenActions.forEach(action => {
            action.style.display = 'none';
        });
        if (moreActionsBtn) {
            moreActionsBtn.querySelector('.quick-action-text').textContent = currentLanguage === 'en' ? "More" : "Plus";
            moreActionsBtn.querySelector('i').className = 'fas fa-chevron-down';
        }
        isMoreActionsExpanded = false;
    } else {
        hiddenActions.forEach(action => {
            action.style.display = 'flex';
        });
        if (moreActionsBtn) {
            moreActionsBtn.querySelector('.quick-action-text').textContent = currentLanguage === 'en' ? "Less" : "Moins";
            moreActionsBtn.querySelector('i').className = 'fas fa-chevron-up';
        }
        isMoreActionsExpanded = true;
    }
}

// ===== COMPTEUR DE CARACTÈRES =====

function updateCharCount() {
    if (!charCountElement || !messageInput) return;
    
    const count = messageInput.value.length;
    const remaining = MESSAGE_CHAR_LIMIT - count;
    const countSpan = charCountElement.querySelector('span');
    
    if (!countSpan) return;
    
    if (remaining <= 0) {
        countSpan.textContent = `${count} / ${MESSAGE_CHAR_LIMIT}`;
        charCountElement.classList.add('danger');
        charCountElement.classList.remove('warning');
    } else if (remaining <= 500) {
        countSpan.textContent = `${count} / ${MESSAGE_CHAR_LIMIT}`;
        charCountElement.classList.add('warning');
        charCountElement.classList.remove('danger');
    } else {
        countSpan.textContent = `${count}`;
        charCountElement.classList.remove('warning', 'danger');
    }
    
    if (charLimitWarning) {
        if (remaining <= 0) {
            charLimitWarning.style.display = 'block';
            charLimitWarning.textContent = currentLanguage === 'en' 
                ? `Limit exceeded (${MESSAGE_CHAR_LIMIT} characters maximum)`
                : `Limite dépassée (${MESSAGE_CHAR_LIMIT} caractères maximum)`;
        } else {
            charLimitWarning.style.display = 'none';
        }
    }
}

function showCharLimitWarning(type) {
    if (type === 'message') {
        alert(currentLanguage === 'en'
            ? `Message too long! The limit is ${MESSAGE_CHAR_LIMIT} characters. Please shorten your message.`
            : `Message trop long ! La limite est de ${MESSAGE_CHAR_LIMIT} caractères. Veuillez raccourcir votre message.`);
    } else if (type === 'conversation') {
        alert(currentLanguage === 'en'
            ? `Conversation limit reached (${CONVERSATION_CHAR_LIMIT} characters). Please start a new conversation.`
            : `Limite de conversation atteinte (${CONVERSATION_CHAR_LIMIT} caractères). Veuillez démarrer une nouvelle conversation.`);
    }
}

function autoResizeTextarea() {
    if (!messageInput) return;
    
    messageInput.style.height = 'auto';
    const newHeight = Math.min(messageInput.scrollHeight, 120);
    messageInput.style.height = newHeight + 'px';
    
    setTimeout(() => {
        scrollToBottom();
    }, 50);
}

function showModal(modalName) {
    const modal = document.getElementById(`${modalName}-modal`);
    if (modal) {
        modal.classList.add('active');
        isModalOpen = true;
        document.body.classList.add('no-scroll');
    }
}

function hideModal(modalName) {
    const modal = document.getElementById(`${modalName}-modal`);
    if (modal) {
        modal.classList.remove('active');
        isModalOpen = false;
        document.body.classList.remove('no-scroll');
    }
}

function setupModalCloseHandlers() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                isModalOpen = false;
                document.body.classList.remove('no-scroll');
            }
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isModalOpen) {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                isModalOpen = false;
                document.body.classList.remove('no-scroll');
            }
        }
    });
}

function downloadApp() {
    const downloadModal = document.createElement('div');
    downloadModal.className = 'download-notification';
    downloadModal.innerHTML = `
        <div class="download-content">
            <i class="fas fa-download" style="font-size: 2rem; margin-bottom: 1rem;"></i>
            <h3>${currentLanguage === 'en' ? 'Download' : 'Téléchargement'}</h3>
            <p>${currentLanguage === 'en' 
                ? 'The CultureLink application will be available soon!' 
                : 'L\'application CultureLink sera bientôt disponible !'}</p>
            <button class="btn-primary" style="margin-top: 1rem;">${currentLanguage === 'en' ? 'OK' : 'D\'accord'}</button>
        </div>
    `;
    
    document.body.appendChild(downloadModal);
    
    setTimeout(() => {
        downloadModal.classList.add('show');
    }, 10);
    
    const closeBtn = downloadModal.querySelector('.btn-primary');
    closeBtn.addEventListener('click', () => {
        downloadModal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(downloadModal);
        }, 300);
    });
    
    downloadModal.addEventListener('click', (e) => {
        if (e.target === downloadModal) {
            downloadModal.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(downloadModal);
            }, 300);
        }
    });
}

// ===== OPTIMISATIONS =====

function setupPerformanceOptimizations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    if (conversationMessages) {
        const messages = conversationMessages.querySelectorAll('.message');
        messages.forEach(message => observer.observe(message));
    }
}

function cleanupOldConversations() {
    if (conversations.length > 20) {
        const unpinned = conversations.filter(c => !c.pinned);
        const toRemove = unpinned.slice(20);
        
        toRemove.forEach(conv => {
            const index = conversations.findIndex(c => c.id === conv.id);
            if (index !== -1) {
                conversations.splice(index, 1);
            }
        });
        
        saveConversations();
        updateConversationList();
    }
}

// ===== DÉMARRAGE =====
document.addEventListener('DOMContentLoaded', () => {
    try {
        loadTheme();
        loadLanguage();
        initApp();
        setupModalCloseHandlers();
        setupPerformanceOptimizations();
        cleanupOldConversations();
        
        console.log('Application CultureLink initialisée avec succès');
        console.log('APIs configurées - Texte:', TEXT_API_URL, 'Images:', IMAGE_API_URL);
        console.log('Langue actuelle:', currentLanguage);
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        alert(currentLanguage === 'en'
            ? "An error occurred while loading the application. Please refresh the page."
            : "Une erreur est survenue lors du chargement de l'application. Veuillez rafraîchir la page.");
    }
});

// ===== GESTION DES ERREURS GLOBALES =====
window.addEventListener('error', function(event) {
    console.error('Erreur globale:', event.error);
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Promesse non gérée:', event.reason);
});

// Fonction pour supprimer un message (utilisée dans les boutons d'image)
function deleteMessage(messageId) {
    if (!currentConversationId) return;
    
    const conversation = conversations.find(c => c.id === currentConversationId);
    if (!conversation) return;
    
    const messageIndex = conversation.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    if (confirm(currentLanguage === 'en' ? 'Delete this image?' : 'Supprimer cette image ?')) {
        conversation.messages.splice(messageIndex, 1);
        conversation.updatedAt = new Date();
        
        const messageElement = document.getElementById(messageId);
        if (messageElement) {
            messageElement.remove();
        }
        
        saveConversations();
        updateConversationList();
    }
}