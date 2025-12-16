import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosClient.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export default axiosClient;
