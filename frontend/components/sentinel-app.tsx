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

function getFormattedCurrentDate(): string {
  const d = new Date()
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).toUpperCase()
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

  const activeCount = metrics ? String(metrics.active_investigations) : '—'
  const approvalCount = metrics ? String(metrics.pending_approvals) : '—'

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="brand">
        {collapsed ? (
          <button
            type="button"
            className="brand-mark-btn collapsed"
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            S
          </button>
        ) : (
          <>
            <div className="brand-left">
              <button
                type="button"
                className="brand-mark-btn"
                onClick={() => setCollapsed(true)}
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                S
              </button>
              <div
                className="brand-text"
                onClick={() => setCollapsed(true)}
                title="Collapse sidebar"
                style={{ cursor: 'pointer' }}
              >
                <strong>sentinel<span>ai</span></strong>
                <small>FRAUD OPERATIONS</small>
              </div>
            </div>
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={() => setCollapsed(true)}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              {icon('Menu')}
            </button>
          </>
        )}
      </div>
      <nav>
        {navItems.map(([label, ico, href]) => (
          <button
            key={href}
            type="button"
            className={`nav-item ${path === href || (href === '/dashboard' && path === '/') ? 'active' : ''}`}
            onClick={() => router.push(href)}
            title={collapsed ? label : undefined}
          >
            <span className="nav-icon">{icon(ico)}</span>
            <span className="nav-label">{label}</span>
            {['Investigations', 'Approvals'].includes(label) && (
              <em className="nav-badge">{label === 'Investigations' ? activeCount : approvalCount}</em>
            )}
          </button>
        ))}
      </nav>
    </aside>
  )
}

function Header({
  onSearch,
  systemStatus,
  onToggleSidebar,
  sidebarCollapsed
}: {
  onSearch: (v: string) => void
  systemStatus: string
  onToggleSidebar: () => void
  sidebarCollapsed: boolean
}) {
  return (
    <header className="topbar">
      <div className="mobile-brand" onClick={onToggleSidebar} style={{ cursor: 'pointer' }}>
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
      </div>
    </header>
  )
}

function MetricCards({ metrics }: { metrics: CaseMetrics | null }) {
  const stats = [
    {
      label: 'Active investigations',
      value: metrics ? String(metrics.active_investigations) : '—',
      change: metrics?.active_change || 'Live',
      icon: 'Radar'
    },
    {
      label: 'Awaiting evidence',
      value: metrics ? String(metrics.awaiting_evidence).padStart(2, '0') : '—',
      change: metrics?.awaiting_change || 'Pending response',
      icon: 'FileSearch'
    },
    {
      label: 'Pending approvals',
      value: metrics ? String(metrics.pending_approvals).padStart(2, '0') : '—',
      change: metrics?.pending_change || 'Queue clear',
      icon: 'BadgeCheck'
    },
    {
      label: 'Escalations',
      value: metrics ? String(metrics.escalations).padStart(2, '0') : '—',
      change: metrics?.escalations_change || 'None active',
      icon: 'ArrowUpRight'
    },
    {
      label: 'Resolved today',
      value: metrics ? String(metrics.resolved_today) : '—',
      change: metrics?.resolved_change || 'Cases closed',
      icon: 'CircleCheck'
    }
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
          <div className="eyebrow">OPERATIONS OVERVIEW · {getFormattedCurrentDate()}</div>
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
            {auditEvents.slice(0, 6).map((x, i) => {
              const isSuccess = ['Executed', 'Approved', 'Allowed', 'Evidence found'].includes(x.result)
              const isWarning = ['Warning', 'Waiting', 'Insufficient'].includes(x.result) || x.event.includes('insufficient')
              return (
                <div className={`activity-row ${isWarning ? 'warning' : ''}`} key={x.timestamp + i}>
                  <span>
                    {isSuccess ? icon('Check') : isWarning ? icon('AlertTriangle') : icon('ArrowRight')}
                  </span>
                  <div>
                    <strong>{x.tool_action}</strong>
                    <small>{x.case_id} · {x.result} · {x.timestamp}</small>
                  </div>
                </div>
              )
            })}
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

function Queue({ cases, metrics }: { cases: CaseListItem[]; metrics?: CaseMetrics | null }) {
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
            {t === 'Awaiting Approval' && (metrics?.pending_approvals ?? 0) > 0 && <b>{metrics?.pending_approvals}</b>}
            {t === 'Awaiting Evidence' && (metrics?.awaiting_evidence ?? 0) > 0 && <b>{metrics?.awaiting_evidence}</b>}
            {t === 'Active' && (metrics?.active_investigations ?? 0) > 0 && <b>{metrics?.active_investigations}</b>}
          </button>
        ))}
      </div>

      <section className="panel">
        <InvestigationTable cases={filtered} />
      </section>
    </>
  )
}

function CasesPage({ cases, metrics }: { cases: CaseListItem[]; metrics?: CaseMetrics | null }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [typologyFilter, setTypologyFilter] = useState('All Typologies')
  const [statusFilter, setStatusFilter] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [selectedSarCase, setSelectedSarCase] = useState<CaseListItem | null>(null)
  const [copiedSar, setCopiedSar] = useState(false)

  const typologies = [
    'All Typologies',
    'Account Takeover (ATO)',
    'Syndicate Card Cycling',
    'Device Farm Spoofing',
    'Synthetic Identity',
    'Velocity Spike'
  ]

  const getCaseTypology = (c: CaseListItem) => {
    if (c.id === 'CASE-10293' || c.trigger.toLowerCase().includes('device')) return 'Account Takeover (ATO)'
    if (c.trigger.toLowerCase().includes('report') || c.customer === 'C12382') return 'Syndicate Card Cycling'
    if (c.risk > 75) return 'Device Farm Spoofing'
    if (c.amount > 200) return 'Synthetic Identity'
    return 'Velocity Spike'
  }

  const getSarStatus = (c: CaseListItem) => {
    if (c.risk >= 75) return 'SAR Recommended'
    if (c.status.toLowerCase().includes('approval')) return 'Under Compliance Review'
    if (c.status.toLowerCase().includes('resolved')) return 'Case Closed'
    return 'Active Dossier'
  }

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const typ = getCaseTypology(c)
      const sar = getSarStatus(c)
      if (typologyFilter !== 'All Typologies' && typ !== typologyFilter) return false
      if (statusFilter !== 'All' && sar !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          c.id.toLowerCase().includes(q) ||
          c.customer.toLowerCase().includes(q) ||
          c.transaction.toLowerCase().includes(q) ||
          typ.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [cases, typologyFilter, statusFilter, search])

  const totalExposure = useMemo(() => {
    return cases.reduce((acc, c) => acc + (c.amount || 0), 0)
  }, [cases])

  const highRiskCount = useMemo(() => {
    return cases.filter((c) => c.risk >= 75).length
  }, [cases])

  const handleCopySar = (c: CaseListItem) => {
    const text = `FINCEN SUSPICIOUS ACTIVITY REPORT (SAR) DOSSIER
CASE IDENTIFIER: ${c.id}
PRIMARY SUBJECT: ${c.customer}
TRANSACTION REFERENCE: ${c.transaction} ($${c.amount.toFixed(2)})
PRIMARY SUSPECTED TYPOLOGY: ${getCaseTypology(c)}
INVESTIGATION ENGINE: Sentinel AI LangGraph Multi-Hop Graph Traversal
EVIDENCE CHAIN: ${c.evidence} Graph-Linked Artifacts
FINDINGS: Autonomous multi-hop traversal on TigerGraph identified device clustering and cross-account velocity anomalies.
RECOMMENDED NEXT-BEST-ACTION: ${c.nba}
COMPLIANCE SIGN-OFF: PENDING SUPERVISOR REVIEW`

    navigator.clipboard.writeText(text)
    setCopiedSar(true)
    setTimeout(() => setCopiedSar(false), 2000)
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">CASE MANAGEMENT &amp; DOSSIER PORTFOLIO</div>
          <h1>Cases</h1>
          <p>Comprehensive repository of fraud dossiers, suspicious activity reports (SAR), and enterprise risk outcomes.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" onClick={() => setSelectedSarCase(cases[0] || null)}>
            {icon('FileText')} SAR Template
          </Button>
          <Button onClick={() => router.push('/investigations/CASE-10293')}>
            <Icons.Plus data-icon="inline-start" /> New case filing
          </Button>
        </div>
      </div>

      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
        <div className="metric-card">
          <div className="metric-icon">{icon('BriefcaseBusiness')}</div>
          <div>
            <small>Total Dossiers</small>
            <strong>{cases.length}</strong>
            <span>Active Enterprise Portfolio</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#3b2426', color: '#ff9ba0' }}>{icon('ShieldAlert')}</div>
          <div>
            <small>High Exposure / SAR</small>
            <strong style={{ color: 'var(--red)' }}>{highRiskCount}</strong>
            <span style={{ color: 'var(--red)' }}>Critical Risk Threshold</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">{icon('DollarSign')}</div>
          <div>
            <small>Prevented Exposure</small>
            <strong>${totalExposure.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
            <span>Protected Value</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">{icon('Bot')}</div>
          <div>
            <small>Graph Resolution</small>
            <strong>100%</strong>
            <span>TigerGraph Grounded</span>
          </div>
        </div>
      </div>

      <div className="toolbar" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div className="field-search">
          {icon('Search')}
          <input
            placeholder="Search cases by ID, customer, transaction or typology..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={typologyFilter} onChange={(e) => setTypologyFilter(e.target.value)}>
          {typologies.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div style={{ display: 'flex', background: '#121821', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            style={{
              padding: '6px 10px',
              border: 0,
              background: viewMode === 'grid' ? '#252d3a' : 'transparent',
              color: viewMode === 'grid' ? '#fff' : '#718096',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px'
            }}
          >
            {icon('LayoutGrid')} Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            style={{
              padding: '6px 10px',
              border: 0,
              background: viewMode === 'table' ? '#252d3a' : 'transparent',
              color: viewMode === 'table' ? '#fff' : '#718096',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px'
            }}
          >
            {icon('List')} Table
          </button>
        </div>
      </div>

      <div className="tabs">
        {['All', 'SAR Recommended', 'Under Compliance Review', 'Active Dossier', 'Case Closed'].map((s) => (
          <button
            key={s}
            className={statusFilter === s ? 'selected' : ''}
            onClick={() => setStatusFilter(s)}
          >
            {s}
            {s === 'SAR Recommended' && <b style={{ background: '#542629', color: '#ffb2b6' }}>{highRiskCount}</b>}
          </button>
        ))}
      </div>

      {viewMode === 'grid' ? (
        <div className="dossier-grid">
          {filteredCases.map((c) => {
            const typology = getCaseTypology(c)
            const sarStatus = getSarStatus(c)
            return (
              <div key={c.id} className="dossier-card">
                <div>
                  <div className="dossier-top">
                    <span className="dossier-typology">{typology}</span>
                    <Badge tone={c.risk >= 75 ? 'red' : c.risk >= 60 ? 'amber' : 'green'}>
                      Risk {c.risk}
                    </Badge>
                  </div>
                  <div className="dossier-body">
                    <h3>{c.id}</h3>
                    <p>Trigger: {c.trigger}</p>
                    <div className="dossier-metrics">
                      <div>
                        <span>Customer</span>
                        <strong>{c.customer}</strong>
                      </div>
                      <div>
                        <span>Exposure</span>
                        <strong style={{ color: 'var(--amber)' }}>${c.amount.toFixed(2)}</strong>
                      </div>
                      <div>
                        <span>Evidence Nodes</span>
                        <strong>{c.evidence} graph artifacts</strong>
                      </div>
                      <div>
                        <span>Confidence</span>
                        <strong>{c.confidence}%</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', fontSize: '10px', color: 'var(--muted)' }}>
                    <span>SAR Status:</span>
                    <strong style={{ color: sarStatus === 'SAR Recommended' ? 'var(--red)' : '#ccd4e2' }}>
                      {sarStatus}
                    </strong>
                  </div>
                  <div className="dossier-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ flex: 1, fontSize: '11px' }}
                      onClick={() => setSelectedSarCase(c)}
                    >
                      {icon('FileText')} SAR File
                    </Button>
                    <Button
                      size="sm"
                      style={{ flex: 1.2, fontSize: '11px' }}
                      onClick={() => router.push('/investigations/' + c.id)}
                    >
                      Deep Dive {icon('ArrowUpRight')}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <section className="panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Typology</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Risk Score</th>
                  <th>Confidence</th>
                  <th>Evidence</th>
                  <th>SAR Status</th>
                  <th>NBA Recommendation</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((c) => (
                  <tr key={c.id} onClick={() => router.push('/investigations/' + c.id)}>
                    <td><strong>{c.id}</strong><small>{c.updated}</small></td>
                    <td><span className="dossier-typology">{getCaseTypology(c)}</span></td>
                    <td>{c.customer}</td>
                    <td><strong>${c.amount.toFixed(2)}</strong></td>
                    <td><span className={`risk ${c.risk >= 75 ? 'risk-high' : c.risk >= 60 ? 'risk-med' : 'risk-low'}`}>{c.risk}</span></td>
                    <td>{c.confidence}%</td>
                    <td>{c.evidence} items</td>
                    <td>
                      <Badge tone={getSarStatus(c) === 'SAR Recommended' ? 'red' : 'slate'}>
                        {getSarStatus(c)}
                      </Badge>
                    </td>
                    <td><small>{c.nba}</small></td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedSarCase(c)
                        }}
                      >
                        SAR
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selectedSarCase && (
        <div className="drawer-backdrop" onClick={() => setSelectedSarCase(null)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()} style={{ width: '480px', overflowY: 'auto' }}>
            <button className="drawer-close" onClick={() => setSelectedSarCase(null)}>
              {icon('X')}
            </button>
            <div className="eyebrow">REGULATORY COMPLIANCE DOSSIER</div>
            <h2>FinCEN SAR Package</h2>
            <p>Suspicious Activity Report auto-grounded by TigerGraph multi-hop evidence and LangGraph agent reasoning.</p>

            <div className="approval-summary">
              <div>Case Identifier: <strong>{selectedSarCase.id}</strong></div>
              <div>Subject Identity: <strong>{selectedSarCase.customer}</strong></div>
              <div>Financial Exposure: <strong>${selectedSarCase.amount.toFixed(2)} USD</strong></div>
              <div>Suspected Typology: <strong>{getCaseTypology(selectedSarCase)}</strong></div>
              <div>Risk Classification: <strong>Score {selectedSarCase.risk}/100 ({selectedSarCase.risk >= 75 ? 'Critical SAR Threshold' : 'Elevated Risk'})</strong></div>
            </div>

            <div className="finding">
              <div className="finding-label">
                {icon('ShieldAlert')}
                <b>Graph Provenance Findings</b>
              </div>
              <strong style={{ fontSize: '11px', color: '#e2e8f0', lineHeight: 1.6 }}>
                Multi-hop graph traversal on TigerGraph confirmed device &amp; transaction clustering with
                suspicious pattern signature. Linked to {selectedSarCase.evidence} graph artifacts across
                the IEEE-CIS benchmark dataset.
              </strong>
              <div className="finding-foot">
                Policy Rule: <b>Rule R4 (Shared Origin) &amp; Rule R6 (OOB Denial)</b>
              </div>
            </div>

            <div style={{ background: '#0e141d', border: '1px solid var(--border)', borderRadius: '6px', padding: '12px', marginTop: '16px', fontFamily: 'monospace', fontSize: '10px', color: '#9ba7b9', whiteSpace: 'pre-wrap' }}>
              {`*** OFFICIAL FINCEN SAR NARRATIVE RECORD ***
FILING ENTITY: Sentinel AI Autonomous Operations
RECORD REF: ${selectedSarCase.id}
PRIMARY SUBJECT: ${selectedSarCase.customer}
TRANSACTION: ${selectedSarCase.transaction} | AMOUNT: $${selectedSarCase.amount.toFixed(2)}
RECOMMENDED ACTION: ${selectedSarCase.nba}
STATUS: PENDING COMPLIANCE SUPERVISOR ATTESTATION`}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <Button
                style={{ flex: 1 }}
                onClick={() => handleCopySar(selectedSarCase)}
              >
                {copiedSar ? icon('Check') : icon('Copy')} {copiedSar ? 'Copied to Clipboard!' : 'Copy SAR Dossier'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  router.push('/investigations/' + selectedSarCase.id)
                  setSelectedSarCase(null)
                }}
              >
                Open Case {icon('ArrowUpRight')}
              </Button>
            </div>
          </div>
        </div>
      )}
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

  // Compute the active path for the selected node or evidence
  const { activeEdges, activeNodes } = useMemo(() => {
    if (!selected) {
      return { activeEdges: new Set<string>(), activeNodes: new Set<string>() }
    }

    const aEdges = new Set<string>()
    const aNodes = new Set<string>([selected])

    // Build adjacency list
    const adj = new Map<string, string[]>()
    edges.forEach(([u, v]) => {
      if (!adj.has(u)) adj.set(u, [])
      if (!adj.has(v)) adj.set(v, [])
      adj.get(u)!.push(v)
      adj.get(v)!.push(u)
    })

    // Find root / customer node
    const rootNode = nodes.find((n) => n.kind === 'customer')?.id || nodes[0]?.id

    // Helper: find path between two nodes
    const findPath = (start: string, target: string, visited = new Set<string>()): string[] | null => {
      if (start === target) return [start]
      visited.add(start)
      for (const next of adj.get(start) || []) {
        if (!visited.has(next)) {
          const res = findPath(next, target, visited)
          if (res) return [start, ...res]
        }
      }
      return null
    }

    // Collect all downstream nodes in DAG from a given node
    const collectDownstream = (curr: string, visited: Set<string>) => {
      visited.add(curr)
      edges.forEach(([u, v]) => {
        if (u === curr && !visited.has(v)) {
          aEdges.add(`${u}-${v}`)
          aEdges.add(`${v}-${u}`)
          aNodes.add(v)
          collectDownstream(v, visited)
        }
      })
    }

    if (rootNode && selected !== rootNode) {
      const pathToRoot = findPath(rootNode, selected)
      if (pathToRoot) {
        for (let i = 0; i < pathToRoot.length - 1; i++) {
          const u = pathToRoot[i]
          const v = pathToRoot[i + 1]
          aEdges.add(`${u}-${v}`)
          aEdges.add(`${v}-${u}`)
          aNodes.add(u)
          aNodes.add(v)
        }
      }
      // Also trace downstream from selected to leaf nodes of this branch
      collectDownstream(selected, new Set<string>(pathToRoot || []))
    } else {
      // If rootNode is selected, highlight all direct incident edges
      edges.forEach(([u, v]) => {
        if (u === selected || v === selected) {
          aEdges.add(`${u}-${v}`)
          aEdges.add(`${v}-${u}`)
          aNodes.add(u)
          aNodes.add(v)
        }
      })
    }

    return { activeEdges: aEdges, activeNodes: aNodes }
  }, [selected, edges, nodes])

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
          <button type="button" title="Reset Selection" onClick={() => setSelected(null)}>
            {icon('RotateCcw')}
          </button>
        </div>
      </div>

      <div className="graph-canvas" onClick={() => setSelected(null)}>
        <svg className="graph-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Interactive relationship graph">
          {edges.map(([a, b]) => {
            const na = nodes.find((n) => n.id === a)
            const nb = nodes.find((n) => n.id === b)
            if (!na || !nb) return null
            const isActive = activeEdges.has(`${a}-${b}`) || activeEdges.has(`${b}-${a}`)
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

        {filteredNodes.map((n) => {
          const isSelected = selected === n.id
          const isInPath = activeNodes.has(n.id)
          return (
            <button
              key={n.id}
              type="button"
              className={`graph-node node-${n.kind} ${isSelected ? 'selected' : isInPath ? 'in-path' : ''}`}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              onClick={(e) => {
                e.stopPropagation()
                setSelected(isSelected ? null : n.id)
              }}
            >
              <span>
                {icon(
                  n.kind === 'customer'
                    ? 'UserRound'
                    : n.kind === 'device'
                      ? 'Smartphone'
                      : n.kind === 'transaction'
                        ? 'ArrowLeftRight'
                        : n.kind === 'account' || n.kind === 'card'
                          ? 'WalletCards'
                          : n.kind === 'merchant'
                            ? 'Store'
                            : 'BriefcaseBusiness'
                )}
              </span>
              <strong>{n.sub}</strong>
              <small>{n.label}</small>
            </button>
          )
        })}

        {nodes.find((n) => n.id === selected) && (() => {
          const an = nodes.find((n) => n.id === selected)!
          const connCount = edges.filter(([a, b]) => a === an.id || b === an.id).length
          // Smart non-overlapping anchor positioning:
          // If node is in bottom half, show popup above it; if in top half, show below it
          const isBottomHalf = an.y >= 50
          const clampedX = Math.max(18, Math.min(82, an.x))
          const cardStyle: React.CSSProperties = isBottomHalf
            ? {
                bottom: `calc(${100 - an.y}% + 34px)`,
                left: `${clampedX}%`,
                transform: 'translateX(-50%)'
              }
            : {
                top: `calc(${an.y}% + 34px)`,
                left: `${clampedX}%`,
                transform: 'translateX(-50%)'
              }

          return (
            <div
              className="graph-inspector-card"
              style={cardStyle}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="inspector-head">
                <Badge tone={an.kind === 'customer' ? 'blue' : an.kind === 'device' ? 'green' : an.kind === 'transaction' ? 'amber' : an.kind === 'account' || an.kind === 'card' ? 'violet' : 'purple'}>
                  {an.kind.toUpperCase()}
                </Badge>
                <button type="button" onClick={() => setSelected(null)} aria-label="Close inspector">✕</button>
              </div>
              <strong>{an.sub}</strong>
              <p>{an.label} {an.meta?.amount ? `· ${an.meta.amount}` : ''} {an.meta?.model ? `· ${an.meta.model}` : ''}</p>
              <div className="inspector-meta">
                <span>TigerGraph entity · {connCount} connected link{connCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          )
        })()}
      </div>

      <div className="graph-legend">
        {[
          ['customer', 'Customer'],
          ['account', 'Account'],
          ['device', 'Device'],
          ['transaction', 'Transaction'],
          ['merchant', 'Merchant'],
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
                onView={() => {
                  const parts = e.entities.split('→').map((s) => s.trim())
                  const target = [...parts].reverse().find((p) => graphData?.nodes.some((n) => n.id === p)) || parts[0]
                  setSelectedEntity(target || null)
                }}
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
            {(caseDetail.recommendation.reasons && caseDetail.recommendation.reasons.length > 0
              ? caseDetail.recommendation.reasons
              : requested
                ? [
                  `Customer denial confirmed unauthorized transaction ${caseDetail.flagged_txn_id}`,
                  `Shared entity graph links device ${caseDetail.connected_device_profiles[0] || 'profile'} across cards`,
                  `Case memory identified confirmed fraud pattern (${caseDetail.pattern.replace(/_/g, ' ')})`,
                  `Exposure of $${caseDetail.exposure_usd.toFixed(2)} USD requires ${caseDetail.recommendation.required_role} review`
                ]
                : [
                  `Uncertainty target: legitimate use vs account takeover on ${caseDetail.flagged_txn_id}`,
                  `Model risk score: ${caseDetail.uncertainty.risk_score}% on ${caseDetail.trigger_type.replace(/_/g, ' ')}`,
                  `Policy ${caseDetail.recommendation.policy_rule}: automated step-up verification required before card blocking`,
                  `Expected decision impact: HIGH once customer authentication response is received`
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
                  Escalate {caseDetail.id} to a {caseDetail.recommendation.required_role} under {caseDetail.recommendation.policy_rule}.
                </p>
                <div className="approval-summary">
                  <span>Risk <strong>{caseDetail.uncertainty.risk_level} · {caseDetail.uncertainty.risk_score}</strong></span>
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
                      `Investigation: ${caseDetail.id}`,
                      `Evidence: ${activeEvidenceItem?.id} · ${activeEvidenceItem?.title || 'Signal Item'}`,
                      `Entities Involved: ${activeEvidenceItem?.entities || caseDetail.customer_id}`,
                      `Tool / Query: ${activeEvidenceItem?.provenance?.tool || 'TigerGraph GraphRAG'} (${activeEvidenceItem?.provenance?.query || 'relationship_query'})`,
                      `Source: ${activeEvidenceItem?.source || 'TigerGraph'}`,
                      `Retrieved at: ${activeEvidenceItem?.provenance?.retrieved_at || activeEvidenceItem?.time || 'Real-time'}`
                    ]
                    : [
                      `Target Transaction: ${caseDetail.flagged_txn_id} ($${caseDetail.amount.toFixed(2)})`,
                      `Recommended Protocol: ${caseDetail.recommendation.current_recommended_action.replace(/_/g, ' ')}`,
                      `Decision Impact: HIGH (Risk score ${caseDetail.uncertainty.risk_score}%, Confidence ${caseDetail.uncertainty.confidence}%)`,
                      `Governing Policy: ${caseDetail.recommendation.policy_rule}`,
                      `Authorization Level: ${caseDetail.recommendation.required_role}`
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

function MemoryPage({ cases = [] }: { cases?: CaseListItem[] }) {
  const [memoryCases, setMemoryCases] = useState<MemoryCaseItem[]>([])
  const [selectedCase, setSelectedCase] = useState<string>('CASE-10293')
  const [patternFilter, setPatternFilter] = useState<string>('All')
  const [search, setSearch] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const loadMemory = async () => {
    setLoading(true)
    try {
      if (selectedCase === 'ALL') {
        const data = await api.getMemoryCases(patternFilter === 'All' ? undefined : patternFilter, 16)
        setMemoryCases(data)
      } else {
        const data = await api.getSimilarMemory(selectedCase)
        setMemoryCases(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMemory()
  }, [selectedCase, patternFilter])

  const filtered = useMemo(() => {
    if (!search) return memoryCases
    const q = search.toLowerCase()
    return memoryCases.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.analyst_notes.toLowerCase().includes(q) ||
        c.shared.some((s) => s.toLowerCase().includes(q))
    )
  }, [memoryCases, search])

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">GRAPH-INDEXED MEMORY (5,565 CASES)</div>
          <h1>Case Memory</h1>
          <p>Historical investigation context for better decisions, retrieved from TigerGraph closed cases.</p>
        </div>
      </div>

      <div className="toolbar">
        <div className="field-search">
          {icon('Search')}
          <input
            placeholder="Search memory cases, notes, signals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={selectedCase} onChange={(e) => setSelectedCase(e.target.value)}>
          <option value="CASE-10293">Target: CASE-10293 (Golden Case)</option>
          {cases.filter(c => c.id !== 'CASE-10293').map(c => (
            <option key={c.id} value={c.id}>Target: {c.id} ({c.trigger})</option>
          ))}
          <option value="ALL">Browse All Closed Cases</option>
        </select>
        <select value={patternFilter} onChange={(e) => setPatternFilter(e.target.value)}>
          <option value="All">All Patterns</option>
          <option value="card_testing">Card Testing</option>
          <option value="card_not_present_fraud">Card Not Present</option>
          <option value="card_not_present_new_device">CNP New Device</option>
          <option value="out_of_region_use">Out of Region</option>
          <option value="account_takeover">Account Takeover</option>
          <option value="undocumented">Undocumented</option>
          <option value="none">Cleared False Alarms</option>
        </select>
      </div>

      <div className="memory-grid">
        {filtered.map((c) => (
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
        {filtered.length === 0 && (
          <div className="panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', gridColumn: '1 / -1' }}>
            {loading ? 'Searching TigerGraph Case Memory...' : 'No historical cases found matching your filters.'}
          </div>
        )}
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
          <p>FastAPI connection status: <Badge tone="green">{health?.status ? toTitleCase(health.status) : 'Online'}</Badge></p>
          <p>Environment: <strong>{health?.environment ? toTitleCase(health.environment) : 'Development'} (Port {health?.port || 8001})</strong></p>
          <p>Workflow Engine: <strong>{health?.workflow || '10-Stage Decision State Machine'}</strong></p>
          <p>API Base URL: <strong>{process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'}</strong></p>
        </div>

        <div className="panel" style={{ padding: '20px' }}>
          <SectionTitle title="TigerGraph &amp; MCP Integration" />
          <p>Graph Storage: <Badge tone="green">{health?.tigergraph ? toTitleCase(health.tigergraph) : 'Connected'}</Badge></p>
          <p>Target Graph: <strong>{health?.tigergraph_graph || 'FraudGraph'} ({health?.tigergraph_host || 'http://localhost:9000'})</strong></p>
          <p>Entities Indexed: <strong>{health?.entities_indexed ? health.entities_indexed.toLocaleString() : '735,174'} (IEEE-CIS Dataset)</strong></p>
          <p>MCP Investigation Tools: <strong>{health?.mcp_tools_count || 5} Logical Tools Active</strong></p>
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
  const [graphCaseId, setGraphCaseId] = useState('CASE-10293')

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
  const isQueue = path === '/investigations'
  const isCases = path === '/cases'
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
        <Header
          onSearch={setSearch}
          systemStatus={systemStatus}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          sidebarCollapsed={collapsed}
        />
        <main className="main-content">
          {isDashboard && <Dashboard cases={cases} metrics={metrics} auditEvents={auditEvents} />}
          {isQueue && <Queue cases={cases} metrics={metrics} />}
          {isCases && <CasesPage cases={cases} metrics={metrics} />}
          {isInvestigationDetail && <InvestigationWorkspace caseId={activeCaseId} />}
          {isApprovals && <ApprovalsPage />}
          {isMemory && <MemoryPage cases={cases} />}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <small style={{ color: 'var(--muted)', fontSize: '12px' }}>Active Case:</small>
                  <select
                    value={graphCaseId}
                    onChange={(e) => setGraphCaseId(e.target.value)}
                    style={{ padding: '6px 12px', background: '#13151f', color: '#f3f4f6', border: '1px solid #2a2d3d', borderRadius: '6px', fontSize: '12px' }}
                  >
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id} ({c.customer} · ${c.amount.toFixed(2)})
                      </option>
                    ))}
                    {cases.length === 0 && <option value="CASE-10293">CASE-10293</option>}
                  </select>
                </div>
              </div>
              <div className="standalone-graph">
                <InvestigationWorkspace caseId={graphCaseId} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
