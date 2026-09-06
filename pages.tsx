import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDown,
  BadgeCheck,
  Check,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  FolderPlus,
  Gavel,
  Info,
  X,
  Upload,
} from "lucide-react";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  auditEvents,
  bidders,
  evidenceRecord,
  findings,
  requirements,
  sourceCards,
  tenders,
  type ComplianceStatus,
  type RiskLevel,
} from "./data/mockData";
import {
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  CompactMetric,
  ConfidenceIndicator,
  DataTable,
  EmptyState,
  FilterPill,
  MetricCard,
  PageHeader,
  RiskBadge,
  SearchInput,
  StatusBadge,
  VerificationSourceBadge,
} from "./components/ui";
import EvidenceDrawer from "./components/EvidenceDrawer";

const chartData = [
  { name: "Verified", value: 78, color: "#1f8a5b" },
  { name: "Pending", value: 12, color: "#b7791f" },
  { name: "Conflict", value: 6, color: "#b42318" },
  { name: "Officer Review", value: 4, color: "#5b5fc7" },
];

function Th({ children }: { children: React.ReactNode }) {
  return <th className="bg-surface px-4 py-3 text-left text-xs font-semibold uppercase tracking-normal text-muted">{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-t border-line px-4 py-3 text-sm text-slate-700 ${className}`}>{children}</td>;
}

export function LoginPage() {
  return (
    <main className="grid min-h-screen bg-surface lg:grid-cols-[1.1fr_0.9fr]">
      <section className="flex flex-col justify-center border-r border-line bg-white px-8 py-12 lg:px-20">
        <div className="mb-12 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-navy text-white">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-bold text-ink">PROCURE-AI</p>
            <p className="text-sm text-muted">From Tender PDF to Audit-Ready Compliance</p>
          </div>
        </div>
        <h1 className="max-w-xl text-4xl font-semibold leading-tight text-ink">Confident procurement decisions, backed by evidence.</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted">
          Verify tender requirements, bidder documents and government records in one auditable workspace.
        </p>
        <div className="mt-8 grid gap-3 text-sm font-medium text-slate-700">
          {["Evidence-backed verification", "Tender-specific compliance rules", "Human-controlled final decisions"].map((item) => (
            <span key={item} className="flex items-center gap-3">
              <Check className="h-5 w-5 text-verified" /> {item}
            </span>
          ))}
        </div>
      </section>
      <section className="flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-ink">Sign in</h2>
          <p className="mt-1 text-sm text-muted">Secure enterprise access</p>
          <div className="mt-6 space-y-4">
            <label><span className="label">Official email</span><input className="field" defaultValue="officer.cpcl@gov.in" /></label>
            <label><span className="label">Password</span><input className="field" type="password" defaultValue="procure-ai-demo" /></label>
            <Link to="/dashboard"><Button className="w-full">Sign in</Button></Link>
          </div>
        </Card>
      </section>
    </main>
  );
}

export function DashboardPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
      <Breadcrumbs items={["Home", "Dashboard"]} />
      <PageHeader
        title="Good morning, Officer."
        description="Here’s what needs your attention today. Review findings with their supporting evidence before making a procurement decision."
        actions={<Link to="/tenders/new"><Button><FolderPlus className="h-4 w-4" /> Create Tender</Button></Link>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Active Tenders" value={12} note="3 updated since yesterday" href="/tenders" />
        <MetricCard label="Under Review" value={4} note="Awaiting officer action" href="/review" />
        <MetricCard label="Pending Verification" value={17} note="GST, EPFO and DPIIT checks pending" href="/bidders/shakti/documents" />
        <MetricCard label="High Risk" value={2} note="Open conflicts before final decision" href="/bidders/shakti/risk" />
        <MetricCard label="Completed This Month" value={28} note="Audit-ready records generated" href="/reports" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.75fr]">
        <ReviewQueue onOpenEvidence={() => setDrawerOpen(true)} />
        <ComplianceOverview />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <TenderActivity />
        <VerificationHealth />
      </div>
      <EvidenceDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

function ReviewQueue({ onOpenEvidence }: { onOpenEvidence: () => void }) {
  return (
    <Card>
      <CardHeader
        title="Today's Review Queue"
        subtitle="You have 4 findings waiting for review. Everything else is currently up to date."
      />
      <DataTable>
        <table className="w-full min-w-[940px]">
          <thead><tr><Th>Risk</Th><Th>Bidder</Th><Th>Tender</Th><Th>Finding</Th><Th>Evidence</Th><Th>Last checked</Th><Th>Action</Th></tr></thead>
          <tbody>
            {findings.map((finding) => (
              <tr key={finding.id} className="transition duration-200 hover:bg-surface/80">
                <Td><RiskBadge risk={finding.severity} /></Td>
                <Td className="font-semibold text-ink">{finding.bidder}</Td>
                <Td>{finding.tender}</Td>
                <Td>{finding.issue}</Td>
                <Td><span className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-semibold">{finding.title.includes("BIS") ? "BIS Certificate" : finding.title.includes("GST") ? "GST verification" : "Identity records"}</span></Td>
                <Td>{finding.checked}</Td>
                <Td>
                  <Button variant="secondary" onClick={onOpenEvidence}>
                    <Eye className="h-4 w-4" /> Review Evidence
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </Card>
  );
}

function ComplianceOverview() {
  return (
    <Card>
      <CardHeader title="Compliance Overview" subtitle="Across active tender evaluations." />
      <div className="h-64 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" innerRadius={58} outerRadius={88} paddingAngle={2}>
              {chartData.map((entry) => <Cell key={entry.name} fill={entry.color} className="cursor-pointer outline-none transition-opacity hover:opacity-80" />)}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-line p-4">
        {chartData.map((item, index) => (
          <button key={item.name} className="rounded-md border border-line bg-white p-3 text-left transition duration-200 hover:border-action/40 hover:bg-surface">
            <p className="text-xs font-semibold text-muted">{item.name}</p>
            <p className="mt-1 text-lg font-semibold text-ink">{[18, 3, 2, 1][index]} · {item.value}%</p>
          </button>
        ))}
      </div>
    </Card>
  );
}

function TenderActivity() {
  return (
    <Card>
      <CardHeader title="Tender Activity" subtitle="Recent CPCL procurement workspaces." />
      <DataTable>
        <table className="w-full min-w-[840px]">
          <thead><tr><Th>Tender ID</Th><Th>Title</Th><Th>Bidders</Th><Th>Compliance</Th><Th>Risk</Th><Th>Last Updated</Th><Th>Status</Th></tr></thead>
          <tbody>
            {tenders.map((tender) => (
              <tr key={tender.id} className="hover:bg-surface/70">
                <Td className="font-medium text-ink">{tender.id}</Td><Td>{tender.title}</Td><Td>{tender.bidders}</Td><Td>{tender.compliance}%</Td><Td><RiskBadge risk={tender.risk} /></Td><Td>{tender.updated}</Td><Td>{tender.status}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </Card>
  );
}

function VerificationHealth() {
  return (
    <Card>
      <CardHeader title="Verification Health" subtitle="No live API access is claimed in this prototype." />
      <div className="grid gap-3 p-5 xl:grid-cols-2 lg:grid-cols-1 md:grid-cols-2">
        {sourceCards.map(([name, status, time, method, tier]) => (
          <div key={name} className="relative overflow-hidden rounded-md border border-line bg-white p-4 transition-all duration-200 hover:border-action/30 hover:shadow-soft">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ background: status === 'VERIFIED' ? '#1f8a5b' : status === 'PENDING' ? '#b7791f' : '#b42318' }} />
            <div className="flex items-center justify-between gap-2 pl-2"><p className="font-semibold text-ink">{name}</p><StatusBadge status={status as ComplianceStatus} /></div>
            <div className="pl-2">
              <p className="mt-3 text-xs font-medium text-slate-700">Verification: {method}</p>
              <p className="mt-1 text-xs text-muted">Last checked: {time}</p>
            </div>
            {method.includes("Mock verification") && (
              <p className="absolute bottom-2 right-2 text-[10px] uppercase font-bold text-slate-300 opacity-60">Mock</p>
            )}
            {method.includes("simulated") && (
              <p className="absolute bottom-2 right-2 text-[10px] uppercase font-bold text-slate-300 opacity-60">Simulated</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function TendersPage() {
  return (
    <>
      <Breadcrumbs items={["Home", "Tenders"]} />
      <PageHeader title="Tenders" description="Search, filter and open tender compliance workspaces." actions={<Link to="/tenders/new"><Button>+ Create Tender</Button></Link>} />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput placeholder="Search by Tender ID or title" />
        <div className="flex flex-wrap gap-2"><FilterPill active>Active</FilterPill><FilterPill>Under Review</FilterPill><FilterPill>Completed</FilterPill><FilterPill>High Risk</FilterPill></div>
      </div>
      <DataTable>
        <table className="w-full min-w-[980px]">
          <thead><tr><Th>Tender ID</Th><Th>Title</Th><Th>Procurement Type</Th><Th>Created</Th><Th>Bidders</Th><Th>Requirements</Th><Th>Compliance</Th><Th>Risk</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {tenders.map((t) => <tr key={t.id} className="hover:bg-surface/70"><Td className="font-medium text-ink">{t.id}</Td><Td>{t.title}</Td><Td>{t.type}</Td><Td>{t.created}</Td><Td>{t.bidders}</Td><Td>{t.requirements}</Td><Td>{t.compliance}%</Td><Td><RiskBadge risk={t.risk} /></Td><Td>{t.status}</Td><Td><Link className="font-semibold text-action" to="/tenders/GEM-2026-B-CPCL-1041">Open</Link></Td></tr>)}
          </tbody>
        </table>
      </DataTable>
    </>
  );
}

export function NewTenderPage() {
  const docs = ["GeM Bid", "GTC", "STC", "ATC", "Technical Specifications", "Corrigenda", "Annexures"];
  return (
    <>
      <Breadcrumbs items={["Tenders", "Create Tender"]} />
      <PageHeader title="Create Tender" description="Set up the tender context, upload documents, then analyze requirements for officer review." />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-5">
          <h2 className="font-semibold text-ink">Step 1: Tender Information</h2>
          <div className="mt-4 grid gap-4">
            {["Tender ID", "Tender Title", "Procurement Type", "Tender Date", "Department / CPCL Context"].map((field) => <label key={field}><span className="label">{field}</span><input className="field" defaultValue={field === "Tender ID" ? "GEM/2026/B/CPCL/1041" : ""} /></label>)}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold text-ink">Step 2: Upload Documents</h2>
          <div className="mt-4 rounded-lg border-2 border-dashed border-line bg-surface p-8 text-center">
            <Upload className="mx-auto h-9 w-9 text-action" />
            <p className="mt-3 font-semibold text-ink">Drop GeM tender documents here</p>
            <p className="mt-1 text-sm text-muted">Documents ready for analysis after upload.</p>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {docs.map((doc) => <div key={doc} className="flex items-center gap-2 rounded-md border border-line bg-white p-3 text-sm"><FileText className="h-4 w-4 text-muted" />{doc}</div>)}
          </div>
          <Link to="/tenders/GEM-2026-B-CPCL-1041"><Button className="mt-5">Analyze Tender</Button></Link>
        </Card>
      </div>
    </>
  );
}

export function TenderAnalysisPage() {
  const [activeTab, setActiveTab] = useState("Requirements");
  const tabs = ["Overview", "Requirements", "Bidders", "Verification", "Compliance", "Risk", "Audit"];

  return (
    <>
      <Breadcrumbs items={["Tenders", "GEM/2026/B/CPCL/1041", "Analysis"]} />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">GEM/2026/B/CPCL/1041</h1>
        <p className="mt-1 text-sm text-muted">Industrial Valves Procurement <span className="mx-2">•</span> <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> Under Review</span></p>
      </div>

      <div className="grid gap-4 md:grid-cols-6 mb-6">
        <CompactMetric label="Bidders" value="8" />
        <CompactMetric label="Requirements" value="24" />
        <CompactMetric label="Verified" value="18" tone="green" />
        <CompactMetric label="Conflicts" value="2" tone="red" />
        <CompactMetric label="Pending" value="2" tone="amber" />
        <CompactMetric label="Risk" value="Medium" tone="amber" />
      </div>

      <div className="border-b border-line mb-6 overflow-x-auto">
        <nav className="flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? "border-action text-action"
                  : "border-transparent text-slate-500 hover:text-ink hover:border-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "Requirements" ? (
        <RequirementsPage embedded />
      ) : activeTab === "Overview" ? (
        <div className="grid gap-6">
          <Card className="p-5">
            <h2 className="font-semibold text-ink mb-4">Tender Processing Status</h2>
            <div className="grid gap-3 md:grid-cols-6">
              {["Document uploaded", "OCR", "Requirement extraction", "Clause mapping", "Rule mapping", "Evidence requirements"].map((step) => 
                <div key={step} className="rounded-md border border-line bg-surface p-3 text-sm font-medium text-slate-700 flex items-center justify-center text-center flex-col gap-2">
                  <Check className="h-5 w-5 text-verified" />
                  {step}
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : activeTab === "Bidders" ? (
        <BiddersTable />
      ) : (
        <EmptyState title={`${activeTab} view`} text="Tab content matches other views." />
      )}
    </>
  );
}

export function RequirementsPage({ embedded = false }: { embedded?: boolean }) {
  const [selectedReq, setSelectedReq] = useState<readonly string[]>(requirements[0]);

  return (
    <div className={embedded ? "" : "mt-6"}>
      {!embedded && <><Breadcrumbs items={["Tenders", "Requirements"]} /><PageHeader title="Requirements" description="Every extracted requirement is tied to a source clause, rule, evidence need and verification source." /></>}
      
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <DataTable>
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <Th>Requirement</Th>
                <Th>Type</Th>
                <Th>Evidence Required</Th>
                <Th>Source</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {requirements.slice(0, embedded ? 24 : requirements.length).map((req) => (
                <tr 
                  key={req[0]} 
                  onClick={() => setSelectedReq(req)} 
                  className={`cursor-pointer transition-colors ${selectedReq[0] === req[0] ? 'bg-action/5 border-l-2 border-action' : 'hover:bg-surface/70 border-l-2 border-transparent'}`}
                >
                  <Td className="font-medium text-ink">{req[1]}</Td>
                  <Td><span className="text-xs font-semibold uppercase tracking-wider text-muted">{req[2]}</span></Td>
                  <Td>{req[5]}</Td>
                  <Td>{req[6]}</Td>
                  <Td><StatusBadge status={req[7] as ComplianceStatus} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>

        {/* Side Panel for Requirement Details */}
        <Card className="h-fit sticky top-24 bg-surface/30">
          <div className="p-4 border-b border-line bg-white">
            <p className="text-xs font-semibold text-muted mb-1">{selectedReq[0]} - {selectedReq[2]}</p>
            <h3 className="font-semibold text-ink text-lg leading-snug">{selectedReq[1]}</h3>
          </div>
          <div className="p-5 space-y-5 bg-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Rule</p>
              <p className="text-sm text-ink">{selectedReq[4]}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Tender Clause</p>
                <p className="text-sm font-medium">{selectedReq[3]}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Source</p>
                <p className="text-sm font-medium">{selectedReq[6]}</p>
              </div>
            </div>
            <div className="border-t border-line pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Evidence Required</p>
              <div className="flex items-center gap-2 text-sm font-medium text-action bg-blue-50 p-2 rounded-md border border-blue-100">
                <FileText className="h-4 w-4" /> {selectedReq[5]}
              </div>
            </div>
            <div className="border-t border-line pt-4">
               <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Current Status</p>
               <StatusBadge status={selectedReq[7] as ComplianceStatus} />
               {selectedReq[7] === 'OFFICER REVIEW' && (
                 <p className="text-xs text-review font-medium mt-2 p-2 bg-review/5 rounded border border-review/10">
                    Confidence: 94% — Finding requires human review.
                 </p>
               )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="rounded-md bg-surface p-3"><p className="text-xs font-semibold uppercase tracking-normal text-muted">{label}</p><p className="mt-1 text-sm text-slate-800">{value}</p></div>;
}

export function BidderProfilePage() {
  const bidder = bidders[0];
  
  const identifyMatchStages = [
    { source: "PAN Data", target: "GST Network", conf: 99, status: "matched" },
    { source: "GST Network", target: "Udyam Registry", conf: 97, status: "matched" },
    { source: "Udyam Registry", target: "MCA Records", conf: 85, status: "mismatch" },
    { source: "MCA Records", target: "GeM Profile", conf: 95, status: "matched" },
  ];

  return (
    <>
      <Breadcrumbs items={["Bidders", bidder.name]} />
      <PageHeader title={bidder.name} description="Bidder identity resolution and entity profile." actions={<StatusBadge status={bidder.status} />} />
      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Card className="p-5">
          <h2 className="font-semibold text-ink">Entity Information</h2>
          <div className="mt-4 grid gap-4 grid-cols-2">
            <div className="col-span-2"><Meta label="Legal Name" value={bidder.name} /></div>
            <Meta label="PAN" value={bidder.pan} />
            <Meta label="GSTIN" value={bidder.gstin} />
            <Meta label="CIN" value={bidder.cin} />
            <Meta label="Udyam" value={bidder.udyam} />
            <Meta label="GeM Seller ID" value={bidder.sellerId} />
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold text-ink mb-1">Identity Match Resolution</h2>
          <p className="text-sm text-muted mb-6">Cross-referencing government databases for entity consistency.</p>
          
          <div className="space-y-4">
            {identifyMatchStages.map((stage, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 w-[45%]">
                    <span className="font-medium text-sm text-ink">{stage.source}</span>
                  </div>
                  
                  <div className="flex-1 px-4 flex flex-col items-center relative">
                     <div className="h-px bg-line w-full absolute top-1/2 -z-10"></div>
                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full border bg-white ${stage.status === 'matched' ? 'border-verified/30 text-verified' : 'border-warning text-warning'}`}>
                       {stage.status === 'matched' ? '↔' : '≠'} {stage.conf}%
                     </span>
                  </div>

                  <div className="flex items-center justify-end gap-3 w-[45%]">
                    <span className="font-medium text-sm text-ink">{stage.target}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-md border border-warning bg-warning/5 flex items-start gap-4">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
            <div>
              <p className="text-sm font-bold text-warning">Potential identity discrepancy</p>
              <p className="text-sm text-slate-700 mt-1">The legal name suffix in MCA records ("LLP") does not match Udyam ("Pvt. Ltd."). Officer review required.</p>
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-6"><BiddersTable /></div>
    </>
  );
}

function BiddersTable() {
  return (
    <Card>
      <CardHeader title="Bidder Management" subtitle="Fictional company data for the prototype." />
      <DataTable><table className="w-full min-w-[920px]"><thead><tr><Th>Bidder</Th><Th>Seller ID</Th><Th>PAN</Th><Th>GSTIN</Th><Th>Udyam</Th><Th>Compliance</Th><Th>Risk</Th><Th>Documents</Th><Th>Status</Th></tr></thead><tbody>{bidders.map((b) => <tr key={b.id} className="hover:bg-surface/70"><Td className="font-medium text-ink">{b.name}</Td><Td>{b.sellerId}</Td><Td>{b.pan}</Td><Td>{b.gstin}</Td><Td>{b.udyam}</Td><Td>{b.compliance}%</Td><Td><RiskBadge risk={b.risk} /></Td><Td>{b.docs}</Td><Td><StatusBadge status={b.status} /></Td></tr>)}</tbody></table></DataTable>
    </Card>
  );
}

export function BidderDocumentsPage() {
  const docs: [string, ComplianceStatus][] = [["GST", "PENDING"], ["PAN", "VERIFIED"], ["Udyam", "VERIFIED"], ["BIS", "OFFICER REVIEW"], ["EMD", "EXEMPT"], ["Experience", "VERIFIED"], ["Turnover", "VERIFIED"], ["MII", "OFFICER REVIEW"], ["OEM Authorization", "VERIFIED"], ["Startup India", "PENDING"], ["NSIC", "PENDING"]];
  return (
    <>
      <Breadcrumbs items={["Bidders", "Shakti Industrial Systems", "Documents"]} />
      <PageHeader title="Document Verification" description="Clicking a document opens the evidence workspace. Extracted fields are always paired with source, method, timestamp and rule result." />
      
      <div className="mt-6 mb-8">
        <h2 className="text-lg font-semibold text-ink mb-4">EMD Exemption Workfow</h2>
        <Card className="flex items-center overflow-x-auto p-4 gap-4 bg-surface text-center whitespace-nowrap min-w-max">
           <div className="bg-white p-3 rounded-md border border-line flex flex-col items-center">
             <span className="text-xs font-bold uppercase text-muted">Evaluation</span>
             <span className="font-semibold mt-1">EMD Required</span>
           </div>
           <ChevronRight className="h-4 w-4 text-muted" />
           <div className="bg-white p-3 rounded-md border border-line flex flex-col items-center">
             <span className="text-xs font-bold uppercase text-muted">Check</span>
             <span className="font-semibold text-action mt-1">MSE Exemption</span>
           </div>
           <ChevronRight className="h-4 w-4 text-muted" />
           <div className="bg-white p-3 border-line flex flex-col items-center border shadow-soft ring-2 ring-verified ring-offset-1 rounded-md">
             <span className="text-xs font-bold uppercase text-muted">Result</span>
             <span className="font-semibold text-verified mt-1">Eligible: YES</span>
           </div>
           <ChevronRight className="h-4 w-4 text-muted" />
           <div className="bg-verified/10 text-verified p-3 rounded-md border border-verified/30 flex flex-col items-center">
             <span className="text-xs font-bold uppercase">Status</span>
             <span className="font-bold mt-1">EMD EXEMPT</span>
           </div>
           
           <div className="border-l-2 border-dashed border-line mx-2 h-12" />
           
           <div className="opacity-40 grayscale flex items-center gap-4">
             <div className="bg-white p-3 rounded-md border border-line flex flex-col items-center">
               <span className="text-xs font-bold uppercase text-muted">Verify</span>
               <span className="font-semibold mt-1">Amount</span>
             </div>
             <ChevronRight className="h-4 w-4 text-muted" />
             <div className="bg-white p-3 rounded-md border border-line flex flex-col items-center">
               <span className="text-xs font-bold uppercase text-muted">Verify</span>
               <span className="font-semibold mt-1">Validity</span>
             </div>
           </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-3 sm:grid-cols-2">{docs.map(([name, status]) => <Card key={name} className="p-4 hover:border-action/30 transition-colors cursor-pointer group"><div className="flex items-center justify-between gap-2"><p className="font-semibold text-ink group-hover:text-action">{name}</p><StatusBadge status={status} /></div><p className="mt-3 text-sm text-muted">Mock verification workspace</p></Card>)}</div>
        <EvidencePanel />
      </div>
    </>
  );
}

function EvidencePanel() {
  return (
    <Card>
      <CardHeader title="Evidence Detail" subtitle="Requirement -> Rule -> Evidence -> Source -> Timestamp -> Confidence." action={<Link to="/review"><Button variant="secondary">Open Review</Button></Link>} />
      <div className="grid gap-4 p-5">
        <EvidenceChain />
        <div className="grid gap-3 md:grid-cols-2"><Meta label="AI Finding" value="Potential mismatch detected." /><Meta label="Rule Result" value={evidenceRecord.result} /><Meta label="Verification Method" value="Government Portal Verification - simulated" /><Meta label="Retrieved Timestamp" value={evidenceRecord.retrieved} /></div>
        <p className="rounded-md border border-review/25 bg-review/10 p-3 text-sm font-semibold text-review">Officer Review Required</p>
      </div>
    </Card>
  );
}

function EvidenceChain() {
  const items = [["Requirement", evidenceRecord.requirement], ["Rule", evidenceRecord.rule], ["Evidence", evidenceRecord.evidence], ["Source", evidenceRecord.source], ["Timestamp", evidenceRecord.retrieved], ["Confidence", `${evidenceRecord.confidence}%`]];
  return <div className="grid gap-2">{items.map(([label, value], idx) => <div key={label}><Meta label={label} value={value} />{idx < items.length - 1 && <ArrowDown className="mx-auto my-1 h-4 w-4 text-muted" />}</div>)}</div>;
}

export function CompliancePage() {
  return (
    <>
      <Breadcrumbs items={["Bidders", "Compliance"]} />
      <PageHeader title="Compliance Dashboard" description="Score is calculated from applicable tender requirements, verification results and risk findings." />
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card className="p-6">
          <p className="text-sm font-semibold text-muted">Overall Compliance Score</p>
          <p className="mt-3 text-6xl font-semibold text-ink">82</p>
          <p className="mt-1 text-sm text-muted">/ 100 - Medium Risk</p>
          <div className="mt-5 space-y-2 text-sm text-slate-700">{["Requirement compliance", "Identity consistency", "Document validity", "Government verification", "Critical findings"].map((x) => <p key={x} className="flex items-center gap-2"><Info className="h-4 w-4 text-muted" />{x}</p>)}</div>
        </Card>
        <Card>
          <CardHeader title="Requirement Matrix" subtitle="Requirement, rule, evidence, status, confidence and action." />
          <DataTable><table className="w-full min-w-[880px]"><thead><tr><Th>Requirement</Th><Th>Rule</Th><Th>Evidence</Th><Th>Status</Th><Th>Confidence</Th><Th>Action</Th></tr></thead><tbody>{requirements.slice(0, 9).map(([id, title, , , rule, evidence, , status], i) => <tr key={id} className="hover:bg-surface/70"><Td className="font-medium text-ink">{title}</Td><Td>{rule}</Td><Td>{evidence}</Td><Td><StatusBadge status={status as ComplianceStatus} /></Td><Td>{92 - i}%</Td><Td><Link className="font-semibold text-action" to="/bidders/shakti/documents">Evidence</Link></Td></tr>)}</tbody></table></DataTable>
        </Card>
      </div>
    </>
  );
}

export function RiskPage() {
  return (
    <>
      <Breadcrumbs items={["Risk & Conflicts"]} />
      <PageHeader title="Risk & Conflicts" description="Risk alerts explain why the item was flagged, what evidence was used, which rule applies, and what the officer can do next." />
      
      <div className="grid gap-4 mt-6">
        {findings.map((f) => (
          <Card key={f.id} className="p-0 overflow-hidden group hover:border-action/30 transition-colors">
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 p-5 lg:border-r border-line bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <RiskBadge risk={f.severity} />
                  <h3 className="font-semibold text-ink text-lg">{f.title}</h3>
                </div>
                
                <div className="bg-surface/50 rounded-md p-4 mb-4 border border-line">
                  <p className="text-[10px] uppercase font-bold text-muted mb-1 tracking-wider">Why Flagged</p>
                  <p className="text-sm font-medium text-ink">{f.evidence.split(';')[0]}</p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                     <p className="text-[10px] uppercase font-bold text-muted mb-1 tracking-wider">Rule Applied</p>
                     <p className="text-sm text-slate-700 leading-relaxed">{f.rule}</p>
                  </div>
                  <div className="bg-white rounded border border-dashed border-line p-3">
                     <p className="text-[10px] uppercase font-bold text-muted mb-1 tracking-wider">Evidence Used</p>
                     <p className="text-sm text-ink">{f.evidence}</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-72 bg-surface/30 p-5 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted mb-1 tracking-wider">Source Engine</p>
                  <div className="flex items-center gap-2 mt-1">
                    <VerificationSourceBadge source={f.source} />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-line">
                    <p className="text-[10px] uppercase font-bold text-muted mb-1 tracking-wider">Recommended Action</p>
                    <p className="text-sm font-semibold text-action">{f.action}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link to="/bidders/shakti/documents" className="block outline-none">
                    <Button variant="secondary" className="w-full">Open Evidence</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

export function ReviewPage() {
  const allFindings = [
    { id: "1", title: "BIS model mismatch", risk: "HIGH", active: true },
    { id: "2", title: "GST verification pending", risk: "MEDIUM", active: false },
    { id: "3", title: "Identity discrepancy", risk: "MEDIUM", active: false }
  ];

  return (
    <>
      <Breadcrumbs items={["Officer Review", "FND-104"]} />
      <PageHeader title="Officer Review" description="Human-control center for findings. The system supports review, clarification and pending states without making the final procurement decision." />
      
      <div className="grid gap-6 xl:grid-cols-[1fr_1.5fr_1fr] h-[700px]">
        {/* LEFT COLUMN: Queue */}
        <Card className="flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-line bg-surface/50">
            <h2 className="font-semibold text-ink">Finding Queue</h2>
            <p className="text-xs text-muted mt-1">3 items require your attention</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-surface/20">
            {allFindings.map((f, i) => (
              <button 
                key={f.id} 
                className={`w-full text-left p-4 rounded-md border transition-all ${f.active ? 'border-action bg-action/5 shadow-sm' : 'border-line bg-white hover:border-action/40 hover:shadow-soft'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 items-start">
                    <span className="text-sm font-semibold text-muted mt-0.5">{i + 1}.</span>
                    <div>
                      <p className={`font-semibold ${f.active ? 'text-action' : 'text-ink'}`}>{f.title}</p>
                      <RiskBadge risk={f.risk as RiskLevel} className="mt-2 inline-flex" />
                    </div>
                  </div>
                  {f.active && <ChevronRight className="h-4 w-4 text-action" />}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* CENTER COLUMN: Evidence */}
        <Card className="flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-line">
            <h2 className="font-semibold text-ink">Evidence & Context</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Finding</p>
              <h3 className="text-lg font-semibold text-ink">BIS model mismatch</h3>
            </div>
            
            <div className="rounded-md bg-review/5 border border-review/20 p-4">
               <p className="text-xs font-bold text-review uppercase tracking-wider mb-2">AI Finding</p>
               <p className="text-sm text-ink font-medium">Potential mismatch detected.</p>
            </div>

            <Meta label="Rule" value="BIS certification must cover offered model." />
            
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Evidence</p>
              <div className="grid gap-3 grid-cols-2">
                <Meta label="Tender" value="X110" />
                <div className="rounded-md bg-conflict/5 p-3">
                  <p className="text-xs font-semibold uppercase tracking-normal text-muted">BIS</p>
                  <p className="text-sm font-semibold text-conflict flex items-center gap-2 mt-1"><X className="h-4 w-4" /> X100</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Meta label="Source" value="BIS verification" />
              <Meta label="Retrieved" value="06 Sep 2026" />
              <div className="rounded-md bg-surface p-3">
                <ConfidenceIndicator value={94} />
              </div>
            </div>

            {/* Visual Logic Component for SIH Demo */}
            <div className="mt-6 pt-6 border-t border-line">
              <h4 className="text-sm font-semibold text-ink mb-4">Verification Check</h4>
              <div className="grid gap-2 grid-cols-5 text-center">
                {[["Manufacturer", "✓"], ["Product", "✓"], ["Model", "✕"], ["Standard", "✓"], ["Validity", "✓"]].map(([label, mark]) => (
                  <div key={label} className={`rounded-md border p-2 flex flex-col items-center justify-center ${mark === "✕" ? "border-conflict bg-conflict/10 text-conflict" : "border-verified/30 bg-verified/10 text-verified"}`}>
                    <p className="text-[10px] font-semibold uppercase">{label}</p>
                    <p className="mt-1 text-lg font-bold">{mark}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* RIGHT COLUMN: Actions */}
        <Card className="flex flex-col h-full bg-surface/30">
          <div className="p-4 border-b border-line">
            <h2 className="font-semibold text-ink">Officer Action</h2>
          </div>
          <div className="flex-1 p-5 space-y-6">
            <p className="text-sm text-muted">Select an action for the currently viewed finding.</p>
            
            <div className="space-y-3">
              <Button className="w-full justify-start bg-review hover:bg-indigo-700">
                <Check className="h-4 w-4" /> Confirm Finding
              </Button>
              <Button variant="secondary" className="w-full justify-start bg-white">
                <AlertTriangle className="h-4 w-4" /> Request Clarification
              </Button>
              <Button variant="secondary" className="w-full justify-start bg-white">
                <Clock className="h-4 w-4" /> Keep Pending
              </Button>
            </div>

            <div className="pt-6 mt-6 border-t border-line">
              <h3 className="font-semibold text-ink text-sm uppercase tracking-wider mb-4">Final Decision</h3>
              <p className="text-xs text-muted mb-4">Proceed to final decision after all findings are handled.</p>
              
              <Link to="/decision" className="block outline-none">
                <div className="rounded-md border border-action bg-white hover:bg-action/5 hover:border-blue-500 transition-colors cursor-pointer p-4 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-action group-hover:text-blue-700">Qualification Decision</p>
                      <p className="text-xs text-muted mt-1">Record the official procurement verdict</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-action group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export function FinalDecisionPage() {
  return (
    <>
      <Breadcrumbs items={["Officer Review", "Final Decision"]} />
      <PageHeader title="Final Procurement Decision" description="Record the authorised officer decision after reviewing the available evidence. AI recommendations do not make decisions." />
      
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6 h-fit">
          <h2 className="font-semibold text-ink mb-6 pb-2 border-b border-line flex items-center gap-2">
            <Gavel className="text-action h-5 w-5" /> Official Decision Record
          </h2>
          <div className="grid gap-4 md:grid-cols-2 mb-6 p-4 bg-surface rounded-md border border-line">
             <Meta label="Tender" value="GEM/2026/B/CPCL/1041" />
             <Meta label="Bidder" value="Shakti Industrial Systems Pvt. Ltd." />
             <Meta label="Compliance Score" value="82 / 100" />
             <Meta label="Risk Profile" value="Medium Risk" />
          </div>
          
          <div className="mb-6">
            <p className="text-sm font-semibold text-ink mb-3">Select Final Decision</p>
            <div className="grid gap-3 md:grid-cols-3">
              <button className="rounded border-2 border-line bg-white px-4 py-3 text-sm font-semibold text-ink hover:border-verified hover:bg-verified/5 transition-colors focus:outline-none focus:ring-2 focus:ring-verified/20 block text-center">QUALIFY</button>
              <button className="rounded border-2 border-line bg-white px-4 py-3 text-sm font-semibold text-ink hover:border-conflict hover:bg-conflict/5 transition-colors focus:outline-none focus:ring-2 focus:ring-conflict/20 block text-center">DISQUALIFY</button>
              <button className="rounded border-2 border-action bg-action/10 px-4 py-3 text-sm font-semibold text-action transition-colors focus:outline-none focus:ring-2 focus:ring-action/20 block text-center">CLARIFICATION REQUIRED</button>
            </div>
          </div>
          
          <label className="block mb-6">
            <span className="label">Decision reason (Required for audit trail)</span>
            <textarea className="min-h-[120px] w-full rounded-md border border-line p-3 text-sm outline-none focus:border-action focus:ring-2 focus:ring-action/20 bg-surface/50" defaultValue="Clarification requested for BIS model coverage before recording qualification status." />
          </label>
        </Card>

        <Card className="p-6 bg-surface/40 h-fit">
          <h2 className="font-semibold text-ink mb-6 pb-2 border-b border-line flex items-center gap-2">
            <BadgeCheck className="text-verified h-5 w-5" /> Authorized Sign-off
          </h2>
          <div className="space-y-4 mb-6">
            <Meta label="Authorised Reviewer" value="N. Vashisth" />
            <Meta label="Designation" value="Procurement Officer, CPCL" />
            <Meta label="Timestamp" value="06 Sep 2026, 10:18 AM IST" />
          </div>
          
          <label className="flex items-start gap-3 p-4 bg-white border border-action/30 rounded-md cursor-pointer group hover:bg-action/5 transition-colors">
            <input className="mt-0.5 h-4 w-4 rounded border-slate-300 text-action focus:ring-action" type="checkbox" defaultChecked />
            <span className="text-sm text-ink font-medium leading-relaxed group-hover:text-action transition-colors">
              I have reviewed the available evidence, risk assessments, and compliance information, and make this decision as the authorised procurement officer.
            </span>
          </label>
          
          <Link to="/audit" className="block mt-6">
            <Button className="w-full py-6 text-base shadow-md">Record into Audit Trail</Button>
          </Link>
        </Card>
      </div>
    </>
  );
}

export function AuditPage() {
  return (
    <>
      <Breadcrumbs items={["Audit Trail"]} />
      <PageHeader title="Audit Trail" description="Chronological record of actions, actors, sources and value changes." actions={<Link to="/reports"><Button variant="secondary">Preview Report</Button></Link>} />
      <Card className="p-8">
        <div className="relative space-y-6">
          <div className="absolute left-[85px] top-4 bottom-4 w-px bg-line z-0 hidden md:block"></div>
          {auditEvents.map(([time, actor, action, source, oldValue, newValue]) => (
            <div key={`${time}-${action}`} className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-[85px] shrink-0 pt-2 text-right hidden md:block">
                <span className="text-sm font-bold text-ink bg-white py-1 pr-4">{time}</span>
              </div>
              <div className="md:hidden">
                <span className="text-sm font-bold text-ink">{time}</span>
              </div>
              <div className="absolute left-[85px] top-[14px] h-2 w-2 -translate-x-[5px] rounded-full bg-action hidden md:block outline outline-4 outline-white"></div>
              
              <div className="flex-1 rounded-lg border border-line bg-white p-5 shadow-sm transition hover:border-action/30">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-ink">{action}</h3>
                    <p className="mt-1 text-sm font-medium text-slate-700">by <span className="text-action">{actor}</span> • {source}</p>
                  </div>
                </div>
                {(oldValue || newValue) && (
                  <div className="mt-4 pt-4 border-t border-line grid grid-cols-2 gap-4">
                     <div>
                       <p className="text-[10px] uppercase font-bold text-muted mb-1 tracking-wider">Previous State</p>
                       <p className="text-sm text-slate-500 font-medium">{oldValue || "None"}</p>
                     </div>
                     <div>
                       <p className="text-[10px] uppercase font-bold text-muted mb-1 tracking-wider">New State</p>
                       <p className="text-sm text-ink font-medium">{newValue}</p>
                     </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

export function ReportsPage() {
  const sections = ["Tender Information", "Bidder Information", "Applicable Requirements", "Rules Applied", "Evidence", "Government Verification", "Risk Findings", "Officer Decisions", "Audit History"];
  return (
    <>
      <Breadcrumbs items={["Reports", "Audit Report"]} />
      <PageHeader title="Audit Report Preview" description="Government procurement record preview for evidence-backed compliance verification." actions={<Button><Download className="h-4 w-4" /> Export Audit Report</Button>} />
      <Card className="mx-auto max-w-5xl p-8">
        <div className="border-b border-line pb-5"><p className="text-sm font-semibold text-muted">PROCURE-AI Audit-Ready Compliance Report</p><h2 className="mt-2 text-2xl font-semibold text-ink">GEM/2026/B/CPCL/1041 - Shakti Industrial Systems Pvt. Ltd.</h2></div>
        <div className="mt-6 grid gap-4">{sections.map((section) => <section key={section} className="rounded-md border border-line p-4"><h3 className="font-semibold text-ink">{section}</h3><p className="mt-2 text-sm text-muted">Rules, evidence, verification source labels, timestamps, confidence and officer actions are summarized here for procurement recordkeeping.</p></section>)}</div>
      </Card>
    </>
  );
}

export function ReportsMiniChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  );
}
