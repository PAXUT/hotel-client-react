import React, { useState } from "react";
import axios from "axios";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import Swal from "sweetalert2";

const ReviewSection = ({ bookingData, onClose, onSuccess }) => {
  const roomId = bookingData.room_id;
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 1,
    content: "",
    booking_id: bookingData.id,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(newReview);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:8000/api/rooms/${roomId}/reviews`,
        newReview,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews([response.data.review, ...reviews]);
      setNewReview({ rating: "", content: "", booking_id: "" });
      onClose();
      onSuccess();
      Swal.fire(
        "thành công",
        "Đánh giá của bạn đã được gửi thành công",
        "success"
      );
    } catch (error) {
      console.log("Error submitting review:", error);
    }
  };

  const handleStarClick = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <AiFillStar key={i} className="text-danger cursor-pointer" onClick={() => handleStarClick(i)}/>
        ) : (
          <AiOutlineStar key={i} className="text-danger cursor-pointer" onClick={() => handleStarClick(i)}/>
        )
      );
    }
    return stars;
  };

  return (
    <div className="mt-6">
      <div className="d-flex align-items-center">
        <h2 className="text-xl font-bold mb-4">Đánh giá phòng</h2>
        <button className="btn btn-round ms-auto" onClick={onClose}>
          <i className="fa fa-times text-danger"></i>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mb-4 col-md-8 mx-auto">
        <div className="mb-2">
          <label className="block">Đánh giá (1-5 sao):</label>
          <div className="flex space-x-1 mb-2">
            {renderStars(newReview.rating)}
          </div>
        </div>

        <div className="mb-2 row">
          <label className="">Nội dung đánh giá:</label>
          <textarea
            value={newReview.content}
            onChange={(e) =>
              setNewReview({ ...newReview, content: e.target.value })
            }
            className="border p-2 w-full"
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Gửi đánh giá
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewSection;
