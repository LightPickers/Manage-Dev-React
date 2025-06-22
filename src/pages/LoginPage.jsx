import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApi";
import useScreenSize from "../hooks/useScreenSize.js";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [login] = useLoginMutation();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ADMIN_APP_BASE = import.meta.env.VITE_ADMIN_APP_BASE;
  const { screenWidth } = useScreenSize();
  const isMobile = screenWidth < 1440;

  const onSubmit = async data => {
    setIsLoading(true);
    try {
      const response = await login(data).unwrap();

      // 將 token 和 user 存到 Redux 和 localStorage
      dispatch(
        setCredentials({
          user: response.data.user,
          token: response.data.token,
        })
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("登入成功！");
      navigate("/dashboard");
    } catch (err) {
      const message = err?.data?.message || "登入失敗，請稍後再試";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container-fluid loginPage vh-100 p-0 d-flex align-items-center justify-content-center"
      style={{ marginTop: "-88px" }}
    >
      <div className="row w-100 h-100 g-0">
        {/* 圖片區塊 */}
        {screenWidth >= 768 && (
          <div className="col-md-6 h-100">
            <div className="AdminLogo h-100 position-relative overflow-hidden">
              <img
                src={`${ADMIN_APP_BASE}login.jpg`}
                alt="拾光堂 Admin Login"
                className="w-100 h-100"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          </div>
        )}
        <div
          className={`${
            screenWidth >= 768 ? "col-md-6" : "col-12"
          } h-100 d-flex align-items-center justify-content-center position-relative`}
        >
          {/* 警示區塊 */}
          {isMobile && (
            <div
              className="tipBox d-flex align-items-center justify-content-center position-absolute"
              style={{
                top: "10%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                padding: "10px 15px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
              }}
            >
              <span
                className="material-icons-outlined align-content-center me-2"
                style={{ fontSize: "16px", verticalAlign: "middle" }}
              ></span>
              <small>建議使用裝置解析度寬1440px以上</small>
            </div>
          )}
          <div className="login-content" style={{ maxWidth: "360px", width: "100%" }}>
            <div className="text-center mb-4">
              <h1 className="h3 mb-2 text-dark">拾光堂後台管理系統</h1>
              <p className="text-dark mb-0">讓你的收藏，成為他人的靈光</p>
            </div>

            <form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-floating mb-3">
                <input
                  className={`form-control form-control-sm ${errors.email && "is-invalid"}`}
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  style={{ height: "48px" }}
                  {...register("email", {
                    required: "請填寫Email",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email格式錯誤",
                    },
                  })}
                />
                <label htmlFor="email">Email address</label>
                {errors.email && (
                  <div className="invalid-feedback d-block">
                    <small className="text-danger bg-white px-2 py-1 rounded">
                      {errors.email.message}
                    </small>
                  </div>
                )}
              </div>

              <div className="form-floating mb-3">
                <input
                  className={`form-control form-control-sm ${errors.password && "is-invalid"}`}
                  id="password"
                  type="password"
                  placeholder="Password"
                  style={{ height: "48px" }}
                  {...register("password", {
                    required: "請填寫密碼",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/, // 密碼規則
                      message: "密碼需包含大小寫字母和數字，長度為8-16字",
                    },
                  })}
                />
                <label htmlFor="password">Password</label>
                {errors.password && (
                  <div className="invalid-feedback d-block">
                    <small className="text-danger bg-white px-2 py-1 rounded">
                      {errors.password.message}
                    </small>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn w-100 d-flex justify-content-center align-items-center gap-2"
                style={{
                  height: "48px",
                  backgroundColor: "#8BB0B7",
                  borderColor: "#8BB0B7",
                  color: "white",
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    登入中
                  </>
                ) : (
                  "登入"
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <a
                href="https://lightpickers.github.io/Frontend-Dev-React/"
                className="text-decoration-underline"
                style={{ color: "#000" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <small>返回拾光堂官網</small>
              </a>
            </div>

            <div className="text-center mt-4">
              <small className="text-dark">
                無商業用途且僅供作品展示
                <br />© Copyright 2025 拾光堂. All Rights Reserved
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
