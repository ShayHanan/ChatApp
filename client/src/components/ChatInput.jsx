import React, { useState } from 'react';
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill, BsFillImageFill, BsFillTrashFill } from "react-icons/bs";
import { storage } from "../firebase";


const Container = styled.div`
display: grid;
grid-template-columns: 5% 95%;
align-items: center;
background-color: #080420;
padding: 0 2rem;
padding-bottom: 0.3rem;

@media screen and (min-width:720px) and (max-width: 1080px), screen and (min-width:360px) and (max-width: 480px) {
            padding: 0 1rem;
            gap: 1rem;
           
        }

.button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;

    .emoji {
        position: relative;
        svg {
            font-size: 1.5rem;
            color: #ffff00e8;
            cursor: pointer;
        }

        .EmojiPickerReact {
            position: absolute;
            top: -380px;
            left: -10px;
            box-shadow: 0 5px 10px #9a86f3;
            border-color: #9186f3;
            --epr-bg-color: #080420;
            --epr-category-label-bg-color: #080420;

            .epr-body::-webkit-scrollbar {
                background-color: #080420;
                width: 5px;

                &-thumb {
                    background-color: #9186f3;
                    border-radius: 5px;
                    height: 50px;
                }
            }

            .epr-search {
                background-color: transparent;
                border-color: #9186f3;
            }


        }
    } 
}

.input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;

    input {
        display: flex;
        align-items: center;
        width: 90%;
        height: 60%;
        background-color: transparent;
        color: white;
        border: none;
        padding-left: 1rem;
        font-size: 1.2rem;

        &::selection {
            background-color: #9186f3;
        }
        &:focus {
            outline: none;
        }
    }
    .send {
        padding: 0.3rem 2rem;
        border-radius: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #9a86f3;
        border: none;
        cursor: pointer;

        @media screen and (min-width:720px) and (max-width: 1080px), screen and (min-width:360px) and (max-width: 480px) {
            padding: 0.3rem 1rem;
            svg {
                font-size: 1rem;
            }
        }

        

        svg {
            font-size: 1rem;
            color: white;

            @media screen and (min-width:720px) and (max-width: 1080px), screen and (min-width:360px) and (max-width: 480px) {
            font-size: 0.5rem;
        }
        }
    }

    label {
        display: flex;
        align-items: center;
        color: #ffffff34;
        font-size: 20px;
        cursor: pointer;
    }

    .delete {
        display: flex;
        align-items: center;
        background-color: transparent;
        color: #ffffff34;
        border: none;
        font-size: 20px;
        cursor: pointer;
    }

}
`;

const ChatInput = ({ handleSendMsg }) => {
    const [showEmoji, setShowEmoji] = useState(false);
    const [msg, setMsg] = useState("");
    const [img, setImg] = useState(null);


    const toggleEmoji = () => {
        setShowEmoji(!showEmoji);
    };

    const handleEmojiClick = (emoji) => {
        let message = msg;
        message += emoji.emoji;
        setMsg(message);
    };

    const sendChat = (e) => {
        e.preventDefault();
        if (msg.length > 0 || img) {
            handleSendMsg(msg, img);
            setMsg("");
            setImg(null);
        }
    };

    const handleDelete = () => {
        setImg(null);
    };
    return (
        <Container>
            <div className="button-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={toggleEmoji} />
                    {showEmoji && <Picker width={230} height={350} onEmojiClick={handleEmojiClick} />}
                </div>
            </div>
            <form className="input-container" onSubmit={(e) => sendChat(e)}>
                <input autoFocus type="text" placeholder="Type something..." value={msg} onChange={e => setMsg(e.target.value)} />
                <div>
                    {img ?
                        <button className="delete" onClick={handleDelete}>
                            <BsFillTrashFill />
                        </button>
                        :
                        <>
                            <input
                                type="file"
                                style={{ display: "none" }}
                                id="file"
                                onChange={(e) => setImg(e.target.files[0])}
                            />
                            <label htmlFor="file">
                                <BsFillImageFill />
                            </label>
                        </>
                    }
                </div>
                <button className="send" type="submit">
                    <IoMdSend />
                </button>
            </form>
        </Container>
    );
};

export default ChatInput;