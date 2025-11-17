import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const features = [
        {
            icon: '📅',
            title: 'Event Creation',
            description: 'Create and manage events easily with our intuitive interface'
        },
        {
            icon: '👥',
            title: 'Registration',
            description: 'Manage attendee registrations and track attendance'
        },
        {
            icon: '✅',
            title: 'Check-In',
            description: 'Quick on-site check-in for attendees'
        },
        {
            icon: '⏳',
            title: 'Waitlist',
            description: 'Automatic waitlist management when events are full'
        },
        {
            icon: '📊',
            title: 'Dashboard',
            description: 'Complete analytics and event management dashboard'
        },
        {
            icon: '🔐',
            title: 'Secure',
            description: 'Enterprise-grade security for your event data'
        }
    ];

    return (
        <div className="page-content">
            <section className="hero">
                <div className="container hero-content">
                    <h1>Welcome to EventPro</h1>
                    <p className="hero-subtitle">Your complete event management solution</p>
                    <div className="hero-buttons">
                        <Link to="/dashboard" className="btn btn-primary btn-lg">Get Started</Link>
                        <Link to="/register" className="btn btn-outline btn-lg">Create Account</Link>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <h2>Why Choose EventPro?</h2>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="container">
                    <h2>Ready to manage your events?</h2>
                    <p>Join thousands of event organizers using EventPro</p>
                    <Link to="/register" className="btn btn-primary btn-lg">Start Free Trial</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;