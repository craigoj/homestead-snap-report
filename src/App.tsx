import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { Layout } from "@/components/Layout";
import { useWebVitals, defaultWebVitalsReporter } from "@/hooks/useWebVitals";
import { AssessmentProvider } from "@/hooks/useAssessmentState";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import AddAsset from "./pages/AddAsset";
import AssetDetail from "./pages/AssetDetail";
import EditAsset from "./pages/EditAsset";
import Reports from "./pages/Reports";
import BulkAssetOperations from "./pages/BulkAssetOperations";
import HowToGuide from "./pages/HowToGuide";
import Assessment from "./pages/Assessment";
import AssessmentQuiz from "./pages/AssessmentQuiz";
import AssessmentResults from "./pages/AssessmentResults";
import Waitlist from "./pages/Waitlist";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AssessmentsManager from "./pages/admin/AssessmentsManager";
import WaitlistManager from "./pages/admin/WaitlistManager";
import TestEmail from "./pages/TestEmail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Unsubscribe from "./pages/Unsubscribe";
import ProofOfLoss from "./pages/ProofOfLoss";
import JumpstartGuide from "./pages/JumpstartGuide";
import JumpstartComplete from "./pages/JumpstartComplete";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Initialize Web Vitals monitoring
  useWebVitals(defaultWebVitalsReporter);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <AssessmentProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/how-to" element={<HowToGuide />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/properties" element={
                  <ProtectedRoute>
                    <Layout>
                      <Properties />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/properties/:id" element={
                  <ProtectedRoute>
                    <Layout>
                      <PropertyDetail />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/assets/add" element={
                  <ProtectedRoute>
                    <Layout>
                      <AddAsset />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/assets/:id" element={
                  <ProtectedRoute>
                    <Layout>
                      <AssetDetail />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/assets/:id/edit" element={
                  <ProtectedRoute>
                    <Layout>
                      <EditAsset />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <Layout>
                      <Reports />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/bulk-operations" element={
                  <ProtectedRoute>
                    <Layout>
                      <BulkAssetOperations />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/proof-of-loss" element={
                  <ProtectedRoute>
                    <ProofOfLoss />
                  </ProtectedRoute>
                } />
                <Route path="/jumpstart/guide" element={
                  <ProtectedRoute>
                    <JumpstartGuide />
                  </ProtectedRoute>
                } />
                <Route path="/jumpstart/complete" element={
                  <ProtectedRoute>
                    <JumpstartComplete />
                  </ProtectedRoute>
                } />
                {/* Assessment Routes - No auth required */}
                <Route path="/assessment" element={<Assessment />} />
                <Route path="/assessment/quiz" element={<AssessmentQuiz />} />
                <Route path="/assessment/results" element={<AssessmentResults />} />
                <Route path="/waitlist" element={<Waitlist />} />
                
                {/* Legal Pages - No auth required */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                
                {/* Admin Routes - Admin only */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  </AdminRoute>
                } />
                <Route path="/admin/assessments" element={
                  <AdminRoute>
                    <Layout>
                      <AssessmentsManager />
                    </Layout>
                  </AdminRoute>
                } />
                <Route path="/admin/waitlist" element={
                  <AdminRoute>
                    <Layout>
                      <WaitlistManager />
                    </Layout>
                  </AdminRoute>
                } />
                <Route path="/admin/test-email" element={
                  <AdminRoute>
                    <Layout>
                      <TestEmail />
                    </Layout>
                  </AdminRoute>
                } />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            </AssessmentProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
