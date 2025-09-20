import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
