import React, { useState, useEffect } from "react";
import { getDataByUser } from "../../services/SupportsAPI";
import Back from "../../components/inc_user/buttonBack";

const Supports = () => {
  const [supp, setSupp] = useState([]);

  const fetchData = async () => {
    const response = await getDataByUser();
    setSupp(response);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "badge bg-warning";
      case "processing":
        return "badge bg-success";
      case "done":
        return "badge bg-warning";
      case "rejected":
        return "badge bg-danger";
      default:
        return "badge bg-info";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Đang chờ xử lý";
      case "processing":
        return "Đã xử lý";
      case "done":
        return "";
      case "rejected":
        return "Hủy";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="container mt-5 mb-5 px-4" style={{ minHeight: "600px" }}>
      <Back />
      <div className="card mt-5">
        <div className="card-body mb-5">
          <h4 className="card-title mb-4">Yêu cầu hỗ trợ của bạn</h4>
          {supp.length > 0 ? (
            <div className="row row-demo-grid">
              {supp.map((support) => (
                <div className="col-lg-4 mb-4" key={support.id}>
                  <div
                    className="card"
                    style={{ backgroundColor: "#DEE6FF", height: "100%" }}
                  >
                    <div className="card-body">
                      <div>
                        <p>Tên khách hàng: {support?.name}</p>
                        <p>Địa chỉ email: {support?.email}</p>
                        <p>Số điện thoại: {support?.phone}</p>
                        <p>Nội dung yêu cầu: {support?.message}</p>
                        <p>
                          yêu cầu lúc:{" "}
                          {new Date(support?.created_at).toLocaleString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <p className="card-text">
                          <strong className="">Trạng thái:</strong>{" "}
                          <span className={getStatusBadgeClass(support.status)}>
                            {getStatusText(support.status)}
                          </span>
                        </p>
                        <hr className="divider" />
                        <p>Nội dung phản hồi: {support?.response}</p>
                        <p>Trạng thái:{support?.status}</p>
                        <p>
                          Phản hồi lúc:{" "}
                          {support?.responded_at &&
                            new Date(support?.responded_at).toLocaleString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-lg-12 col-md-12">
              <div className="card-body text-center">
                <p>Danh sách trống</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Supports;
