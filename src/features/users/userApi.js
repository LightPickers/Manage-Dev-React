import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
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
  endpoints: builder => ({
    // 變更使用者權限
    toggleUserActiveStatus: builder.mutation({
      query: statusUpdate => ({
        url: "/users/permissions",
        method: "PATCH",
        body: statusUpdate,
      }),
    }),
    // 取得使用者列表
    getUsers: builder.query({
      query: ({ page, per, keyword = "" } = {}) => {
        const params = new URLSearchParams({ page, per, keyword });
        return `/users?${params.toString()}`;
      },
    }),
  }),
});

export const { useToggleUserActiveStatusMutation, useGetUsersQuery } = userApi;
