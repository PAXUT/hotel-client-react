import React from "react";
import LocationMap from "../../components/LocationPicker";
import { useSettingData } from "../../contexts/SettingContext";
import Back from "../../components/inc_user/buttonBack"

const About = () => {
  const settings = useSettingData();

  return (
    <div>
      <div className="container mt-5 px-4">
      <Back/>
        <h1 className="text-center m-5" style={{ fontFamily:"Romie Regular"}}>Về chúng tôi</h1>
        <div className="row">
          <div className="col-md-6 d-flex align-items-center justify-content-center flex-column">
            <div className="row">
              <h1 style={{ fontFamily:"Romie Regular"}}>{settings?.site_name}</h1>
            </div>
            <div className="p-2" style={{ filter: "invert(1)" }}>
              <img src= {`http://localhost:8000${settings?.logo_url}`} alt={''} className="navbar-brand" width={150} height={150}/>
            </div>
          </div>
          <div className="col-md-6">
            <strong>Vị trí:</strong>
            <p className="mt-3"><i className="fas fa-hotel"></i> {settings?.site_name}</p>
            <p className="mt-3"><i className="fas fa-map-marker-alt"></i> {settings?.address}</p>
            <strong>Thông tin liên hệ:</strong>
            <p className="mt-3"><i className="fas fa-phone"></i> {settings?.phone}</p>
            <p className="mt-3"><i className="fa fa-envelope"></i> {settings?.email}</p>
          </div>
        </div>
      </div>
      <div className="">
        <div className="col-lg-12 mx-auto">
          <h1 className="text-center m-5" style={{ fontFamily:"Romie Regular"}}>Địa điểm</h1>
          <LocationMap />
        </div>
      </div>
    </div>
  );
};
export default About;
