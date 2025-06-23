import { node } from "prop-types";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { setVerified } from "@features/auth/authSlice";
import { useLazyVerifyAdminQuery } from "@features/auth/authApi";

// 檢查應用初始化時是否有 token
export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { token, isLoading } = useSelector(state => state.auth);
  const [verifyAuth, { isLoading: isVerifying }] = useLazyVerifyAdminQuery();
  const location = useLocation();
  const hasCheckedAuth = useRef(false);

  // 若有 token，通過 RTK query 的 verifyAuth() 驗證
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          await verifyAuth().unwrap();
          hasCheckedAuth.current = true;
        } catch (err) {
          localStorage.removeItem("persist:root");
          dispatch({ type: "auth/logout" });
          const errorMessage = err?.data?.message || "登入已失效，請重新登入";
          toast.error(errorMessage);
          hasCheckedAuth.current = true;
        }
      } else {
        const justLoggedOut = localStorage.getItem("justLoggedOut") === "true";
        if (!hasCheckedAuth.current && location.pathname !== "/login" && !justLoggedOut) {
          toast.error("您無權進入此頁面，請重新登入");
          hasCheckedAuth.current = true;
        }
        if (justLoggedOut) {
          localStorage.removeItem("justLoggedOut");
        }
        dispatch(setVerified());
      }
    };
    checkAuth();

    const interval = setInterval(
      () => {
        if (token) verifyAuth();
      },
      10 * 60 * 1000
    );
    return () => clearInterval(interval);
  }, [dispatch, token, verifyAuth, location.pathname]);

  return <>{children}</>;
}

AuthProvider.propTypes = {
  children: node.isRequired,
};
