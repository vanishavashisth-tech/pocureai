import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import {
  AuditPage,
  BidderDocumentsPage,
  BidderProfilePage,
  CompliancePage,
  DashboardPage,
  FinalDecisionPage,
  LoginPage,
  NewTenderPage,
  ReportsPage,
  RequirementsPage,
  ReviewPage,
  RiskPage,
  TenderAnalysisPage,
  TendersPage,
} from "./pages";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tenders" element={<TendersPage />} />
        <Route path="/tenders/new" element={<NewTenderPage />} />
        <Route path="/tenders/:id" element={<TenderAnalysisPage />} />
        <Route path="/tenders/:id/requirements" element={<RequirementsPage />} />
        <Route path="/tenders/:id/bidders" element={<BidderProfilePage />} />
        <Route path="/bidders/:id" element={<BidderProfilePage />} />
        <Route path="/bidders/:id/documents" element={<BidderDocumentsPage />} />
        <Route path="/bidders/:id/compliance" element={<CompliancePage />} />
        <Route path="/bidders/:id/risk" element={<RiskPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/review/:id" element={<ReviewPage />} />
        <Route path="/decision" element={<FinalDecisionPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
