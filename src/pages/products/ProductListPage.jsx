import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

// 商品管理列表
function ProductListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // 模擬商品資料
  const products = [
    {
      id: 1,
      name: "Seinto 375 機身",
      code: "QX7713523",
      image:
        "https://images.unsplash.com/photo-1498743712100-6ebefc021d0f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quantity: 0,
      price: "NT$8,000",
      status: "缺貨中",
      statusColor: "text-danger",
    },
    {
      id: 2,
      name: "Polar 整套組",
      code: "QT19873432",
      image:
        "https://images.unsplash.com/photo-1498743712100-6ebefc021d0f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quantity: 0,
      price: "NT$5,500",
      status: "缺貨中",
      statusColor: "text-danger",
    },
    {
      id: 3,
      name: "Seize Zillow 2540 CF",
      code: "134501504",
      image:
        "https://images.unsplash.com/photo-1498743712100-6ebefc021d0f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quantity: 0,
      price: "NT$7,000",
      status: "缺貨中",
      statusColor: "text-danger",
    },
    {
      id: 4,
      name: "Rocadex jacket mini Pro ",
      code: "135961585",
      image:
        "https://images.unsplash.com/photo-1498743712100-6ebefc021d0f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quantity: 1,
      price: "NT$3,500",
      status: "銷售中",
      statusColor: "text-success",
    },
    {
      id: 5,
      name: "Canon RF70-200mm F2.8 L IS USM ...",
      code: "118561540",
      image:
        "https://images.unsplash.com/photo-1498743712100-6ebefc021d0f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quantity: 1,
      price: "NT$5,500",
      status: "下架中",
      statusColor: "text-warning",
    },
    {
      id: 6,
      name: "BENDAN 17 ",
      code: "115854540",
      image:
        "https://images.unsplash.com/photo-1498743712100-6ebefc021d0f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quantity: 0,
      price: "NT$10,000",
      status: "下架中",
      statusColor: "text-danger",
    },
  ];

  const handleTabClick = tab => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="container">
        <div className="d-flex flex-column gap-3 py-4 py-lg-5">
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
            </ol>
          </nav>

          {/* 標題 + 新增按鈕 */}
          <div className="d-flex justify-content-between align-items-center mb-0">
            <h2 className="mb-0">我的商品</h2>
            <button
              className="btn btn-dark px-4 py-2 shadow-sm fw-semibold mb-0"
              onClick={() => navigate("/products/new")}
            >
              ＋新增商品
            </button>
          </div>
          <hr className="mt-0 mb-0" />

          {/* 上方按鈕 */}
          <div className="d-flex gap-1 mb-0">
            <button
              className={`btn px-3 py-1 border ${activeTab === "all" ? "bg-white border-dark" : "bg-light"}`}
              onClick={() => handleTabClick("all")}
            >
              全部商品
            </button>
            <button
              className={`btn px-3 py-1 border ${activeTab === "published" ? "bg-white border-dark" : "bg-light"}`}
              onClick={() => handleTabClick("published")}
            >
              已上架商品
            </button>
            <button
              className={`btn px-3 py-1 border ${activeTab === "unpublished" ? "bg-white border-dark" : "bg-light"}`}
              onClick={() => handleTabClick("unpublished")}
            >
              未上架商品
            </button>
          </div>

          {/* 搜尋與篩選 */}
          <div className="bg-white p-3 rounded mb-4">
            <div className="row gy-3">
              <div className="col-md-3">
                <label className="form-label small text-muted">搜尋商品</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="請輸入商品名稱或編號"
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted">商品類別</label>
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                >
                  <option value="">請選擇商品分類</option>
                  <option value="electronics">鏡頭</option>
                  <option value="accessories">機身</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted">狀態篩選</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="">全部狀態</option>
                  <option value="published">銷售中</option>
                  <option value="draft">下架中</option>
                  <option value="out_of_stock">缺貨中</option>
                </select>
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button className="btn w-50">搜尋</button>
              </div>
            </div>
          </div>

          {/* 商品數量顯示 */}
          <div className="d-flex justify-content-between align-items-center mb-0 px-1">
            <span className="text-muted small">共 {products.length} 件商品</span>
          </div>

          {/* 表格欄位標題 */}
          <div className="bg-white rounded overflow-hidden">
            <div className="row py-4 border-bottom text-muted small fw-semibold">
              <div className="col-5 text-start ps-10">商品</div>
              <div className="col-1 text-center">已出售</div>
              <div className="col-2 text-center">售價</div>
              <div className="col-2 text-center">商品狀態</div>
              <div className="col-2 text-center">操作</div>
            </div>

            {/* 商品列表 */}
            {products.map(product => (
              <div key={product.id} className="row py-3 border-bottom align-items-center">
                <div className="col-3 text-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="rounded"
                    style={{
                      width: "170px",
                      height: "160px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="col-2">
                  <div className="fw-semibold">{product.name}</div>
                  <div className="small text-muted">商品ID: {product.code}</div>
                </div>
                <div className="col-1 text-center">{product.quantity}</div>
                <div className="col-2 text-center fw-semibold">{product.price}</div>
                <div className="col-2 text-center">
                  <span className={`fw-semibold ${product.statusColor}`}>{product.status}</span>
                </div>
                <div className="col-2 text-center">
                  <div className="d-flex flex-column gap-1">
                    <button className="btn btn-link btn-sm text-primary p-0 text-decoration-none">
                      重新上架
                    </button>
                    <button className="btn btn-link btn-sm text-primary p-0 text-decoration-none">
                      編輯
                    </button>
                    <button className="btn btn-link btn-sm text-primary p-0 text-decoration-none">
                      複製
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 分頁與每頁顯示筆數 */}
          <div className="d-flex justify-content-end align-items-center mt-4">
            <nav>
              <ul className="pagination mb-0">
                <li className="page-item">
                  <button className="page-link">&lt;</button>
                </li>
                <li className="page-item active">
                  <button className="page-link">1</button>
                </li>
                <li className="page-item">
                  <button className="page-link">2</button>
                </li>
                <li className="page-item">
                  <button className="page-link">3</button>
                </li>
                <li className="page-item">
                  <button className="page-link">&gt;</button>
                </li>
              </ul>
            </nav>
            <div className="ms-3">
              <select className="form-select form-select-sm" style={{ width: "80px" }}>
                <option>10/頁</option>
                <option>20/頁</option>
                <option>30/頁</option>
                <option>40/頁</option>
                <option>50/頁</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductListPage;
