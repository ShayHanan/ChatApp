import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import Logout from "./Logout";
import Search from "./Search";

const Container = styled.div`
display: grid;
grid-template-rows: 10% 75% 15%;
overflow: hidden;
background-color: #080420;

.brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    img {
        height: 2rem;
    }

    h3 {
        color: white;    
        text-transform: uppercase;
    }

    @media screen and (min-width:360px) and (max-width: 480px) {
        gap: 0.5rem;
        img {
        height: 1.5rem;
    }

    h3 {
       font-size: 0.5rem;
    }
}    
}

    .contacts {
        display: flex;
        flex-direction: column;
        align-content: center;
        overflow: auto;
        gap: 0.8rem;
        margin-left: 0.5rem;
        &::-webkit-scrollbar {
                width: 0.2rem;
                &-thumb {
                    background-color: #ffffff39;
                    width: 0.1rem;
                    border-radius: 1rem;
                }
            }

        .contact {
            background-color: #ffffff39;
            min-height: 5rem;
            width: 95%;
            cursor: pointer;
            border-radius: 0.2rem;
            padding: 0.4rem;
            gap: 1rem;
            align-items: center;
            display: flex;
            flex-wrap: wrap;
            transition: 0.5s ease-in-out;
            overflow: auto;
            @media screen and (min-width:720px) and (max-width: 1080px), screen and (min-width:360px) and (max-width: 480px) {
            gap: 0.5rem;    

            .username {
                h3 {
                    font-size: 0.9rem;
                }
            }
        }

            .avatar{
                img {
                    height: 3rem;
                }
            }

            .username {
                h3{
                    color: white;
                }
            }
        }
        .selected {
            background-color: #9186f3;
        }
    }

    .current-user {
        background-color: #0d0d30;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;

        .avatar {
            img {
                height: 3rem;
                max-inline-size: 100%;
            }
        }

        .username {
            h2 {
                color: white;
            }
        }

        @media screen and (min-width:720px) and (max-width: 1080px), screen and (min-width:360px) and (max-width: 480px) {
            flex-direction: column;
            gap: 0.3rem;
            
            .username {
                h2 {
                    font-size: 0.8rem;
                    text-align: center;
                }
            }
        }
    }
`;

const Contacts = ({ setContacts, contacts, currentUser, changeChat, setNewChat, socket }) => {
    const [currentUserName, setCurrentUserName] = useState(null);
    const [currentUserImage, setCurrentUserImage] = useState(null);
    const [currentSelected, setCurrentSelected] = useState(null);
    const [socketChat, setSocketChat] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        if (currentUser) {
            setCurrentUserImage(currentUser.avatarImage);
            setCurrentUserName(currentUser.username);
        }
    }, [currentUser]);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    };

    useEffect(() => {
        if (socket.current) {
            // adding new chat 
            socket.current.on("add-chat", (data) => {
                // if current user already has the chat in contacts dont add it
                if (!currentUser.chats.includes(data.starter._id)) {
                    setSocketChat(data.starter);
                    currentUser.chats.push(data.starter._id);
                }
            });
        }
    }, [socket.current]);
    // update contacts array if the chat didnt exist
    useEffect(() => {
        socketChat && setContacts((prev) => [...prev, socketChat]);
    }, [socketChat]);

    return (
        <>
            {
                currentUserImage && currentUserName && (
                    <Container>
                        <div className="brand">
                            <img src={Logo} alt="logo" />
                            <h3>Shay Chat</h3>
                        </div>
                        <div className="contacts">
                            <Search currentUserName={currentUserName} currentUser={currentUser} setNewChat={setNewChat} socket={socket} />
                            {
                                contacts.map((contact, index) => (
                                    <div key={index} className={`contact ${index === currentSelected ? "selected" : ""}`} onClick={() => changeCurrentChat(index, contact)}>
                                        <div className="avatar">
                                            <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                                        </div>
                                        <div className="username">
                                            <h3>
                                                {contact.username}
                                            </h3>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="current-user">
                            <div className="avatar">
                                <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
                            </div>
                            <div className="username">
                                <h2>
                                    {currentUserName}
                                </h2>
                            </div>
                            <Logout />
                        </div>
                    </Container>
                )
            }
        </>
    );
};

export default Contacts;