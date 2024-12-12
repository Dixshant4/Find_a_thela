// // // index.html

// "use client";

// import { useEffect, useState } from "react";
// import { getStalls } from "./backend/firebase";
// import Map from "./components/Map";

// type Stall = {
//   id: string;
//   name: string; // or `any` if the type is not strictly defined
//   description: string; // or `any`
//   latitude: number;
//   longitude: number;
// };

// export default function Home() {
//   const [stalls, setStalls] = useState<Stall[]>([]);

//   useEffect(() => {
//     const fetchStalls = async () => {
//       const data = await getStalls();
//       setStalls(data);
//     };
//     fetchStalls();
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-3xl font-bold mb-4">Thela's Near You</h1>
//       <Map stalls={stalls} />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { getThelas, saveThela } from "./backend/firebase";
import ThelaMap from "./components/Map";

export interface Thela {
  id?: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  mainFoodItem?: string;
  rating?: number;
}

export default function Home() {
  const [thelas, setThelas] = useState<Thela[]>([]);

  useEffect(() => {
    const fetchThelas = async () => {
      const data = await getThelas();
      setThelas(data);
    };
    fetchThelas();
  }, []);

  const handleAddThela = async (newThela: Omit<Thela, 'id'>) => {
    try {
      // Save the thela and get the new ID
      const savedThelaId = await saveThela(
        newThela.name, 
        newThela.description, 
        newThela.latitude, 
        newThela.longitude,
        newThela.mainFoodItem,
        newThela.rating
      );

      // Create a new thela object with the ID
      const thelaWithId = {
        ...newThela,
        id: savedThelaId
      };

      // Update the local state
      setThelas(prevThelas => [...prevThelas, thelaWithId]);
    } catch (error) {
      console.error("Error adding thela:", error);
    }
  };

  return (
    <div className="h-screen">
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-3xl font-bold mb-2">ठेला Finder</h1>
        <p className="text-gray-600 mb-4">Discover local food stalls near you</p>
      </div>
      <ThelaMap 
        thelas={thelas} 
        onAddThela={handleAddThela} 
      />
    </div>
  );
}