import React, { useState, useEffect } from "react";
import { AddBackground } from "../../services/BackgroundAPI";
import { listbg } from "../../services/BackgroundAPI";
import { deletebg } from "../../services/BackgroundAPI";
import Swal from "sweetalert2";
import BackgroundForm from "../../components/form/addbackground";

const Background = () => {
  const [backgrounds, setBackgrounds] = useState([]);

  const fetchBackgrounds = async () => {
    try {
      const response = await listbg();
      if (!response || !Array.isArray(response)) {
        console.log("Danh sách trống");
        setBackgrounds([]);
        localStorage.removeItem("backgroundsData");
        return;
      }
      setBackgrounds(response);
      localStorage.setItem("backgroundsData", JSON.stringify(response));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const storedBackgrounds = localStorage.getItem("backgroundsData");
    if (storedBackgrounds) {
      try {
        setBackgrounds(JSON.parse(storedBackgrounds));
      } catch (error) {
        console.error("Lỗi khi parse JSON từ localStorage:", error);
        fetchBackgrounds();
      }
    } else {
      fetchBackgrounds();
    }
  }, []);

  const addBackgroundToLocalStorage = (newBackground) => {
    const storedBackgrounds = localStorage.getItem("backgroundsData");
    let parsedBackgrounds = [];
    if (storedBackgrounds) {
      try {
        parsedBackgrounds = JSON.parse(storedBackgrounds);
      } catch (error) {
        console.error("Lỗi khi parse JSON từ localStorage:", error);
        parsedBackgrounds = [];
      }
    }
    parsedBackgrounds = [...parsedBackgrounds, newBackground];
    localStorage.setItem("backgroundsData", JSON.stringify(parsedBackgrounds));
  };

  const removeBackgroundFromLocalStorage = (id) => {
    const storedBackgrounds = localStorage.getItem("backgroundsData");
    if (storedBackgrounds) {
      try {
        const parsedBackgrounds = JSON.parse(storedBackgrounds);
        const updatedBackgrounds = parsedBackgrounds.filter(
          (bg) => bg.id !== id
        );
        localStorage.setItem(
          "backgroundsData",
          JSON.stringify(updatedBackgrounds)
        );
      } catch (error) {
        console.error("Lỗi khi parse JSON từ localStorage:", error);
      }
    }
  };

  const handleAddBackground = async (formData) => {
    try {
      const newBackground = await AddBackground(formData);
      Swal.fire("Thành công!", "Thêm thành công!", "success");
      addBackgroundToLocalStorage(newBackground);
      setBackgrounds((prev) => [...prev, newBackground]);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Lỗi!", "Đã xảy ra lỗi khi thêm ảnh.", "error");
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
        cancelButton: "order-1 right-gap",
        confirmButton: "order-2",
        denyButton: "order-3",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletebg(id);
          Swal.fire("Xóa thành công!", "Ảnh đã được xóa.", "success");
          removeBackgroundFromLocalStorage(id);
          setBackgrounds((prev) => prev.filter((bg) => bg.id !== id));
        } catch (error) {
          console.error("Lỗi khi xóa ảnh:", error);
          Swal.fire("Lỗi!", "Đã xảy ra lỗi khi xóa ảnh.", "error");
        }
      } else {
        Swal.fire("Đã hủy", "Ảnh chưa được xóa.", "info");
      }
    });
  };

  return (
    <div className="row g-3">
      <div className="col-lg-6">
        <BackgroundForm onAdd={handleAddBackground} />
      </div>
      <div className="col-lg-6 col-md-12">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Ảnh bìa</h4>
            <div className="row row-demo-grid">
              { backgrounds.length > 0 ? (
                backgrounds.map((background) => (
                  <div className="col-lg-12 col-md-12" key={background.id}>
                    <div className="card">
                      <div className="card-body text-center">
                        <img
                          src={`http://localhost:8000/storage/${background.path}`}
                          alt="Hình ảnh hiện tại"
                          style={{ width: "100%", height: "auto" }}
                        />
                        <button
                          className="text-danger btn btn-round ms-auto"
                          onClick={() => handleDelete(background.id)}
                          style={{
                            position: "absolute",
                            top: "0px",
                            fontSize: "25px",
                            cursor: "pointer",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            padding: "0px",
                          }}
                          title="Xóa ảnh"
                        >
                          <i className="fas fa-times-circle"></i>
                        </button>
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
export default Background;
