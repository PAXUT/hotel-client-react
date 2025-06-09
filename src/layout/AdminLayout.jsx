import React, { useEffect } from "react";
// import $ from "jquery";

import HeaderAdmin from "../components/admin/headerAdmin";
import SidebarAdmin from "../components/admin/sidebarAdmin";
import FooterAdmin from "../components/admin/footerAdmin";
import Breadcrumb from "../components/admin/breakcrumb";

const AdminLayout = ({ children }) => {
  useEffect(() => {
    document.title = "Admin Panel"; // Cập nhật tiêu đề trang

    // Thêm favicon
    const favicon = document.createElement("link");
    // favicon.rel = "icon";
    // favicon.href = "/assets/img/kaiadmin/favicon.ico";
    // favicon.type = "image/x-icon";
    document.head.appendChild(favicon);

    // Load CSS
    const cssFiles = [
      "/assets/css/bootstrap.min.css",
      "/assets/css/plugins.min.css",
      "/assets/css/kaiadmin.min.css",
      // "/assets/css/demo.css",
    ];
    const links = cssFiles.map((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
        return link;
      }
      return null;
    });

    // Load Google Fonts & Icons
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

    // Hàm tải script theo thứ tự
    const loadScript = (src, callback) => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement("script");
        script.src = src;
        script.async = false; // Đảm bảo script tải tuần tự
        script.onload = callback;
        document.body.appendChild(script);
      } else {
        callback && callback();
      }
    };

    // Load jQuery đầu tiên, chờ tải xong rồi mới load các plugin
    loadScript("/assets/js/core/jquery-3.7.1.min.js", () => {
      // ✅ Load các plugin sau khi jQuery sẵn sàng
      const scriptFiles = [
        "/assets/js/core/popper.min.js",
        "/assets/js/core/bootstrap.min.js",
        "/assets/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js",
        "/assets/js/plugin/jquery.sparkline/jquery.sparkline.min.js",
        // "/assets/js/plugin/chart-circle/circles.min.js",
        // "/assets/js/plugin/datatables/datatables.min.js",
        // "/assets/js/plugin/sweetalert/sweetalert.min.js",
        "/assets/js/kaiadmin.min.js",
        // "/assets/js/setting-demo.js",
        // "/assets/js/demo.js",
      ];

      let index = 0;
      const loadNextScript = () => {
        if (index < scriptFiles.length) {
          loadScript(scriptFiles[index], () => {
            index++;
            loadNextScript();
          });
        }
      };
      loadNextScript();
    });

    // Kiểm tra Sparkline trước khi sử dụng
    // const checkSparkline = setInterval(() => {
    //   if (window.jQuery && $.fn.sparkline) {
    //     clearInterval(checkSparkline);
    //     console.log("✅ Sparkline đã sẵn sàng!");
    //     $(".sparkline").sparkline([5, 6, 7, 8, 9], {
    //       type: "bar",
    //       barColor: "#4caf50",
    //     });
    //   }
    // }, 1000);

    // Cleanup khi rời khỏi trang Admin
    return () => {
      document.head.removeChild(favicon);
      document.body.removeChild(webFontScript);
      links.forEach((link) => {
        if (link) {
          document.head.removeChild(link);
        }
      });
    };
  }, []);

  return (
    <div className="wrapper">
      <SidebarAdmin />
      <div className="main-panel">
        <HeaderAdmin />
        <div className="container">
          <div className="page-inner">
            <Breadcrumb />
            {children}
          </div>
        </div>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default AdminLayout;
