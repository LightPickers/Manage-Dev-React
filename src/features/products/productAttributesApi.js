import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 前台產品相關 API
export const productAttributesApi = createApi({
  reducerPath: "productAttributesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE,
  }),
  tagTypes: ["Category", "Brand", "Condition"],
  endpoints: builder => ({
    // 取得商品類別
    getProductCategory: builder.query({
      query: () => "/categories",
      providesTags: ["Category"],
    }),
    // 取得商品品牌
    getProductBrands: builder.query({
      query: () => "/brands",
      providesTags: ["Brand"],
    }),
    // 取得商品狀況列表
    getProductConditions: builder.query({
      query: () => "/conditions",
      providesTags: ["Condition"],
    }),
  }),
});

export const {
  useGetProductConditionsQuery,
  useGetProductBrandsQuery,
  useGetProductCategoryQuery,
} = productAttributesApi;
