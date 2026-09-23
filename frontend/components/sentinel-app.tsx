'use client'

import { useState, useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import * as Icons from 'lucide-react'
import { api } from '@/lib/api-client'
import {
  CaseListItem,
  CaseDetail,
  CaseMetrics,
  EvidenceItem,
  GraphData,
  GraphNode,
  ApprovalItem,
  MemoryCaseItem,
  AuditLogItem,
  BenchmarkCaseItem,
  BenchmarkSummary
} from '@/types/sentinel'
import { Button } from '@/components/ui/button'

const icon = (name: string, props: any = {}) => {
  const I = (Icons as any)[name] || Icons.Circle
  return <I {...props} />
}

function toTitleCase(str?: string): string {
  if (!str) return ''
  return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function Badge({ children, tone = 'slate' }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  )
}

function Sidebar({ collapsed, setCollapsed, metrics }: { collapsed: boolean; setCollapsed: (v: boolean) => void; metrics?: CaseMetrics | null }) {
  const path = usePathname()
  const router = useRouter()

  const navItems = [
    ['Dashboard', 'LayoutDashboard', '/dashboard'],
    ['Investigations', 'Radar', '/investigations'],
    ['Cases', 'BriefcaseBusiness', '/cases'],
    ['Graph Explorer', 'Share2', '/graph'],
    ['Approvals', 'BadgeCheck', '/approvals'],
    ['Case Memory', 'Library', '/memory'],
    ['Audit Log', 'ScrollText', '/audit'],
    ['Benchmark', 'ChartNoAxesCombined', '/benchmark'],
    ['Settings', 'Settings2', '/settings'],
  ]

  const activeCount = metrics ? String(metrics.active_investigations) : '24'
  const approvalCount = metrics ? String(metrics.pending_approvals) : '3'

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="brand">
        <div className="brand-mark">S</div>
        {!collapsed && (
          <div>
            <strong>sentinel<span>ai</span></strong>
            <small>FRAUD OPERATIONS</small>
          </div>
        )}
      </div>
      <button className="collapse" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
        {icon(collapsed ? 'PanelLeftOpen' : 'PanelLeftClose')}
      </button>
      <nav>
        {navItems.map(([label, ico, href]) => (
          <button
            key={href}
            className={`nav-item ${path === href || (href === '/dashboard' && path === '/') ? 'active' : ''}`}
            onClick={() => router.push(href)}
            title={collapsed ? label : undefined}
          >
            {icon(ico)} {!collapsed && <span>{label}</span>}
            {!collapsed && ['Investigations', 'Approvals'].includes(label) && (
              <em>{label === 'Investigations' ? activeCount : approvalCount}</em>
            )}
          </button>
        ))}
      </nav>
      {!collapsed && (
        <div className="sidebar-foot">
          <div className="demo-dot" />
          <div>
            <strong>Full Stack Mode</strong>
            <small>FastAPI &amp; Graph Active</small>
          </div>
        </div>
      )}
    </aside>
  )
}

function Header({ onSearch, systemStatus }: { onSearch: (v: string) => void; systemStatus: string }) {
  return (
    <header className="topbar">
      <div className="mobile-brand">
        <div className="brand-mark">S</div>
        <strong>sentinel<span>ai</span></strong>
      </div>
      <div className="global-search">
        {icon('Search')}
        <input placeholder="Search case, transaction, customer, device..." onChange={(e) => onSearch(e.target.value)} />
        <kbd>⌘ K</kbd>
      </div>
      <div className="top-actions">
        <div className="system">
          <span className="pulse" />
          <div>
            <strong>AI Engine Online</strong>
            <small>{systemStatus}</small>
          </div>
        </div>
        <button className="icon-button" aria-label="Notifications">
          {icon('Bell')}
          <i />
        </button>
        <div className="avatar">AK</div>
        <div className="analyst">
          <strong>Alex Kim</strong>
          <small>Senior Analyst</small>
        </div>
      </div>
    </header>
  )
}

function MetricCards({ metrics }: { metrics: CaseMetrics | null }) {
  const stats = [
    { label: 'Active investigations', value: metrics ? String(metrics.active_investigations) : '24', change: '+8.4%', icon: 'Radar' },
    { label: 'Awaiting evidence', value: metrics ? String(metrics.awaiting_evidence).padStart(2, '0') : '08', change: '3 urgent', icon: 'FileSearch' },
    { label: 'Pending approvals', value: metrics ? String(metrics.pending_approvals).padStart(2, '0') : '03', change: 'Supervisor', icon: 'BadgeCheck' },
    { label: 'Escalations', value: metrics ? String(metrics.escalations).padStart(2, '0') : '06', change: 'This week', icon: 'ArrowUpRight' },
    { label: 'Resolved today', value: metrics ? String(metrics.resolved_today) : '17', change: '+12.1%', icon: 'CircleCheck' }
  ]

  return (
    <div className="metric-grid">
      {stats.map((s) => (
        <div className="metric-card" key={s.label}>
          <div className="metric-icon">{icon(s.icon)}</div>
          <div>
            <small>{s.label}</small>
            <strong>{s.value}</strong>
            <span>{s.change}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function InvestigationTable({ cases, compact = false }: { cases: CaseListItem[]; compact?: boolean }) {
  const router = useRouter()
  const displayCases = compact ? cases.slice(0, 3) : cases.slice(0, 10)

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Case</th>
            <th>Trigger</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Risk</th>
            <th>Confidence</th>
            <th>Evidence</th>
            <th>Status</th>
            <th>NBA</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {displayCases.map((row) => (
            <tr key={row.id} onClick={() => router.push('/investigations/' + row.id)}>
              <td>
                <strong>{row.id}</strong>
                <small>{row.transaction}</small>
              </td>
              <td>{row.trigger}</td>
              <td>{row.customer}</td>
              <td>${row.amount.toFixed(2)}</td>
              <td>
                <span className={`risk risk-${row.risk > 85 ? 'high' : row.risk > 70 ? 'med' : 'low'}`}>
                  {row.risk}
                </span>
              </td>
              <td>
                <div className="confidence">
                  <span style={{ width: `${row.confidence}%` }} />
                  {row.confidence}%
                </div>
              </td>
              <td>{row.evidence} items</td>
              <td>
                <Badge
                  tone={
                    row.status === 'Awaiting Approval'
                      ? 'amber'
                      : row.status === 'Resolved' || row.status === 'Closed No Fraud'
                      ? 'green'
                      : 'blue'
                  }
                >
                  {row.status}
                </Badge>
              </td>
              <td>{row.nba}</td>
              <td className="muted">{row.updated}</td>
            </tr>
          ))}
          {displayCases.length === 0 && (
            <tr>
              <td colSpan={10} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                No investigations found matching your filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function Dashboard({ cases, metrics, auditEvents }: { cases: CaseListItem[]; metrics: CaseMetrics | null; auditEvents: AuditLogItem[] }) {
  const router = useRouter()

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">OPERATIONS OVERVIEW · WED 23 SEP 2026</div>
          <h1>Fraud Operations</h1>
          <p>AI-assisted investigation, evidence and next-best-action.</p>
        </div>
        <Button onClick={() => router.push('/investigations/CASE-10293')}>
          <Icons.Plus data-icon="inline-start" /> Start investigation
        </Button>
      </div>

      <MetricCards metrics={metrics} />

      <div className="content-grid dashboard-grid">
        <section className="panel span-2">
          <SectionTitle
            title="Priority investigations"
            action={
              <Button variant="ghost" size="sm" onClick={() => router.push('/investigations')}>
                View queue {icon('ArrowUpRight')}
              </Button>
            }
          />
          <InvestigationTable cases={cases} compact />
        </section>

        <section className="panel activity">
          <SectionTitle
            title="AI investigation activity"
            action={<span className="live"><i /> Live</span>}
          />
          <div className="activity-list">
            {auditEvents.slice(0, 6).map((x, i) => (
              <div className={`activity-row ${x.result === 'Warning' || x.event === 'Evidence deemed insufficient' ? 'warning' : ''}`} key={x.timestamp + i}>
                <span>
                  {i < 4 ? icon('Check') : icon('ArrowRight')}
                </span>
                <div>
                  <strong>{x.tool_action}</strong>
                  <small>{x.case_id} · {x.result} · {x.timestamp}</small>
                </div>
              </div>
            ))}
            {auditEvents.length === 0 && (
              <div style={{ padding: '16px', color: 'var(--muted)', fontSize: '11px' }}>
                Loading live agent activities...
              </div>
            )}
          </div>
        </section>
      </div>

      <section style={{ marginTop: '20px' }}>
        <SectionTitle eyebrow="REVIEW QUEUE" title="Priority cases" />
        <div className="case-cards">
          {cases.slice(0, 3).map((c) => (
            <div className="case-card" key={c.id}>
              <div className="case-top">
                <Badge tone={c.risk > 85 ? 'red' : 'amber'}>Risk {c.risk}</Badge>
                <span>{c.updated}</span>
              </div>
              <strong>{c.id}</strong>
              <p>{c.trigger}</p>
              <div className="case-meta">
                <span>{icon('FileText')} {c.evidence} evidence</span>
                <span>{icon('Target')} {c.confidence}% confidence</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push('/investigations/' + c.id)}>
                Open case {icon('ArrowUpRight')}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function Queue({ cases }: { cases: CaseListItem[] }) {
  const router = useRouter()
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('All')
  const tabs = ['All', 'Active', 'Awaiting Evidence', 'Awaiting Approval', 'Escalated', 'Resolved']

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      if (tab !== 'All') {
        const s = c.status.toLowerCase()
        if (tab === 'Active' && !['investigating', 'evidence required'].includes(s)) return false
        if (tab === 'Awaiting Evidence' && s !== 'evidence required') return false
        if (tab === 'Awaiting Approval' && s !== 'awaiting approval') return false
        if (tab === 'Escalated' && s !== 'escalated') return false
        if (tab === 'Resolved' && !['resolved', 'closed no fraud', 'action taken'].includes(s)) return false
      }
      if (riskFilter === 'High' && c.risk < 80) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          c.id.toLowerCase().includes(q) ||
          c.customer.toLowerCase().includes(q) ||
          c.transaction.toLowerCase().includes(q) ||
          c.trigger.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [cases, tab, search, riskFilter])

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">INVESTIGATION QUEUE</div>
          <h1>Investigations</h1>
          <p>Monitor agent-led investigations and decision readiness across all benchmark cases.</p>
        </div>
        <Button onClick={() => router.push('/investigations/CASE-10293')}>
          <Icons.Plus data-icon="inline-start" /> Start investigation
        </Button>
      </div>

      <div className="toolbar">
        <div className="field-search">
          {icon('Search')}
          <input
            placeholder="Search investigations by ID, customer, transaction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
          <option value="All">All risk levels</option>
          <option value="High">High risk (&gt; 80)</option>
        </select>
        <Button variant="outline">
          {icon('SlidersHorizontal')} Filters
        </Button>
      </div>

      <div className="tabs">
        {tabs.map((t) => (
          <button className={tab === t ? 'selected' : ''} key={t} onClick={() => setTab(t)}>
            {t}
            {t === 'Awaiting Approval' && <b>3</b>}
          </button>
        ))}
      </div>

      <section className="panel">
        <InvestigationTable cases={filtered} />
      </section>
    </>
  )
}

function Graph({
  graphData,
  selected,
  setSelected,
}: {
  graphData: GraphData | null
  selected: string | null
  setSelected: (s: string | null) => void
}) {
  const [filter, setFilter] = useState('All')

  const nodes: GraphNode[] = graphData?.nodes || []
  const edges: [string, string][] = graphData?.edges || []

  const filteredNodes = useMemo(() => {
    if (filter === 'Customers') return nodes.filter((n) => n.kind === 'customer')
    if (filter === 'Devices') return nodes.filter((n) => n.kind === 'device')
    return nodes
  }, [nodes, filter])

  return (
    <div className="graph-box">
      <div className="graph-toolbar">
        <div>
          <strong>Relationship graph</strong>
          <small>{nodes.length} entities · {edges.length} relationships</small>
        </div>
        <div className="graph-tools">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All entities</option>
            <option value="Customers">Customers</option>
            <option value="Devices">Devices</option>
          </select>
          <button title="Reset Selection" onClick={() => setSelected(null)}>
            {icon('RotateCcw')}
          </button>
        </div>
      </div>

      <div className="graph-canvas">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Interactive relationship graph">
          {edges.map(([a, b]) => {
            const na = nodes.find((n) => n.id === a)
            const nb = nodes.find((n) => n.id === b)
            if (!na || !nb) return null
            const isActive = selected === a || selected === b
            return (
              <line
                key={a + '-' + b}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                className={isActive ? 'edge active' : 'edge'}
              />
            )
          })}
        </svg>

        {filteredNodes.map((n) => (
          <button
            key={n.id}
            className={`graph-node node-${n.kind} ${selected === n.id ? 'selected' : ''}`}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            onClick={() => setSelected(n.id)}
          >
            <span>
              {icon(
                n.kind === 'customer'
                  ? 'UserRound'
                  : n.kind === 'device'
                  ? 'Smartphone'
                  : n.kind === 'transaction'
                  ? 'ArrowLeftRight'
                  : n.kind === 'account'
                  ? 'WalletCards'
                  : n.kind === 'merchant'
                  ? 'Store'
                  : 'BriefcaseBusiness'
              )}
            </span>
            <strong>{n.sub}</strong>
            <small>{n.label}</small>
          </button>
        ))}
      </div>

      <div className="graph-legend">
        {[
          ['customer', 'Customer'],
          ['device', 'Device'],
          ['transaction', 'Transaction'],
          ['case', 'Case'],
        ].map(([c, l]) => (
          <span key={c}>
            <i className={`legend-${c}`} />
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}

function EvidenceCard({
  e,
  onView,
  onProvenance,
}: {
  e: EvidenceItem
  onView: () => void
  onProvenance: () => void
}) {
  return (
    <div className={`evidence-card ${e.tone}`}>
      <div className="evidence-head">
        <Badge tone={e.tone === 'support' ? 'green' : e.tone === 'contradict' ? 'red' : 'slate'}>
          {e.tone === 'support' ? 'Supporting' : e.tone === 'contradict' ? 'Contradicting' : 'Contextual'}
        </Badge>
        <span>{e.id}</span>
      </div>
      <strong>{e.title}</strong>
      <p>{e.description}</p>
      <div className="evidence-meta">
        <span>{icon('Database')} {e.source}</span>
        <span>{icon('Signal')} {e.strength}</span>
      </div>
      <div className="entity-chip">
        {icon('Route')} {e.entities}
      </div>
      <div className="evidence-actions">
        <button onClick={onView}>View in graph</button>
        <button onClick={onProvenance}>Provenance {icon('ArrowUpRight')}</button>
      </div>
    </div>
  )
}

function InvestigationWorkspace({ caseId }: { caseId: string }) {
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null)
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([])
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [isRequestingEvidence, setIsRequestingEvidence] = useState(false)
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false)
  const [drawer, setDrawer] = useState<string | null>(null)
  const [activeEvidenceItem, setActiveEvidenceItem] = useState<EvidenceItem | null>(null)
  const [toast, setToast] = useState('')

  // Load live case data
  const loadCase = async () => {
    try {
      const [detail, graph, ev] = await Promise.all([
        api.getCaseDetail(caseId),
        api.getCaseGraph(caseId),
        api.getEvidence(caseId)
      ])
      setCaseDetail(detail)
      setGraphData(graph)
      setEvidenceList(ev)
    } catch (err) {
      console.error('Failed to load case detail:', err)
    }
  }

  useEffect(() => {
    loadCase()
  }, [caseId])

  // Request evidence mutation
  const handleRequestEvidence = async () => {
    setIsRequestingEvidence(true)
    try {
      await api.requestEvidence(caseId, 'customer_validation')
      setToast('New evidence received: Customer denied transaction · Case reassessed')
      await loadCase()
    } catch (err) {
      setToast('Evidence request submitted')
    } finally {
      setIsRequestingEvidence(false)
    }
  }

  // Submit approval mutation
  const handleSendApproval = async () => {
    setIsSubmittingApproval(true)
    try {
      await api.createApproval({
        case_id: caseId,
        action: caseDetail?.recommendation.current_recommended_action || 'BLOCK_CARD',
        route: caseDetail?.recommendation.final[0]?.route || 'L1',
        exposure_usd: caseDetail?.exposure_usd || 259.98,
        risk: caseDetail?.uncertainty.risk_score || 94,
        confidence: caseDetail?.uncertainty.confidence || 91,
        notes: 'Supervisor review requested for policy-constrained action'
      })
      setDrawer(null)
      setToast('Approval request submitted to Supervisor')
      await loadCase()
    } catch (err) {
      setToast('Approval submitted')
    } finally {
      setIsSubmittingApproval(false)
    }
  }

  if (!caseDetail) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)' }}>
        Loading investigation workspace for {caseId}...
      </div>
    )
  }

  const requested = caseDetail.verdict === 'fraud' || caseDetail.uncertainty.evidence_sufficiency === 'SUFFICIENT'
  const isAwaitingApproval = caseDetail.status === 'AWAITING_APPROVAL' || caseDetail.approval_status === 'PENDING'

  return (
    <>
      <div className="case-header">
        <div>
          <div className="eyebrow">INVESTIGATION WORKSPACE</div>
          <h1>
            {caseDetail.id}{' '}
            <Badge tone={isAwaitingApproval ? 'amber' : requested ? 'red' : 'blue'}>
              {caseDetail.status.replace('_', ' ').toLowerCase()}
            </Badge>
          </h1>
          <div className="case-summary">
            <span>Trigger <strong>{toTitleCase(caseDetail.trigger_type)}</strong></span>
            <span>Customer <strong>{caseDetail.customer_id}</strong></span>
            <span>Transaction <strong>{caseDetail.flagged_txn_id}</strong></span>
            <span>Amount <strong>${caseDetail.amount.toFixed(2)}</strong></span>
            <span>Opened <strong>{caseDetail.opened_at}</strong></span>
          </div>
        </div>
        <div className="case-actions">
          <Button variant="outline" size="sm" onClick={() => loadCase()}>
            {icon('RefreshCw')} Refresh
          </Button>
        </div>
      </div>

      <div className="risk-strip">
        <div>
          <small>RISK</small>
          <strong className={requested ? 'very-high' : ''}>
            {caseDetail.uncertainty.risk_level}{' '}
            <b>{caseDetail.uncertainty.risk_score}</b>
          </strong>
        </div>
        <div>
          <small>CONFIDENCE</small>
          <strong>
            {caseDetail.uncertainty.confidence >= 85 ? 'HIGH' : 'MEDIUM'}{' '}
            <b>{caseDetail.uncertainty.confidence}%</b>
          </strong>
        </div>
        <div>
          <small>EVIDENCE SUFFICIENCY</small>
          <Badge tone={caseDetail.uncertainty.evidence_sufficiency === 'SUFFICIENT' ? 'green' : 'amber'}>
            {caseDetail.uncertainty.evidence_sufficiency}
          </Badge>
        </div>
        <div className="agent-state">
          <span className="pulse violet" /> Agent active{' '}
          <small>{caseDetail.timeline.length} events</small>
        </div>
      </div>

      <div className="workspace-grid">
        <Graph
          graphData={graphData}
          selected={selectedEntity}
          setSelected={setSelectedEntity}
        />

        <section className="panel evidence-panel">
          <SectionTitle
            eyebrow={`${evidenceList.length} ITEMS · LIVE`}
            title="Evidence &amp; findings"
            action={<button className="small-icon">{icon('SlidersHorizontal')}</button>}
          />
          <div className="evidence-list">
            {evidenceList.map((e) => (
              <EvidenceCard
                key={e.id}
                e={e}
                onView={() => setSelectedEntity(e.id === 'E-004' ? 'D-77' : 'C-123')}
                onProvenance={() => {
                  setActiveEvidenceItem(e)
                  setDrawer('provenance')
                }}
              />
            ))}
          </div>
          <div className="finding">
            <div className="finding-label">
              {icon('Sparkles')} Agent finding <span>{caseDetail.uncertainty.confidence}% confidence</span>
            </div>
            <strong>{caseDetail.finding_headline}</strong>
            <p style={{ margin: '6px 0 0', fontSize: '10px', color: '#c3bdff' }}>{caseDetail.finding_body}</p>
            <div className="finding-foot">
              Pattern <b>{caseDetail.finding_pattern}</b> · Policy <b>{caseDetail.finding_policy}</b>
            </div>
          </div>
        </section>
      </div>

      <section className="panel timeline-panel">
        <SectionTitle title="Agent activity" action={<span className="live"><i /> Live Stream</span>} />
        <div className="timeline">
          {caseDetail.timeline.map(([time, label, state]) => (
            <div className={`timeline-event ${state}`} key={time + label}>
              <b>{time}</b>
              <i />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="lower-grid">
        <section className="panel uncertainty">
          <SectionTitle eyebrow="DECISION READINESS" title="Investigation uncertainty" />
          <div className="certainty-grid">
            <div>
              <small>Known</small>
              {caseDetail.uncertainty.known_signals.map((s) => (
                <p key={s}>✓ {s}</p>
              ))}
            </div>
            <div>
              <small>Uncertain</small>
              {caseDetail.uncertainty.uncertain_signals.length > 0 ? (
                caseDetail.uncertainty.uncertain_signals.map((s) => <p key={s}>? {s}</p>)
              ) : (
                <p style={{ color: 'var(--green)' }}>✓ All key uncertainties resolved</p>
              )}
            </div>
          </div>
          <div className="meter-label">
            <span>Confidence meter</span>
            <strong>{caseDetail.uncertainty.confidence}%</strong>
          </div>
          <div className="meter">
            <span style={{ width: `${caseDetail.uncertainty.confidence}%` }} />
          </div>
          <div className="callout">
            {requested ? 'Evidence now supports definitive intervention.' : 'Why we are not acting yet'}
            <small>{caseDetail.uncertainty.why_not_acting}</small>
          </div>
        </section>

        <section className="panel next-action">
          <SectionTitle
            eyebrow="RECOMMENDED NEXT-BEST-ACTION"
            title={toTitleCase(caseDetail.recommendation.current_recommended_action)}
            action={
              <Badge tone={caseDetail.recommendation.approval_required ? 'red' : 'amber'}>
                {caseDetail.recommendation.approval_required ? 'Approval required' : 'Allowed'}
              </Badge>
            }
          />
          <p>{caseDetail.recommendation.what_changed}</p>
          <div className="action-reasons">
            {(requested
              ? [
                  'Customer denied the transaction',
                  'Suspicious device relationship identified',
                  'Historical related fraud case linked',
                  'Temporal transaction sequence flagged'
                ]
              : [
                  'Uncertainty target: legitimate activity vs account compromise',
                  'Expected decision impact: HIGH',
                  'Policy: allowed · auto execution permitted'
                ]
            ).map((x) => (
              <div key={x}>
                {icon('Check')} {x}
              </div>
            ))}
          </div>
          <div className="policy-row">
            <span>Policy <strong>{caseDetail.recommendation.policy_rule}</strong></span>
            <span>Required role <strong>{caseDetail.recommendation.required_role}</strong></span>
          </div>
          <div className="action-buttons">
            {requested ? (
              <>
                <Button variant="outline" onClick={() => setDrawer('provenance')}>
                  View evidence
                </Button>
                <Button onClick={() => setDrawer('approval')}>
                  {isAwaitingApproval ? 'Awaiting supervisor approval' : 'Request approval'}{' '}
                  {icon('ArrowRight')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setDrawer('why')}>
                  Why this evidence?
                </Button>
                <Button onClick={handleRequestEvidence} disabled={isRequestingEvidence}>
                  {isRequestingEvidence ? 'Requesting validation...' : 'Request customer evidence'}{' '}
                  {icon('ArrowRight')}
                </Button>
              </>
            )}
          </div>
        </section>
      </div>

      {drawer && (
        <div className="drawer-backdrop" onClick={() => setDrawer(null)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()}>
            <button className="drawer-close" onClick={() => setDrawer(null)}>
              {icon('X')}
            </button>
            {drawer === 'approval' ? (
              <>
                <div className="eyebrow">APPROVAL REQUEST</div>
                <h2>Send for supervisor approval?</h2>
                <p>
                  Escalate {caseDetail.id} to a Fraud Supervisor under {caseDetail.recommendation.policy_rule}.
                </p>
                <div className="approval-summary">
                  <span>Risk <strong>Very high · {caseDetail.uncertainty.risk_score}</strong></span>
                  <span>Confidence <strong>{caseDetail.uncertainty.confidence}%</strong></span>
                  <span>Exposure <strong>${caseDetail.exposure_usd.toFixed(2)} USD</strong></span>
                  <span>Action <strong>{caseDetail.recommendation.current_recommended_action}</strong></span>
                </div>
                <Button onClick={handleSendApproval} disabled={isSubmittingApproval}>
                  {isSubmittingApproval ? 'Submitting...' : 'Send for approval'} {icon('ArrowRight')}
                </Button>
              </>
            ) : (
              <>
                <div className="eyebrow">
                  {drawer === 'provenance' ? 'TRACEABILITY' : 'EVIDENCE PLANNER'}
                </div>
                <h2>{drawer === 'provenance' ? 'Evidence provenance' : 'Why this evidence?'}</h2>
                <div className="lineage">
                  {(drawer === 'provenance'
                    ? [
                        'Investigation Finding',
                        `Evidence: ${activeEvidenceItem?.title || 'E-004'}`,
                        activeEvidenceItem?.entities || 'C-123 → D-77 → C-811',
                        `Query: ${activeEvidenceItem?.provenance?.query || 'find_prior_cases'}`,
                        `Source: ${activeEvidenceItem?.source || 'TigerGraph'}`,
                        `Retrieved at: ${activeEvidenceItem?.provenance?.retrieved_at || '10:04:19'}`
                      ]
                    : [
                        'Uncertainty target: Transaction authorization',
                        'Customer transaction verification protocol',
                        'Expected decision impact: HIGH',
                        'Policy rule: R1 (Verify before block on single signal)',
                        'Approval requirement: AUTO (no supervisor required)'
                      ]
                  ).map((x, i) => (
                    <div key={x}>
                      <i>{i + 1}</i>
                      <span>{x}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {toast && (
        <button className="toast" onClick={() => setToast('')}>
          {icon('CheckCircle2')} {toast}
        </button>
      )}
    </>
  )
}

function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const loadApprovals = async () => {
    try {
      const data = await api.getApprovals()
      setApprovals(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApprovals()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await api.approveAction(id)
      setToast(`Approval ${id} approved & executed successfully`)
      await loadApprovals()
    } catch (err) {
      console.error(err)
    }
  }

  const handleReject = async (id: string) => {
    try {
      await api.rejectAction(id)
      setToast(`Approval ${id} rejected`)
      await loadApprovals()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">HUMAN-IN-THE-LOOP CONTROL</div>
          <h1>Pending Approvals</h1>
          <p>Review policy-constrained actions requiring supervisor or lead authorization.</p>
        </div>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Approval ID</th>
                <th>Case</th>
                <th>Action</th>
                <th>Route</th>
                <th>Risk</th>
                <th>Confidence</th>
                <th>Exposure</th>
                <th>Status</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.id}</strong><small>{a.created_at}</small></td>
                  <td><strong>{a.case_id}</strong></td>
                  <td><Badge tone="violet">{a.action}</Badge></td>
                  <td><Badge tone={a.route === 'L2' ? 'red' : 'amber'}>{a.route}</Badge></td>
                  <td><span className="risk risk-high">{a.risk}</span></td>
                  <td>{a.confidence}%</td>
                  <td>${a.exposure_usd.toFixed(2)}</td>
                  <td>
                    <Badge tone={a.status === 'APPROVED' ? 'green' : a.status === 'REJECTED' ? 'red' : 'amber'}>
                      {a.status}
                    </Badge>
                  </td>
                  <td>
                    {a.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Button size="sm" onClick={() => handleApprove(a.id)}>Approve</Button>
                        <Button variant="outline" size="sm" onClick={() => handleReject(a.id)}>Reject</Button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--muted)', fontSize: '11px' }}>Executed</span>
                    )}
                  </td>
                </tr>
              ))}
              {approvals.length === 0 && !loading && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                    No pending approvals.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <button className="toast" onClick={() => setToast('')}>
          {icon('CheckCircle2')} {toast}
        </button>
      )}
    </>
  )
}

function MemoryPage() {
  const [memoryCases, setMemoryCases] = useState<MemoryCaseItem[]>([])

  useEffect(() => {
    api.getSimilarMemory('CASE-10293').then(setMemoryCases).catch(console.error)
  }, [])

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">GRAPH-INDEXED MEMORY (5,565 CASES)</div>
          <h1>Case Memory</h1>
          <p>Historical investigation context for better decisions, never an automatic verdict.</p>
        </div>
      </div>

      <div className="memory-grid">
        {memoryCases.map((c) => (
          <div className="panel memory-card" key={c.id}>
            <div className="case-top">
              <Badge tone="violet">Historical context</Badge>
              <strong>{c.similarity}% match</strong>
            </div>
            <h3>{c.id}</h3>
            <p>{c.analyst_notes}</p>
            <Badge tone={c.outcome === 'Cleared' ? 'green' : 'red'}>
              {c.outcome}
            </Badge>
            <div className="shared">
              <small>Shared signals</small>
              {c.shared.map((s) => (
                <span key={s}>{icon('Check')} {s}</span>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '12px' }}>
              Historical exposure: <strong>${c.exposure_usd.toFixed(2)}</strong>
            </div>
            <Button variant="outline" size="sm">
              Review case context {icon('ArrowUpRight')}
            </Button>
          </div>
        ))}
      </div>
    </>
  )
}

function AuditPage() {
  const [events, setEvents] = useState<AuditLogItem[]>([])

  useEffect(() => {
    api.getAuditEvents().then(setEvents).catch(console.error)
  }, [])

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">COMPLIANCE &amp; TRACEABILITY</div>
          <h1>Audit Log</h1>
          <p>Operational event stream across AI agents, tools, policies and human supervisors.</p>
        </div>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Case ID</th>
                <th>Actor</th>
                <th>Event</th>
                <th>Tool / Action</th>
                <th>Outcome / Result</th>
              </tr>
            </thead>
            <tbody>
              {events.map((r, i) => (
                <tr key={r.timestamp + i}>
                  <td><strong>{r.timestamp}</strong></td>
                  <td><strong>{r.case_id}</strong></td>
                  <td><Badge tone={r.actor === 'Agent' ? 'violet' : r.actor === 'Supervisor' ? 'amber' : 'slate'}>{r.actor}</Badge></td>
                  <td>{r.event}</td>
                  <td>{r.tool_action}</td>
                  <td><strong>{r.result}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function BenchmarkPage() {
  const [cases, setCases] = useState<BenchmarkCaseItem[]>([])
  const [summary, setSummary] = useState<BenchmarkSummary | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [activeAnswer, setActiveAnswer] = useState<any>(null)
  const [toast, setToast] = useState('')

  const loadBenchmark = async () => {
    try {
      const [cList, sum] = await Promise.all([
        api.getBenchmarkCases(),
        api.getBenchmarkStatus()
      ])
      setCases(cList)
      setSummary(sum)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadBenchmark()
  }, [])

  const handleRunAll = async () => {
    setIsRunning(true)
    setToast('Running all 20 benchmark cases through investigation pipeline...')
    try {
      const res = await api.runAllBenchmark()
      setSummary(res)
      await loadBenchmark()
      setToast('Benchmark completed: 20 cases evaluated and exported!')
    } catch (err) {
      console.error(err)
    } finally {
      setIsRunning(false)
    }
  }

  const handleViewAnswer = async (caseId: string) => {
    try {
      const ans = await api.getBenchmarkOutput(caseId)
      setActiveAnswer(ans)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">HHGOA BENCHMARK HARNESS (20 EXAM CASES)</div>
          <h1>Benchmark Evaluation</h1>
          <p>Execute the investigation agent against the 20 official HHGOA exam cases.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={handleRunAll} disabled={isRunning}>
            {isRunning ? 'Evaluating cases...' : 'Run All 20 Cases'} {icon('Play')}
          </Button>
        </div>
      </div>

      {summary && (
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-icon">{icon('ListChecks')}</div>
            <div>
              <small>Evaluated</small>
              <strong>{summary.completed} / {summary.total}</strong>
              <span>100% processed</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">{icon('ShieldAlert')}</div>
            <div>
              <small>Confirmed Fraud</small>
              <strong>{summary.fraud_count}</strong>
              <span>Defensible verdicts</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">{icon('ShieldCheck')}</div>
            <div>
              <small>Cleared Legitimate</small>
              <strong>{summary.legitimate_count}</strong>
              <span>False alarms caught</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">{icon('FileText')}</div>
            <div>
              <small>SARs Filed</small>
              <strong>{summary.sar_count}</strong>
              <span>FinCEN standard</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">{icon('DollarSign')}</div>
            <div>
              <small>Total Exposure</small>
              <strong>${summary.total_exposure_usd.toFixed(2)}</strong>
              <span>USD</span>
            </div>
          </div>
        </div>
      )}

      <div className="panel" style={{ marginTop: '20px' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Case</th>
                <th>Trigger</th>
                <th>Flagged Txn</th>
                <th>Card</th>
                <th>Amount</th>
                <th>Verdict</th>
                <th>Probability</th>
                <th>Pattern</th>
                <th>SAR</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.case_id}>
                  <td><strong>{c.case_id}</strong><small>{c.opened_at}</small></td>
                  <td>{c.trigger_type}</td>
                  <td>{c.flagged_txn_id}</td>
                  <td>{c.card_id}</td>
                  <td>${c.amount.toFixed(2)}</td>
                  <td>
                    {c.verdict ? (
                      <Badge tone={c.verdict === 'fraud' ? 'red' : c.verdict === 'legitimate' ? 'green' : 'amber'}>
                        {c.verdict}
                      </Badge>
                    ) : (
                      <span className="muted">Pending</span>
                    )}
                  </td>
                  <td>{c.fraud_probability !== undefined ? `${(c.fraud_probability * 100).toFixed(0)}%` : '—'}</td>
                  <td>{c.pattern || '—'}</td>
                  <td>
                    {c.sar_filed ? <Badge tone="red">SAR Filed</Badge> : <span className="muted">No</span>}
                  </td>
                  <td>
                    <Button variant="outline" size="sm" onClick={() => handleViewAnswer(c.case_id)}>
                      Deliverables {icon('FileJson')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeAnswer && (
        <div className="drawer-backdrop" onClick={() => setActiveAnswer(null)}>
          <aside className="drawer" style={{ width: '560px' }} onClick={(e) => e.stopPropagation()}>
            <button className="drawer-close" onClick={() => setActiveAnswer(null)}>{icon('X')}</button>
            <div className="eyebrow">OFFICIAL DELIVERABLE · {activeAnswer.case_id}</div>
            <h2>Answer Deliverables</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px' }}>
              <div className="panel" style={{ padding: '14px' }}>
                <strong style={{ display: 'block', marginBottom: '6px' }}>Part 1: Case Record</strong>
                <small>Verdict: <Badge tone="red">{activeAnswer.case.verdict}</Badge></small>
                <p style={{ fontSize: '11px', margin: '8px 0' }}>{activeAnswer.case.summary}</p>
                <small>Exposure: <strong>${activeAnswer.case.exposure_usd.toFixed(2)}</strong></small>
              </div>

              <div className="panel" style={{ padding: '14px' }}>
                <strong style={{ display: 'block', marginBottom: '6px' }}>Part 2: Suspicious Activity Report (SAR)</strong>
                <small>Filing Status: <Badge tone={activeAnswer.sar.file ? 'red' : 'green'}>{activeAnswer.sar.file ? 'Required' : 'Not Required'}</Badge></small>
                {activeAnswer.sar.file && (
                  <p style={{ fontSize: '11px', margin: '8px 0', lineHeight: 1.5 }}>
                    {activeAnswer.sar.narrative}
                  </p>
                )}
              </div>

              <div className="panel" style={{ padding: '14px' }}>
                <strong style={{ display: 'block', marginBottom: '6px' }}>Part 3: Next Best Action Evolution</strong>
                <div style={{ fontSize: '11px' }}>
                  <div><strong>Pre-Evidence:</strong> {activeAnswer.next_best_actions.initial.map((a: any) => `${a.action} (${a.route})`).join(', ')}</div>
                  <div style={{ marginTop: '6px' }}><strong>Post-Evidence:</strong> {activeAnswer.next_best_actions.final.map((a: any) => `${a.action} (${a.route})`).join(', ')}</div>
                  <p style={{ fontSize: '10px', marginTop: '8px' }}>{activeAnswer.next_best_actions.what_changed}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {toast && (
        <button className="toast" onClick={() => setToast('')}>
          {icon('CheckCircle2')} {toast}
        </button>
      )}
    </>
  )
}

function SettingsPage() {
  const [health, setHealth] = useState<any>(null)

  useEffect(() => {
    api.getHealth().then(setHealth).catch(console.error)
  }, [])

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">SYSTEM &amp; INTEGRATION STATUS</div>
          <h1>Settings &amp; Environment</h1>
          <p>Connectivity, TigerGraph MCP tools, and agent execution parameters.</p>
        </div>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="panel" style={{ padding: '20px' }}>
          <SectionTitle title="Backend Connection" />
          <p>FastAPI connection status: <Badge tone="green">{health?.status || 'Online'}</Badge></p>
          <p>Environment: <strong>Development (Port 8000)</strong></p>
          <p>LangGraph Workflow: <strong>10-Stage Decision State Machine</strong></p>
        </div>

        <div className="panel" style={{ padding: '20px' }}>
          <SectionTitle title="TigerGraph &amp; MCP Integration" />
          <p>Graph Storage: <Badge tone="green">Connected</Badge></p>
          <p>Entities Indexed: <strong>735,174 (IEEE-CIS Dataset)</strong></p>
          <p>MCP Investigation Tools: <strong>5 Logical Tools Exposed</strong></p>
        </div>
      </div>
    </>
  )
}

export default function SentinelApp() {
  const path = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState('')
  const [cases, setCases] = useState<CaseListItem[]>([])
  const [metrics, setMetrics] = useState<CaseMetrics | null>(null)
  const [auditEvents, setAuditEvents] = useState<AuditLogItem[]>([])
  const [systemStatus, setSystemStatus] = useState('TigerGraph · Connected')

  // Load common data on boot
  useEffect(() => {
    api.getCases()
      .then(setCases)
      .catch((err) => console.warn('Backend cases load error:', err))

    api.getMetrics()
      .then(setMetrics)
      .catch((err) => console.warn('Backend metrics load error:', err))

    api.getAuditEvents()
      .then(setAuditEvents)
      .catch((err) => console.warn('Backend audit load error:', err))

    api.getHealth()
      .then((h) => setSystemStatus(`TigerGraph ${h.status} · LangGraph Active`))
      .catch(() => setSystemStatus('Standalone Mode'))
  }, [])

  // Route determination
  const isInvestigationDetail = path?.startsWith('/investigations/') && path !== '/investigations'
  const isQueue = path === '/investigations' || path === '/cases'
  const isDashboard = !path || path === '/' || path === '/dashboard'
  const isApprovals = path === '/approvals'
  const isMemory = path === '/memory'
  const isAudit = path === '/audit'
  const isBenchmark = path === '/benchmark'
  const isSettings = path === '/settings'
  const isGraph = path === '/graph'

  // Extract caseId for workspace
  const activeCaseId = isInvestigationDetail ? path.replace('/investigations/', '') : 'CASE-10293'

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} metrics={metrics} />
      <div className="main-shell">
        <Header onSearch={setSearch} systemStatus={systemStatus} />
        <main className="main-content">
          {isDashboard && <Dashboard cases={cases} metrics={metrics} auditEvents={auditEvents} />}
          {isQueue && <Queue cases={cases} />}
          {isInvestigationDetail && <InvestigationWorkspace caseId={activeCaseId} />}
          {isApprovals && <ApprovalsPage />}
          {isMemory && <MemoryPage />}
          {isAudit && <AuditPage />}
          {isBenchmark && <BenchmarkPage />}
          {isSettings && <SettingsPage />}
          {isGraph && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">GRAPH EXPLORER</div>
                  <h1>Enterprise Graph Visualizer</h1>
                  <p>Interactive graph topology of entities, devices, and transaction chains.</p>
                </div>
              </div>
              <div className="standalone-graph">
                <InvestigationWorkspace caseId="CASE-10293" />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
