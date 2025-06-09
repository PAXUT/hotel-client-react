import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Cấu hình axios
export const api = axios.create({
  baseURL: API_URL,
});

const getToken = () => {
  return localStorage.getItem("token");
};

export const listType = async () => {
  const token = getToken();
  try {
    const response = await api.get("/listtype", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    return [];
  }
};

export const addType = async (formData) => {
  try {
    const token = getToken();
    const response = await api.post("/admin/addtype", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Không thể lấy thông tin");
    }
  } catch (error) {
    throw error;
  }
}

export const deleteType = async (id) => {
  try {
    const token = getToken();
    const response = await api.delete(`/admin/deletetype/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}