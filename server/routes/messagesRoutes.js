import { getMessages, addMessage } from "../controllers/messagesController.js"; 
import express from "express";


const router = express.Router();


router.post("/addmessage", addMessage)

router.post("/getmessages", getMessages);



export default router;