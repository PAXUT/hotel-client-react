import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { listConvenient } from "../../services/ConvenientAPI";
import { listType } from "../../services/RoomTypeAPI";
import { updateRoom, getStatusRoom } from "../../services/RoomAPI";

const EditRoom = ({ roomData, onClose, onUpdateSuccess }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [convenients, setConvenients] = useState([]);
  const [selectedConvenients, setSelectedConvenients] = useState([]);

  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(
    roomData.room_type_id || null
  );

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const [status, setStatus] = useState([]);
  const [selectedstatus, setSelectedStatus] = useState(
    roomData.status_room_id || null
  );

  const [error, setError] = useState(null);

  useEffect(() => {
    if (roomData) {
      setName(roomData.name);
      setPrice(roomData.price);
      setDescription(roomData.description || "");
      setImages(roomData.images || []);
      setSelectedRoomType(roomData.room_type_id || null);
      setSelectedConvenients(
        roomData.convenients
          ? roomData.convenients.map((c) => c.id.toString())
          : []
      );
      setSelectedStatus(roomData.status_room_id || null);
    }
  }, [roomData]);

  useEffect(() => {
    listType().then(setRoomTypes);
    listConvenient().then(setConvenients);
    getStatusRoom().then(setStatus);
  }, []);

  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    const removed = updatedImages.splice(index, 1)[0];

    setImages(updatedImages);

    // Nếu là ảnh cũ (có image_path), lưu vào mảng xóa
    if (removed.image_path) {
      setRemovedImages((prev) => [...prev, removed.id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("room_type_id", selectedRoomType);
    formData.append("status_room_id", selectedstatus);
    selectedConvenients.forEach((id) => formData.append("convenients[]", id));
    newImages.forEach((img) => formData.append("image[]", img));
    removedImages.forEach((id) => {
      formData.append("remove_image_ids[]", id);
    });
    try {
      await updateRoom(roomData.id, formData);
      onClose();
      onUpdateSuccess();
      Swal.fire("Thành công", "Thông tin phòng đã được cập nhật", "success");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        if (errors && errors.name) {
          setError(errors);
        } else if (errors && errors.price) {
          setError(errors.price[0]);
        } else if (
          !name ||
          !price ||
          !selectedRoomType ||
          !selectedstatus ||
          images.length === 0 ||
          !description ||
          selectedConvenients.length === 0
        ) {
          setError("Vui lòng điền đầy đủ thông tin.");
        }
      } else {
        Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật phòng", "error");
      }
    }
  };
  return (
    <div className="">
      <div className="card col-lg-12">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h4 className="card-title">Chỉnh sửa thông tin phòng</h4>
            <button className="btn btn-round ms-auto" onClick={onClose}>
              <i className="fa fa-times text-danger"></i>
            </button>
          </div>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row">
              <div className="form-group form-inline col-lg-6">
                <label
                  htmlFor="inlineinput"
                  className="col-md-3 col-form-label"
                >
                  Tên phòng (mã phòng)
                </label>
                <div className="col-md-12 p-0">
                  <input
                    type="text"
                    className="form-control input-full"
                    id="inlineinput"
                    placeholder="Enter Input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group form-inline col-lg-6">
                <label
                  htmlFor="inlineinput"
                  className="col-md-3 col-form-label"
                >
                  Giá phòng
                </label>
                <div className="col-md-12 p-0">
                  <input
                    type="text"
                    className="form-control input-full"
                    id="inlineinput1"
                    placeholder="Enter Input"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group col-lg-6">
                <label className="form-label w-100">Tiện nghi</label>
                <div className="selectgroup selectgroup-pills">
                  {convenients.map((convenient) => (
                    <label className="selectgroup-item" key={convenient.id}>
                      <input
                        type="checkbox"
                        name="convenient[]"
                        value={convenient.id}
                        className="selectgroup-input"
                        checked={selectedConvenients.includes(
                          convenient.id.toString()
                        )}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedConvenients((prev) =>
                            prev.includes(value)
                              ? prev.filter((id) => id !== value)
                              : [...prev, value]
                          );
                        }}
                      />
                      <span className="selectgroup-button">
                        <i
                          className={convenient.icon}
                          style={{ marginRight: "10px" }}
                        ></i>
                        {convenient.name_convenient}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group col-lg-6">
                <label className="form-label">Loại phòng</label>
                <div className="selectgroup w-100">
                  {roomTypes.map((type) => (
                    <label className="selectgroup-item" key={type.id}>
                      <input
                        type="radio"
                        name="value"
                        value={type.id}
                        className="selectgroup-input"
                        checked={selectedRoomType === type.id}
                        onChange={() => setSelectedRoomType(type.id)}
                      />
                      <span
                        className="selectgroup-button"
                        title={type.description}
                      >
                        {type.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group col-lg-6">
                <div className="mb-3">
                  <label htmlFor="backgroundimage" className="form-label">
                    Chọn ảnh mới
                  </label>
                  <input
                    className="form-control "
                    type="file"
                    id="backgroundimage"
                    onChange={handleImageChange}
                    multiple
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ảnh hiện tại :</label>
                  {images.map((img, index) => (
                    <div
                      key={index}
                      style={{
                        display: "inline-block",
                        position: "relative",
                        marginRight: 8,
                      }}
                    >
                      <img
                        src={
                          img.image_path
                            ? `http://localhost:8000${img.image_path}`
                            : URL.createObjectURL(img)
                        }
                        alt={`Ảnh ${index + 1}`}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group col-lg-6">
                <div className="input-group">
                  <span className="input-group-text">Mô tả phòng</span>
                  <textarea
                    id="description"
                    className="form-control"
                    aria-label="With textarea"
                    rows={4}
                    placeholder="Nhập mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-floating form-floating-custom mt-3">
                  <select
                    className="form-select"
                    id="selectFloatingLabel"
                    required
                    value={selectedstatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    {status.map((stt) => (
                      <option
                        key={stt.id}
                        value={stt.id}
                      >
                        {stt.name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="selectFloatingLabel">Trạng thái</label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-secondary">
              Lưu thay đổi
            </button>
            <button
              className="btn btn-danger ms-2"
              type="button"
              onClick={onClose}
            >
              Hủy
            </button>
            {error && <p className="text-danger">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};
export default EditRoom;
