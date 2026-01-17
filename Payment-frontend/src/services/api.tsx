import axios from "axios";

const API = axios.create({
  baseURL: "https://api.yourdomain.com",
  headers: {
    "Content-Type": "application/json"
  }
});

export const createPayment = (data:any) =>
  API.post("/api/payment/create", data);