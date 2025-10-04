import { BrowserRouter as HashRouter, Routes, Route } from 'react-router-dom';

import Home from "./pages/Home";

import globalStyles from "./App.module.css";

export default function App() {
  return (
    <div className={globalStyles.container}>
      <div className={globalStyles.content}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}
