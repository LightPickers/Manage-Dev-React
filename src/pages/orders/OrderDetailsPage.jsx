import { useParams, Link, useNavigate } from "react-router-dom";

import { useGetOrderByIdQuery } from "@/features/orders/orderApi";

function OrderDetailsPage() {
  const navigate = useNavigate();
  const { orderId } = useParams(); // 確保參數名跟 router.jsx 裡定義的一致
  const { data: orderByIdData, isLoading: isGetOrderLoading } = useGetOrderByIdQuery(orderId);
  console.log("orderByIdData", orderByIdData);
  if (isGetOrderLoading) {
    return <div className="container text-center py-20">載入中...</div>;
  }
  return (
    <div className="container">
      <div className="d-flex flex-column gap-10 py-10 py-lg-20">
        {/* 麵包屑 */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/dashboard">首頁</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/orders">訂單管理</Link>
            </li>
            <li className="breadcrumb-item active">
              訂單編號：{orderByIdData?.order?.merchant_order_no || "未產生"}
            </li>
          </ol>
        </nav>
        <div className="">
          {orderByIdData?.order && (
            <>
              {/* 訂單基本資訊 */}
              <div className="bg-white p-5 rounded-3 mb-6">
                <div className="row">
                  <div className="col-md-3 d-flex align-items-center">
                    <h4 className="mb-5 mb-md-0">訂單資訊</h4>
                  </div>
                  <div className="col-md-9">
                    <p className="mb-2">
                      訂單編號：{orderByIdData?.order?.merchant_order_no || "未產生"}
                    </p>
                    <p className="mb-2">
                      建立日期：{new Date(orderByIdData.order.created_at).toLocaleString("zh-TW")}
                    </p>
                    <p
                      className={`mb-2 ${orderByIdData.order.status === "canceled" ? "text-danger" : "text-primary-600"}`}
                    >
                      付款狀態：
                      {orderByIdData.order.status === "paid"
                        ? "已付款"
                        : orderByIdData.order.status === "pending"
                          ? "待付款"
                          : "已取消"}
                    </p>
                    <p className="mb-2">
                      付款方式：
                      {orderByIdData.order.payment_method === "credit_card"
                        ? "信用卡"
                        : orderByIdData.order.payment_method}
                    </p>
                    <p className="mb-2">
                      配送方式：
                      {orderByIdData.order.shipping_method === "home_delivery"
                        ? "宅配"
                        : orderByIdData.order.shipping_method}
                    </p>
                    <p className="mb-2">
                      希望送達日期：
                      {new Date(orderByIdData.order.desired_date).toLocaleDateString("zh-TW")}
                    </p>
                  </div>
                </div>
              </div>

              {/* 收件人資訊 */}
              <div className="bg-white p-5 rounded-3 mb-6">
                <div className="row">
                  <div className="col-md-3 d-flex align-items-center">
                    <h4 className="mb-5 mb-md-0">收件人資訊</h4>
                  </div>
                  <div className="col-md-9">
                    <p className="mb-2">姓名：{orderByIdData.order.user_name}</p>
                    <p className="mb-2">信箱：{orderByIdData.order.user_email}</p>
                    <p className="mb-2">電話：{orderByIdData.order.user_phone}</p>
                    <p className="mb-2">
                      地址：{orderByIdData.order.user_address_zipcode}{" "}
                      {orderByIdData.order.user_address_city}
                      {orderByIdData.order.user_address_district}{" "}
                      {orderByIdData.order.user_address_detail}
                    </p>
                  </div>
                </div>
              </div>

              {/* 商品清單 */}
              <div className="bg-white p-5 rounded-3 mb-6">
                <div className="row">
                  <div className="col-md-3 d-flex align-items-center">
                    <h4 className="mb-5 mb-md-0">商品明細</h4>
                  </div>
                  <div className="col-md-9">
                    {orderByIdData.order_items.map(item => (
                      <div
                        key={item.id}
                        className="d-flex gap-4 align-items-center border-bottom py-3"
                      >
                        <img
                          src={item.primary_image}
                          alt={item.name}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                        <div className="flex-grow-1">
                          <p className="fw-bold mb-1">{item.name}</p>
                          <p className="mb-2">單價：NT$ {item.price.toLocaleString()}</p>
                          <p className="mb-2">數量：{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 金額資訊 */}
              <div className="bg-white p-5 rounded-3 mb-6">
                <div className="row">
                  <div className="col-md-3 d-flex align-items-center">
                    <h4 className="mb-5 mb-md-0">金額資訊</h4>
                  </div>
                  <div className="col-md-9">
                    <p className="mb-2">
                      商品總金額：NT$ {orderByIdData.order.items_total_amount.toLocaleString()}
                    </p>
                    <p className="mb-2">
                      折扣金額：NT$ {orderByIdData.order.discount_amount.toLocaleString()}
                    </p>
                    <p className="mb-2">
                      運費：NT$ {orderByIdData.order.shippingFee.toLocaleString()}
                    </p>
                    <hr />
                    <p className="fw-bold mb-2">
                      訂單總金額：NT$ {orderByIdData.order.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-custom-primary"
                  onClick={() => navigate("/orders")}
                >
                  返回上一頁
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default OrderDetailsPage;
