import { z } from "zod";

export const productCreateSchema = z.object({
  primary_image: z.string({ required_error: "請上傳主圖" }).min(1, "請上傳主圖"),
  sub_images: z.array(z.string()).optional(),
  name: z.string().min(1, "商品名稱為必填"),
  category_id: z.string().min(1, "請選擇商品分類"),
  condition_id: z.string().min(1, "請選擇商品保存狀態"),
  summary: z.array(z.string().min(1, "請填寫商品簡介")).min(1, "請至少填寫一項商品簡介"),
  title: z.string().min(1, "商品描述標題為必填"),
  subtitle: z.string().min(1, "商品描述副標題為必填"),
  description: z.any().refine(
    delta =>
      typeof delta === "object" &&
      Array.isArray(delta.ops) &&
      delta.ops.every(op => typeof op.insert === "string") &&
      delta.ops
        .map(op => op.insert)
        .join("")
        .trim().length > 0,
    { message: "商品完整描述為必填" }
  ),
  is_available: z.enum(["true", "false"], {
    required_error: "請選擇商品是否供應",
    invalid_type_error: "請選擇商品是否供應",
  }),
  is_featured: z.enum(["true", "false"], {
    required_error: "請選擇商品是否為精選",
    invalid_type_error: "請選擇商品是否為精選",
  }),
  brand_id: z.string().min(1, "請選擇商品品牌"),
  original_price: z.coerce
    .number({ invalid_type_error: "市售價格式錯誤，請輸入數字" })
    .min(1, "市售價必須大於 0"),
  selling_price: z.coerce
    .number({ invalid_type_error: "本網站價格式錯誤，請輸入數字" })
    .min(1, "網站售價必須大於 0"),
  hashtag1: z
    .string()
    .optional()
    .refine(val => !val || val.startsWith("#"), {
      message: "必須以 # 開頭",
    }),
  hashtag2: z
    .string()
    .optional()
    .refine(val => !val || val.startsWith("#"), {
      message: "必須以 # 開頭",
    }),
  hashtag3: z
    .string()
    .optional()
    .refine(val => !val || val.startsWith("#"), {
      message: "必須以 # 開頭",
    }),
});
