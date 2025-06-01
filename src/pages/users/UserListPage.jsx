import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import { useGetUsersQuery, useToggleUserActiveStatusMutation } from "@features/users/userApi";

function UserListPage() {
  const [currentPage, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const { data, isLoading, error, refetch } = useGetUsersQuery({
    page: currentPage,
    keyword,
  });
  const [toggleUserActiveStatus] = useToggleUserActiveStatusMutation();
  const [updatingId, setUpdatingId] = useState(null);
  const users = data?.data?.users || [];
  const totalPages = data?.data?.totalPages || 1;
  if (isLoading) {
    return <div className="container py-20">載入中...</div>;
  }

  if (error) {
    return <div className="container py-20 text-danger">發生錯誤，無法取得使用者資料。</div>;
  }

  return (
    <>
      <div className="bg-gray-100">
        <div className="container">
          <div className="d-flex flex-column gap-10 py-10 py-lg-20">
            {/* 麵包屑 */}
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link className="text-gray-" to="/">
                    首頁
                  </Link>
                </li>
                <li className="breadcrumb-item active">使用者管理</li>
              </ol>
            </nav>

            <div className="user-list-contents bg-white d-flex flex-column gap-9 px-8 py-11">
              {/* 標題 */}
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between">
                  <h3>使用者管理</h3>
                  {/* 搜尋欄 */}
                  <div className="d-flex justify-content-end">
                    <input
                      type="text"
                      className="form-control w-auto"
                      placeholder="搜尋姓名或 Email"
                      value={keyword}
                      onChange={e => {
                        setKeyword(e.target.value);
                        setPage(1); // 搜尋時回到第一頁
                      }}
                    />
                  </div>
                </div>
                <div className="divider-line"></div>
              </div>

              {/* 使用者列表 */}
              <table className="table user-list-table align-middle text-nowrap px-5">
                <thead className="user-list-table-head">
                  <tr>
                    <th scope="col">
                      <p className="text-center">頭像</p>
                    </th>
                    <th scope="col">
                      <p>姓名</p>
                    </th>
                    <th scope="col">
                      <p>Email</p>
                    </th>
                    <th scope="col" style={{ paddingRight: "0px", width: "306px" }}>
                      <p>是否停權</p>
                    </th>
                  </tr>
                </thead>
                <tbody className="user-list-table-body">
                  {users.map(users => {
                    return (
                      <tr key={users.id}>
                        <td className="user-list-item-last">
                          <div className="d-flex align-items-center gap-6 p-3">
                            <img
                              // 先放假圖 要改回去item.primary_image
                              src={"https://picsum.photos/id/230/60/60"}
                              alt={users.name}
                              className="rounded-circle"
                              width="60"
                            />
                            <div>
                              <p className="fs-5 text-gray-600" style={{ letterSpacing: "0.1em" }}>
                                {users.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="user-list-item-last">
                          <div className="d-flex justify-content-end align-items-center p-3 gap-1">
                            <div
                              className="fs-5 fw-bold text-gray-500"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              {users.name}
                            </div>
                          </div>
                        </td>
                        <td
                          className={"user-list-item-last text-end text-gray-500 px-5 py-3 gap-3"}
                        >
                          {users.email}
                        </td>
                        <td
                          className="user-list-item-last"
                          style={{ paddingRight: "0px", width: "306px" }}
                        >
                          <div className="d-flex justify-content-end align-items-center p-3 gap-1">
                            <div
                              className="fs-5 fw-bold text-gray-500"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id={`banSwitch-${users.id}`}
                                  checked={!users.is_banned}
                                  disabled={updatingId === users.id}
                                  onChange={async () => {
                                    setUpdatingId(users.id);
                                    try {
                                      await toggleUserActiveStatus({
                                        id: users.id,
                                        is_banned: !users.is_banned,
                                      }).unwrap();
                                      toast.success("使用者狀態已更新");
                                    } catch (error) {
                                      toast.error("更新失敗，請稍後再試");
                                    }
                                    await refetch();
                                    setUpdatingId(null);
                                  }}
                                />
                                <label
                                  className={`form-check-label ${users.is_banned ? "text-danger" : ""}`}
                                  htmlFor={`banSwitch-${users.id}`}
                                >
                                  {updatingId === users.id ? (
                                    <>
                                      <span
                                        className="spinner-border spinner-border-sm me-1"
                                        role="status"
                                        aria-hidden="true"
                                      ></span>
                                      更新中...
                                    </>
                                  ) : users.is_banned ? (
                                    "停權中"
                                  ) : (
                                    "啟用中"
                                  )}
                                </label>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="user-list-table-mobile" style={{ letterSpacing: "0.1em" }}>
                <div className="d-flex flex-column gap-4">
                  {users.map(users => (
                    <div key={users.id} className="d-flex flex-row gap-3">
                      <img
                        className="rounded-circle"
                        src="https://picsum.photos/id/230/60/60"
                        alt={users.name}
                      />
                      <div className="d-flex flex-column justify-content-between w-100">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="text-gray-600 text-multiline-truncate">{users.name}</div>
                          <div className="form-check form-switch ">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id={`banSwitch-${users.id}`}
                              checked={!users.is_banned}
                              disabled={updatingId === users.id}
                              onChange={async () => {
                                setUpdatingId(users.id);
                                try {
                                  await toggleUserActiveStatus({
                                    id: users.id,
                                    is_banned: !users.is_banned,
                                  }).unwrap();
                                  toast.success("使用者狀態已更新");
                                } catch (error) {
                                  toast.error("更新失敗，請稍後再試");
                                }
                                await refetch();
                                setUpdatingId(null);
                              }}
                            />
                            <label
                              className={`form-check-label ${users.is_banned ? "text-danger" : ""}`}
                              htmlFor={`banSwitch-${users.id}`}
                            >
                              {updatingId === users.id ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  更新中...
                                </>
                              ) : users.is_banned ? (
                                "停權中"
                              ) : (
                                "啟用中"
                              )}
                            </label>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="d-flex align-items-center gap-1">
                            <div
                              className="text-gray-500 fw-bold"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              {users.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="divider-line"></div>
              </div>

              {/* 頁碼 */}
              <nav>
                <ul className="pagination justify-content-center mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => currentPage > 1 && setPage(currentPage - 1)}
                    >
                      &lt;
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                    >
                      <button className="page-link" onClick={() => setPage(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
                    >
                      &gt;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserListPage;
