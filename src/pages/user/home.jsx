import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { listbg } from "../../services/BackgroundAPI";
import { requestSupports } from "../../services/SupportsAPI";
import { useSettingData } from "../../contexts/SettingContext";
import { useGetUserData } from "../../contexts/GetUserContext";
import LocationMap from "../../components/LocationPicker";
import Swal from "sweetalert2";

const Home = () => {
  const settings = useSettingData();
  const { userData } = useGetUserData();
  const [name, setName] = useState(userData ? userData?.name : "");
  const [email, setEmail] = useState(userData ? userData?.email : "");
  const [phone, setPhone] = useState(userData ? userData?.phone : "");
  const [message, setMessage] = useState("");
  const [backgrounds, setBackgrounds] = useState([]);

  useEffect(() => {
    if (userData?.name) {
      setName(userData.name);
      setEmail(userData.email);
      setPhone(userData.phone);
    }
  }, [userData]);

  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        const response = await listbg();
        setBackgrounds(response);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchBackgrounds();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("message", message);
    try {
      await requestSupports(formData);
      Swal.fire("Thành công", "Yêu cầu đã được gửi", "success");
    } catch (error) {
      Swal.fire("Lỗi", "Yêu cầu chưa được gửi", "error");
      console.log(error);
    }
  };

  return (
    <>
      <header
        className="position-relative"
        style={{ backgroundColor: "white" }}
      >
        <Carousel fade indicators={false}>
          {backgrounds.map((bg) => (
            <Carousel.Item key={bg.id}>
              <img
                src={`http://localhost:8000/storage/${bg.path}`}
                alt="Hình ảnh hiện tại"
                style={{ width: "100%", height: "800px" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </header>

      <section className="page-section" id="about">
        <div className="container px-4 px-lg-5">
          <div className="row gx-4 gx-lg-5 justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="" style={{ fontFamily: "Romie Regular" }}>
                Bonjour, Xin chào
                <br />
              </h1>
              <hr className="divider divider-light" />
              <p className=" mb-4">{settings?.introduce}</p>
              <Link to={"/about"} className="text-primary-75 m-4">
                <i className="fas fa-map-marker-alt"></i> {settings?.address}
              </Link>{" "}
              <Link to={"/about"} className="text-primary-75 m-4">
                <i className="fas fa-phone"></i> {settings?.phone}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="page-section" id="services">
        <div className="container px-4 px-lg-5">
          <h2
            className="text-center mt-0"
            style={{ fontFamily: "Romie Regular" }}
          >
            Dịch vụ của chúng tôi
          </h2>
          <hr className="divider" />
          <div className="row gx-4 gx-lg-5">
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <div className="mb-2">
                  <i className="fas fa-bed fs-1 text-primary"></i>
                </div>
                <h3 className="h4 mb-2">Phòng nghỉ</h3>
                <p className="text-muted mb-0">
                  Phòng nghỉ (gồm các loại phòng từ tiêu chuẩn đến cao cấp) được
                  bố trí hài hòa bên tòa nhà Heritage lịch sử, nơi còn lưu giữ
                  mãi nét Pháp cổ tráng lệ một thời.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <div className="mb-2">
                  <i className="fas fa-concierge-bell fs-1 text-primary"></i>
                </div>
                <h3 className="h4 mb-2">Nhà hàng</h3>
                <p className="text-muted mb-0">
                  Với các món ăn mang âm hưởng châu Âu và Tân Thế Giới, chúng
                  tôi có nhiều sự lựa chọn để giúp hành trình khám phá ẩm thực
                  của bạn trở thành một kỷ niệm khó quên.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <div className="mb-2">
                  <i className="fas fa-cocktail fs-1 text-primary"></i>
                </div>
                <h3 className="h4 mb-2">Quán bar</h3>
                <p className="text-muted mb-0">
                  Điểm đến để cùng chia sẻ cảm hứng, niềm đam mê được thưởng
                  thức và nhâm nhi các loại rượu whisky nổi tiếng, những ly
                  cocktail và đồ uống được pha chế đặc biệt
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <div className="mb-2">
                  <i className="fas fa-birthday-cake fs-1 text-primary"></i>
                </div>
                <h3 className="h4 mb-2">Hội thảo và sự kiện</h3>
                <p className="text-muted mb-0">
                  Sofitel Legend Metropole Hà Nội là địa điểm lý tưởng để tổ
                  chức những sự kiện đẳng cấp trong thành phố. Các thế hệ nhân
                  viên khách sạn đã tiếp nối truyền thống đón tiếp những sự kiện
                  mang tính huyền thoại của Hà Nội và hoàn thành nhiệm vụ với độ
                  chính xác cao.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div id="portfolio">
        <div className="container-fluid p-0">
          <div className="row g-0">
            {[1, 2, 3, 4, 5, 6].map((index) => {
              const bannerKey = `banner_${index}`;
              if (settings?.[bannerKey]) {
                return (
                  <div key={index} className="col-lg-4 col-sm-6">
                    <a
                      className="portfolio-box"
                      href={`http://localhost:8000${settings[bannerKey]}`}
                      title={`Banner ${index}`}
                      style={{ height: "100%" }}
                    >
                      <img
                        className="img-fluid"
                        src={`http://localhost:8000${settings[bannerKey]}`}
                        alt={`Banner ${index}`}
                        style={{ height: "100%" }}
                      />
                      <div className="portfolio-box-caption">
                        <div className="project-category text-white-50">
                          Hình ảnh
                        </div>
                        <div className="project-name">Banner {index}</div>
                      </div>
                    </a>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
      <section className="page-section" id="contact">
        <div className="container px-4 px-lg-5">
          <div className="row gx-4 gx-lg-5 justify-content-center">
            <div className="col-lg-8 col-xl-6 text-center">
              <h2 className="mt-0" style={{ fontFamily: "Romie Regular" }}>
                Hãy liên hệ với chúng tôi!!
              </h2>
              <hr className="divider" />
              <p className="text-muted mb-5">
                Nếu bạn có thắc mắc? Hãy gửi tin nhắn cho chúng tôi và chúng tôi
                sẽ trả lời bạn sớm nhất có thể!
              </p>
            </div>
          </div>
          <div className="row gx-4 gx-lg-5 justify-content-center mb-5">
            <div className="col-lg-6">
              <form onSubmit={handleSubmit}>
                {userData ? (
                  <>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="name"
                        type="text"
                        placeholder="Enter your name..."
                        data-sb-validations="required"
                        value={name}
                        disabled
                      />
                      <label htmlFor="name">Họ Tên</label>
                      <div
                        className="invalid-feedback"
                        data-sb-feedback="name:required"
                      >
                        A name is required.
                      </div>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        data-sb-validations="required,email"
                        value={email}
                        disabled
                      />
                      <label htmlFor="email">Email</label>
                      <div
                        className="invalid-feedback"
                        data-sb-feedback="email:required"
                      >
                        An email is required.
                      </div>
                      <div
                        className="invalid-feedback"
                        data-sb-feedback="email:email"
                      >
                        Email is not valid.
                      </div>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="phone"
                        type="tel"
                        placeholder="(123) 456-7890"
                        data-sb-validations="required"
                        value={phone}
                        disabled
                      />
                      <label htmlFor="phone">Số điện thoại</label>
                      <div
                        className="invalid-feedback"
                        data-sb-feedback="phone:required"
                      >
                        A phone number is required.
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="name"
                        type="text"
                        placeholder="Enter your name..."
                        data-sb-validations="required"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <label htmlFor="name">Họ tên</label>
                      <div
                        className="invalid-feedback"
                        data-sb-feedback="name:required"
                      >
                        A name is required.
                      </div>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        data-sb-validations="required,email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label htmlFor="email">Email</label>
                      <div
                        className="invalid-feedback"
                        data-sb-feedback="email:required"
                      >
                        An email is required.
                      </div>
                      <div
                        className="invalid-feedback"
                        data-sb-feedback="email:email"
                      >
                        Email is not valid.
                      </div>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="phone"
                        type="tel"
                        placeholder="(123) 456-7890"
                        data-sb-validations="required"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <label htmlFor="phone">Số điện thoại</label>
                      <div
                        className="invalid-feedback"
                        data-sb-feedback="phone:required"
                      >
                        A phone number is required.
                      </div>
                    </div>
                  </>
                )}
                <div className="form-floating mb-3">
                  <textarea
                    className="form-control"
                    id="message"
                    placeholder="Enter your message here..."
                    style={{ height: "10rem" }}
                    data-sb-validations="required"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                  <label htmlFor="message">Nội dung</label>
                  <div
                    className="invalid-feedback"
                    data-sb-feedback="message:required"
                  >
                    A message is required.
                  </div>
                </div>
                <div className="d-grid">
                  <button
                    className="btn btn-primary btn-xl"
                    id=""
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="row gx-4 gx-lg-5 justify-content-center">
            <div className="col-lg-4 text-center mb-5 mb-lg-0">
              <i className="icon-screen-smartphone fs-2 mb-3 text-muted"></i>
              <div>{settings?.phone}</div>
            </div>
          </div>
        </div>
      </section>
      <div className="col-lg-12 mx-auto">
          <h1 className="text-center m-5" style={{ fontFamily:"Romie Regular"}}>Địa điểm</h1>
          <LocationMap />
        </div>
    </>
  );
};
export default Home;
