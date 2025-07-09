import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService } from "@/lib/api";

export default function ApiTest() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testApiConnection = async () => {
    setLoading(true);
    setStatus("Testing API connection...");

    try {
      // Test the API connection by trying to fetch files
      const response = await apiService.getFiles();
      setStatus(
        `✅ API connected successfully! Found ${response.data.length} files.`
      );
    } catch (error) {
      setStatus(
        `❌ API connection failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={testApiConnection}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Testing..." : "Test API Connection"}
        </Button>
        {status && (
          <div className="p-3 bg-gray-100 rounded-md">
            <p className="text-sm">{status}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
