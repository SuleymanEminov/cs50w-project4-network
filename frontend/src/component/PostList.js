import React, { useState, useEffect } from 'react';
import axios from '../interceptors/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

export const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);

    useEffect(() => {
        fetchPosts('/api/all-posts/');
    }, []);

    const fetchPosts = async (url) => {
        try {
            const { data } = await axios.get(url);
            setPosts(data.results);
            setNextPage(data.next ? new URL(data.next).pathname + new URL(data.next).search : null);
            setPrevPage(data.previous ? new URL(data.previous).pathname + new URL(data.previous).search : null);
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
                        <h5 className="card-title">
                            {post.author?.username ? (
                            <Link to={`/profile/${encodeURIComponent(post.author.username)}`}>
                            {post.author.username}
                          </Link>
                        ) : 'anonymous'}
                        </h5>
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
            <div className="d-flex justify-content-between">
                <button className="btn btn-primary" onClick={() => fetchPosts(prevPage)} disabled={!prevPage}>Previous</button>
                <button className="btn btn-primary" onClick={() => fetchPosts(nextPage)} disabled={!nextPage}>Next</button>
            </div>
        </div>
    );
};