import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EWSProvider, useEWS } from "@/contexts/EWSContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CreateAlert from "./pages/CreateAlert";
import SectorDashboard from "./pages/SectorDashboard";
import PublicAlert from "./pages/PublicAlert";
import SystemLogs from "./pages/SystemLogs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { currentRole } = useEWS();
  
  if (!currentRole) {
    return <Navigate to="/" replace />;
  }
  
  if (requireAdmin && currentRole !== 'meteorology') {
    return <Navigate to="/sector" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/create" element={
        <ProtectedRoute requireAdmin>
          <CreateAlert />
        </ProtectedRoute>
      } />
      <Route path="/admin/edit/:id" element={
        <ProtectedRoute requireAdmin>
          <CreateAlert />
        </ProtectedRoute>
      } />
      <Route path="/admin/logs" element={
        <ProtectedRoute requireAdmin>
          <SystemLogs />
        </ProtectedRoute>
      } />
      <Route path="/sector" element={
        <ProtectedRoute>
          <SectorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/public" element={<PublicAlert />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EWSProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </EWSProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
