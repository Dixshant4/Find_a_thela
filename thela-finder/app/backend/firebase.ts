// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, GeoPoint, addDoc, serverTimestamp, deleteDoc, doc  } from "firebase/firestore";

// Define the configuration type
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import { Thela } from '../types/thela';

// Fetch stalls
export const getThelas = async (): Promise<Thela[]> => {
  const querySnapshot = await getDocs(collection(db, "thelas"));
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    const geoPoint = data.location as GeoPoint;
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      latitude: geoPoint.latitude,
      longitude: geoPoint.longitude,
      type: data.type as Thela["type"],
      mainFoodItem: data.mainFoodItem,
    //   rating: data.rating,
    };
  });
};

// Save a new stall
export const saveThela = async (
  name: string, 
  description: string, 
  latitude: number, 
  longitude: number,
  type: Thela["type"],
  mainFoodItem?: string,
//   rating?: number
): Promise<string> => {
  const docRef = await addDoc(collection(db, "thelas"), { 
    name, 
    description, 
    location: new GeoPoint(latitude, longitude),
    type,
    mainFoodItem,
    // rating,
    createdAt: serverTimestamp()
  });

  return docRef.id;
};

// **Delete a stall**
export const deleteThela = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, "thelas", id));
  };

export { db };