import { Outlet, useLocation } from "react-router-dom";
import {
  Bell,
  CircleHelp,
  ClipboardCheck,
  FileCheck2,
  FileSearch,
  FolderKanban,
  Gauge,
  Gavel,
  LayoutDashboard,
  ListChecks,
  Settings,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Button, SidebarLink } from "./ui";

const nav = [
  ["/dashboard", LayoutDashboard, "Dashboard"],
  ["/tenders", FolderKanban, "Tenders"],
  ["/tenders/GEM-2026-B-CPCL-1041/bidders", Users, "Bidders"],
  ["/tenders/GEM-2026-B-CPCL-1041/requirements", ListChecks, "Requirements"],
  ["/bidders/shakti/documents", FileSearch, "Verification", 17],
  ["/bidders/shakti/compliance", ClipboardCheck, "Compliance"],
  ["/bidders/shakti/risk", ShieldAlert, "Risk & Conflicts", 2],
  ["/review", Gavel, "Officer Review", 4],
  ["/audit", FileCheck2, "Audit Trail"],
  ["/reports", Gauge, "Reports"],
] as const;

function workspaceLabel(pathname: string) {
  if (pathname === "/dashboard") return "Daily Review Workspace";
  if (pathname.startsWith("/tenders/") && pathname.includes("/requirements")) return "Tender / GEM/2026/B/CPCL/1041 / Requirements";
  if (pathname.startsWith("/tenders/") && pathname.includes("/bidders")) return "Tender / GEM/2026/B/CPCL/1041 / Bidders";
  if (pathname.startsWith("/tenders/")) return "Tender / GEM/2026/B/CPCL/1041";
  if (pathname.startsWith("/bidders/") && pathname.includes("/documents")) return "Tender / Bidder / Verification";
  if (pathname.startsWith("/bidders/") && pathname.includes("/compliance")) return "Tender / Bidder / Compliance";
  if (pathname.startsWith("/bidders/") && pathname.includes("/risk")) return "Tender / Bidder / Risk Review";
  if (pathname.startsWith("/review")) return "Tender / Bidder / Officer Review";
  if (pathname.startsWith("/audit")) return "Tender / Audit Trail";
  if (pathname.startsWith("/reports")) return "Audit-Ready Report";
  return "CPCL procurement compliance";
}

export default function AppShell() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-surface text-ink">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-20 flex-col border-r border-[#091c3f] bg-[#091c3f] text-white transition-all duration-300 lg:w-72">
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-white/10 px-5 lg:justify-start">
          <ShieldAlert className="h-6 w-6 text-white" />
          <span className="ml-3 hidden font-bold tracking-widest uppercase lg:block">CPCL Govt</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Primary">
          {nav.map(([to, icon, label, count]) => (
            <SidebarLink key={to} to={to} icon={icon} label={label} count={count} />
          ))}
        </nav>
        <div className="mt-auto space-y-1 border-t border-white/10 p-3">
          <SidebarLink to="/help" icon={CircleHelp} label="Help" />
          <SidebarLink to="/settings" icon={Settings} label="Settings" />
          <div className="mt-3 hidden rounded-md bg-white/5 p-3 lg:block">
            <p className="text-sm font-semibold text-white">N. Vashisth</p>
            <p className="text-xs text-white/60">Procurement Officer</p>
          </div>
        </div>
      </aside>
      <div className="relative flex flex-1 flex-col overflow-hidden pl-20 lg:pl-72">
        {/* Govt Top Utility Bar */}
        <div className="bg-header text-white px-6 py-1.5 text-[11px] font-semibold flex justify-between items-center border-b-2 border-[#ff9933] shadow-inner tracking-wide uppercase">
           <div className="flex gap-4">
             <span>Government of India</span>
             <span className="opacity-50">|</span>
             <span>Ministry of Petroleum and Natural Gas</span>
             <span className="opacity-50">|</span>
             <span>CPCL</span>
           </div>
           <div className="flex gap-4 items-center">
             <button className="hover:underline focus:outline-none focus:ring-1 focus:ring-white">Skip to Main Content</button>
             <button className="hover:underline focus:outline-none focus:ring-1 focus:ring-white">Screen Reader Access</button>
             <div className="flex gap-1 items-center px-3 border-x border-white/20">
               <button className="hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors focus:outline-none">A-</button>
               <button className="hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors focus:outline-none">A</button>
               <button className="hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors focus:outline-none">A+</button>
             </div>
             <select className="bg-transparent border-none outline-none cursor-pointer focus:ring-1 focus:ring-white">
                <option className="text-black">English</option>
                <option className="text-black">हिन्दी</option>
             </select>
           </div>
        </div>
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b-2 border-line bg-white px-8 shadow-sm">
          <div className="flex items-center gap-5">
             <div className="h-12 w-12 bg-navy flex items-center justify-center rounded-sm">
                <span className="text-white font-bold text-xs text-center leading-tight">EMBLEM<br/>GOI</span>
             </div>
             <div>
               <h1 className="text-[17px] font-bold text-navy uppercase tracking-wide">Procure-AI Intelligence Portal</h1>
               <p className="text-xs font-semibold text-slate-500 uppercase mt-0.5">Chennai Petroleum Corporation Limited (CPCL)</p>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden items-center gap-2 text-sm md:flex">
              <span className="h-2 w-2 rounded-full bg-verified"></span>
              <span className="font-semibold text-slate-700">Official Portal</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative rounded-full p-2 text-muted hover:bg-surface hover:text-ink focus:outline-none focus:ring-2 focus:ring-action">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-action"></span>
              </button>
              <div className="flex items-center gap-3 border-l-2 border-line pl-5">
                <div className="h-9 w-9 rounded-sm bg-navy text-white flex items-center justify-center font-bold text-sm">NV</div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-ink">N. Vashisth</p>
                  <p className="text-xs font-semibold text-muted uppercase">Procurement Officer</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] px-5 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
