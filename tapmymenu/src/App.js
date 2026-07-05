import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import DigitalMenu from "./DigitalMenu";

function MenuRoute() {
  const { urlname } = useParams();
  console.log(`MenuRoute: urlname=${urlname}`);
  return <DigitalMenu urlname={urlname} />;
}
function CodeRoute({ code }) {
  const [urlname, setUrlname] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    console.log(`API_BASE: ${process.env.REACT_APP_API_BASE}`);

    fetch(`https://${process.env.REACT_APP_API_BASE}/c/${code}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        console.log(`CodeRoute: code=${code}, urlname=${data.menuName}`);
        setUrlname(data.menuName);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [code]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Couldn't load menu — {error}</div>;

  return <DigitalMenu urlname={urlname} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/c/:code" element={<CodeRoute />} />
        <Route path="/:urlname" element={<MenuRoute />} />
      </Routes>
    </BrowserRouter>
  );
}