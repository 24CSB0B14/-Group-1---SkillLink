import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ClientHomepage from "./pages/ClientHomepage";
import FreelancerHomepage from "./pages/FreelancerHomepage";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Onboarding from "./pages/Onboarding";
import PostJob from "./pages/PostJob";
import SearchJobs from "./pages/SearchJobs";
import JobDetails from "./pages/JobDetails";
import EditJob from "./pages/EditJob";
import MyJobs from "./pages/MyJobs";
import PlaceBid from "./pages/PlaceBid";
import FreelancerDirectory from "./pages/FreelancerDirectory";
import PublicProfile from "./pages/PublicProfile";
import EditProfile from "./pages/EditProfile";
import Chat from "./pages/Chat";
import Messages from "./pages/Messages";
import ContractPage from "./pages/ContractPage";
import WorkDelivery from "./pages/WorkDelivery";
import EscrowFunding from "./pages/EscrowFunding";
import ReviewRating from "./pages/ReviewRating";
import DisputeResolution from "./pages/DisputeResolution";
import FreelancerEarnings from "./pages/FreelancerEarnings";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Onboarding */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />
        
        {/* Client routes */}
        <Route path="/client" element={
          <ProtectedRoute allowedRoles="client">
            <ClientHomepage />
          </ProtectedRoute>
        } />
        <Route path="/client-dashboard" element={
          <ProtectedRoute allowedRoles="client">
            <ClientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/post-job" element={
          <ProtectedRoute allowedRoles="client">
            <PostJob />
          </ProtectedRoute>
        } />
        <Route path="/edit-job/:jobId" element={
          <ProtectedRoute allowedRoles="client">
            <EditJob />
          </ProtectedRoute>
        } />
        <Route path="/my-jobs" element={
          <ProtectedRoute allowedRoles="client">
            <MyJobs />
          </ProtectedRoute>
        } />
        <Route path="/job-details/:jobId" element={
          <ProtectedRoute allowedRoles={["client", "freelancer"]}>
            <JobDetails />
          </ProtectedRoute>
        } />
        <Route path="/freelancers" element={
          <ProtectedRoute allowedRoles="client">
            <FreelancerDirectory />
          </ProtectedRoute>
        } />
        <Route path="/freelancer-profile/:userId" element={
          <ProtectedRoute allowedRoles="client">
            <PublicProfile />
          </ProtectedRoute>
        } />
        
        {/* Freelancer profile route - accessible to both clients and freelancers */}
        <Route path="/freelancer-profile/:userId" element={
          <ProtectedRoute allowedRoles={["client", "freelancer"]}>
            <PublicProfile />
          </ProtectedRoute>
        } />
        
        {/* Freelancer routes */}
        <Route path="/freelancer" element={
          <ProtectedRoute allowedRoles="freelancer">
            <FreelancerHomepage />
          </ProtectedRoute>
        } />
        <Route path="/freelancer-dashboard" element={
          <ProtectedRoute allowedRoles="freelancer">
            <FreelancerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/search-jobs" element={
          <ProtectedRoute allowedRoles="freelancer">
            <SearchJobs />
          </ProtectedRoute>
        } />
        <Route path="/place-bid/:jobId" element={
          <ProtectedRoute allowedRoles="freelancer">
            <PlaceBid />
          </ProtectedRoute>
        } />
        <Route path="/earnings" element={
          <ProtectedRoute allowedRoles="freelancer">
            <FreelancerEarnings />
          </ProtectedRoute>
        } />
        
        {/* Shared routes */}
        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
        <Route path="/chat/:id" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="/contract/:contractId" element={
          <ProtectedRoute>
            <ContractPage />
          </ProtectedRoute>
        } />
        <Route path="/work-delivery/:contractId" element={
          <ProtectedRoute>
            <WorkDelivery />
          </ProtectedRoute>
        } />
        <Route path="/escrow-funding/:contractId" element={
          <ProtectedRoute>
            <EscrowFunding />
          </ProtectedRoute>
        } />
        <Route path="/review/:contractId" element={
          <ProtectedRoute>
            <ReviewRating />
          </ProtectedRoute>
        } />
        <Route path="/dispute/:contractId" element={
          <ProtectedRoute>
            <DisputeResolution />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    <Toaster />
    <Sonner />
  </AuthProvider>
);

export default App;