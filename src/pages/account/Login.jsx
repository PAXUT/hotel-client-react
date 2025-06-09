import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/AuthAPI";
import { useGetUserData } from "../../contexts/GetUserContext";
import Back from "../../components/inc_user/buttonBack";
import { useSettingData } from "../../contexts/SettingContext";
import bgImage from "../../assets/img/bg-masthead.jpg";

const Login = () => {
  const { fetchUser } = useGetUserData();
  const settings = useSettingData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await login(formData);
      if (response.code === 200){
        fetchUser();
        if (localStorage.getItem("role") === "1") {
          navigate("/admin", { replace: true });
        } else {
          if (localStorage.getItem("status_user") === "1") {
            setError("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ đến khách sạn để được hỗ trợ.");
            localStorage.clear();
            return;
          }
          const redirectTo = localStorage.getItem("redirectAfterLogin")||"/";
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectTo, { replace: true });
        }
      } else {
        setError(response.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      setError(error.response.data.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div>
      <section className="vh-100" style={{ background: `url(${bgImage})`,}}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: "1rem", backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block p-5">
                    <div
                      className="d-flex justify-content-center align-items-center h-100"
                      style={{ filter: "invert(1)" }}
                    >
                      <Link to="/">
                        <img
                          src={`http://localhost:8000${settings?.logo_url}`}
                          alt="login form"
                          className="img-fluid"
                          style={{ borderRadius: "1rem 0 0 1rem" }}
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <Back />
                      <form onSubmit={handleSubmit}>
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <span className="h1 fw-bold mb-0">Đăng nhập</span>
                        </div>
                        <h5
                          className="fw-normal mb-3 pb-3"
                          style={{ letterSpacing: "1px" }}
                        >
                          Đăng nhập bằng tài khoản của bạn
                        </h5>
                        {error && <p className="text-danger">{error}</p>}{" "}
                        <div data-mdb-input-init className="form-outline mb-4">
                          <label className="form-label" htmlFor="email">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control form-control-lg"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                        <div data-mdb-input-init className="form-outline mb-4">
                          <label className="form-label" htmlFor="form2Example27">
                            Mật khẩu
                          </label>
                          <input
                            type="password"
                            id="form2Example27"
                            name="password"
                            className="form-control form-control-lg"
                            value={formData.password}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="pt-1 mb-4 text-center">
                          <button
                            data-mdb-button-init
                            data-mdb-ripple-init
                            className="btn btn-dark btn-lg btn-block"
                            type="submit"
                            style={{ backgroundColor: "#8D7535", border: "none" }}
                          >
                            Đăng nhập
                          </button>
                        </div>
                        <p
                          className="mb-5 pb-lg-2"
                          style={{ color: "#393f81" }}
                        >
                          Bạn chưa có tài khoản?{" "}
                          <Link to="/register" style={{ color: "#393f81" }}>
                            Đăng ký tại đây
                          </Link>
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="vh-100">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-4">
              <div className="row">
                <div className="col">
                  <div className="card shadow-2-strong">
                    <div className="card-body p-5 text-center">
                      <h2 className="mb-5">
                        Chào mừng bạn đến với Hotel Booking
                      </h2>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
                        alt="Hotel Booking"
                        style={{ width: "200px", height: "200px" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card shadow-2-strong">
                    <Back />
                    <div className="card-body p-5 text-center">
                      <h3 className="mb-5">Đăng nhập</h3>
                      {error && <p className="text-danger">{error}</p>}{" "}
                      <form onSubmit={handleSubmit}>
                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="email">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control form-control-lg"
                            autoComplete="username"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="password">
                            Mật khẩu
                          </label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control form-control-lg"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <button
                          className="btn btn-primary btn-lg btn-block m-3"
                          type="submit"
                        >
                          Đăng nhập
                        </button>
                      </form>
                      <br />
                      <Link to="/register">Đăng ký</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Login;
