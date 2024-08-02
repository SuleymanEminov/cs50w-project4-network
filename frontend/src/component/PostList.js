import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const { data } = await axios.get('http://localhost:8000/api/all-posts/');
            setPosts(data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch posts');
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="container">Loading...</div>;
    }

    if (error) {
        return <div className="container">{error}</div>;
    }

    return (
        <div className="container">
            <h2 className="my-4">All Posts</h2>
            {posts && posts.length > 0 ? (
                posts.map(post => (
                    <div key={post.id} className="card my-3">
                        <div className="card-body">
                            <h5 className="card-title">{post.author.username || 'anonymous'}</h5>
                            <p className="card-text">{post.content}</p>
                            <p className="card-text">
                                <small className="text-muted">
                                    {new Date(post.created_at).toLocaleString()}
                                </small>
                            </p>
                            <p className="card-text">
                                <small className="text-muted">Likes: {post.likes}</small>
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div>No posts available</div>
            )}
        </div>
    );
};