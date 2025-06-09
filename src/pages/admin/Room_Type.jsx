import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { addType } from "../../services/RoomTypeAPI";
import { listType } from "../../services/RoomTypeAPI";
import { deleteType } from "../../services/RoomTypeAPI";
import Loading from "../../components/loading";

const RoomType = () => {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("1");
  const [des, setDes] = useState("");
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const Fetchdata = async () => {
    setLoading(true);
    try {
      const response = await listType();
      setTypes(response);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại phòng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Fetchdata();
  }, []);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("capacity", capacity);
  formData.append("des", des);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!name || !des || !capacity) {
      Swal.fire("Thất bại!", "Vui lòng nhập đầy đủ thông tin!", "error");
      return;
    }
    try {
      const response = await addType(formData);
      if (response) {
        Swal.fire("Thành công!", "Thêm thành công!", "success");
        setName("");
        setCapacity("1");
        setDes("");
        Fetchdata();
      } else {
        console.error("Error:", response);
        Swal.fire("Thất bại!", "Thêm không thành công!", "error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa ảnh này?",
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
          await deleteType(id);
          Fetchdata();
          Swal.fire("Đã xóa!", "Loại phòng đã được xóa.", "success");
        } catch (error) {
          console.error("Error:", error);
          Swal.fire("Lỗi!", "Không thể xóa.", "error");
        }
      } else if (result.isDenied) {
        Swal.fire("Đã hủy", "", "info");
      }
    });
  };
  return (
    <div className="row g-3">
      <div className="col-lg-6">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Thêm loại phòng</h4>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group form-inline">
                <label
                  htmlFor="inlineinput"
                  className="col-md-3 col-form-label"
                >
                  Tên loại phòng
                </label>
                <div className="col-md-9 p-0">
                  <input
                    type="text"
                    className="form-control input-full"
                    id="inlineinput"
                    placeholder="Nhập tên loại phòng"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group col-md-9">
                <div className="input-group">
                  <span className="input-group-text">Số người tối đa</span>
                  <input
                    className="form-control"
                    type="number"
                    min={1}
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="form-group col-md-9">
                <div className="input-group">
                  <span className="input-group-text">Mô tả</span>
                  <textarea
                    className="form-control"
                    aria-label="With textarea"
                    rows={4}
                    placeholder="Nhập mô tả"
                    value={des}
                    onChange={(e) => setDes(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <button type="submit" className="btn btn-secondary">
                Thêm mới
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Loại phòng</h4>
            <div className="row row-demo-grid">
              {loading ? (
                <Loading />
              ) : types.length > 0 ? (
                types.map((type) => (
                  <div key={type.id}>
                    <div className="col-md-12">
                      <div className="card card-stats card-round">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col col-stats ms-3 ms-sm-0">
                              <div className="numbers">
                                <h4 className="card-title">{type.name}</h4>
                                <p className="card-category">
                                  Số người tối đa: {type.capacity} người
                                </p>
                                <p className="card-category">
                                  Mô tả: {type.description}
                                </p>
                                <button
                                  className="text-white fw-bold"
                                  onClick={() => handleDelete(type.id)}
                                  style={{
                                    backgroundColor: "red",
                                    border: "none",
                                    borderRadius: "5px",
                                    padding: "9px",
                                    position: "absolute",
                                    top: "20%",
                                    right: "10px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-lg-12 col-md-12">
                  <div className="card">
                    <div className="card-body text-center">
                      <p>Danh sách trống</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RoomType;
