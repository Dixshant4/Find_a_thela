// components/Map.js
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { saveStall } from "../backend/firebase";

interface MapProps {
    stalls: { id: string; name: string; latitude: number; longitude: number }[];
  }
  
const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
    lat: 18.9760, 
    lng: 72.8777,
};

export default function Map({ stalls }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // Add your API key
  });

  const [showForm, setShowForm] = useState(false);
  const [newStall, setNewStall] = useState({ lat: 0, lng: 0 });
  const [name, setName] = useState("");

  if (!isLoaded) return <div>Loading...</div>;

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setNewStall({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      setShowForm(true);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStall(name, newStall.lat, newStall.lng);
    setShowForm(false);
    setName("");
  };

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        onClick={handleMapClick}
      >
        {stalls.map((stall) => (
          <Marker
            key={stall.id}
            position={{ lat: stall.latitude, lng: stall.longitude }}
            title={stall.name}
          />
        ))}
      </GoogleMap>

      {showForm && (
        <div className="absolute top-4 left-4 bg-white p-4 shadow-lg">
          <form onSubmit={handleFormSubmit}>
            <label className="block mb-2">
              Stall Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full border p-2"
                required
              />
            </label>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2">
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="ml-2 bg-gray-500 text-white px-4 py-2"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

//   return (
//     <GoogleMap mapContainerStyle={mapContainerStyle} zoom={11} center={center}>
//       {stalls.map((stall) => (
//         <Marker
//           key={stall.id}
//           position={{ lat: stall.latitude, lng: stall.longitude }}
//           title={stall.name}
//         />
//       ))}
//     </GoogleMap>
//   );
// }
