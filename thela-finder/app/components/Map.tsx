// components/Map.js
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";

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

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={11} center={center}>
      {stalls.map((stall) => (
        <Marker
          key={stall.id}
          position={{ lat: stall.latitude, lng: stall.longitude }}
          title={stall.name}
        />
      ))}
    </GoogleMap>
  );
}
