import React from "react";
import { Link, useLocation } from "react-router-dom";
import lg from "../../assets/img/logo_hotel.png";
import { useSettingData } from "../../contexts/SettingContext";

const SidebarAdmin = () => {
  const location = useLocation();
  const settings = useSettingData();
  return (
    <div className="sidebar" data-background-color="dark">
      <div className="sidebar-logo">
        <div className="logo-header" data-background-color="dark">
          <Link to="/admin" className="logo">
            <img
              src={`http://localhost:8000${settings?.logo_url}`}
              alt={lg}
              className="navbar-brand"
              height={50}
              width={70}
            />
          </Link>
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
      <div className="sidebar-wrapper scrollbar scrollbar-inner">
        <div className="sidebar-content">
          <ul className="nav nav-secondary">
            <li
              className={`nav-item ${
                location.pathname === "/admin" ? "active" : ""
              }`}
            >
              <Link to="/admin">
                <i className="fas fa-home"></i>
                <p>Bảng điều khiển</p>
              </Link>
            </li>
            <li className="nav-section">
              <span className="sidebar-mini-icon">
                <i className="fa fa-ellipsis-h"></i>
              </span>
              <h4 className="text-section">Chức năng</h4>
            </li>
            <li
              className={`nav-item ${
                location.pathname.includes("/admin/room")
                  ? "active submenu"
                  : ""
              }`}
            >
              <a data-bs-toggle="collapse" href="#rooms">
                <i className="fas fa-building"></i>
                <p>Quản lý phòng</p>
                <span className="caret"></span>
              </a>
              <div
                className={`collapse ${
                  location.pathname.includes("/admin/room") ? "show" : ""
                }`}
                id="rooms"
              >
                <ul className="nav nav-collapse">
                  <li
                    className={
                      location.pathname === "/admin/room/add" ? "active" : ""
                    }
                  >
                    <Link to="/admin/room/add">
                      <span className="sub-item">Thêm phòng mới</span>
                    </Link>
                  </li>
                  <li
                    className={
                      location.pathname === "/admin/room/list" ? "active" : ""
                    }
                  >
                    <Link to="/admin/room/list">
                      <span className="sub-item">Danh sách phòng</span>
                    </Link>
                  </li>
                  <li
                    className={
                      location.pathname === "/admin/room/empty" ? "active" : ""
                    }
                  >
                    <Link to="/admin/room/empty">
                      <span className="sub-item">Danh sách phòng trống</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li
              className={`nav-item ${
                location.pathname.includes("/admin/type")
                  ? "active submenu"
                  : ""
              }`}
            >
              <Link to="/admin/type">
                <i className="fas fa-bed"></i>
                <p>Loại phòng</p>
              </Link>
            </li>
            <li
              className={`nav-item ${
                location.pathname.includes("/admin/convenient")
                  ? "active submenu"
                  : ""
              }`}
            >
              <Link to="/admin/convenient">
                <i className="fas fa-bath"></i>
                <p>Tiện nghi</p>
              </Link>
            </li>
            <li
              className={`nav-item ${
                location.pathname.includes("/admin/booking")
                  ? "active submenu"
                  : ""
              }`}
            >
              <a data-bs-toggle="collapse" href="#bookings">
                <i className="fas fa-building"></i>
                <p>Quản lý đặt phòng</p>
                <span className="caret"></span>
              </a>
              <div
                className={`collapse ${
                  location.pathname.includes("/admin/booking") ? "show" : ""
                }`}
                id="bookings"
              >
                <ul className="nav nav-collapse">
                  <li
                    className={
                      location.pathname === "/admin/booking/list" ? "active" : ""
                    }
                  >
                    <Link to="/admin/booking/list">
                      <span className="sub-item">Danh sách đơn đặt phòng</span>
                    </Link>
                  </li>
                  <li
                    className={
                      location.pathname === "/admin/booking/refund" ? "active" : ""
                    }
                  >
                    <Link to="/admin/booking/refund">
                      <span className="sub-item">Yêu cầu hoàn tiền</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li
              className={`nav-item ${
                location.pathname.includes("/admin/user")
                  ? "active submenu"
                  : ""
              }`}
            >
              <Link to="/admin/user">
                <i className="fas fa-users"></i>
                <p>Quản lý tài khoản</p>
              </Link>
            </li>
            <li
              className={`nav-item ${
                location.pathname.includes("/admin/support")
                  ? "active submenu"
                  : ""
              }`}
            >
              <Link to="/admin/support">
                <i className="fas fa-hands-helping"></i>
                <p>Yêu cầu hỗ trợ</p>
              </Link>
            </li>
            <li
              className={`nav-item ${
                location.pathname.includes("/admin/setting")
                  ? "active submenu"
                  : ""
              }`}
            >
              <a data-bs-toggle="collapse" href="#settings">
                <i className="icon-settings"></i>
                <p>Cài đặt</p>
                <span className="caret"></span>
              </a>
              <div
                className={`collapse ${
                  location.pathname.includes("/admin/setting") ? "show" : ""
                }`}
                id="settings"
              >
                <ul className="nav nav-collapse">
                  <li
                    className={
                      location.pathname === "/admin/setting/web" ? "active" : ""
                    }
                  >
                    <Link to="/admin/setting/web">
                      <span className="sub-item">Cài đặt trang web</span>
                    </Link>
                  </li>
                  <li
                    className={
                      location.pathname === "/admin/setting/slice"
                        ? "active"
                        : ""
                    }
                  >
                    <Link to="/admin/setting/slice">
                      <span className="sub-item">Slice</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default SidebarAdmin;
