import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getDataRoom, deleteRoom } from "../../services/RoomAPI";
import Loading from "../../components/loading";
import EditRoom from "../../components/form/editroom";
import Pageginate from "../../components/pagegination";
import echo from "../../untils/echo";

const TableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    console.log("useEffect của room component đã chạy"); // Thêm log này
    echo.channel("rooms").listen(".room.status.updated", (e) => {
      console.log("🔴 SỰ KIỆN PUSHER ĐÃ ĐƯỢC NHẬN TRONG REACT!:", e); // Log toàn bộ object e
      console.log("Dữ liệu room:", e.room);
      // Thử cập nhật một biến state đơn giản để xem UI có thay đổi không
      // Ví dụ: setLastReceivedBooking(e.booking);
      setRooms((prevRooms) => {
        // Nếu ban đầu chưa có bookings, trả về một mảng chỉ chứa booking mới
        if (!prevRooms) {
          return [e.room];
        }

        // Tạo một bản sao mới của mảng để đảm bảo tính bất biến
        const updatedRooms = prevRooms.map((room) => {
          // Nếu id của booking hiện tại khớp với id của booking nhận được từ Pusher
          if (room.id === e.room.id) {
            return e.room; // Trả về booking mới đã cập nhật
          }
          return room; // Giữ nguyên các booking khác
        });

        // Kiểm tra xem booking mới có phải là một booking hoàn toàn mới không
        // (tức là không có trong prevBookings)
        const isNewBooking = !updatedRooms.some(
          (room) => room.id === e.room.id
        );
        if (isNewBooking) {
          // Nếu là booking mới, thêm nó vào đầu hoặc cuối danh sách
          return [e.room, ...updatedRooms]; // Thêm vào đầu
        }

        return updatedRooms;
      });

      // Tùy chọn: Nếu bạn muốn làm mới toàn bộ danh sách từ API sau khi nhận sự kiện,
      // bạn có thể gọi fetchData ở đây. Tuy nhiên, nếu sự kiện chỉ cập nhật 1 booking,
      // việc cập nhật cục bộ hiệu quả hơn.
      // fetchData(currentPage);
    });

    return () => {
      console.log("Rời kênh rooms");
      echo.leave("rooms");
    };
  }, []);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getDataRoom(page, perPage);
      setRooms(response.data);
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
    } catch (error) {
      console.error("Error fetching room data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const updateData = async (page = 1) => {
    try {
      const response = await getDataRoom(page, perPage);
      setRooms(response.data);
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa phòng này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: "Có",
      denyButtonText: "Không",
      customClass: {
        actions: "my-actions",
        confirmButton: "order-2",
        denyButton: "order-3",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteRoom(id);
          if (response) {
            Swal.fire("Thành công!", "Xóa thành công!", "success");
            setRooms(rooms.filter((room) => room.id !== id));
          } else {
            Swal.fire("Thất bại!", "Xóa không thành công!", "error");
          }
        } catch (error) {
          console.error("Error deleting room:", error);
          Swal.fire("Thất bại!", "Xóa không thành công!", "error");
        }
      } else if (result.isDenied) {
        Swal.fire("Đã hủy!", "Phòng không bị xóa", "info");
      }
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="col-lg-12">
      {showForm && selectedRoom && (
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
              maxWidth: "60vw",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <EditRoom
              roomData={selectedRoom}
              onClose={() => setShowForm(false)}
              onUpdateSuccess={updateData}
            />
          </div>
        </div>
      )}
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center">
            <h4 className="card-title">Danh sách phòng</h4>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            {loading ? (
              <Loading />
            ) : rooms.length > 0 ? (
              <table
                id="add-row"
                className="display table table-hover table-head-bg-secondary"
              >
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên phòng</th>
                    <th>Loại phòng</th>
                    <th>Giá phòng</th>
                    <th>Trạng thái</th>
                    <th style={{ width: "10%", textAlign: "center" }}>
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{room?.name}</td>
                      <td>{room?.room_type?.name}</td>
                      <td>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(room?.price || 0)}
                        / đêm
                      </td>
                      <td className="">
                        <div className={room.status?.color}>
                          {room.status?.name}
                        </div>
                      </td>
                      <td>
                        <div className="form-button-action">
                          <button
                            type="button"
                            data-bs-toggle="tooltip"
                            title="Chỉnh sửa"
                            className="btn btn-link btn-primary btn-lg"
                            onClick={() => handleEdit(room)}
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            title="Xóa"
                            className="btn btn-link btn-danger"
                            onClick={() => handleDelete(room.id)}
                          >
                            <i className="fa fa-times"></i>
                          </button>
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
  );
};
export default TableRooms;
