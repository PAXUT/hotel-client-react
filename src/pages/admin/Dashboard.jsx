import React,{ useEffect, useState } from "react";
import LocationPicker from "../../components/LocationPicker"
import { useRoomData } from "../../contexts/RoomContext"
import { getAllData } from "../../services/OrderAPI";

const Dashboard = () => {
  const { all, getListRoom} = useRoomData();
  const [ bookings, setBookings ] = useState(null);

  const fetchData = async () => {
    const response = await getAllData();
    setBookings(response);
  }
  useEffect(() => {
    getListRoom();
    fetchData()
  },[getListRoom])

  return (
    <div>
      <div className="row">
        <div className="col-sm-6 col-md-3">
          <div className="card card-stats card-round">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-icon">
                  <div className="icon-big text-center icon-primary bubble-shadow-small">
                    <i className="fas fa-users"></i>
                  </div>
                </div>
                <div className="col col-stats ms-3 ms-sm-0">
                  <div className="numbers">
                    <p className="card-category">Số lượng phòng</p>
                    <h4 className="card-title">{all?.length}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card card-stats card-round">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-icon">
                  <div className="icon-big text-center icon-info bubble-shadow-small">
                    <i className="fas fa-user-check"></i>
                  </div>
                </div>
                <div className="col col-stats ms-3 ms-sm-0">
                  <div className="numbers">
                    <p className="card-category">Số phòng còn trống</p>
                    <h4 className="card-title">{all?.filter((room) => room.status_room_id === 1).length}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card card-stats card-round">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-icon">
                  <div className="icon-big text-center icon-success bubble-shadow-small">
                    <i className="far fa-bell"></i>
                  </div>
                </div>
                <div className="col col-stats ms-3 ms-sm-0">
                  <div className="numbers">
                    <p className="card-category">Đơn đặt phòng chờ duyệt</p>
                    <h4 className="card-title">{bookings?.filter((booking) => booking.status_id === 3).length}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card card-stats card-round">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-icon">
                  <div className="icon-big text-center icon-secondary bubble-shadow-small">
                    <i className="fas fa-clock"></i>
                  </div>
                </div>
                <div className="col col-stats ms-3 ms-sm-0">
                  <div className="numbers">
                    <p className="card-category">Phòng hết sắp thời gian</p>
                    <h4 className="card-title">{bookings?.filter((booking) => booking.status_id === 8).length}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p>Vị trí:</p>
      <LocationPicker/>
    </div>
  );
};
export default Dashboard;
