import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CreateAlert from "./pages/CreateAlert";
import SectorDashboard from "./pages/SectorDashboard";
import PublicAlert from "./pages/PublicAlert";
import AlertApproval from "./pages/AlertApproval";
import DisseminateAlert from "./pages/DisseminateAlert";
import ActivityLogs from "./pages/ActivityLogs";
import MapStudioPage from "./pages/MapStudioPage";
import TestMapCalibration from "./pages/TestMapCalibration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/create-alert" element={<CreateAlert />} />
            <Route path="/edit-alert/:id" element={<CreateAlert />} />
            <Route path="/sector-dashboard" element={<SectorDashboard />} />
            <Route path="/public-alert/:id" element={<PublicAlert />} />
            <Route path="/alert-approval" element={<AlertApproval />} />
            <Route path="/disseminate-alert" element={<DisseminateAlert />} />
            <Route path="/logs" element={<ActivityLogs />} />
            <Route path="/map-studio" element={<MapStudioPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/test-map" element={<TestMapCalibration />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
