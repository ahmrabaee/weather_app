import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CreateAlert from "./pages/CreateAlert";
import SectorDashboard from "./pages/SectorDashboard";
import ApproveAlerts from "./pages/ApproveAlerts";
import DisseminateAlert from "./pages/DisseminateAlert";
import PublicAlert from "./pages/PublicAlert";
import ActivityLogs from "./pages/ActivityLogs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user } = useApp();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/sector-dashboard" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route path="/admin-dashboard" element={
        <ProtectedRoute allowedRoles={['meteorology']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/create-alert" element={
        <ProtectedRoute allowedRoles={['meteorology']}>
          <CreateAlert />
        </ProtectedRoute>
      } />
      
      <Route path="/edit-alert/:id" element={
        <ProtectedRoute allowedRoles={['meteorology']}>
          <CreateAlert />
        </ProtectedRoute>
      } />
      
      <Route path="/sector-dashboard" element={
        <ProtectedRoute>
          <SectorDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/alert-approval" element={
        <ProtectedRoute allowedRoles={['meteorology', 'civil-defense']}>
          <ApproveAlerts />
        </ProtectedRoute>
      } />
      
      <Route path="/disseminate-alert" element={
        <ProtectedRoute allowedRoles={['meteorology', 'civil-defense']}>
          <DisseminateAlert />
        </ProtectedRoute>
      } />
      
      <Route path="/logs" element={
        <ProtectedRoute allowedRoles={['meteorology', 'civil-defense']}>
          <ActivityLogs />
        </ProtectedRoute>
      } />
      
      {/* Public routes - no auth required */}
      <Route path="/public-alert/:id" element={<PublicAlert />} />
      <Route path="/public-alert" element={<PublicAlert />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
