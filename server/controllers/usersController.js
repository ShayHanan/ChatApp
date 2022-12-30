import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const register = async (req,res,next) => {
    try 
    {
    const {username, email, password} = req.body;
    const isExist = await User.findOne({username});

    if (isExist) {
        return res.json({msg: "username already exists", status: false});
    }

    const emailCheck = await User.findOne({ email });

    if (emailCheck) {
        return res.json({msg: "Email already exists", status: false});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        email,
        username,
        password: hashedPassword,
    });
    delete user.password;
    return res.json({user, status: true});
} catch (err) {
    next(err);
}
};


export const login = async (req,res,next) => {
    try 
    {
    const {username, password} = req.body;
    const user = await User.findOne({username});

    if (!user) {
        return res.json({msg: "Incorrect username or password", status: false});
    }

    const isPassowrdValid = await bcrypt.compare(password, user.password);

    if (!isPassowrdValid) {
        return res.json({msg: "Incorrect username or password", status: false});
    }

    delete user.password;
    
    return res.json({user, status: true});
} catch (err) {
    next(err);
}
};

export const getAllUsers = async (req,res,next) => {
    try 
    {
    // Get all users except current user
    const users = await User.find({_id:{ $ne:req.params.id }}).select([
        "email","username", "avatarImage", "_id"
    ]);

    return res.json(users);
} catch (err) {
    next(err);
}
};

export const getChats = async (req,res,next) => {
    try 
    {
    const user = await User.findById(req.params.id);
    
    const chats = await Promise.all(user.chats.map(async (id) => {
        return await User.findById(id);
    }))

    return res.json(chats);
} catch (err) {
    next(err);
}
};


export const addChat = async (req,res,next) => {
    try 
    {
    const user = await User.findById(req.params.id);
    if(!user.chats.includes(req.body.chatId))
        await user.update({$addToSet: {chats: req.body.chatId}});

    return res.json("chat added");
} catch (err) {
    next(err);
}
};

export const getUserByName = async (req,res,next) => {
    try 
    {
    const user = await User.find({username: req.params.name});
    return res.json(user);
} catch (err) {
    next(err);
}
};

