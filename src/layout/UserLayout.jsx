import React, { useEffect } from "react";
import { useSettingData } from "../contexts/SettingContext";
import "../assets/css/styles.css";
import Header from "../components/inc_user/header";
import Footer from "../components/inc_user/footer";

const UserLayout = ({ children }) => {
  const settings = useSettingData();
  useEffect(() => {
    document.title = settings?.site_name||"Đang tải...";
  }, [settings]);
  useEffect(() => {
    const webFontScript = document.createElement("script");
    webFontScript.src = "/assets/js/plugin/webfont/webfont.min.js";
    webFontScript.async = true;
    webFontScript.onload = () => {
      if (window.WebFont) {
        window.WebFont.load({
          google: { families: ["Public Sans:300,400,500,600,700"] },
          custom: {
            families: [
              "Font Awesome 5 Solid",
              "Font Awesome 5 Regular",
              "Font Awesome 5 Brands",
              "simple-line-icons",
            ],
            urls: ["/assets/css/fonts.min.css"],
          },
          active: function () {
            sessionStorage.fonts = true;
          },
        });
      }
    };
    document.body.appendChild(webFontScript);

    return () => {
      document.body.removeChild(webFontScript);
    };
  }, []);
  return (
    <div className="">
      <Header />
      <div className="">
        <div>{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
