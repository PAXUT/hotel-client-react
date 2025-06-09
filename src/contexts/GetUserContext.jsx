import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { getUser } from "../services/AuthAPI";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await getUser();
      if (response) {
        const user = response.user;
        setUserData(user);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.log("Lỗi khi lấy thông tin người dùng:", error);
      setUserData(null);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ userData, setUserData, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useGetUserData = () => {
  return useContext(UserContext);
};