import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/vnpay-return",
          {
            params: Object.fromEntries(searchParams.entries()),
            withCredentials: true,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        setResult(response.data);
      } catch (err) {
        console.error("Payment verification error:", err);
        setError(
          err.response?.data?.message || "Có lỗi xảy ra khi xác minh thanh toán"
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading)
    return <p className="p-4">Đang xác minh kết quả thanh toán...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!result)
    return <p className="p-4">Không tìm thấy thông tin thanh toán</p>;

  return (
    <div className="p-4 mt-5">
      {result.status === "success" ? (
        <div className="space-y-2 border border-info rounded p-5 col-lg-4 mx-auto">
          <h2 className="text-center text-xl font-semibold mb-5">
            Thanh toán thành công!
          </h2>
          <div className="row">
            <div className="col">
              <p>Mã đơn đặt phòng: #{result.booking_id}</p>
              <p>Số tiền: {result.amount.toLocaleString()} VNĐ</p>
              <p>Ngày nhận phòng: {result.check_in}</p>
            </div>
            <div className="col">
              <p>Mã phòng: {result.room_id}</p>
              <p>Tên phòng: {result.room_name}</p>
              <p>Ngày trả phòng: {result.check_out}</p>
            </div>
          </div>
          <div className="text-center">
            <button
              className="btn btn-primary mt-3 px-4 py-2 myhover"
              onClick={() => navigate("/", { replace: true })}
              style={{ backgroundColor: "#8D7535", border: "none" }}
            >
              Trở về
            </button>
          </div>
        </div>
      ) : result.status === "failed" ? (
        <div className="space-y-2">
          <h2 className="text-red-600 text-xl font-semibold">
            Thanh toán thất bại
          </h2>
          <p>{result.message || "Vui lòng thử lại."}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <h2 className="text-yellow-600 text-xl font-semibold">
            Cảnh báo bảo mật
          </h2>
          <p className="text-center">
            {result.message || "Giao dịch đã bị hủy."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentReturn;
