import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './components/home.js';
//import Rooms from './components/rooms.js';

import './App.css';

function App() {
  return (
    <Router>
      <Route exakt path='/' component={ Home } />
    </Router>
  );
}

export default App;
