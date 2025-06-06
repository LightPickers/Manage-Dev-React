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
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default LightPickersAdminApp;
