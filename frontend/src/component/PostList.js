import React, { useState, useEffect } from 'react';
import axios from '../interceptors/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

export const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [user, setUser] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        fetchPosts('/api/all-posts/');
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/');
            setUser(data);
        } catch (error) {
            console.error('Failed to fetch user', error);
        }
    };

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

    const handleEdit = (post) => {
        setEditingPostId(post.id);
        setEditedContent(post.content);
    };

    const handleCancel = () => {
        setEditingPostId(null);
        setEditedContent('');
    };

    const handleSave = async (postId) => {
        try {
            await axios.put(`/api/posts/${postId}/`, { content: editedContent });
            setEditingPostId(null);
            setEditedContent('');
            fetchPosts('/api/all-posts/'); // Refresh posts
        } catch (error) {
            console.error('Failed to update post', error);
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
                            {editingPostId === post.id ? (
                                <div>
                                    <Form.Control as="textarea" rows={3} value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
                                    <Button variant="primary" className="mt-2" onClick={() => handleSave(post.id)}>Save</Button>
                                    <Button variant="secondary" className="mt-2 ms-2" onClick={handleCancel}>Cancel</Button>
                                </div>
                            ) : (
                                <div>
                                    <p className="card-text">{post.content}</p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            {new Date(post.created_at).toLocaleString()}
                                        </small>
                                    </p>
                                    <p className="card-text">
                                        <small className="text-muted">Likes: {post.likes}</small>
                                    </p>
                                    {user && user.username === post.author?.username && (
                                        <Button variant="primary" onClick={() => handleEdit(post)}>Edit</Button>
                                    )}
                                </div>
                            )}
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