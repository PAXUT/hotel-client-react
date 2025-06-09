import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Cấu hình axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const response = await api.get("/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch {
    return null;
  }
};

export const getAllUser = async (page = 1, perPage) => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.get(`/alluser?page=${page}&perPage=${perPage}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch {
    return null;
  }
};

// Đăng nhập
export const login = async (formData) => {
  try {
    const response = await api.post("/login", formData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", response.data.user.role.toString()); // Lưu role dưới dạng string
      localStorage.setItem("status_user", response.data.user.status); // Lưu status dưới dạng string
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Đăng ký
export const register = async (formData) => {
  try {
    const response = await api.post("/register", formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Đăng ký thất bại";
  }
};

// Đăng xuất
export const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    await api.post(
      "/logout",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("backgroundsData");
    localStorage.removeItem("status_user");
  } catch (error) {
    throw error;
  }
};

export const updateStatus = async (userId, newStatus) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put(
      `/admin/user/${userId}/status`,
      {
        status: newStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateInfo = async (name, phone) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      "http://localhost:8000/api/user/update",
      {
        name,
        phone,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const changePassword = async (
  current_password,
  new_password,
  new_password_confirmation
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      "http://localhost:8000/api/user/password",
      {
        current_password,
        new_password,
        new_password_confirmation,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
