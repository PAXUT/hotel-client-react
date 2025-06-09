import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { listConvenient } from "../../services/ConvenientAPI";
import { listType } from "../../services/RoomTypeAPI";
import { addRoom } from "../../services/RoomAPI";

const AddRooms = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const [convenients, setConvenients] = useState([]);
  const [selectedConvenients, setSelectedConvenients] = useState([]);

  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  useEffect(() => {
    const fetchConvenients = async () => {
      try {
        const response = await listConvenient();
        setConvenients(response);
      } catch (error) {
        console.error("Error fetching convenient data:", error);
      }
    };
    const fetchRoomTypes = async () => {
      try {
        const response = await listType();
        setRoomTypes(response);
      } catch (error) {
        console.error("Error fetching room type data:", error);
      }
    };
    fetchConvenients();
    fetchRoomTypes();
  }, []);

  const handleConvenientChange = (event) => {
    const value = event.target.value;
    if (selectedConvenients.includes(value)) {
      setSelectedConvenients(
        selectedConvenients.filter((item) => item !== value)
      );
    } else {
      setSelectedConvenients([...selectedConvenients, value]);
    }
  };

  const handleRoomTypeChange = (event) => {
    const value = event.target.value;
    setSelectedRoomType(value);
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files)); // Chuyển FileList thành mảng
  };

  const formData = new FormData();
  formData.append("name", name);
  formData.append("room_type_id", selectedRoomType);
  formData.append("price", price);
  formData.append("description", description);
  formData.append("status_id", 1);
  formData.append("image", images);
  formData.append("convenient", selectedConvenients);
  selectedConvenients.forEach((convenient) => {
    formData.append("convenients[]", convenient);
  });

  if (images && images.length > 0) {
    images.forEach((img) => {
      formData.append("image[]", img);
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !name ||
      !price ||
      !selectedRoomType ||
      images.length === 0 ||
      !description ||
      selectedConvenients.length === 0
    ) {
      Swal.fire("Thất bại!", "Vui lòng điền đầy đủ thông tin.", "error");
      return;
    }
    try {
      const response = await addRoom(formData);
      if (response) {
        Swal.fire("Thành công!", "Thêm thành công!", "success");
        setName("");
        setPrice("");
        setDescription("");
        setImages(null);
        setSelectedConvenients([]);
        setSelectedRoomType(null);
        setFileInputKey(Date.now());
      } else {
        Swal.fire("Thất bại!", "Thêm không thành công!", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Đã xảy ra lỗi khi thêm phòng!", "error");
    }
  };

  return (
    <div className="">
      <div className="card col-lg-12">
        <div className="card-body">
          <h4 className="card-title">Thêm phòng</h4>
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
                        onChange={handleConvenientChange}
                        checked={selectedConvenients.includes(
                          convenient.id.toString()
                        )}
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
                <div className="selectgroup w-100 flex flex-wrap gap-2">
                  {roomTypes
                    .sort((a, b) => a.capacity - b.capacity)
                    .map((type) => (
                      <label
                        className="selectgroup-item"
                        key={type.id}
                        style={{ flex: "0 0 auto", minWidth: "150px" }}
                      >
                        <input
                          type="radio"
                          name="value"
                          value={type.id}
                          className="selectgroup-input"
                          onChange={handleRoomTypeChange}
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
                    Chọn ảnh
                  </label>
                  <input
                    className="form-control "
                    type="file"
                    id="backgroundimage"
                    name="image[]"
                    onChange={handleImageChange}
                    key={fileInputKey}
                    multiple
                  />
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
              </div>
            </div>
            <button type="submit" className="btn btn-secondary">
              Thêm mới
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AddRooms;
