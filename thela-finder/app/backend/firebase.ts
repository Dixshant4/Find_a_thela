// // firebase.ts
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { collection, getDocs, GeoPoint, addDoc } from "firebase/firestore";

// // Define the configuration type
// interface FirebaseConfig {
//   apiKey: string;
//   authDomain: string;
//   projectId: string;
//   storageBucket: string;
//   messagingSenderId: string;
//   appId: string;
// }

// const firebaseConfig: FirebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export interface Stall {
//     id: string;
//     name: string;
//     description: string;
//     latitude: number;
//     longitude: number;
//   }
  

// export const getStalls = async (): Promise<Stall[]> => {
//     const querySnapshot = await getDocs(collection(db, "stalls"));
//     return querySnapshot.docs.map((doc) => {
//         const data = doc.data();
//         const geoPoint = data.location as GeoPoint;
//         return {
//             id: doc.id,
//             name: data.name,
//             description: data.description,
//             latitude: geoPoint.latitude,
//             longitude: geoPoint.longitude,
//           };
//         });
//       };

// export const saveStall = async (name: string, description: string, latitude: number, longitude: number): Promise<void> => {
//     await addDoc(collection(db, "stalls"), { name, description, location: new GeoPoint(latitude, longitude), });
// };

// export { db };


// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, GeoPoint, addDoc, serverTimestamp } from "firebase/firestore";

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

export interface Thela {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  mainFoodItem?: string;
  rating?: number;
}

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
      mainFoodItem: data.mainFoodItem,
      rating: data.rating,
    };
  });
};

export const saveThela = async (
  name: string, 
  description: string, 
  latitude: number, 
  longitude: number,
  mainFoodItem?: string,
  rating?: number
): Promise<string> => {
  const docRef = await addDoc(collection(db, "thelas"), { 
    name, 
    description, 
    location: new GeoPoint(latitude, longitude),
    mainFoodItem,
    rating,
    createdAt: serverTimestamp()
  });

  return docRef.id;
};

export { db };