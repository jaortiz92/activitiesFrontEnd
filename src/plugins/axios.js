import axios from "axios";

const axiosInstance = axios.create({
  //baseURL: "http://127.0.0.1:8010",
  baseURL: "http://192.168.0.9:8010",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
