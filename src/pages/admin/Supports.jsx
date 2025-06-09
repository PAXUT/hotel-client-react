import React, { useState, useEffect } from "react";
import { getData, feedback } from "../../services/SupportsAPI";
import Swal from "sweetalert2";

const Supports = () => {
  const [supp, setSupp] = useState([]);
  //   const [response, setResponse] = useState("");

  const fetchData = async () => {
    const response = await getData();
    setSupp(response);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFeedback = async (id) => {
    const { value: responseText } = await Swal.fire({
      icon: "warning",
      input: "textarea",
      inputLabel: "Message",
      inputPlaceholder: "Type your message here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showDenyButton: true,
      confirmButtonText: "Gửi phản hồi",
      denyButtonText: "Không",
    });

    if (responseText) {
      try {
        const res = await feedback(id, responseText);
        if (res) {
          Swal.fire("Thành công!", "Phản hồi thành công!", "success");
          fetchData();
        } else {
          Swal.fire("Thất bại!", "Phản hồi không thành công!", "error");
        }
      } catch (error) {
        console.error("Error sending feedback:", error);
      }
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title mb-4">Yêu cầu hỗ trợ từ khách hàng</h4>
        <div className="row row-demo-grid">
          {supp.map((support) => (
            <div className="col-lg-4" key={support.id}>
              <div className="card" style={{backgroundColor:"#DEE6FF"}}>
                <div className="card-body">
                  <div>
                    <p>Tên khách hàng: {support?.name}</p>
                    <p>Địa chỉ email: {support?.email}</p>
                    <p>Số điện thoại: {support?.phone}</p>
                    <p>Nội dung yêu cầu: {support?.message}</p>
                    <p>yêu cầu lúc: {" "}{new Date(support?.created_at).toLocaleString("vi-VN",{
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}</p>
                    <p>Nội dung phản hồi: {support?.response}</p>
                    <p>Trạng thái:{support?.status}</p>
                    <p>Phản hồi lúc: {" "}{support?.responded_at && new Date(support?.responded_at).toLocaleString("vi-VN",{
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}</p>
                  </div>
                  <div className="">
                    <button className="btn btn-primary m-2" onClick={() => handleFeedback(support?.id)}>
                      Phản hồi
                    </button>
                    <button className="btn btn-danger m-2">Xóa</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Supports;
