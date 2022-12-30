import React, { useEffect, useState, useRef } from 'react'
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
import Search from "../components/Search";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;

    @media screen and (min-width:720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }

    
    @media screen and (min-width:360px) and (max-width: 480px) {
      grid-template-columns: 17% 83%;
    }
    
  }

`

const Chat = () => {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [currentChat, setCurrentChat] = useState(null);
  const [newChat, setNewChat] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("user")){
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("user")));
    }
  },[])

  useEffect(() => {
    if(currentUser) {
      socket.current = io("http://localhost:5000");
      socket.current.emit("add-user", currentUser._id);
    }
  },[currentUser])

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet){
          const { data } = await axios.get(`/auth/getchats/${currentUser._id}`);
          setContacts(data);
         } else {
          navigate("/setAvatar");
         }
          
      }
    }

    fetchContacts();

  },[currentUser, newChat]);

  const handleChatChange =  (chat) => {
    currentUser.chat = chat._id;
    setCurrentChat(chat);
  }
  return (
   <Container>
    <div className="container">
      <Contacts setNewChat={setNewChat} socket={socket} contacts={contacts} setContacts={setContacts} currentUser={currentUser} changeChat={handleChatChange}/>

      {
      currentChat === null ? (<Welcome currentUser={currentUser} />) : ( <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>)
      }
    </div>
   </Container>
  )
}

export default Chat