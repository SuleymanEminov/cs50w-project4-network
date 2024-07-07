import React from 'react';
import {useEffect, useState} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';

export const NewPost = () => {
    const [message, setMessage] = useState("");
    
    useEffect (() => {
        if(localStorage.getItem('access_token') === null) {
            window.location.href = "/login";
        }
        else{
            //TODO: create a new post
            
        }
        }, []);

    return <div className="form-signin mt-5 text-center">
        <h3>{message}</h3>
    </div>;


}

