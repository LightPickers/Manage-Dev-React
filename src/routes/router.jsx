// router.jsx
import { createHashRouter } from "react-router-dom";
import { element } from "prop-types";
import { Navigate } from "react-router-dom";

import {
  LoginPage,
  DashboardPage,
  ProductCreatePage,
  ProductEditPage,
  ProductListPage,
  CouponCreatePage,
  CouponEditPage,
  CouponListPage,
  UserListPage,
  OrderListPage,
  ErrorPage,
} from "@pages";
import LightPickersAdminApp from "@/LightPickersAdminApp";
import ProtectedRoute from "@/components/ProtectedRoute";

const ROUTES = {
  DASHBOARD: "/dashboard",
  LOGIN: "login",
  USER: "/users",
  ORDER: "/orders",
  PRODUCTS: {
    LIST: "/products",
    CREATE: "/products/new",
    EDIT: "/products/:productId/edit",
  },
  COUPONS: {
    LIST: "/coupons",
    CREATE: "/coupons/new",
    EDIT: "/coupons/:couponId/edit",
  },
};

// 商品管理
const productRoutes = [
  {
    path: ROUTES.PRODUCTS.LIST,
    element: <ProductListPage />,
  },
  {
    path: ROUTES.PRODUCTS.CREATE,
    element: <ProductCreatePage />,
  },
  {
    path: ROUTES.PRODUCTS.EDIT,
    element: <ProductEditPage />,
  },
];

// 優惠券管理
const couponRoutes = [
  {
    path: ROUTES.COUPONS.LIST,
    element: <CouponListPage />,
  },
  {
    path: ROUTES.COUPONS.CREATE,
    element: <CouponCreatePage />,
  },
  {
    path: ROUTES.COUPONS.EDIT,
    element: <CouponEditPage />,
  },
];

const otherRoutes = [
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardPage />,
  },
  {
    path: ROUTES.ORDER,
    element: <OrderListPage />,
  },
  {
    path: ROUTES.USER,
    element: <UserListPage />,
  },
];

const adminPages = [...productRoutes, ...couponRoutes, ...otherRoutes];
const adminRoutes = [
  {
    path: "login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <LightPickersAdminApp />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" />,
      },
      {
        element: <ProtectedRoute />,
        children: adminPages,
      },
    ],
  },
];
const adminRouter = createHashRouter(adminRoutes);

export default adminRouter;
