import PropTypes from "prop-types";

function CouponStatusTabs({ activeTab, onTabChange }) {
  const tabs = [
    { key: "all", label: "全部" },
    { key: "active", label: "進行中" },
    { key: "upcoming", label: "接下來的活動" },
    { key: "expired", label: "已過期" },
  ];

  return (
    <div className="d-flex gap-2">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`btn ${activeTab === tab.key ? "" : "btn-outline-secondary"}`}
          onClick={() => onTabChange(tab.key)}
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
  );
}

CouponStatusTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default CouponStatusTabs;
