import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getDataRoom, searchRoom } from "../../services/RoomAPI";
import Pageginate from "../../components/pagegination";
import SearchRoomForm from "../../components/form/search";
import Loading from "../../components/loading";
import Back from "../../components/inc_user/buttonBack";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const perPage = 10;

  const fetchRooms = useCallback(
    async (page) => {
      setLoading(true);
      setIsSearching(false);
      try {
        const data = await getDataRoom(page, perPage);
        setRooms(data.data);
        setCurrentPage(data.current_page);
        setLastPage(data.last_page);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRooms([]);
        setCurrentPage(1);
        setLastPage(1);
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  const performSearch = useCallback(
    async (page, dates) => {
      setIsSearching(true);
      try {
        const response = await searchRoom(page, dates, perPage);
        if (response.success && response.data) {
          setRooms(response.data.data);
          setCurrentPage(response.data.current_page);
          setLastPage(response.data.last_page);
        } else {
          console.error("Error searching rooms: No results found");
          setRooms([]);
          setCurrentPage(1);
          setLastPage(1);
        }
      } catch (error) {
        console.error("Error searching rooms:", error);
        setRooms([]);
        setCurrentPage(1);
        setLastPage(1);
      }
    },
    [perPage]
  );

  useEffect(() => {
    if (isSearching && startDate && endDate) {
      performSearch(currentPage, {
        checkInDate: startDate,
        checkOutDate: endDate,
        guests: guests,
      });
    } else {
      fetchRooms(currentPage);
    }
    window.scrollTo({
      top: 0,
      // behavior: "auto", // hoặc 'auto' nếu không cần mượt
    });
  }, [
    currentPage,
    isSearching,
    startDate,
    endDate,
    guests,
    fetchRooms,
    performSearch,
  ]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const handleSearchSubmit = (dateData) => {
    setStartDate(dateData.checkInDate);
    setEndDate(dateData.checkOutDate);
    setGuests(dateData.guests);
    setIsSearching(true);
    setCurrentPage(1);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 1:
        return "badge bg-success";
      case 2:
        return "badge bg-warning";
      case 3:
        return "badge bg-info";
      case 4:
        return "badge bg-danger";
      case 5:
        return "badge bg-danger";
      case 6:
        return "badge bg-info";
      case 7:
        return "badge bg-success";
      default:
        return "badge bg-info";
    }
  };
  return (
    <div className="container mt-5 px-4 px-lg-5">
      <Back />
      <div className="text-center mt-5 mb-5 col-lg-12">
        <div className="col-lg-9 mx-auto ">
          <h1 style={{ fontFamily: "Romie Regular" }}>Phòng nghỉ</h1>
          <p style={{ fontFamily: "Public Sans" }}>
            Phòng nghỉ (gồm các loại phòng từ tiêu chuẩn đến cao cấp) được bố
            trí hài hòa bên tòa nhà Heritage lịch sử, nơi còn lưu giữ mãi nét
            Pháp cổ tráng lệ một thời và tòa nhà Opera được xây dựng sau này
            theo phong cách tân cổ điển duyên dáng. Tất cả các phòng nghỉ đều
            được trang bị giường MyBed theo tiêu chuẩn Sofitel, Internet băng
            thông rộng, TV màn hình phẳng cũng như bộ đồ dùng phòng tắm hiệu
            Balmain.
          </p>
        </div>
      </div>
      <SearchRoomForm onSearch={handleSearchSubmit} />
      <div className="mt-10 m-5 row g-3">
        {loading ? (
          <Loading />
        ) : rooms && rooms.length > 0 ? (
          rooms.map((room) => (
            <div
              className="card mb-5 col-lg-12"
              style={{ padding: "0px" }}
              key={room.id}
            >
              <div className="row g-0">
                <div className="col-md-4" style={{ height: "280px" }}>
                  {room.images && room.images.length > 0 ? (
                    <img
                      src={`http://localhost:8000${room.images[0].image_path}`}
                      alt="Room"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div className="d-flex justify-content-center align-items-center h-100 bg-light">
                      <p className="text-muted">Không có hình ảnh</p>
                    </div>
                  )}
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5
                      className="card-title"
                      style={{ fontFamily: "Romie Regular" }}
                    >
                      {room.name}
                    </h5>
                    <p className="card-text">
                      <strong>Giá:</strong>{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(room?.price || 0)}{" "}
                      / đêm
                    </p>
                    <p className="card-text">
                      <strong>Tiện nghi:</strong>{" "}
                      {room.convenients && room.convenients.length > 0 ? (
                        room.convenients.map((item, index) => (
                          <span key={index} className="badge bg-info me-2">
                            {item.icon && (
                              <i
                                className={item.icon}
                                style={{ marginRight: "10px" }}
                              ></i>
                            )}
                            {item.name_convenient}
                          </span>
                        ))
                      ) : (
                        <span>Không có tiện nghi</span>
                      )}
                    </p>
                    {room.room_type && (
                      <p className="card-text">
                        <strong>Loại phòng:</strong> {room.room_type.name}
                      </p>
                    )}
                    <p className="card-text">
                      <strong>Trạng thái hiện tại:</strong>{" "}
                      <span className={getStatusBadgeClass(room.status?.id)}>
                        {room.status?.name}
                      </span>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">
                        <Link
                          to={`/room/${room.id}`}
                          className="btn btn-primary myhover"
                          style={{ backgroundColor: "#8D7535", border: "none" }}
                        >
                          Chi tiết
                        </Link>
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">
              {isSearching
                ? "Không tìm thấy phòng nào phù hợp với tiêu chí tìm kiếm."
                : "danh sách phòng trống."}
            </p>
          </div>
        )}
      </div>
      {lastPage > 1 && (
        <Pageginate
          currentPage={currentPage}
          totalPages={lastPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Rooms;
