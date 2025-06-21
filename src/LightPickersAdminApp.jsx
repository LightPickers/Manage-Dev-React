import { useEffect } from "react";
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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "85vh" }}>
      <Header />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default LightPickersAdminApp;
