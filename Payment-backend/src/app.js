import express from "express";
import cors from "cors";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/payment", paymentRoutes);

export default app;
