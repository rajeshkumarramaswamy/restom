import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
axiosInstance.interceptors.request.use(
  // function (config) {
  //   config.headers = {
  //     ...config.headers,
  //     Authorization: "Bearer " + token,
  //   };
  //   return config;
  // },
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
