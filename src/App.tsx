import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Main from './pages/Main';
import UncontrolledFormPage from './pages/UncontrolledFormPage';
import HookFormPage from './pages/HookFormPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/">Main</Link> |{' '}
        <Link to="/uncontrolled">Uncontrolled Form</Link> |{' '}
        <Link to="/hook-form">Hook Form</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/uncontrolled" element={<UncontrolledFormPage />} />
        <Route path="/hook-form" element={<HookFormPage />} />
      </Routes>
    </Router>
  );
};

export default App;
