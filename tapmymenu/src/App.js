import React, { useState, useEffect } from 'react';
import {
  useNavigate,
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useLocation,
} from "react-router-dom";
import DigitalMenu from "./DigitalMenu/";
import ReviewsPage from "./ReviewsPage";
import LandingPage from "./LandingPage.world";
import { AnalyticsProvider, useAnalytics } from "./DigitalMenu/core/Analytics";

const ANALYTICS_CLIENT_ID = "00000000-0000-4000-8000-000000000001";

/**
 * Routes that only exist to redirect somewhere else. They report their own
 * entry event, so the automatic page view is suppressed for them — otherwise
 * every QR scan would count as two views.
 */
const REDIRECT_ONLY = [/^\/qr\//, /^\/c\//];

function MenuRoute() {
  const { urlname } = useParams();
  return <DigitalMenu urlname={urlname} theme="luxury" />;
}

function QrRoute() {
  const { urlname } = useParams();
  const navigate = useNavigate();
  const track = useAnalytics();

  useEffect(() => {
    // Recorded before the redirect, so the QR scan is not lost when the
    // URL is replaced.
    track("qr_scan", urlname);
    navigate(`/${urlname}`, { replace: true });
  }, [urlname, navigate, track]);

  return <DigitalMenu urlname={urlname} theme="luxury" />;
}

function CodeRoute({ review }) {
  const { code } = useParams();
  const [urlname, setUrlname] = useState(null);
  const navigate = useNavigate();
  const track = useAnalytics();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const response = await fetch(
          `https://${process.env.REACT_APP_API_BASE}/c/${code}`
        );
        const data = await response.json();
        if (cancelled) return;

        track(review ? "code_scan_review" : "code_scan", data.menuName);

        setUrlname(data.menuName);
        navigate(review ? `/${data.menuName}/reviews` : `/${data.menuName}`, {
          replace: true,
        });
      } catch {
        if (!cancelled) track("code_scan_failed", code);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [code, navigate, review, track]);

  if (urlname === null) return null;

  return <DigitalMenu code={code} urlname={urlname} theme="luxury" />;
}

function ReviewRoute() {
  const { urlname } = useParams();
  return <ReviewsPage urlname={urlname} />;
}

/**
 * Lives inside BrowserRouter so it can read the current location, and wraps
 * Routes so every route component can call useAnalytics().
 */
function TrackedRoutes() {
  const { pathname } = useLocation();
  const skipView = REDIRECT_ONLY.some((re) => re.test(pathname));

  return (
    <AnalyticsProvider
      clientId={ANALYTICS_CLIENT_ID}
      path={skipView ? null : pathname}
    >
      <Routes>
        <Route path="/" element={<LandingPage locale="en" />} />
        <Route path="/qr/:urlname" element={<QrRoute />} />
        <Route path="/c/:code" element={<CodeRoute />} />
        <Route path="/c/:code/r" element={<CodeRoute review={true} />} />
        <Route path="/:urlname" element={<MenuRoute />} />
        <Route path="/:urlname/reviews" element={<ReviewRoute />} />
      </Routes>
    </AnalyticsProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TrackedRoutes />
    </BrowserRouter>
  );
}