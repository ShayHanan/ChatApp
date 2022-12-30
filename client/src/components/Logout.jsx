import React from 'react'
import styled from "styled-components"
import axios from "axios"
import { useNavigate } from "react-router-dom";

const Button = styled.button`
display: flex;
justify-content: center;
align-items: center;
padding: 0.5rem;
border-radius: 0.5rem;
background-color: #9a86f3;
border: none;
cursor: pointer;
color: #ebe7ff;

@media screen and (min-width:720px) and (max-width: 1080px), screen and (min-width:360px) and (max-width: 480px) {
           width: 3rem;
           height: 2rem;
           padding: 0.2rem;
        }
`

const Logout = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        localStorage.clear();
        navigate("/login");
    }

  return (
   <Button onClick={handleClick}>Logout</Button>
  )
}

export default Logout