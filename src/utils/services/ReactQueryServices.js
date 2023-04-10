import { query, collection, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const restaurantsRef = query(collection(db, "restaurants"));
export const ordersRef = query(
  collection(db, "orders"),
  orderBy("date", "desc")
);

export const mutationOrdersRef = query(collection(db, "orders"));
export const driversRef = query(collection(db, "drivers"));
export const locationsRef = query(collection(db, "locations"));
