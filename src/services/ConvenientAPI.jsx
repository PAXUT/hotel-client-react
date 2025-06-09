import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Cấu hình axios
export const api = axios.create({
  baseURL: API_URL,
});

const getToken = () => {
  return localStorage.getItem("token");
};

export const listConvenient = async () => {
    const token = getToken();
    try {
        const response = await api.get("/listConvenient", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        return [];
    }
}

export const addConvenient = async (formData) => {
  try {
    const token = getToken();
    const response = await api.post("/admin/addConvenient", formData, {
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
};

export const deleteConvenient = async (id) => {
  try {
    const token = getToken();
    const response = await api.delete(`/admin/deleteConvenient/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};