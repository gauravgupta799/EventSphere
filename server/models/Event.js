import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        required:true
    },
    ticketPrice:{
        type:Number,
        required:true
    },
    totalSeats:{
        type:Number,
        required:true
    },
    availableSeats:{
        type:Number,
        required:true
    },
    organizer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{ timestamps:true });


export default mongoose.model("Event", EventSchema);