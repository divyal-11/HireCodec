'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Code2, Mail, Lock, Eye, EyeOff, Github, Sparkles, Zap, Shield, Globe } from 'lucide-react';

/* ── Google icon (real SVG) ──────────────────────── */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/* ── 3D Tilt Card ──────────────────────────────── */
function Tilt3DCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Floating 3D particles ─────────────────────── */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-brand-primary/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 50, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1 + Math.random(), 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ── Main Login Page ───────────────────────────── */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleGithubLogin = async () => {
    setGithubLoading(true);
    await signIn('github', { callbackUrl: '/dashboard' });
  };

  const features = [
    { icon: Zap, label: 'Sub-100ms', desc: 'Real-time code sync', color: 'from-yellow-400 to-orange-500' },
    { icon: Globe, label: '6 Languages', desc: 'Full polyglot support', color: 'from-blue-400 to-cyan-500' },
    { icon: Shield, label: 'Sandboxed', desc: 'Docker isolation', color: 'from-green-400 to-emerald-500' },
    { icon: Sparkles, label: 'AI Hints', desc: 'Smart assistance', color: 'from-purple-400 to-pink-500' },
  ];

  return (
    <div className="min-h-screen flex bg-[#060910] relative overflow-hidden">
      {/* Background effects */}
      <div className="orb orb-primary w-[600px] h-[600px] -top-40 -left-40" />
      <div className="orb orb-accent w-[500px] h-[500px] bottom-0 right-0" style={{ animationDelay: '-10s' }} />
      <div className="orb orb-purple w-[400px] h-[400px] top-1/2 left-1/3" style={{ animationDelay: '-5s' }} />
      <FloatingParticles />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Left Panel — 3D Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative">
        <div className="relative z-10 flex flex-col justify-center px-20 w-full">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Logo */}
            <div className="flex items-center gap-4 mb-12">
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #22D3EE)',
                }}
                animate={{ boxShadow: ['0 0 30px rgba(99,102,241,0.3)', '0 0 60px rgba(99,102,241,0.5)', '0 0 30px rgba(99,102,241,0.3)'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Code2 className="w-9 h-9 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Hire<span className="gradient-text-brand">Codec</span>
                </h1>
                <p className="text-sm text-white/40 font-medium">Technical Interview Platform</p>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-5xl font-extrabold text-white mb-6 leading-[1.15] tracking-tight">
              Conduct technical<br />
              interviews that<br />
              <span className="gradient-text">actually work.</span>
            </h2>

            <p className="text-white/45 text-base max-w-lg leading-relaxed mb-12">
              Real-time collaborative code editing, Docker-sandboxed execution,
              video calls, and AI-powered hints — all in one premium platform.
            </p>

            {/* 3D Feature cards */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feat, i) => (
                <motion.div
                  key={feat.label}
                  initial={{ opacity: 0, y: 20, rotateX: -10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Tilt3DCard className="p-4 rounded-xl glass-card cursor-default group">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feat.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-bold text-white">{feat.label}</p>
                    <p className="text-xs text-white/40 mt-0.5">{feat.desc}</p>
                  </Tilt3DCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — 3D Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <Tilt3DCard className="glass-card p-8 relative overflow-hidden">
            {/* Shimmer border */}
            <div className="absolute inset-0 rounded-[inherit] opacity-40 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(99,102,241,0.1) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 4s linear infinite',
              }}
            />

            <div className="relative z-10">
              {/* Mobile logo */}
              <div className="flex items-center gap-3 mb-6 lg:hidden">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366F1, #22D3EE)' }}>
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-extrabold text-white">
                  Hire<span className="gradient-text-brand">Codec</span>
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-white mb-1">Welcome back</h2>
              <p className="text-white/40 text-sm mb-4">Sign in to your account to continue</p>

              {error && (
                <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Google OAuth — Primary */}
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="btn-oauth btn-oauth-google w-full mb-3 group"
              >
                {googleLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <GoogleIcon className="w-5 h-5" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* GitHub OAuth */}
              <button
                onClick={handleGithubLogin}
                disabled={githubLoading}
                className="btn-oauth btn-oauth-github w-full group"
              >
                {githubLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Github className="w-5 h-5" />
                    <span>Continue with GitHub</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/30 font-medium uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Email form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-white/50 mb-2 block uppercase tracking-wider">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-brand-primary transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="input-dark pl-11"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/50 mb-2 block uppercase tracking-wider">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-brand-primary transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-dark pl-11 pr-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-white/40 cursor-pointer group">
                    <div className="w-4 h-4 rounded border border-white/15 bg-white/5 group-hover:border-brand-primary/50 transition-colors flex items-center justify-center">
                      <input type="checkbox" className="sr-only peer" />
                    </div>
                    Remember me
                  </label>
                  <a href="#" className="text-xs text-brand-primary hover:text-brand-primary-light transition-colors font-medium">
                    Forgot password?
                  </a>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm mt-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-white/30 mt-6">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-brand-primary hover:text-brand-primary-light transition-colors font-semibold">
                  Sign up free
                </Link>
              </p>
            </div>
          </Tilt3DCard>
        </motion.div>
      </div>
    </div>
  );
}
