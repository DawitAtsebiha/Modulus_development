"use client";

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login'|'signup'>('login');
  const [currentStep, setCurrentStep] = useState(1);
  const [showVerification, setShowVerification] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [signupPasswordVisible, setSignupPasswordVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [loginData, setLoginData] = useState({ email: '', password: '', remember: false });
  const [signupData, setSignupData] = useState({
    email: '', password: '', firstName: '', lastName: '', dateOfBirth: '',
    schoolStatus: '', uniAffiliation: '', terms: false
  });

  useEffect(() => {
    const pwInput = document.getElementById('signup-password');
    const handler = () => updatePasswordStrength();
    pwInput?.addEventListener('input', handler);
    return () => pwInput?.removeEventListener('input', handler);
  }, [currentStep]);

  const updatePasswordStrength = () => {
    const pwd = (document.getElementById('signup-password') as HTMLInputElement)?.value || '';
    const segments = document.querySelectorAll('.strength-segment');
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    segments.forEach((seg, i) => {
      seg.classList.remove('weak','medium','strong');
      if (i < strength) seg.classList.add(strength <=2 ? 'weak' : strength===3 ? 'medium' : 'strong');
    });
  };

  const handleTabChange = (tab: 'login'|'signup') => {
    setActiveTab(tab);
    setCurrentStep(1);
    setShowVerification(false);
    setError(null);
  };

  const handleNextStep = () => setCurrentStep(prev => Math.min(prev+1, 3));
  const handlePrevStep = () => setCurrentStep(prev => Math.max(prev-1, 1));

  const getProgressWidth = () => `${(currentStep / 3) * 100}%`;
  const getStepClass = (step: number) => {
    if (currentStep > step) return 'step completed';
    if (currentStep === step) return 'step active';
    return 'step';
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/login', {
        method: 'POST', headers: {'Content-Type':'application/json'}, credentials: 'include',
        body: JSON.stringify({ email: loginData.email, password: loginData.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      window.location.href = '/courses';
    } catch(err: any) {
      setError(err.message);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // The rewrite in next.config.ts proxies this to http://localhost:3000/api/signup
      const res = await fetch('/api/signup', {
        method: 'POST', headers: {'Content-Type':'application/json'}, credentials: 'include',
        body: JSON.stringify(signupData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      setShowVerification(true);
    } catch(err: any) {
      setError(err.message);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST', headers: {'Content-Type':'application/json'}, credentials: 'include',
        body: JSON.stringify({ email: signupData.email, code: verificationCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setShowSuccess(true);
      setTimeout(() => window.location.href = '/courses', 2000);
    } catch(err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>Modulus - Engineering Education Platform</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/visuals/SVGs/mod-logo.svg" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        :root {
          --primary: #aa1aa3;
          --primary-dark: #801596;
          --secondary: #64748b;
          --success: #10b981;
          --danger: #ef4444;
          --warning: #f59e0b;
          --dark: #0f172a;
          --light: #f8fafc;
          --gray-100: #f1f5f9;
          --gray-200: #e2e8f0;
          --gray-300: #cbd5e1;
          --gray-400: #94a3b8;
          --gray-500: #64748b;
          --gray-600: #475569;
          --gray-700: #334155;
          --gray-800: #1e293b;
          --gray-900: #0f172a;
          --border-radius: 8px;
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Inter", sans-serif;
          background-color: var(--light);
          color: var(--dark);
          line-height: 1.5;
          min-height: 100vh;
        }

        .container {
          display: flex;
          min-height: 100vh;
        }

        .form-container {
          flex: 0 0 600px;
          max-width: 600px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .info-container {
            flex: 1;
          min-width: 88rem;
          background:  
                      url('/visuals/PNGs/loginbackground.png') no-repeat center center;
          background-size: cover;
          background-attachment: fixed;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .info-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="none" width="100" height="100"/><path d="M0,0 L100,100 M20,0 L100,80 M40,0 L100,60 M60,0 L100,40 M80,0 L100,20 M0,20 L80,100 M0,40 L60,100 M0,60 L40,100 M0,80 L20,100" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></svg>');
          opacity: 0.5;
        }

        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .tabs {
          display: flex;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--gray-200);
        }

        .tab {
          flex: 1;
          background: none;
          border: none;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 500;
          color: var(--gray-500);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .tab.active {
          color: var(--primary);
        }

        .tab.active::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--primary);
        }

        .form-wrapper {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .form {
          display: none;
          flex: 1;
        }

        .form.active {
          display: flex;
          flex-direction: column;
        }

        .form-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--gray-900);
        }

        .subtitle {
          color: var(--gray-500);
        }

        .progress-container {
          margin-bottom: 2rem;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background-color: var(--gray-200);
          border-radius: 2px;
          margin-bottom: 1rem;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background-color: var(--primary);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--gray-400);
          transition: color 0.3s ease;
        }

        .step.active {
          color: var(--primary);
        }

        .step.completed {
          color: var(--success);
        }

        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--gray-200);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background-color: var(--primary);
          color: white;
        }

        .step.completed .step-number {
          background-color: var(--success);
          color: white;
        }

        .step span {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .signup-step {
          display: none;
          flex: 1;
          flex-direction: column;
        }

        .signup-step.active {
          display: flex;
        }

        .social-logins {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.625rem;
          border-radius: var(--border-radius);
          border: 1px solid var(--gray-300);
          background-color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .social-btn:hover {
          background-color: var(--gray-100);
        }

        .social-btn i {
          margin-right: 0.5rem;
          font-size: 1rem;
        }

        .social-btn.google i {
          color: #db4437;
        }

        .social-btn.apple i {
          color: #000000;
        }

        .social-btn.facebook i {
          color: #4267b2;
        }

        .social-btn.linkedin i {
          color: #0077b5;
        }

        .social-btn.full-width {
          grid-column: span 2;
          justify-self: center;
          width: 100%;
          max-width: 300px;
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
          color: var(--gray-400);
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background-color: var(--gray-200);
        }

        .divider span {
          padding: 0 1rem;
          font-size: 0.875rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--gray-700);
        }

        input,
        select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--gray-300);
          border-radius: var(--border-radius);
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-hint {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.75rem;
          color: var(--gray-500);
        }

        .password-input {
          position: relative;
        }

        .toggle-password {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--gray-400);
          cursor: pointer;
        }

        .password-strength {
          margin-top: 0.5rem;
        }

        .strength-meter {
          display: flex;
          gap: 4px;
          margin-bottom: 0.25rem;
        }

        .strength-segment {
          height: 4px;
          flex: 1;
          background-color: var(--gray-200);
          border-radius: 2px;
        }

        .strength-segment.weak {
          background-color: var(--danger);
        }

        .strength-segment.medium {
          background-color: var(--warning);
        }

        .strength-segment.strong {
          background-color: var(--success);
        }

        .strength-text {
          font-size: 0.75rem;
          color: var(--gray-500);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .remember-me {
          display: flex;
          align-items: center;
        }

        .remember-me input {
          width: auto;
          margin-right: 0.5rem;
        }

        .forgot-password {
          color: var(--primary);
          text-decoration: none;
          font-size: 0.875rem;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .terms {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .terms input {
          width: auto;
          margin-right: 0.5rem;
          margin-top: 0.25rem;
        }

        .terms a {
          color: var(--primary);
          text-decoration: none;
        }

        .terms a:hover {
          text-decoration: underline;
        }

        .step-navigation {
          display: flex;
          gap: 1rem;
          margin-top: auto;
        }

        .back-btn,
        .next-btn,
        .submit-btn {
          flex: 1;
          padding: 0.25rem;
          border: none;
          border-radius: var(--border-radius);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-btn {
          background-color: var(--gray-100);
          color: var(--gray-700);
        }

        .back-btn:hover {
          background-color: var(--gray-200);
        }

        .next-btn,
        .submit-btn {
          background-color: var(--primary);
          color: white;
        }

        .next-btn:hover,
        .submit-btn:hover {
          background-color: var(--primary-dark);
        }

        .info-content {
          max-width: 300px;
          position: relative;
          z-index: 1;
        }

        .info-content h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .info-content p {
          margin-bottom: 1.5rem;
          font-size: 1rem;
          opacity: 0.9;
        }

        .features {
          display: grid;
          gap: 1rem;
        }

        .feature {
          display: flex;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: var(--border-radius);
          backdrop-filter: blur(10px);
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.75rem;
          flex-shrink: 0;
        }

        .feature-icon i {
          font-size: 1rem;
        }

        .feature-text h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .feature-text p {
          margin-bottom: 0;
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .success-gif {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          z-index: 9999;
        }

        .hidden {
          display: none !important;
        }

        @media (max-width: 992px) {
          .container {
            flex-direction: column;
          }

          .form-container {
            max-width: 100%;
            order: 2;
          }

          .info-container {
            min-height: 200px;
            order: 1;
          }

          .social-logins {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .form-container {
            padding: 1.5rem;
          }

          .info-container {
            padding: 1.5rem;
          }

          .step-navigation {
            flex-direction: column;
          }

          .progress-steps {
            flex-direction: column;
            gap: 0.5rem;
          }

          .step {
            flex-direction: row;
            gap: 0.5rem;
          }

          .step-number {
            margin-bottom: 0;
          }
        }
      `}</style>

      {/* Success Animation */}
      {showSuccess && (
        <Image
          src="/visuals/GIFs/mod-logo-animation.gif"
          alt="Success animation"
          fill
          className="success-gif"
          priority
        />
      )}

      <div className="container">
        <div className="form-container">
          <div className="logo-container">
            <Image 
              src="/visuals/SVGs/moduluswithlogo.svg" 
              alt="Modulus Logo" 
              width={150}
              height={40}
              className="logo"
            />
          </div>

          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => handleTabChange('login')}
            >
              Log In
            </button>
            <button 
              className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => handleTabChange('signup')}
            >
              Sign Up
            </button>
          </div>

          <div className="form-wrapper">
            {/* Login Form */}
            <form 
              className={`form ${activeTab === 'login' ? 'active' : ''}`}
              onSubmit={handleLoginSubmit}
            >
              <div className="form-header">
                <h1>Welcome back</h1>
                <p className="subtitle">Continue your engineering education journey</p>
              </div>

              <div className="social-logins">
                <button type="button" className="social-btn google">
                  <i className="fab fa-google"></i>
                  <span>Continue with Google</span>
                </button>
                <button type="button" className="social-btn apple">
                  <i className="fab fa-apple"></i>
                  <span>Continue with Apple</span>
                </button>
                <button type="button" className="social-btn linkedin full-width">
                  <i className="fab fa-linkedin-in"></i>
                  <span>Continue with LinkedIn</span>
                </button>
              </div>

              <div className="divider">
                <span>or</span>
              </div>

              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input
                  type="email"
                  id="login-email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <div className="password-input">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="login-password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    <i className={`far ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input 
                    type="checkbox" 
                    id="remember"
                    checked={loginData.remember}
                    onChange={(e) => setLoginData({...loginData, remember: e.target.checked})}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>

              <button type="submit" className="submit-btn">Log In</button>
            </form>

            {/* Signup Form */}
            <form 
              className={`form ${activeTab === 'signup' ? 'active' : ''}`}
              onSubmit={handleSignupSubmit}
            >
              {/* Progress Indicator */}
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: getProgressWidth() }}
                  ></div>
                </div>
                <div className="progress-steps">
                  <div className={getStepClass(1)}>
                    <div className="step-number">1</div>
                    <span>Account</span>
                  </div>
                  <div className={getStepClass(2)}>
                    <div className="step-number">2</div>
                    <span>Personal</span>
                  </div>
                  <div className={getStepClass(3)}>
                    <div className="step-number">3</div>
                    <span>Education</span>
                  </div>
                </div>
              </div>
                
              <div className={`signup-step ${currentStep === 1 ? 'active' : ''}`}>
                <div className="form-header">
                  <h1>Join Modulus</h1>
                  <p className="subtitle">Start your engineering education journey</p>
                </div>

                <div className="social-logins">
                  <button type="button" className="social-btn google">
                    <i className="fab fa-google"></i>
                    <span>Sign up with Google</span>
                  </button>
                  <button type="button" className="social-btn apple">
                    <i className="fab fa-apple"></i>
                    <span>Sign up with Apple</span>
                  </button>
                  <button type="button" className="social-btn facebook">
                    <i className="fab fa-facebook-f"></i>
                    <span>Sign up with Facebook</span>
                  </button>
                  <button type="button" className="social-btn linkedin">
                    <i className="fab fa-linkedin-in"></i>
                    <span>Sign up with LinkedIn</span>
                  </button>
                </div>

                <div className="divider">
                  <span>or</span>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-email">Email</label>
                  <input
                    type="email"
                    id="signup-email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <div className="password-input">
                    <input
                      type={signupPasswordVisible ? "text" : "password"}
                      id="signup-password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      required
                    />
                    <button 
                      type="button" 
                      className="toggle-password"
                      onClick={() => setSignupPasswordVisible(!signupPasswordVisible)}
                    >
                      <i className={`far ${signupPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  <div className="password-strength">
                    <div className="strength-meter">
                      <div className="strength-segment"></div>
                      <div className="strength-segment"></div>
                      <div className="strength-segment"></div>
                      <div className="strength-segment"></div>
                    </div>
                    <span className="strength-text">Password strength</span>
                  </div>
                </div>

                <button type="button" className="next-btn" onClick={handleNextStep}>
                  Next
                </button>
              </div>

              <div className={`signup-step ${currentStep === 2 ? 'active' : ''}`}>
                <div className="form-header">
                  <h1>Personal Information</h1>
                  <p className="subtitle">Tell us a bit about yourself</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="John"
                      value={signupData.firstName}
                      onChange={(e) => setSignupData({...signupData, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      placeholder="Doe"
                      value={signupData.lastName}
                      onChange={(e) => setSignupData({...signupData, lastName: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input 
                    type="date" 
                    id="dateOfBirth"
                    min="1950-01-01"
                    max="2010-12-31"
                    value={signupData.dateOfBirth}
                    onChange={(e) => setSignupData({...signupData, dateOfBirth: e.target.value})}
                    required 
                  />
                </div>

                <div className="step-navigation">
                  <button type="button" className="back-btn" onClick={handlePrevStep}>
                    Back
                  </button>
                  <button type="button" className="next-btn" onClick={handleNextStep}>
                    Next
                  </button>
                </div>
              </div>

              
              <div className={`signup-step ${currentStep === 3 ? 'active' : ''}`}>
                
                <div className="form-header">
                  <h1>Education Status</h1>
                  <p className="subtitle">Help us personalize your experience</p>
                </div>

                <div className="form-group">
                  <label htmlFor="schoolStatus">Current Status</label>
                  <select 
                    id="schoolStatus"
                    value={signupData.schoolStatus}
                    onChange={(e) => setSignupData({...signupData, schoolStatus: e.target.value})}
                    required
                  >
                    <option value="" disabled>
                      Select your current status
                    </option>
                    <option value="Secondary">
                      Secondary School (High School)
                    </option>
                    <option value="Post-Secondary">
                      Post-Secondary (University/College)
                    </option>
                    <option value="Out of School">Out of School</option>
                  </select>
                </div>

                <div
                  className="form-group"
                  id="uni-affiliation-group"
                  style={{ display: signupData.schoolStatus === 'Post-Secondary' ? 'block' : 'none' }}
                >
                  <label htmlFor="uniAffiliation">University/College</label>
                  <input
                    type="text"
                    id="uniAffiliation"
                    placeholder="e.g., University of Toronto"
                    value={signupData.uniAffiliation}
                    onChange={(e) => setSignupData({...signupData, uniAffiliation: e.target.value})}
                  />
                  <small className="form-hint">Leave blank if not applicable</small>
                </div>

                <div className="terms">
                  <input 
                    type="checkbox" 
                    id="terms"
                    checked={signupData.terms}
                    onChange={(e) => setSignupData({...signupData, terms: e.target.checked})}
                    required 
                  />
                  <label htmlFor="terms">
                    I agree to the <a href="#">Terms of Service</a> and{' '}
                    <a href="#">Privacy Policy</a>
                  </label>
                </div>

                <div className="step-navigation">
                  <button type="button" className="back-btn" onClick={handlePrevStep}>
                    Back
                  </button>
                  <button type="submit" className="submit-btn">
                    Create Account
                  </button>
                </div>
              </div>
            </form>

            {/* Verification Form */}
            <form 
              className={`form ${showVerification ? 'active' : ''}`}
              onSubmit={handleVerificationSubmit}
              style={{ display: showVerification ? 'flex' : 'none' }}
            >
              <div className="form-header">
                <h1>Email Verification</h1>
                <p className="subtitle">Enter the 6-digit code sent to your email.</p>
              </div>

              <div className="form-group">
                <label htmlFor="verification-code">Verification Code</label>
                <input
                  type="text"
                  id="verification-code"
                  maxLength={6}
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="submit-btn">Verify Email</button>
            </form>
          </div>
        </div>

        <div className="info-container ">
                        
          <div className="info-content">
            <h2>Elevate Your Engineering Education</h2>
            <p>Interactive learning tools designed for transitioning students.</p>
            <div className="features">
              <div className="feature">
                <div className="feature-icon">
                  <i className="fas fa-calculator"></i>
                </div>
                <div className="feature-text">
                  <h3>Interactive Tools</h3>
                  <p>Visualize complex concepts</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="feature-text">
                  <h3>Track Progress</h3>
                  <p>Monitor your journey</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="feature-text">
                  <h3>Community</h3>
                  <p>Connect with peers</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}