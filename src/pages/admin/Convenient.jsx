import React, { useState, useEffect } from "react";
import { addConvenient } from "../../services/ConvenientAPI";
import { listConvenient } from "../../services/ConvenientAPI";
import { deleteConvenient } from "../../services/ConvenientAPI";
import Swal from "sweetalert2";

const Convenient = () => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [convenients, setConvenients] = useState([]);

  const fetchConvenients = async () => {
    try {
      const response = await listConvenient();
      setConvenients(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchConvenients();
  }, []);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("icon", icon);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addConvenient(formData);
      fetchConvenients();
      Swal.fire("Thành công!", "Thêm thành công!", "success");
      setName("");
      setIcon("");
    } catch (error) {
      Swal.fire("Thất bại!", "Vui lòng điền đầy đủ thông tin", "error");
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
          await deleteConvenient(id);
          fetchConvenients();
          Swal.fire("Đã xóa!", "Tiện nghi đã được xóa.", "success");
        } catch (error) {
          console.error("Error:", error);
          Swal.fire("Lỗi!", "Không thể xóa tiện nghi.", "error");
        }
      } else if (result.isDenied) {
        Swal.fire("Đã hủy", "Ảnh chưa được xóa.", "info");
      }
    });
  };
  return (
    <div className="row g-3">
      <div className="col-lg-6">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Thêm tiện nghi</h4>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group form-inline">
                <label
                  htmlFor="inlineinput"
                  className="col-md-3 col-form-label"
                >
                  Tiện nghi
                </label>
                <div className="col-md-9 p-0">
                  <input
                    type="text"
                    className="form-control input-full"
                    id="inlineinput"
                    placeholder="Nhập tên tiện nghi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label d-block">Icon</label>
                <div className="selectgroup selectgroup-secondary selectgroup-pills col-md-10">
                  <label className="selectgroup-item">
                    <input
                      type="radio"
                      name="icon-input"
                      value="fas fa-paw"
                      className="selectgroup-input"
                      checked={icon === "fas fa-paw"}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                      <i className="fas fa-paw"></i>
                    </span>
                  </label>

                  <label className="selectgroup-item">
                    <input
                      type="radio"
                      name="icon-input"
                      value="fas fa-wifi"
                      className="selectgroup-input"
                      checked={icon === "fas fa-wifi"}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                      <i className="fas fa-wifi"></i>
                    </span>
                  </label>

                  <label className="selectgroup-item">
                    <input
                      type="radio"
                      name="icon-input"
                      value="fas fa-tv"
                      className="selectgroup-input"
                      checked={icon === "fas fa-tv"}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                      <i className="fas fa-tv"></i>
                    </span>
                  </label>

                  <label className="selectgroup-item">
                    <input
                      type="radio"
                      name="icon-input"
                      value="fas fa-parking"
                      className="selectgroup-input"
                      checked={icon === "fas fa-parking"}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                      <i className="fas fa-parking"></i>
                    </span>
                  </label>

                  <label className="selectgroup-item">
                    <input
                      type="radio"
                      name="icon-input"
                      value="fas fa-smoking-ban"
                      className="selectgroup-input"
                      checked={icon === "fas fa-smoking-ban"}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                      <i className="fas fa-smoking-ban"></i>
                    </span>
                  </label>

                  <label className="selectgroup-item">
                    <input
                      type="radio"
                      name="icon-input"
                      value="fas fa-smoking"
                      className="selectgroup-input"
                      checked={icon === "fas fa-smoking"}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                      <i className="fas fa-smoking"></i>
                    </span>
                  </label>

                  <label className="selectgroup-item">
                    <input
                      type="radio"
                      name="icon-input"
                      value="fas fa-bed"
                      className="selectgroup-input"
                      checked={icon === "fas fa-bed"}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                      <i className="fas fa-bed"></i>
                    </span>
                  </label>

                  <label className="selectgroup-item">
                    <input
                      type="radio"
                      name="icon-input"
                      value="fas fa-bath"
                      className="selectgroup-input"
                      checked={icon === "fas fa-bath"}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                      <i className="fas fa-bath"></i>
                    </span>
                  </label>

                  <label className="selectgroup-item">
                    <input
                      type="radio"
                      name="icon-input"
                      value="fas fa-snowflake"
                      className="selectgroup-input"
                      checked={icon === "fas fa-snowflake"}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                      <i className="fas fa-snowflake"></i>
                    </span>
                  </label>

                  <label className="selectgroup-item">
                    <input
                      type="radio"
                      name="icon-input"
                      value="fas fa-cocktail"
                      className="selectgroup-input"
                      checked={icon === "fas fa-cocktail"}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                      <i className="fas fa-cocktail"></i>
                    </span>
                  </label>

                  <label className="selectgroup-item">
                    <input
                      type="radio"
                      name="icon-input"
                      value="fas fa-couch"
                      className="selectgroup-input"
                      checked={icon === "fas fa-couch"}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                      <i className="fas fa-couch"></i>
                    </span>
                  </label>

                  <label className="selectgroup-item">
                    <input
                      type="radio"
                      name="icon-input"
                      value="fas fa-fire"
                      className="selectgroup-input"
                      checked={icon === "fas fa-fire"}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                      <i className="fas fa-fire"></i>
                    </span>
                  </label>

                  <label className="selectgroup-item">
                    <input
                      type="radio"
                      name="icon-input"
                      value="fas fa-fire-extinguisher"
                      className="selectgroup-input"
                      checked={icon === "fas fa-fire-extinguisher"}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                      <i className="fas fa-fire-extinguisher"></i>
                    </span>
                  </label>

                  <label className="selectgroup-item">
                    <input
                      type="radio"
                      name="icon-input"
                      value="fas fa-gamepad"
                      className="selectgroup-input"
                      checked={icon === "fas fa-gamepad"}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                      <i className="fas fa-gamepad"></i>
                    </span>
                  </label>

                  <label className="selectgroup-item">
                    <input
                      type="radio"
                      name="icon-input"
                      value="fas fa-motorcycle"
                      className="selectgroup-input"
                      checked={icon === "fas fa-motorcycle"}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                    <span className="selectgroup-button selectgroup-button-icon">
                      <i className="fas fa-motorcycle"></i>
                    </span>
                  </label>
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
            <h4 className="card-title">Tiện nghi</h4>
            <div className="row row-demo-grid">
              {convenients.length > 0 ? (
                convenients.map((convenient) => (
                  <div key={convenient.id}>
                    <div className="text-center row">
                      <div className="col-md-12">
                        <div className="card card-stats card-round">
                          <div className="card-body">
                            <div className="row align-items-center">
                              <div className="col-icon">
                                <div className="icon-big text-center icon-secondary bubble-shadow-small">
                                  <i className={convenient.icon}></i>
                                </div>
                              </div>
                              <div className="col col-stats ms-3 ms-sm-0">
                                <div className="numbers">
                                  <h4 className="card-title">
                                    {convenient.name_convenient}
                                  </h4>
                                  <button
                                    className="text-white fw-bold"
                                    onClick={() => handleDelete(convenient.id)}
                                    style={{
                                      backgroundColor: "red",
                                      border: "none",
                                      borderRadius: "5px",
                                      padding: "22px 22px",
                                      position: "absolute",
                                      top: "17%",
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
                  </div>
                ))
              ) : (
                <div className="col-lg-12 col-md-12">
                  <div className="card">
                    <div className="card-body text-center">
                      <p>danh sách trống</p>
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

export default Convenient;
