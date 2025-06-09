import { useState } from "react";
import { changePassword } from "../../services/AuthAPI";
import Swal from "sweetalert2";
import Back from "../../components/inc_user/buttonBack";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await changePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );
      if (response.data.code !== 200) {
        Swal.fire("Lỗi", [response.data.message], "error");
      } else {
        Swal.fire("Thành công", "Mật khẩu đã được thay đổi", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      Swal.fire("Lỗi", error.response.data.message, "error");
      console.log(error);
    }
  };

  return (
    <div className="mt-5">
      <div className="container px-4 px-lg-5">
        <Back />
        <div className="row gx-4 gx-lg-5 justify-content-center">
          <div className="col-lg-8 col-xl-6 text-center">
            <h2 className="mt-0">Đổi mật khẩu</h2>
            <hr className="divider" />
          </div>
        </div>
        <div className="row gx-4 gx-lg-5 justify-content-center mb-5">
          <div className="col-lg-4">
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3 ">
                <input
                  className="form-control"
                  id="password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder=""
                />
                <label htmlFor="password">Mật khẩu hiện tại</label>
                <div
                  className="invalid-feedback"
                  data-sb-feedback="password:required"
                >
                  A password is required.
                </div>
              </div>
              <div className="form-floating mb-3 ">
                <input
                  className="form-control"
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder=""
                />
                <label htmlFor="newPassword">Mật khẩu mới</label>
                <div
                  className="invalid-feedback"
                  data-sb-feedback="newPassword:required"
                >
                  A password is required.
                </div>
              </div>
              <div className="form-floating mb-3 ">
                <input
                  className="form-control"
                  id="repeatPassword"
                  type="password"
                  placeholder=""
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label htmlFor="repeatPassword">Xác nhận mật khẩu mới</label>
                <div
                  className="invalid-feedback"
                  data-sb-feedback="repeatPassword:required"
                >
                  A password is required.
                </div>
              </div>
              <div className="d-grid">
                <button className="btn btn-primary btn-xl" id="" type="submit">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <div className="container px-4 px-lg-5">
        <div></div>
        <div className="row gx-4 gx-lg-5 justify-content-center">
          <Back />
          <h1>Đổi mật khẩu</h1>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <form onSubmit={handleSubmit} className="change-password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Mật khẩu hiện tại:</label>
              <input
                type="password"
                id="currentPassword"
                className="password-input"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Mật khẩu mới:</label>
              <input
                type="password"
                id="newPassword"
                className="password-input"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu mới:</label>
              <input
                type="password"
                id="confirmPassword"
                className="password-input"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
            <button type="submit" className="submit-button">
              Đổi mật khẩu
            </button>
          </form>
        </div>
      </div> */}
    </div>
  );
};

export default ChangePassword;
