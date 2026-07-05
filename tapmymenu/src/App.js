import React, { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import DigitalMenu from "./DigitalMenu";
import LandingPage from "./LandingPage";

function MenuRoute() {
  const { urlname } = useParams();
  console.log(`MenuRoute: urlname=${urlname}`);
  return <DigitalMenu urlname={urlname} />;
}

function CodeRoute() {
  const { code } = useParams();
  const [urlname, setUrlname] = useState(null);
  const navigate = useNavigate();

  console.log(code)
  
  useEffect(() => {
    async function run() {
      const response = await fetch(`https://${process.env.REACT_APP_API_BASE}/c/${code}`);
      const data = await response.json();
      console.log(`CodeRoute: code=${code}, urlname=${data.menuName}`);
      setUrlname(data.menuName);
      navigate(`/${data.menuName}`, { replace: true });
    }
    run();
  }, [code, navigate]);

  if (urlname === null) return null;

  return <DigitalMenu urlname={urlname} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/c/:code" element={<CodeRoute />} />
        <Route path="/:urlname" element={<MenuRoute />} />
      </Routes>
    </BrowserRouter>
  );
}