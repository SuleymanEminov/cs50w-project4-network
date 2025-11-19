import React from 'react';
import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Home = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    
    useEffect (() => {
        if(localStorage.getItem('access_token') === null) {
            navigate("/login");
        }
        else{
            (async () => {
                try {
                    const {data} = await axios.get("/home/", 
                    {
                        headers : 
                        {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // crucial line
                            "Content-Type": "application/json"},
                            
                        });
                    setMessage(data.message);
                } catch (error) {
                    console.log(error);
                }
            })()};
        }, []);

    return <div className="form-signin mt-5 text-center">
        <h3>{message} </h3>
    </div>;


}

