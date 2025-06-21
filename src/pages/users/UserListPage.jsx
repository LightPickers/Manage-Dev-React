import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";

import { useGetUsersQuery, useToggleUserActiveStatusMutation } from "@features/users/userApi";

function UserListPage() {
  const [currentPage, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword] = useDebounce(keyword, 800);
  const { data, isLoading, refetch } = useGetUsersQuery({
    page: currentPage,
    keyword: debouncedKeyword,
  });

  const [toggleUserActiveStatus] = useToggleUserActiveStatusMutation();
  const [updatingId, setUpdatingId] = useState(null);
  const users = data?.data?.users || [];
  const usersNumber = data?.data?.totalUsers || 0;
  const totalPages = data?.data?.totalPages || 1;
  if (isLoading) {
    return <div className="container text-center py-20">載入中...</div>;
  }

  return (
    <div className="container">
      <div className="d-flex flex-column gap-10 py-10 py-lg-20">
        {/* 麵包屑 */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link className="text-gray-" to="/dashboard">
                首頁
              </Link>
            </li>
            <li className="breadcrumb-item active">會員管理</li>
          </ol>
        </nav>

        <div className="user-list-contents bg-white rounded-3 d-flex flex-column gap-9 px-8 py-11">
          {/* 標題 */}
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex flex-column flex-lg-row align-items-lg-end gap-4">
                <h3>會員管理</h3>
                <div>
                  <p className="fs-5 text-gray-600" style={{ letterSpacing: "0.1em" }}>
                    共{usersNumber}筆
                  </p>
                </div>
              </div>
              {/* 搜尋欄 */}
              <div className="d-flex justify-content-end">
                <input
                  type="text"
                  className="form-control w-auto"
                  placeholder="搜尋名稱或 Email"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                />
              </div>
            </div>
            <div className="divider-line"></div>
          </div>

          {/* 使用者列表 */}
          <table className="table user-list-table align-middle text-nowrap px-5 row">
            <thead className="user-list-table-head">
              <tr>
                <th scope="col">
                  <p className="px-7">會員名稱</p>
                </th>
                <th scope="col">
                  <p className="px-7">Email</p>
                </th>
                <th scope="col" style={{ paddingRight: "0px", width: "306px" }}>
                  <p className="px-7">是否停權</p>
                </th>
              </tr>
            </thead>
            <tbody className="user-list-table-body">
              {users.map(users => {
                return (
                  <tr key={users.id}>
                    <td className="user-list-item-last col-4">
                      <div className="d-flex align-items-center gap-6 p-3">
                        <p className="fs-5 text-gray-600 px-4" style={{ letterSpacing: "0.1em" }}>
                          {users.name}
                        </p>
                      </div>
                    </td>
                    <td className={"user-list-item-last text-gray-500 fs-5 px-5 py-3 gap-3 col-5"}>
                      <p className="px-4">{users.email}</p>
                    </td>
                    <td
                      className="user-list-item-last col-3"
                      style={{ paddingRight: "0px", width: "306px" }}
                    >
                      <div className="d-flex align-items-center px-7">
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
                                } catch {
                                  toast.error("更新失敗，請稍後再試");
                                }
                                await refetch();
                                setUpdatingId(null);
                              }}
                            />
                            <label
                              className={`form-check-label text-end ${users.is_banned ? "text-danger" : ""}`}
                              style={{ minWidth: "100px" }}
                              htmlFor={`banSwitch-${users.id}`}
                            >
                              {updatingId === users.id ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  更新中
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
                  <div className="d-flex flex-column justify-content-between gap-2 w-100">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-gray-600 fs-3 fw-bold text-multiline-truncate">
                        {users.name}
                      </div>
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
                            } catch {
                              toast.error("更新失敗，請稍後再試");
                            }
                            await refetch();
                            setUpdatingId(null);
                          }}
                        />
                        <label
                          className={`form-check-label text-end ${users.is_banned ? "text-danger" : ""}`}
                          style={{ minWidth: "80px" }}
                          htmlFor={`banSwitch-${users.id}`}
                        >
                          {updatingId === users.id ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-1"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              更新中
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
                        <div className="text-gray-500 fw-bold" style={{ letterSpacing: "0.1em" }}>
                          {users.email}
                        </div>
                      </div>
                    </div>
                    <div className="divider-line"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 頁碼 */}
          <nav>
            <ul className="pagination justify-content-center mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link shadow-none"
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
                  <button className="page-link shadow-none" onClick={() => setPage(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link shadow-none"
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
  );
}

export default UserListPage;
