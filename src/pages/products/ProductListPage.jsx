import { toast } from "react-toastify";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetProductsQuery,
  useDeleteProductByIdMutation,
  useDeactivateProductMutation,
} from "@/features/products/productApi";

function ProductListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      page_size: pageSize,
    };

    // Tab篩選
    if (activeTab === "published") params.is_available = true;
    else if (activeTab === "unpublished") params.is_available = false;

    // 搜尋關鍵字
    if (searchKeyword.trim()) params.keyword = searchKeyword.trim();

    // 類別篩選
    if (categoryFilter) params.category = categoryFilter;

    // 狀態篩選
    if (statusFilter === "published") params.is_available = true;
    else if (statusFilter === "draft") params.is_available = false;
    else if (statusFilter === "out_of_stock") params.is_sold = true;

    return params;
  }, [activeTab, searchKeyword, categoryFilter, statusFilter, currentPage, pageSize]);

  const { data: productsData, error, isLoading } = useGetProductsQuery(queryParams);
  const [deleteProduct] = useDeleteProductByIdMutation();
  const [deactivateProduct] = useDeactivateProductMutation();

  const products = productsData?.data || [];
  const totalPages = productsData?.total_pages || 0;
  const totalProducts = products.length;

  useEffect(() => {
    if (error) {
      console.error("獲取商品列表錯誤:", error);
      toast.error("獲取商品列表失敗");
    }
  }, [error]);

  const handleSearch = () => {
    setCurrentPage(1); // 搜尋後重置頁數
  };

  // 重新上架商品
  const handleRelistProduct = async productId => {
    try {
      const result = await deactivateProduct({
        productId,
        available: true, // 設為true來重新上架
      }).unwrap();

      if (result.status === "true" || result.status === true) {
        toast.success("商品重新上架成功");
      } else {
        toast.error("重新上架失敗");
      }
    } catch (error) {
      console.error("重新上架錯誤:", error);
      toast.error(`重新上架失敗: ${error?.data?.message || error.message}`);
    }
  };

  // 刪除商品
  const handleDeleteProduct = async productId => {
    if (window.confirm("確定要刪除此商品嗎？")) {
      try {
        const result = await deleteProduct(productId).unwrap();
        if (result.status === "true" || result.status === true) {
          toast.success("商品刪除成功");
        } else {
          toast.error("刪除失敗");
        }
      } catch (error) {
        console.error("刪除錯誤:", error);
        toast.error(`刪除失敗: ${error?.data?.message || error.message}`);
      }
    }
  };

  const getProductStatus = product => {
    if (product.sold) return { text: "已售出", color: "text-secondary" };
    if (!product.available) return { text: "下架中", color: "text-warning" };
    return { text: "銷售中", color: "text-success" };
  };

  const formatPrice = price => `NT$${price.toLocaleString()}`;

  const handleTabClick = tab => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = newPageSize => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // 計算分頁顯示邏輯
  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4 py-lg-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/dashboard">首頁</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/products">商品列表</Link>
            </li>
          </ol>
        </nav>

        {/* 標題與新增按鈕 */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <h2>我的商品</h2>
          <button className="btn btn-dark px-4 py-2" onClick={() => navigate("/products/new")}>
            ＋新增商品
          </button>
        </div>
        <hr />

        {/* 上方篩選 tabs */}
        <div className="d-flex gap-2 mb-3">
          {[
            { key: "all", label: "全部商品" },
            { key: "published", label: "已上架商品" },
            { key: "unpublished", label: "未上架商品" },
          ].map(tab => (
            <button
              key={tab.key}
              className={`btn px-3 py-1 border ${
                activeTab === tab.key ? "bg-white border-dark" : "bg-light"
              }`}
              onClick={() => handleTabClick(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 搜尋與篩選 */}
        <div className="bg-white p-3 rounded mb-4">
          <div className="row gy-3 d-flex justify-content-between align-items-center mb-2">
            <div className="col-md-3">
              <label className="form-label small text-muted">搜尋商品</label>
              <input
                type="text"
                className="form-control"
                placeholder="請輸入商品名稱或編號"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                onKeyPress={e => e.key === "Enter" && handleSearch()}
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
                <option value="鏡頭">鏡頭</option>
                <option value="機身">機身</option>
                <option value="配件">配件</option>
                <option value="相機">相機</option>
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
                <option value="out_of_stock">已售出</option>
              </select>
            </div>
          </div>
        </div>

        {/* 商品數量顯示 */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted small">
            共 {totalProducts} 件商品
            {totalPages > 0 && ` | 第 ${currentPage} 頁，共 ${totalPages} 頁`}
          </span>
          {isLoading && <span className="text-muted small">載入中...</span>}
        </div>

        {/* 商品列表表格 */}
        <div className="bg-white rounded overflow-hidden">
          <div className="row py-4 border-bottom text-muted small fw-semibold">
            <div className="col-6 text-start ps-10">商品</div>
            <div className="col-1 text-center">已出售</div>
            <div className="col-2 text-center">售價</div>
            <div className="col-2 text-center">商品狀態</div>
            <div className="col-1 text-center">操作</div>
          </div>

          {isLoading ? (
            <div className="text-center py-5">載入中...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 text-muted">沒有找到商品</div>
          ) : (
            products.map(product => {
              const status = getProductStatus(product);
              return (
                <div key={product.id} className="row py-3 border-bottom align-items-center">
                  <div className="col-3 text-center">
                    <img
                      src={product.primary_image}
                      alt={product.name}
                      className="rounded"
                      style={{ width: "170px", height: "160px", objectFit: "cover" }}
                      onError={e =>
                        (e.target.src = "https://via.placeholder.com/170x160?text=No+Image")
                      }
                    />
                  </div>
                  <div className="col-3">
                    <div className="fw-semibold">{product.name}</div>
                    <div className="small text-muted">商品ID: {product.id}</div>
                  </div>
                  <div className="col-1 text-center">{product.sold ? 1 : 0}</div>
                  <div className="col-2 text-center fw-semibold">
                    {formatPrice(product.selling_price)}
                  </div>
                  <div className="col-2 text-center">
                    <span className={`fw-semibold ${status.color}`}>{status.text}</span>
                  </div>
                  <div className="col-1 text-center">
                    <div className="d-flex flex-column gap-1">
                      {/* 重新上架按鈕 - 只有下架且未售出的商品才顯示 */}
                      {!product.available && !product.sold && (
                        <button
                          className="btn btn-link btn-sm text-success p-0 text-decoration-none"
                          onClick={() => handleRelistProduct(product.id)}
                          title="重新上架商品"
                        >
                          重新上架
                        </button>
                      )}

                      {/* 修改按鈕 - 改為 Link 元件 */}
                      <Link
                        to={`/products/edit/${product.id}`}
                        className="btn btn-link btn-sm text-primary p-0 text-decoration-none"
                        title="修改商品資訊"
                      >
                        修改
                      </Link>

                      {/* 下架按鈕 - 只有上架且未售出的商品才顯示 */}
                      {product.available && !product.sold && (
                        <button
                          className="btn btn-link btn-sm text-warning p-0 text-decoration-none"
                          title="下架商品"
                        >
                          下架
                        </button>
                      )}

                      {/* 刪除按鈕 - 所有商品都可以刪除 (軟刪除) */}
                      <button
                        className="btn btn-link btn-sm text-danger p-0 text-decoration-none"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="刪除商品"
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 分頁與每頁顯示筆數 */}
        {totalPages > 0 && (
          <div className="d-flex justify-content-center align-items-center mt-4">
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                </li>

                {getPaginationRange().map((page, index) => {
                  if (page === "...") {
                    return (
                      <li key={`dots-${index}`} className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    );
                  }

                  return (
                    <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(page)}>
                        {page}
                      </button>
                    </li>
                  );
                })}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                </li>
              </ul>
            </nav>
            <div className="ms-3">
              <select
                className="form-select form-select-sm"
                style={{ width: "100px" }}
                value={pageSize}
                onChange={e => handlePageSizeChange(parseInt(e.target.value))}
              >
                {[10, 20, 30, 40, 50].map(size => (
                  <option key={size} value={size}>
                    {size}/每頁
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;
