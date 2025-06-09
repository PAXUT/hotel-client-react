import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetUserData } from "../../contexts/GetUserContext";
import { updateInfo } from "../../services/AuthAPI";
import Swal from "sweetalert2";
import Back from "../../components/inc_user/buttonBack";

const User = () => {
  const { userData } = useGetUserData();
  const [name, setName] = useState(userData?.name || "");
  const [phone, setPhone] = useState(userData?.phone || "");

  useEffect(() => {
    if (userData?.name) {
      setName(userData.name);
      setPhone(userData.phone);
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateInfo(name, phone);
      Swal.fire(
        "Thay đổi thành công",
        "Thông tin của bạn đã được cập nhật",
        "success"
      );
      const updatedUserData = {
        ...userData,
        name: name,
        phone: phone,
      };
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="mt-5">
      <div className="container px-4 px-lg-5">
        <Back />
        <div className="row gx-4 gx-lg-5 justify-content-center">
          <div className="col-lg-8 col-xl-6 text-center">
            <h2 className="mt-0">Thông tin cá nhân</h2>
            <hr className="divider" />
          </div>
        </div>
        <div className="row gx-4 gx-lg-5 justify-content-center mb-5">
          <div className="col-lg-4">
            <div className="form-floating mb-3">
              <input
                className="form-control"
                id="email"
                type="email"
                placeholder="name@example.com"
                defaultValue={userData?.email}
                disabled
              />
              <label htmlFor="email">Email</label>
              <div
                className="invalid-feedback"
                data-sb-feedback="email:required"
              >
                An email is required.
              </div>
              <div className="invalid-feedback" data-sb-feedback="email:email">
                Email is not valid.
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3 ">
                <input
                  className="form-control"
                  id="name"
                  type="text"
                  placeholder="Enter your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="name">Tên người dùng</label>
                <div
                  className="invalid-feedback"
                  data-sb-feedback="name:required"
                >
                  A name is required.
                </div>
              </div>
              <div className="form-floating mb-3 ">
                <input
                  className="form-control"
                  id="phone"
                  placeholder="Enter your phone..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <label htmlFor="phone">Số điện thoại</label>
                <div
                  className="invalid-feedback"
                  data-sb-feedback="phone:required"
                >
                  Phone is required.
                </div>
              </div>
              <div className="d-grid">
                <button className="btn btn-primary btn-xl" id="" type="submit">
                  Lưu thay đổi
                </button>
              </div>
            </form>
            <Link
              className="d-grid mt-3"
              to={"/user/changepassword"}
              style={{ textDecoration: "none" }}
            >
              <button className="btn btn-primary btn-xl">Đổi mật khẩu</button>
            </Link>
            <Link
              className="d-grid mt-3"
              to={"/user/booked"}
              style={{ textDecoration: "none" }}
            >
              <button className="btn btn-primary btn-xl">
                Lịch sử đặt phòng
              </button>
            </Link>
            <Link
              className="d-grid mt-3"
              to={"/user/supports"}
              style={{ textDecoration: "none" }}
            >
              <button className="btn btn-primary btn-xl">Yêu cầu hỗ trợ</button>
            </Link>
          </div>
        </div>
        <div className="row gx-4 gx-lg-5 justify-content-center">
          <div className="col-lg-4 text-center mb-5 mb-lg-0">
            <i className="bi-phone fs-2 mb-3 text-muted"></i>
            <div>+1 (555) 123-4567</div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default User;
