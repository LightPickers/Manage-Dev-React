import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function CouponFilter({ onSearch, keyword }) {
  const [searchValue, setSearchValue] = useState(keyword);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = e => {
    const value = e.target.value;
    setSearchValue(value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validateInput = value => {
    const invalidChars = value.match(/[^a-zA-Z0-9\u4e00-\u9fa5\s]/g);
    if (invalidChars) {
      return `不允許輸入特殊符號：${[...new Set(invalidChars)].join(", ")}`;
    }
    return "";
  };

  const handleSubmit = e => {
    e.preventDefault();

    const validationError = validateInput(searchValue);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");
    onSearch(searchValue.trim());
  };

  const handleClear = () => {
    setSearchValue("");
    setErrorMessage("");
    onSearch("");
  };

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  return (
    <div className="bg-light p-4 rounded">
      <form onSubmit={handleSubmit} className="row g-3 align-items-end">
        <div className="col-md-6">
          <label className="form-label">搜尋優惠券名稱</label>
          <input
            type="text"
            className={`form-control ${errorMessage ? "is-invalid" : ""}`}
            placeholder="請輸入優惠券名稱"
            value={searchValue}
            onChange={handleInputChange}
            maxLength={50}
          />
          {errorMessage && <div className="invalid-feedback">{errorMessage}</div>}
        </div>
        <div className="col-md-2">
          <button
            type="submit"
            className="btn w-100 rounded-pill"
            style={{
              backgroundColor: "#8BB0B7",
              borderColor: "#8BB0B7",
              color: "white",
            }}
          >
            搜尋
          </button>
        </div>
        <div className="col-md-2">
          <button
            type="button"
            className="btn w-100 rounded-pill"
            onClick={handleClear}
            style={{
              backgroundColor: "#D4D4D4",
              borderColor: "#D4D4D4",
              color: "white",
            }}
          >
            清除條件
          </button>
        </div>
      </form>
    </div>
  );
}

CouponFilter.propTypes = {
  onSearch: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
};

export default CouponFilter;
