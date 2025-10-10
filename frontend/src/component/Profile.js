import React, { useState, useEffect } from 'react';
import axios from '../interceptors/axios';
import { useParams } from 'react-router-dom';

export const Profile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [posts, setPosts] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);

    useEffect(() => {
        fetchProfile(`/api/profile/${encodeURIComponent(username)}/`);
    }, [username]);

    const fetchProfile = async (url) => {
        try {
            const token = localStorage.getItem('access_token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const { data } = await axios.get(url, { headers });
            setProfile(data);
            setPosts(data.results.posts);
            setNextPage(data.next ? new URL(data.next).pathname + new URL(data.next).search : null);
            setPrevPage(data.previous ? new URL(data.previous).pathname + new URL(data.previous).search : null);
        } catch (err) {
            console.error('fetchProfile error', err);
            setError('Failed to fetch profile');
        }
    };

    const fetchPage = async (url) => {
        try {
            const token = localStorage.getItem('access_token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const { data } = await axios.get(url, { headers });
            setPosts(data.results.posts);
            setNextPage(data.next ? new URL(data.next).pathname + new URL(data.next).search : null);
            setPrevPage(data.previous ? new URL(data.previous).pathname + new URL(data.previous).search : null);
        } catch (err) {
            console.error('fetchPage error', err);
            setError('Failed to fetch posts');
        }
    };

    const toggleFollow = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError('You must be logged in to follow users.');
                return;
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const { data } = await axios.post(
                `/api/profile/${encodeURIComponent(username)}/follow/`,
                {},
                { headers }
            );

            // normalize returned values
            const isFollowing = typeof data.is_following !== 'undefined'
                ? data.is_following
                : (data.action ? data.action === 'followed' : null);

            const returnedFollowers = typeof data.followers !== 'undefined' ? data.followers : null;
            const returnedFollowing = typeof data.following !== 'undefined' ? data.following : null;

            // optimistic update of local state without refetching
            setProfile(prev => {
                if (!prev) return prev;
                const updated = { ...prev };

                // handle paginated DRF wrapper (profile.results.*) or simple payload (profile.*)
                const target = updated.results ? updated.results : updated;

                // update is_following
                if (isFollowing !== null) {
                    target.is_following = isFollowing;
                } else {
                    // toggle if server didn't return explicit flag
                    target.is_following = !target.is_following;
                }

                // update followers count: prefer server value, otherwise +/- 1
                if (returnedFollowers !== null) {
                    target.followers = returnedFollowers;
                } else if (typeof target.followers === 'number') {
                    target.followers = Math.max(0, target.followers + (target.is_following ? 1 : -1));
                }

                // update following count if provided
                if (returnedFollowing !== null) {
                    target.following = returnedFollowing;
                }

                return updated;
            });

            setError('');
        } catch (e) {
            console.error('toggleFollow error', e.response || e.message);
            setError('Failed to update follow state.');
        }
    };

    if (error) return <div className='container mt-4'>{error}</div>;
    if (!profile) return <div className='container mt-4'>Loading...</div>;

    const isSelf = !!profile.results.is_self;

    return (
        <div className="container mt-4">
          <h2>@{profile.results.username}</h2>
          <p>Followers: {profile.results.followers} · Following: {profile.results.following}</p>

          {!isSelf && (
            <button className="btn btn-sm btn-outline-primary" onClick={toggleFollow}>
              {profile.results.is_following ? 'Unfollow' : 'Follow'}
            </button>
          )}
    
          <h4 className="mt-4">Posts</h4>
          {posts.length === 0 ? (
            <div>No posts yet.</div>
          ) : (
            posts.map(p => (
              <div key={p.id} className="card my-3">
                <div className="card-body">
                  <p className="card-text">{p.content}</p>
                  <small className="text-muted">
                    {new Date(p.created_at).toLocaleString()} · Likes: {p.likes}
                  </small>
                </div>
              </div>
            ))
          )}
            <div className="d-flex justify-content-between">
                <button className="btn btn-primary" onClick={() => fetchPage(prevPage)} disabled={!prevPage}>Previous</button>
                <button className="btn btn-primary" onClick={() => fetchPage(nextPage)} disabled={!nextPage}>Next</button>
            </div>
        </div>
    );
};