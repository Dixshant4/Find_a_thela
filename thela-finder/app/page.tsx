"use client";

import { useEffect, useState } from "react";
import { getThelas, saveThela, auth } from "./backend/firebase";
import ThelaMap from "./components/Map";
import { Thela, ThelaType } from './types/thela';
import { User } from 'firebase/auth';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { Menu, X } from 'lucide-react';
import { getRedirectResult } from 'firebase/auth';


export default function Home() {
  const [thelas, setThelas] = useState<Thela[]>([]);
  const [filter, setFilter] = useState<ThelaType | "personal">("all");
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User successfully signed in
          setUser(result.user);
        }
      } catch (error) {
        console.error("Error handling redirect result:", error);
      }
    };
  
    handleRedirectResult();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAddThela = async (newThela: Omit<Thela, 'id'>) => {
    if (!user) return;
    try {
      const savedThelaId = await saveThela(
        newThela.name,
        newThela.description,
        newThela.latitude,
        newThela.longitude,
        newThela.type,
        user.uid,
        newThela.mainFoodItem,
      );

      const thelaWithId = {
        ...newThela,
        id: savedThelaId,
        userId: user.uid
      };

      setThelas(prevThelas => [...prevThelas, thelaWithId]);
    } catch (error) {
      console.error("Error adding thela:", error);
    }
  };

  const handleDeleteThela = (id: string) => {
    setThelas((prevThelas) => prevThelas.filter((thela) => thela.id !== id));
  };

  const getFilteredThelas = () => {
    if (filter === "personal" && user) {
      return thelas.filter(thela => thela.userId === user.uid);
    }
    return filter === "all" ? thelas : thelas.filter((thela) => thela.type === filter);
  };

  return (
    <div className="h-[100dvh] w-full relative">
      {/* Overlay for closing sidebar when clicking outside */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Floating Header */}
      <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg z-30 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-black/5 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">ठेला Finder</h1>
        </div>
        
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/signup"
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Improved Sidebar */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-40 bg-white/95 backdrop-blur-sm shadow-xl transform transition-transform duration-300 ease-in-out z-20 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-20">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Filter Thela&apos;s</h2>
          <div className="space-y-2">
            <button
              onClick={() => setFilter("all")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium ${
                filter === "all" 
                  ? 'bg-emerald-500 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Thelas
            </button>
            
            {user && (
              <button
                onClick={() => setFilter("personal")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium ${
                  filter === "personal" 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Your Thelas
              </button>
            )}
            
            {["food", "drink", "tailor", "flowers", "mochi"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as ThelaType)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium capitalize ${
                  filter === type 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-full w-full">
        <ThelaMap 
          thelas={getFilteredThelas()} 
          onAddThela={user ? handleAddThela : undefined} 
          onDeleteThela={handleDeleteThela}
          currentUser={user}
        />
      </div>
    </div>
  );
}