import { useEffect, useState } from "react";
import axios from "axios";

type Branch = { id: string; name: string };

export default function PortalHome() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios.get(`${api}/public/branches`).then((res) => setBranches(res.data));
  }, [api]);

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>M Dent Booking Portal</h1>
      <p>API: {api}</p>
      <h3>Branches</h3>
      <ul>
        {branches.map((b) => (
          <li key={b.id}>{b.name}</li>
        ))}
      </ul>
    </main>
  );
}
