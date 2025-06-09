import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import lg from "../../assets/img/logo_hotel.png";
import { logout } from "../../services/AuthAPI";
import { useGetUserData } from "../../contexts/GetUserContext";
import { useSettingData } from "../../contexts/SettingContext";

const Header = () => {
  const settings = useSettingData();
  const navigate = useNavigate();
  const { userData, setUserData } = useGetUserData();
  const [Shown, setShown] = useState(false);

  const toggleMenu = (e) => {
    e.preventDefault();
    setShown((prev) => !prev);
  };

  const handleContactClick = () => {
    navigate("/#contact");
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserData(null);
      navigate("/");
    } catch (error) {
      console.log("Đã xảy ra lỗi ở header:", error);
    }
  };
  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light py-3"
        id="mainNav"
        style={{ backgroundColor: "rgb(0, 0, 0, 1)", width: "100%" }}
      >
        <div className="container-fluid col-lg-10">
          <Link className="navbar-brand" to="/">
            <img src= {`http://localhost:8000${settings?.logo_url}`} alt={lg} className="navbar-brand" width={100} height={100} />
          </Link>
          <button
            className="navbar-toggler navbar-toggler-right"
            type="button"
            onClick={toggleMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${Shown ? "show" : ""}`}
            id="navbarNav"
          >
            <ul
              className="navbar-nav ms-auto my-2 my-lg-0 "
              style={{ lineHeight: "50px" }}
            >
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Trang chủ
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/room">
                  Phòng nghỉ
                </Link>
              </li>
              <li className="nav-item">
                <div className="nav-link" onClick={handleContactClick} style={{ cursor:"pointer"}}>
                  Liên hệ
                </div>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  Về chúng tôi
                </Link>
              </li>
              {!localStorage.getItem("user") ? (
                <li className="nav-item">
                  <Link
                    className="nav-link myhover"
                    to="/login"
                    style={{
                      backgroundColor: "#8D7535",
                      padding: "0px 16px",
                      border: "none",
                    }}
                  >
                    Đăng nhập
                  </Link>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    {userData ? <Link className="nav-link" to={'/user'}>Thông tin cá nhân</Link> : <p></p>}
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link myhover"
                      onClick={handleLogout}
                      style={{
                        backgroundColor: "#8D7535",
                        padding: "0px 16px",
                        border: "none",
                      }}
                    >
                      Đăng Xuất
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Header;
