import { toast } from "react-toastify";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  useGetProductsQuery,
  useDeactivateProductMutation,
  useRelistProductMutation,
  useDeleteProductByIdMutation,
} from "@/features/products/productApi";
import { useGetProductCategoryQuery } from "@/features/products/productAttributesApi";
import { ConfirmDialogue } from "../../components/Alerts";

function ProductListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 獲取商品類別資料
  const { data: categoriesData, isLoading: categoriesLoading } = useGetProductCategoryQuery();
  const categories = categoriesData?.data || categoriesData || [];

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

    // 類別篩選 - 使用 category_id
    if (categoryFilter) params.category_id = categoryFilter;

    // 狀態篩選
    if (statusFilter === "published") params.is_available = true;
    else if (statusFilter === "draft") params.is_available = false;
    else if (statusFilter === "out_of_stock") params.is_sold = true;

    return params;
  }, [activeTab, searchKeyword, categoryFilter, statusFilter, currentPage, pageSize]);

  const { data: productsData, error, isLoading } = useGetProductsQuery(queryParams);
  const [deleteProduct] = useDeleteProductByIdMutation();
  const [deactivateProduct] = useDeactivateProductMutation();
  const [relistProduct] = useRelistProductMutation();

  const products = productsData?.data || [];
  const totalPages = productsData?.total_pages || 0;
  const totalProducts = productsData?.total_product || 0;

  useEffect(() => {
    if (error) {
      console.error("獲取商品列表錯誤:", error);
      toast.error("獲取商品列表失敗");
    }
  }, [error]);

  const handleSearch = () => {
    setCurrentPage(1); // 搜尋後重置頁數
  };

  // 下架商品 後端已確認不需帶available值
  const handleDeactivateProduct = async productId => {
    try {
      const result = await deactivateProduct({ productId }).unwrap();

      if (result.status === "true" || result.status === true) {
        toast.success("商品已成功下架！");
      } else {
        toast.error("商品下架失敗");
      }
    } catch (error) {
      console.error("商品下架錯誤:", error);
      toast.error(`商品下架失敗: ${error?.data?.message || error.message}`);
    }
  };

  // 重新上架商品 後端已確認不需帶available值
  const handleRelistProduct = async productId => {
    try {
      const result = await relistProduct({
        productId,
      }).unwrap();

      if (result.status === "true" || result.status === true) {
        toast.success("商品已重新上架成功！");
      } else {
        toast.error("商品重新上架失敗");
      }
    } catch (error) {
      console.error("重新上架錯誤:", error);
      toast.error(`重新上架失敗: ${error?.data?.message || error.message}`);
    }
  };

  // 刪除商品
  const handleDeleteProduct = async productId => {
    // 使用 Alerts 組件顯示確認對話框
    await ConfirmDialogue({
      title: "確認要刪除",
      text: "確定要刪除此商品嗎？此操作無法復原。",
      icon: "warning",
      action: async () => {
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
      },
    });
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

  // 重置篩選條件
  // const handleResetFilters = () => {
  //   setSearchKeyword("");
  //   setCategoryFilter("");
  //   setStatusFilter("");
  //   setCurrentPage(1);
  // };

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
    <div className="container ">
      <div className="d-flex flex-column gap-10 py-10 py-lg-20">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link className="text-gray-" to="/dashboard">
                首頁
              </Link>
            </li>
            <li className="breadcrumb-item active">商品列表</li>
          </ol>
        </nav>

        {/* 標題與新增按鈕 */}
        <div className="d-flex justify-content-between align-items-center">
          <h2>商品列表</h2>
          <button
            type="button"
            className="btn text-white px-4 rounded-pill "
            onClick={() => navigate("/products/new")}
            style={{
              backgroundColor: "#8BB0B7",
              borderColor: "#8BB0B7",
            }}
            onMouseEnter={e => {
              e.target.style.backgroundColor = "#7A9FA6";
              e.target.style.borderColor = "#7A9FA6";
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = "#8BB0B7";
              e.target.style.borderColor = "#8BB0B7";
            }}
          >
            ＋新增商品
          </button>
        </div>

        {/* 上方篩選 tabs */}
        <div className="bg-white rounded">
          <div className="p-3 border-bottom">
            <div className="d-flex gap-2 mb-3">
              {[
                { key: "all", label: "全部商品" },
                { key: "published", label: "已上架商品" },
                { key: "unpublished", label: "未上架商品" },
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`btn ${activeTab === tab.key ? "" : "btn-outline-secondary"}`}
                  onClick={() => handleTabClick(tab.key)}
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
          <div className="p-3">
            {/* 搜尋與篩選 */}
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
                  disabled={categoriesLoading}
                >
                  <option value="">全部</option>
                  {categories.map(category => (
                    <option
                      key={category.category_id || category.id}
                      value={category.category_id || category.id}
                    >
                      {category.name || category.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted">商品狀態</label>
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
              <div className="col-md-3 d-flex align-items-end gap-2">
                {/* <button className="btn btn-primary flex-fill" onClick={handleSearch}>
                搜尋
              </button> */}
                {/* <button className="btn btn-outline-secondary" onClick={handleResetFilters}>
                重置
              </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* 商品數量顯示 */}
        <div className="d-flex justify-content-start align-items-center mb-2">
          <div className="d-flex gap-2 align-items-center">
            {searchKeyword || categoryFilter || statusFilter ? (
              <span className="text-muted p-1">篩選結果：</span>
            ) : null}

            <span className="text-muted small px-0">
              共 <span className="text-dark">{totalProducts}</span> 件商品
            </span>

            {totalPages > 0 && (
              <>
                <span className="text-muted">|</span>
                <span className="text-muted small">
                  第 <span className="text-dark">{currentPage}</span> /
                  <span className="text-dark"> {totalPages}</span> 頁
                </span>

                {products.length < totalProducts && (
                  <>
                    <span className="text-muted">|</span>
                    <span className="text-muted small">本頁 {products.length} 件</span>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* 商品列表表格 */}
        <div className="bg-white rounded overflow-hidden">
          <div className="row py-4 border-bottom text-muted small fw-semibold">
            <div className="col-6 text-start ps-10">商品</div>
            <div className="col-1 text-center">已出售</div>
            <div className="col-2 text-center">售價</div>
            <div className="col-1 text-center">商品狀態</div>
            <div className="col-2 text-center">操作</div>
          </div>

          {isLoading ? (
            <div className="text-center py-5">載入中...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 text-muted">查無商品</div>
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
                  <div className="col-1 text-center">
                    <span className={`fw-semibold ${status.color}`}>{status.text}</span>
                  </div>
                  <div className="col-2 text-center">
                    <div className="d-flex flex-column gap-1 align-items-center">
                      {/* 重新上架按鈕 下架且未售出的商品才顯示 */}
                      {!product.available && !product.sold && (
                        <button
                          type="button"
                          className="btn btn-custom-primary small px-5 py-1 "
                          style={{ fontSize: "0.8rem" }}
                          onClick={() => handleRelistProduct(product.id)}
                          title="重新上架商品"
                        >
                          重新上架
                        </button>
                      )}

                      {/* 下架按鈕 - 只有上架+未售出的商品才顯示 */}
                      {product.available && !product.sold && (
                        <button
                          type="button"
                          className="btn btn-custom-primary small px-5 py-1"
                          style={{ fontSize: "0.8rem" }}
                          onClick={() => handleDeactivateProduct(product.id)}
                          title="下架商品"
                          disabled={isLoading}
                        >
                          {isLoading ? "下架中..." : "下架"}
                        </button>
                      )}

                      {/* 修改按鈕 */}
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="btn btn-custom-primary small px-5 py-1"
                        style={{ fontSize: "0.8rem" }}
                        title="修改商品資訊"
                      >
                        修改
                      </Link>

                      {/* 刪除按鈕 */}
                      <button
                        type="button"
                        className="btn btn-custom-primary small px-5 py-1 "
                        style={{ fontSize: "0.8rem" }}
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
