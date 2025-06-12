import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Cấu hình axios
export const api = axios.create({
  baseURL: API_URL,
});

const getToken = () => {
  return localStorage.getItem("token");
};

export const getDataRoom = async (page = 1, perPage) => {
  try {
    const response = await api.get(`/listroom?page=${page}&perPage=${perPage}`);
    return response.data.data;
  } catch (error) {
    return [];
  }
};

export const getEmptyrooms = async (page = 1, perPage) => {
  try {
    const response = await api.get(`/listroom?page=${page}&perPage=${perPage}`);
    return response.data.emptyrooms;
  } catch (error) {
    return [];
  }
};

export const getStatusRoom = async () => {
  try {
    const response = await api.get("/sttroom");
    return response.data.data;
  } catch (error) {
    return [];
  }
};

export const addRoom = async (formData) => {
  try {
    const token = getToken();
    const response = await api.post("/admin/addroom", formData, {
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

export const getRoomById = async (id) => {
  try {
    const response = await api.get(`/getroom/${id}`);
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Không thể lấy thông tin");
    }
  } catch (error) {
    throw error;
  }
};

export const updateRoom = async (id, formData) => {
  try {
    const token = getToken();
    formData.append("_method", "PUT");
    const response = await api.post(`/admin/updateroom/${id}`, formData, {
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

export const deleteRoom = async (id) => {
  try {
    const token = getToken();
    const response = await api.delete(`/admin/deleteroom/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchRoom = async (page = 1, dates, perPage) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/available-rooms`,
      {
        params: {
          start_date: dates?.checkInDate,
          end_date: dates?.checkOutDate,
          guests: dates?.guests,
          page: page,
          per_page: perPage,
        },
      }
    );
    return {
      data: response.data.data,
      success: true
    };
  } catch (error) {
    console.error("Error in searchRoom:", error);
    return {
      data: {
        data: [],
        current_page: 1,
        last_page: 1
      },
      success: false
    };
  }
};
