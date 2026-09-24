// ==================================================
// SENTINEL AI — ENTERPRISE MULTILINGUAL SYSTEM
// Supports: English, Hindi, Marathi, Japanese, German, Spanish, French
// Integrated with Google Website Translator + Fallback Dictionary
// ==================================================

export interface SupportedLanguage {
  code: string
  name: string
  nativeName: string
  flag?: string
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
]

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.investigations': 'Investigations',
    'nav.cases': 'Cases',
    'nav.graph': 'Graph Explorer',
    'nav.approvals': 'Approvals',
    'nav.memory': 'Case Memory',
    'nav.audit': 'Audit Log',
    'nav.benchmark': 'Benchmark',
    'nav.settings': 'Settings',

    // Dashboard Headings
    'dashboard.eyebrow': 'OPERATIONS OVERVIEW',
    'dashboard.title': 'Sentinel — Fraud Operations',
    'dashboard.subtitle': 'Professional investigation, evidence and next-best-action.',
    'dashboard.start_btn': 'Start investigation',
    'dashboard.priority_investigations': 'Priority Investigations',
    'dashboard.view_queue': 'View queue',
    'dashboard.ai_activity': 'AI Investigation activity',
    'dashboard.live': 'Live',
    'dashboard.review_queue': 'REVIEW QUEUE',
    'dashboard.priority_cases': 'Priority cases',
    'dashboard.open_case': 'Open case',

    // KPI Cards
    'kpi.active_investigations': 'ACTIVE INVESTIGATIONS',
    'kpi.awaiting_evidence': 'AWAITING EVIDENCE',
    'kpi.pending_approvals': 'PENDING APPROVALS',
    'kpi.escalations': 'ESCALATIONS',
    'kpi.resolved_today': 'RESOLVED TODAY',

    // Table Headers
    'table.case': 'Case',
    'table.trigger': 'Trigger',
    'table.customer': 'Customer',
    'table.amount': 'Amount',
    'table.risk': 'Risk',
    'table.confidence': 'Confidence',
    'table.evidence': 'Evidence',
    'table.status': 'Status',
    'table.nba': 'NBA',
    'table.updated': 'Updated',
    'table.action': 'Action',

    // Status Badges
    'status.investigating': 'INVESTIGATING',
    'status.evidence_required': 'EVIDENCE REQUIRED',
    'status.awaiting_approval': 'AWAITING APPROVAL',
    'status.escalated': 'ESCALATED',
    'status.resolved': 'RESOLVED',
    'status.action_taken': 'ACTION TAKEN',
    'status.closed_no_fraud': 'CLOSED NO FRAUD',

    // Global Search & Header
    'search.placeholder': 'Search case, investigation, customer, device...',
    'header.engine_online': 'AI Engine Online',

    // Common
    'common.items': 'items',
    'common.evidence': 'evidence',
    'common.confidence': 'confidence',
  },

  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.investigations': 'जांच',
    'nav.cases': 'मामले',
    'nav.graph': 'ग्राफ़ एक्सप्लोरर',
    'nav.approvals': 'स्वीकृतियां',
    'nav.memory': 'केस मेमोरी',
    'nav.audit': 'ऑडिट लॉग',
    'nav.benchmark': 'बेंचमार्क',
    'nav.settings': 'सेटिंग्स',

    // Dashboard Headings
    'dashboard.eyebrow': 'संचालन अवलोकन',
    'dashboard.title': 'सेंटिनल — धोखाधड़ी संचालन',
    'dashboard.subtitle': 'पेशेवर जांच, साक्ष्य और अगला सर्वोत्तम कदम।',
    'dashboard.start_btn': 'जांच शुरू करें',
    'dashboard.priority_investigations': 'प्राथमिकता जांच',
    'dashboard.view_queue': 'कतार देखें',
    'dashboard.ai_activity': 'एआई जांच गतिविधि',
    'dashboard.live': 'सक्रिय',
    'dashboard.review_queue': 'समीक्षा कतार',
    'dashboard.priority_cases': 'प्राथमिकता मामले',
    'dashboard.open_case': 'केस खोलें',

    // KPI Cards
    'kpi.active_investigations': 'सक्रिय जांच',
    'kpi.awaiting_evidence': 'साक्ष्य की प्रतीक्षा',
    'kpi.pending_approvals': 'लंबित स्वीकृतियां',
    'kpi.escalations': 'एस्केलेशन',
    'kpi.resolved_today': 'आज हल किए गए',

    // Table Headers
    'table.case': 'मामला',
    'table.trigger': 'ट्रिगर',
    'table.customer': 'ग्राहक',
    'table.amount': 'राशि',
    'table.risk': 'जोखिम',
    'table.confidence': 'विश्वास',
    'table.evidence': 'साक्ष्य',
    'table.status': 'स्थिति',
    'table.nba': 'एनबीए (अगला कदम)',
    'table.updated': 'अपडेट',
    'table.action': 'कार्रवाई',

    // Status Badges
    'status.investigating': 'जांच जारी',
    'status.evidence_required': 'साक्ष्य आवश्यक',
    'status.awaiting_approval': 'स्वीकृति प्रतीक्षित',
    'status.escalated': 'एस्केलेटेड',
    'status.resolved': 'हल किया गया',
    'status.action_taken': 'कार्रवाई की गई',
    'status.closed_no_fraud': 'धोखाधड़ी नहीं',

    // Global Search & Header
    'search.placeholder': 'मामला, जांच, ग्राहक, डिवाइस खोजें...',
    'header.engine_online': 'एआई इंजन सक्रिय',

    // Common
    'common.items': 'आइटम',
    'common.evidence': 'साक्ष्य',
    'common.confidence': 'विश्वास',
  },

  mr: {
    // Navigation
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.investigations': 'तपास',
    'nav.cases': 'प्रकरणे',
    'nav.graph': 'आलेख एक्सप्लोरर',
    'nav.approvals': 'मंजुरी',
    'nav.memory': 'केस मेमरी',
    'nav.audit': 'ऑडिट नोंद',
    'nav.benchmark': 'बेंचमार्क',
    'nav.settings': 'सेटिंग्ज',

    // Dashboard Headings
    'dashboard.eyebrow': 'ऑपरेशन्स विहंगावलोकन',
    'dashboard.title': 'सेंटिनेल — फसवणूक ऑपरेशन्स',
    'dashboard.subtitle': 'व्यावसायिक तपास, पुरावा आणि पुढील सर्वोत्तम कृती.',
    'dashboard.start_btn': 'तपास सुरू करा',
    'dashboard.priority_investigations': 'प्राधान्य तपास',
    'dashboard.view_queue': 'रांग पहा',
    'dashboard.ai_activity': 'एआय तपास क्रियाकलाप',
    'dashboard.live': 'थेट',
    'dashboard.review_queue': 'पुनरावलोकन रांग',
    'dashboard.priority_cases': 'प्राधान्य प्रकरणे',
    'dashboard.open_case': 'केस उघडा',

    // KPI Cards
    'kpi.active_investigations': 'सक्रिय तपास',
    'kpi.awaiting_evidence': 'पुराव्याची प्रतीक्षा',
    'kpi.pending_approvals': 'प्रलंबित मंजुरी',
    'kpi.escalations': 'एस्केलेशन्स',
    'kpi.resolved_today': 'आज सोडवलेले',

    // Table Headers
    'table.case': 'प्रकरण',
    'table.trigger': 'ट्रिगर',
    'table.customer': 'ग्राहक',
    'table.amount': 'रक्कम',
    'table.risk': 'जोखीम',
    'table.confidence': 'विश्वासार्हता',
    'table.evidence': 'पुरावा',
    'table.status': 'स्थिती',
    'table.nba': 'पुढील कृती',
    'table.updated': 'अद्यतनित',
    'table.action': 'कृती',

    // Status Badges
    'status.investigating': 'तपास सुरू',
    'status.evidence_required': 'पुरावा आवश्यक',
    'status.awaiting_approval': 'मंजुरी प्रलंबित',
    'status.escalated': 'वाढवले',
    'status.resolved': 'सोडवले',
    'status.action_taken': 'कृती केली',
    'status.closed_no_fraud': 'फसवणूक नाही',

    // Global Search & Header
    'search.placeholder': 'प्रकरण, तपास, ग्राहक, डिव्हाइस शोधा...',
    'header.engine_online': 'एआय इंजिन सक्रिय',

    // Common
    'common.items': 'घटक',
    'common.evidence': 'पुरावा',
    'common.confidence': 'विश्वासार्हता',
  },

  ja: {
    // Navigation
    'nav.dashboard': 'ダッシュボード',
    'nav.investigations': '調査',
    'nav.cases': '案件',
    'nav.graph': 'グラフエクスプローラー',
    'nav.approvals': '承認',
    'nav.memory': 'ケースメモリ',
    'nav.audit': '監査ログ',
    'nav.benchmark': 'ベンチマーク',
    'nav.settings': '設定',

    // Dashboard Headings
    'dashboard.eyebrow': '運用概要',
    'dashboard.title': 'センチネル — 不正対策オペレーション',
    'dashboard.subtitle': '専門的な調査、証拠、および最善の次の一手。',
    'dashboard.start_btn': '調査を開始',
    'dashboard.priority_investigations': '優先調査案件',
    'dashboard.view_queue': 'キューを表示',
    'dashboard.ai_activity': 'AI調査アクティビティ',
    'dashboard.live': 'ライブ',
    'dashboard.review_queue': 'レビューキュー',
    'dashboard.priority_cases': '優先案件',
    'dashboard.open_case': 'ケースを開く',

    // KPI Cards
    'kpi.active_investigations': '進行中の調査',
    'kpi.awaiting_evidence': '証拠待ち',
    'kpi.pending_approvals': '承認待ち',
    'kpi.escalations': 'エスカレーション',
    'kpi.resolved_today': '本日解決済み',

    // Table Headers
    'table.case': '案件',
    'table.trigger': 'トリガー',
    'table.customer': '顧客',
    'table.amount': '金額',
    'table.risk': 'リスク',
    'table.confidence': '信頼度',
    'table.evidence': '証拠',
    'table.status': 'ステータス',
    'table.nba': '推奨アクション',
    'table.updated': '更新日時',
    'table.action': 'アクション',

    // Status Badges
    'status.investigating': '調査中',
    'status.evidence_required': '証拠が必要',
    'status.awaiting_approval': '承認待ち',
    'status.escalated': 'エスカレーション済み',
    'status.resolved': '解決済み',
    'status.action_taken': '対応完了',
    'status.closed_no_fraud': '不正なし',

    // Global Search & Header
    'search.placeholder': 'ケース、調査、顧客、デバイスを検索...',
    'header.engine_online': 'AIエンジン稼働中',

    // Common
    'common.items': '件',
    'common.evidence': '証拠',
    'common.confidence': '信頼度',
  },

  de: {
    // Navigation
    'nav.dashboard': 'Übersicht',
    'nav.investigations': 'Ermittlungen',
    'nav.cases': 'Fälle',
    'nav.graph': 'Graph-Explorer',
    'nav.approvals': 'Genehmigungen',
    'nav.memory': 'Fallgedächtnis',
    'nav.audit': 'Audit-Protokoll',
    'nav.benchmark': 'Benchmark',
    'nav.settings': 'Einstellungen',

    // Dashboard Headings
    'dashboard.eyebrow': 'BETRIEBSÜBERSICHT',
    'dashboard.title': 'Sentinel — Betrugsermittlung',
    'dashboard.subtitle': 'Professionelle Untersuchung, Beweise und nächste beste Maßnahme.',
    'dashboard.start_btn': 'Ermittlung starten',
    'dashboard.priority_investigations': 'Prioritäre Ermittlungen',
    'dashboard.view_queue': 'Warteschlange',
    'dashboard.ai_activity': 'KI-Ermittlungsaktivität',
    'dashboard.live': 'Live',
    'dashboard.review_queue': 'PRÜFWARTESCHLANGE',
    'dashboard.priority_cases': 'Prioritäre Fälle',
    'dashboard.open_case': 'Fall öffnen',

    // KPI Cards
    'kpi.active_investigations': 'AKTIVE ERMITTLUNGEN',
    'kpi.awaiting_evidence': 'BEWEISE AUSSTEHEND',
    'kpi.pending_approvals': 'AUSSTEHENDE GENEHMIGUNGEN',
    'kpi.escalations': 'ESKALATIONEN',
    'kpi.resolved_today': 'HEUTE GELÖST',

    // Table Headers
    'table.case': 'Fall',
    'table.trigger': 'Auslöser',
    'table.customer': 'Kunde',
    'table.amount': 'Betrag',
    'table.risk': 'Risiko',
    'table.confidence': 'Konfidenz',
    'table.evidence': 'Beweise',
    'table.status': 'Status',
    'table.nba': 'Nächste Aktion',
    'table.updated': 'Aktualisiert',
    'table.action': 'Aktion',

    // Status Badges
    'status.investigating': 'IN UNTERSUCHUNG',
    'status.evidence_required': 'BEWEISE ERFORDERLICH',
    'status.awaiting_approval': 'GENEHMIGUNG AUSSTEHEND',
    'status.escalated': 'ESKALIERT',
    'status.resolved': 'GELÖST',
    'status.action_taken': 'MASSNAHME ERGRIFFEN',
    'status.closed_no_fraud': 'KEIN BETRUG',

    // Global Search & Header
    'search.placeholder': 'Fall, Ermittlung, Kunde, Gerät suchen...',
    'header.engine_online': 'KI-Engine Online',

    // Common
    'common.items': 'Einträge',
    'common.evidence': 'Beweise',
    'common.confidence': 'Konfidenz',
  },

  es: {
    // Navigation
    'nav.dashboard': 'Panel',
    'nav.investigations': 'Investigaciones',
    'nav.cases': 'Casos',
    'nav.graph': 'Explorador de Grafos',
    'nav.approvals': 'Aprobaciones',
    'nav.memory': 'Memoria de Casos',
    'nav.audit': 'Registro de Auditoría',
    'nav.benchmark': 'Evaluación',
    'nav.settings': 'Configuración',

    // Dashboard Headings
    'dashboard.eyebrow': 'RESUMEN OPERATIVO',
    'dashboard.title': 'Sentinel — Operaciones de Fraude',
    'dashboard.subtitle': 'Investigación profesional, evidencia y siguiente mejor acción.',
    'dashboard.start_btn': 'Iniciar investigación',
    'dashboard.priority_investigations': 'Investigaciones Prioritarias',
    'dashboard.view_queue': 'Ver cola',
    'dashboard.ai_activity': 'Actividad de investigación IA',
    'dashboard.live': 'En vivo',
    'dashboard.review_queue': 'COLA DE REVISIÓN',
    'dashboard.priority_cases': 'Casos prioritarios',
    'dashboard.open_case': 'Abrir caso',

    // KPI Cards
    'kpi.active_investigations': 'INVESTIGACIONES ACTIVAS',
    'kpi.awaiting_evidence': 'ESPERANDO EVIDENCIA',
    'kpi.pending_approvals': 'APROBACIONES PENDIENTES',
    'kpi.escalations': 'ESCALAMIENTOS',
    'kpi.resolved_today': 'RESUELTOS HOY',

    // Table Headers
    'table.case': 'Caso',
    'table.trigger': 'Disparador',
    'table.customer': 'Cliente',
    'table.amount': 'Monto',
    'table.risk': 'Riesgo',
    'table.confidence': 'Confianza',
    'table.evidence': 'Evidencia',
    'table.status': 'Estado',
    'table.nba': 'Siguiente Acción',
    'table.updated': 'Actualizado',
    'table.action': 'Acción',

    // Status Badges
    'status.investigating': 'INVESTIGANDO',
    'status.evidence_required': 'EVIDENCIA REQUERIDA',
    'status.awaiting_approval': 'ESPERANDO APROBACIÓN',
    'status.escalated': 'ESCALADO',
    'status.resolved': 'RESUELTO',
    'status.action_taken': 'ACCIÓN TOMADA',
    'status.closed_no_fraud': 'SIN FRAUDE',

    // Global Search & Header
    'search.placeholder': 'Buscar caso, investigación, cliente, dispositivo...',
    'header.engine_online': 'Motor de IA en línea',

    // Common
    'common.items': 'elementos',
    'common.evidence': 'evidencias',
    'common.confidence': 'confianza',
  },

  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.investigations': 'Enquêtes',
    'nav.cases': 'Dossiers',
    'nav.graph': 'Explorateur de Graphes',
    'nav.approvals': 'Approbations',
    'nav.memory': 'Mémoire des Dossiers',
    'nav.audit': 'Journal d\'Audit',
    'nav.benchmark': 'Évaluation',
    'nav.settings': 'Paramètres',

    // Dashboard Headings
    'dashboard.eyebrow': 'APERÇU DES OPÉRATIONS',
    'dashboard.title': 'Sentinel — Opérations Anti-Fraude',
    'dashboard.subtitle': 'Enquête professionnelle, preuves et meilleure action suivante.',
    'dashboard.start_btn': 'Démarrer l\'enquête',
    'dashboard.priority_investigations': 'Enquêtes Prioritaires',
    'dashboard.view_queue': 'Voir la file',
    'dashboard.ai_activity': 'Activité d\'enquête IA',
    'dashboard.live': 'En direct',
    'dashboard.review_queue': 'FILE D\'ATTENTE',
    'dashboard.priority_cases': 'Dossiers prioritaires',
    'dashboard.open_case': 'Ouvrir le dossier',

    // KPI Cards
    'kpi.active_investigations': 'ENQUÊTES ACTIVES',
    'kpi.awaiting_evidence': 'PREUVES EN ATTENTE',
    'kpi.pending_approvals': 'APPROBATIONS EN ATTENTE',
    'kpi.escalations': 'ALERTES / ESCALADES',
    'kpi.resolved_today': 'RÉSOLUS AUJOURD\'HUI',

    // Table Headers
    'table.case': 'Dossier',
    'table.trigger': 'Déclencheur',
    'table.customer': 'Client',
    'table.amount': 'Montant',
    'table.risk': 'Risque',
    'table.confidence': 'Confiance',
    'table.evidence': 'Preuves',
    'table.status': 'Statut',
    'table.nba': 'Meilleure Action',
    'table.updated': 'Mis à jour',
    'table.action': 'Action',

    // Status Badges
    'status.investigating': 'EN COURS D\'ENQUÊTE',
    'status.evidence_required': 'PREUVES REQUISES',
    'status.awaiting_approval': 'EN ATTENTE D\'APPROBATION',
    'status.escalated': 'ESCALADÉ',
    'status.resolved': 'RÉSOLU',
    'status.action_taken': 'ACTION PRISE',
    'status.closed_no_fraud': 'PAS DE FRAUDE',

    // Global Search & Header
    'search.placeholder': 'Rechercher dossier, enquête, client, appareil...',
    'header.engine_online': 'Moteur IA en ligne',

    // Common
    'common.items': 'éléments',
    'common.evidence': 'preuves',
    'common.confidence': 'confiance',
  }
}

/**
 * Translate a UI string key with fallback to English
 */
export function t(key: string, lang: string = 'en'): string {
  const langDict = TRANSLATIONS[lang] || TRANSLATIONS.en
  return langDict[key] || TRANSLATIONS.en[key] || key
}

/**
 * Change Google Translate language dynamically or set cookies
 */
export function setGoogleTranslateLanguage(langCode: string): void {
  try {
    if (typeof window === 'undefined') return

    // 1. Set Google Translate cookies
    const hostname = window.location.hostname
    const cookieVal = langCode === 'en' ? '' : `/en/${langCode}`

    // Clear previous cookies
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`

    if (langCode !== 'en') {
      document.cookie = `googtrans=${cookieVal}; path=/;`
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${hostname};`
      document.cookie = `googtrans=${cookieVal}; path=/; domain=.${hostname};`
    }

    // 2. Update HTML document lang
    document.documentElement.lang = langCode

    // 3. Dispatch change event to Google Translate combo if present
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo')
    if (select) {
      select.value = langCode
      select.dispatchEvent(new Event('change'))
    } else {
      let attempts = 0
      const timer = setInterval(() => {
        attempts++
        const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo')
        if (combo) {
          combo.value = langCode
          combo.dispatchEvent(new Event('change'))
          clearInterval(timer)
        } else if (attempts >= 15) {
          clearInterval(timer)
        }
      }, 200)
    }
  } catch (err) {
    console.warn('Google Translate sync error:', err)
  }
}

/**
 * Initialize Google Translate Script safely
 */
export function initGoogleTranslate(): void {
  if (typeof window === 'undefined') return

  // Register the global callback
  ;(window as any).googleTranslateElementInit = () => {
    try {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,mr,ja,de,es,fr',
            autoDisplay: false,
            layout: (window as any).google.translate.TranslateElement.InlineLayout?.SIMPLE
          },
          'google_translate_element'
        )
      }
    } catch (e) {
      console.warn('Google Translate Element initialization error:', e)
    }
  }

  // Inject script once if not already present
  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script')
    script.id = 'google-translate-script'
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)
  }
}
