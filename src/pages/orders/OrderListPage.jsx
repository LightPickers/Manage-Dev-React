import { Link } from "react-router-dom";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";

import { useGetOrdersQuery } from "@/features/orders/orderApi";

function OrderListPage() {
  const navigate = useNavigate();
  const [currentPage, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword] = useDebounce(keyword, 800);
  const [activeTab, setActiveTab] = useState("all");
  const onTabChange = key => {
    setActiveTab(key);
  };
  const {
    data: orderData,
    isLoading: isGetOrderLoading,
    refetch,
  } = useGetOrdersQuery({
    page: currentPage,
    keyword: debouncedKeyword,
    ...(activeTab !== "all" && { status: activeTab }),
  });

  const orders = orderData?.data?.orders || [];
  const ordersNumber = orderData?.data?.totalOrders;
  const totalPages = orderData?.data?.totalPages;

  const formatDateTime = isoString => {
    const date = new Date(isoString);
    return date.toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Taipei",
    });
  };

  const ordersStatusTabs = [
    { key: "all", label: "全部" },
    { key: "paid", label: "已付款" },
    { key: "pending", label: "待付款" },
    { key: "canceled", label: "已取消" },
  ];

  return (
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
            <li className="breadcrumb-item active">訂單管理</li>
          </ol>
        </nav>

        <div className="order-list-contents bg-white rounded-3 d-flex flex-column gap-9 px-8 py-11">
          {/* 標題 */}
          <div className="d-flex flex-column gap-5">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex flex-column flex-lg-row align-items-lg-end gap-4">
                <h3>訂單管理</h3>
                <div>
                  <p className="fs-5 text-gray-600" style={{ letterSpacing: "0.1em" }}>
                    共{" "}
                    {isGetOrderLoading ? (
                      <span
                        className="spinner-border spinner-border-sm text-primary"
                        role="status"
                      />
                    ) : (
                      ordersNumber
                    )}{" "}
                    筆
                  </p>
                </div>
              </div>
              {/* 搜尋欄 */}
              <input
                type="text"
                className="form-control w-auto"
                placeholder="搜尋訂單編號或 Email"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
            </div>

            <div className="divider-line"></div>

            {/* Order Tab */}
            <div className="d-flex gap-2">
              {ordersStatusTabs.map(tab => (
                <button
                  key={tab.key}
                  className={`btn ${activeTab === tab.key ? "" : "btn-outline-secondary"}`}
                  onClick={() => onTabChange(tab.key)}
                  style={{
                    backgroundColor: activeTab === tab.key ? "#8BB0B7" : "transparent",
                    borderColor: activeTab === tab.key ? "#8BB0B7" : "#6c757d",
                    color: activeTab === tab.key ? "white" : "#6c757d",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 訂單列表 */}
          <table className="table order-list-table align-middle text-nowrap row">
            <thead className="order-list-table-head">
              <tr>
                <th scope="col">
                  <p className="px-7 text-start">會員信箱</p>
                </th>
                <th scope="col">
                  <p className="px-7">訂單成立日期</p>
                </th>
                <th scope="col">
                  <p className="px-7">訂單編號</p>
                </th>

                <th scope="col">
                  <p className="px-7">總金額</p>
                </th>
                <th scope="col">
                  <p className="px-7">付款狀態</p>
                </th>
                <th scope="col">
                  <p className="px-7">操作</p>
                </th>
              </tr>
            </thead>

            <tbody className="order-list-table-body">
              {orders.map(orders => {
                return (
                  <tr key={orders.id}>
                    <td className="order-list-item-last text-start">
                      <p className=" text-gray-600 ps-6">{orders.Users.email}</p>
                    </td>
                    <td className={"order-list-item-last text-gray-500 gap-3"}>
                      <p className="px-4">{formatDateTime(orders.created_at)}</p>
                    </td>
                    <td className={"order-list-item-last text-gray-500 gap-3"}>
                      <p className="px-4">{orders.merchant_order_no}</p>
                    </td>

                    <td className={"order-list-item-last text-gray-500 gap-3"}>
                      <p className="px-4">NT$ {orders.amount.toLocaleString()}</p>
                    </td>
                    <td
                      className={`order-list-item-last gap-3 ${orders.status === "canceled" ? "text-danger" : "text-primary-600"}`}
                    >
                      <p className="px-4">
                        {orders.status === "paid"
                          ? "已付款"
                          : orders.status === "pending"
                            ? "待付款"
                            : "已取消"}
                      </p>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-custom-primary small px-5 py-2"
                        onClick={() => navigate(`/orders/${orders.id}`)}
                      >
                        查看訂單
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {isGetOrderLoading ? (
            <div className="text-center py-10 text-gray-500">訂單資料載入中...</div>
          ) : (
            orders.length === 0 && (
              <div className="text-center text-gray-600 fs-3 py-10">
                {keyword
                  ? "找不到符合的訂單"
                  : activeTab === "paid"
                    ? "目前沒有『已付款』訂單"
                    : activeTab === "pending"
                      ? "目前沒有『待付款』訂單"
                      : activeTab === "canceled"
                        ? "目前沒有『已取消』訂單"
                        : "目前沒有任何訂單"}
              </div>
            )
          )}

          <div className="order-list-table-mobile">
            <div className="d-flex flex-column gap-4">
              {orders.map(orders => (
                <div key={orders.id} className="d-flex flex-row gap-3">
                  <div className="d-flex flex-column justify-content-between gap-4 w-100">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-gray-600 fw-bold fs-5 text-multiline-truncate">
                        信箱：{orders.Users.email}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="text-gray-500">訂單編號：{orders.merchant_order_no}</div>
                      <div
                        className={`order-list-item-last gap-3 ${orders.status === "canceled" ? "text-danger" : "text-primary-600"}`}
                      >
                        付款狀態：
                        {orders.status === "paid"
                          ? "已付款"
                          : orders.status === "pending"
                            ? "待付款"
                            : "已取消"}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-gray-500">
                        訂單成立日期：{formatDateTime(orders.created_at)}
                      </div>
                      <button
                        type="button"
                        className="btn btn-custom-primary small px-5 py-1"
                        onClick={() => navigate(`/orders/${orders.id}`)}
                      >
                        查看訂單
                      </button>
                    </div>
                    <div className="divider-line"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 頁碼 */}
          <nav>
            <ul
              className={` ${orders.length === 0 ? "d-none" : "pagination justify-content-center mb-0"}`}
            >
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link shadow-none"
                  onClick={() => currentPage > 1 && setPage(currentPage - 1)}
                >
                  &lt;
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index}
                  className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                >
                  <button className="page-link shadow-none" onClick={() => setPage(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link shadow-none"
                  onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
                >
                  &gt;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default OrderListPage;
