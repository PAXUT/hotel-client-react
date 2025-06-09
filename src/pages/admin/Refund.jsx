import { useState, useEffect, useCallback } from "react";
import Loading from "../../components/loading";
import Pageginate from "../../components/pagegination";
import { getDataBooking, updateRefund } from "../../services/OrderAPI";
import DetailBooking from "../../components/form/detailbooking";
import Swal from "sweetalert2";

const Refund = () => {
  const [bookings, setBookings] = useState(null);
  const bookingVNPAY = bookings?.filter((booking) => booking.refund !== "none");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const perPage = 10;

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

  const handleRefund = useCallback(
    async (bookingId) => {
      try {
        await updateRefund(bookingId);
        Swal.fire({
          title: "Thành công",
          text: "",
          icon: "success",
        });
        await fetchData(currentPage);
      } catch (error) {
        console.error("Error updating payment status:", error);
        Swal.fire({
          title: "Lỗi",
          text: "",
          icon: "error",
        });
      }
    },
    [currentPage, fetchData]
  );

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);

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
              <h4 className="card-title">Danh sách yêu cầu hoàn tiền</h4>
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
                      <th>Giá phòng</th>
                      <th>Thanh toán</th>
                      <th>Trạng thái đơn hàng</th>
                      <th>Yêu cầu hoàn tiền</th>
                      <th style={{ textAlign: "center" }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingVNPAY.map((booking, index) => (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.user?.name}</td>
                        <td>{booking.room?.name}</td>
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
                          {booking?.refund === "pending" ? (
                            <span className="badge bg-warning">Đang chờ</span>
                          ) : (
                            <span className="badge bg-success">Đã hoàn tiền</span>
                          )}
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
                            {booking.refund === "pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleRefund(booking.id)}
                                  className="btn btn-link btn-warning"
                                  title=""
                                >
                                  Hoàn tiền
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
              {bookingVNPAY?.length < perPage ? null : (
                <Pageginate
                  currentPage={currentPage}
                  totalPages={lastPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Refund;
