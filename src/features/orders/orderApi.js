import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_ADMIN_API_BASE,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Order"],
  endpoints: builder => ({
    // 取得訂單列表
    getOrders: builder.query({
      query: ({ page = 1, per = 10, status = "", keyword = "" } = {}) => {
        const params = new URLSearchParams({ page, per, status, keyword });
        return `/orders?${params.toString()}`;
      },
      providesTags: result =>
        result?.data.orders
          ? [
              ...result.data.orders.map(({ id }) => ({ type: "Order", id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),
    // 取得單一訂單
    getOrderById: builder.query({
      query: orderId => `/orders/${orderId}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    // 變更訂單狀態
    updateOrderStatus: builder.mutation({
      query: ({ orderId, statusUpdate }) => ({
        url: `/order/${orderId}`,
        method: "PATCH",
        body: statusUpdate,
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Order", id: orderId }],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  usePrefetch,
} = orderApi;
