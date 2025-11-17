import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const token = localStorage.getItem('auth_token');

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        window.location.href = '/';
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <div className="navbar-brand">
                    <Link to="/" className="logo">🎉 EventPro</Link>
                </div>
                <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    {token ? (
                        <li><button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button></li>
                    ) : (
                        <>
                            <li><Link to="/login" className="btn btn-outline btn-sm">Login</Link></li>
                            <li><Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;