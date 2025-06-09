import React, { useState, useEffect } from "react";
import { reviewInBooking } from "../../services/ReviewAPI";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const DetailBooking = ({ bookingData, onClose }) => {
  const [reviews, setReviews] = useState({});
  const id = bookingData.id;

  useEffect(() => {
    if (bookingData.review === 2) {
      const fetchReviews = async () => {
        try {
          const response = await reviewInBooking(id);
          setReviews(response);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };
      fetchReviews();
    }
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <AiFillStar key={i} className="text-danger" />
        ) : (
          <AiOutlineStar key={i} className="text-danger" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="">
      <div className="card col-lg-12">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h4 className="card-title">Chi tiết đơn đặt phòng</h4>
            <button className="btn btn-round ms-auto" onClick={onClose}>
              <i className="fa fa-times text-danger"></i>
            </button>
          </div>
          <div className="row">
            <p>Tên khách hàng: {bookingData.user.name}</p>
            <p>
              Giá:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(bookingData.total_price || 0)}
            </p>
            <p>Số điện thoại: {bookingData.user.phone}</p>
            <p>Số lượng người: {bookingData.guests}</p>
            <p>Email: {bookingData.user.email}</p>
            <p>
              Ngày nhận phòng:{" "}
              {new Date(bookingData.check_in_date).toLocaleDateString("vi-VN")}
            </p>
            <p>
              Ngày trả phòng:{" "}
              {new Date(bookingData.check_out_date).toLocaleDateString("vi-VN")}
            </p>
            {bookingData.review === 2 && (
              <>
                <p>Đánh giá của bạn: {reviews?.content}</p>
                <p>{renderStars(reviews.rating)}</p>
              </>
            )}
          </div>
          <div className="text-center">
            <button
              className="btn btn-round ms-auto text-danger"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailBooking;
