import React, { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import DigitalMenu from "./DigitalMenu/";
import ReviewsPage from "./ReviewsPage";
import LandingPage from "./LandingPage.world";

function MenuRoute() {
  const { urlname } = useParams();
  // console.log(`MenuRoute: urlname=${urlname}`);
  return <DigitalMenu urlname={urlname} theme="luxury" />;
}

function QrRoute() {
  const { urlname } = useParams();
  const navigate = useNavigate();

  // console.log(`QrRoute: urlname=${urlname}`);
  // TODO: Implement a fetch call to analytics component to know how many shares via QR we get.
  useEffect(() => {
    navigate(`/${urlname}`, { replace: true });
  })
  return <DigitalMenu urlname={urlname} theme="luxury" />;
}

function CodeRoute({ review }) {
  const { code } = useParams();
  const [urlname, setUrlname] = useState(null);
  const navigate = useNavigate();

  // console.log(code)
  
  useEffect(() => {
    async function run() {
      const response = await fetch(`https://${process.env.REACT_APP_API_BASE}/c/${code}`);
      const data = await response.json();
      // console.log(`CodeRoute: code=${code}, urlname=${data.menuName}`);
      if (review) {
        setUrlname(data.menuName);
        navigate(`/${data.menuName}/reviews`, { replace: true });
        return;
      }
      setUrlname(data.menuName);
      navigate(`/${data.menuName}`, { replace: true });
    }
    run();
  }, [code, navigate]);

  if (urlname === null) return null;

  return <DigitalMenu code={code} urlname={urlname} theme="luxury" />;
}

function ReviewRoute() {
  const { urlname } = useParams();
  // console.log(`ReviewRoute: urlname=${urlname}`);
  return <ReviewsPage urlname={urlname} />;
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage locale="en" />} />
        <Route path="/qr/:urlname" element={<QrRoute />} />
        <Route path="/c/:code" element={<CodeRoute />} />
        <Route path="/c/:code/r" element={<CodeRoute review={true} />} />
        <Route path="/:urlname" element={<MenuRoute />} />
        <Route path="/:urlname/reviews" element={<ReviewRoute />} />
      </Routes>
    </BrowserRouter>
  );
}