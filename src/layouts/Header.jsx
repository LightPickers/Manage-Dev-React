import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const ADMIN_APP_BASE = import.meta.env.VITE_ADMIN_APP_BASE;

  return (
    <div className="bg-white">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top py-5">
          <div className="container">
            <a className="navbar-brand" href="/">
              <img src={`${ADMIN_APP_BASE}Logo.svg`} alt="拾光堂 logo" />
            </a>
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
            <div className="collapse navbar-collapse bg-white" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" aria-current="page" to="/users">
                    使用者管理
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
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Header;
