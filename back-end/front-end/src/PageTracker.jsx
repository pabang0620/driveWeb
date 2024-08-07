// PageTracker.js
import React, { useEffect } from "react";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);
};

function PageTracker() {
  usePageTracking();
  return null;
}

export default PageTracker;
