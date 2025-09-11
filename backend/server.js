// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import patientRoutes from "./routes/patient.route.js";

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "https://lab-seven-beta.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());

// routes
app.use("/api/patients", patientRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://muskanmangla7:muskan123@cluster0.adsyk.mongodb.net/yourDBname";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("Mongo connection error:", err));

