export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH'
export type EvidenceSufficiency = 'SUFFICIENT' | 'INSUFFICIENT' | 'AMBIGUOUS'
export type CaseStatus = 
  | 'TRIGGERED' 
  | 'INVESTIGATING' 
  | 'EVIDENCE_REQUIRED' 
  | 'AWAITING_APPROVAL' 
  | 'ACTION_TAKEN' 
  | 'ESCALATED' 
  | 'RESOLVED' 
  | 'CLOSED_NO_FRAUD'

export type ApprovalRoute = 'auto' | 'L1' | 'L2'
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface CaseListItem {
  id: string
  trigger: string
  customer: string
  transaction: string
  amount: number
  risk: number
  confidence: number
  status: string
  nba: string
  evidence: number
  updated: string
  card_id?: string
  opened_at?: string
}

export interface CaseMetrics {
  active_investigations: number
  awaiting_evidence: number
  pending_approvals: number
  escalations: number
  resolved_today: number
  total_cases: number
  active_change?: string
  awaiting_change?: string
  pending_change?: string
  escalations_change?: string
  resolved_change?: string
}

export interface EvidenceItem {
  id: string
  type: string
  title: string
  description: string
  source: string
  strength: 'Strong' | 'Moderate' | 'Weak'
  tone: 'support' | 'contradict' | 'context'
  entities: string
  pattern?: string
  time?: string
  provenance?: {
    tool: string
    query: string
    retrieved_at: string
    entity_ids: string[]
  }
}

export interface GraphNode {
  id: string
  label: string
  sub: string
  kind: 'customer' | 'device' | 'transaction' | 'account' | 'merchant' | 'case' | 'card' | 'region'
  x: number
  y: number
  meta?: Record<string, any>
}

export interface GraphData {
  nodes: GraphNode[]
  edges: [string, string][]
  case_id: string
  entity_count: number
  relationship_count: number
}

export interface NextBestAction {
  action: string
  route: ApprovalRoute
  reason: string
  policy_reference?: string
  required_role?: string
}

export interface RecommendationSnapshot {
  initial: NextBestAction[]
  final: NextBestAction[]
  what_changed: string
  current_recommended_action: string
  approval_required: boolean
  required_role: string
  policy_rule: string
  reasons?: string[]
}

export interface UncertaintyAssessment {
  risk_score: number
  risk_level: RiskLevel
  confidence: number
  evidence_sufficiency: EvidenceSufficiency
  known_signals: string[]
  uncertain_signals: string[]
  primary_uncertainty: string
  why_not_acting: string
}

export interface CaseDetail {
  id: string
  opened_at: string
  trigger_type: string
  trigger_text: string
  flagged_txn_id: string
  card_id: string
  customer_id: string
  amount: number
  status: CaseStatus
  verdict: 'fraud' | 'legitimate' | 'uncertain'
  fraud_probability: number
  pattern: string
  pattern_description?: string
  affected_txn_ids: string[]
  connected_card_ids: string[]
  connected_device_profiles: string[]
  exposure_usd: number
  uncertainty: UncertaintyAssessment
  recommendation: RecommendationSnapshot
  evidence_count: number
  finding_headline: string
  finding_body: string
  finding_pattern: string
  finding_policy: string
  approval_status: ApprovalStatus
  timeline: [string, string, 'completed' | 'active' | 'warning' | 'waiting' | 'action'][]
}

export interface ApprovalItem {
  id: string
  case_id: string
  action: string
  requested_by: string
  created_at: string
  route: ApprovalRoute
  status: ApprovalStatus
  risk: number
  confidence: number
  exposure_usd: number
  policy_rule: string
  notes?: string
}

export interface MemoryCaseItem {
  id: string
  similarity: number
  outcome: string
  pattern: string
  shared: string[]
  analyst_notes: string
  exposure_usd: number
}

export interface AuditLogItem {
  timestamp: string
  case_id: string
  actor: string
  event: string
  tool_action: string
  result: string
  metadata?: Record<string, any>
}

export interface BenchmarkCaseItem {
  case_id: string
  opened_at: string
  trigger_type: string
  flagged_txn_id: string
  card_id: string
  customer_id: string
  amount: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  verdict?: string
  fraud_probability?: number
  pattern?: string
  exposure_usd?: number
  initial_nba?: string
  final_nba?: string
  sar_filed?: boolean
  latency_s?: number
  tool_calls?: number
}

export interface BenchmarkSummary {
  total: number
  completed: number
  fraud_count: number
  legitimate_count: number
  uncertain_count: number
  sar_count: number
  total_exposure_usd: number
}
