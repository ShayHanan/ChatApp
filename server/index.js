import userRoutes from "./routes/userRoutes.js";
import avatarRoutes from "./routes/avatarRoutes.js";
import messagesRoute from "./routes/messagesRoutes.js";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from 'socket.io';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes)
app.use("/api/avatar", avatarRoutes)
app.use("/api/messages", messagesRoute)



mongoose.connect(process.env.MONGO_URL).then(()=> {
    console.log("DB connection successful");
}).catch(err => console.log(err.message));

const server = app.listen(process.env.PORT, ()=> {
    console.log("server is listening on port " + process.env.PORT);
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
});

global.onlineUsers = new Map();


io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data);
        }
    })

    socket.on("new-chat", (data) => {
        const sendUserSocket = onlineUsers.get(data.receiver._id);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("add-chat", data);
        }
    })
})
