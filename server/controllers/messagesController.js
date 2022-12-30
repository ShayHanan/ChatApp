import Message from "../models/messageModel.js";
export const addMessage = async (req, res, next) => {
    try {
        const {from, to, message, img} = req.body;
        const data = Message.create({
            message:{
                text: message
            },
            users: [from, to],
            sender: from,
            img,
            date: new Date().toLocaleString()
        });

        if(data) {
            return res.json({msg: "message added successfully"} )
        }

        return res.json({msg: "failed to add message"})

        
    } catch (error) {
        next(error);
    }

}

export const getMessages = async (req, res, next) => {
    try {
        const {from, to} = req.body;
        const messages = await Message.find({
            users: {
                $all: [from, to],
            }
        }).sort({updatedAt: 1});
        
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
                img: msg.img,
                date: msg.date,
            }
        })
        return res.json(projectedMessages);
        
    } catch (error) {
        next(error);
    }
}