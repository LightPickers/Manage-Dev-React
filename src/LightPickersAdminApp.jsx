import React from "react";
import { Outlet } from "react-router-dom";

import AdminLayout from "@layouts/AdminLayout";

function LightPickersAdminApp() {
  return (
    <div>
      <AdminLayout />
      <Outlet />
    </div>
  );
}

export default LightPickersAdminApp;
