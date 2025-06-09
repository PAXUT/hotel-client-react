import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/users";
import TableRooms from "../pages/admin/Rooms";
import Background from "../pages/admin/Background";
import Convenient from "../pages/admin/Convenient";
import AddRooms from "../components/form/addrooms";
import RoomType from "../pages/admin/Room_Type";
import Booking from "../pages/admin/Booking";
import Setting from "../pages/admin/Setting";
import Supports from "../pages/admin/Supports";
import Refund from "../pages/admin/Refund";

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/room/list" element={<TableRooms />} />
        <Route path="/room/add" element={<AddRooms />} />
        <Route path="/type" element={<RoomType />} />
        <Route path="/convenient" element={<Convenient />} />
        <Route path="/support" element={<Supports />} />
        <Route path="/booking/list" element={<Booking />} />
        <Route path="/booking/refund" element={<Refund />} />
        <Route path="/setting/web" element={<Setting />} />
        <Route path="/setting/slice" element={<Background />} />
        <Route path="/user" element={<Users />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
