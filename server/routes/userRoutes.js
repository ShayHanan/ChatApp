import {addChat, getAllUsers, getChats, getUserByName, login, register}  from "../controllers/usersController.js";
import express from "express";


const router = express.Router();


router.post("/register", register)

router.post("/login", login);

router.get("/allusers/:id", getAllUsers)

router.post("/addchat/:id", addChat)

router.get("/getchats/:id", getChats)

router.get("/getuserbyname/:name", getUserByName)





export default router;