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
  type: "food" | "drink";
  mainFoodItem?: string;
  rating?: number;
}

export default function Home() {
  const [thelas, setThelas] = useState<Thela[]>([]);
  const [filter, setFilter] = useState<"all" | "food" | "drink">("all"); // Default to "all"


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
        newThela.type,
        newThela.mainFoodItem,
        newThela.rating
      );

      // Create a new thela object with the ID
      const thelaWithId = {
        ...newThela,
        id: savedThelaId,
        // type: newThela.type,
      };

      // Update the local state
      setThelas(prevThelas => [...prevThelas, thelaWithId]);
    } catch (error) {
      console.error("Error adding thela:", error);
    }
  };

  const filteredThelas = filter === "all" ? thelas : thelas.filter((thela) => thela.type === filter);
  return (
    <div className="h-screen">
      <div className="absolute top-4 left-4 z-10">
      {/* <div className="absolute top-20 left-2 z-10 space-y-2">
        <label className="block text-sm font-medium text-black">Filter Thela's</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | "food" | "drink")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"        
        >
          <option value="all" className="font-medium text-lg text-emerald-500">All</option>
          <option value="food">Food</option>
          <option value="drink">Drink</option>
        </select>
      </div> */}
      <div className="absolute top-20 left-2 z-10 flex flex-col items-center">
        <label className="block text-md font-medium text-black mb-2">
          Filter Thela's
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | "food" | "drink")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="all" className="font-medium text-lg text-emerald-500">
            All
          </option>
          <option value="food" className="font-medium text-lg">
            Food
          </option>
          <option value="drink" className="font-medium text-lg">
            Drink
          </option>
        </select>
      </div>
        <h1 className="text-3xl font-bold text-black mb-2">ठेला Finder</h1>
        {/* <p className="text-gray-600 mb-4">Discover Thela's near you</p> */}
      </div>

      <ThelaMap thelas={filteredThelas} onAddThela={handleAddThela} />
      {/* <ThelaMap 
        thelas={thelas} 
        onAddThela={handleAddThela} 
      /> */}
    </div>
    
  );
}