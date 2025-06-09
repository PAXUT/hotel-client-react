import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationMap = () => {
  const [position, setPosition] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    
    setIsAdmin(role === "1");

    axios.get("http://localhost:8000/api/location").then((res) => {
      if (res.data.latitude && res.data.longitude) {
        setPosition({ lat: res.data.latitude, lng: res.data.longitude });
      } else {
        setPosition({ lat: 21.028511, lng: 105.804817 });
      }
    });
  }, []);

  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        if (isAdmin) {
          const token = localStorage.getItem("token");
          const { lat, lng } = e.latlng;
          setPosition({ lat, lng });
          axios.post("http://localhost:8000/api/location", {
            latitude: lat,
            longitude: lng,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
        }
      },
    });
    return null;
  };

  return position ? (
    <MapContainer
      center={position}
      zoom={14}
      style={{ height: "500px", width: "100%" }}
      scrollWheelZoom={false}
      dragging={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} />
      {isAdmin && <LocationSelector />}
    </MapContainer>
  ) : (
    <p>Đang tải bản đồ...</p>
  );
};

export default LocationMap;
