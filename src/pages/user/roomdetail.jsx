import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../../assets/css/customswiper.css";
import Swal from "sweetalert2";
import { useRoomData } from "../../contexts/RoomContext";
import { review } from "../../services/ReviewAPI";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import Back from "../../components/inc_user/buttonBack";

const RoomDetail = () => {
  const { id } = useParams();
  const { room, fetchRoomData } = useRoomData();
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await review(id);
        setReviews(response);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchRoomData(id);
    fetchReviews();
  }, [id, fetchRoomData]);

  useEffect(() => {
    if (room?.images && room?.images.length > 0) {
      setSelectedImage(room?.images[0].image_path);
    }
  }, [room?.images]);

  const handleOrderRoom = (roomId) => {
    if (!localStorage.getItem("user")) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng đăng nhập để đặt phòng.",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy bỏ",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem("redirectAfterLogin", window.location.pathname);
          navigate("/login", { replace: true });
          return;
        }
      });
      return;
    }
    navigate(`/room/order/${roomId}`);
  };

  const maskUsername = (username) => {
    if (username.length <= 2) return username;
    return username[0] + "*****" + username[username.length - 1];
  };

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
    <div className="container-fluid mt-5 col-lg-10">
      <Back />
      <div className="mt-5 col-12">
        <div className="custom-box p-4">
          <div className="text-center">
            <h3 className="custom-title">Thông tin phòng</h3>
          </div>
          <div className="row">
            <section className="mb-4 col-lg-6">
              {room?.images && room?.images.length > 0 ? (
                <div>
                  <div
                    className="mb-4 text-center"
                    style={{
                      height: "400px",
                      overflow: "hidden",
                      borderRadius: "8px",
                    }}
                  >
                    <img
                      src={`http://localhost:8000${selectedImage}`}
                      alt="Ảnh chính"
                      style={{
                        Height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-muted text-center">
                  Không có hình ảnh cho phòng này.
                </p>
              )}
              {room?.images && room?.images.length > 0 ? (
                <Swiper
                  modules={[Navigation]}
                  slidesPerView={4.5}
                  spaceBetween={10}
                  navigation={true}
                  className="mySwiperWithNav"
                >
                  {room?.images.map((img) => (
                    <SwiperSlide
                      key={img.id}
                      onClick={() => setSelectedImage(img.image_path)}
                      style={{
                        cursor: "pointer",
                        width: "160px",
                        height: "150px",
                      }}
                    >
                      <img
                        src={`http://localhost:8000${img.image_path}`}
                        alt="img"
                        className={`img-fluid rounded ${
                          selectedImage === img.image_path
                            ? "border border-primary border-3"
                            : ""
                        }`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <p className="text-muted">Không có hình ảnh nào khác.</p>
              )}
            </section>
            <section className="mb-4 col-lg-6">
                  <h2 className="mb-4 text-center" style={{ fontFamily: "Romie Regular" }}>
                    {room?.name}
                  </h2>
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Loại phòng:</strong>{" "}
                    {room?.room_type?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Gồm:</strong>{" "}
                    {room?.room_type?.description || "N/A"}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Giá từ:</strong>{" "}
                    <u>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(room?.price || 0)}{" "}
                      / đêm
                    </u>
                  </p>
                  <p>
                    <strong>Số lượng tối đa:</strong>{" "}
                    {room?.room_type?.capacity} người
                  </p>
                </div>
              </div>
              <div>
                <p className="mb-3">
                  <strong>Tiện nghi phòng:</strong>
                </p>
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
                <p className="mb-3">
                  <strong>Mô tả</strong>
                </p>
                <p className="text-justify" style={{ textIndent: "3em" }}>
                  {room?.description || "Không có mô tả."}
                </p>
              </div>
              <div className="text-center">
                <button
                  className="btn btn-primary btn-xl mt-3"
                  // style={{ backgroundColor: "#8D7535", border: "none" }}
                  onClick={() => handleOrderRoom(room?.id)}
                >
                  Đặt phòng
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
      <div className="row mt-5">
        <h4 className="mb-3 text-center">Đánh giá</h4>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 border rounded">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            {reviews?.length > 0 ? (
              reviews?.map((review) => (
                <div key={review.id} className="mb-3">
                  <div className="font-bold">
                    {maskUsername(review.user.name)}: {review.content}
                  </div>
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-muted">
                    {new Date(review.created_at).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted text-center">Chưa có đánh giá nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RoomDetail;
