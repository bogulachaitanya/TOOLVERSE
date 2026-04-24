import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundVideo } from './BackgroundVideo';
import { Mail, Lock, LogIn, UserPlus, ChevronRight, Binary, ShieldCheck, Fingerprint } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      setIsSending(true);
      setError(null);
      try {
        // Optional: still try to sign in with OTP in background to ensure user exists in Supabase
        // but don't wait for verification
        supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: true },
        }).catch(err => console.warn('Background Auth info:', err));
        
        // Immediate entry as requested
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', 'EXPLORER');
        onLogin();
      } catch (err: any) {
        setError(err.message || 'Failed to initiate login');
      } finally {
        setIsSending(false);
      }
    } else {
      setIsLogin(true);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    setError(null);
    setIsSending(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: enteredOtp,
        type: 'email',
      });

      if (error) throw error;

      if (data.session) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', email.split('@')[0]); // Use email prefix as default name
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setIsSending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col relative overflow-x-hidden font-sans">
      <BackgroundVideo />
      
      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-[20px] md:px-[120px] py-[20px] w-full">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" className="w-8 h-8 transform -rotate-12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="url(#eagle-grad-login)" />
            <path d="M12 2L10 10L12 12L14 10L12 2Z" fill="#004e92" opacity="0.6" />
            <defs>
              <linearGradient id="eagle-grad-login" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00cfff" />
                <stop offset="1" stopColor="#004e92" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-white font-extrabold text-2xl tracking-tighter" style={{ fontFamily: 'Courier New, Courier, monospace' }}>TOOLVERSE</span>
        </div>
      </nav>

      {/* Top Branding Section */}
      <header className="relative z-50 pt-10 md:pt-14 flex flex-col items-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-[48px] md:text-[80px] font-bold leading-tight tracking-tighter"
          style={{
            background: 'linear-gradient(144.5deg, #FFFFFF 28%, rgba(255, 255, 255, 0.4) 115%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Times New Roman, Times, serif'
          }}
        >
          TOOLVERSE
        </motion.h1>

        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3, duration: 0.8 }}
           className="mt-2"
        >
          <span className="text-[14px] md:text-xl font-medium tracking-wide text-white/50 lowercase">
            Discover. Bookmark. Build. Repeat.
          </span>
        </motion.div>
      </header>

      {/* Main Content Sections */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-30 w-full max-w-[1400px] mx-auto pb-10">
        {/* Login Container */}
        <div className="w-full max-w-md pt-5">
          {/* Login Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="w-full"
          >
            <div className="glass p-10 rounded-[40px] relative group backdrop-blur-[32px] overflow-hidden shadow-2xl">
              {/* Animated Border/Glow */}
              <div className="absolute inset-0 rounded-[40px] p-[1.5px] bg-gradient-to-br from-white/20 via-white/5 to-white/20 opacity-50" style={{ maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />
              
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {step === 'email' ? (
                    <motion.div
                      key="email-step"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div className="flex bg-white/5 p-1.5 rounded-2xl mb-10 border border-white/5">
                        <button
                          onClick={() => setIsLogin(true)}
                          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isLogin ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'text-white/40 hover:text-white/60'}`}
                        >
                          Login
                        </button>
                        <button
                          onClick={() => setIsLogin(false)}
                          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${!isLogin ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'text-white/40 hover:text-white/60'}`}
                        >
                          Sign Up
                        </button>
                      </div>

                      <form onSubmit={handleEmailSubmit} className="space-y-6 text-left">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Identity</label>
                          <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within/input:text-electric-blue transition-colors" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="username@toolverse.ai"
                              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-electric-blue/50 focus:bg-white/[0.05] transition-all duration-300 placeholder:text-white/20"
                            />
                          </div>
                        </div>

                        {(!isLogin) && (
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Access Key</label>
                            <div className="relative group/input">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within/input:text-violet transition-colors" />
                              <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-violet/50 focus:bg-white/[0.05] transition-all duration-300 placeholder:text-white/20"
                              />
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSending}
                          className="w-full sleek-btn py-4 rounded-2xl font-bold text-sm mt-8 flex items-center justify-center gap-2 group transition-all duration-500 overflow-hidden relative disabled:opacity-50"
                        >
                          <span className="relative z-10">
                            {isSending ? (
                              <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Connecting...
                              </span>
                            ) : (
                              isLogin ? 'Enter Workspace' : 'Join ToolVerse'
                            )}
                          </span>
                          {!isSending && <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />}
                          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="otp-step"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-center"
                    >
                      <div className="mb-8">
                        <div className="w-12 h-12 rounded-full bg-electric-blue/10 flex items-center justify-center mx-auto mb-4">
                          <ShieldCheck className="w-6 h-6 text-electric-blue" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Verify Identity</h3>
                        <p className="text-white/40 text-sm">We've sent a 6-digit code to <br /><span className="text-white/80 font-medium">{email}</span></p>
                      </div>

                      {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold">
                          {error}
                        </div>
                      )}

                      <form onSubmit={handleOtpSubmit} className="space-y-8">
                        <div className="flex justify-center gap-4">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              id={`otp-${index}`}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              className="w-14 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-bold text-white focus:outline-none focus:border-electric-blue transition-all"
                            />
                          ))}
                        </div>

                        <div className="space-y-4">
                          <button
                            type="submit"
                            disabled={isSending}
                            className="w-full sleek-btn py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 group disabled:opacity-50"
                          >
                            {isSending ? 'Verifying...' : 'Verify & Initialize'}
                            {!isSending && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setStep('email')}
                            className="text-white/40 text-xs hover:text-white transition-colors uppercase tracking-[0.2em] font-bold"
                          >
                            Use Different Email
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-8 flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-white/10" />
                  <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Secure Connect</span>
                  <div className="h-[1px] flex-1 bg-white/10" />
                </div>

                <div className="mt-8">
                  <button
                    onClick={onLogin}
                    className="w-full bg-white/[0.02] border border-white/10 py-4 rounded-2xl font-semibold text-sm hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3 group"
                  >
                    <div className="bg-white p-1 rounded-sm group-hover:scale-110 transition-transform">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    </div>
                    <span>Continue with Google</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
