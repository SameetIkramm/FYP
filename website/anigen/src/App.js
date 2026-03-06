import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar/Navbar'
import Avatar from './components/CreateAvatar/CreateAvatar'
import Navbar2 from './components/Navbar2/Navbar2'
import Home from './components/Home/home'
import Home2 from './components/Home2/Home2'
import About from './components/About/about'
import Difference from './components/Difference/difference'
import Service from './components/Services/services'
import Contact from './components/Contact/contact'
import Login from './components/LogIn/Login'
import TTS from './components/TTS/TTS'
import Video from './components/Video/Video'
import WebGL from './components/Web GL/WebGL';
import Register from './components/Register/Register'
import Footer from './components/Footer/footer'
import {Route, Routes} from 'react-router-dom'
function App() {
  return (
    <>
  <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/home" element={<Home2/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/difference" element={<Difference/>}/>
      <Route path="/avatar" element={<Avatar/>}/>
      <Route path="/TTS" element={<TTS/>}/>
       <Route path="/video" element={<WebGL/>}/> 
      {/* <Route path="/video" element={<Video/>}/> */}
      <Route path="/service" element={<Service/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes>
    <Footer/>
    </>
  );
}

export default App;
