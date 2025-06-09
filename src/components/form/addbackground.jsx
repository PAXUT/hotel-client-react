import React, { useState, useRef } from "react";
import Swal from "sweetalert2";

const BackgroundForm = ({ onAdd }) => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      Swal.fire("Cảnh báo!", "Vui lòng chọn một ảnh bìa.", "warning");
      return;
    }
    const formData = new FormData();
    formData.append("backgroundimage", image);
    try {
      onAdd(formData);
      setImage("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Lỗi!", "Đã xảy ra lỗi khi thêm ảnh.", "error");
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Thêm ảnh bìa</h4>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="backgroundimage" className="form-label">
              Chọn ảnh bìa
            </label>
            <input
              className="form-control"
              type="file"
              id="backgroundimage"
              name="backgroundimage"
              ref={fileInputRef}
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            Thêm ảnh
          </button>
        </form>
      </div>
    </div>
  );
};

export default BackgroundForm;
