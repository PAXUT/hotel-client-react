import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const Setting = () => {
  const [form, setForm] = useState({
    site_name: "",
    address: "",
    phone: "",
    introduce: "",
    slogan: "",
    facebook: "",
    email: "",
    logo_url: "",
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    await axios.get("http://localhost:8000/api/settings").then((res) => {
      const data = res.data;
      setForm({
        site_name: data.site_name || "",
        address: data.address || "",
        phone: data.phone || "",
        introduce: data.introduce || "",
        slogan: data.slogan || "",
        facebook: data.facebook || "",
        email: data.email || "",
        logo_url: data.logo_url || "",
      });
      if (data.logo_url) {
        setLogoPreview(`http://localhost:8000${data.logo_url}`);
      }
      if (data.banners && data.banners.length > 0) {
        setBannerImages(
          data.banners.map((banner) => ({
            preview: `http://localhost:8000${banner.preview}`,
            key: banner.key,
          }))
        );
      }
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, logo_url: file });
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("site_name", form.site_name);
    formData.append("address", form.address);
    formData.append("phone", form.phone);
    formData.append("introduce", form.introduce);
    formData.append("slogan", form.slogan);
    formData.append("facebook", form.facebook);
    formData.append("email", form.email);

    // Xử lý logo
    if (form.logo_url instanceof File) {
      formData.append("logo", form.logo_url);
    }

    // Xử lý banner images
    bannerImages.forEach((imgObj, index) => {
      if (imgObj.file) {
        formData.append(`banner_${index + 1}`, imgObj.file);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/settings",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.code === 200) {
        Swal.fire("Thành công", "Đã lưu thay đổi", "success");
        // Tải lại dữ liệu mới
        const settingsResponse = await axios.get(
          "http://localhost:8000/api/settings"
        );
        const newData = settingsResponse.data;
        if (newData.logo_url) {
          setLogoPreview(`http://localhost:8000${newData.logo_url}`);
        }
        if (newData.banners && newData.banners.length > 0) {
          setBannerImages(
            newData.banners.map((banner) => ({
              preview: `http://localhost:8000${banner.preview}`,
              key: banner.key,
            }))
          );
        }
        // fetchData();
      } else {
        alert(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      alert(
        "Có lỗi xảy ra: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const [bannerImages, setBannerImages] = useState([]);

  const handleAddBanner = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.slice(0, 6 - bannerImages.length);

    const readers = newFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ file, preview: e.target.result });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      const updated = [...bannerImages, ...results];
      setBannerImages(updated);
    });
  };

  const handleRemoveBanner = async (index) => {
    const banner = bannerImages[index];
    if (banner.key) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/admin/settings/delete-banner",
          { key: banner.key },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.code === 200) {
          const updated = bannerImages.filter((_, i) => i !== index);
          setBannerImages(updated);
          Swal.fire("Thành công", "Đã xóa", "success");
        } else {
          alert(response.data.message || "Có lỗi xảy ra khi xóa ảnh");
        }
      } catch (error) {
        alert(
          "Có lỗi xảy ra khi xóa ảnh: " +
            (error.response?.data?.message || error.message)
        );
      }
    } else {
      const updated = bannerImages.filter((_, i) => i !== index);
      setBannerImages(updated);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/settings/delete-logo",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.code === 200) {
        setLogoPreview(null);
        setForm({ ...form, logo_url: "" });
        Swal.fire("Thành công", "Đã xóa", "success");
      } else {
        alert(response.data.message || "Có lỗi xảy ra khi xóa logo");
      }
    } catch (error) {
      alert(
        "Có lỗi xảy ra khi xóa logo: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="text-xl font-bold mb-4">Cấu hình website</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row">
            <div className="mb-4 col-md-6">
              <label className="block text-sm font-medium mb-2">
                Tên website
              </label>
              <input
                name="site_name"
                value={form.site_name}
                onChange={handleChange}
                placeholder="Tên website"
                className="form-control"
              />
            </div>

            <div className="mb-4 col-md-6">
              <label className="block text-sm font-medium mb-2">Địa chỉ</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-4 col-md-6">
              <label className="block text-sm font-medium mb-2">
                Số điện thoại
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-4 col-md-6">
              <label className="block text-sm font-medium mb-2">
                Giới thiệu
              </label>
              <textarea
                name="introduce"
                value={form.introduce}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-4 col-md-6">
              <label className="block text-sm font-medium mb-2">Slogan</label>
              <input
                name="slogan"
                value={form.slogan}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-4 col-md-6">
              <label className="block text-sm font-medium mb-2">Facebook</label>
              <input
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                placeholder="Nhập link facebook"
                className="form-control"
              />
            </div>

            <div className="mb-4 col-md-6">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="form-control"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Logo</label>
            <div className="flex items-center space-x-4 ">
              <div className="flex-1 col-lg-3 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="form-control"
                />
              </div>
              <div className="col-lg-6">
                {logoPreview && (
                  <div
                    style={{
                      display: "inline-block",
                      position: "relative",
                      marginRight: 8,
                      backgroundColor: "grey",
                      padding: "8px"
                    }}
                  >
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
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
                      X
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Ảnh banner (tối đa 6)
            </label>
            <div className="grid grid-cols-3 gap-4">
              {bannerImages.map((img, index) => (
                <div
                  className=""
                  key={index}
                  style={{
                    display: "inline-block",
                    position: "relative",
                    marginRight: 8,
                  }}
                >
                  <img
                    src={img.preview}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-32 object-cover"
                    style={{ width: "auto", height: "100px" }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBanner(index)}
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
                    X
                  </button>
                </div>
              ))}
            </div>
            {bannerImages.length < 6 && (
              <label className="flex items-center justify-center border rounded h-32 cursor-pointer hover:bg-gray-100 mt-3">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden form-control"
                  multiple
                  onChange={handleAddBanner}
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-secondary mt-4 px-6 py-2 rounded"
          >
            Lưu cấu hình
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setting;
