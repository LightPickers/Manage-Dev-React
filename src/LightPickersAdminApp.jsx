import React from "react";
import { Outlet } from "react-router-dom";

import AdminLayout from "@layouts/AdminLayout";
import Footer from "@layouts/Footer";
import Header from "@layouts/Header";

function LightPickersAdminApp() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default LightPickersAdminApp;
