import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Cấu hình axios
const api = axios.create({
  baseURL: API_URL,
});

const getToken = () => {
  return localStorage.getItem("token");
};

export const review = async (id) => {
  try {
    const response = await api.get(`/reviews/${id}`);
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Không thể lấy đánh giá");
    }
  } catch (error) {
    throw error;
  }
};

export const reviewInBooking = async (id) => {
  try {
    const token = getToken();
    const response = await api.get(`/reviewInBooking/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Không thể lấy đánh giá");
    }
  } catch (error) {
    throw error;
  }
};