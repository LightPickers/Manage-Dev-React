import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@assets/all.scss";

import adminRouter from "@routes/router";
import store from "@/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={adminRouter} />
      <ToastContainer position="bottom-center" autoClose={3000} />
    </Provider>
  </React.StrictMode>
);
