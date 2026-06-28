
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail, sendBookingEmail } from "../utils/sendEmail.js";

// Schemas
import User from "../models/User.js";
import OTP from "../models/OTP.js";



const generateToken = (userId, userRole)=>{
    return jwt.sign({ userId, userRole}, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const generateOTP =()=>{
    return Math.floor(Math.random() * 900000 + 100000).toString();
}


// ======== User Control Functions ==========
export const registerUser = async (req, res)=>{
    try {
        let { name, email, password } = req.body;

        // trim inputs
        name = name?.trim();
        email = email?.trim().toLowerCase();
    
        // Validate require fields 
        if(!name || !email || !password){
            return res.status(400).json({error: "Name, email, and password are required."})
        }

        // Validate Email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                error:"Please enter a valid email address."
            })
        }

        // Validate password length
        if(password.length < 6){
            return res.status(400).json({
                error:"Password must be at least 6 characters long."
            })
        }

        // Check if user already exists
        const isUserExist = await User.findOne({email});
        if(isUserExist){
            if(isUserExist.isVerified){
                return res.status(409).json({error: "User already exists."});
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create User
        const user = await User.create({ 
            name, email, 
            password: hashPassword, 
            role:"user", 
            isVerified:false
        })
        
        await OTP.deleteMany({ email, action:"account_Verification" }); // Remove any previous OTPs
        const otp = generateOTP();
        await OTP.create({ email, otp, action: "account_verification" });
        await sendOTPEmail(email, otp, "account_verification");

        return res.status(201).json({
            success:true,
            message: "Registration successful. Please check your email to verify your account.",
            email: user.email
        });

    } catch (error) {
        console.log("Registration Error: ", error);
        return res.status(500).json({ success:false, error:error.message })
    }
}

export const loginUser = async (req, res)=>{
    try {
        let { email, password } = req.body;

        email = email?.trim().toLowerCase();

        // Validate inputs 
        if(!email || !password){
            return res.status(400).json({ error: "Email and password are required."})
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({error:"Invalid email or password."});
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched) return res.status(404).json({error: "Invalid email or password."});

        if(!user.isVerified && user.role !== "admin"){
            await OTP.deleteMany({email, action:"account_verification"});
            const otp = generateOTP();
            await OTP.create({ email, otp, action: "account_verification" });
            await sendOTPEmail(email, otp, "account_verification");
            return res.status(400).json({ error:"Your account is not verified. A new OTP has been sent to your email." })
        }

        const token = generateToken(user._id, user.role);

        return res.status(200).json({
            success:true,
            message:"Login successful",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            },
            token
        })
        
    } catch (error) {
        console.log("Login Error: ", error);
        return res.status(500).json({
            success:false,
            error:"Something went wrong. Please try again later."
        });   
    }
}

export const verifyOTP =async (req, res)=>{
    try {
        let { email , otp } = req.body;

        email = email?.trim().toLowerCase();

        // Validate inputs 
        if(!email || !otp){
            return res.status(400).json({ error: "Email and OTP are required."})
        }

        // Check user
        const existingUser = await User.findOne({ email });
        if(!existingUser){
            return res.status(404).json({error:"User not found."})
        }

        // Already verified
        if(existingUser.isVerified){
            return res.status(400).json({error:"Account is already verified."})
        }

        // Verify OTP
        const isOTPExists = await OTP.findOne({ email, otp, action:"account_verification" });

        if(!isOTPExists){
            return res.status(400).json({ error: "Invalid or expired OTP." });
        }

        // Verify account
        const user = await User.findOneAndUpdate({ email }, { isVerified:true }, { new:true});

        await OTP.deleteMany({ email, action:"account_verification" }); // Remove used OTP

        const token = generateToken(user._id, user.role);
        
        return res.status(200).json({
            success:true,
            message:"Account verified successfully.",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            },
            token
        });
    } catch (error) {
        console.log("OTP Verification Error: ", error);
        return res.status(500).json({
            success:false,
            error:"Something went wrong. Please try again later."
        })
        
    }
}
