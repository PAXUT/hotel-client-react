import { useState, useEffect, useCallback, useRef } from "react";
import Loading from "../../components/loading";
import Pageginate from "../../components/pagegination";
import {
  getDataBooking,
  updateStatus,
  updatePaymentStatus,
} from "../../services/OrderAPI";
import DetailBooking from "../../components/form/detailbooking";
import Swal from "sweetalert2";
import echo from "../../untils/echo";
console.log("Echo object đã được import:", echo);

const Booking = () => {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const isCheckingRef = useRef(false);
  const perPage = 10;

  useEffect(() => {
    console.log("useEffect của Booking component đã chạy"); // Thêm log này
    echo.channel("bookings").listen(".booking.status.updated", (e) => {
      console.log("🔴 SỰ KIỆN PUSHER ĐÃ ĐƯỢC NHẬN TRONG REACT!:", e); // Log toàn bộ object e
      console.log("Dữ liệu booking:", e.booking);
      // Thử cập nhật một biến state đơn giản để xem UI có thay đổi không
      // Ví dụ: setLastReceivedBooking(e.booking);
      setBookings((prevBookings) => {
        // Nếu ban đầu chưa có bookings, trả về một mảng chỉ chứa booking mới
        if (!prevBookings) {
          return [e.booking];
        }

        // Tạo một bản sao mới của mảng để đảm bảo tính bất biến
        const updatedBookings = prevBookings.map((booking) => {
          // Nếu id của booking hiện tại khớp với id của booking nhận được từ Pusher
          if (booking.id === e.booking.id) {
            return e.booking; // Trả về booking mới đã cập nhật
          }
          return booking; // Giữ nguyên các booking khác
        });

        // Kiểm tra xem booking mới có phải là một booking hoàn toàn mới không
        // (tức là không có trong prevBookings)
        const isNewBooking = !updatedBookings.some(
          (booking) => booking.id === e.booking.id
        );
        if (isNewBooking) {
          // Nếu là booking mới, thêm nó vào đầu hoặc cuối danh sách
          return [e.booking, ...updatedBookings]; // Thêm vào đầu
        }

        return updatedBookings;
      });

      // Tùy chọn: Nếu bạn muốn làm mới toàn bộ danh sách từ API sau khi nhận sự kiện,
      // bạn có thể gọi fetchData ở đây. Tuy nhiên, nếu sự kiện chỉ cập nhật 1 booking,
      // việc cập nhật cục bộ hiệu quả hơn.
      // fetchData(currentPage);
    });

    return () => {
      console.log("Rời kênh bookings");
      echo.leave("bookings");
    };
  }, []);

  const fetchData = useCallback(async (page = 1) => {
    // setLoading(true);
    try {
      const response = await getDataBooking(page, perPage);
      setBookings(response.data);
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking data:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Không thể tải danh sách đơn hàng",
        icon: "error",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBookingStatus = useCallback(async (bookingId, newStatus) => {
    try {
      await updateStatus(bookingId, newStatus);
      return true;
    } catch (error) {
      console.error("Error updating booking status:", error);
      return false;
    }
  }, []);

  const handleStatusChange = useCallback(
    async (bookingId, newStatus, showNotification = true) => {
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;
      try {
        const success = await updateBookingStatus(bookingId, newStatus);
        if (success) {
          if (showNotification) {
            Swal.fire({
              title: "Thành công",
              text: "Cập nhật trạng thái thành công",
              icon: "success",
            });
          }
          await fetchData(currentPage);
        }
      } finally {
        isCheckingRef.current = false;
      }
    },
    [currentPage, fetchData, updateBookingStatus]
  );

  const handlePayment = useCallback(
    async (bookingId) => {
      try {
        await updatePaymentStatus(bookingId);
        Swal.fire({
          title: "Thành công",
          text: "Đã cập nhật thanh toán thành công",
          icon: "success",
        });
        await fetchData(currentPage);
      } catch (error) {
        console.error("Error updating payment status:", error);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể cập nhật trạng thái thanh toán",
          icon: "error",
        });
      }
    },
    [currentPage, fetchData]
  );

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);

  // Cập nhật dữ liệu mỗi 5 phút để đồng bộ với backend
  useEffect(() => {
    if (!bookings) return;

    const interval = setInterval(() => {
      fetchData(currentPage);
    }, 300000); // 5 phút

    return () => clearInterval(interval);
  }, [bookings, currentPage, fetchData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDetail = (booking) => {
    setSelectedBooking(booking);
    setShowForm(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 1:
        return "badge bg-success";
      case 2:
        return "badge bg-secondary";
      case 3:
        return "badge bg-warning";
      case 4:
        return "badge bg-danger";
      case 5:
        return "badge bg-danger";
      case 6:
        return "badge bg-info";
      case 7:
        return "badge bg-success";
      case 8:
        return "badge bg-warning";
      default:
        return "badge bg-info";
    }
  };

  const getPaymentBadgeClass = (paymentStatus, paymentMethod) => {
    if (paymentStatus === "paid" || paymentMethod === "bank")
      return "badge bg-success";
    return "badge bg-warning";
  };

  const getPaymentStatusText = (paymentStatus, paymentMethod) => {
    if (paymentStatus === "paid" || paymentMethod === "bank")
      return "Đã thanh toán";
    return "Chờ thanh toán trực tiếp";
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Đã duyệt";
      case 2:
        return "Khách sạn đã hủy";
      case 3:
        return "Chờ duyệt";
      case 4:
        return "Khách hàng đã hủy";
      case 5:
        return "Hết hạn";
      case 6:
        return "Đã nhận phòng";
      case 7:
        return "Hoàn thành";
      case 8:
        return "Chờ trả phòng";
      default:
        return "Không xác định";
    }
  };

  return (
    <>
      <div className="col-lg-12">
        {showForm && selectedBooking && (
          <div
            className="modal-backdrop"
            onClick={() => setShowForm(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "20px",
                maxWidth: "35vw",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <DetailBooking
                bookingData={selectedBooking}
                onClose={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center">
              <h4 className="card-title">Danh sách đặt phòng</h4>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              {loading ? (
                <Loading />
              ) : bookings?.length > 0 ? (
                <table
                  id="add-row"
                  className="display table table-hover table-head-bg-secondary"
                >
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên khách hàng</th>
                      <th>Phòng</th>
                      <th>Phương thức thanh toán</th>
                      <th>Giá phòng</th>
                      <th>Trạng thái thanh toán</th>
                      <th>Trạng thái đơn hàng</th>
                      <th style={{ textAlign: "center" }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr key={booking.id}>
                        <td>{index + 1}</td>
                        <td>{booking.user?.name}</td>
                        <td>{booking.room?.name}</td>
                        <td>
                          {booking?.payment_method === "cod" ? (
                            <>Trực tiếp</>
                          ) : (
                            <>Qua thẻ ngân hàng</>
                          )}
                        </td>
                        <td>
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(booking?.total_price || 0)}
                        </td>
                        <td>
                          <span
                            className={getPaymentBadgeClass(
                              booking?.payment_status,
                              booking?.payment_method
                            )}
                          >
                            {getPaymentStatusText(
                              booking?.payment_status,
                              booking?.payment_method
                            )}
                          </span>
                        </td>
                        <td>
                          <span
                            className={getStatusBadgeClass(booking.status_id)}
                          >
                            {getStatusText(booking.status_id)}
                          </span>
                        </td>
                        <td>
                          <div className="form-button-action">
                            <button
                              type="button"
                              onClick={() => handleDetail(booking)}
                              className="btn btn-link btn-primary"
                              title="Chi tiết"
                            >
                              <i className="fa fa-eye"></i>
                            </button>
                            {booking.status_id === 3 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(booking.id, 1)
                                  }
                                  className="btn btn-link btn-success"
                                  title="Duyệt"
                                >
                                  <i className="fa fa-check"></i>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(booking.id, 2)
                                  }
                                  className="btn btn-link btn-danger"
                                  title="Hủy"
                                >
                                  <i className="fa fa-times"></i>
                                </button>
                              </>
                            )}
                            {booking.status_id === 1 && (
                              <>
                                {booking.payment_method === "cod" &&
                                booking.payment_status === "unpaid" ? (
                                  <button
                                    type="button"
                                    onClick={() => handlePayment(booking.id)}
                                    className="btn btn-link btn-warning"
                                    title="Thanh toán và nhận phòng"
                                  >
                                    <i className="fas fa-money-bill-wave"></i>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleStatusChange(booking.id, 6)
                                    }
                                    className="btn btn-link btn-info"
                                    title="Nhận phòng"
                                  >
                                    <i className="fa fa-check"></i>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(booking.id, 2)
                                  }
                                  className="btn btn-link btn-danger"
                                  title="Hủy"
                                >
                                  <i className="fa fa-times"></i>
                                </button>
                              </>
                            )}
                            {(booking.status_id === 6 ||
                              booking.status_id === 8) && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(booking.id, 7)
                                  }
                                  className="btn btn-link btn-success"
                                  title="Trả phòng"
                                >
                                  <i className="fa fa-check"></i>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="col-lg-12 col-md-12">
                  <div className="card">
                    <div className="card-body text-center">
                      <p>Danh sách trống</p>
                    </div>
                  </div>
                </div>
              )}
              <Pageginate
                currentPage={currentPage}
                totalPages={lastPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;
