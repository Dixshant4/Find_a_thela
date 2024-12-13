// // components/Map.js
// import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
// import { useEffect, useState } from "react";
// import { saveStall } from "../backend/firebase";

// interface MapProps {
//     stalls: { id: string; name: string; description: string; latitude: number; longitude: number }[];
//   }

// const mapContainerStyle = {
//   width: "100%",
//   height: "600px",
// };

// const center = {
//     lat: 18.9760, 
//     lng: 72.8777,
// };

// export default function Map({ stalls }: MapProps) {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!, // Add your API key
//   });

//   const [showForm, setShowForm] = useState(false);
//   const [newStall, setNewStall] = useState({ lat: 0, lng: 0 });
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedStall, setSelectedStall] = useState<null | {
//     id: string;
//     name: string;
//     description: string;
//     latitude: number;
//     longitude: number;
//   }>(null); // Track selected stall for InfoWindow
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       const watchId = navigator.geolocation.watchPosition(
//         (position) => {
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error("Error getting user location:", error);
//         },
//         {
//           enableHighAccuracy: true,
//         }
//       );

//       return () => {
//         navigator.geolocation.clearWatch(watchId);
//       };
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   }, []);


//   if (!isLoaded) return <div>Loading...</div>;

//   const handleMapClick = (e: google.maps.MapMouseEvent) => {
//     if (e.latLng) {
//       setNewStall({ lat: e.latLng.lat(), lng: e.latLng.lng() });
//       setShowForm(true);
//     }
//   };

//   const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await saveStall(name, description, newStall.lat, newStall.lng);
//     setShowForm(false);
//     setName("");
//     setDescription("");
//   };

//   return (
//     <div className="relative">
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         zoom={12}
//         center={userLocation || center}
//         onClick={handleMapClick}
//       >
//         {stalls.map((stall) => (
//           <Marker
//             key={stall.id}
//             position={{ lat: stall.latitude, lng: stall.longitude }}
//             onClick={() => setSelectedStall(stall)} // Open InfoWindow on marker click
//           />
//         ))}
//         {userLocation && (
//           <Marker
//             position={userLocation}
//             title="Your Location"
//             icon={{
//               url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Custom marker for user location
//             }}
//           />
//         )}
//         {selectedStall && (
//           <InfoWindow
//             position={{ lat: selectedStall.latitude, lng: selectedStall.longitude }}
//             onCloseClick={() => setSelectedStall(null)} // Close InfoWindow on click
//           >
//             <div className="p-4 rounded-md shadow-lg bg-white">
//               {/* <h2 className="text-lg font-bold text-gray-900">Details</h2> */}
//               <p className="text-sm text-gray-700">
//                 <span className="font-semibold">Name:</span> {selectedStall.name}
//               </p>
//               <p className="text-sm text-gray-700">
//                 <span className="font-semibold">Description:</span> {selectedStall.description}
//               </p>
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>

//       {showForm && (
//         <div className="absolute top-4 left-4 bg-white p-4 shadow-lg">
//           <form onSubmit={handleFormSubmit}>
//             <label className="block mb-2">
//               Stall Name:
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="block w-full border p-2"
//                 required
//               />
//             </label>
//             <label className="block mb-2">
//               Description:
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="block w-full border p-2"
//                 required
//               />
//             </label>
//             <button type="submit" className="bg-blue-500 text-white px-4 py-2">
//               Save
//             </button>
//             <button
//               type="button"
//               onClick={() => setShowForm(false)}
//               className="ml-2 bg-gray-500 text-white px-4 py-2"
//             >
//               Cancel
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// // }
// import { GoogleMap, Marker, InfoWindow, useLoadScript, MarkerClusterer } from "@react-google-maps/api";
// import { useEffect, useState } from "react";
// import { Info, X } from "lucide-react";
// import { saveThela } from "../backend/firebase";

// interface Thela {
//   id?: string;
//   name: string;
//   description: string;
//   latitude: number;
//   longitude: number;
//   type: "food" | "drink";
//   mainFoodItem?: string;
//   rating?: number;
// }

// interface MapProps {
//   thelas: Thela[];
//   onAddThela?: (thela: Omit<Thela, 'id'>) => void;
// }

// const mapContainerStyle = {
//   width: "100%",
//   height: "calc(100vh)",
//   borderRadius: "12px",
//   boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
// };

// const center = {
//   lat: 18.9760, 
//   lng: 72.8777,
// };

// export default function ThelaMap({ thelas, onAddThela }: MapProps) {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
//   });

//   const [showForm, setShowForm] = useState(false);
//   const [newThela, setNewThela] = useState({ lat: 0, lng: 0 });
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [mainFoodItem, setMainFoodItem] = useState("");
//   const [rating, setRating] = useState(0);
//   const [type, setType] = useState<"food" | "drink">("food"); // Default to "food"
//   const [selectedThela, setSelectedThela] = useState<null | Thela>(null);
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       const watchId = navigator.geolocation.watchPosition(
//         (position) => {
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error("Error getting user location:", error);
//         },
//         {
//           enableHighAccuracy: true,
//         }
//       );

//       return () => {
//         navigator.geolocation.clearWatch(watchId);
//       };
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   if (!isLoaded) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="animate-pulse text-xl text-gray-600">Loading map...</div>
//     </div>
//   );

//   const handleMapClick = (e: google.maps.MapMouseEvent) => {
//     if (e.latLng) {
//       setNewThela({ lat: e.latLng.lat(), lng: e.latLng.lng() });
//       setShowForm(true);
//     }
//   };

//   const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const thela = {
//       name,
//       description,
//       mainFoodItem,
//       rating,
//       latitude: newThela.lat,
//       longitude: newThela.lng,
//       type,
//     };

//     if (onAddThela) {
//       onAddThela(thela);
//     } else {
//       await saveThela(name, description, newThela.lat, newThela.lng, type, mainFoodItem, rating);
//     }

//     // Reset form fields
//     setShowForm(false);
//     setName("");
//     setDescription("");
//     setMainFoodItem("");
//     setRating(0);
//     setType("food");
//   };

// //   const renderThelaMarker = (thela: Thela) => (
// //     <Marker
// //       key={thela.id}
// //       position={{ lat: thela.latitude, lng: thela.longitude }}
// //       onClick={() => setSelectedThela(thela)}
// //       icon={{
// //         url: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2241%22%20height%3D%2248%22%20viewBox%3D%22-10 -10 41 48%22%3E%3Cpath%20fill%3D%22%23FF6B6B%22%20d%3D%22M10.5%200C4.7%200%200%204.7%200%2010.5c0%205.8%2010.5%2018.5%2010.5%2018.5s10.5-12.7%2010.5-18.5C21%204.7%2016.3%200%2010.5%200zm0%2014c-1.9%200-3.5-1.6-3.5-3.5s1.6-3.5%203.5-3.5%203.5%201.6%203.5%203.5-1.6%203.5-3.5%203.5z%22%2F%3E%3C%2Fsvg%3E",
// //         scaledSize: new google.maps.Size(41, 48)
// //       }}
// //     />
// //   );

//   return (
//     <div className="relative w-full h-screen bg-gray-50">
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         zoom={12}
//         center={userLocation || center}
//         onClick={handleMapClick}
//         options={{
//           mapId: 'd8d4da63099c9f10',
//           streetViewControl: false,
//           mapTypeControl: false,
//           fullscreenControl: false,
//           maxZoom: 25, // Maximum zoom level
//           minZoom: 5,
//         }}
//       >
//         <MarkerClusterer>
//         {(clusterer) => (
//             <>
//             {thelas.map((thela) => (
//                 <Marker
//                 key={thela.id}
//                 position={{ lat: thela.latitude, lng: thela.longitude }}
//                 clusterer={clusterer}
//                 onClick={() => setSelectedThela(thela)}
//                 icon={{
//                     url: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2241%22%20height%3D%2248%22%20viewBox%3D%22-10 -10 41 48%22%3E%3Cpath%20fill%3D%22%23FF6B6B%22%20d%3D%22M10.5%200C4.7%200%200%204.7%200%2010.5c0%205.8%2010.5%2018.5%2010.5%2018.5s10.5-12.7%2010.5-18.5C21%204.7%2016.3%200%2010.5%200zm0%2014c-1.9%200-3.5-1.6-3.5-3.5s1.6-3.5%203.5-3.5%203.5%201.6%203.5%203.5-1.6%203.5-3.5%203.5z%22%2F%3E%3C%2Fsvg%3E",
//                     scaledSize: new google.maps.Size(41, 48)
//                 }}
//                 />
//             ))}
//             </>
//         )}
//         </MarkerClusterer>
//         {/* {thelas.map(renderThelaMarker)} */}

        
//         {userLocation && (
//           <Marker
//             position={userLocation}
//             title="Your Location"
//             icon={{
//               url: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20fill%3D%22%232196F3%22%20fill-opacity%3D%220.7%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%225%22%20fill%3D%22white%22%2F%3E%3C%2Fsvg%3E",
//               scaledSize: new google.maps.Size(40, 40)
//             }}
//           />
//         )}

//         {selectedThela && (
//           <InfoWindow
//             position={{ lat: selectedThela.latitude, lng: selectedThela.longitude }}
//             onCloseClick={() => setSelectedThela(null)}
//           >
//             <div className="p-4 max-w-xs bg-white rounded-lg shadow-xl">
//               <div className="flex justify-between items-start mb-3">
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedThela.name}</h2>
//                   <p className="text-sm text-gray-600 flex items-center">
//                     <Info className="mr-2 text-blue-500" size={16} />
//                     {selectedThela.mainFoodItem || 'Local Speciality'}
//                   </p>
//                 </div>
//                 <button 
//                   onClick={() => setSelectedThela(null)} 
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//               <p className="text-sm text-gray-700 mb-3">{selectedThela.description}</p>
//               <div className="flex items-center">
//                 <span className="mr-2 text-yellow-500">★</span>
//                 <span className="text-sm text-gray-600">
//                   {selectedThela.rating ? `${selectedThela.rating}/5 Rating` : 'No rating'}
//                 </span>
//               </div>
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>

//       {showForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4 text-gray-800">Add New ठेला</h2>
//             <form onSubmit={handleFormSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   ठेला Name
//                 </label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Stall Type
//                 </label>
//                 <select
//                     value={type}
//                     onChange={(e) => setType(e.target.value as "food" | "drink")}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 >
//                     <option value="food">Food</option>
//                     <option value="drink">Drink</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Main Food Item
//                 </label>
//                 <input
//                   type="text"
//                   value={mainFoodItem}
//                   onChange={(e) => setMainFoodItem(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                   placeholder="e.g., Vada Pav, Bhel Puri, etc."
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                   rows={3}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Rating (0-5)
//                 </label>
//                 <div className="flex space-x-2">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <button
//                       key={star}
//                       type="button"
//                       onClick={() => setRating(star)}
//                       className={`text-2xl ${
//                         rating >= star ? 'text-yellow-500' : 'text-gray-300'
//                       }`}
//                     >
//                       ★
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div className="flex space-x-4">
//                 <button 
//                   type="submit" 
//                   className="flex-1 bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition"
//                 >
//                   Save Stall
//                 </button>
//                 <button 
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { GoogleMap, Marker, InfoWindow, useLoadScript, MarkerClusterer } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { Info, X, MapPin, Star, Utensils, CupSoda } from "lucide-react";
import { saveThela } from "../backend/firebase";

interface Thela {
  id?: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  type: "food" | "drink";
  mainFoodItem?: string;
  rating?: number;
}

interface MapProps {
  thelas: Thela[];
  onAddThela?: (thela: Omit<Thela, 'id'>) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "calc(100vh)",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
};

const center = {
  lat: 18.9760, 
  lng: 72.8777,
};

export default function ThelaMap({ thelas, onAddThela }: MapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [showForm, setShowForm] = useState(false);
  const [newThela, setNewThela] = useState({ lat: 0, lng: 0 });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mainFoodItem, setMainFoodItem] = useState("");
  const [rating, setRating] = useState(0);
  const [type, setType] = useState<"food" | "drink">("food");
  const [selectedThela, setSelectedThela] = useState<null | Thela>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

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


  if (!isLoaded) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse text-xl text-gray-600">Loading map...</div>
    </div>
  );

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setNewThela({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      setShowForm(true);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const thela = {
      name,
      description,
      mainFoodItem,
      rating,
      latitude: newThela.lat,
      longitude: newThela.lng,
      type,
    };

    if (onAddThela) {
      onAddThela(thela);
    } else {
      await saveThela(name, description, newThela.lat, newThela.lng, type, mainFoodItem, rating);
    }

    // Reset form fields
    setShowForm(false);
    setName("");
    setDescription("");
    setMainFoodItem("");
    setRating(0);
    setType("food");
  };

  return (
    <div className="relative w-full h-screen bg-gray-50">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={userLocation || center}
        onClick={handleMapClick}
        options={{
          mapId: 'd8d4da63099c9f10',
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          maxZoom: 25,
          minZoom: 5,
        }}
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
              scaledSize: new google.maps.Size(40, 40)
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

                {selectedThela.mainFoodItem && (
                <div>
                    <span className="font-semibold text-gray-700 text-sm">Speciality:</span>{' '}
                    <span className="text-gray-900 text-sm">{selectedThela.mainFoodItem}</span>
                </div>
                )}

                <div>
                <span className="font-semibold text-gray-700 text-sm">Description:</span>{' '}
                <span className="text-gray-900 text-sm italic">{selectedThela.description}</span>
                </div>

                <div className="flex items-center">
                <span className="font-semibold text-gray-700 mr-2 text-sm">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                    key={star}
                    size={14}
                    className={`mr-1 ${
                        selectedThela.rating && selectedThela.rating >= star
                        ? 'text-yellow-500'
                        : 'text-gray-300'
                    }`}
                    />
                ))}
                <span className="ml-2 text-xs text-gray-600">
                    {selectedThela.rating ? `${selectedThela.rating}/5` : 'No rating'}
                </span>
                </div>
            </div>
            </div>
        </InfoWindow>
        )}
      </GoogleMap>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New ठेला</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
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
                    onChange={(e) => setType(e.target.value as "food" | "drink")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 
                    text-black bg-white" // Changed text color to black
                >
                    <option value="food">Food</option>
                    <option value="drink">Drink</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Food Item
                </label>
                <input
                  type="text"
                  value={mainFoodItem}
                  onChange={(e) => setMainFoodItem(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 
                  text-black bg-white" // Changed text color to black
                  placeholder="e.g., Vada Pav, Bhel Puri, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
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
              <div>
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
              </div>
              <div className="flex space-x-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition"
                >
                  Save Stall
                </button>
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
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

              