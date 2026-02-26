import { useState } from "react";

function ConnectionTest() {
  const [status, setStatus] = useState("");

  const testConnection = async () => {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setStatus("Success: " + data.message);
    } catch {
      setStatus("Failed to connect to server");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Backend Connection Test</h2>
      <button onClick={testConnection}>Test Connection</button>
      <p>{status}</p>
    </div>
  );
}

export default ConnectionTest;