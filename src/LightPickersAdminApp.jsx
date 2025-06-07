import { React, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";

import AdminLayout from "@layouts/AdminLayout";
import Footer from "@layouts/Footer";
import Header from "@layouts/Header";

import { setVerified } from "./features/auth/authSlice";

function LightPickersAdminApp() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setVerified());
  }, [dispatch]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1, paddingBottom: "60px" }}>
        <Outlet />
      </div>
      <Footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: "60px",
        }}
      />
    </div>
  );
}

export default LightPickersAdminApp;
