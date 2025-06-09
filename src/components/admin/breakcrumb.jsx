import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();

  const findMenuItems = (menu, path, breadcrumbs = []) => {
    for (const item of menu) {
      if (item.path === path) {
        breadcrumbs.push(item);
        return breadcrumbs;
      }
      if (item.children) {
        const found = findMenuItems(item.children, path, [...breadcrumbs, item]);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const sidebarMenuData = [
    { path: "/admin", label: "Bảng điều khiển", exact: true },
    {
      path: "/admin/room",
      label: "Quản lý phòng",
      children: [
        { path: "/admin/room/list", label: "Danh sách phòng" },
        { path: "/admin/room/add", label: "Thêm phòng" },
      ],
    },
    {
      path: "/admin/type",
      label: "Loại phòng",
    },
    {
      path: "/admin/convenient",
      label: "Tiện nghi",
    },
    {
      path: "/admin/support",
      label: "Yêu cầu hỗ trợ",
    },
    {
      path: "/admin/booking",
      label: "Quản lý đặt phòng",
      children: [
        { path: "/admin/booking/list", label: "Danh sách đơn đặt phòng" },
        { path: "/admin/booking/refund", label: "Yêu cầu hoàn tiền" },
      ],
    },
    {
      path: "/admin/setting",
      label: "Cài đặt",
      children: [
        { path: "/admin/setting/web", label: "Cài đặt trang web" },
        { path: "/admin/setting/slice", label: "Slice" },
      ],
    },
    {
      path: "/admin/user",
      label: "Quản lý tài khoản",
    },
  ];

  const breadcrumbs = findMenuItems(sidebarMenuData, location.pathname) || [];

  return (
    <div className="page-header">
      <ul className="breadcrumbs mb-3 mg-0" style={{ margin: "0px" }}>
        <li className="nav-home">
          <Link to="/admin">
            <i className="icon-home"></i>
          </Link>
        </li>
        <li className="separator">
          <i className="icon-arrow-right"></i>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.path}>
            <li>
              <div style={{ cursor :"pointer" }}>{breadcrumb.label}</div>
            </li>
            {index < breadcrumbs.length - 1 && (
              <li className="separator">
                &nbsp;<i className="icon-arrow-right"></i>&nbsp;
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumb;
