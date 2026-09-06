import { X, ExternalLink, ShieldAlert, BadgeCheck, FileText } from "lucide-react";
import { Button, StatusBadge, Card } from "./ui";
import { evidenceRecord, findings } from "../data/mockData";

export default function EvidenceDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-navy/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl transform border-l border-line bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-surface/50">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Evidence Review</p>
            <h2 className="mt-1 text-lg font-bold text-ink flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-conflict" />
              BIS model does not match tendered model.
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-muted transition-colors hover:bg-line/50 hover:text-ink focus:outline-none focus:ring-2 focus:ring-action/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <section>
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Requirement</h3>
            <Card className="p-4 bg-surface border-line">
              <p className="font-medium text-ink">{evidenceRecord.requirement}</p>
            </Card>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Rule Applied</h3>
            <Card className="p-4">
              <p className="text-sm text-slate-700 leading-relaxed">{evidenceRecord.rule}</p>
            </Card>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Evidence</h3>
            <Card className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-md text-action"><FileText className="h-5 w-5" /></div>
                <div>
                  <p className="font-semibold text-ink">BIS Licence</p>
                  <p className="text-xs text-muted">BIS/2026/12345</p>
                </div>
              </div>
              <Button variant="ghost" className="text-xs"><ExternalLink className="h-3 w-3 mr-1" /> View PDF</Button>
            </Card>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Source</h3>
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted mb-1">Verification Method</p>
                  <p className="text-sm font-medium text-ink">Official Verification</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted mb-1">Retrieved</p>
                  <p className="text-sm font-medium text-ink">06 Sep 2026, 09:46 AM</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted mb-1">Confidence</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 w-24 bg-line rounded-full overflow-hidden">
                      <div className="h-full bg-action w-[94%]" />
                    </div>
                    <span className="text-xs font-semibold text-ink">94%</span>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Comparison</h3>
            <Card className="p-0 overflow-hidden divide-y divide-line">
              <div className="bg-surface/50 px-4 py-3 flex justify-between items-center text-sm">
                <span className="font-medium text-muted">Tendered Model</span>
                <span className="font-bold text-ink">X110</span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center text-sm">
                <span className="font-medium text-muted">Verified Model</span>
                <span className="font-bold text-conflict line-through decoration-conflict/50">X100</span>
              </div>
              <div className="bg-conflict/5 px-4 py-3">
                <p className="text-sm font-semibold text-conflict flex items-center justify-center gap-2">
                  <X className="h-4 w-4" /> Mismatch Detected
                </p>
              </div>
            </Card>
          </section>

          <section>
            <Card className="p-4 bg-review/5 border-review/20">
               <h3 className="text-sm font-bold text-review mb-1">AI Finding</h3>
               <p className="text-sm text-ink font-medium">"Potential model mismatch detected."</p>
               <p className="text-xs text-muted mt-2">Recommended Action: Officer review required.</p>
            </Card>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-line bg-surface px-6 py-4 flex flex-col gap-3">
          <Button variant="danger" className="w-full">Request Clarification</Button>
          <div className="flex gap-3">
            <Button variant="secondary" className="w-full">Mark Pending</Button>
            <Button className="w-full bg-review hover:bg-indigo-700 min-w-[50%]">Confirm Finding</Button>
          </div>
        </div>
      </div>
    </>
  );
}
