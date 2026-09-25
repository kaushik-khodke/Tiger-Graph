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
import { LanguageSelector } from '@/components/language-selector'
import { TranslationContext, useTranslation, t, initGoogleTranslate, setGoogleTranslateLanguage } from '@/lib/translations'

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
  const { t } = useTranslation()
  const content = typeof children === 'string' ? t(children) : children
  return <span className={`badge badge-${tone}`}>{content}</span>
}

function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  const { t } = useTranslation()
  return (
    <div className="section-title">
      <div>
        {eyebrow && <div className="eyebrow">{t(eyebrow)}</div>}
        <h2>{t(title)}</h2>
      </div>
      {action}
    </div>
  )
}

function Sidebar({ collapsed, setCollapsed, metrics }: { collapsed: boolean; setCollapsed: (v: boolean) => void; metrics?: CaseMetrics | null }) {
  const path = usePathname()
  const router = useRouter()
  const { t } = useTranslation()

  const navItems = [
    [t('Dashboard'), 'LayoutDashboard', '/dashboard'],
    [t('Investigations'), 'Radar', '/investigations'],
    [t('Cases'), 'BriefcaseBusiness', '/cases'],
    [t('Graph Explorer'), 'Share2', '/graph'],
    [t('Approvals'), 'BadgeCheck', '/approvals'],
    [t('Case Memory'), 'Library', '/memory'],
    [t('Audit Log'), 'ScrollText', '/audit'],
    [t('Benchmark'), 'ChartNoAxesCombined', '/benchmark'],
    [t('Settings'), 'Settings2', '/settings'],
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
            {['/investigations', '/approvals'].includes(href) && (
              <em className="nav-badge">{href === '/investigations' ? activeCount : approvalCount}</em>
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
  sidebarCollapsed,
  theme,
  onToggleTheme,
  lang,
  onSelectLang
}: {
  onSearch: (v: string) => void
  systemStatus: string
  onToggleSidebar: () => void
  sidebarCollapsed: boolean
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  lang: string
  onSelectLang: (lang: string) => void
}) {
  const { t } = useTranslation()
  return (
    <header className="topbar">
      <div className="mobile-brand" onClick={onToggleSidebar} style={{ cursor: 'pointer' }}>
        <div className="brand-mark">S</div>
        <strong>sentinel<span>ai</span></strong>
      </div>
      <div className="global-search">
        {icon('Search')}
        <input placeholder={t('Search case, investigation, customer, device...')} onChange={(e) => onSearch(e.target.value)} />
        <kbd>⌘ K</kbd>
      </div>
      <div className="top-actions">
        <LanguageSelector currentLang={lang} onSelectLang={onSelectLang} />
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={`Current: ${theme === 'dark' ? 'Dark' : 'Light'} Mode. Click to switch theme.`}
          aria-label="Toggle theme"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, cursor: 'pointer', flexShrink: 0 }}
        >
          {theme === 'dark' ? icon('Sun', { size: 16 }) : icon('Moon', { size: 16 })}
        </button>
        <div className="system">
          <span className="pulse" />
          <div>
            <strong>{t('AI Engine Online')}</strong>
            <small>{systemStatus || 'Operational Status: Normal'}</small>
          </div>
        </div>
      </div>
    </header>
  )
}

function MetricCards({ metrics }: { metrics: CaseMetrics | null }) {
  const { t } = useTranslation()
  const stats = [
    {
      label: t('ACTIVE INVESTIGATIONS'),
      value: metrics ? String(metrics.active_investigations) : '21',
      change: metrics?.active_change || '+100%',
      icon: 'Radar'
    },
    {
      label: t('AWAITING EVIDENCE'),
      value: metrics ? String(metrics.awaiting_evidence).padStart(2, '0') : '01',
      change: metrics?.awaiting_change || '1 require review',
      icon: 'FileSearch'
    },
    {
      label: t('PENDING APPROVALS'),
      value: metrics ? String(metrics.pending_approvals).padStart(2, '0') : '03',
      change: metrics?.pending_change || '3 in queue',
      icon: 'BadgeCheck'
    },
    {
      label: t('ESCALATIONS'),
      value: metrics ? String(metrics.escalations).padStart(2, '0') : '00',
      change: metrics?.escalations_change || '0 active',
      icon: 'ArrowUpRight'
    },
    {
      label: t('RESOLVED TODAY'),
      value: metrics ? String(metrics.resolved_today) : '0',
      change: metrics?.resolved_change || '+0%',
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
            <span style={{ color: s.change.includes('+') ? 'var(--green)' : s.change.includes('require') || s.change.includes('queue') ? 'var(--amber)' : 'var(--text-secondary)' }}>
              {s.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function InvestigationTable({ cases, compact = false }: { cases: CaseListItem[]; compact?: boolean }) {
  const router = useRouter()
  const { t } = useTranslation()
  const displayCases = compact ? cases.slice(0, 5) : cases.slice(0, 10)

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{t('Case')}</th>
            <th>{t('Trigger')}</th>
            <th>{t('Customer')}</th>
            <th>{t('Amount')}</th>
            <th>{t('Risk')}</th>
            <th>{t('Confidence')}</th>
            <th>{t('Evidence')}</th>
            <th>{t('Status')}</th>
            <th>{t('NBA')}</th>
            <th>{t('Updated')}</th>
          </tr>
        </thead>
        <tbody>
          {displayCases.map((row) => (
            <tr key={row.id} onClick={() => router.push('/investigations/' + row.id)}>
              <td>
                <strong className="notranslate" translate="no">{row.id}</strong>
                <small className="notranslate" translate="no">{row.transaction}</small>
              </td>
              <td>{row.trigger}</td>
              <td className="notranslate" translate="no">{row.customer}</td>
              <td className="notranslate" translate="no">${row.amount.toFixed(2)}</td>
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
              <td>{row.evidence} {t('items')}</td>
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
  const { t } = useTranslation()

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{t('OPERATIONS OVERVIEW')} · {getFormattedCurrentDate()}</div>
          <h1>{t('Sentinel — Fraud Operations')}</h1>
          <p>{t('Professional investigation, evidence and next-best-action.')}</p>
        </div>
        <Button onClick={() => router.push('/investigations/CASE-10293')}>
          <Icons.Plus data-icon="inline-start" /> {t('Start investigation')}
        </Button>
      </div>

      <MetricCards metrics={metrics} />

      <div className="content-grid dashboard-grid">
        <section className="panel span-2">
          <SectionTitle
            title={t('Priority Investigations')}
            action={
              <Button variant="ghost" size="sm" onClick={() => router.push('/investigations')} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                {t('View queue')} {icon('ChevronRight')}
              </Button>
            }
          />
          <InvestigationTable cases={cases} compact />
        </section>

        <section className="panel activity">
          <SectionTitle
            title={t('AI investigation activity')}
            action={<span className="live"><i /> {t('Live')}</span>}
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
                    <small><span className="notranslate" translate="no">{x.case_id}</span> · {x.result} · <span className="notranslate" translate="no">{x.timestamp}</span></small>
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
        <SectionTitle eyebrow={t('REVIEW QUEUE')} title={t('Priority cases')} />
        <div className="case-cards">
          {cases.slice(0, 3).map((c) => (
            <div className="case-card" key={c.id}>
              <div className="case-top">
                <Badge tone={c.risk > 85 ? 'red' : 'amber'}>Risk {c.risk}</Badge>
                <span>{c.updated}</span>
              </div>
              <strong className="notranslate" translate="no">{c.id}</strong>
              <p>{c.trigger}</p>
              <div className="case-meta">
                <span>{icon('FileText')} {c.evidence} {t('evidence')}</span>
                <span>{icon('Target')} {c.confidence}% {t('confidence')}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push('/investigations/' + c.id)}>
                {t('Open case')} {icon('ArrowUpRight')}
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
  const { t: translate } = useTranslation()
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
          <div className="eyebrow">{translate('INVESTIGATION QUEUE')}</div>
          <h1>{translate('Investigations')}</h1>
          <p>{translate('Monitor agent-led investigations and decision readiness across all benchmark cases.')}</p>
        </div>
        <Button onClick={() => router.push('/investigations/CASE-10293')}>
          <Icons.Plus data-icon="inline-start" /> {translate('Start investigation')}
        </Button>
      </div>

      <div className="toolbar">
        <div className="field-search">
          {icon('Search')}
          <input
            placeholder={translate('Search case, investigation, customer, device...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
          <option value="All">{translate('All')}</option>
          <option value="High">{translate('High')}</option>
        </select>
        <Button variant="outline">
          {icon('SlidersHorizontal')} {translate('Filters')}
        </Button>
      </div>

      <div className="tabs">
        {tabs.map((tItem) => (
          <button className={tab === tItem ? 'selected' : ''} key={tItem} onClick={() => setTab(tItem)}>
            {translate(tItem)}
            {tItem === 'Awaiting Approval' && (metrics?.pending_approvals ?? 0) > 0 && <b>{metrics?.pending_approvals}</b>}
            {tItem === 'Awaiting Evidence' && (metrics?.awaiting_evidence ?? 0) > 0 && <b>{metrics?.awaiting_evidence}</b>}
            {tItem === 'Active' && (metrics?.active_investigations ?? 0) > 0 && <b>{metrics?.active_investigations}</b>}
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
  const { t } = useTranslation()
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
          <div className="eyebrow">{t('CASE MANAGEMENT & DOSSIER PORTFOLIO')}</div>
          <h1>{t('Cases')}</h1>
          <p>{t('Comprehensive repository of fraud dossiers, suspicious activity reports (SAR), and enterprise risk outcomes.')}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" onClick={() => setSelectedSarCase(cases[0] || null)}>
            {icon('FileText')} {t('SAR Template')}
          </Button>
          <Button onClick={() => router.push('/investigations/CASE-10293')}>
            <Icons.Plus data-icon="inline-start" /> {t('New case filing')}
          </Button>
        </div>
      </div>

      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '20px' }}>
        <div className="metric-card">
          <div className="metric-icon">{icon('BriefcaseBusiness')}</div>
          <div>
            <small>{t('Total Dossiers')}</small>
            <strong>{cases.length}</strong>
            <span>{t('Active Enterprise Portfolio')}</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)' }}>{icon('ShieldAlert')}</div>
          <div>
            <small>{t('High Exposure / SAR')}</small>
            <strong style={{ color: 'var(--red)' }}>{highRiskCount}</strong>
            <span style={{ color: 'var(--red)' }}>{t('Critical Risk Threshold')}</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">{icon('DollarSign')}</div>
          <div>
            <small>{t('Prevented Exposure')}</small>
            <strong>${totalExposure.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
            <span>{t('Protected Value')}</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">{icon('Bot')}</div>
          <div>
            <small>{t('Graph Resolution')}</small>
            <strong>100%</strong>
            <span>{t('TigerGraph Grounded')}</span>
          </div>
        </div>
      </div>

      <div className="toolbar" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div className="field-search">
          {icon('Search')}
          <input
            placeholder={t('Search cases by ID, customer, transaction or typology...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={typologyFilter} onChange={(e) => setTypologyFilter(e.target.value)}>
          {typologies.map((item) => (
            <option key={item} value={item}>{t(item)}</option>
          ))}
        </select>
        <div style={{ display: 'flex', background: 'var(--surface-secondary)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            style={{
              padding: '6px 10px',
              border: 0,
              background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'grid' ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 500
            }}
          >
            {icon('LayoutGrid')} {t('Grid')}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            style={{
              padding: '6px 10px',
              border: 0,
              background: viewMode === 'table' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'table' ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 500
            }}
          >
            {icon('List')} {t('Table')}
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
            {t(s)}
            {s === 'SAR Recommended' && <b style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', border: '1px solid var(--danger-border)' }}>{highRiskCount}</b>}
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
                    <span className="dossier-typology">{t(typology)}</span>
                    <Badge tone={c.risk >= 75 ? 'red' : c.risk >= 60 ? 'amber' : 'green'}>
                      {t('Risk')} {c.risk}
                    </Badge>
                  </div>
                  <div className="dossier-body">
                    <h3 className="notranslate" translate="no">{c.id}</h3>
                    <p>{t('Trigger')}: {c.trigger}</p>
                    <div className="dossier-metrics">
                      <div>
                        <span>{t('Customer')}</span>
                        <strong className="notranslate" translate="no">{c.customer}</strong>
                      </div>
                      <div>
                        <span>{t('Amount')}</span>
                        <strong style={{ color: 'var(--amber)' }} className="notranslate" translate="no">${c.amount.toFixed(2)}</strong>
                      </div>
                      <div>
                        <span>{t('Evidence')}</span>
                        <strong>{c.evidence} {t('items')}</strong>
                      </div>
                      <div>
                        <span>{t('Confidence')}</span>
                        <strong>{c.confidence}%</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', fontSize: '10px', color: 'var(--muted)' }}>
                    <span>SAR {t('Status')}:</span>
                    <strong style={{ color: sarStatus === 'SAR Recommended' ? 'var(--red)' : '#ccd4e2' }}>
                      {t(sarStatus)}
                    </strong>
                  </div>
                  <div className="dossier-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ flex: 1, fontSize: '11px' }}
                      onClick={() => setSelectedSarCase(c)}
                    >
                      {icon('FileText')} SAR {t('File')}
                    </Button>
                    <Button
                      size="sm"
                      style={{ flex: 1.2, fontSize: '11px' }}
                      onClick={() => router.push('/investigations/' + c.id)}
                    >
                      {t('Open case')} {icon('ArrowUpRight')}
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
                  <th>{t('Case ID')}</th>
                  <th>{t('Typology')}</th>
                  <th>{t('Customer')}</th>
                  <th>{t('Amount')}</th>
                  <th>{t('Risk Score')}</th>
                  <th>{t('Confidence')}</th>
                  <th>{t('Evidence')}</th>
                  <th>{t('SAR Status')}</th>
                  <th>{t('NBA Recommendation')}</th>
                  <th>{t('Action')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((c) => (
                  <tr key={c.id} onClick={() => router.push('/investigations/' + c.id)}>
                    <td><strong className="notranslate" translate="no">{c.id}</strong><small>{c.updated}</small></td>
                    <td><span className="dossier-typology">{t(getCaseTypology(c))}</span></td>
                    <td className="notranslate" translate="no">{c.customer}</td>
                    <td><strong className="notranslate" translate="no">${c.amount.toFixed(2)}</strong></td>
                    <td><span className={`risk ${c.risk >= 75 ? 'risk-high' : c.risk >= 60 ? 'risk-med' : 'risk-low'}`}>{c.risk}</span></td>
                    <td>{c.confidence}%</td>
                    <td>{c.evidence} {t('items')}</td>
                    <td>
                      <Badge tone={getSarStatus(c) === 'SAR Recommended' ? 'red' : 'slate'}>
                        {t(getSarStatus(c))}
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
              <div>Case Identifier: <strong className="notranslate" translate="no">{selectedSarCase.id}</strong></div>
              <div>Subject Identity: <strong className="notranslate" translate="no">{selectedSarCase.customer}</strong></div>
              <div>Financial Exposure: <strong className="notranslate" translate="no">${selectedSarCase.amount.toFixed(2)} USD</strong></div>
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
  const { t } = useTranslation()
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
          <strong>{t('Relationship graph')}</strong>
          <small>{nodes.length} {t('entities')} · {edges.length} {t('relationships')}</small>
        </div>
        <div className="graph-tools">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">{t('All entities')}</option>
            <option value="Customers">{t('Customers')}</option>
            <option value="Devices">{t('Devices')}</option>
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
            {t(l)}
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
  const { t } = useTranslation()
  return (
    <div className={`evidence-card ${e.tone}`}>
      <div className="evidence-head">
        <Badge tone={e.tone === 'support' ? 'green' : e.tone === 'contradict' ? 'red' : 'slate'}>
          {e.tone === 'support' ? t('Supporting') : e.tone === 'contradict' ? t('Contradicting') : t('Contextual')}
        </Badge>
        <span className="notranslate" translate="no">{e.id}</span>
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
        <button onClick={onView}>{t('View in graph')}</button>
        <button onClick={onProvenance}>{t('Provenance')} {icon('ArrowUpRight')}</button>
      </div>
    </div>
  )
}

function InvestigationWorkspace({ caseId }: { caseId: string }) {
  const { t } = useTranslation()
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
          <div className="eyebrow">{t('INVESTIGATION WORKSPACE')}</div>
          <h1>
            <span className="notranslate" translate="no">{caseDetail.id}</span>{' '}
            <Badge tone={isAwaitingApproval ? 'amber' : requested ? 'red' : 'blue'}>
              {caseDetail.status.replace('_', ' ').toLowerCase()}
            </Badge>
          </h1>
          <div className="case-summary">
            <span>{t('Trigger')} <strong>{toTitleCase(caseDetail.trigger_type)}</strong></span>
            <span>{t('Customer')} <strong className="notranslate" translate="no">{caseDetail.customer_id}</strong></span>
            <span>{t('Transaction')} <strong className="notranslate" translate="no">{caseDetail.flagged_txn_id}</strong></span>
            <span>{t('Amount')} <strong className="notranslate" translate="no">${caseDetail.amount.toFixed(2)}</strong></span>
            <span>{t('Opened')} <strong className="notranslate" translate="no">{caseDetail.opened_at}</strong></span>
          </div>
        </div>
        <div className="case-actions">
          <Button variant="outline" size="sm" onClick={() => loadCase()}>
            {icon('RefreshCw')} {t('Refresh')}
          </Button>
        </div>
      </div>

      <div className="risk-strip">
        <div>
          <small>{t('RISK')}</small>
          <strong className={requested ? 'very-high' : ''}>
            {caseDetail.uncertainty.risk_level}{' '}
            <b>{caseDetail.uncertainty.risk_score}</b>
          </strong>
        </div>
        <div>
          <small>{t('CONFIDENCE')}</small>
          <strong>
            {caseDetail.uncertainty.confidence >= 85 ? 'HIGH' : 'MEDIUM'}{' '}
            <b>{caseDetail.uncertainty.confidence}%</b>
          </strong>
        </div>
        <div>
          <small>{t('EVIDENCE SUFFICIENCY')}</small>
          <Badge tone={caseDetail.uncertainty.evidence_sufficiency === 'SUFFICIENT' ? 'green' : 'amber'}>
            {caseDetail.uncertainty.evidence_sufficiency}
          </Badge>
        </div>
        <div className="agent-state">
          <span className="pulse violet" /> {t('Agent active')}{' '}
          <small>{caseDetail.timeline.length} {t('events')}</small>
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
            eyebrow={`${evidenceList.length} ${t('ITEMS · LIVE')}`}
            title={t('Evidence & findings')}
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
              {icon('Sparkles')} {t('Agent finding')} <span>{caseDetail.uncertainty.confidence}% {t('confidence')}</span>
            </div>
            <strong>{caseDetail.finding_headline}</strong>
            <p style={{ margin: '6px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>{caseDetail.finding_body}</p>
            <div className="finding-foot">
              {t('Pattern')} <b>{caseDetail.finding_pattern}</b> · {t('Policy')} <b>{caseDetail.finding_policy}</b>
            </div>
          </div>
        </section>
      </div>

      <section className="panel timeline-panel">
        <SectionTitle title={t('Agent activity')} action={<span className="live"><i /> {t('Live Stream')}</span>} />
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
          <SectionTitle eyebrow={t('DECISION READINESS')} title={t('Investigation uncertainty')} />
          <div className="certainty-grid">
            <div>
              <small>{t('Known')}</small>
              {caseDetail.uncertainty.known_signals.map((s) => (
                <p key={s}>✓ {s}</p>
              ))}
            </div>
            <div>
              <small>{t('Uncertain')}</small>
              {caseDetail.uncertainty.uncertain_signals.length > 0 ? (
                caseDetail.uncertainty.uncertain_signals.map((s) => <p key={s}>? {s}</p>)
              ) : (
                <p style={{ color: 'var(--green)' }}>✓ {t('All key uncertainties resolved')}</p>
              )}
            </div>
          </div>
          <div className="meter-label">
            <span>{t('Confidence meter')}</span>
            <strong>{caseDetail.uncertainty.confidence}%</strong>
          </div>
          <div className="meter">
            <span style={{ width: `${caseDetail.uncertainty.confidence}%` }} />
          </div>
          <div className="callout">
            {requested ? t('Evidence now supports definitive intervention.') : t('Why we are not acting yet')}
            <small>{caseDetail.uncertainty.why_not_acting}</small>
          </div>
        </section>

        <section className="panel next-action">
          <SectionTitle
            eyebrow={t('RECOMMENDED NEXT-BEST-ACTION')}
            title={toTitleCase(caseDetail.recommendation.current_recommended_action)}
            action={
              <Badge tone={caseDetail.recommendation.approval_required ? 'red' : 'amber'}>
                {caseDetail.recommendation.approval_required ? t('Approval required') : t('Allowed')}
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
            <span>{t('Policy')} <strong>{caseDetail.recommendation.policy_rule}</strong></span>
            <span>{t('Required role')} <strong>{caseDetail.recommendation.required_role}</strong></span>
          </div>
          <div className="action-buttons">
            {requested ? (
              <>
                <Button variant="outline" onClick={() => setDrawer('provenance')}>
                  {t('View evidence')}
                </Button>
                <Button onClick={() => setDrawer('approval')}>
                  {isAwaitingApproval ? t('Awaiting supervisor approval') : t('Request approval')}{' '}
                  {icon('ArrowRight')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setDrawer('why')}>
                  {t('Why this evidence?')}
                </Button>
                <Button onClick={handleRequestEvidence} disabled={isRequestingEvidence}>
                  {isRequestingEvidence ? t('Requesting validation...') : t('Request customer evidence')}{' '}
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
                <div className="eyebrow">{t('APPROVAL REQUEST')}</div>
                <h2>{t('Send for supervisor approval?')}</h2>
                <p>
                  Escalate {caseDetail.id} to a {caseDetail.recommendation.required_role} under {caseDetail.recommendation.policy_rule}.
                </p>
                <div className="approval-summary">
                  <span>{t('Risk')} <strong>{caseDetail.uncertainty.risk_level} · {caseDetail.uncertainty.risk_score}</strong></span>
                  <span>{t('Confidence')} <strong>{caseDetail.uncertainty.confidence}%</strong></span>
                  <span>{t('Exposure')} <strong>${caseDetail.exposure_usd.toFixed(2)} USD</strong></span>
                  <span>{t('Action')} <strong>{caseDetail.recommendation.current_recommended_action}</strong></span>
                </div>
                <Button onClick={handleSendApproval} disabled={isSubmittingApproval}>
                  {isSubmittingApproval ? t('Submitting...') : t('Send for approval')} {icon('ArrowRight')}
                </Button>
              </>
            ) : (
              <>
                <div className="eyebrow">
                  {drawer === 'provenance' ? t('TRACEABILITY') : t('EVIDENCE PLANNER')}
                </div>
                <h2>{drawer === 'provenance' ? t('Evidence provenance') : t('Why this evidence?')}</h2>
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
  const { t } = useTranslation()

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
          <div className="eyebrow">{t('HUMAN-IN-THE-LOOP CONTROL')}</div>
          <h1>{t('Pending Approvals')}</h1>
          <p>{t('Review policy-constrained actions requiring supervisor or lead authorization.')}</p>
        </div>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('Approval ID')}</th>
                <th>{t('Case')}</th>
                <th>{t('Action')}</th>
                <th>{t('Route')}</th>
                <th>{t('Risk')}</th>
                <th>{t('Confidence')}</th>
                <th>{t('Exposure')}</th>
                <th>{t('Status')}</th>
                <th>{t('Decision')}</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((a) => (
                <tr key={a.id}>
                  <td><strong className="notranslate" translate="no">{a.id}</strong><small className="notranslate" translate="no">{a.created_at}</small></td>
                  <td><strong className="notranslate" translate="no">{a.case_id}</strong></td>
                  <td><Badge tone="violet">{a.action}</Badge></td>
                  <td><Badge tone={a.route === 'L2' ? 'red' : 'amber'}>{a.route}</Badge></td>
                  <td><span className="risk risk-high">{a.risk}</span></td>
                  <td>{a.confidence}%</td>
                  <td className="notranslate" translate="no">${a.exposure_usd.toFixed(2)}</td>
                  <td>
                    <Badge tone={a.status === 'APPROVED' ? 'green' : a.status === 'REJECTED' ? 'red' : 'amber'}>
                      {a.status}
                    </Badge>
                  </td>
                  <td>
                    {a.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Button size="sm" onClick={() => handleApprove(a.id)}>{t('Approve')}</Button>
                        <Button variant="outline" size="sm" onClick={() => handleReject(a.id)}>{t('Reject')}</Button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--muted)', fontSize: '11px' }}>{t('Executed')}</span>
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
  const { t } = useTranslation()

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
          <div className="eyebrow">{t('GRAPH-INDEXED MEMORY')} (5,565 CASES)</div>
          <h1>{t('Case Memory')}</h1>
          <p>{t('Historical investigation context for better decisions, retrieved from TigerGraph closed cases.')}</p>
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
            <h3 className="notranslate" translate="no">{c.id}</h3>
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
              Historical exposure: <strong className="notranslate" translate="no">${c.exposure_usd.toFixed(2)}</strong>
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
  const { t } = useTranslation()

  useEffect(() => {
    api.getAuditEvents().then(setEvents).catch(console.error)
  }, [])

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{t('COMPLIANCE & TRACEABILITY')}</div>
          <h1>{t('Audit Log')}</h1>
          <p>{t('Operational event stream across AI agents, tools, policies and human supervisors.')}</p>
        </div>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('Timestamp')}</th>
                <th>{t('Case ID')}</th>
                <th>{t('Actor')}</th>
                <th>{t('Event')}</th>
                <th>{t('Tool / Action')}</th>
                <th>{t('Outcome / Result')}</th>
              </tr>
            </thead>
            <tbody>
              {events.map((r, i) => (
                <tr key={r.timestamp + i}>
                  <td className="notranslate" translate="no"><strong>{r.timestamp}</strong></td>
                  <td className="notranslate" translate="no"><strong>{r.case_id}</strong></td>
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
  const { t } = useTranslation()

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
          <div className="eyebrow">{t('HHGOA BENCHMARK HARNESS (20 EXAM CASES)')}</div>
          <h1>{t('Benchmark Evaluation')}</h1>
          <p>{t('Execute the investigation agent against the 20 official HHGOA exam cases.')}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={handleRunAll} disabled={isRunning}>
            {isRunning ? 'Evaluating cases...' : t('Run All 20 Cases')} {icon('Play')}
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
                <th>{t('Case')}</th>
                <th>{t('Trigger')}</th>
                <th>{t('Flagged Txn')}</th>
                <th>{t('Card')}</th>
                <th>{t('Amount')}</th>
                <th>{t('Verdict')}</th>
                <th>{t('Probability')}</th>
                <th>{t('Pattern')}</th>
                <th>{t('SAR')}</th>
                <th>{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.case_id}>
                  <td><strong className="notranslate" translate="no">{c.case_id}</strong><small className="notranslate" translate="no">{c.opened_at}</small></td>
                  <td>{c.trigger_type}</td>
                  <td className="notranslate" translate="no">{c.flagged_txn_id}</td>
                  <td className="notranslate" translate="no">{c.card_id}</td>
                  <td className="notranslate" translate="no">${c.amount.toFixed(2)}</td>
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
  const { t } = useTranslation()

  useEffect(() => {
    api.getHealth().then(setHealth).catch(console.error)
  }, [])

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{t('SYSTEM & INTEGRATION STATUS')}</div>
          <h1>{t('Settings & Environment')}</h1>
          <p>{t('Connectivity, TigerGraph MCP tools, and agent execution parameters.')}</p>
        </div>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="panel" style={{ padding: '20px' }}>
          <SectionTitle title="Backend Connection" />
          <p>FastAPI connection status: <Badge tone="green">{health?.status ? toTitleCase(health.status) : 'Online'}</Badge></p>
          <p>Environment: <strong className="notranslate" translate="no">{health?.environment ? toTitleCase(health.environment) : 'Development'} (Port {health?.port || 8001})</strong></p>
          <p>Workflow Engine: <strong>{health?.workflow || '10-Stage Decision State Machine'}</strong></p>
          <p>API Base URL: <strong className="notranslate" translate="no">{process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'}</strong></p>
        </div>

        <div className="panel" style={{ padding: '20px' }}>
          <SectionTitle title="TigerGraph &amp; MCP Integration" />
          <p>Graph Storage: <Badge tone="green">{health?.tigergraph ? toTitleCase(health.tigergraph) : 'Connected'}</Badge></p>
          <p>Target Graph: <strong className="notranslate" translate="no">{health?.tigergraph_graph || 'FraudGraph'} ({health?.tigergraph_host || 'http://localhost:9000'})</strong></p>
          <p>Entities Indexed: <strong className="notranslate" translate="no">{health?.entities_indexed ? health.entities_indexed.toLocaleString() : '735,174'} (IEEE-CIS Dataset)</strong></p>
          <p>MCP Investigation Tools: <strong>{health?.mcp_tools_count || 5} Logical Tools Active</strong></p>
        </div>
      </div>
    </>
  )
}

export default function SentinelApp() {
  const path = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [search, setSearch] = useState('')
  const [cases, setCases] = useState<CaseListItem[]>([])
  const [metrics, setMetrics] = useState<CaseMetrics | null>(null)
  const [auditEvents, setAuditEvents] = useState<AuditLogItem[]>([])
  const [systemStatus, setSystemStatus] = useState('TigerGraph · Connected')
  const [graphCaseId, setGraphCaseId] = useState('CASE-10293')
  const [lang, setLang] = useState<string>('en')

  // Theme initialization from localStorage (defaults to light mode)
  useEffect(() => {
    const saved = localStorage.getItem('sentinel_theme') as 'light' | 'dark' | null
    const initialTheme = saved === 'dark' ? 'dark' : 'light'
    setTheme(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Language initialization from localStorage + Google Translate
  useEffect(() => {
    const savedLang = localStorage.getItem('sentinel_lang') || 'en'
    if (savedLang !== 'en') {
      setLang(savedLang)
    }
    initGoogleTranslate()
    if (savedLang !== 'en') {
      setGoogleTranslateLanguage(savedLang)
    }
  }, [])

  const handleSelectLang = (newLang: string) => {
    setLang(newLang)
    localStorage.setItem('sentinel_lang', newLang)
    setGoogleTranslateLanguage(newLang)
  }

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.setItem('sentinel_theme', nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

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
  const translateFn = (keyOrPhrase: string) => t(keyOrPhrase, lang)

  return (
    <TranslationContext.Provider value={{ lang, setLang: handleSelectLang, t: translateFn }}>
      <div className="app-shell">
        <div id="google_translate_element" style={{ display: 'none' }} />
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} metrics={metrics} />
        <div className="main-shell">
          <Header
            onSearch={setSearch}
            systemStatus={systemStatus}
            onToggleSidebar={() => setCollapsed(!collapsed)}
            sidebarCollapsed={collapsed}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            lang={lang}
            onSelectLang={handleSelectLang}
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
                    <div className="eyebrow">{t('GRAPH EXPLORER', lang)}</div>
                    <h1>{t('Enterprise Graph Visualizer', lang)}</h1>
                    <p>{t('Interactive graph topology of entities, devices, and transaction chains.', lang)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <small style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Active Case:</small>
                    <select
                      value={graphCaseId}
                      onChange={(e) => setGraphCaseId(e.target.value)}
                      style={{ padding: '6px 12px', background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }}
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
        <div className="analyst-floating-badge" title="Sentinel Fraud Operations Analyst">
          N
        </div>
      </div>
    </TranslationContext.Provider>
  )
}
