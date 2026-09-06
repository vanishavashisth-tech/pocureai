import { NavLink } from "react-router-dom";
import { ChevronRight, Search } from "lucide-react";
import { cn } from "../lib/utils";
import { riskClass, statusMeta, type ComplianceStatus, type RiskLevel } from "../data/mockData";

export function Button({ variant = "primary", className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "outline" }) {
  const base = "inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-action focus:ring-offset-1 disabled:opacity-50 tracking-wide uppercase";
  const variants = {
    primary: "bg-navy text-white hover:bg-navy/90 border border-transparent shadow-sm",
    secondary: "bg-surface text-ink hover:bg-line border border-line",
    danger: "bg-conflict text-white hover:bg-conflict/90 border border-transparent shadow-sm",
    outline: "bg-transparent text-navy hover:bg-navy/5 border-2 border-navy",
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("overflow-hidden rounded-sm bg-white border border-line", className)}>{children}</div>;
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
      <div>
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: ComplianceStatus }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  return (
    <span title={meta.helper} className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", meta.className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function RiskBadge({ risk, className }: { risk: RiskLevel; className?: string }) {
  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", riskClass[risk], className)}>{risk}</span>;
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-sm font-medium text-muted">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold tracking-normal text-ink">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: string[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1 text-sm text-muted">
      {items.map((item, index) => (
        <span key={item} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="h-4 w-4" aria-hidden="true" />}
          <span className={index === items.length - 1 ? "font-medium text-ink" : ""}>{item}</span>
        </span>
      ))}
    </nav>
  );
}

export function SearchInput({ placeholder = "Search" }: { placeholder?: string }) {
  return (
    <label className="relative block w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input className="h-10 w-full rounded-md border border-line bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-action focus:ring-2 focus:ring-action/20" placeholder={placeholder} />
    </label>
  );
}

export function FilterPill({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return <button className={cn("h-9 rounded-full border px-3 text-sm font-medium transition", active ? "border-action bg-action/10 text-action" : "border-line bg-white text-slate-700 hover:bg-surface")}>{children}</button>;
}

export function MetricCard({ label, value, note, href }: { label: string; value: string | number; note?: string; href?: string }) {
  const body = (
    <Card className="group h-full p-4 transition duration-200 hover:-translate-y-0.5 hover:border-action/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
        </div>
        {href && <ChevronRight className="mt-1 h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-action" />}
      </div>
      {note && <p className="mt-3 text-xs leading-5 text-muted">{note}</p>}
    </Card>
  );

  if (href) {
    return <NavLink to={href} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action">{body}</NavLink>;
  }

  return body;
}

export function CompactMetric({ label, value, tone = "default" }: { label: string; value: string | number; tone?: "default" | "green" | "amber" | "red" | "blue" }) {
  return (
    <div
      className={cn(
        "rounded-md border bg-white px-3 py-2",
        tone === "default" && "border-line",
        tone === "green" && "border-verified/25 bg-verified/5",
        tone === "amber" && "border-warning/25 bg-warning/5",
        tone === "red" && "border-conflict/25 bg-conflict/5",
        tone === "blue" && "border-action/25 bg-action/5",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-normal text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}

export function LegacyMetricCard({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <Card className="p-4">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}
    </Card>
  );
}

export function ConfidenceIndicator({ value }: { value: number }) {
  return (
    <div className="min-w-28">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700">Confidence</span>
        <span className="text-muted">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-action" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function VerificationSourceBadge({ source, tier }: { source: string; tier?: string }) {
  return (
    <span className="inline-flex flex-col rounded-md border border-line bg-surface px-2.5 py-1 text-xs text-slate-700">
      <span className="font-semibold">{source}</span>
      {tier && <span className="text-muted">{tier}</span>}
    </span>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-surface px-6 py-8 text-center">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted">{text}</p>
    </div>
  );
}

export function DataTable({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-lg border border-line bg-white">{children}</div>;
}

export function SidebarLink({ to, icon: Icon, label, count }: { to: string; icon: React.ElementType; label: string; count?: number }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center justify-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition lg:justify-start",
          isActive ? "bg-action/10 text-action" : "text-slate-700 hover:bg-slate-100",
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="hidden flex-1 lg:inline">{label}</span>
      {count != null && (
        <span className="ml-auto hidden min-w-6 rounded-full bg-slate-100 px-2 py-0.5 text-center text-xs font-semibold text-slate-700 lg:inline">
          {count}
        </span>
      )}
    </NavLink>
  );
}