import {
  CaseListItem,
  CaseDetail,
  CaseMetrics,
  EvidenceItem,
  GraphData,
  RecommendationSnapshot,
  ApprovalItem,
  MemoryCaseItem,
  AuditLogItem,
  BenchmarkCaseItem,
  BenchmarkSummary
} from '@/types/sentinel'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      cache: 'no-store'
    })
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} on ${endpoint}`)
    }
    return (await res.json()) as T
  } catch (err) {
    console.warn(`[API Client] Error fetching ${endpoint}:`, err)
    throw err
  }
}

export const api = {
  // Cases & Dashboard
  async getCases(status?: string, search?: string): Promise<CaseListItem[]> {
    const params = new URLSearchParams()
    if (status && status !== 'All') params.append('status', status)
    if (search) params.append('search', search)
    const qs = params.toString() ? `?${params.toString()}` : ''
    return fetchJson<CaseListItem[]>(`/api/cases${qs}`)
  },

  async getMetrics(): Promise<CaseMetrics> {
    return fetchJson<CaseMetrics>('/api/cases/metrics')
  },

  async getCaseDetail(caseId: string): Promise<CaseDetail> {
    return fetchJson<CaseDetail>(`/api/cases/${caseId}`)
  },

  // Graph
  async getCaseGraph(caseId: string): Promise<GraphData> {
    return fetchJson<GraphData>(`/api/graph/case/${caseId}`)
  },

  // Evidence
  async getEvidence(caseId: string): Promise<EvidenceItem[]> {
    return fetchJson<EvidenceItem[]>(`/api/cases/${caseId}/evidence`)
  },

  async requestEvidence(caseId: string, actionType: string = 'customer_validation'): Promise<any> {
    return fetchJson<any>(`/api/cases/${caseId}/evidence/request`, {
      method: 'POST',
      body: JSON.stringify({ action_type: actionType })
    })
  },

  // Recommendations
  async getRecommendations(caseId: string): Promise<{ snapshot: RecommendationSnapshot; reassessed: boolean }> {
    return fetchJson<{ snapshot: RecommendationSnapshot; reassessed: boolean }>(`/api/cases/${caseId}/recommendations`)
  },

  // Approvals
  async getApprovals(status?: string): Promise<ApprovalItem[]> {
    const qs = status ? `?status=${status}` : ''
    return fetchJson<ApprovalItem[]>(`/api/approvals${qs}`)
  },

  async createApproval(payload: { case_id: string; action: string; route: string; exposure_usd: number; risk: number; confidence: number; notes?: string }): Promise<ApprovalItem> {
    return fetchJson<ApprovalItem>('/api/approvals', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  },

  async approveAction(approvalId: string): Promise<ApprovalItem> {
    return fetchJson<ApprovalItem>(`/api/approvals/${approvalId}/approve`, {
      method: 'POST'
    })
  },

  async rejectAction(approvalId: string): Promise<ApprovalItem> {
    return fetchJson<ApprovalItem>(`/api/approvals/${approvalId}/reject`, {
      method: 'POST'
    })
  },

  // Memory & Audit
  async getSimilarMemory(caseId: string): Promise<MemoryCaseItem[]> {
    return fetchJson<MemoryCaseItem[]>(`/api/memory/similar/${caseId}`)
  },

  async getAuditEvents(caseId?: string): Promise<AuditLogItem[]> {
    const endpoint = caseId ? `/api/cases/${caseId}/audit` : '/api/audit'
    return fetchJson<AuditLogItem[]>(endpoint)
  },

  // Benchmark
  async getBenchmarkCases(): Promise<BenchmarkCaseItem[]> {
    return fetchJson<BenchmarkCaseItem[]>('/api/benchmark/cases')
  },

  async runBenchmarkCase(caseId: string): Promise<any> {
    return fetchJson<any>(`/api/benchmark/run/${caseId}`, {
      method: 'POST'
    })
  },

  async runAllBenchmark(): Promise<BenchmarkSummary> {
    return fetchJson<BenchmarkSummary>('/api/benchmark/run-all', {
      method: 'POST'
    })
  },

  async getBenchmarkStatus(): Promise<BenchmarkSummary> {
    return fetchJson<BenchmarkSummary>('/api/benchmark/status')
  },

  async getBenchmarkOutput(caseId: string): Promise<any> {
    return fetchJson<any>(`/api/benchmark/output/${caseId}`)
  },

  // Health
  async getHealth(): Promise<any> {
    return fetchJson<any>('/health')
  }
}
