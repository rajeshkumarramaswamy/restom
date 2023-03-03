import {
  query,
  collection,
  limit,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const restaurantsRef = query(collection(db, "restaurants"));
export const ordersRef = query(collection(db, "orders"));
export const driversRef = query(collection(db, "drivers"));
