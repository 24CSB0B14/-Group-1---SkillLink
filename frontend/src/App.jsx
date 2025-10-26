// App.jsx - Complete with all routes
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import TestForgotPassword from "./pages/TestForgotPassword";
import TestMyJobs from "./pages/TestMyJobs";
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
import MyJobs from "./pages/MyJobs";
import EditJob from "./pages/EditJob";

// Week 4 Pages
import AdminDashboard from "./pages/AdminDashboard";
import DisputeResolution from "./pages/DisputeResolution";
import SearchJobs from "./pages/SearchJobs";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

// Test Page
import APITestPage from "./pages/APITestPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
            <Route path="/test-forgot-password" element={<TestForgotPassword />} />
            <Route path="/test-my-jobs" element={<TestMyJobs />} />
            
            {/* Protected routes - Client only */}
            <Route 
              path="/client-dashboard" 
              element={
                <ProtectedRoute allowedRoles="client">
                  <ClientDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected routes - Freelancer only */}
            <Route 
              path="/freelancer-dashboard" 
              element={
                <ProtectedRoute allowedRoles="freelancer">
                  <FreelancerDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected routes - Client or Freelancer */}
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute allowedRoles={["client", "freelancer"]}>
                  <Onboarding />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-profile" 
              element={
                <ProtectedRoute allowedRoles={["client", "freelancer"]}>
                  <EditProfile />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected routes - Client only */}
            <Route 
              path="/post-job" 
              element={
                <ProtectedRoute allowedRoles="client">
                  <PostJob />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-jobs" 
              element={
                <ProtectedRoute allowedRoles="client">
                  <MyJobs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-job/:id" 
              element={
                <ProtectedRoute allowedRoles="client">
                  <EditJob />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected routes - Freelancer only */}
            <Route 
              path="/place-bid/:id" 
              element={
                <ProtectedRoute allowedRoles="freelancer">
                  <PlaceBid />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected routes - Client or Freelancer */}
            <Route 
              path="/job-details/:id" 
              element={
                <ProtectedRoute allowedRoles={["client", "freelancer"]}>
                  <JobDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/freelancers" 
              element={
                <ProtectedRoute allowedRoles={["client", "freelancer"]}>
                  <FreelancerDirectory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contract/:id" 
              element={
                <ProtectedRoute allowedRoles={["client", "freelancer"]}>
                  <ContractPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/escrow-funding/:id" 
              element={
                <ProtectedRoute allowedRoles={["client", "freelancer"]}>
                  <EscrowFunding />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/work-delivery" 
              element={
                <ProtectedRoute allowedRoles={["client", "freelancer"]}>
                  <WorkDelivery />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat/:id" 
              element={
                <ProtectedRoute allowedRoles={["client", "freelancer"]}>
                  <Chat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/review/:id" 
              element={
                <ProtectedRoute allowedRoles={["client", "freelancer"]}>
                  <ReviewRating />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/freelancer-profile/:id" 
              element={
                <ProtectedRoute allowedRoles={["client", "freelancer"]}>
                  <PublicProfile />
                </ProtectedRoute>
              } 
            />

            {/* Protected routes - Admin only */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dispute-resolution/:id" 
              element={
                <ProtectedRoute allowedRoles="admin">
                  <DisputeResolution />
                </ProtectedRoute>
              } 
            />

            {/* Protected routes - Client or Freelancer */}
            <Route 
              path="/search-jobs" 
              element={
                <ProtectedRoute allowedRoles={["client", "freelancer"]}>
                  <SearchJobs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute allowedRoles={["client", "freelancer"]}>
                  <Notifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute allowedRoles={["client", "freelancer"]}>
                  <Settings />
                </ProtectedRoute>
              } 
            />

            {/* Test Page */}
            <Route 
              path="/api-test" 
              element={
                <ProtectedRoute>
                  <APITestPage />
                </ProtectedRoute>
              } 
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;