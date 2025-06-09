import React, { useEffect } from "react";
import { Routes, Route, useLocation  } from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import Home from "../pages/user/home";
import About from "../pages/user/about";
import Rooms from "../pages/user/rooms";
import RoomDetail from "../pages/user/roomdetail";
import OrderRoom from "../pages/user/order";
import PaymentReturn from "../pages/user/payment_return";
import User from "../pages/user/auth";
import Booked from "../pages/user/booked";
import Supports from "../pages/user/supports";
import ReviewSection from "../components/form/review";
import ChangePassword from "../pages/user/changePassword";

const UserRoutes = () => {
  const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [pathname, hash]);

  return null;
}
  return (
    <UserLayout>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/room" element={<Rooms />} />
        <Route path="/room/:id" element={<RoomDetail />} />
        <Route path="/room/order/:id" element={<OrderRoom />} />
        <Route path="/vnpay-return" element={<PaymentReturn />} />
        <Route path="/user" element={<User />} />
        <Route path="/user/changepassword" element={<ChangePassword />} />
        <Route path="/user/supports" element={<Supports />} />
        <Route path="/user/booked" element={<Booked />} />
        <Route path="/review" element={<ReviewSection />} />
      </Routes>
    </UserLayout>
  );
};

export default UserRoutes;
