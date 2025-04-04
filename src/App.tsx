
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Index from "./pages/Index";
import RPAPage from "./pages/RPAPage";
import RPADetailPage from "./pages/RPADetailPage";
import ExecutionsPage from "./pages/ExecutionsPage";
import MonitoringPage from "./pages/MonitoringPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/rpas" element={<RPAPage />} />
              <Route path="/rpas/:id" element={<RPADetailPage />} />
              <Route path="/execucoes" element={<ExecutionsPage />} />
              <Route path="/monitoramento" element={<MonitoringPage />} />
              <Route path="/admin" element={<AdminPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
