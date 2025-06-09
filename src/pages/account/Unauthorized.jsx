import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="mt-5 container text-center">
      <h1>Bạn không có quyền truy cập trang này!</h1>
      <p>Vui lòng đăng nhập bằng tài khoản admin.</p>
      <Link to="/" className="btn btn-primary">Quay về Trang chủ</Link>
    </div>
  );
};

export default Unauthorized;
