import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Cấu hình axios
export const api = axios.create({
  baseURL: API_URL,
});

const getToken = () => {
  return localStorage.getItem("token");
};

export const getDataBooking = async (page = 1, perPage = 6) => {
  try {
    const token = getToken();
    const response = await api.get(
      `/bookings?page=${page}&perPage=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    return [];
  }
};

export const getAllData = async () => {
  try {
    const token = getToken();
    const response = await api.get(`/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.all;
  } catch (error) {
    return [];
  }
};

export const orderRoom = async (formData) => {
  try {
    const token = getToken();
    const response = await api.post("/bookings", formData, {
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

export const orderRoomByVnpay = async (formData) => {
  try {
    const token = getToken();
    const response = await api.post("/bookings/vnpay", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data && response.data.payUrl) {
      return response.data;
    } else {
      throw new Error("Không thể lấy thông tin");
    }
  } catch (error) {
    throw error;
  }
};

export const updateStatus = async (bookingId, newStatus) => {
  try {
    const token = getToken();
    const response = await api.put(
      `/admin/bookings/${bookingId}/status`,
      {
        status_id: newStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePaymentStatus = async (bookingId) => {
  try {
    const token = getToken();
    const response = await api.put(
      `/admin/bookings/${bookingId}/payment`,
      {
        payment_status: "paid",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRefund = async (bookingId) => {
  try {
    const token = getToken();
    const response = await api.put(
      `/admin/bookings/${bookingId}/refund`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
