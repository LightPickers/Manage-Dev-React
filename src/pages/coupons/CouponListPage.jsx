import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useGetCouponsQuery, useDeleteCouponByIdMutation } from "../../features/coupons/couponApi";
import CouponStatusTabs from "../../components/coupons/CouponStatusTabs";
import CouponFilter from "../../components/coupons/CouponFilter";
import CouponList from "../../components/coupons/CouponList";
import Pagination from "../../components/coupons/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { ConfirmDialogue } from "../../components/Alerts";

function CouponListPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // 確認對話框狀態
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    couponId: null,
    couponName: "",
  });

  // 登入驗證
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  // 取得所有優惠券資料
  const { data, isLoading, error, refetch } = useGetCouponsQuery({
    // 這裡先取得全部資料，後續可改為真正的分頁 API
  });

  const [deleteCoupon] = useDeleteCouponByIdMutation();
  const [deletingId, setDeletingId] = useState(null);

  // 使用 useMemo 來包裝 allCoupons
  const allCoupons = useMemo(() => {
    return data?.data || [];
  }, [data]);

  // 前端分頁邏輯
  const { paginatedCoupons, totalPages, pageInfo } = useMemo(() => {
    // 篩選資料
    let filteredCoupons = allCoupons;

    // 按關鍵字篩選
    if (keyword.trim()) {
      filteredCoupons = filteredCoupons.filter(
        coupon =>
          coupon.name.toLowerCase().includes(keyword.toLowerCase().trim()) ||
          coupon.code.toLowerCase().includes(keyword.toLowerCase().trim())
      );
    }

    // 按 tab 狀態篩選
    if (activeTab !== "all") {
      const now = new Date();
      filteredCoupons = filteredCoupons.filter(coupon => {
        const startDate = new Date(coupon.start_at);
        const endDate = new Date(coupon.end_at);

        switch (activeTab) {
          case "active":
            // 進行中：當前時間在開始和結束時間之間
            return now >= startDate && now <= endDate;
          case "upcoming":
            // 接下來的活動：開始時間還未到
            return now < startDate;
          case "expired":
            // 已過期：結束時間已過
            return now > endDate;
          default:
            return true;
        }
      });
    }

    // 計算分頁
    const totalItems = filteredCoupons.length;
    const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredCoupons.slice(startIndex, endIndex);

    return {
      paginatedCoupons: paginatedData,
      totalPages: calculatedTotalPages,
      pageInfo: {
        current_page: currentPage,
        total_pages: calculatedTotalPages,
        has_pre: currentPage > 1,
        has_next: currentPage < calculatedTotalPages,
      },
    };
  }, [allCoupons, currentPage, itemsPerPage, keyword, activeTab]);

  const handleSearch = searchKeyword => {
    setKeyword(searchKeyword);
    setCurrentPage(1);
  };

  const handleTabChange = tab => {
    setActiveTab(tab);
    setCurrentPage(1); // 切換 tab 時回到第一頁
  };

  const handleDelete = async couponId => {
    // 找到要刪除的優惠券資訊
    const coupon = allCoupons.find(c => c.id === couponId);

    // 使用 Alerts 組件顯示確認對話框
    await ConfirmDialogue({
      title: "確認要刪除",
      text: `確定要刪除優惠券「${coupon?.name || "此優惠券"}」嗎？此操作無法復原。`,
      icon: "warning",
      action: async () => {
        setDeletingId(couponId);
        try {
          await deleteCoupon(couponId).unwrap();
          toast.success("優惠券已刪除");
          refetch();
        } catch {
          toast.error("刪除失敗，請稍後再試");
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const handleConfirmDelete = async () => {
    const couponId = confirmDialog.couponId;

    // 關閉對話框
    setConfirmDialog({ isOpen: false, couponId: null, couponName: "" });

    setDeletingId(couponId);
    try {
      await deleteCoupon(couponId).unwrap();
      toast.success("優惠券已刪除");
      refetch();
    } catch {
      toast.error("刪除失敗，請稍後再試");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, couponId: null, couponName: "" });
  };

  const handleEdit = couponId => {
    navigate(`/coupons/edit/${couponId}`);
  };

  const handleCreate = () => {
    navigate("/coupons/new");
  };

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = newItemsPerPage => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // 改變每頁筆數時回到第一頁
  };

  // 如果未登入，不渲染內容
  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <div className="container text-center py-20">載入中...</div>;
  }

  if (error) {
    return <div className="container text-center py-20">載入失敗，請稍後再試</div>;
  }

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
            <li className="breadcrumb-item active">優惠券管理</li>
          </ol>
        </nav>

        {/* 標題和新增按鈕 */}
        <div className="d-flex justify-content-between align-items-center">
          <h2>優惠券管理</h2>
          <button
            className="btn text-white px-4 rounded-pill"
            onClick={handleCreate}
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
            + 建立優惠券
          </button>
        </div>

        {/* 狀態分頁區塊和篩選區塊合併 */}
        <div className="bg-white rounded">
          <div className="p-3 border-bottom">
            <CouponStatusTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
          <div className="p-3">
            <CouponFilter onSearch={handleSearch} keyword={keyword} />
          </div>
        </div>

        {/* 優惠券列表和分頁組件組合 */}
        <div className="d-flex flex-column gap-3">
          <CouponList
            coupons={paginatedCoupons}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            refetch={refetch}
          />

          {/* 分頁組件 */}
          {totalPages > 1 && (
            <Pagination
              pageInfo={pageInfo}
              handlePageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CouponListPage;
