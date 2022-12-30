import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Buffer } from "buffer";

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
gap: 3rem;
background-color: #131324;
height: 100vh;
width: 100vw;

.loader {
    max-inline-size: 100%;
}

.title-container {
    h1{
        color: white;
    }
}

    .avatars {
        display: flex;
        gap: 2rem;

        .avatar {
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;
            img {
                height: 6rem;
                cursor: pointer;
            }
        }

        .selected{
            border: 0.4rem solid #4e03ff;

        }
    }

    .submit-btn {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    transition: 0.5s ease-in-out;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;



const SetAvatar = () => {
    const api = "https://api.multiavatar.com/45678945";
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    useEffect(() => {
        if (!localStorage.getItem("user")) {
            navigate("/login");
        }
    }, []);

    const setProfilePic = async () => {
        if (selectedAvatar === null) {
            toast.error("Please select an avatar", toastOptions);
        }
        else {
            const user = JSON.parse(localStorage.getItem("user"));
            const { data } = await axios.post(`/avatar/setAvatar/${user._id}`, {
                image: avatars[selectedAvatar],
            });

            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("user", JSON.stringify(user));
                navigate("/");
            } else {
                toast.error("Error accured", toastOptions);
            }
        }

    };

    useEffect(() => {
        const data = [];
        const fetchAvatars = async () => {
            try {

                for (let i = 0; i < 4; i++) {
                    console.log("hey");
                    // generate random avatars
                    const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                    const buffer = new Buffer(image.data);
                    data.push(buffer.toString("base64"));
                }
                setAvatars(data);
                setIsLoading(false);
            } catch (err) {
                toast.error("error accured, please try again later", toastOptions);
                localStorage.removeItem("user");
                navigate("/login");
            }
        };
        fetchAvatars();
    }, []);

    return (
        <>
            {
                isLoading ?
                    <Container>
                        <img src={loader} alt="loader" className="loader" />
                    </Container> : (
                        <Container>
                            <div className="title-container">
                                <h1>Pick an avatar as your profile picture!</h1>
                            </div>
                            <div className="avatars">
                                {
                                    avatars.map((avatar, index) => (
                                        <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                                            <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={() => setSelectedAvatar(index)} />
                                        </div>
                                    ))
                                }
                            </div>
                            <button className="submit-btn" onClick={setProfilePic}>Set as profile picture</button>
                        </Container>
                    )}
            <ToastContainer />
        </>
    );
};

export default SetAvatar;