import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
  const { isAuthenticated, isVerified, isLoading } = useSelector(state => state.auth);
  const location = useLocation();

  // 確認是否還在載入驗證狀態
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 驗證完成，且未通過驗證 -> 導向登入頁
  if (isVerified && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 通過驗證，繼續渲染
  return <Outlet />;
}

export default ProtectedRoute;
