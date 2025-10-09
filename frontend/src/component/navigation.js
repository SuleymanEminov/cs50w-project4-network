import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
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
          <Navbar.Brand href="/">CS50W Network</Navbar.Brand>            
          <Nav className="me-auto"> 
          {isAuth ? <Nav.Link href="/new-post">New Post</Nav.Link> : null}
          <Nav.Link href="/all-posts">All Posts</Nav.Link>
          </Nav>
          <Nav>
          {isAuth ? <Nav.Link href="/logout">Logout</Nav.Link> :  
                    <Nav.Link href="/login">Login</Nav.Link>}
          </Nav>
          <Nav>
          {isAuth ? null :  
                    <Nav.Link href="/Register">Register</Nav.Link>}
          </Nav>
          {isAuth ? <Nav.Link href="/following">Following</Nav.Link> : null}
        </Navbar>
       </div>
     );
}
