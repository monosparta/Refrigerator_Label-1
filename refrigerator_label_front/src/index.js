import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import App from './App.js';
import Load from './Pages/LoadingPage';
import Login from './Pages/LoginPage';
import Home from './Pages/ManagementPage';


ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/Loading" element={<Load/>}/>
      <Route path="/Login" element={<Login/>}/>
      <Route path="/" element={<Home/>}/>
    </Routes>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
