import { useNavigate } from "react-router-dom";

// 商品管理列表
function ProductListPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-gray-100">
        <div className="container">
          {/* 標題 */}
          <div className="d-flex align-items-center justify-content-between py-2">
            <h2>我的商品</h2>
            <div
              type="button"
              className="bg-white border rounded-3 px-5 py-2"
              onClick={() => navigate("/products/new")}
            >
              ＋新增商品
            </div>
          </div>
          {/* 商品篩選 */}
          <div className="">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  全部商品
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  已上架商品
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  未上架商品
                </a>
              </li>
            </ul>
            <div className=""></div>
          </div>
          {/* 商品列表 */}
        </div>
      </div>
    </>
  );
}

export default ProductListPage;
