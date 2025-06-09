import React, { createContext, useState, useContext, useCallback } from "react";
import { getRoomById, getDataRoom } from "../services/RoomAPI";
import axios from "axios";
import { getDataBooking } from "../services/OrderAPI";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {

  const value = {

  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrderData = () => {
  return useContext(OrderContext);
};