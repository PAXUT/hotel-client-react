import React, { useState, useEffect, useCallback, useRef } from "react";
import Loading from "../../components/loading";
import Pageginate from "../../components/pagegination";
import { getDataBooking, updateStatus } from "../../services/OrderAPI";
import DetailBooking from "../../components/form/detailbooking";
import ReviewSection from "../../components/form/review";
import Swal from "sweetalert2";
import Back from "../../components/inc_user/buttonBack";
import CountdownTimer from "../../components/countdown";
import echo from "../../untils/echo";

const Booked = () => {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const isCheckingRef = useRef(false);
  const perPage = 9;

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
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

  useEffect(() => {
    console.log("useEffect của Booking component đã chạy"); // Thêm log này
    echo.channel("bookings").listen(".booking.status.updated", (e) => {
      console.log("🔴 SỰ KIỆN PUSHER ĐÃ ĐƯỢC NHẬN TRONG REACT!:", e); // Log toàn bộ object e
      console.log("Dữ liệu booking:", e.booking);

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

  const handleReview = (booking) => {
    setSelectedBooking(booking);
    setShowReviewForm(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 1:
        return "badge bg-success";
      case 2:
        return "badge bg-danger";
      case 3:
        return "badge bg-warning";
      case 4:
        return "badge bg-danger";
      case 5:
        return "badge bg-secondary";
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
        return "Bạn đã hủy";
      case 5:
        return "Hết hạn";
      case 6:
        return "Đã nhận phòng";
      case 7:
        return "Hoàn thành";
      case 8:
        return "Đến hạn trả phòng";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="container mt-5 px-4">
      <Back />
      <div className="col-lg-12 mt-5">
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
        {showReviewForm && selectedBooking && (
          <div
            className="modal-backdrop"
            onClick={() => setShowReviewForm(false)}
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
              <ReviewSection
                bookingData={selectedBooking}
                onClose={() => setShowReviewForm(false)}
                onSuccess={fetchData}
              />
            </div>
          </div>
        )}
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <h4 className="card-title mb-4">Danh sách đặt phòng</h4>
            </div>
          </div>
          <div className="card-body">
            <div className="row row-demo-grid">
              {loading ? (
                <Loading />
              ) : bookings?.length > 0 ? (
                <>
                  {bookings.map((booking) => (
                    <div className="col-lg-4 mb-4" key={booking.id}>
                      <div
                        className="card"
                        style={{ backgroundColor: "#DEE6FF", height: "100%" }}
                      >
                        <div className="card-body h-100">
                          <div>
                            <p>Phòng: {booking?.room?.name}</p>
                            <p>
                              Phương thức thanh toán:{" "}
                              {booking?.payment_method === "cod" ? (
                                <>Trực tiếp</>
                              ) : (
                                <>Qua thẻ ngân hàng</>
                              )}
                            </p>
                            <p>
                              Tổng thanh toán:{" "}
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(booking?.total_price || 0)}
                            </p>
                            <p>
                              Thanh toán:{" "}
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
                            </p>
                            <p>
                              yêu cầu lúc:{" "}
                              {new Date(booking?.created_at).toLocaleString(
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
                            <p>
                              Trạng thái đơn:{" "}
                              <span
                                className={getStatusBadgeClass(
                                  booking.status_id
                                )}
                              >
                                {getStatusText(booking.status_id)}
                              </span>
                            </p>
                            {booking.payment_status === "unpaid" &&
                              booking.payment_countdown &&
                              (booking.status_id === 3 ||
                                booking.status_id === 5) && (
                                <CountdownTimer
                                  expiresAt={booking.payment_countdown}
                                />
                              )}
                            {booking?.review === 2 && (
                              <p>
                                <i className="fa fa-check text-success"></i> Đã
                                đánh giá
                              </p>
                            )}
                          </div>
                          <div className="text-center">
                            <>
                              <p className="form-button-action">
                                <button
                                  type="button"
                                  onClick={() => handleDetail(booking)}
                                  className="btn btn-primary m-2"
                                  title="Chi tiết"
                                >
                                  Chi tiết
                                </button>
                                {booking.status_id === 3 && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleStatusChange(booking.id, 4)
                                      }
                                      className="btn btn-danger m-2"
                                      title="Hủy đơn đặt phòng"
                                    >
                                      Hủy
                                    </button>
                                  </>
                                )}
                                {booking.review === 1 && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleReview(booking)}
                                      className="btn btn-info m-2"
                                      title="Hủy đơn đặt phòng"
                                    >
                                      Đánh giá
                                    </button>
                                  </>
                                )}
                              </p>
                            </>
                            {/* <button className="btn btn-primary m-2" onClick={() => handleFeedback(booking?.id)}>
                            Phản hồi
                          </button> 
                          <button className="btn btn-danger m-2">Xóa</button>*/}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="col-lg-12 col-md-12">
                  <div className="card-body text-center">
                    <p>Danh sách trống</p>
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
    </div>
  );
};

export default Booked;
