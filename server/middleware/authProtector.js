import jwt from "jsonwebtoken";
import User from "../models/User.js";

 

export const verifyToken = async (req, res, next)=>{
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                error:"Access denied. No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({error:"User not found."})
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            error:"Invalid or expired token."
        })
    }
}

export const isAdmin = (req, res, next)=>{
    if(req.user.role !== "admin"){
        return res.status(403).json({
            error:"Access denied. Admin can only perform this action."
        });
    }
}