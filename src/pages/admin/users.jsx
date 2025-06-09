import { useState, useEffect, useCallback, useRef } from "react";
import Swal from "sweetalert2";
import { getAllUser, updateStatus } from "../../services/AuthAPI";
import Loading from "../../components/loading";
import Pageginate from "../../components/pagegination";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const perPage = 10;
  const isCheckingRef = useRef(false);

  const fetchUserData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await getAllUser(page, perPage);
      setUsers(response.data.data);
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  },[]);

  const updateBookingStatus = useCallback(async (userId, newStatus) => {
    try {
      await updateStatus(userId, newStatus);
      return true;
    } catch (error) {
      console.error("Error updating booking status:", error);
      return false;
    }
  }, []);

  const handleStatusChange = useCallback(
    async (userId, newStatus, showNotification = true) => {
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;
      try {
        const success = await updateBookingStatus(userId, newStatus);
        if (success) {
          if (showNotification) {
            Swal.fire({
              title: "Thành công",
              text: "Cập nhật trạng thái thành công",
              icon: "success",
            });
          }
          await fetchUserData(currentPage);
        }
      } finally {
        isCheckingRef.current = false;
      }
    },
    [currentPage, fetchUserData, updateBookingStatus]
  );

  useEffect(() => {
    fetchUserData(currentPage);
  }, [currentPage, fetchUserData]);

  const handlePageChange = (page) => {
    setCurrentPage(page); // sẽ tự động fetch lại qua useEffect
  };

  return (
    <div className="col-lg-12">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center">
            <h4 className="card-title">Danh sách người dùng</h4>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            {loading ? (
              <Loading />
            ) : users.length > 0 ? (
              <table
                id="add-row"
                className="display table table-hover table-head-bg-secondary"
              >
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên người dùng</th>
                    <th>email</th>
                    <th>Số điện thoại</th>
                    <th>Trạng thái</th>
                    <th style={{}}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((user) => user?.role === "0")
                    .map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user?.name}</td>
                        <td>{user?.email}</td>
                        <td>{user?.phone}</td>
                        <td>
                          {user?.status === 0 ? (
                            <p className="text-success">Đã kích hoạt</p>
                          ) : (
                            <p className="text-warning">Vô hiệu hóa</p>
                          )}
                        </td>
                        <td>
                          <div className="form-button-action">
                            {user?.status === 0 ? (
                              <button
                                type="button"
                                title="Vô hiệu hóa"
                                className="btn btn-link btn-danger"
                                onClick={() => handleStatusChange(user.id, 1)}
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            ) : (
                              <button
                                type="button"
                                data-bs-toggle="tooltip"
                                title="Kích hoạt"
                                className="btn btn-link btn-primary btn-lg"
                                onClick={() => handleStatusChange(user.id, 0)}
                              >
                                <i className="fa fa-check"></i>
                              </button>
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
  );
};
export default Users;
