import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApi";
import Header from "@layouts/Header";
import Footer from "@layouts/Footer";
function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [login, { isLoading }] = useLoginMutation();
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async data => {
    try {
      const response = await login(data).unwrap();

      // 將 token 和 user 存到 Redux
      dispatch(
        setCredentials({
          user: response.data.user,
          token: response.data.token,
        })
      );
      toast.success("登入成功");
      navigate("/dashboard");
    } catch (err) {
      const message = err?.data?.message || "登入失敗，請稍後再試";
      toast.error(message);
    }
  };

  return (
    <>
      <Header />
      <div className="container py-20" style={{ maxWidth: "400px" }}>
        <h2 className="mb-4">管理者登入</h2>
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              {...register("email", { required: "Email 是必填欄位" })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              密碼
            </label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              {...register("password", { required: "密碼是必填欄位" })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading ? "登入中..." : "登入"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default LoginPage;
