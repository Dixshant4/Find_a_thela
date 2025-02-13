import { GoogleMap, Marker, InfoWindow, useLoadScript, MarkerClusterer } from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";
import { Utensils, CupSoda } from "lucide-react"; // removed a star import for rating
import { saveThela, deleteThela } from "../backend/firebase";

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

const center = {
  lat: 19.0760, 
  lng: 72.8777,
};

export default function ThelaMap({ thelas, onAddThela, onDeleteThela }: MapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [showForm, setShowForm] = useState(false);
  const [newThela, setNewThela] = useState({ lat: 0, lng: 0 });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mainFoodItem, setMainFoodItem] = useState("");
//   const [rating, setRating] = useState(0);
  const [type, setType] = useState<Thela["type"]>("food");
  const [selectedThela, setSelectedThela] = useState<null | Thela>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [tempMarker, setTempMarker] = useState<google.maps.LatLngLiteral | null>(null);  // added this
  const mapRef = useRef<google.maps.Map | null>(null);
  const lastTapRef = useRef<number>(0); // Track last tap time
  const tapTimeout = useRef<NodeJS.Timeout | null>(null); // Timeout for single-tap delay
  const [hasCenteredOnUser, setHasCenteredOnUser] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State to show the popup




  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
        {
          enableHighAccuracy: true,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

//   // When interacting with the map, prevent page scrolling.
//   useEffect(() => {
//     const preventScroll = (e: TouchEvent) => e.preventDefault();
//     document.addEventListener("touchmove", preventScroll, { passive: false });
//     return () => document.removeEventListener("touchmove", preventScroll);
//   }, []);

  useEffect(() => {
    if (mapRef.current && userLocation && !hasCenteredOnUser) {
      mapRef.current.setCenter(userLocation);
      setHasCenteredOnUser(true); // Prevent further recentering
    }
  }, [userLocation, hasCenteredOnUser]);

  const handleRecenter = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.setCenter(userLocation);
      mapRef.current.setZoom(16); // Optional: Set the zoom level
    } else {
      console.error("User location not available.");
    }
  };


  if (!isLoaded) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse text-xl text-gray-600">Loading map...</div>
    </div>
  );

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


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const specialityItem = (type === 'food' || type === 'drink') ? mainFoodItem : undefined;
    const thela = {
      name,
      description,
      mainFoodItem: specialityItem,
    //   rating,
      latitude: newThela.lat,
      longitude: newThela.lng,
      type,
    };

    if (onAddThela) {
      onAddThela(thela);
    } else {
      await saveThela(name, description, newThela.lat, newThela.lng, type, specialityItem);  // removed rating options from this line
    }

    // Reset form fields
    setShowForm(false);
    setTempMarker(null);
    setName("");
    setDescription("");
    setMainFoodItem("");
    // setRating(0);
    setType("food");
  };

  const handleCancel = () => {
    setShowForm(false);
    setTempMarker(null); // Remove temporary marker
  };

  const handleDeleteThela = async (id: string) => {
    try {
      await deleteThela(id); // Call Firebase delete function
      setSelectedThela(null); // Close the InfoWindow after deletion
      if (onDeleteThela) {
        onDeleteThela(id); // Update parent state
      }
      setShowSuccessPopup(true); // Show success popup
    } catch (error) {
      console.error("Failed to delete thela:", error);
    }
    // } catch (error) {
    //   console.error("Failed to delete thela:", error);
    // }
  };

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
        <div className="bg-white rounded-lg shadow-xl">
          <div className="flex items-center p-3 border-b">
            {selectedThela.type === 'food' ? (
              <Utensils className="mr-3 text-emerald-600" size={20} />
            ) : (
              <CupSoda className="mr-3 text-blue-600" size={20} />
            )}
            <h2 className="text-lg font-bold text-gray-900">{selectedThela.name}</h2>
          </div>
      
          <div className="p-3 space-y-2">
            <div>
              <span className="font-semibold text-gray-700 text-sm">Type:</span>{' '}
              <span className="text-gray-900 text-sm capitalize">{selectedThela.type}</span>
            </div>
            {selectedThela.type === 'food' && selectedThela.mainFoodItem && (
              <div>
                <span className="font-semibold text-gray-700 text-sm">Main Food Item:</span>{' '}
                <span className="text-gray-900 text-sm">{selectedThela.mainFoodItem}</span>
              </div>
            )}
            {selectedThela.type === 'drink' && selectedThela.mainFoodItem && (
              <div>
                <span className="font-semibold text-gray-700 text-sm">Main Drink Item:</span>{' '}
                <span className="text-gray-900 text-sm">{selectedThela.mainFoodItem}</span>
              </div>
            )}
            {selectedThela.description && (
              <div>
                <span className="font-semibold text-gray-700 text-sm">Description:</span>{' '}
                <span className="text-gray-900 text-sm italic">{selectedThela.description}</span>
              </div>
            )}
            <button
              onClick={() => handleDeleteThela(selectedThela.id!)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete Stall
            </button>
          </div>
        </div>
      </InfoWindow>
      
        )}
        {/* button for recentering the map to users location */}
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
      
      {showForm && tempMarker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"> 
            <form onSubmit={handleFormSubmit} className="space-y-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New ठेला</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ठेला Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 
                  text-black bg-white" // Changed text color to black
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stall Type
                </label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as "food" | "drink" | "tailor" | "flowers" | "mochi")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 
                    text-black bg-white" // Changed text color to black
                >
                    <option value="food">Food</option>
                    <option value="drink">Drink</option>
                    <option value="tailor">Tailor</option>
                    <option value="flowers">Flowers</option>
                    <option value="mochi">Mochi</option>
                </select>
              </div>
              {(type === 'food' || type === 'drink') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {type === 'food' ? 'Main Food Item' : 'Main Drink Item'}
                  </label>
                  <input
                    type="text"
                    value={mainFoodItem}
                    onChange={(e) => setMainFoodItem(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 
                    text-black bg-white"
                    placeholder={type === 'food' ? 'e.g., Vada Pav, Bhel Puri' : 'e.g., Sugarcane Juice, Lassi'}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 
                  text-black bg-white" // Changed text color to black
                  rows={3}
                  required
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (0-5)
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        rating >= star ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div> */}
              <div className="flex space-x-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition"
                >
                  Save Stall
                </button>
                <button 
                  type="button"
                //   onClick={() => setShowForm(false)}
                  onClick={handleCancel}  
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

              