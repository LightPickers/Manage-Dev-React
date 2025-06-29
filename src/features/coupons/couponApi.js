import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const couponApi = createApi({
  reducerPath: "couponApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_ADMIN_API_BASE,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Coupon"],
  endpoints: builder => ({
    getCoupons: builder.query({
      query: ({ page, per, keyword = "" } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (per) params.append("per", per);
        if (keyword) params.append("keyword", keyword);
        return `/coupons?${params}`;
      },
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Coupon", id })),
              { type: "Coupon", id: "LIST" },
            ]
          : [{ type: "Coupon", id: "LIST" }],
    }),
    // 取得單一優惠券
    getCouponById: builder.query({
      query: couponId => `/coupons/${couponId}`,
      providesTags: (result, error, id) => [{ type: "Coupon", id }],
    }),
    // 新增優惠券
    createCoupon: builder.mutation({
      query: newCoupon => ({
        url: "/coupons",
        method: "POST",
        body: newCoupon,
      }),
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),
    // 修改優惠券
    updateCoupon: builder.mutation({
      query: ({ couponId, updatedCoupon }) => ({
        url: `/coupons/${couponId}`,
        method: "PUT",
        body: updatedCoupon,
      }),
      invalidatesTags: (result, error, { couponId }) => [
        { type: "Coupon", id: couponId },
        { type: "Coupon", id: "LIST" },
      ],
    }),
    // 切換優惠券啟用狀態
    toggleCouponActiveStatus: builder.mutation({
      query: ({ id, is_available }) => ({
        url: `/coupons/${id}`,
        method: "PATCH",
        body: { is_available },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Coupon", id },
        { type: "Coupon", id: "LIST" },
      ],
    }),
    // 刪除優惠券
    deleteCouponById: builder.mutation({
      query: couponId => ({
        url: `/coupons/${couponId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, couponId) => [
        { type: "Coupon", id: couponId },
        { type: "Coupon", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateCouponMutation,
  useDeleteCouponByIdMutation,
  useGetCouponByIdQuery,
  useGetCouponsQuery,
  usePrefetch,
  useUpdateCouponMutation,
  useToggleCouponActiveStatusMutation,
} = couponApi;
