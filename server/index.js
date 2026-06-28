import express from "express";
import mongoose from "mongoose"
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();

const app  = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/auth", authRoutes);


// Database Connection
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Connected to Database")
})
.catch((error)=>{
    console.error("Error while connecting to Database: ", error)
})


// App running on port 
app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`);
})