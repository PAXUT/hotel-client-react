import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import Login from "./pages/account/Login";
import Register from "./pages/account/register";
import PrivateRoute from "./routes/PrivateRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";
import Unauthorized from "./pages/account/Unauthorized";
import { UserProvider } from "./contexts/GetUserContext";
import { RoomProvider } from "./contexts/RoomContext";
import { SettingProvider } from "./contexts/SettingContext";
import "leaflet/dist/leaflet.css";

export default function App() {
  return (
    <BrowserRouter>
      <RoomProvider>
        <UserProvider>
          <SettingProvider>
            <Routes>
              {/* admin */}
              <Route element={<PrivateRoute />}>
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin/*" element={<AdminRoutes />} />
                </Route>
              </Route>
              {/* user */}
              <Route path="/*" element={<UserRoutes />} />
              {/* public */}
              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </SettingProvider>
        </UserProvider>
      </RoomProvider>
    </BrowserRouter>
  );
}
