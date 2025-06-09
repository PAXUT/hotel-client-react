import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/AuthAPI";
import Back from "../../components/inc_user/buttonBack";
import { useSettingData } from "../../contexts/SettingContext";
import bgImage from "../../assets/img/bg-masthead.jpg";

const Register = () => {
  const navigate = useNavigate();
  const settings = useSettingData();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await register(formData);
      console.log("Đăng ký thành công:", response);
      navigate("/login");
    } catch (error) {
      setError(error || "Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <>
      <section className="vh-100" style={{ background: `url(${bgImage})` }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div
                className="card"
                style={{
                  borderRadius: "1rem",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                }}
              >
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
                          <span className="h1 fw-bold mb-0">Đăng Ký</span>
                        </div>
                          
                        <h5
                          className="fw-normal mb-3 pb-3"
                          style={{ letterSpacing: "1px" }}
                        >
                          Vui lòng điền đầy đủ thông tin
                        </h5>{error && <p className="text-danger">{error}</p>}{" "}
                        <div data-mdb-input-init className="form-outline mb-4">
                          <label className="form-label" htmlFor="form2Example">
                            Họ và tên
                          </label>
                          <input
                            type="text"
                            id="form2Example"
                            className="form-control form-control-lg"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            min={6}
                          />
                        </div>
                        <div data-mdb-input-init className="form-outline mb-4">
                          <label
                            className="form-label"
                            htmlFor="form2Example17"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="form2Example17"
                            name="email"
                            className="form-control form-control-lg"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                        <div data-mdb-input-init className="form-outline mb-4">
                          <label
                            className="form-label"
                            htmlFor="form2Example27"
                          >
                            Mật khẩu
                          </label>
                          <input
                            type="password"
                            id="form2Example27"
                            className="form-control form-control-lg"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                          />
                        </div>
                        <div data-mdb-input-init className="form-outline mb-4">
                          <label
                            className="form-label"
                            htmlFor="phone"
                          >
                            Số điện thoại
                          </label>
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            className="form-control form-control-lg"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="pt-1 mb-4 text-center">
                          <button
                            data-mdb-button-init
                            data-mdb-ripple-init
                            className="btn btn-dark btn-lg btn-block"
                            type="submit"
                            style={{
                              backgroundColor: "#8D7535",
                              border: "none",
                            }}
                          >
                            Đăng Ký
                          </button>
                        </div>
                        <p
                          className="mb-5 pb-lg-2"
                          style={{ color: "#393f81" }}
                        >
                          Bạn đã có tài khoản?{" "}
                          <Link to="/login" style={{ color: "#393f81" }}>
                            Đăng Nhập tại đây
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
              <form onSubmit={handleSubmit}>
                <div className="card shadow-2-strong">
                  <Back />
                  <div className="card-body p-5 text-center">
                    <h3 className="mb-4">Đăng ký</h3>
                    {error && <p className="text-danger">{error}</p>}{" "}
                    { Hiển thị lỗi nếu có }
                    <div className="form-outline mb-3">
                      <label className="form-label" htmlFor="name">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control form-control-lg"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        min={6}
                      />
                    </div>
                    <div className="form-outline mb-3">
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
                        required
                      />
                    </div>
                    <div className="form-outline mb-3">
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control form-control-lg"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        min={6}
                      />
                    </div>
                    <div className="form-outline mb-3">
                      <label className="form-label" htmlFor="password">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        className="form-control form-control-lg"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <input type="hidden" name="role" id="role" value="0" />
                    <button
                      className="btn btn-primary btn-lg btn-block mt-3"
                      type="submit"
                    >
                      Register
                    </button>
                    <p className="mt-3">
                      Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
};

export default Register;
