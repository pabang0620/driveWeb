import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ReactGA from "react-ga4";

const measurementId = process.env.REACT_APP_MEASUREMENT_ID;

ReactGA.initialize(
  measurementId
  // { debug: true }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
