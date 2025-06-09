import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Cấu hình axios
const api = axios.create({
  baseURL: API_URL,
});

const getToken = () => {
  return localStorage.getItem("token");
};


export const listbg = async () => {
  try {
    // const token = getToken();
    const response = await api.get("/listbg");

    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Không thể lấy danh sách ảnh bìa");
    }
  } catch (error) {
    throw error;
  }
};

export const AddBackground = async (formData) => {
  try {
    const token = getToken();
    const response = await api.post("/admin/addBackground", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Không thể lấy thông tin về ảnh mới");
    }
  } catch (error) {
    console.error("Lỗi khi thêm ảnh bìa:", error);
    throw error;
  }
};


export const deletebg = async (id) => {
  try {
    const token = getToken();
    const response = await api.delete(`/admin/deletebg/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
