// ==================================================
// SENTINEL AI — ZERO-LATENCY MULTILINGUAL SYSTEM
// Instant Synchronous UI Translation (0ms Latency) + 
// Seamless Background Google Website Translator
// Languages: English, हिन्दी, मराठी, 日本語, Deutsch, Español, Français
// ==================================================

'use client'

import React, { createContext, useContext } from 'react'

// --------------------------------------------------
// BROWSER DOM MUTATION SAFEGUARD
// Prevents Google Translate / browser extensions from crashing React Virtual DOM reconciliation
// Eliminates "Failed to execute 'removeChild' on 'Node'" which causes full page reloads!
// --------------------------------------------------
if (typeof window !== 'undefined') {
  try {
    const originalRemoveChild = Node.prototype.removeChild
    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (child.parentNode !== this) {
        if (child.parentNode) {
          return child.parentNode.removeChild(child) as T
        }
        return child
      }
      return originalRemoveChild.apply(this, arguments as any) as T
    }

    const originalInsertBefore = Node.prototype.insertBefore
    Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
      if (referenceNode && referenceNode.parentNode !== this) {
        if (referenceNode.parentNode) {
          return referenceNode.parentNode.insertBefore(newNode, referenceNode) as T
        }
        return this.appendChild(newNode) as T
      }
      return originalInsertBefore.apply(this, arguments as any) as T
    }
  } catch (e) {
    console.warn('DOM safeguard initialization error:', e)
  }
}

export interface SupportedLanguage {
  code: string
  name: string
  nativeName: string
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

    // Dashboard
    'dashboard.eyebrow': 'OPERATIONS OVERVIEW',
    'dashboard.title': 'Sentinel — Fraud Operations',
    'dashboard.subtitle': 'Professional investigation, evidence and next-best-action.',
    'dashboard.start_btn': 'Start investigation',
    'dashboard.priority_investigations': 'Priority Investigations',
    'dashboard.view_queue': 'View queue',
    'dashboard.ai_activity': 'AI investigation activity',
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

    // Tabs
    'tab.all': 'All',
    'tab.active': 'Active',
    'tab.awaiting_evidence': 'Awaiting Evidence',
    'tab.awaiting_approval': 'Awaiting Approval',
    'tab.escalated': 'Escalated',
    'tab.resolved': 'Resolved',

    // Approvals
    'approvals.title': 'Pending Approvals',
    'approvals.eyebrow': 'HUMAN-IN-THE-LOOP CONTROL',
    'approvals.subtitle': 'Review policy-constrained actions requiring supervisor or lead authorization.',
    'approvals.approve': 'Approve',
    'approvals.reject': 'Reject',
    'approvals.executed': 'Executed',

    // Cases Page
    'cases.title': 'Cases',
    'cases.eyebrow': 'CASE MANAGEMENT & DOSSIER PORTFOLIO',
    'cases.subtitle': 'Comprehensive repository of fraud dossiers, suspicious activity reports (SAR), and enterprise risk outcomes.',
    'cases.sar_template': 'SAR Template',
    'cases.new_case': 'New case filing',
    'cases.total_dossiers': 'Total Dossiers',
    'cases.active_portfolio': 'Active Enterprise Portfolio',
    'cases.high_exposure': 'High Exposure / SAR',
    'cases.critical_threshold': 'Critical Risk Threshold',
    'cases.prevented_exposure': 'Prevented Exposure',
    'cases.protected_value': 'Protected Value',
    'cases.graph_resolution': 'Graph Resolution',
    'cases.tigergraph_grounded': 'TigerGraph Grounded',
    'cases.search_placeholder': 'Search cases by ID, customer, transaction or typology...',
    'cases.copy_sar': 'Copy SAR Dossier',
    'cases.copied': 'Copied!',

    // Investigation Workspace
    'workspace.eyebrow': 'INVESTIGATION WORKSPACE',
    'workspace.refresh': 'Refresh',
    'workspace.risk': 'RISK',
    'workspace.confidence': 'CONFIDENCE',
    'workspace.evidence_sufficiency': 'EVIDENCE SUFFICIENCY',
    'workspace.agent_active': 'Agent active',
    'workspace.events': 'events',
    'workspace.evidence_findings': 'Evidence & findings',
    'workspace.items_live': 'ITEMS · LIVE',
    'workspace.agent_finding': 'Agent finding',
    'workspace.pattern': 'Pattern',
    'workspace.policy': 'Policy',
    'workspace.agent_activity': 'Agent activity',
    'workspace.live_stream': 'Live Stream',
    'workspace.decision_readiness': 'DECISION READINESS',
    'workspace.uncertainty': 'Investigation uncertainty',
    'workspace.known': 'Known',
    'workspace.uncertain': 'Uncertain',
    'workspace.confidence_meter': 'Confidence meter',
    'workspace.all_uncertainties_resolved': 'All key uncertainties resolved',
    'workspace.evidence_supports': 'Evidence now supports definitive intervention.',
    'workspace.why_not_acting': 'Why we are not acting yet',
    'workspace.nba_recommended': 'RECOMMENDED NEXT-BEST-ACTION',
    'workspace.allowed': 'Allowed',
    'workspace.approval_required': 'Approval required',
    'workspace.request_evidence': 'Request new evidence',
    'workspace.send_approval': 'Send for approval',

    // Case Memory
    'memory.title': 'Case Memory',
    'memory.eyebrow': 'GRAPH-INDEXED MEMORY',
    'memory.subtitle': 'Historical investigation context for better decisions, retrieved from TigerGraph closed cases.',
    'memory.search_placeholder': 'Search memory cases, notes, signals...',
    'memory.historical_context': 'Historical context',
    'memory.match': 'match',
    'memory.shared_signals': 'Shared signals',
    'memory.historical_exposure': 'Historical exposure',
    'memory.review_context': 'Review case context',

    // Audit Log
    'audit.title': 'Audit Log',
    'audit.eyebrow': 'COMPLIANCE & TRACEABILITY',
    'audit.subtitle': 'Operational event stream across AI agents, tools, policies and human supervisors.',
    'audit.timestamp': 'Timestamp',
    'audit.case_id': 'Case ID',
    'audit.actor': 'Actor',
    'audit.event': 'Event',
    'audit.tool_action': 'Tool / Action',
    'audit.outcome_result': 'Outcome / Result',

    // Benchmark
    'benchmark.title': 'Benchmark Evaluation',
    'benchmark.eyebrow': 'HHGOA BENCHMARK HARNESS (20 EXAM CASES)',
    'benchmark.subtitle': 'Execute the investigation agent against the 20 official HHGOA exam cases.',
    'benchmark.run_all': 'Run All 20 Cases',
    'benchmark.evaluating': 'Evaluating cases...',
    'benchmark.evaluated': 'Evaluated',
    'benchmark.confirmed_fraud': 'Confirmed Fraud',
    'benchmark.cleared_legitimate': 'Cleared Legitimate',
    'benchmark.sars_filed': 'SARs Filed',
    'benchmark.total_exposure': 'Total Exposure',
    'benchmark.processed': '100% processed',
    'benchmark.defensible_verdicts': 'Defensible verdicts',
    'benchmark.false_alarms': 'False alarms caught',
    'benchmark.fincen_standard': 'FinCEN standard',

    // Settings
    'settings.title': 'Settings',
    'settings.eyebrow': 'SYSTEM & PIPELINE CONFIGURATION',
    'settings.subtitle': 'Runtime architecture, graph database connections, model configuration and thresholds.',
    'settings.ops_config': 'Operations Configuration',
    'settings.auto_mode': 'Autonomous Execution Mode',
    'settings.dual_phase': 'Dual-Phase Agentic Traversal',
    'settings.high_risk_threshold': 'High Risk Threshold',
    'settings.evidence_req': 'Evidence Sufficiency Required',
    'settings.backend_conn': 'Backend Connection',
    'settings.tigergraph_mcp': 'TigerGraph & MCP Integration',

    // Graph Explorer
    'graph.title': 'Enterprise Graph Visualizer',
    'graph.eyebrow': 'GRAPH EXPLORER',
    'graph.subtitle': 'Interactive graph topology of entities, devices, and transaction chains.',
    'graph.active_case': 'Active Case',

    // Common
    'search.placeholder': 'Search case, investigation, customer, device...',
    'header.engine_online': 'AI Engine Online',
    'common.items': 'items',
    'common.evidence': 'evidence',
    'common.confidence': 'confidence',
    'common.refresh': 'Refresh',
    'common.filter': 'Filter',
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

    // Dashboard
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

    // Tabs
    'tab.all': 'सभी',
    'tab.active': 'सक्रिय',
    'tab.awaiting_evidence': 'साक्ष्य प्रतीक्षित',
    'tab.awaiting_approval': 'स्वीकृति प्रतीक्षित',
    'tab.escalated': 'एस्केलेटेड',
    'tab.resolved': 'हल किया गया',

    // Approvals
    'approvals.title': 'लंबित स्वीकृतियां',
    'approvals.eyebrow': 'मानव-इन-द-लूप नियंत्रण',
    'approvals.subtitle': 'पर्यवेक्षक या लीड प्राधिकरण की आवश्यकता वाली नीति-बाध्य कार्रवाइयों की समीक्षा करें।',
    'approvals.approve': 'स्वीकार करें',
    'approvals.reject': 'अस्वीकार करें',
    'approvals.executed': 'निष्पादित',

    // Cases Page
    'cases.title': 'मामले',
    'cases.eyebrow': 'केस प्रबंधन और डोजियर पोर्टफोलियो',
    'cases.subtitle': 'धोखाधड़ी डोजियर, संदिग्ध गतिविधि रिपोर्ट (SAR), और उद्यम जोखिम परिणामों का व्यापक भंडार।',
    'cases.sar_template': 'SAR टेम्पलेट',
    'cases.new_case': 'नया केस दाखिल करें',
    'cases.total_dossiers': 'कुल डोजियर',
    'cases.active_portfolio': 'सक्रिय उद्यम पोर्टफोलियो',
    'cases.high_exposure': 'उच्च जोखिम / SAR',
    'cases.critical_threshold': 'गंभीर जोखिम सीमा',
    'cases.prevented_exposure': 'रोकी गई जोखिम राशि',
    'cases.protected_value': 'सुरक्षित मूल्य',
    'cases.graph_resolution': 'ग्राफ़ समाधान',
    'cases.tigergraph_grounded': 'टाइगरग्राफ़ आधारित',
    'cases.search_placeholder': 'आईडी, ग्राहक, लेनदेन या प्रकार द्वारा खोजें...',
    'cases.copy_sar': 'SAR डोजियर कॉपी करें',
    'cases.copied': 'कॉपी हो गया!',

    // Investigation Workspace
    'workspace.eyebrow': 'जांच कार्यक्षेत्र',
    'workspace.refresh': 'ताज़ा करें',
    'workspace.risk': 'जोखिम',
    'workspace.confidence': 'विश्वास',
    'workspace.evidence_sufficiency': 'साक्ष्य पर्याप्तता',
    'workspace.agent_active': 'एजेंट सक्रिय',
    'workspace.events': 'घटनाएं',
    'workspace.evidence_findings': 'साक्ष्य और निष्कर्ष',
    'workspace.items_live': 'आइटम · लाइव',
    'workspace.agent_finding': 'एआई निष्कर्ष',
    'workspace.pattern': 'पैटर्न',
    'workspace.policy': 'नीति',
    'workspace.agent_activity': 'एजेंट गतिविधि',
    'workspace.live_stream': 'लाइव स्ट्रीम',
    'workspace.decision_readiness': 'निर्णय तत्परता',
    'workspace.uncertainty': 'जांच अनिश्चितता',
    'workspace.known': 'ज्ञात',
    'workspace.uncertain': 'अनिश्चित',
    'workspace.confidence_meter': 'विश्वास मीटर',
    'workspace.all_uncertainties_resolved': 'सभी प्रमुख अनिश्चितताएं हल हो गईं',
    'workspace.evidence_supports': 'साक्ष्य अब निर्णायक कार्रवाई का समर्थन करते हैं।',
    'workspace.why_not_acting': 'हम अभी कार्रवाई क्यों नहीं कर रहे हैं',
    'workspace.nba_recommended': 'अनुशंसित अगला सर्वोत्तम कदम',
    'workspace.allowed': 'अनुमत',
    'workspace.approval_required': 'स्वीकृति आवश्यक',
    'workspace.request_evidence': 'नया साक्ष्य मांगें',
    'workspace.send_approval': 'स्वीकृति हेतु भेजें',

    // Case Memory
    'memory.title': 'केस मेमोरी',
    'memory.eyebrow': 'ग्राफ़-अनुक्रमित मेमोरी',
    'memory.subtitle': 'बेहतर निर्णयों के लिए ऐतिहासिक जांच संदर्भ, टाइगरग्राफ़ बंद मामलों से प्राप्त।',
    'memory.search_placeholder': 'मेमोरी मामलों, नोट्स, संकेतों को खोजें...',
    'memory.historical_context': 'ऐतिहासिक संदर्भ',
    'memory.match': 'समानता',
    'memory.shared_signals': 'साझा संकेत',
    'memory.historical_exposure': 'ऐतिहासिक जोखिम',
    'memory.review_context': 'केस संदर्भ देखें',

    // Audit Log
    'audit.title': 'ऑडिट लॉग',
    'audit.eyebrow': 'अनुपालन और पता लगाने की क्षमता',
    'audit.subtitle': 'एआई एजेंटों, उपकरणों, नीतियों और पर्यवेक्षकों में परिचालन घटना प्रवाह।',
    'audit.timestamp': 'समय टिकट',
    'audit.case_id': 'केस आईडी',
    'audit.actor': 'कर्ता',
    'audit.event': 'घटना',
    'audit.tool_action': 'उपकरण / कार्रवाई',
    'audit.outcome_result': 'परिणाम',

    // Benchmark
    'benchmark.title': 'बेंचमार्क मूल्यांकन',
    'benchmark.eyebrow': 'HHGOA बेंचमार्क हार्नेस (20 परीक्षा मामले)',
    'benchmark.subtitle': '20 आधिकारिक HHGOA परीक्षा मामलों के विरुद्ध जांच एजेंट चलाएं।',
    'benchmark.run_all': 'सभी 20 मामले चलाएं',
    'benchmark.evaluating': 'मामलों का मूल्यांकन जारी...',
    'benchmark.evaluated': 'मूल्यांकित',
    'benchmark.confirmed_fraud': 'पुष्ट धोखाधड़ी',
    'benchmark.cleared_legitimate': 'सत्यापित वैध',
    'benchmark.sars_filed': 'दाखिल SARs',
    'benchmark.total_exposure': 'कुल जोखिम',
    'benchmark.processed': '100% संसाधित',
    'benchmark.defensible_verdicts': 'रक्षात्मक निर्णय',
    'benchmark.false_alarms': 'झूठे अलार्म पकड़े गए',
    'benchmark.fincen_standard': 'FinCEN मानक',

    // Settings
    'settings.title': 'सेटिंग्स',
    'settings.eyebrow': 'सिस्टम और पाइपलाइन विन्यास',
    'settings.subtitle': 'रनटाइम आर्किटेक्चर, ग्राफ़ डेटाबेस कनेक्शन, मॉडल विन्यास और सीमाएं।',
    'settings.ops_config': 'संचालन विन्यास',
    'settings.auto_mode': 'स्वायत्त निष्पादन मोड',
    'settings.dual_phase': 'दो-चरणीय एजेंटिक ट्रेवर्सल',
    'settings.high_risk_threshold': 'उच्च जोखिम सीमा',
    'settings.evidence_req': 'साक्ष्य पर्याप्तता आवश्यक',
    'settings.backend_conn': 'बैकएंड कनेक्शन',
    'settings.tigergraph_mcp': 'टाइगरग्राफ़ और MCP एकीकरण',

    // Graph Explorer
    'graph.title': 'उद्यम ग्राफ़ विज़ुअलाइज़र',
    'graph.eyebrow': 'ग्राफ़ एक्सप्लोरर',
    'graph.subtitle': 'संस्थाओं, उपकरणों और लेनदेन श्रृंखलाओं की इंटरैक्टिव टोपोलॉजी।',
    'graph.active_case': 'सक्रिय मामला',

    // Common
    'search.placeholder': 'मामला, जांच, ग्राहक, डिवाइस खोजें...',
    'header.engine_online': 'एआई इंजन सक्रिय',
    'common.items': 'आइटम',
    'common.evidence': 'साक्ष्य',
    'common.confidence': 'विश्वास',
    'common.refresh': 'ताज़ा करें',
    'common.filter': 'फ़िल्टर',
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

    // Dashboard
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

    // Tabs
    'tab.all': 'सर्व',
    'tab.active': 'सक्रिय',
    'tab.awaiting_evidence': 'पुरावा प्रलंबित',
    'tab.awaiting_approval': 'मंजुरी प्रलंबित',
    'tab.escalated': 'वाढवले',
    'tab.resolved': 'सोडवले',

    // Approvals
    'approvals.title': 'प्रलंबित मंजुरी',
    'approvals.eyebrow': 'मानव-इन-द-लूप नियंत्रण',
    'approvals.subtitle': 'पर्यवेक्षक किंवा प्रमुख अधिकृततेची आवश्यकता असलेल्या धोरण-बद्ध कृतींचे पुनरावलोकन करा.',
    'approvals.approve': 'मंजूर करा',
    'approvals.reject': 'नाकारा',
    'approvals.executed': 'अंमलबजावणी केली',

    // Cases Page
    'cases.title': 'प्रकरणे',
    'cases.eyebrow': 'केस व्यवस्थापन आणि डॉसियर पोर्टफोलिओ',
    'cases.subtitle': 'फसवणूक डॉसियर्स, संशयास्पद क्रियाकलाप अहवाल (SAR) आणि एंटरप्राइझ जोखीम निष्कर्षांचा व्यापक संग्रह.',
    'cases.sar_template': 'SAR टेम्पलेट',
    'cases.new_case': 'नवीन केस दाखल करा',
    'cases.total_dossiers': 'एकूण डॉसियर्स',
    'cases.active_portfolio': 'सक्रिय एंटरप्राइझ पोर्टफोलिओ',
    'cases.high_exposure': 'उच्च जोखीम / SAR',
    'cases.critical_threshold': 'गंभीर जोखीम मर्यादा',
    'cases.prevented_exposure': 'प्रतिबंधित जोखीम रक्कम',
    'cases.protected_value': 'संरक्षित मूल्य',
    'cases.graph_resolution': 'आलेख निराकरण',
    'cases.tigergraph_grounded': 'टायगरग्राफ आधारित',
    'cases.search_placeholder': 'आयडी, ग्राहक, व्यवहार किंवा प्रकारानुसार शोधा...',
    'cases.copy_sar': 'SAR डॉसियर कॉपी करा',
    'cases.copied': 'कॉपी केले!',

    // Investigation Workspace
    'workspace.eyebrow': 'तपास कार्यक्षेत्र',
    'workspace.refresh': 'रीफ्रेश करा',
    'workspace.risk': 'जोखीम',
    'workspace.confidence': 'विश्वासार्हता',
    'workspace.evidence_sufficiency': 'पुरावा पर्याप्तता',
    'workspace.agent_active': 'एजंट सक्रिय',
    'workspace.events': 'घटना',
    'workspace.evidence_findings': 'पुरावा आणि निष्कर्ष',
    'workspace.items_live': 'घटक · थेट',
    'workspace.agent_finding': 'एआय निष्कर्ष',
    'workspace.pattern': 'पॅटर्न',
    'workspace.policy': 'धोरण',
    'workspace.agent_activity': 'एजंट क्रियाकलाप',
    'workspace.live_stream': 'थेट प्रवाह',
    'workspace.decision_readiness': 'निर्णय तयारी',
    'workspace.uncertainty': 'तपास अनिश्चितता',
    'workspace.known': 'माहित असलेले',
    'workspace.uncertain': 'अनिश्चित',
    'workspace.confidence_meter': 'विश्वासार्हता मीटर',
    'workspace.all_uncertainties_resolved': 'सर्व प्रमुख अनिश्चितता सोडवल्या',
    'workspace.evidence_supports': 'पुरावा आता निर्णायक हस्तक्षेपास समर्थन देतो.',
    'workspace.why_not_acting': 'आम्ही अद्याप कारवाई का करत नाही',
    'workspace.nba_recommended': 'शिफारस केलेली पुढील सर्वोत्तम कृती',
    'workspace.allowed': 'परवानगी आहे',
    'workspace.approval_required': 'मंजुरी आवश्यक',
    'workspace.request_evidence': 'नवीन पुरावा मागा',
    'workspace.send_approval': 'मंजुरीसाठी पाठवा',

    // Case Memory
    'memory.title': 'केस मेमरी',
    'memory.eyebrow': 'आलेख-अनुक्रमित मेमरी',
    'memory.subtitle': 'उत्कृष्ट निर्णयांसाठी ऐतिहासिक तपास संदर्भ, टायगरग्राफ बंद प्रकरणांमधून मिळवला.',
    'memory.search_placeholder': 'मेमरी प्रकरणे, नोंदी, सिग्नल शोधा...',
    'memory.historical_context': 'ऐतिहासिक संदर्भ',
    'memory.match': 'साम्य',
    'memory.shared_signals': 'सामायिक सिग्नल',
    'memory.historical_exposure': 'ऐतिहासिक जोखीम',
    'memory.review_context': 'केस संदर्भ तपासा',

    // Audit Log
    'audit.title': 'ऑडिट नोंद',
    'audit.eyebrow': 'अनुपालन आणि शोधयोग्यता',
    'audit.subtitle': 'एआय एजंट्स, साधने, धोरणे आणि मानवी पर्यवेक्षकांमधील ऑपरेशनल इव्हेंट प्रवाह.',
    'audit.timestamp': 'वेळ नोंद',
    'audit.case_id': 'केस आयडी',
    'audit.actor': 'कर्ता',
    'audit.event': 'इव्हेंट',
    'audit.tool_action': 'साधन / कृती',
    'audit.outcome_result': 'निकाल',

    // Benchmark
    'benchmark.title': 'बेंचमार्क मूल्यांकन',
    'benchmark.eyebrow': 'HHGOA बेंचमार्क हार्नेस (20 परीक्षा प्रकरणे)',
    'benchmark.subtitle': '20 अधिकृत HHGOA परीक्षा प्रकरणांवर तपास एजंट चालवा.',
    'benchmark.run_all': 'सर्व 20 प्रकरणे चालवा',
    'benchmark.evaluating': 'प्रकरणांचे मूल्यांकन सुरू आहे...',
    'benchmark.evaluated': 'मूल्यांकन केले',
    'benchmark.confirmed_fraud': 'पुष्टी झालेली फसवणूक',
    'benchmark.cleared_legitimate': 'कायदेशीर म्हणून मंजुरी',
    'benchmark.sars_filed': 'दाखल केलेले SARs',
    'benchmark.total_exposure': 'एकूण जोखीम',
    'benchmark.processed': '100% प्रक्रिया पूर्ण',
    'benchmark.defensible_verdicts': 'समर्थनीय निर्णय',
    'benchmark.false_alarms': 'चुकीचे अलार्म पकडले',
    'benchmark.fincen_standard': 'FinCEN मानक',

    // Settings
    'settings.title': 'सेटिंग्ज',
    'settings.eyebrow': 'प्रणाली आणि पाइपलाइन संरचना',
    'settings.subtitle': 'रनटाइम आर्किटेक्चर, आलेख डेटाबेस कनेक्शन्स, मॉडेल कॉन्फिगरेशन आणि थ्रेशोल्ड्स.',
    'settings.ops_config': 'ऑपरेशन्स कॉन्फिगरेशन',
    'settings.auto_mode': 'स्वायत्त अंमलबजावणी मोड',
    'settings.dual_phase': 'द्वि-टप्पा एजंटिक ट्रॅव्हर्सल',
    'settings.high_risk_threshold': 'उच्च जोखीम मर्यादा',
    'settings.evidence_req': 'पुरावा पर्याप्तता आवश्यक',
    'settings.backend_conn': 'बॅकएंड कनेक्शन',
    'settings.tigergraph_mcp': 'टायगरग्राफ आणि MCP एकत्रीकरण',

    // Graph Explorer
    'graph.title': 'एंटरप्राइझ आलेख व्हिज्युअलायझर',
    'graph.eyebrow': 'आलेख एक्सप्लोरर',
    'graph.subtitle': 'घटक, उपकरणे आणि व्यवहार साखळ्यांचे परस्परसंवादी टोपोलॉजी.',
    'graph.active_case': 'सक्रिय प्रकरण',

    // Common
    'search.placeholder': 'प्रकरण, तपास, ग्राहक, डिव्हाइस शोधा...',
    'header.engine_online': 'एआय इंजिन सक्रिय',
    'common.items': 'घटक',
    'common.evidence': 'पुरावा',
    'common.confidence': 'विश्वासार्हता',
    'common.refresh': 'रीफ्रेश करा',
    'common.filter': 'फिल्टर',
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

    // Dashboard
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

    // Tabs
    'tab.all': 'すべて',
    'tab.active': '進行中',
    'tab.awaiting_evidence': '証拠待ち',
    'tab.awaiting_approval': '承認待ち',
    'tab.escalated': 'エスカレーション済み',
    'tab.resolved': '解決済み',

    // Approvals
    'approvals.title': '保留中の承認',
    'approvals.eyebrow': 'ヒューマン・イン・ザ・ループ制御',
    'approvals.subtitle': '管理者またはリードの承認を必要とするポリシー制限されたアクションを確認します。',
    'approvals.approve': '承認',
    'approvals.reject': '却下',
    'approvals.executed': '実行済み',

    // Cases Page
    'cases.title': '案件一覧',
    'cases.eyebrow': 'ケース管理＆ドシエポートフォリオ',
    'cases.subtitle': '不正ドシエ、疑わしい取引報告（SAR）、エンタープライズリスク結果の総合リポジトリ。',
    'cases.sar_template': 'SARテンプレート',
    'cases.new_case': '新規ケース作成',
    'cases.total_dossiers': '総ドシエ数',
    'cases.active_portfolio': 'アクティブポートフォリオ',
    'cases.high_exposure': '高リスク / SAR対象',
    'cases.critical_threshold': '重大リスク閾値',
    'cases.prevented_exposure': '阻止された被害額',
    'cases.protected_value': '保護された資産価値',
    'cases.graph_resolution': 'グラフ解決率',
    'cases.tigergraph_grounded': 'TigerGraph実証済み',
    'cases.search_placeholder': 'ID、顧客、取引、類型で検索...',
    'cases.copy_sar': 'SARドシエをコピー',
    'cases.copied': 'コピー完了!',

    // Investigation Workspace
    'workspace.eyebrow': '調査ワークスペース',
    'workspace.refresh': '更新',
    'workspace.risk': 'リスク',
    'workspace.confidence': '信頼度',
    'workspace.evidence_sufficiency': '証拠の十分性',
    'workspace.agent_active': 'エージェント稼働中',
    'workspace.events': '件のイベント',
    'workspace.evidence_findings': '証拠および所見',
    'workspace.items_live': '件 · ライブ',
    'workspace.agent_finding': 'AI分析所見',
    'workspace.pattern': 'パターン',
    'workspace.policy': 'ポリシー',
    'workspace.agent_activity': 'エージェントの活動',
    'workspace.live_stream': 'ライブストリーム',
    'workspace.decision_readiness': '意思決定の準備状況',
    'workspace.uncertainty': '調査の不確実性',
    'workspace.known': '確認済み事実',
    'workspace.uncertain': '不確実要素',
    'workspace.confidence_meter': '信頼度メーター',
    'workspace.all_uncertainties_resolved': 'すべての主要な不確実要素が解決されました',
    'workspace.evidence_supports': '証拠は現在、決定的な介入を支持しています。',
    'workspace.why_not_acting': '現時点で対応を保留している理由',
    'workspace.nba_recommended': '推奨される最善の次の一手',
    'workspace.allowed': '実行可能',
    'workspace.approval_required': '承認が必要',
    'workspace.request_evidence': '追加証拠を要請',
    'workspace.send_approval': '承認申請を送信',

    // Case Memory
    'memory.title': 'ケースメモリ',
    'memory.eyebrow': 'グラフ索引付きメモリ',
    'memory.subtitle': 'TigerGraphの完了済みケースから取得した、判断向上のための過去の調査コンテキスト。',
    'memory.search_placeholder': 'メモリケース、メモ、シグナルを検索...',
    'memory.historical_context': '過去のコンテキスト',
    'memory.match': '一致',
    'memory.shared_signals': '共通シグナル',
    'memory.historical_exposure': '過去の被害露出額',
    'memory.review_context': 'ケース詳細を確認',

    // Audit Log
    'audit.title': '監査ログ',
    'audit.eyebrow': 'コンプライアンス＆トレーサビリティ',
    'audit.subtitle': 'AIエージェント、ツール、ポリシー、管理者間の運用イベントストリーム。',
    'audit.timestamp': 'タイムスタンプ',
    'audit.case_id': 'ケースID',
    'audit.actor': '実行者',
    'audit.event': 'イベント',
    'audit.tool_action': 'ツール / アクション',
    'audit.outcome_result': '結果',

    // Benchmark
    'benchmark.title': 'ベンチマーク評価',
    'benchmark.eyebrow': 'HHGOAベンチマークハーネス（試験用20ケース）',
    'benchmark.subtitle': '公式のHHGOA試験用20ケースに対して調査エージェントを実行します。',
    'benchmark.run_all': '全20ケースを実行',
    'benchmark.evaluating': '評価を実行中...',
    'benchmark.evaluated': '評価完了',
    'benchmark.confirmed_fraud': '確定した不正',
    'benchmark.cleared_legitimate': '正常と判定',
    'benchmark.sars_filed': '提出済みSAR',
    'benchmark.total_exposure': '総露出額',
    'benchmark.processed': '100%処理完了',
    'benchmark.defensible_verdicts': '根拠ある判定',
    'benchmark.false_alarms': '誤検知の防止',
    'benchmark.fincen_standard': 'FinCEN標準準拠',

    // Settings
    'settings.title': '設定',
    'settings.eyebrow': 'システム＆パイプライン構成',
    'settings.subtitle': 'ランタイムアーキテクチャ、グラフDB接続、モデル設定、および判定閾値。',
    'settings.ops_config': '運用設定',
    'settings.auto_mode': '自律実行モード',
    'settings.dual_phase': '2フェーズエージェント探索',
    'settings.high_risk_threshold': '高リスク閾値',
    'settings.evidence_req': '証拠の十分性を要求',
    'settings.backend_conn': 'バックエンド接続',
    'settings.tigergraph_mcp': 'TigerGraph＆MCP統合',

    // Graph Explorer
    'graph.title': 'エンタープライズグラフ可視化',
    'graph.eyebrow': 'グラフエクスプローラー',
    'graph.subtitle': 'エンティティ、デバイス、取引チェーンの対話型トポロジー。',
    'graph.active_case': '対象ケース',

    // Common
    'search.placeholder': 'ケース、調査、顧客、デバイスを検索...',
    'header.engine_online': 'AIエンジン稼働中',
    'common.items': '件',
    'common.evidence': '証拠',
    'common.confidence': '信頼度',
    'common.refresh': '更新',
    'common.filter': 'フィルター',
  },

  de: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.investigations': 'Ermittlungen',
    'nav.cases': 'Fälle',
    'nav.graph': 'Graph-Explorer',
    'nav.approvals': 'Freigaben',
    'nav.memory': 'Fallspeicher',
    'nav.audit': 'Audit-Protokoll',
    'nav.benchmark': 'Benchmark',
    'nav.settings': 'Einstellungen',

    // Dashboard
    'dashboard.eyebrow': 'BETRIEBSÜBERSICHT',
    'dashboard.title': 'Sentinel — Betrugsbekämpfung',
    'dashboard.subtitle': 'Professionelle Untersuchung, Beweissicherung und empfohlene Folgemaßnahmen.',
    'dashboard.start_btn': 'Ermittlung starten',
    'dashboard.priority_investigations': 'Prioritäre Ermittlungen',
    'dashboard.view_queue': 'Warteschlange',
    'dashboard.ai_activity': 'KI-Ermittlungsaktivität',
    'dashboard.live': 'Live',
    'dashboard.review_queue': 'PRÜFWARTESCHLANGE',
    'dashboard.priority_cases': 'Prioritätsfälle',
    'dashboard.open_case': 'Fall öffnen',

    // KPI Cards
    'kpi.active_investigations': 'AKTIVE ERMITTLUNGEN',
    'kpi.awaiting_evidence': 'BEWEISE AUSSTEHEND',
    'kpi.pending_approvals': 'AUSSTEHENDE FREIGABEN',
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
    'table.nba': 'Empfohlene Aktion',
    'table.updated': 'Aktualisiert',
    'table.action': 'Aktion',

    // Status Badges
    'status.investigating': 'IN ERMITTLUNG',
    'status.evidence_required': 'BEWEISE ERFORDERLICH',
    'status.awaiting_approval': 'FREIGABE AUSSTEHEND',
    'status.escalated': 'ESKALIERT',
    'status.resolved': 'GELÖST',
    'status.action_taken': 'MASSNAHME ERGRIFFEN',
    'status.closed_no_fraud': 'KEIN BETRUG',

    // Tabs
    'tab.all': 'Alle',
    'tab.active': 'Aktiv',
    'tab.awaiting_evidence': 'Beweise ausstehend',
    'tab.awaiting_approval': 'Freigabe ausstehend',
    'tab.escalated': 'Eskaliert',
    'tab.resolved': 'Gelöst',

    // Approvals
    'approvals.title': 'Ausstehende Freigaben',
    'approvals.eyebrow': 'HUMAN-IN-THE-LOOP-KONTROLLE',
    'approvals.subtitle': 'Überprüfen Sie richtlinienbeschränkte Maßnahmen, die eine Autorisierung erfordern.',
    'approvals.approve': 'Genehmigen',
    'approvals.reject': 'Ablehnen',
    'approvals.executed': 'Ausgeführt',

    // Cases Page
    'cases.title': 'Fälle',
    'cases.eyebrow': 'FALLVERWALTUNG & DOSSIER-PORTFOLIO',
    'cases.subtitle': 'Umfassendes Repository für Betrugsdossiers, Verdachtsmeldungen (SAR) und Risikoergebnisse.',
    'cases.sar_template': 'SAR-Vorlage',
    'cases.new_case': 'Neuen Fall anlegen',
    'cases.total_dossiers': 'Dossiers Gesamt',
    'cases.active_portfolio': 'Aktives Portfolio',
    'cases.high_exposure': 'Hohes Risiko / SAR',
    'cases.critical_threshold': 'Kritische Risikoschwelle',
    'cases.prevented_exposure': 'Verhinderter Schaden',
    'cases.protected_value': 'Geschützter Wert',
    'cases.graph_resolution': 'Graph-Auflösung',
    'cases.tigergraph_grounded': 'TigerGraph-Verifiziert',
    'cases.search_placeholder': 'Nach ID, Kunde, Transaktion oder Typologie suchen...',
    'cases.copy_sar': 'SAR-Dossier kopieren',
    'cases.copied': 'Kopiert!',

    // Investigation Workspace
    'workspace.eyebrow': 'ERMITTLUNGS-ARBEITSBEREICH',
    'workspace.refresh': 'Aktualisieren',
    'workspace.risk': 'RISIKO',
    'workspace.confidence': 'KONFIDENZ',
    'workspace.evidence_sufficiency': 'BEWEISHALTIGKEIT',
    'workspace.agent_active': 'Agent aktiv',
    'workspace.events': 'Ereignisse',
    'workspace.evidence_findings': 'Beweise & Erkenntnisse',
    'workspace.items_live': 'ELEMENTE · LIVE',
    'workspace.agent_finding': 'KI-Erkenntnis',
    'workspace.pattern': 'Muster',
    'workspace.policy': 'Richtlinie',
    'workspace.agent_activity': 'Agenten-Aktivität',
    'workspace.live_stream': 'Live-Stream',
    'workspace.decision_readiness': 'ENTSCHEIDUNGSREIFE',
    'workspace.uncertainty': 'Ermittlungs-Unsicherheit',
    'workspace.known': 'Bekannt',
    'workspace.uncertain': 'Ungewiss',
    'workspace.confidence_meter': 'Konfidenz-Anzeige',
    'workspace.all_uncertainties_resolved': 'Alle Kernunsicherheiten geklärt',
    'workspace.evidence_supports': 'Beweise stützen nun eine definitive Intervention.',
    'workspace.why_not_acting': 'Warum noch nicht gehandelt wird',
    'workspace.nba_recommended': 'EMPFOHLENE NÄCHSTE BESTE MASSNAHME',
    'workspace.allowed': 'Zulässig',
    'workspace.approval_required': 'Freigabe erforderlich',
    'workspace.request_evidence': 'Neue Beweise anfordern',
    'workspace.send_approval': 'Zur Freigabe senden',

    // Case Memory
    'memory.title': 'Fallspeicher',
    'memory.eyebrow': 'GRAPH-INDEXIERTER SPEICHER',
    'memory.subtitle': 'Historischer Ermittlungskontext für fundierte Entscheidungen aus TigerGraph.',
    'memory.search_placeholder': 'Historische Fälle, Notizen durchsuchen...',
    'memory.historical_context': 'Historischer Kontext',
    'memory.match': 'Übereinstimmung',
    'memory.shared_signals': 'Gemeinsame Signale',
    'memory.historical_exposure': 'Historischer Schaden',
    'memory.review_context': 'Fallkontext prüfen',

    // Audit Log
    'audit.title': 'Audit-Protokoll',
    'audit.eyebrow': 'COMPLIANCE & NACHVOLLZIEHBARKEIT',
    'audit.subtitle': 'Operativer Ereignisstrom über KI-Agenten, Tools, Richtlinien und Supervisoren.',
    'audit.timestamp': 'Zeitstempel',
    'audit.case_id': 'Fall-ID',
    'audit.actor': 'Akteur',
    'audit.event': 'Ereignis',
    'audit.tool_action': 'Tool / Aktion',
    'audit.outcome_result': 'Ergebnis',

    // Benchmark
    'benchmark.title': 'Benchmark-Bewertung',
    'benchmark.eyebrow': 'HHGOA BENCHMARK TESTREIHE (20 PRÜFFÄLLE)',
    'benchmark.subtitle': 'Führen Sie den Ermittlungsagenten für alle 20 offiziellen Prüffälle aus.',
    'benchmark.run_all': 'Alle 20 Fälle ausführen',
    'benchmark.evaluating': 'Fälle werden evaluiert...',
    'benchmark.evaluated': 'Ausgewertet',
    'benchmark.confirmed_fraud': 'Bestätigter Betrug',
    'benchmark.cleared_legitimate': 'Als legitim eingestuft',
    'benchmark.sars_filed': 'SARs eingereicht',
    'benchmark.total_exposure': 'Gesamtexposition',
    'benchmark.processed': '100% verarbeitet',
    'benchmark.defensible_verdicts': 'Belastbare Urteile',
    'benchmark.false_alarms': 'Fehlalarme verhindert',
    'benchmark.fincen_standard': 'FinCEN-Standard',

    // Settings
    'settings.title': 'Einstellungen',
    'settings.eyebrow': 'SYSTEM- & PIPELINE-KONFIGURATION',
    'settings.subtitle': 'Laufzeitarchitektur, Graphdatenbank-Verbindungen und Schwellenwerte.',
    'settings.ops_config': 'Betriebskonfiguration',
    'settings.auto_mode': 'Autonomer Ausführungsmodus',
    'settings.dual_phase': 'Zwei-Phasen Agenten-Traversierung',
    'settings.high_risk_threshold': 'Hohe Risikoschwelle',
    'settings.evidence_req': 'Beweishaltigkeit zwingend',
    'settings.backend_conn': 'Backend-Verbindung',
    'settings.tigergraph_mcp': 'TigerGraph & MCP Integration',

    // Graph Explorer
    'graph.title': 'Unternehmens-Graph-Visualisierer',
    'graph.eyebrow': 'GRAPH-EXPLORER',
    'graph.subtitle': 'Interaktive Graphtopologie von Entitäten, Geräten und Transaktionen.',
    'graph.active_case': 'Aktiver Fall',

    // Common
    'search.placeholder': 'Fall, Ermittlung, Kunde, Gerät suchen...',
    'header.engine_online': 'KI-Engine Online',
    'common.items': 'Elemente',
    'common.evidence': 'Beweise',
    'common.confidence': 'Konfidenz',
    'common.refresh': 'Aktualisieren',
    'common.filter': 'Filtern',
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
    'nav.benchmark': 'Evaluación Comparativa',
    'nav.settings': 'Configuración',

    // Dashboard
    'dashboard.eyebrow': 'RESUMEN DE OPERACIONES',
    'dashboard.title': 'Sentinel — Operaciones Antifraude',
    'dashboard.subtitle': 'Investigación profesional, evidencia y mejor acción siguiente.',
    'dashboard.start_btn': 'Iniciar investigación',
    'dashboard.priority_investigations': 'Investigaciones prioritarias',
    'dashboard.view_queue': 'Ver cola',
    'dashboard.ai_activity': 'Actividad de investigación IA',
    'dashboard.live': 'En vivo',
    'dashboard.review_queue': 'COLA DE REVISIÓN',
    'dashboard.priority_cases': 'Casos prioritarios',
    'dashboard.open_case': 'Abrir caso',

    // KPI Cards
    'kpi.active_investigations': 'INVESTIGACIONES ACTIVAS',
    'kpi.awaiting_evidence': 'EVIDENCIA PENDIENTE',
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
    'table.nba': 'Mejor Acción',
    'table.updated': 'Actualizado',
    'table.action': 'Acción',

    // Status Badges
    'status.investigating': 'INVESTIGANDO',
    'status.evidence_required': 'EVIDENCIA REQUERIDA',
    'status.awaiting_approval': 'APROBACIÓN PENDIENTE',
    'status.escalated': 'ESCALADO',
    'status.resolved': 'RESUELTO',
    'status.action_taken': 'ACCIÓN TOMADA',
    'status.closed_no_fraud': 'SIN FRAUDE',

    // Tabs
    'tab.all': 'Todos',
    'tab.active': 'Activo',
    'tab.awaiting_evidence': 'Evidencia pendiente',
    'tab.awaiting_approval': 'Aprobación pendiente',
    'tab.escalated': 'Escalado',
    'tab.resolved': 'Resuelto',

    // Approvals
    'approvals.title': 'Aprobaciones Pendientes',
    'approvals.eyebrow': 'CONTROL HUMANO EN EL BUCLE',
    'approvals.subtitle': 'Revisar acciones restringidas por políticas que requieren autorización de un supervisor.',
    'approvals.approve': 'Aprobar',
    'approvals.reject': 'Rechazar',
    'approvals.executed': 'Ejecutado',

    // Cases Page
    'cases.title': 'Casos',
    'cases.eyebrow': 'GESTIÓN DE CASOS Y DOSSIERS',
    'cases.subtitle': 'Repositorio integral de expedientes de fraude, reportes SAR y resultados de riesgo.',
    'cases.sar_template': 'Plantilla SAR',
    'cases.new_case': 'Nuevo caso',
    'cases.total_dossiers': 'Total de Expedientes',
    'cases.active_portfolio': 'Cartera Activa',
    'cases.high_exposure': 'Alto Riesgo / SAR',
    'cases.critical_threshold': 'Umbral Crítico',
    'cases.prevented_exposure': 'Pérdida Prevenida',
    'cases.protected_value': 'Valor Protegido',
    'cases.graph_resolution': 'Resolución de Grafos',
    'cases.tigergraph_grounded': 'Basado en TigerGraph',
    'cases.search_placeholder': 'Buscar casos por ID, cliente, transacción o tipología...',
    'cases.copy_sar': 'Copiar Dossier SAR',
    'cases.copied': '¡Copiado!',

    // Investigation Workspace
    'workspace.eyebrow': 'ESPACIO DE INVESTIGACIÓN',
    'workspace.refresh': 'Actualizar',
    'workspace.risk': 'RIESGO',
    'workspace.confidence': 'CONFIANZA',
    'workspace.evidence_sufficiency': 'SUFICIENCIA DE EVIDENCIA',
    'workspace.agent_active': 'Agente activo',
    'workspace.events': 'eventos',
    'workspace.evidence_findings': 'Evidencia y hallazgos',
    'workspace.items_live': 'ELEMENTOS · EN VIVO',
    'workspace.agent_finding': 'Hallazgo de la IA',
    'workspace.pattern': 'Patrón',
    'workspace.policy': 'Política',
    'workspace.agent_activity': 'Actividad del agente',
    'workspace.live_stream': 'Transmisión en vivo',
    'workspace.decision_readiness': 'PREPARACIÓN PARA DECISIÓN',
    'workspace.uncertainty': 'Incertidumbre de la investigación',
    'workspace.known': 'Conocido',
    'workspace.uncertain': 'Incierto',
    'workspace.confidence_meter': 'Medidor de confianza',
    'workspace.all_uncertainties_resolved': 'Todas las incertidumbres clave resueltas',
    'workspace.evidence_supports': 'La evidencia ahora respalda una intervención definitiva.',
    'workspace.why_not_acting': 'Por qué aún no actuamos',
    'workspace.nba_recommended': 'SIGUIENTE MEJOR ACCIÓN RECOMENDADA',
    'workspace.allowed': 'Permitido',
    'workspace.approval_required': 'Aprobación requerida',
    'workspace.request_evidence': 'Solicitar nueva evidencia',
    'workspace.send_approval': 'Enviar para aprobación',

    // Case Memory
    'memory.title': 'Memoria de Casos',
    'memory.eyebrow': 'MEMORIA INDEXADA EN GRAFOS',
    'memory.subtitle': 'Contexto histórico de investigaciones de TigerGraph para mejores decisiones.',
    'memory.search_placeholder': 'Buscar casos históricos, notas, señales...',
    'memory.historical_context': 'Contexto histórico',
    'memory.match': 'coincidencia',
    'memory.shared_signals': 'Señales compartidas',
    'memory.historical_exposure': 'Exposición histórica',
    'memory.review_context': 'Revisar contexto del caso',

    // Audit Log
    'audit.title': 'Registro de Auditoría',
    'audit.eyebrow': 'CUMPLIMIENTO Y TRAZABILIDAD',
    'audit.subtitle': 'Flujo de eventos operativos entre agentes IA, herramientas, políticas y supervisores.',
    'audit.timestamp': 'Marca de tiempo',
    'audit.case_id': 'ID de Caso',
    'audit.actor': 'Actor',
    'audit.event': 'Evento',
    'audit.tool_action': 'Herramienta / Acción',
    'audit.outcome_result': 'Resultado',

    // Benchmark
    'benchmark.title': 'Evaluación Comparativa',
    'benchmark.eyebrow': 'ARNÉS DE PRUEBA HHGOA (20 CASOS DE EXAMEN)',
    'benchmark.subtitle': 'Ejecutar el agente de investigación sobre los 20 casos de examen oficiales.',
    'benchmark.run_all': 'Ejecutar los 20 Casos',
    'benchmark.evaluating': 'Evaluando casos...',
    'benchmark.evaluated': 'Evaluados',
    'benchmark.confirmed_fraud': 'Fraude Confirmado',
    'benchmark.cleared_legitimate': 'Legítimo Verificado',
    'benchmark.sars_filed': 'SARs Registrados',
    'benchmark.total_exposure': 'Exposición Total',
    'benchmark.processed': '100% procesado',
    'benchmark.defensible_verdicts': 'Veredictos defendibles',
    'benchmark.false_alarms': 'Falsas alarmas evitadas',
    'benchmark.fincen_standard': 'Estándar FinCEN',

    // Settings
    'settings.title': 'Configuración',
    'settings.eyebrow': 'CONFIGURACIÓN DEL SISTEMA',
    'settings.subtitle': 'Arquitectura de ejecución, conexiones de base de datos de grafos y umbrales.',
    'settings.ops_config': 'Configuración de Operaciones',
    'settings.auto_mode': 'Modo de Ejecución Autónomo',
    'settings.dual_phase': 'Recorrido Agéntico en Dos Fases',
    'settings.high_risk_threshold': 'Umbral de Alto Riesgo',
    'settings.evidence_req': 'Suficiencia de Evidencia Obligatoria',
    'settings.backend_conn': 'Conexión de Backend',
    'settings.tigergraph_mcp': 'Integración con TigerGraph y MCP',

    // Graph Explorer
    'graph.title': 'Visualizador Empresarial de Grafos',
    'graph.eyebrow': 'EXPLORADOR DE GRAFOS',
    'graph.subtitle': 'Topología interactiva de entidades, dispositivos y cadenas de transacciones.',
    'graph.active_case': 'Caso Activo',

    // Common
    'search.placeholder': 'Buscar caso, investigación, cliente, dispositivo...',
    'header.engine_online': 'Motor de IA en línea',
    'common.items': 'elementos',
    'common.evidence': 'evidencias',
    'common.confidence': 'confianza',
    'common.refresh': 'Actualizar',
    'common.filter': 'Filtrar',
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

    // Dashboard
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

    // Tabs
    'tab.all': 'Tous',
    'tab.active': 'Actif',
    'tab.awaiting_evidence': 'Preuves en attente',
    'tab.awaiting_approval': 'En attente d\'approbation',
    'tab.escalated': 'Escaladé',
    'tab.resolved': 'Résolu',

    // Approvals
    'approvals.title': 'Approbations en Attente',
    'approvals.eyebrow': 'CONTRÔLE HUMAIN DANS LA BOUCLE',
    'approvals.subtitle': 'Examiner les actions contraintes par les politiques nécessitant une autorisation.',
    'approvals.approve': 'Approuver',
    'approvals.reject': 'Rejeter',
    'approvals.executed': 'Exécuté',

    // Cases Page
    'cases.title': 'Dossiers',
    'cases.eyebrow': 'GESTION DES DOSSIERS ET PORTFOLIO',
    'cases.subtitle': 'Répertoire exhaustif des dossiers de fraude, rapports SAR et résultats de risque.',
    'cases.sar_template': 'Modèle SAR',
    'cases.new_case': 'Nouveau dossier',
    'cases.total_dossiers': 'Total des Dossiers',
    'cases.active_portfolio': 'Portefeuille Actif',
    'cases.high_exposure': 'Exposition Élevée / SAR',
    'cases.critical_threshold': 'Seuil Critique de Risque',
    'cases.prevented_exposure': 'Perte Évitée',
    'cases.protected_value': 'Valeur Protégée',
    'cases.graph_resolution': 'Résolution de Graphe',
    'cases.tigergraph_grounded': 'Vérifié par TigerGraph',
    'cases.search_placeholder': 'Rechercher par ID, client, transaction ou typologie...',
    'cases.copy_sar': 'Copier le Dossier SAR',
    'cases.copied': 'Copié !',

    // Investigation Workspace
    'workspace.eyebrow': 'ESPACE D\'ENQUÊTE',
    'workspace.refresh': 'Actualiser',
    'workspace.risk': 'RISQUE',
    'workspace.confidence': 'CONFIANCE',
    'workspace.evidence_sufficiency': 'SUFFISANCE DES PREUVES',
    'workspace.agent_active': 'Agent actif',
    'workspace.events': 'événements',
    'workspace.evidence_findings': 'Preuves et conclusions',
    'workspace.items_live': 'ÉLÉMENTS · EN DIRECT',
    'workspace.agent_finding': 'Conclusion de l\'IA',
    'workspace.pattern': 'Schéma',
    'workspace.policy': 'Politique',
    'workspace.agent_activity': 'Activité de l\'agent',
    'workspace.live_stream': 'Flux en direct',
    'workspace.decision_readiness': 'ÉTAT DE PRÉPARATION',
    'workspace.uncertainty': 'Incertitude de l\'enquête',
    'workspace.known': 'Connu',
    'workspace.uncertain': 'Incertain',
    'workspace.confidence_meter': 'Indicateur de confiance',
    'workspace.all_uncertainties_resolved': 'Toutes les incertitudes clés résolues',
    'workspace.evidence_supports': 'Les preuves soutiennent désormais une intervention définitive.',
    'workspace.why_not_acting': 'Pourquoi nous n\'agissons pas encore',
    'workspace.nba_recommended': 'MEILLEURE ACTION SUIVANTE RECOMMANDÉE',
    'workspace.allowed': 'Autorisé',
    'workspace.approval_required': 'Approbation requise',
    'workspace.request_evidence': 'Demander de nouvelles preuves',
    'workspace.send_approval': 'Envoyer pour approbation',

    // Case Memory
    'memory.title': 'Mémoire des Dossiers',
    'memory.eyebrow': 'MÉMOIRE INDEXÉE SUR GRAPHE',
    'memory.subtitle': 'Contexte historique d\'enquête pour de meilleures décisions, extrait de TigerGraph.',
    'memory.search_placeholder': 'Rechercher des dossiers, notes, signaux...',
    'memory.historical_context': 'Contexte historique',
    'memory.match': 'correspondance',
    'memory.shared_signals': 'Signaux partagés',
    'memory.historical_exposure': 'Exposition historique',
    'memory.review_context': 'Examiner le contexte',

    // Audit Log
    'audit.title': 'Journal d\'Audit',
    'audit.eyebrow': 'CONFORMITÉ ET TRAÇABILITÉ',
    'audit.subtitle': 'Flux d\'événements opérationnels entre agents IA, outils, politiques et superviseurs.',
    'audit.timestamp': 'Horodatage',
    'audit.case_id': 'ID Dossier',
    'audit.actor': 'Acteur',
    'audit.event': 'Événement',
    'audit.tool_action': 'Outil / Action',
    'audit.outcome_result': 'Résultat',

    // Benchmark
    'benchmark.title': 'Évaluation du Benchmark',
    'benchmark.eyebrow': 'BANCS D\'ESSAI HHGOA (20 CAS D\'EXAMEN)',
    'benchmark.subtitle': 'Exécuter l\'agent d\'enquête sur les 20 cas d\'examen officiels.',
    'benchmark.run_all': 'Exécuter les 20 cas',
    'benchmark.evaluating': 'Évaluation des cas...',
    'benchmark.evaluated': 'Évalués',
    'benchmark.confirmed_fraud': 'Fraude Confirmée',
    'benchmark.cleared_legitimate': 'Légitime Validé',
    'benchmark.sars_filed': 'SARs Déposés',
    'benchmark.total_exposure': 'Exposition Totale',
    'benchmark.processed': '100% traités',
    'benchmark.defensible_verdicts': 'Verdict défendable',
    'benchmark.false_alarms': 'Fausses alertes évitées',
    'benchmark.fincen_standard': 'Norme FinCEN',

    // Settings
    'settings.title': 'Paramètres',
    'settings.eyebrow': 'CONFIGURATION SYSTÈME & PIPELINE',
    'settings.subtitle': 'Architecture d\'exécution, connexions de base de données de graphes et seuils.',
    'settings.ops_config': 'Configuration des Opérations',
    'settings.auto_mode': 'Mode d\'Exécution Autonome',
    'settings.dual_phase': 'Parcours Agentique à Double Phase',
    'settings.high_risk_threshold': 'Seuil de Risque Élevé',
    'settings.evidence_req': 'Suffisance des Preuves Requise',
    'settings.backend_conn': 'Connexion Backend',
    'settings.tigergraph_mcp': 'Intégration TigerGraph & MCP',

    // Graph Explorer
    'graph.title': 'Visualiseur de Graphe d\'Entreprise',
    'graph.eyebrow': 'EXPLORATEUR DE GRAPHES',
    'graph.subtitle': 'Topologie interactive des entités, appareils et flux de transactions.',
    'graph.active_case': 'Dossier Actif',

    // Common
    'search.placeholder': 'Rechercher dossier, enquête, client, appareil...',
    'header.engine_online': 'Moteur IA en ligne',
    'common.items': 'éléments',
    'common.evidence': 'preuves',
    'common.confidence': 'confiance',
    'common.refresh': 'Actualiser',
    'common.filter': 'Filtrer',
  }
}

// Normalized phrase-to-key index for instant O(1) translation of exact English phrases
const PHRASE_INDEX: Record<string, string> = {
  // Navigation
  'dashboard': 'nav.dashboard',
  'investigations': 'nav.investigations',
  'cases': 'nav.cases',
  'graph explorer': 'nav.graph',
  'approvals': 'nav.approvals',
  'case memory': 'nav.memory',
  'audit log': 'nav.audit',
  'benchmark': 'nav.benchmark',
  'settings': 'nav.settings',

  // Dashboard Headings & Buttons
  'operations overview': 'dashboard.eyebrow',
  'sentinel — fraud operations': 'dashboard.title',
  'professional investigation, evidence and next-best-action.': 'dashboard.subtitle',
  'start investigation': 'dashboard.start_btn',
  'priority investigations': 'dashboard.priority_investigations',
  'view queue': 'dashboard.view_queue',
  'ai investigation activity': 'dashboard.ai_activity',
  'live': 'dashboard.live',
  'review queue': 'dashboard.review_queue',
  'priority cases': 'dashboard.priority_cases',
  'open case': 'dashboard.open_case',

  // KPIs
  'active investigations': 'kpi.active_investigations',
  'awaiting evidence': 'kpi.awaiting_evidence',
  'pending approvals': 'kpi.pending_approvals',
  'escalations': 'kpi.escalations',
  'resolved today': 'kpi.resolved_today',

  // Table
  'case': 'table.case',
  'trigger': 'table.trigger',
  'customer': 'table.customer',
  'amount': 'table.amount',
  'risk': 'table.risk',
  'confidence': 'table.confidence',
  'evidence': 'table.evidence',
  'status': 'table.status',
  'nba': 'table.nba',
  'updated': 'table.updated',
  'action': 'table.action',

  // Badges / Statuses
  'investigating': 'status.investigating',
  'evidence required': 'status.evidence_required',
  'awaiting approval': 'status.awaiting_approval',
  'escalated': 'status.escalated',
  'resolved': 'status.resolved',
  'action taken': 'status.action_taken',
  'closed no fraud': 'status.closed_no_fraud',

  // Tabs
  'all': 'tab.all',
  'active': 'tab.active',

  // Approvals
  'approve': 'approvals.approve',
  'reject': 'approvals.reject',
  'executed': 'approvals.executed',

  // Cases Page
  'case management & dossier portfolio': 'cases.eyebrow',
  'comprehensive repository of fraud dossiers, suspicious activity reports (sar), and enterprise risk outcomes.': 'cases.subtitle',
  'sar template': 'cases.sar_template',
  'new case filing': 'cases.new_case',
  'total dossiers': 'cases.total_dossiers',
  'active enterprise portfolio': 'cases.active_portfolio',
  'high exposure / sar': 'cases.high_exposure',
  'critical risk threshold': 'cases.critical_threshold',
  'prevented exposure': 'cases.prevented_exposure',
  'protected value': 'cases.protected_value',
  'graph resolution': 'cases.graph_resolution',
  'tigergraph grounded': 'cases.tigergraph_grounded',
  'search cases by id, customer, transaction or typology...': 'cases.search_placeholder',
  'copy sar dossier': 'cases.copy_sar',
  'copied!': 'cases.copied',

  // Investigation Workspace
  'investigation workspace': 'workspace.eyebrow',
  'evidence & findings': 'workspace.evidence_findings',
  'agent active': 'workspace.agent_active',
  'agent finding': 'workspace.agent_finding',
  'pattern': 'workspace.pattern',
  'policy': 'workspace.policy',
  'agent activity': 'workspace.agent_activity',
  'live stream': 'workspace.live_stream',
  'decision readiness': 'workspace.decision_readiness',
  'investigation uncertainty': 'workspace.uncertainty',
  'known': 'workspace.known',
  'uncertain': 'workspace.uncertain',
  'confidence meter': 'workspace.confidence_meter',
  'all key uncertainties resolved': 'workspace.all_uncertainties_resolved',
  'evidence now supports definitive intervention.': 'workspace.evidence_supports',
  'why we are not acting yet': 'workspace.why_not_acting',
  'recommended next-best-action': 'workspace.nba_recommended',
  'allowed': 'workspace.allowed',
  'approval required': 'workspace.approval_required',
  'request new evidence': 'workspace.request_evidence',
  'send for approval': 'workspace.send_approval',

  // Memory
  'graph-indexed memory': 'memory.eyebrow',
  'historical investigation context for better decisions, retrieved from tigergraph closed cases.': 'memory.subtitle',
  'historical context': 'memory.historical_context',
  'shared signals': 'memory.shared_signals',
  'historical exposure': 'memory.historical_exposure',
  'review case context': 'memory.review_context',

  // Audit
  'compliance & traceability': 'audit.eyebrow',
  'operational event stream across ai agents, tools, policies and human supervisors.': 'audit.subtitle',
  'timestamp': 'audit.timestamp',
  'case id': 'audit.case_id',
  'actor': 'audit.actor',
  'event': 'audit.event',
  'tool / action': 'audit.tool_action',
  'outcome / result': 'audit.outcome_result',

  // Benchmark
  'hhgoa benchmark harness (20 exam cases)': 'benchmark.eyebrow',
  'benchmark evaluation': 'benchmark.title',
  'execute the investigation agent against the 20 official hhgoa exam cases.': 'benchmark.subtitle',
  'run all 20 cases': 'benchmark.run_all',
  'evaluating cases...': 'benchmark.evaluating',
  'evaluated': 'benchmark.evaluated',
  'confirmed fraud': 'benchmark.confirmed_fraud',
  'cleared legitimate': 'benchmark.cleared_legitimate',
  'sars filed': 'benchmark.sars_filed',
  'total exposure': 'benchmark.total_exposure',

  // Settings
  'system & pipeline configuration': 'settings.eyebrow',
  'runtime architecture, graph database connections, model configuration and thresholds.': 'settings.subtitle',
  'operations configuration': 'settings.ops_config',
  'autonomous execution mode': 'settings.auto_mode',
  'dual-phase agentic traversal': 'settings.dual_phase',
  'high risk threshold': 'settings.high_risk_threshold',
  'evidence sufficiency required': 'settings.evidence_req',
  'backend connection': 'settings.backend_conn',
  'tigergraph & mcp integration': 'settings.tigergraph_mcp',

  // Graph
  'enterprise graph visualizer': 'graph.title',
  'interactive graph topology of entities, devices, and transaction chains.': 'graph.subtitle',
  'active case': 'graph.active_case',

  // Common
  'search case, investigation, customer, device...': 'search.placeholder',
  'ai engine online': 'header.engine_online',
  'items': 'common.items',
  'refresh': 'common.refresh',
  'filter': 'common.filter',
}

/**
 * Instant Zero-Latency Translation Function
 * Translates either an explicit key ('nav.dashboard') or any English phrase ('Dashboard')
 */
export function t(keyOrPhrase: string, lang: string = 'en'): string {
  if (!keyOrPhrase || lang === 'en') return keyOrPhrase

  const langDict = TRANSLATIONS[lang]
  if (!langDict) return keyOrPhrase

  // 1. Direct key match (e.g. 'nav.dashboard')
  if (langDict[keyOrPhrase]) return langDict[keyOrPhrase]

  // 2. Exact phrase match via index (e.g. 'Dashboard' -> 'nav.dashboard')
  const normalized = keyOrPhrase.toLowerCase().trim()
  const indexedKey = PHRASE_INDEX[normalized]
  if (indexedKey && langDict[indexedKey]) {
    return langDict[indexedKey]
  }

  // 3. Fallback: check all values in TRANSLATIONS.en
  const enDict = TRANSLATIONS.en
  for (const [k, v] of Object.entries(enDict)) {
    if (v.toLowerCase() === normalized && langDict[k]) {
      return langDict[k]
    }
  }

  return keyOrPhrase
}

// React Context for Zero-Latency Synchronous Language Switching
interface TranslationContextValue {
  lang: string
  setLang: (lang: string) => void
  t: (keyOrPhrase: string) => string
}

export const TranslationContext = createContext<TranslationContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (str) => str
})

export function useTranslation() {
  return useContext(TranslationContext)
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
        } else if (attempts >= 10) {
          clearInterval(timer)
        }
      }, 150)
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

  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script')
    script.id = 'google-translate-script'
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)
  }
}
