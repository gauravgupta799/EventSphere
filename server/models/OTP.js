import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            trim: true,
            lowercase: true
        },
        otp:{
            type:String,
            required:true,
            minlength: 6,
            maxlength: 6
        },
        action:{
            type:String,
            enum: ["account_verification", "event_booking", "password_reset"],
            required:true,
        },
        createdAt:{
            type:Date,
            default: Date.now,
            expires:300 // 5 minutes
        }
    }, {
        versionKey: false
    }
);

export default mongoose.model("OTP", otpSchema);