import { useEffect, useState } from "react";

const TestAPIConnection = () => {
  const [status, setStatus] = useState("Testing...");
  const [details, setDetails] = useState("");

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test direct fetch
        const response = await fetch("/api/v1/healthCheck");
        if (response.ok) {
          const data = await response.json();
          setStatus("✅ Connected");
          setDetails(`Backend responded: ${JSON.stringify(data)}`);
        } else {
          setStatus("❌ Unexpected response");
          setDetails(`Status: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        setStatus("❌ Connection failed");
        setDetails(`Error: ${error.message}`);
        
        // Also try direct URL
        try {
          const directResponse = await fetch("http://localhost:3000/api/v1/healthCheck");
          if (directResponse.ok) {
            const data = await directResponse.json();
            setDetails(prev => `${prev} | Direct URL works: ${JSON.stringify(data)}`);
          }
        } catch (directError) {
          setDetails(prev => `${prev} | Direct URL also failed: ${directError.message}`);
        }
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h3>API Connection Test</h3>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Details:</strong> {details}</p>
    </div>
  );
};

export default TestAPIConnection;