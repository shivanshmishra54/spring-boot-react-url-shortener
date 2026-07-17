import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Analysis from './pages/Analysis';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import InfoModal from './components/InfoModal';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [authModal, setAuthModal] = useState(null); // null | 'login' | 'signup'
  const [infoModal, setInfoModal] = useState(null); // null | 'docs' | 'architecture' | 'help' | 'contact' | 'checkout' | 'legal'

  const setGlobalUsername = (user) => {
    setUsername(user);
    localStorage.setItem('username', user);
  };

  const handleLogout = () => {
    setUsername('');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  };

  const openAuth = (mode) => setAuthModal(mode);
  const closeAuth = () => setAuthModal(null);
  const openInfo = (type) => setInfoModal(type);
  const closeInfo = () => setInfoModal(null);

  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
          <div className="flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<LandingPage username={username} onLogout={handleLogout} onOpenAuth={openAuth} onOpenInfo={openInfo} />} />
              <Route path="/dashboard" element={<Dashboard username={username} onLogout={handleLogout} onOpenAuth={openAuth} onOpenInfo={openInfo} />} />
              <Route path="/features" element={<Features username={username} onLogout={handleLogout} onOpenAuth={openAuth} onOpenInfo={openInfo} />} />
              <Route path="/pricing" element={<Pricing username={username} onLogout={handleLogout} onOpenAuth={openAuth} onOpenInfo={openInfo} />} />
              <Route path="/analysis" element={<Analysis username={username} onLogout={handleLogout} onOpenAuth={openAuth} onOpenInfo={openInfo} />} />
            </Routes>
          </div>
          <Footer onOpenInfo={openInfo} />
        </div>

        {authModal && (
          <AuthModal
            mode={authModal}
            onClose={closeAuth}
            setGlobalUsername={setGlobalUsername}
          />
        )}

        {infoModal && (
          <InfoModal
            type={infoModal}
            username={username}
            onClose={closeInfo}
          />
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
