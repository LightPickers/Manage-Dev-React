import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "@features/auth/authSlice";
import { authApi } from "@features/auth/authApi";
import { productApi } from "@features/products/productApi";
import { couponApi } from "@features/coupons/couponApi";
import { orderApi } from "@features/orders/orderApi";
import { userApi } from "@features/users/userApi";

const apiReducers = {
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [couponApi.reducerPath]: couponApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
};

const apiMiddleware = [
  authApi.middleware,
  productApi.middleware,
  couponApi.middleware,
  orderApi.middleware,
  userApi.middleware,
];

const store = configureStore({
  reducer: {
    auth: authReducer,
    ...apiReducers,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiMiddleware),
});

setupListeners(store.dispatch);

export default store;
