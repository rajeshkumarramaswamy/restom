import axios from "axios";
import { axiosInstance } from "./apiConfig";

export const GetToken = async () => {
  return axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.REACT_APP_FIREBASE_APIKEY}`
  );
};

export const GetRestaurants = async ({ queryKey }) => {
  return axiosInstance.get(`allDocuments?collectionName=restaurants`);
};

export const GetOrders = async ({ queryKey }) => {
  return axiosInstance.get(`allDocuments?collectionName=orders`);
};
export const GetDrivers = async ({ queryKey }) => {
  return axiosInstance.get(`allDocuments?collectionName=drivers`);
};

export const addOrder = async ({ queryKey }) => {
  return axiosInstance.post(``);
};
