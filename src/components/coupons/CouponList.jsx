import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "react-toastify";

import { useToggleCouponActiveStatusMutation } from "../../features/coupons/couponApi";

function CouponList({ coupons, onEdit, onDelete, deletingId, refetch }) {
  const [toggleCouponActiveStatus] = useToggleCouponActiveStatusMutation();
  const [updatingId, setUpdatingId] = useState(null);

  const formatDate = dateString => {
    if (!dateString) return "無";
    return new Date(dateString).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const handleToggleStatus = async coupon => {
    setUpdatingId(coupon.id);
    try {
      await toggleCouponActiveStatus({
        id: coupon.id,
        is_available: !coupon.is_available,
      }).unwrap();
      toast.success("優惠券狀態已更新");
      if (refetch) {
        await refetch();
      }
    } catch {
      toast.error("更新失敗，請稍後再試");
    }
    setUpdatingId(null);
  };

  if (coupons.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">
          很抱歉，沒有找到符合您篩選條件的優惠券
          <br />
          請嘗試調整篩選條件
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover align-middle rounded overflow-hidden">
          <thead>
            <tr style={{ backgroundColor: "#939393" }}>
              <th style={{ color: "white", backgroundColor: "#939393" }}>優惠券名稱/代碼</th>
              <th className="text-center" style={{ color: "white", backgroundColor: "#939393" }}>
                折扣折數
              </th>
              <th className="text-center" style={{ color: "white", backgroundColor: "#939393" }}>
                可使用數量
              </th>
              <th className="text-center" style={{ color: "white", backgroundColor: "#939393" }}>
                已使用
              </th>
              <th className="text-center" style={{ color: "white", backgroundColor: "#939393" }}>
                折扣期間
              </th>
              <th className="text-center" style={{ color: "white", backgroundColor: "#939393" }}>
                啟用狀態
              </th>
              <th className="text-center" style={{ color: "white", backgroundColor: "#939393" }}>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon.id}>
                <td>
                  <div>
                    <div className="text-dark">{coupon.name}</div>
                    <small className="text-muted">優惠券代碼：{coupon.code}</small>
                  </div>
                </td>
                <td className="text-center">
                  <span className="text-dark">{coupon.discount}折</span>
                </td>
                <td className="text-center">{coupon.quantity}</td>
                <td className="text-center">{coupon.distributed_quantity}</td>
                <td className="text-center">
                  <div className="small">
                    {formatDate(coupon.start_at)} - {formatDate(coupon.end_at)}
                  </div>
                </td>
                <td className="text-center">
                  <div className="form-check form-switch d-flex justify-content-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id={`activeSwitch-${coupon.id}`}
                      checked={coupon.is_available}
                      disabled={updatingId === coupon.id}
                      onChange={() => handleToggleStatus(coupon)}
                    />
                    <label
                      className={`form-check-label ms-2 ${!coupon.is_available ? "text-danger" : ""}`}
                      htmlFor={`activeSwitch-${coupon.id}`}
                    >
                      {updatingId === coupon.id ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-1"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          更新中...
                        </>
                      ) : coupon.is_available ? (
                        "啟用中"
                      ) : (
                        "未啟用"
                      )}
                    </label>
                  </div>
                </td>
                <td className="text-center">
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEdit(coupon.id)}
                      title="編輯"
                    >
                      編輯
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(coupon.id)}
                      disabled={deletingId === coupon.id}
                      title="刪除"
                    >
                      {deletingId === coupon.id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" />
                          刪除中
                        </>
                      ) : (
                        "刪除"
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

CouponList.propTypes = {
  coupons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      discount: PropTypes.number.isRequired,
      quantity: PropTypes.number,
      distributed_quantity: PropTypes.number,
      start_at: PropTypes.string,
      end_at: PropTypes.string,
      is_available: PropTypes.bool,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  deletingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  refetch: PropTypes.func,
};

export default CouponList;
