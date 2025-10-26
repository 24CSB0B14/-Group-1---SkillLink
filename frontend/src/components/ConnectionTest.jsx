import { useEffect, useState } from "react";
import api from "@/services/api";

const ConnectionTest = () => {
  const [status, setStatus] = useState("Testing...");
  const [details, setDetails] = useState("");

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get("/healthCheck");
        if (response.data.status === "OK" || response.data.statusCode === 200) {
          setStatus("✅ Connected");
          setDetails(`Backend responded: ${JSON.stringify(response.data)}`);
        } else {
          setStatus("❌ Unexpected response");
          setDetails(JSON.stringify(response.data));
        }
      } catch (error) {
        setStatus("❌ Connection failed");
        setDetails(`Error: ${error.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 bg-card rounded-lg border">
      <h3 className="text-lg font-semibold mb-2">API Connection Test</h3>
      <p className="font-mono">{status}</p>
      <p className="text-sm text-muted-foreground mt-2">{details}</p>
    </div>
  );
};

export default ConnectionTest;