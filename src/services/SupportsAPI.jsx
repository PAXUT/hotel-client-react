import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Cấu hình axios
const api = axios.create({
  baseURL: API_URL,
});

const getToken = () => {
  return localStorage.getItem("token");
};

export const getData = async () => {
  const token = getToken();
  try {
    const response = await api.get("/listrequest", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {}
};

export const getDataByUser = async () => {
  const token = getToken();
  try {
    const response = await api.get("/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {}
};

export const requestSupports = async (formData) => {
  const token = getToken();
  try {
    const response = await api.post("/addrequest", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const feedback = async (id,responseText) => {
  const token = getToken();
  try {
    // responseText.append("_method", "PUT");
    const response = await api.put(`/feedback/${id}`,{ text : responseText }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
