import React from "react";
import { Link } from "react-router-dom";
import { useSettingData } from "../../contexts/SettingContext";

const Footer = () => {
  const settings = useSettingData();
  return (
    <footer className="py-5">
      <div className="container px-4 px-lg-5">
        <div className="text-center p-2" style={{ filter: "invert(1)" }}>
          <img src= {`http://localhost:8000${settings?.logo_url}`} alt={''} className="navbar-brand" width={150} height={150}/>
        </div>
        <div className="text-center p-2">
          <a href={settings?.facebook} target="blank">
            <i className="fab fa-facebook-square fs-2 m-5 text-muted"></i>
          </a>
        </div>
        <div className="row mb-5">
          <div className="col text-dark">
              <strong>Điều hướng:</strong>
              <p className="mt-3"><Link to={'/'}>Trang chủ</Link></p>
              <p className="mt-3"><Link to={'/room'}>Phòng nghỉ</Link></p>
              <p className="mt-3"><Link to={'/about'}>Về chúng tôi</Link></p>
          </div>
          <div className="col">
            <strong>Vị trí:</strong>
              <p className="mt-3"><i className="fas fa-hotel"></i> {settings?.site_name}</p>
              <p className="mt-3"><i className="fas fa-map-marker-alt"></i> Vị trí: {settings?.address}</p>
          </div>
          <div className="col">
              <strong>Thông tin liên hệ:</strong>
              <p className="mt-3"><i className="fas fa-phone"></i> Số điện thoại: {settings?.phone}</p>
              <p className="mt-3"><i className="fa fa-envelope"></i> Email: {settings?.email}</p>
          </div>
        </div>
        <div className="text-center p-2">
          <a href="https://github.com/PAXUT?tab=repositories" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github-square fs-2 m-5 text-muted"></i>
          </a>
          <a href="https://www.facebook.com/profile.php?id=100021886125871" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-square fs-2 m-5 text-muted"></i>
          </a>
        </div>
        <div className="small text-center text-muted">
          Make in 2025 by -{" "}
          <a
            href="https://www.facebook.com/profile.php?id=100021886125871"
            target="blank"
          >
            Phạm Xuân trường
          </a>{" "}
          with <i className="fas fa-heart"></i>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
