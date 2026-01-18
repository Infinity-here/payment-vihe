import axios from "axios";

console.log("Backend URL:", import.meta.env.VITE_BACKEND_UR);

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_UR,
  headers: {
    "Content-Type": "application/json"
  }
});

export const createPayment = (data:any) =>
  API.post("/api/payment/create", data);