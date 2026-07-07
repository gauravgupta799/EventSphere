import Event from "../models/Event.js";


// Create an event
export const createEvent = async (req, res)=>{
    try {
        const {
            title, description, category, 
            image, location, date, startTime,
            endTime, ticketPrice, totalSeats
        } = req.body;

        if(!title || !description || !category || !location || !image
            || !date || !startTime || !endTime || !ticketPrice || !totalSeats
        ){
            return res.status(400).json({error:"All fields must be provided."})
        }

        const event = await Event.create({
            title, description, category, image, location, 
            date, startTime, endTime, ticketPrice, totalSeats, 
            availableSeats: totalSeats, 
            organizer: req.user._id
        })

        return res.status(201).json({
            success:true,
            message:"Event created successfully.",
            event
        });
    } catch (error) {
        console.log("Create Event Error: ", error);
        return res.status(500).json({
            error:error.message
        })
    }
}

// Get all events
export const getAllEvents = async (req, res)=>{
    try {
        
        // const {category, location} = req.query;

        // const filters = {};

        // if(category){
        //     filters.category = category;
        // }
        // if(location){
        //     filters.location = location;
        // }

        const events = await Event.find().sort({ date: 1 }).populate("organizer", "name email");

        return res.status(200).json({
            success:true,
            count:events.length,
            events
        })
        
    } catch (error) {
        console.log("Get All Event Error: ", error);
       return res.status(500).json({ error: error.message });
    }
}

// Get single event
export const getEvent = async (req, res)=>{
    try {
        const eventId = req.params.id;

        const event = await Event.findById(eventId);

        if(!event){
            return res.status(404).json({ error:"Event not found" });
        }
        
        return res.status(200).json({
            success:true, event
        });
        
    } catch (error) {
        console.log("Get An Event Error: ", error);
        return res.status(500).json({ error: error.message });
    }
}

// Update the event
export const updateEvent = async (req, res)=>{
    try {
        const eventId = req.params.id;

        const event = await Event.findByIdAndUpdate(eventId);

        if(!event){
            return res.status(404).json({ error: "Event not found" });
        }

        Object.assign(event, req.body);

        await event.save();

        return res.status(200).json({
            success:true, 
            message:"Event updated successfully.",
            event
        })
        
    } catch (error) {
        console.log("Update An Event Error: ", error);
        return res.status(500).json({ error: error.message });
    }
}

// Delete an event
export const deleteEvent = async (req, res)=>{
    try {
        const eventId = req.params.id;

        const event = await Event.findByIdAndDelete(eventId);

        if(!event){
            return res.status(404).json({error: "Event not found" });
        }

        await event.deleteOne();

        return res.status(200).json({
            success:true,
            message:"Event deleted successfully."
        });
        
    } catch (error) {
        console.log("Delete An Event Error: ", error);
        return res.status(500).json({ error: error.message });
    }
}