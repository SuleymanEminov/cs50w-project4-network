import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Login} from "./component/Login";
import {Home} from "./component/Home";
import {Navigation} from './component/Navigation';
import {Logout} from './component/Logout';
import {NewPost} from './component/NewPost';
import {Register} from './component/Register';
import {PostList} from './component/PostList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  document.title = 'CS50W Network';
  return <BrowserRouter>
  <Navigation> Hello </Navigation>
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/home" element={<Home/>}/>
    <Route path="/new-post" element={<NewPost/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/logout" element={<Logout/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/all-posts" element={<PostList/>}/>
    <Route path="*" element={<h1>Not Found</h1>}/>
  </Routes>
</BrowserRouter>;
}

export default App;
