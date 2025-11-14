import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const api = process.env.NEXT_PUBLIC_API_URL;

  const login = async () => {
    const res = await axios.post(`${api}/internal/auth/login`, {});
    setToken(res.data.token);
  };

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>M Dent Internal App</h1>
      <p>API: {api}</p>
      <button onClick={login}>Login (stub)</button>
      {token && <p>Token: {token}</p>}
    </main>
  );
}
