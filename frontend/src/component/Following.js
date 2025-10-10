import React, { useEffect, useState } from 'react';
import axios from '../interceptors/axios';
import { Link } from 'react-router-dom';

export const Following = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    fetchPosts('/api/following-posts/');
  }, []);

  const fetchPosts = async (url) => {
    try {
      const { data } = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setPosts(data.results);
      setNextPage(data.next ? new URL(data.next).pathname + new URL(data.next).search : null);
      setPrevPage(data.previous ? new URL(data.previous).pathname + new URL(data.previous).search : null);
    } catch (e) {
      setError('Failed to load following feed.');
    }
  };

  if (error) return <div className="container mt-4">{error}</div>;
  if (!posts) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container">
      <h2 className="my-4">Following</h2>
      {posts.length === 0 ? (
        <div>No posts yet.</div>
      ) : (
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
              <small className="text-muted">
                {new Date(post.created_at).toLocaleString()} · Likes: {post.likes}
              </small>
            </div>
          </div>
        ))
      )}
      <div className="d-flex justify-content-between">
        <button className="btn btn-primary" onClick={() => fetchPosts(prevPage)} disabled={!prevPage}>Previous</button>
        <button className="btn btn-primary" onClick={() => fetchPosts(nextPage)} disabled={!nextPage}>Next</button>
      </div>
    </div>
  );
};