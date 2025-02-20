// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getThelas, saveThela, auth } from "./backend/firebase";
import ThelaMap from "./components/Map";
import { Thela, ThelaType } from './types/thela';
import { User } from 'firebase/auth';
import Link from 'next/link';

export default function Home() {
  const [thelas, setThelas] = useState<Thela[]>([]);
  const [filter, setFilter] = useState<ThelaType>("all");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchThelas = async () => {
      const data = await getThelas();
      setThelas(data);
    };
    fetchThelas();
  }, []);

  const handleAddThela = async (newThela: Omit<Thela, 'id'>) => {
    if (!user) return; // Don't allow adding if not logged in

    try {
      const savedThelaId = await saveThela(
        newThela.name,
        newThela.description,
        newThela.latitude,
        newThela.longitude,
        newThela.type,
        user.uid, // Pass the user ID
        newThela.mainFoodItem,
      );

      const thelaWithId = {
        ...newThela,
        id: savedThelaId,
        userId: user.uid // Include user ID in local state
      };

      setThelas(prevThelas => [...prevThelas, thelaWithId]);
    } catch (error) {
      console.error("Error adding thela:", error);
    }
  };

  const handleDeleteThela = (id: string) => {
    setThelas((prevThelas) => prevThelas.filter((thela) => thela.id !== id));
  };

  const filteredThelas = filter === "all" ? thelas : thelas.filter((thela) => thela.type === filter);

  return (
    <div className="h-[100dvh] w-full overflow-hidden fixed inset-0">
      <div className="absolute top-4 left-4 z-10 flex flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-bold text-black mb-2">ठेला Finder</h1>
          {user ? (
            <span className="text-sm text-gray-600 ml-4">Welcome, {user.email}</span>
          ) : (
            <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 ml-4">
              Sign in to add stalls
            </Link>
          )}
        </div>
        
        <div className="mt-16">
          <label className="block text-md font-medium text-black mb-2">
            Filter Thela&apos;s
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ThelaType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All</option>
            <option value="food">Food</option>
            <option value="drink">Drink</option>
            <option value="tailor">Tailor</option>
            <option value="flowers">Flowers</option>
            <option value="mochi">Mochi</option>
          </select>
        </div>
      </div>

      <ThelaMap 
        thelas={filteredThelas} 
        onAddThela={user ? handleAddThela : undefined} 
        onDeleteThela={handleDeleteThela}
        currentUser={user}
      />
    </div>
  );
}

