import {useEffect, useState} from "react";
import axios from "axios";

export const Logout = () => {

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.post(
                    'http://localhost:8000/api/logout/',
                    { refresh_token: localStorage.getItem('refresh_token') },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    }
                );
        
    
                console.log('logout', data);
                localStorage.clear();
                axios.defaults.headers.common['Authorization'] = null;
                window.location.href = '/login';
            } catch (e) {
                console.log('logout not working', e);
            }
        })();
    }, []);

    return (
        <div></div>
    )
}