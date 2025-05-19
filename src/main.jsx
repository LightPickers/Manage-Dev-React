import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "@assets/all.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import adminRouter from "@routes/router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={adminRouter} />
    <ToastContainer position="bottom-center" autoClose={3000} />
  </React.StrictMode>
);
