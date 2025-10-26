// pages/TestMyJobs.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import jobService from "@/services/job.service";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/context/AuthContext";

const TestMyJobs = () => {
  const { isClient, getUserRole } = useRole();
  const { user } = useAuth();
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("User data:", user);
    console.log("User role:", getUserRole());
    console.log("Is client:", isClient());
  }, [user, getUserRole, isClient]);

  const testAuthStatus = async () => {
    try {
      setLoading(true);
      console.log("Testing authentication status...");
      
      // Log current user info
      console.log("Current user:", user);
      console.log("User role:", getUserRole());
      console.log("Is client:", isClient());
      
      setTestResults({
        user: user,
        role: getUserRole(),
        isClient: isClient(),
        timestamp: new Date().toISOString()
      });
      
      toast.success("Auth status checked");
    } catch (error) {
      console.error("Auth status check failed:", error);
      toast.error("Auth status check failed");
    } finally {
      setLoading(false);
    }
  };

  const testApiCall = async () => {
    try {
      setLoading(true);
      console.log("Testing API call to /jobs/my-jobs...");
      
      // Log the request
      console.log("Making request to jobService.getJobsByClient()");
      
      const response = await jobService.getJobsByClient();
      
      // Log the response
      console.log("API response:", response);
      
      setTestResults({
        ...testResults,
        apiResponse: response,
        apiTimestamp: new Date().toISOString()
      });
      
      toast.success("API call successful");
    } catch (error) {
      console.error("API call failed:", error);
      console.error("Error response:", error.response);
      
      setTestResults({
        ...testResults,
        apiError: {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        },
        apiErrorTimestamp: new Date().toISOString()
      });
      
      toast.error(`API call failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    try {
      setLoading(true);
      console.log("Testing direct fetch to /api/v1/jobs/my-jobs...");
      
      const response = await fetch('/api/v1/jobs/my-jobs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      
      console.log("Direct fetch response:", response);
      console.log("Direct fetch data:", data);
      
      setTestResults({
        ...testResults,
        directFetch: {
          status: response.status,
          statusText: response.statusText,
          data: data
        },
        directFetchTimestamp: new Date().toISOString()
      });
      
      if (response.ok) {
        toast.success("Direct fetch successful");
      } else {
        toast.error(`Direct fetch failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Direct fetch failed:", error);
      
      setTestResults({
        ...testResults,
        directFetchError: error.message,
        directFetchErrorTimestamp: new Date().toISOString()
      });
      
      toast.error(`Direct fetch failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Test My Jobs</h1>
            <p className="text-muted-foreground mt-2">
              Debug tool for My Jobs functionality
            </p>
          </div>
          <Button asChild>
            <Link to="/client-dashboard">Dashboard</Link>
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">User Information</h3>
                  <pre className="bg-muted p-4 rounded mt-2 text-sm overflow-auto">
                    {JSON.stringify({ user, role: getUserRole(), isClient: isClient() }, null, 2)}
                  </pre>
                </div>
                
                {testResults && (
                  <div>
                    <h3 className="font-semibold">Test Results</h3>
                    <pre className="bg-muted p-4 rounded mt-2 text-sm overflow-auto">
                      {JSON.stringify(testResults, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button onClick={testAuthStatus} disabled={loading}>
                  {loading ? "Testing..." : "Test Auth Status"}
                </Button>
                <Button onClick={testApiCall} disabled={loading}>
                  {loading ? "Testing..." : "Test API Call"}
                </Button>
                <Button onClick={testDirectFetch} disabled={loading}>
                  {loading ? "Testing..." : "Test Direct Fetch"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestMyJobs;