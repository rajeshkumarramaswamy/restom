import { db } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const restaurantCollectionRef = collection(db, "restaurants");
class RestaurantServices {
  addRestaurant = (newResto) => {
    return addDoc(restaurantCollectionRef, newResto);
  };

  updateRestaurant = (id, updatedResto) => {
    const restoDoc = doc(db, "restaurants", id);
    return updateDoc(restoDoc, updatedResto);
  };

  deleteRestaurant = (id) => {
    const restoDoc = doc(db, "restaurants", id);
    return deleteDoc(restoDoc);
  };

  getAllRestaurants = () => {
    return getDocs(restaurantCollectionRef);
  };
}

export default new RestaurantServices();
