import axios from "axios";


const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_UR,
  headers: {
    "Content-Type": "application/json"
  }
});

export const createPayment = (data:any) =>
  API.post("/api/payment/create", data);