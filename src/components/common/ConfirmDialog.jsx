import { useEffect } from "react";
import PropTypes from "prop-types";

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, warningMessage, itemName }) {
  useEffect(() => {
    const handleEsc = event => {
      if (event.keyCode === 27) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc, false);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc, false);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 動態組合標題
  const displayTitle = itemName ? `${title}${itemName}?` : title;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 shadow-lg position-relative"
        style={{
          width: "400px",
          maxWidth: "90vw",
          border: "3px solid #000",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 關閉按鈕 */}
        <button
          className="position-absolute btn-close"
          style={{
            top: "15px",
            right: "15px",
            fontSize: "1.2rem",
            border: "none",
            background: "none",
          }}
          onClick={onClose}
          aria-label="關閉"
        >
          ✕
        </button>

        {/* 標題區域 */}
        <div className="d-flex align-items-center p-4 pb-3">
          <div
            className="d-flex align-items-center justify-content-center me-3"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#000",
              borderRadius: "50%",
            }}
          >
            <span style={{ color: "white", fontSize: "1.5rem" }}>✕</span>
          </div>
          <h5 className="mb-0 fw-bold">{displayTitle}</h5>
        </div>

        {/* 內容區域 */}
        <div className="px-4 pb-2">
          <p className="mb-2" style={{ fontSize: "1.1rem" }}>
            {message}
          </p>
          {warningMessage && (
            <p className="mb-0 text-danger fw-bold" style={{ fontSize: "0.95rem" }}>
              {warningMessage}
            </p>
          )}
        </div>

        {/* 按鈕區域 */}
        <div className="d-flex justify-content-end gap-3 p-4 pt-3">
          <button
            className="btn btn-outline-secondary px-4 rounded-pill"
            onClick={onClose}
            style={{ minWidth: "80px" }}
          >
            取消
          </button>
          <button
            className="btn text-white px-4 rounded-pill"
            onClick={onConfirm}
            style={{
              backgroundColor: "#dc3545",
              borderColor: "#dc3545",
              minWidth: "80px",
            }}
          >
            刪除
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  warningMessage: PropTypes.string,
  itemName: PropTypes.string,
};

export default ConfirmDialog;
