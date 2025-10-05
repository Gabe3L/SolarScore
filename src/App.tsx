import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Lookup from './pages/Lookup';

import './App.module.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lookup" element={<Lookup />} />
      </Routes>
    </Router>
  );
}