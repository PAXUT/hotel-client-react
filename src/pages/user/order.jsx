import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoomData } from "../../contexts/RoomContext";
import { useGetUserData } from "../../contexts/GetUserContext";
import CustomDatePicker from "../../components/inc_user/DatePicked";
import Swal from "sweetalert2";
import { orderRoom, orderRoomByVnpay } from "../../services/OrderAPI";
import Back from "../../components/inc_user/buttonBack";

const OrderRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { room, fetchRoomData } = useRoomData();
  const { userData } = useGetUserData();

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [guest, setGuest] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    fetchRoomData(id);
  }, [fetchRoomData, id]);

  const handleDateChange = (dateData) => {
    setSelectedStartDate(dateData.startDate);
    setSelectedEndDate(dateData.endDate);
    setNumberOfDays(dateData.numberOfDays);
  };

  const formData = new FormData();
  formData.append("room_id", room?.id);
  formData.append("user_id", userData?.id);
  formData.append("check_in_date", selectedStartDate);
  formData.append("check_out_date", selectedEndDate);
  formData.append("guest", guest);
  formData.append("total_price", room?.price * numberOfDays);
  formData.append("status_id", 3);
  formData.append("payment_method", paymentMethod);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (guest > parseInt(room.room_type.capacity)) {
      Swal.fire("Thất bại!", "Số người quá quy định!", "error");
      return;
    }
    if (!selectedEndDate) {
      Swal.fire("Thất bại!", "Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }
    if (paymentMethod === "cod") {
      await orderRoom(formData);
      Swal.fire("Đặt phòng thành công!", "", "success");
      navigate(`/user/booked`);
    } else if (paymentMethod === "vnpay") {
      const response = await orderRoomByVnpay(formData);
      window.location.href = response.payUrl;
    }
  };

  return (
    <div className="container-fluid mt-5 col-lg-10">
      <div className="row g-5 ">
        <Back />
        <section className="mb-4 col-lg-8 d-none d-md-flex">
          <div className="col-12">
            <div className="custom-box p-4 h-100">
              <div className="text-center">
                <h3 className="custom-title">Thông tin phòng</h3>
              </div>
              <div className="row">
                <div className="col-lg-5">
                  {room?.images && room?.images.length > 0 ? (
                    <div
                      className="mb-4 text-center"
                      style={{
                        height: "400px",
                        overflow: "hidden",
                        borderRadius: "8px",
                      }}
                    >
                      <img
                        src={`http://localhost:8000${room?.images[0]?.image_path}`}
                        alt="Ảnh chính"
                        style={{
                          Height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <p className="text-muted text-center">
                      Không có hình ảnh cho phòng này.
                    </p>
                  )}
                </div>
                <div className="col-lg-7">
                  <div className="">
                    <div className="col-md-12">
                      <h2 className="mb-3">{room?.name}</h2>
                      <div>
                        <p>
                          <strong>Loại phòng:</strong>{" "}
                          {room?.room_type?.name || "N/A"}
                        </p>
                        <p>
                          <strong>Số lượng tối đa</strong>{" "}
                          {room?.room_type?.capacity || "N/A"} người
                        </p>
                        <p>
                          <strong>Giá từ:</strong>{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(room?.price || 0)}{" "}
                          / đêm
                        </p>
                      </div>
                    </div>
                  </div>
                  <h4 className="mb-3">Tiện nghi phòng</h4>
                  {room?.convenients && room?.convenients.length > 0 ? (
                  <ul className="list-unstyled d-flex flex-wrap gap-2">
                    {room?.convenients.map((convenient) => (
                      <li
                        key={convenient.id}
                        className="p-2"
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: "20px",
                        }}
                      >
                        <i
                          className={convenient.icon}
                          style={{ marginRight: "5px" }}
                        ></i>
                        {convenient.name_convenient}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">
                    Không có tiện nghi nào được liệt kê.
                  </p>
                )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-4 col-lg-4">
          <div className="col-12">
            <div className="custom-box p-4 h-100">
              <div className="text-center">
                <h3 className="custom-title">Đơn đặt phòng</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="mb-3">
                    <u>
                      <div className="row">
                        <div className="col">Người đặt:</div>
                        <div className="col text-end">{userData?.name}</div>
                      </div>
                    </u>
                  </div>
                  <div className="mb-3">
                    <u>
                      <div className="row">
                        <div className="col">Số điện thoại:</div>
                        <div className="col text-end">{userData?.phone}</div>
                      </div>
                    </u>
                  </div>
                  <div className="mb-3">
                    <u>
                      <div className="row">
                        <div className="col">Phòng:</div>
                        <div className="col text-end">{room?.name}</div>
                      </div>
                    </u>
                  </div>
                  <CustomDatePicker
                    onDateChange={handleDateChange}
                    roomId={room?.id}
                  />
                  {numberOfDays ? (
                    <div className="col-auto text-danger">
                      {numberOfDays} ngày
                    </div>
                  ) : (
                    <p>Vui lòng chọn ngày</p>
                  )}
                  <div className="mb-3 row align-items-center">
                    <label htmlFor="name" className="col-auto form-label">
                      Số người
                    </label>
                    <div className="col-auto">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id="name"
                        value={guest}
                        min={1}
                        onChange={(e) => setGuest(e.target.value)}
                        style={{ width: "80px" }}
                      />
                    </div>
                  </div>
                  <div className="">
                    <u>
                      <div className="row">
                        <div className="col">Tổng giá:</div>
                        <div className="col text-end">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(room?.price * numberOfDays || 0)}
                        </div>
                      </div>
                    </u>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault1"
                    >
                      Thanh toán trực tiếp
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                      checked={paymentMethod === "vnpay"}
                      onChange={() => setPaymentMethod("vnpay")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault2"
                    >
                      Thanh toán qua thẻ ngân hàng
                    </label>
                  </div>
                  <div className="text-center">
                    <button
                      className="btn btn-primary btn-xl mt-3"
                      // style={{ backgroundColor: "#8D7535", border: "none" }}
                    >
                      Đặt phòng
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderRoom;
