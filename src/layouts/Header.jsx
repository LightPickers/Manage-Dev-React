import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { logout } from "@/features/auth/authSlice";

function Header() {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const ADMIN_APP_BASE = import.meta.env.VITE_ADMIN_APP_BASE;
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const collapseElement = document.getElementById("navbarSupportedContent");
    const handleShow = () => setIsMenuOpen(true);
    const handleHide = () => setIsMenuOpen(false);

    collapseElement?.addEventListener("show.bs.collapse", handleShow);
    collapseElement?.addEventListener("hide.bs.collapse", handleHide);

    return () => {
      collapseElement?.removeEventListener("show.bs.collapse", handleShow);
      collapseElement?.removeEventListener("hide.bs.collapse", handleHide);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");

    toast.success("已成功登出");
    Promise.resolve().then(() => {
      navigate("/login", { replace: true });
    });
  };
  return (
    <>
      {isMenuOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.3)", zIndex: 1040 }}
          onClick={() => {
            const collapse = document.getElementById("navbarSupportedContent");
            const bsCollapse = window.bootstrap?.Collapse.getInstance
              ? window.bootstrap.Collapse.getInstance(collapse)
              : window.bootstrap &&
                  window.bootstrap.Collapse &&
                  window.bootstrap.Collapse.getOrCreateInstance
                ? window.bootstrap.Collapse.getOrCreateInstance(collapse)
                : null;
            bsCollapse?.hide && bsCollapse.hide();
          }}
        ></div>
      )}
      <nav
        className="navbar navbar-expand-lg bg-white navbar-light bg-light fixed-top py-5"
        style={{ zIndex: 1050 }}
      >
        <div className="container">
          <Link className="navbar-brand" to="/dashboard">
            <img src={`${ADMIN_APP_BASE}Logo.svg`} alt="拾光堂 logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="d-flex flex-column flex-lg-row align-items-center gap-4 ms-auto">
              <ul className="navbar-nav text-center fw-bold gap-4">
                <li className="nav-item">
                  <Link className="nav-link" aria-current="page" to="/users">
                    會員管理
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/products">
                    商品列表
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">
                    訂單管理
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/coupons">
                    優惠券管理
                  </Link>
                </li>
              </ul>

              {user ? (
                <button className="btn btn-custom-primary small" onClick={handleLogout}>
                  登出
                </button>
              ) : (
                <button className="btn btn-custom-primary small" as={Link} to="/login">
                  登入
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
