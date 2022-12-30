import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message: {
        text: {
            type: String,
        },
    },
        users: {
            type: Array
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }, 
        img: {
            type: String,
        },
        date: String
},  { timestamps: true});

export default mongoose.model("Message", messageSchema);


