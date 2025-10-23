// App.jsx - Complete with all routes
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import EditProfile from "./pages/EditProfile";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import NotFound from "./pages/NotFound";

// Week 2 & 3 Pages
import PostJob from "./pages/PostJob";
import JobDetails from "./pages/JobDetails";
import PlaceBid from "./pages/PlaceBid";
import FreelancerDirectory from "./pages/FreelancerDirectory";
import ContractPage from "./pages/ContractPage";
import EscrowFunding from "./pages/EscrowFunding";
import WorkDelivery from "./pages/WorkDelivery";
import Chat from "./pages/Chat";
import ReviewRating from "./pages/ReviewRating";
import PublicProfile from "./pages/PublicProfile";

// Week 4 Pages
import AdminDashboard from "./pages/AdminDashboard";
import DisputeResolution from "./pages/DisputeResolution";
import SearchJobs from "./pages/SearchJobs";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Core Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
          
          {/* Week 2 & 3 - Core Business */}
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/job-details/:id" element={<JobDetails />} />
          <Route path="/place-bid/:id" element={<PlaceBid />} />
          <Route path="/freelancers" element={<FreelancerDirectory />} />
          <Route path="/contract/:id" element={<ContractPage />} />
          <Route path="/escrow-funding/:id" element={<EscrowFunding />} />
          <Route path="/work-delivery" element={<WorkDelivery />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/review/:id" element={<ReviewRating />} />
          <Route path="/freelancer-profile/:id" element={<PublicProfile />} />

          {/* Week 4 - Advanced Features */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dispute-resolution/:id" element={<DisputeResolution />} />
          <Route path="/search-jobs" element={<SearchJobs />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;