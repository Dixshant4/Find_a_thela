"use client";

import { GoogleMap, Marker, InfoWindow, useLoadScript, MarkerClusterer } from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";

import ThelaForm from "./ThelaForm/ThelaForm";
import ThelaInfoWindow from "./ThelaInfoWindow/ThelaInfoWindow";

import { Thela } from '../types/thela';

interface MapProps {
  thelas: Thela[];
  onAddThela?: (thela: Omit<Thela, 'id'>) => void;
  onDeleteThela?: (id: string) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
};

const center = {lat: 19.0760, lng: 72.8777};

export default function ThelaMap({ thelas, onAddThela, onDeleteThela }: MapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [showForm, setShowForm] = useState(false);
  const [newThela, setNewThela] = useState({ lat: 0, lng: 0 });
  const [selectedThela, setSelectedThela] = useState<Thela | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [tempMarker, setTempMarker] = useState<google.maps.LatLngLiteral | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [hasCenteredOnUser, setHasCenteredOnUser] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const lastTapRef = useRef<number>(0);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);



  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        
        (error) => console.error("Error getting user location:", error),
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && userLocation && !hasCenteredOnUser) {
      mapRef.current.setCenter(userLocation);
      setHasCenteredOnUser(true); // Prevent further recentering
    }
  }, [userLocation, hasCenteredOnUser]);

  const handleRecenter = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.setCenter(userLocation);
      mapRef.current.setZoom(16); 
    }
  };

  const handleDoubleTap = () => {
    const map = mapRef.current;
    if (map) {
        const currentZoom = map.getZoom() ?? 12;
        map.setZoom(currentZoom + 1); // Zoom in
        }
    };

  const handleSingleTap = (e: google.maps.MapMouseEvent) => {
    // if (!tapTimeout.current) return;
    if (e.latLng) {
      setNewThela({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      setTempMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      setShowForm(true);
    }
  };

  const handleMapTap = (e: google.maps.MapMouseEvent) => {
    const now = new Date().getTime();
    const timeSinceLastTap = now - lastTapRef.current;
  
    if (timeSinceLastTap < 200) {
      // Double-tap detected
      if (tapTimeout.current) {
        clearTimeout(tapTimeout.current); // Prevent single-tap action
        tapTimeout.current = null;
      }
    //   lastTapRef.current = 0;

      handleDoubleTap();

    } else {
        // Set timeout for single-tap
        tapTimeout.current = setTimeout(() => {
          handleSingleTap(e);
          tapTimeout.current = null;  
        }, 200);
      }
  
    lastTapRef.current = now;
  };


  const handleFormSubmit = async (thela: Omit<Thela, 'id'>) => {
    if (onAddThela) {
      onAddThela(thela);
    }
    setShowForm(false);
    setTempMarker(null);
  };

  const handleDeleteThela = async (id: string) => {
    try {
      if (onDeleteThela) {
        onDeleteThela(id);
      }
      setSelectedThela(null);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Failed to delete thela:", error);
    }
  };

  if (!isLoaded) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse text-xl text-gray-600">Loading map...</div>
    </div>
  );

  return (
    <div className="relative w-full" style={{ height: "100dvh" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}
        // onClick={handleMapClick}
        options={{
          mapId: 'd8d4da63099c9f10',
          gestureHandling: 'greedy',
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          maxZoom: 25,
          minZoom: 5,
          disableDefaultUI: true, // Disable default UI, including "View on Google Maps"
          clickableIcons: false,  // Prevent showing the "View on Google Maps" popup
        }}

        onLoad={(map) => {
            mapRef.current = map; // Correctly assigns the map instance to the ref
          }}
        onClick={handleMapTap} // Single and double-tap logic
      >
        <MarkerClusterer>
        {(clusterer) => (
            <>
            {thelas.map((thela) => (
                <Marker
                key={thela.id}
                position={{ lat: thela.latitude, lng: thela.longitude }}
                clusterer={clusterer}
                onClick={() => setSelectedThela(thela)}
                icon={{
                    url: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2241%22%20height%3D%2248%22%20viewBox%3D%22-10 -10 41 48%22%3E%3Cpath%20fill%3D%22%23FF6B6B%22%20d%3D%22M10.5%200C4.7%200%200%204.7%200%2010.5c0%205.8%2010.5%2018.5%2010.5%2018.5s10.5-12.7%2010.5-18.5C21%204.7%2016.3%200%2010.5%200zm0%2014c-1.9%200-3.5-1.6-3.5-3.5s1.6-3.5%203.5-3.5%203.5%201.6%203.5%203.5-1.6%203.5-3.5%203.5z%22%2F%3E%3C%2Fsvg%3E",
                    scaledSize: new google.maps.Size(41, 48)
                }}
                />
            ))}
            </>
        )}
        </MarkerClusterer>

        {userLocation && (
          <Marker
            position={userLocation}
            title="Your Location"
            icon={{
              url: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20fill%3D%22%232196F3%22%20fill-opacity%3D%220.7%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%225%22%20fill%3D%22white%22%2F%3E%3C%2Fsvg%3E",
              scaledSize: new google.maps.Size(25, 25)
            }}
          />
        )}

        {tempMarker && (
        <Marker
            position={tempMarker}
            icon={{
            url: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2224%22 height%3D%2224%22 viewBox%3D%220 0 24 24%22%3E%3Ccircle cx%3D%2212%22 cy%3D%2212%22 r%3D%2210%22 fill%3D%22%23FF6B6B%22/%3E%3C/svg%3E",
            scaledSize: new google.maps.Size(24, 24),
            }}
        />
        )}  


{selectedThela && (
          <InfoWindow
            position={{ lat: selectedThela.latitude, lng: selectedThela.longitude }}
            onCloseClick={() => setSelectedThela(null)}
          >
            <ThelaInfoWindow
              thela={selectedThela}
              onClose={() => setSelectedThela(null)}
              onDelete={handleDeleteThela}
            />
          </InfoWindow>
        )}

        <button
          onClick={handleRecenter}
          className="absolute bottom-6 right-6 bg-white text-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none"
          aria-label="Recenter"
        >
        <div
            className="w-6 h-6 border-2 border-gray-700 rounded-full relative"
            style={{ boxShadow: "inset 0 0 0 2px #000" }} // Inner circle
        >
            <div className="absolute w-2 h-2 bg-gray-700 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </button>

      </GoogleMap>

      {showForm && tempMarker && (
        <ThelaForm
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setTempMarker(null);
          }}
          location={tempMarker}
        />
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold text-green-600 mb-4">
              Stall Deleted Successfully!
            </h2>
            {/* <p className="text-gray-600 mb-4">Refresh the page to see changes.</p> */}
            <button
              onClick={() => setShowSuccessPopup(false)} // Close popup
              className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
      </div>
  );
}