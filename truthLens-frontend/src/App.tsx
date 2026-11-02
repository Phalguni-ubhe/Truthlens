import { useState } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup' | 'dashboard' | 'profile'>('home');
  const [authMessage, setAuthMessage] = useState<string | undefined>(undefined); 
  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleSignupClick = () => {
    setCurrentPage('signup');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleLoginSuccess = () => {
    setAuthMessage(undefined);
    setCurrentPage('dashboard');
  };

  const handleSignupSuccess = () => {
    setAuthMessage(undefined);
    setCurrentPage('dashboard');
  };

  const handleSwitchToLogin = (message?: string) => {
  if (message) {
    setAuthMessage(message);
  }
  setCurrentPage('login');
};

  const handleSwitchToSignup = () => {
    setCurrentPage('signup');
  };

  const handleLogout = () => {
    setCurrentPage('home');
  };

  const handleProfileClick = () => {
    setCurrentPage('profile');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleHomeFromDashboard = () => {
    setCurrentPage('home');
  };
  
 if (currentPage === 'login') {
  return (
    <Login 
      onBack={handleBackToHome} 
      onLoginSuccess={handleLoginSuccess}
      onSignup={handleSwitchToSignup}
      message={authMessage} // <-- ADDED PROP
      clearMessage={() => setAuthMessage(undefined)}
    />
  );
}

  if (currentPage === 'signup') {
    return (
      <Signup 
        onBack={handleBackToHome} 
        onLogin={handleSwitchToLogin}
        onSignup={handleSignupSuccess}
      />
    );
  }

  if (currentPage === 'dashboard') {
    return <Dashboard onLogout={handleLogout} onProfileClick={handleProfileClick} onHomeClick={handleHomeFromDashboard} />;
  }

  if (currentPage === 'profile') {
    return <Profile onBack={handleBackToDashboard} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation 
        onLoginClick={handleLoginClick} 
        onSignupClick={handleSignupClick}
      />
      <Hero onSignupClick={handleSignupClick} />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
}