import React, { useState } from 'react';
import axios from '../interceptors/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export const NewPost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setMessage('You must be logged in to create a post.');
            return; // Stop the function from proceeding
        }

        const post = { content };

        try {
            const { data } = await axios.post('/api/create-post/', post, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setMessage('Post created successfully!');
            setContent('');
        } catch (error) {
            console.error('Error creating post:', error.response || error.request || error.message);
            setMessage('Failed to create post. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2 className="my-4">Create a New Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <textarea
                        className="form-control"
                        placeholder="Write your post here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="4"
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Post</button>
            </form>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
};