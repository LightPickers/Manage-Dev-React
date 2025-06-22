import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useCreateCouponMutation } from "../../features/coupons/couponApi";

function CouponCreatePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      discount: "",
      quantity: "",
      code: "",
      distributedQuantity: "1",
      start_at: "",
      end_at: "",
    },
  });

  const watchName = watch("name");
  const watchDistributedQuantity = watch("distributedQuantity");

  // 登入驗證
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  // 處理數量調整按鈕
  const handleQuantityChange = increment => {
    const currentValue = parseInt(watchDistributedQuantity || 1);
    const newValue = Math.max(1, currentValue + increment);
    setValue("distributedQuantity", newValue.toString());
  };

  const onSubmit = async data => {
    try {
      const payload = {
        name: data.name,
        discount: Number(data.discount),
        quantity: Number(data.quantity),
        code: data.code,
        distributed_quantity: Number(data.distributedQuantity) || 1,
        start_at: new Date(data.start_at).toISOString(),
        end_at: new Date(data.end_at).toISOString(),
        is_available: true,
      };

      await createCoupon(payload).unwrap();
      toast.success("優惠券新增成功");
      navigate("/coupons");
    } catch (error) {
      console.error("新增失敗", error);
      const errorMessage = error?.data?.message || "優惠券新增失敗";
      toast.error(`${errorMessage}`);
    }
  };

  // 如果未登入，不渲染內容
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-20">
      <div className="d-flex justify-content-center">
        <div className="col-md-8">
          <div className="d-flex flex-column gap-10">
            {/* 麵包屑 */}
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link className="text-gray-" to="/dashboard">
                    首頁
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link className="text-gray-" to="/coupons">
                    優惠券管理
                  </Link>
                </li>
                <li className="breadcrumb-item active">新增優惠券</li>
              </ol>
            </nav>

            {/* 標題 */}
            <h2>新增優惠券</h2>

            <div className="bg-white rounded p-4 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-5">
                {/* 優惠券名稱 */}
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label">優惠券名稱(不對會員顯示)</label>
                    <small className="text-muted">{watchName?.length || 0}/40</small>
                  </div>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="輸入名稱"
                    maxLength={40}
                    {...register("name", {
                      required: "請輸入優惠券名稱",
                      maxLength: {
                        value: 40,
                        message: "名稱不能超過40個字元",
                      },
                    })}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>

                {/* 設定折扣 */}
                <div className="mt-4">
                  <h5 className="form-label fw-bold mb-4">設定折扣</h5>
                  <div className="row g-3">
                    {/* 折扣折數 */}
                    <div className="col-md-4">
                      <label className="form-label">折扣折數</label>
                      <input
                        type="number"
                        className={`form-control ${errors.discount ? "is-invalid" : ""}`}
                        placeholder="請輸入折數"
                        min="1"
                        max="9"
                        step="1"
                        onWheel={e => e.target.blur()}
                        onInput={e => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        {...register("discount", {
                          required: "請輸入折扣折數",
                          min: {
                            value: 1,
                            message: "折數不能小於1",
                          },
                          max: {
                            value: 9,
                            message: "折數不能大於9",
                          },
                          pattern: {
                            value: /^[1-9]$/,
                            message: "折數必須為1-9的整數",
                          },
                        })}
                      />
                      {errors.discount && (
                        <div className="invalid-feedback">{errors.discount.message}</div>
                      )}
                    </div>

                    {/* 可使用數量 */}
                    <div className="col-md-4">
                      <label className="form-label">可使用數量</label>
                      <input
                        type="number"
                        className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                        placeholder="請輸入數量"
                        min="1"
                        step="1"
                        onWheel={e => e.target.blur()}
                        onInput={e => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        {...register("quantity", {
                          required: "請輸入可使用數量",
                          min: {
                            value: 1,
                            message: "數量不能小於1",
                          },
                          pattern: {
                            value: /^[1-9]\d*$/,
                            message: "數量必須為正整數",
                          },
                        })}
                      />
                      {errors.quantity && (
                        <div className="invalid-feedback">{errors.quantity.message}</div>
                      )}
                    </div>

                    {/* 優惠代碼 */}
                    <div className="col-md-4">
                      <label className="form-label">優惠代碼</label>
                      <input
                        type="text"
                        className={`form-control ${errors.code ? "is-invalid" : ""}`}
                        placeholder="請輸入代碼"
                        onInput={e => {
                          e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                        }}
                        {...register("code", {
                          required: "請輸入優惠代碼",
                          pattern: {
                            value: /^[a-zA-Z0-9]+$/,
                            message: "代碼只能包含英文字母和數字",
                          },
                        })}
                      />
                      {errors.code && <div className="invalid-feedback">{errors.code.message}</div>}
                    </div>
                  </div>

                  {/* 每個買家最大配額 */}
                  <div className="row g-3 mt-3">
                    <label className="form-label">每個買家最大配額 : 1</label>
                  </div>
                </div>

                {/* 時間及顯示設定 */}
                <div className="mt-4">
                  <h5 className="fw-bold mb-4">時間及顯示設定</h5>
                  <div className="row g-3">
                    {/* 開始日期 */}
                    <div className="col-md-6">
                      <label className="form-label">開始日期</label>
                      <input
                        type="date"
                        className={`form-control ${errors.start_at ? "is-invalid" : ""}`}
                        min={new Date().toISOString().split("T")[0]} // 限制開始日期不能早於今天
                        {...register("start_at", {
                          required: "請選擇開始日期",
                        })}
                      />
                      {errors.start_at && (
                        <div className="invalid-feedback">{errors.start_at.message}</div>
                      )}
                    </div>

                    {/* 結束日期 */}
                    <div className="col-md-6">
                      <label className="form-label">結束日期</label>
                      <input
                        type="date"
                        className={`form-control ${errors.end_at ? "is-invalid" : ""}`}
                        min={new Date().toISOString().split("T")[0]} // 限制結束日期不能早於今天
                        {...register("end_at", {
                          required: "請選擇結束日期",
                        })}
                      />
                      {errors.end_at && (
                        <div className="invalid-feedback">{errors.end_at.message}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 按鈕區域 */}
                <div className="d-flex justify-content-end gap-3 mt-5">
                  <button
                    type="button"
                    className="btn coupon-btn-cancel px-4 rounded-pill"
                    onClick={() => navigate("/coupons")}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="btn coupon-btn-submit px-4 rounded-pill"
                    disabled={isLoading}
                  >
                    {isLoading ? "新增中" : "新增"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouponCreatePage;
