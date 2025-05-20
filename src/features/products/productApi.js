import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
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
  tagTypes: ["Product"],
  endpoints: builder => ({
    // 取得商品列表
    getProducts: builder.query({
      query: () => "/products",
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Product", id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    // 取得單一商品
    getProductById: builder.query({
      query: productId => `/products/${productId}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    // 新增商品
    createProduct: builder.mutation({
      query: newProduct => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    // 修改商品
    updateProduct: builder.mutation({
      query: ({ productId, updatedProduct }) => ({
        url: `/products/${productId}`,
        method: "PUT",
        body: updatedProduct,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }],
    }),
    // 下架商品
    deactivateProduct: builder.mutation({
      query: ({ productId, statusUpdate }) => ({
        url: `/products/${productId}`,
        method: "PATCH",
        body: statusUpdate,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }],
    }),
    // 刪除商品
    deleteProductById: builder.mutation({
      query: productId => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, productId) => [
        { type: "Product", id: productId },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeactivateProductMutation,
  useDeleteProductByIdMutation,
  usePrefetch,
} = productApi;
