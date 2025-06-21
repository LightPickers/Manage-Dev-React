import { z } from "zod";

export const productFormSchema = z.object({
  primary_image: z.string({ required_error: "請上傳主圖" }).min(1, "請上傳主圖"),
  sub_images: z.array(z.string()).optional(),
  name: z.string().min(1, "商品名稱為必填"),
  category_id: z.string().min(1, "請選擇商品分類"),
  condition_id: z.string().min(1, "請選擇商品保存狀態"),
  summary: z.array(z.string().min(1, "請填寫商品簡介")).min(1, "請至少填寫 1 項商品簡介"),
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
  original_price: z.preprocess(
    val => (val === "" ? undefined : Number(val)),
    z
      .number({ required_error: "請填寫市售價", invalid_type_error: "格式錯誤，請輸入數字" })
      .positive("售價必須大於 0")
  ),
  selling_price: z.preprocess(
    val => (val === "" ? undefined : Number(val)),
    z
      .number({ required_error: "請填寫網站售價", invalid_type_error: "格式錯誤，請輸入數字" })
      .positive("售價必須大於 0")
  ),
  hashtag: z.array(z.string().min(1, "請填寫標籤")).min(1, "請至少填寫 1 項標籤"),
});
