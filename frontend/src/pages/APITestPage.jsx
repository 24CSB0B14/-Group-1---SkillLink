import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/services/api";
import authService from "@/services/auth.service";
import profileService from "@/services/profile.service";
import jobService from "@/services/job.service";
import bidService from "@/services/bid.service";

const APITestPage = () => {
  const [testResults, setTestResults] = useState({});

  const runHealthCheck = async () => {
    try {
      const response = await api.get("/healthCheck");
      setTestResults(prev => ({
        ...prev,
        healthCheck: {
          status: "success",
          data: response.data
        }
      }));
      toast.success("Health check passed!");
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        healthCheck: {
          status: "error",
          error: error.message
        }
      }));
      toast.error("Health check failed!");
    }
  };

  const runAllTests = async () => {
    // Test 1: Health Check
    await runHealthCheck();
    
    // We can add more tests here as we implement more functionality
    toast.success("All tests completed!");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Connection Test</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button onClick={runHealthCheck}>Test Health Check</Button>
                <Button onClick={runAllTests} variant="secondary">Run All Tests</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Health Check</h3>
                  {testResults.healthCheck ? (
                    <div className={`p-4 rounded ${testResults.healthCheck.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                      <p>Status: {testResults.healthCheck.status}</p>
                      {testResults.healthCheck.data && (
                        <pre className="mt-2 text-sm overflow-auto">
                          {JSON.stringify(testResults.healthCheck.data, null, 2)}
                        </pre>
                      )}
                      {testResults.healthCheck.error && (
                        <p>Error: {testResults.healthCheck.error}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Not tested yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Available Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded">
                  <h4 className="font-semibold">API Service</h4>
                  <p className="text-sm text-muted-foreground">Base axios instance</p>
                </div>
                <div className="p-4 border rounded">
                  <h4 className="font-semibold">Auth Service</h4>
                  <p className="text-sm text-muted-foreground">Login, signup, logout</p>
                </div>
                <div className="p-4 border rounded">
                  <h4 className="font-semibold">Profile Service</h4>
                  <p className="text-sm text-muted-foreground">User profile management</p>
                </div>
                <div className="p-4 border rounded">
                  <h4 className="font-semibold">Job Service</h4>
                  <p className="text-sm text-muted-foreground">Job posting and management</p>
                </div>
                <div className="p-4 border rounded">
                  <h4 className="font-semibold">Bid Service</h4>
                  <p className="text-sm text-muted-foreground">Bid placement and management</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default APITestPage;