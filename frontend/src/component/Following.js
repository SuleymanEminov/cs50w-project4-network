import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const Following = () => {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/following-posts/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setPosts(data);
      } catch (e) {
        setError('Failed to load following feed.');
      }
    })();
  }, []);

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
    </div>
  );
};