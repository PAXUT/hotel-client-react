import React from "react";
import { useNavigate } from "react-router-dom";

const Back = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div onClick={handleGoBack} style={{ cursor: "pointer" }}>
        <i className="fas fa-arrow-alt-circle-left"></i> <u>Quay lại</u>
    </div>
  );
};

export default Back;