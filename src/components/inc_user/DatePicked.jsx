import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "../../services/RoomAPI";

function CustomDatePicker({ onDateChange, roomId }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await api.get(`/booked-dates/${roomId}`);
        if (response.data && response.data.data) {
          setBookedDates(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
    };

    if (roomId) {
      fetchBookedDates();
    }
  }, [roomId]);

  const getNumberOfDays = useCallback(() => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [startDate, endDate]);

  const formatDate = (date) => {
    return date?.toLocaleDateString("sv-SE"); // Output: yyyy-mm-dd
  };

  useEffect(() => {
    if (endDate) {
      const days = getNumberOfDays();
      onDateChange({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        numberOfDays: days,
      });
    } else {
      onDateChange({
        startDate: formatDate(startDate),
        endDate: null,
        numberOfDays: 0,
      });
    }
  }, [startDate, endDate, onDateChange, getNumberOfDays]);

  const onChange = (dates) => {
    const [start, end] = dates;

    if (!start && !end && start.getTime() !== startDate.getTime()) {
      // Reset lại để bắt đầu chọn lại
      setStartDate(start);
      setEndDate(null);
      return;
    }
    // Ngăn chọn cùng ngày
    if (start && end && start.toDateString() === end.toDateString()) {
      setStartDate(start);
      setEndDate(null);
      return;
    }
    setStartDate(start);
    setEndDate(end);
  };

  const isDateBooked = (date) => {
    return bookedDates.some((booked) => {
      const start = new Date(booked.start);
      const end = new Date(booked.end);
      return date >= start && date <= end;
    });
  };

  return (
    <div className="mb-3">
      <label htmlFor="dateRange" className="form-label">
        Chọn ngày đến và đi:
      </label>
      <DatePicker
        id="dateRange"
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        minDate={new Date()}
        dateFormat="dd/MM/yyyy"
        className="form-control"
        autoComplete="off"
        placeholderText="Nhấn để chọn ngày đến và đi"
        excludeDates={bookedDates.map((booked) => new Date(booked.start))}
        filterDate={(date) => !isDateBooked(date)}
      />
    </div>
  );
}

export default CustomDatePicker;
