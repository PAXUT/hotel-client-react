import React from "react";

const Loading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-secondary" style={{ padding :"20px" }}></div>
        <span style={{ padding :"10px" }}> Đang tải...</span>
      </div>
  );
};

export default Loading;
