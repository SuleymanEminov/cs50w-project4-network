import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export const Profile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const { data } = await axios.get(
                  `/api/profile/${encodeURIComponent(username)}/`,
                  { headers }
                );
                setProfile(data);
            } catch (err) {
                console.error('fetchProfile error', err);
                setError('Failed to fetch profile');
            }
        };

        fetchProfile();
    }, [username]);

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

            setProfile(prev => prev ? {
                ...prev,
                is_following: data.is_following ?? (data.action === 'followed'),
                followers: data.followers ?? prev.followers,
                following: data.following ?? prev.following
            } : prev);
        } catch (e) {
            console.error('toggleFollow error', e);
            setError('Failed to update follow state.');
        }
    };

    if (error) return <div className='container mt-4'>{error}</div>;
    if (!profile) return <div className='container mt-4'>Loading...</div>;

    const isSelf = !!profile.is_self;

    return (
        <div className="container mt-4">
          <h2>@{profile.username}</h2>
          <p>Followers: {profile.followers} · Following: {profile.following}</p>

          {!isSelf && (
            <button className="btn btn-sm btn-outline-primary" onClick={toggleFollow}>
              {profile.is_following ? 'Unfollow' : 'Follow'}
            </button>
          )}
    
          <h4 className="mt-4">Posts</h4>
          {profile.posts.length === 0 ? (
            <div>No posts yet.</div>
          ) : (
            profile.posts.map(p => (
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
        </div>
    );
};