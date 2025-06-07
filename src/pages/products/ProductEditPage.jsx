import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import { useUploadImageMutation } from "@/features/upload/uploadApi";
import { useGetProductByIdQuery, useUpdateProductMutation } from "@/features/products/productApi";
import { productFormSchema } from "@/schemas/products/productFormSchema";
import {
  useGetProductBrandsQuery,
  useGetProductCategoryQuery,
  useGetProductConditionsQuery,
} from "@/features/products/productAttributesApi";

function ProductEditPage() {
  const navigate = useNavigate();
  const ADMIN_APP_BASE = import.meta.env.VITE_ADMIN_APP_BASE;

  const { productId } = useParams();
  const { data: productData, isLoading: isGetProductLoading } = useGetProductByIdQuery(productId);

  const [imageUrl, setImageUrl] = useState("");
  const [subImages, setSubImages] = useState([]);
  const [uploadImage] = useUploadImageMutation();
  const [isUploadingPrimaryImage, setIsUploadingPrimaryImage] = useState(false);
  const [isUploadingSubImages, setIsUploadingSubImages] = useState(false);

  const { data: categoryData } = useGetProductCategoryQuery();
  const categoryList = categoryData?.data || [];
  const { data: conditionsData } = useGetProductConditionsQuery();
  const conditionsList = conditionsData?.data || [];
  const { data: brandsData } = useGetProductBrandsQuery();
  const brandsList = brandsData?.data || [];

  const quillRef = useRef(null);

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const {
    control,
    handleSubmit,
    register,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productFormSchema),
    mode: "onBlur",
    defaultValues: {
      primary_image: "",
      images: [],
      name: "",
      category_id: "",
      condition_id: "",
      summary: [""],
      description: "",
      title: "",
      subtitle: "",
      is_available: "true",
      is_featured: "false",
      brand_id: "",
      original_price: "",
      selling_price: "",
      hashtag: [""],
    },
  });

  const {
    fields: summaryFields,
    append: summaryAppend,
    remove: summaryRemove,
  } = useFieldArray({
    control,
    name: "summary",
  });

  const {
    fields: hashtagFields,
    append: hashtagAppend,
    remove: hashtagRemove,
  } = useFieldArray({
    control,
    name: "hashtag",
  });

  useEffect(() => {
    if (!quillRef.current) return;

    if (!quillRef.current.__quill) {
      const quill = new Quill(quillRef.current, {
        theme: "snow",
        placeholder: "請輸入商品完整描述",
      });

      quillRef.current.__quill = quill;

      quill.on("text-change", () => {
        const delta = quill.getContents();
        setValue("description", delta);
        trigger("description");
      });
    }

    if (productData?.data?.description && quillRef.current.__quill) {
      quillRef.current.__quill.setContents(productData.data.description);
    }
  }, [productData, setValue, trigger]);

  useEffect(() => {
    if (productData) {
      reset({
        name: productData.data.name,
        category_id: productData.data.Categories.id,
        condition_id: productData.data.Conditions.id,
        summary: productData.data.summary,
        description: productData.data.description,
        title: productData.data.title,
        subtitle: productData.data.subtitle,
        is_available: String(productData.data.is_available),
        is_featured: String(productData.data.is_featured),
        brand_id: productData.data.Brands.id,
        original_price: String(productData.data.original_price),
        selling_price: String(productData.data.selling_price),
        primary_image: productData.data.primary_image,
        hashtag: productData.data.hashtags,
      });

      setImageUrl(productData.data.primary_image);
      setSubImages(productData.imageList || []);
    }
  }, [reset, productData]);

  const handleAddSummaryLine = async () => {
    const lastIndex = summaryFields.length - 1;
    const isValid = await trigger(`summary.${lastIndex}`);
    if (isValid) {
      summaryAppend("");
    } else {
      toast.error("請先填寫前 1 行簡介");
    }
  };

  const handleAddHashtagField = async () => {
    const lastIndex = hashtagFields.length - 1;
    const isValid = await trigger(`hashtag.${lastIndex}`);
    if (hashtagFields.length >= 3) {
      toast.warning("最多只能新增 3 個標籤");
      return;
    }
    if (isValid) {
      hashtagAppend("");
    } else {
      toast.warning("請先填寫前 1 個標籤");
    }
  };

  const onSubmit = async data => {
    const images = subImages
      .map(item => (typeof item === "string" ? item : item.image))
      .filter(Boolean);

    const payload = {
      name: data.name,
      category_id: data.category_id,
      condition_id: data.condition_id,
      summary: data.summary,
      description: data.description,
      title: data.title,
      subtitle: data.subtitle,
      is_available: data.is_available === "true",
      is_featured: data.is_featured === "true",
      brand_id: data.brand_id,
      original_price: Number(data.original_price),
      selling_price: Number(data.selling_price),
      primary_image: imageUrl,
      images,
      hashtags: data.hashtag.map(tag => (tag.startsWith("#") ? tag : `#${tag}`)),
    };

    try {
      await updateProduct({ productId, updatedProduct: payload }).unwrap();
      toast.success("商品修改成功");
      navigate("/products");
    } catch {
      toast.error("商品修改失敗");
    }
  };

  if (isGetProductLoading) {
    return <div className="container text-center py-20">載入中...</div>;
  }

  return (
    <>
      <div className="bg-gray-100">
        <div className="container">
          <div className="d-flex flex-column gap-10 py-10 py-lg-20">
            {/* 麵包屑 */}
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link className="text-gray-" to="/dashboard">
                    首頁
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/products">商品列表</Link>
                </li>
                <li className="breadcrumb-item active">修改商品</li>
              </ol>
            </nav>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="d-flex flex-column gap-10">
                {/* 標題 基本資訊 */}
                <div className="d-flex flex-column text-gray-500 gap-3">
                  <h3>基本資訊</h3>
                  <div className="divider-line"></div>
                </div>

                {/* 圖片上傳 post upload */}
                <div className="d-flex flex-column flex-lg-row gap-10 gap-lg-0 justify-content-around">
                  {/* 主圖 primary_image */}
                  <div className="d-flex flex-column align-items-center gap-4">
                    <label className="form-label fw-bold text-gray-500 m-0">商品主要圖片</label>
                    <div style={{ position: "relative" }}>
                      <label
                        htmlFor="primaryImageInput"
                        style={{ cursor: "pointer", display: "inline-block", textAlign: "center" }}
                      >
                        <img
                          src={imageUrl || `${ADMIN_APP_BASE}uploadImage.png`}
                          alt="點擊上傳"
                          className={errors.primary_image ? "border border-danger" : ""}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            border: errors.primary_image ? "1px solid #dc3545" : "1px dashed #ccc",
                            borderRadius: 4,
                            backgroundColor: "white",
                          }}
                        />
                      </label>
                    </div>
                    {isUploadingPrimaryImage && (
                      <div className="text-muted small">圖片上傳中...</div>
                    )}
                    <input
                      id="primaryImageInput"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setIsUploadingPrimaryImage(true);
                        const formData = new FormData();
                        formData.append("files", file);
                        try {
                          const res = await uploadImage(formData).unwrap();
                          setImageUrl(res.data.image_urls?.[0]);
                          setValue("primary_image", res.data.image_urls?.[0]);
                          trigger("primary_image");
                          toast.success("主圖上傳成功");
                          setIsUploadingPrimaryImage(false);
                        } catch (err) {
                          console.error("上傳失敗", err);
                          toast.error("主圖上傳失敗");
                          setIsUploadingPrimaryImage(false);
                        }
                      }}
                    />
                    {errors.primary_image && (
                      <div className="invalid-feedback text-center d-block">
                        {errors.primary_image.message}
                      </div>
                    )}
                  </div>
                  {/* 副圖 images */}
                  <div className="d-flex flex-column align-items-center gap-4">
                    <label className="form-label fw-bold text-gray-500 m-0">
                      商品其他圖片（可多選）
                    </label>
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                      {subImages.map((item, index) => (
                        <div key={index} style={{ position: "relative" }}>
                          <img
                            src={item.image}
                            alt={`副圖 ${index + 1}`}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              border: "1px solid #ccc",
                              borderRadius: 4,
                            }}
                          />
                        </div>
                      ))}
                      {subImages.length < 5 && (
                        <label htmlFor="subImagesInput" style={{ cursor: "pointer" }}>
                          <img
                            src={"/uploadImage.png"}
                            alt="點擊上傳"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              border: "1px dashed #ccc",
                              borderRadius: 4,
                              backgroundColor: "white",
                            }}
                          />
                        </label>
                      )}
                    </div>
                    {isUploadingSubImages && <div className="text-muted small">圖片上傳中...</div>}
                    <input
                      id="subImagesInput"
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      onChange={async e => {
                        const files = Array.from(e.target.files);
                        if (subImages.length + files.length > 5) {
                          return toast.error("最多只能上傳 5 張圖片");
                        }
                        setIsUploadingSubImages(true);
                        const uploadedUrls = [];
                        for (const file of files) {
                          const formData = new FormData();
                          formData.append("files", file);
                          try {
                            const res = await uploadImage(formData).unwrap();
                            uploadedUrls.push({ image: res.data.image_urls[0] });
                          } catch (err) {
                            console.error("圖片上傳失敗", err);
                          }
                        }
                        setSubImages(prev => [...prev, ...uploadedUrls]);
                        if (uploadedUrls.length > 0) {
                          toast.success("副圖上傳成功");
                        }
                        setIsUploadingSubImages(false);
                      }}
                    />
                  </div>
                </div>

                {/* 商品名稱 name */}
                <div className="d-flex flex-column gap-4">
                  <label className="form-label m-0 fw-bold text-gray-500">商品名稱</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="商品名稱＋商品類型＋重要功能（材質 / 顏色 / 尺寸 / 規格）"
                    {...register("name")}
                  />
                  {errors.name && <div className="invalid-feedback m-0">{errors.name.message}</div>}
                </div>

                <div className="row gap-10 gap-lg-0">
                  {/* 商品分類 */}
                  <div className="d-flex flex-column gap-4 col-lg-6">
                    <label className="form-label fw-bold text-gray-500 m-0">商品類別</label>
                    <select
                      className={`form-select ${errors.category_id ? "is-invalid" : ""}`}
                      {...register("category_id")}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        請選擇商品類別
                      </option>
                      {categoryList.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && (
                      <div className="invalid-feedback">{errors.category_id.message}</div>
                    )}
                  </div>

                  {/* 保存狀況 */}
                  <div className="d-flex flex-column gap-4 col-lg-6">
                    <label className="form-label fw-bold text-gray-500 m-0">商品保存狀況</label>
                    <select
                      className={`form-select ${errors.condition_id ? "is-invalid" : ""}`}
                      {...register("condition_id")}
                    >
                      <option value="" disabled>
                        請選擇商品保存狀況
                      </option>
                      {conditionsList.map(condition => (
                        <option key={condition.id} value={condition.id}>
                          {condition.name}
                        </option>
                      ))}
                    </select>
                    {errors.condition_id && (
                      <div className="invalid-feedback">{errors.condition_id.message}</div>
                    )}
                  </div>
                </div>

                {/* 商品簡介 summary*/}
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label m-0 fw-bold text-gray-500">商品簡介</label>
                    <button
                      type="button"
                      className="btn btn-custom-primary small border-0 rounded-2 px-3 py-1 shadow-none"
                      onClick={handleAddSummaryLine}
                    >
                      + 新增一行簡介
                    </button>
                  </div>
                  {summaryFields.map((field, index) => (
                    <div key={field.id} className="d-flex flex-column gap-4">
                      <div className="d-flex gap-4 align-items-center">
                        <input
                          type="text"
                          className={`form-control ${errors.summary?.[index] ? "is-invalid" : ""}`}
                          placeholder={`請輸入商品簡介（第 ${index + 1} 行）`}
                          {...register(`summary.${index}`)}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm rounded-2"
                          style={{ minWidth: "50px" }}
                          onClick={() => {
                            if (summaryFields.length === 1) {
                              toast.error("請至少填寫 1 項商品簡介");
                              return;
                            }
                            summaryRemove(index);
                          }}
                        >
                          移除
                        </button>
                      </div>
                      {errors.summary?.[index] && (
                        <div className="invalid-feedback d-block">
                          {errors.summary[index].message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="row gap-10 gap-lg-0">
                  {/* 商品描述標題 title*/}
                  <div className="d-flex flex-column gap-4 col-lg-6">
                    <label className="form-label m-0 fw-bold text-gray-500">商品描述標題</label>
                    <input
                      type="text"
                      className={`form-control ${errors.title ? "is-invalid" : ""}`}
                      placeholder="請輸入商品描述標題"
                      {...register("title")}
                    />
                    {errors.title && (
                      <div className="invalid-feedback m-0">{errors.title.message}</div>
                    )}
                  </div>

                  {/* 商品描述副標題 subtitle */}
                  <div className="d-flex flex-column gap-4 col-lg-6">
                    <label className="form-label m-0 fw-bold text-gray-500">商品描述副標題</label>
                    <input
                      type="text"
                      className={`form-control ${errors.subtitle ? "is-invalid" : ""}`}
                      placeholder="請輸入商品描述副標題"
                      {...register("subtitle")}
                    />
                    {errors.subtitle && (
                      <div className="invalid-feedback m-0">{errors.subtitle.message}</div>
                    )}
                  </div>
                </div>

                {/* 商品完整描述 quill */}
                <div className="d-flex flex-column gap-2">
                  <label className="form-label fw-bold text-gray-500 m-0">商品完整描述</label>
                  <div
                    className={`quill-wrapper border rounded-top-2 ${errors.description ? "border-danger" : "border-secondary"}`}
                  >
                    <div
                      ref={quillRef}
                      className="quill-editor bg-white rounded-bottom-2 border-0"
                    />
                  </div>

                  {/* 錯誤訊息 */}
                  {errors.description && (
                    <div className="small" style={{ color: "rgb(220, 53, 69)" }}>
                      {errors.description.message}
                    </div>
                  )}
                </div>

                <div className="row">
                  {/* 商品是否供應 is_available */}
                  <div className="d-flex flex-column gap-4 col-lg-6">
                    <label className="form-label m-0 fw-bold text-gray-500">商品是否供應</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="isAvailableYes"
                          value="true"
                          {...register("is_available")}
                        />
                        <label className="form-check-label" htmlFor="isAvailableYes">
                          是
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="isAvailableNo"
                          value="false"
                          {...register("is_available")}
                        />
                        <label className="form-check-label" htmlFor="isAvailableNo">
                          否
                        </label>
                      </div>
                    </div>
                    {errors.is_available && (
                      <div className="invalid-feedback m-0 d-block">
                        {errors.is_available.message}
                      </div>
                    )}
                  </div>

                  {/* 商品是否為精選商品 is_featured */}
                  <div className="d-flex flex-column gap-4 col-lg-6">
                    <label className="form-label m-0 fw-bold text-gray-500">
                      商品是否為精選商品
                    </label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="isFeaturedYes"
                          value="true"
                          {...register("is_featured")}
                        />
                        <label className="form-check-label" htmlFor="isFeaturedYes">
                          是
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="isFeaturedNo"
                          value="false"
                          {...register("is_featured")}
                        />
                        <label className="form-check-label" htmlFor="isFeaturedNo">
                          否
                        </label>
                      </div>
                    </div>
                    {errors.is_featured && (
                      <div className="invalid-feedback m-0 d-block">
                        {errors.is_featured.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* 標題 屬性 */}
                <div className="d-flex flex-column gap-3 text-gray-500">
                  <h3>屬性</h3>
                  <div className="divider-line"></div>
                </div>

                <div className="d-flex align-items-center gap-10 gap-lg-0 row">
                  {/* 商品品牌 */}
                  <div className="d-flex flex-column gap-4 col-lg-4">
                    <label className="form-label fw-bold text-gray-500 m-0">商品品牌</label>
                    <select
                      className={`form-select ${errors.brand_id ? "is-invalid" : ""}`}
                      {...register("brand_id")}
                    >
                      <option value="" disabled>
                        請選擇商品品牌
                      </option>
                      {brandsList.map(brand => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                    {errors.brand_id && (
                      <div className="invalid-feedback">{errors.brand_id.message}</div>
                    )}
                  </div>

                  {/* 市售價 original_price*/}
                  <div className="d-flex flex-column gap-4 col-lg-4">
                    <label className="form-label m-0 fw-bold text-gray-500">市售價</label>
                    <input
                      type="text"
                      className={`form-control ${errors.original_price ? "is-invalid" : ""}`}
                      placeholder="請填寫"
                      {...register("original_price")}
                    />
                    {errors.original_price && (
                      <div className="invalid-feedback m-0">{errors.original_price.message}</div>
                    )}
                  </div>

                  {/* 網站售價 selling_price*/}
                  <div className="d-flex flex-column gap-4 col-lg-4">
                    <label className="form-label m-0 fw-bold text-gray-500">本網站售價</label>
                    <input
                      type="text"
                      className={`form-control ${errors.selling_price ? "is-invalid" : ""}`}
                      placeholder="請填寫"
                      {...register("selling_price")}
                    />
                    {errors.selling_price && (
                      <div className="invalid-feedback m-0">{errors.selling_price.message}</div>
                    )}
                  </div>
                </div>

                {/* Hashtags 輸入區塊 */}
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label m-0 fw-bold text-gray-500">商品標籤</label>
                    <button
                      type="button"
                      className="btn btn-custom-primary small border-0 rounded-2 px-3 py-1 shadow-none"
                      onClick={handleAddHashtagField}
                    >
                      + 新增商品標籤
                    </button>
                  </div>
                  <div className="row gap-4 gap-lg-0">
                    {hashtagFields.map((field, index) => (
                      <div key={field.id} className="col-lg-4">
                        <div className="d-flex gap-4 align-items-center">
                          <input
                            type="text"
                            className={`form-control ${errors.hashtag?.[index] ? "is-invalid" : ""}`}
                            placeholder={`請輸入商品標籤（第 ${index + 1} 個）`}
                            {...register(`hashtag.${index}`)}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm rounded-2 col-1"
                            style={{ minWidth: "50px" }}
                            onClick={() => {
                              if (hashtagFields.length === 1) {
                                toast.warning("請至少填寫 1 項商品標籤");
                                return;
                              }
                              hashtagRemove(index);
                            }}
                          >
                            移除
                          </button>
                        </div>
                        {errors.hashtag?.[index] && (
                          <div className="invalid-feedback d-block">
                            {errors.hashtag[index].message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 新增商品上架按鈕 */}
                <div className="d-flex justify-content-end gap-5">
                  <button
                    type="button"
                    className="btn btn-custom-primary small"
                    onClick={() => navigate("/products")}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="btn btn-custom-primary small"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "商品修改中..." : "修改商品"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductEditPage;
