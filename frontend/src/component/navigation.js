import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import React, { useState, useEffect} from 'react';

export function Navigation() {
   const [isAuth, setIsAuth] = useState(false);
   useEffect(() => {
     const checkAuth = () => {
       if (localStorage.getItem('access_token') !== null) {
         setIsAuth(true);
       } else {
         setIsAuth(false);
       }
     };
 
     checkAuth();
 
     window.addEventListener('storage', checkAuth);
 
     return () => {
       window.removeEventListener('storage', checkAuth);
     };
   }, []);
     return ( 
      <div>
        <Navbar bg="dark" variant="dark">
          <LinkContainer to="/">
            <Navbar.Brand>CS50W Network</Navbar.Brand>
          </LinkContainer>
          <Nav className="me-auto"> 
          {isAuth ? (
            <LinkContainer to="/new-post">
              <Nav.Link>New Post</Nav.Link>
            </LinkContainer>
          ) : null}
          <LinkContainer to="/all-posts">
            <Nav.Link>All Posts</Nav.Link>
          </LinkContainer>
          {isAuth ? (
            <LinkContainer to="/following">
              <Nav.Link>Following</Nav.Link>
            </LinkContainer>
          ) : null}
          </Nav>
          <Nav>
          {isAuth ? (
            <LinkContainer to="/logout">
              <Nav.Link>Logout</Nav.Link>
            </LinkContainer>
          ) : (
            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
          )}
          </Nav>
          <Nav>
          {!isAuth && (
            <LinkContainer to="/register">
              <Nav.Link>Register</Nav.Link>
            </LinkContainer>
          )}
          </Nav>
        </Navbar>
       </div>
     );
}
