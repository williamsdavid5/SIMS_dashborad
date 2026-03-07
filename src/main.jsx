import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { DashboardProvider } from './context/DashboardContext';


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <DashboardProvider>
      <App />
    </DashboardProvider>
  </BrowserRouter>
);