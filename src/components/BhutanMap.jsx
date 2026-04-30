import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// FIX marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const BhutanMap = () => {
  const [mapKey, setMapKey] = useState(0);

  // 🔥 Force fresh map instance (fixes StrictMode issue)
  useEffect(() => {
    setMapKey((prev) => prev + 1);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h3 className="font-semibold mb-4">
        Project Distribution Across Bhutan
      </h3>

      <div style={{ height: "400px" }}>
        <MapContainer
          key={mapKey}   // ✅ IMPORTANT FIX
          center={[27.5, 90.5]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={[27.47, 89.63]}>
            <Popup>Thimphu Project</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default BhutanMap;