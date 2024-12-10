// // index.html

"use client";

import { useEffect, useState } from "react";
import { getStalls } from "./backend/firebase";
import Map from "./components/Map";

export default function Home() {
  const [stalls, setStalls] = useState([]);

  useEffect(() => {
    const fetchStalls = async () => {
      const data = await getStalls();
      setStalls(data);
    };
    fetchStalls();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Stall Locations</h1>
      <Map stalls={stalls} />
    </div>
  );
}
