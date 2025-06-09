import React, { createContext, useState, useContext, useCallback } from "react";
import { getRoomById } from "../services/RoomAPI";
import axios from "axios";

export const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [roomData, setRoomData] = useState(null);
  const [rooms, setRooms] = useState(null)

  const fetchRoomData = useCallback(async (id) => {
    try {
      const response = await getRoomById(id);
      if (response) {
        setRoomData(response);
      } else {
        console.log("No room data available.");
      }
    } catch (error) {
      console.log("Error fetching room data:", error);
    }
  }, []);

  const getListRoom = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/listroom");
      setRooms(response.data.all);
    } catch (error) {
      console.log("Error fetching room data:", error);
    }
  }, []);

  const value = {
    room: roomData,
    fetchRoomData,
    all : rooms,
    getListRoom,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoomData = () => {
  return useContext(RoomContext);
};
