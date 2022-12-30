import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import ChatInput from "./ChatInput";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";


const Container = styled.div`
display: grid;
grid-template-rows: 10% 78% 12%;
gap: 0.1rem;
overflow: hidden;

@media screen and (min-width:720px) and (max-width: 1080px), screen and (min-width:360px) and (max-width: 480px) {
      grid-template-rows: 15% 70% 15%;
    }

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #0d0d30;

    .user-details {
        display: flex;
        align-items: center;
        gap: 1rem;

        .avatar {
            img {
                height: 3rem;
            }
        }

        .username {
            h3 {
                color: white;
            }
        }
    }
}

.chat-messages {
    padding: 1rem ;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
        width: 0.2rem;

        &-thumb{
            background-color: #ffffff39;
            width: 0.1rem;
            border-radius: 1rem;
        }
    }

    .message {
        display: flex;
        align-items: center;
        min-width: 250px;
        
        .date {
            color: gray;
            font-size: 10px;
        }

        .content {
            max-width: 40%;
            overflow: auto;
            overflow-wrap: break-word;
            padding: 1rem;
            font-size: 1.1rem;
            border-radius: 1rem;
            color: #d1d1d1;
            display: flex;
            flex-direction: column;
            gap: 1rem;

            img {
              width: 100%;
            }
        }
    }

    .sended {
        justify-content: flex-end;

        .content {
            background-color: #4f04ff21;
        }
    }

    .received {
        justify-content: flex-start;

        .content {
            background-color: #9900ff20;
        }
    }

}
`;

const ChatContainer = ({ currentChat, currentUser, socket }) => {
    const [messages, setMessages] = useState([]);
    const [incomingMsg, setIncomingMsg] = useState(null);
    const scrollRef = useRef();

    useEffect(() => {
        const fetchMessages = async () => {
            const res = await axios.post("/messages/getmessages", {
                from: currentUser._id,
                to: currentChat._id,
            });

            setMessages(res.data);
        };

        currentChat && fetchMessages();
    }, [currentChat]);

    const handleSendMsg = async (msg, img) => {
        // if msg contains image upload to firebase storage and add the url to the message object
        if (img) {
            const storageRef = ref(storage, `/files/${img.name}`);

            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on("state_changed", (snapshot) => {

            }, (err) => console.log(err),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        addMessage(msg, downloadURL);
                    });
                }
            );

        }
        else {
            addMessage(msg);
        }
    };

    useEffect(() => {
        // receive message with socket
        if (socket.current) {
            socket.current.on("msg-receive", (data, current) => {
                currentUser.chat === data.from && setIncomingMsg({ fromSelf: false, message: data.message, img: data.img, date: data.date });
            });
        }
    }, []);
    // add the new message to the state
    useEffect(() => {
        incomingMsg && setMessages((prev) => [...prev, incomingMsg]);
    }, [incomingMsg]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);



    const addMessage = async (msg, url = "") => {
        await axios.post("/messages/addmessage", {
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
            img: url
        });

        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: currentUser._id,
            message: msg,
            img: url,
            date: new Date().toLocaleString()
        });


        const msgs = [...messages];

        // push the sent message
        msgs.push({ fromSelf: true, message: msg, img: url, date: new Date().toLocaleString() });

        setMessages(msgs);
        // if the user that the message was sent to doesn't have a chat with the current user, open a new chat at his contacts
        if (!currentChat.chats.includes(currentUser._id)) {
            socket.current.emit("new-chat", {
                starter: currentUser,
                receiver: currentChat
            });
            // add the new chat to database
            await axios.post(`/auth/addchat/${currentChat._id}`, {
                chatId: currentUser._id
            });
        }
    };


    return (
        <Container>
            <div className="chat-header">
                <div className="user-details">
                    <div className="avatar">
                        <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
                    </div>
                    <div className="username">
                        <h3>{currentChat.username}</h3>
                    </div>
                </div>
            </div>
            <div className="chat-messages">
                {
                    messages.map((msg) => (
                        <div ref={scrollRef} key={uuidv4()}>
                            <div className={`message ${msg.fromSelf ? "sended" : "received"}`}>
                                <div className="content">
                                    {
                                        msg.img && <img src={msg.img} alt="" />
                                    }
                                    <p>
                                        {msg.message}
                                    </p>
                                    <div className="date">
                                        <span>
                                            {msg.date.split(",")[0].split(".")[0]}/
                                            {msg.date.split(",")[0].split(".")[1]} { }
                                            {msg.date.split(",")[1]}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
    );
};

export default ChatContainer;