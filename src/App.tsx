
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EnhancedIndex from "./pages/EnhancedIndex";
import AppDoctor from "./pages/AppDoctor";
import NotFound from "./pages/NotFound";
import PatientDashboard from "./pages/PatientDashboard";
import PatientProfile from "./pages/PatientProfile";
import { ThemeProvider } from "@/components/ThemeProvider";
import Blog from "./pages/Blog";
import Onboarding from "./pages/Onboarding";
import AboutUs from "./pages/AboutUs";
import PartnerWithUs from "./pages/PartnerWithUs";
import Contact from "./pages/Contact";
import DoctorProfile from "./pages/DoctorProfile";
import MessageCenter from "./pages/MessageCenter";
import VideoConferenceDoctor from "./pages/VideoConferenceDoctor";
import VideoConferencePatient from "./pages/VideoConferencePatient";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<EnhancedIndex />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/partner-with-us" element={<PartnerWithUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/app/doctor" element={<AppDoctor />} />
            <Route path="/app/doctor/profile" element={<DoctorProfile />} />
            <Route path="/app/doctor/video-call" element={<VideoConferenceDoctor />} />
            <Route path="/app/patient" element={<PatientDashboard />} />
            <Route path="/app/patient/profile" element={<PatientProfile />} />
            <Route path="/app/patient/video-call" element={<VideoConferencePatient />} />
            <Route path="/app/messages" element={<MessageCenter />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
