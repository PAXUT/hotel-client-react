import React from "react";

const FooterAdmin = () => {
  return (
    <footer className="footer">
      <div className="container-fluid d-flex justify-content-between">
        <nav className="pull-left">
          <ul className="nav">
            <li className="nav-item">
              <a className="nav-link" target="_blank" rel="noopener noreferrer" href="https://www.google.com/search?q=ictu&rlz=1C1GCEA_viVN1078VN1078&oq=ictu&gs_lcrp=EgZjaHJvbWUqBwgAEAAYjwIyBwgAEAAYjwIyCggBEC4YsQMYgAQyBwgCEAAYgAQyBwgDEAAYgAQyBwgEEAAYgAQyBwgFEAAYgAQyBwgGEAAYgAQyBwgHEAAYgAQyBwgIEAAYgAQyBwgJEAAYgATSAQgxMjk1ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8">
                Trường Đại học Công nghệ thông tin và Truyển thông Thái Nguyên
              </a>
            </li>
            <li className="nav-item">
              <p className="nav-link">
                {" "}
                {" "}
              </p>
            </li>
          </ul>
        </nav>
        <div className="copyright">
          2025, made with <i className="fa fa-heart heart text-danger"></i> by
          <a href="https://www.facebook.com/profile.php?id=100021886125871" target="_blank" rel="noopener noreferrer"> Phạm Xuân Trường.</a>
        </div>
        <div>
          Đại học Thái Nguyên
          {/* <a target="_blank" href="https://www.facebook.com/profile.php?id=100021886125871" rel="noopener noreferrer">
            PAXUTRG
          </a> */}
          
          .
        </div>
      </div>
    </footer>
  );
};
export default FooterAdmin;
