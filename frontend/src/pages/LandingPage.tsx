import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'

function LandingNavbar() {
  return (
    <nav style={{ backgroundColor: 'var(--navbar-color)' }} className="text-white w-full h-16 flex items-center justify-between px-6 md:px-12 shrink-0">
      <div className="font-semibold text-lg tracking-wide">
        Employee Story Platform
      </div>
    </nav>
  )
}

function HeroSection() {
  const { login } = useAuth();
  const isBypass = import.meta.env.VITE_AUTH_BYPASS === 'true';
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [devEmailInput, setDevEmailInput] = useState('mock.dev@tricon.com');

  const handleDevLogin = () => {
    if (!devEmailInput) return;
    localStorage.setItem('devEmail', devEmailInput);
    login();
  };

  const handleSSOClick = () => {
    if (isBypass) {
      setShowEmailPrompt(true);
    } else {
      login();
    }
  };
  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 w-full max-w-4xl mx-auto">
      <h1 style={{ color: 'var(--primary-text-color)' }} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
        Every Employee Has a Story.
      </h1>
      <h2 style={{ color: 'var(--primary-color)' }} className="text-2xl md:text-3xl font-semibold mb-6">
        Preserve It. Discover It.
      </h2>
      <p style={{ color: 'var(--grey-font-color)' }} className="text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
        Our platform empowers you to document your unique journeys, share your achievements, outline your challenges, and highlight your learnings. Join us to make your experiences part of our organization's shared knowledge.
      </p>
      {showEmailPrompt ? (
        <div className="flex flex-col items-center gap-4 bg-[var(--primary-white-color)] p-6 rounded-lg border border-[var(--light-grey-font-color)] shadow-sm">
          <p className="font-semibold text-lg" style={{ color: 'var(--primary-text-color)' }}>Enter Mock Email (Bypass Mode)</p>
          <input 
            type="email"
            value={devEmailInput}
            onChange={(e) => setDevEmailInput(e.target.value)}
            placeholder="e.g., hr@tricon.com"
            className="p-3 border border-[var(--light-grey-font-color)] rounded-md w-72 outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          />
          <button onClick={handleDevLogin} style={{ backgroundColor: 'var(--primary-color)', color: 'var(--primary-white-color)' }} className="rt-BaseButton px-8 py-3 rounded-md font-bold shadow-sm">
            Login
          </button>
        </div>
      ) : (
        <button onClick={handleSSOClick} style={{ backgroundColor: 'var(--primary-color)', color: 'var(--primary-white-color)' }} className="rt-BaseButton cursor-pointer hover:opacity-90 transition-opacity text-base px-8 py-3 h-auto rounded-md shadow-sm border-none">
          Continue with SSO
        </button>
      )}
    </section>
  )
}

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ backgroundColor: 'var(--primary-white-color)', borderColor: 'var(--light-grey-font-color)' }} className="py-6 px-6 text-center border-t w-full shrink-0">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div style={{ color: 'var(--primary-text-color)' }} className="font-semibold text-base mb-2 md:mb-0">
          Employee Story Platform
        </div>
        <div style={{ color: 'var(--grey-font-color)' }} className="text-sm">
          &copy; {currentYear} All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <LandingNavbar />
      <HeroSection />
      <Footer />
    </div>
  )
}
