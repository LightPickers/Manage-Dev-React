import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Pagination({ pageInfo, handlePageChange, itemsPerPage = 10, onItemsPerPageChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { current_page } = pageInfo;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    navigate(`${location.pathname}?page=${current_page}`);
  }, [current_page, location.pathname, navigate]);

  const handleItemsPerPageChange = newItemsPerPage => {
    onItemsPerPageChange(newItemsPerPage);
    setIsDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 點擊外部區域關閉下拉選單
  useEffect(() => {
    const handleClickOutside = event => {
      if (!event.target.closest(".dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center my-4">
      {/* 分頁導航 */}
      <nav className="me-4">
        <ul className="pagination justify-content-center gap-2 mb-0">
          <li className={`page-item ${!pageInfo?.has_pre && "disabled"}`}>
            <Link
              className="page-link border-0 rounded-5 px-3 py-2"
              onClick={e => {
                e.preventDefault();
                if (pageInfo?.has_pre) {
                  handlePageChange(pageInfo?.current_page - 1);
                }
              }}
              style={{
                textDecoration: "none",
                outline: "none",
                boxShadow: "none",
                cursor: pageInfo?.has_pre ? "pointer" : "not-allowed",
                backgroundColor: "transparent",
                color: pageInfo?.has_pre ? "#495057" : "#6c757d",
              }}
            >
              &lt;
            </Link>
          </li>

          {Array.from({ length: pageInfo?.total_pages }).map((_, index) => (
            <li
              className={`page-item ${index + 1 === pageInfo?.current_page && "active"}`}
              key={index}
            >
              <Link
                className="page-link border-0 rounded-5 px-3 py-2"
                onClick={e => {
                  e.preventDefault();
                  handlePageChange(index + 1);
                }}
                style={{
                  textDecoration: "none",
                  outline: "none",
                  boxShadow: "none",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  color: index + 1 === pageInfo?.current_page ? "#8BB0B7" : "#495057",
                  fontWeight: index + 1 === pageInfo?.current_page ? "bold" : "normal",
                }}
              >
                {index + 1}
              </Link>
            </li>
          ))}

          <li className={`page-item ${!pageInfo?.has_next && "disabled"}`}>
            <Link
              className="page-link border-0 rounded-5 px-3 py-2"
              onClick={e => {
                e.preventDefault();
                if (pageInfo?.has_next) {
                  handlePageChange(pageInfo?.current_page + 1);
                }
              }}
              style={{
                textDecoration: "none",
                outline: "none",
                boxShadow: "none",
                cursor: pageInfo?.has_next ? "pointer" : "not-allowed",
                backgroundColor: "transparent",
                color: pageInfo?.has_next ? "#495057" : "#6c757d",
              }}
            >
              &gt;
            </Link>
          </li>
        </ul>
      </nav>

      {/* 每頁筆數選擇 - 使用 dropdown 樣式 */}
      <div className="nav-item dropdown py-2 px-3 position-relative">
        <Link
          className="nav-link d-flex align-items-center text-decoration-none"
          role="button"
          aria-expanded={isDropdownOpen}
          onClick={handleDropdownToggle}
          style={{
            color: "#495057",
            fontSize: "14px",
            border: "1px solid #dee2e6",
            borderRadius: "20px",
            padding: "6px 12px",
            backgroundColor: "white",
            cursor: "pointer",
            outline: "none",
            boxShadow: "none",
          }}
          onFocus={e => {
            e.target.style.outline = "none";
            e.target.style.boxShadow = "none";
            e.target.style.backgroundColor = "white";
          }}
          onBlur={e => {
            e.target.style.backgroundColor = "white";
          }}
        >
          {itemsPerPage}/每頁
          <span
            className="ms-1"
            style={{
              transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          >
            ▼
          </span>
        </Link>

        <ul
          className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            marginTop: "4px",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
            minWidth: "100px",
            zIndex: 1000,
            padding: "4px 0",
          }}
        >
          {[10, 15, 20]
            .filter(num => num !== itemsPerPage)
            .map(num => (
              <li key={num} style={{ padding: "0", margin: "0" }}>
                <Link
                  className="d-block text-decoration-none"
                  onClick={e => {
                    e.preventDefault();
                    handleItemsPerPageChange(num);
                  }}
                  style={{
                    color: "#495057",
                    fontWeight: "normal",
                    padding: "6px 12px",
                    cursor: "pointer",
                    outline: "none",
                    boxShadow: "none",
                    backgroundColor: "transparent",
                    display: "block",
                  }}
                  onMouseEnter={e => {
                    e.target.style.backgroundColor = "#f8f9fa";
                  }}
                  onMouseLeave={e => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                  onFocus={e => {
                    e.target.style.outline = "none";
                    e.target.style.boxShadow = "none";
                    e.target.style.backgroundColor = "transparent";
                  }}
                  onMouseDown={e => {
                    e.target.style.backgroundColor = "#f8f9fa";
                    e.target.style.outline = "none";
                    e.target.style.boxShadow = "none";
                  }}
                  onMouseUp={e => {
                    e.target.style.backgroundColor = "#f8f9fa";
                  }}
                >
                  {num}/每頁
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  pageInfo: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number,
  onItemsPerPageChange: PropTypes.func.isRequired,
};

export default Pagination;
