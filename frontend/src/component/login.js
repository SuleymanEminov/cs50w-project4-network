import axios from "axios";
import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();

        const user = {
            username: username,
            password: password
        };

        // Create POST request to backend
        const {data} = await axios.post("http://localhost:8000/token/", user, 
        {
            headers : 
            {
                "Content-Type": "application/json"},
                withCredentials: true
            });

        // Initialize the access & refresh token in localstorage.      
        localStorage.clear();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        axios.defaults.headers.common['Authorization'] = "Bearer " + data.access;
        window.location.href = "/";
    }

    return(
        <div className="container">
            <h2 className="my-4">Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group mt-3">
                    <label>Username</label>
                    <input 
                        className="form-control mt-1" 
                        placeholder="Enter Username" 
                        name='username'  
                        type='text' 
                        value={username}
                        required 
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group mt-3">
                    <label>Password</label>
                    <input 
                        name='password' 
                        type="password"     
                        className="form-control mt-1"
                        placeholder="Enter password"
                        value={password}
                        required
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="d-grid gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    )
}