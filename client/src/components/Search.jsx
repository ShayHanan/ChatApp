import axios from "axios";
import React, { useState } from 'react';
import styled from "styled-components";
import { BsSearch } from "react-icons/bs";

const Conatiner = styled.div`
.search {
    background-color: transparent;
    color: #ffffff34;
    border: none;
    font-size: 20px;
    cursor: pointer;
}

span {
        color: red;
    }
`;

const Chat = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    background-color: #9a86f3;
    min-height: 5rem;
    width: 95%;
    cursor: pointer;
    border-radius: 0.2rem;
            padding: 0.4rem;    

    img {
        height: 3rem;
    }

    h3 {
        color: white;
    }
`;

const SearchInput = styled.input`
    margin-bottom: 0.5rem;
    width: 70%;
    height: 2rem;
    font-size: 1.5rem;
    border: none;
    border-bottom: 0.1px solid #272727;
    outline: none;
    background-color: transparent;
    color: white;
`;

const Search = ({ currentUserName, currentUser, setNewChat, socket }) => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    const handleSearch = async () => {
        try {
            // check if the user didnt search himself
            if (currentUserName !== username) {
                const { data } = await axios.get(`/auth/getuserbyname/${username}`);
                if (!data[0]) {
                    setErr(true);
                    setUser(null);
                }
                else {
                    setUser(data[0]);
                    setErr(false);
                }
            }
        } catch (error) {
        }
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    };

    const handleSelect = async () => {
        // add new chat to database
        try {
            await axios.post(`/auth/addchat/${currentUser._id}`, {
                chatId: user._id
            });
            // add the chat to the user object
            currentUser.chats.push(user._id);
            setNewChat(user);
            setUsername("");
            setUser(null);
        } catch (error) {

        }
    };

    return (
        <Conatiner>
            <SearchInput
                type="text"
                placeholder="Find a user..."
                onKeyDown={handleKey}
                onChange={(e) => setUsername(e.target.value)}
                value={username}
            />
            <button className="search" onClick={handleSearch}>
                <BsSearch />
            </button>
            {err && <> <br /> <span>User not found!</span> </>}
            {user && (
                <Chat onClick={handleSelect}>
                    <img src={`data:image/svg+xml;base64,${user.avatarImage}`} alt="avatar" />
                    <div className="userChatInfo">
                        <h3>{user.username}</h3>
                    </div>
                </Chat>
            )}
        </Conatiner>
    );
};

export default Search;