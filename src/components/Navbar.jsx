import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">Q</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">QueueWise</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/queues" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                  Queues
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                    Admin Dashboard
                  </Link>
                )}
                <span className="text-gray-400 text-sm">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 text-sm font-medium">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="sm:hidden p-2 rounded-lg text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden pb-4 pt-2 border-t border-gray-100 flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/queues" className="text-gray-700 py-2 px-2 text-sm" onClick={() => setMenuOpen(false)}>Queues</Link>
                {isAdmin() && (
                  <Link to="/admin" className="text-gray-700 py-2 px-2 text-sm" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
                )}
                <button onClick={handleLogout} className="text-left text-red-600 py-2 px-2 text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 py-2 px-2 text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="text-blue-600 py-2 px-2 text-sm font-medium" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
