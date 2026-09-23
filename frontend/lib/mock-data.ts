export const investigations = [
  { id: 'CASE-10293', trigger: 'High-risk transaction', customer: 'C-123', transaction: 'TXN-10293', risk: 87, confidence: 62, status: 'Evidence Required', nba: 'Customer validation', evidence: 7, updated: '2m ago' },
  { id: 'CASE-1047', trigger: 'Customer report', customer: 'C-88421', transaction: 'TXN-88421', risk: 94, confidence: 91, status: 'Awaiting Approval', nba: 'Escalate', evidence: 12, updated: '8m ago' },
  { id: 'CASE-1043', trigger: 'Fraud signal', customer: 'C-19203', transaction: 'TXN-19203', risk: 73, confidence: 84, status: 'Investigating', nba: 'Monitor', evidence: 5, updated: '14m ago' },
  { id: 'CASE-1039', trigger: 'Velocity anomaly', customer: 'C-66312', transaction: 'TXN-66312', risk: 68, confidence: 77, status: 'Investigating', nba: 'Review device', evidence: 4, updated: '22m ago' },
  { id: 'CASE-1031', trigger: 'Account takeover', customer: 'C-44109', transaction: 'TXN-44109', risk: 52, confidence: 89, status: 'Resolved', nba: 'Clear', evidence: 9, updated: '1h ago' },
]

export const evidence = [
  { id: 'E-004', type: 'Supporting Evidence', title: 'Shared device relationship', description: 'Customer C-123 and C-811 both use Device D-77.', source: 'TigerGraph · relationship query', strength: 'Strong', tone: 'support', entities: 'C-123 → D-77 → C-811', pattern: 'FP-03', time: '10:03' },
  { id: 'E-007', type: 'Supporting Evidence', title: 'Historical fraud connection', description: 'C-811 is associated with a previous confirmed fraud case.', source: 'Case memory · CASE-103', strength: 'Strong', tone: 'support', entities: 'C-811 → CASE-103', pattern: 'FP-03', time: '10:04' },
  { id: 'E-009', type: 'Contradicting Evidence', title: 'Known device history', description: 'Customer historically used this device legitimately.', source: 'Customer history', strength: 'Moderate', tone: 'contradict', entities: 'C-123 → D-77', pattern: 'Context', time: '10:04' },
  { id: 'E-011', type: 'Contextual Evidence', title: 'Transaction timing anomaly', description: 'Transaction occurred outside the customer’s normal spending period.', source: 'Transaction context', strength: 'Moderate', tone: 'context', entities: 'TXN-10293', pattern: 'FP-07', time: '10:02' },
]

export const timeline = [
  ['10:01', 'Investigation triggered', 'completed'], ['10:01', 'Case created', 'completed'], ['10:02', 'Transaction context retrieved', 'completed'], ['10:02', 'Customer history analyzed', 'completed'], ['10:03', 'Shared device discovered', 'completed'], ['10:04', 'Fraud pattern matched', 'completed'], ['10:04', 'Evidence insufficient', 'warning'], ['10:05', 'Customer validation requested', 'waiting'],
]

export const navItems = [
  ['Dashboard', 'LayoutDashboard', '/dashboard'], ['Investigations', 'Radar', '/investigations'], ['Cases', 'BriefcaseBusiness', '/cases'], ['Graph Explorer', 'Share2', '/graph'], ['Approvals', 'BadgeCheck', '/approvals'], ['Case Memory', 'Library', '/memory'], ['Audit Log', 'ScrollText', '/audit'], ['Benchmark', 'ChartNoAxesCombined', '/benchmark'], ['Settings', 'Settings2', '/settings'],
]

export const memoryCases = [
  { id: 'CASE-103', similarity: 91, outcome: 'Confirmed Fraud', shared: ['Device relationship', 'Merchant cluster', 'Temporal sequence'] },
  { id: 'CASE-087', similarity: 76, outcome: 'Cleared', shared: ['Device', 'Customer behavior'] },
  { id: 'CASE-091', similarity: 68, outcome: 'Confirmed Fraud', shared: ['Transaction velocity', 'IP connection'] },
]

export const auditEvents = [
  ['10:07:14', 'CASE-10293', 'Agent', 'Action', 'Executed', 'Escalation submitted'], ['10:06:41', 'CASE-10293', 'Supervisor', 'Approval', 'Approved', 'Policy-4.2'], ['10:05:08', 'CASE-10293', 'Agent', 'Evidence request', 'Sent', 'Customer validation'], ['10:04:19', 'CASE-10293', 'Agent', 'Graph query', 'Evidence found', 'find_prior_cases'], ['10:02:44', 'CASE-10293', 'Agent', 'Policy check', 'Allowed', 'Policy-4.2'],
]

export const graphNodes = [
  { id: 'C-123', label: 'Customer', sub: 'C-123', x: 20, y: 48, kind: 'customer' }, { id: 'A-223', label: 'Account', sub: 'A-223', x: 43, y: 20, kind: 'account' }, { id: 'D-77', label: 'Device', sub: 'D-77', x: 46, y: 74, kind: 'device' }, { id: 'TXN-10293', label: 'Transaction', sub: 'TXN-10293', x: 68, y: 46, kind: 'transaction' }, { id: 'C-811', label: 'Customer', sub: 'C-811', x: 72, y: 80, kind: 'customer' }, { id: 'M-42', label: 'Merchant', sub: 'M-42', x: 90, y: 42, kind: 'merchant' }, { id: 'CASE-103', label: 'Case', sub: 'CASE-103', x: 90, y: 78, kind: 'case' },
]

export const graphEdges = [['C-123', 'A-223'], ['C-123', 'D-77'], ['C-123', 'TXN-10293'], ['D-77', 'C-811'], ['TXN-10293', 'M-42'], ['C-811', 'CASE-103']]

export const stats = [{ label: 'Active investigations', value: '24', change: '+8.4%', icon: 'Radar' }, { label: 'Awaiting evidence', value: '08', change: '3 urgent', icon: 'FileSearch' }, { label: 'Pending approvals', value: '03', change: 'Supervisor', icon: 'BadgeCheck' }, { label: 'Escalations', value: '06', change: 'This week', icon: 'ArrowUpRight' }, { label: 'Resolved today', value: '17', change: '+12.1%', icon: 'CircleCheck' }]
