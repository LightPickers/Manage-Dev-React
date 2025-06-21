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
    // 取得商品列表 - 修改為接受參數
    getProducts: builder.query({
      query: (params = {}) => {
        // 將參數轉換為 URL 查詢字符串
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value.toString());
          }
        });

        const queryString = searchParams.toString();
        return `/products${queryString ? `?${queryString}` : ""}`;
      },
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
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        { type: "Product", id: "LIST" },
      ],
    }),
    // 下架商品
    deactivateProduct: builder.mutation({
      query: ({ productId }) => ({
        url: "/products/pulled",
        method: "PATCH",
        body: {
          id: productId,
        },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        { type: "Product", id: "LIST" },
      ],
    }),
    //重新上架商品
    relistProduct: builder.mutation({
      query: ({ productId }) => ({
        url: "/products/shelved",
        method: "PATCH",
        body: {
          id: productId,
        },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        { type: "Product", id: "LIST" },
      ],
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
  useRelistProductMutation,
  useDeleteProductByIdMutation,
  usePrefetch,
} = productApi;
