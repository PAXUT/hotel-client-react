import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/AuthAPI";
import { useGetUserData } from "../../contexts/GetUserContext";
import { useSettingData } from "../../contexts/SettingContext";

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const settings = useSettingData();
  const { userData, setUserData } = useGetUserData();

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
    <div className="main-header">
      <div className="main-header-logo">
        <div className="logo-header" data-background-color="dark">
          <a href="index.html" className="logo">
            <img
              src={`http://localhost:8000${settings?.logo_url}`}
              alt=""
              className="navbar-brand"
              height="20"
            />
          </a>
          <div className="nav-toggle">
            <button className="btn btn-toggle toggle-sidebar">
              <i className="gg-menu-right"></i>
            </button>
            <button className="btn btn-toggle sidenav-toggler">
              <i className="gg-menu-left"></i>
            </button>
          </div>
          <button className="topbar-toggler more">
            <i className="gg-more-vertical-alt"></i>
          </button>
        </div>
      </div>
      <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
        <div className="container-fluid">
          <nav className="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex">
            <h1 style={{ fontFamily: "Romie Regular" }}>{settings.site_name}</h1>
          </nav>
          <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">         
            <li className="nav-item topbar-user dropdown hidden-caret">
              <div
                className="dropdown-toggle profile-pic"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor:"pointer"}}
              >
                <div className="avatar-sm" style={{ fontSize: "25px" }}>
                  <i className="fas fa-user"></i>
                </div>
                <span className="profile-username">
                  <span className="op-7">Xin chào, </span>
                  <span className="fw-bold">
                    {userData ? userData.name : <>loading ...</>}
                  </span>
                </span>
              </div>
              <ul className="dropdown-menu dropdown-user animated fadeIn">
                <div className="dropdown-user-scroll scrollbar-outer">
                  <li>
                    <div className="user-box">
                      <div className="">
                        <h4>
                          {userData ? (
                            <p>{userData.name}</p>
                          ) : (
                            <p>loading ...</p>
                          )}
                        </h4>
                        <p className="text-muted">
                          {userData ? <>{userData.email}</> : <>loading ...</>}
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="dropdown-divider"></div>
                    <div
                      className="dropdown-item"
                      onClick={handleLogout}
                      style={{ cursor:"pointer"}}
                    >
                      Logout
                    </div>
                  </li>
                </div>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};
export default HeaderAdmin;
