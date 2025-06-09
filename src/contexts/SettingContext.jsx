import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

export const SettingContext = createContext();

export const SettingProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/settings", {
          withCredentials: true,
        });
        setSettings(res.data);
      } catch (err) {
        console.error("Lỗi lấy settings:", err);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SettingContext.Provider value={settings}>
      {children}
    </SettingContext.Provider>
  );
};
export const useSettingData = () => {
  return useContext(SettingContext);
};