import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api.get("/health")
      .then(res => setStatus(res.data))
      .catch(err => console.error("API error:", err));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>🦷 M Dent Frontend</h1>
      {status ? (
        <pre>{JSON.stringify(status, null, 2)}</pre>
      ) : (
        <p>Loading API status…</p>
      )}
    </div>
  );
}

export default App;
