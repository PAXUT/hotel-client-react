import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

const SearchRoomForm = ({ onSearch }) => {
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate) {
      Swal.fire("Thông báo", "Vui lòng chọn ngày trước khi tìm kiếm", "error");
      return;
    }
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);

    if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) {
      Swal.fire("Lỗi", "Ngày không hợp lệ", "error");
      return;
    }

    onSearch({
      checkInDate: inDate.toISOString().split("T")[0],
      checkOutDate: outDate.toISOString().split("T")[0],
      guests,
    });
  };

  const onChange = (dates) => {
    const [start, end] = dates;
    setCheckInDate(start);
    setCheckOutDate(end);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-xl shadow-md w-full max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: "Romie Regular" }}>Tìm kiếm phòng</h2>
      <div className="m-3">
        <div className="col-lg-8 mx-auto row">
          <div className="col-lg-6">
            <label htmlFor="date" className="form-label fw-semibold">
              Chọn ngày đến và đi :
            </label>
            <div className="input-group">
              <DatePicker
                id="date"
                selectsRange
                startDate={checkInDate}
                endDate={checkOutDate}
                onChange={onChange}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                wrapperClassName="w-100"
                className="form-control w-100 border p-2 "
                autoComplete="off"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <label className="form-label fw-semibold" htmlFor="number">
              Số lượng khách
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-users"></i>
              </span>
              <input
                id="number"
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="form-control w-full border p-2 "
                placeholder="Nhập số lượng khách"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <button type="submit" className="btn btn-primary btn-xl">
          Tìm kiếm phòng
        </button>
      </div>
    </form>
  );
};

export default SearchRoomForm;
