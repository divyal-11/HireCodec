'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Code2, Mail, Lock, User, Eye, EyeOff, Github, Building2, ArrowRight, Check } from 'lucide-react';

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

function Tilt3DCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', orgName: '', role: 'CANDIDATE' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'Registration failed');
        setLoading(false);
        return;
      }
      
      // Auto-login after successful registration
      await signIn('credentials', {
        email: form.email,
        password: form.password,
        callbackUrl: '/dashboard'
      });
      
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleGithubSignup = async () => {
    await signIn('github', { callbackUrl: '/dashboard' });
  };

  const passwordStrength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2
    : 3;

  const strengthColors = ['bg-white/10', 'bg-red-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060910] p-6 relative overflow-hidden">
      {/* Orbs */}
      <div className="orb orb-primary w-[500px] h-[500px] -top-40 right-0" />
      <div className="orb orb-accent w-[400px] h-[400px] bottom-0 -left-40" style={{ animationDelay: '-7s' }} />
      <div className="orb orb-purple w-[350px] h-[350px] top-1/3 left-1/2" style={{ animationDelay: '-12s' }} />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #22D3EE)' }}
            animate={{ boxShadow: ['0 0 30px rgba(99,102,241,0.3)', '0 0 60px rgba(99,102,241,0.5)', '0 0 30px rgba(99,102,241,0.3)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Code2 className="w-9 h-9 text-white" />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-white">Create your account</h1>
          <p className="text-white/40 text-sm mt-1">Start conducting better technical interviews today</p>
        </div>

        <Tilt3DCard className="glass-card p-8 relative overflow-hidden">
          {/* Shimmer */}
          <div className="absolute inset-0 rounded-[inherit] opacity-30 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(99,102,241,0.1) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 4s linear infinite',
            }}
          />

          <div className="relative z-10">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step >= s
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                      : 'bg-white/5 text-white/30 border border-white/10'
                  }`}>
                    {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                  </div>
                  {s < 2 && (
                    <div className={`w-12 h-0.5 rounded-full transition-all duration-500 ${step > 1 ? 'bg-brand-primary' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
              <span className="text-xs text-white/30 ml-2">
                {step === 1 ? 'Account Details' : 'Security'}
              </span>
            </div>

            {/* OAuth */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 mb-6"
              >
                <button onClick={handleGoogleSignup} className="btn-oauth btn-oauth-google w-full">
                  <GoogleIcon className="w-5 h-5" />
                  <span>Sign up with Google</span>
                </button>
                <button onClick={handleGithubSignup} className="btn-oauth btn-oauth-github w-full">
                  <Github className="w-5 h-5" />
                  <span>Sign up with GitHub</span>
                </button>
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-white/30 font-medium uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-white/50 mb-2 block uppercase tracking-wider">I am a</label>
                      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-dark w-full text-sm appearance-none bg-editor-bg border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-brand-primary/50 transition-colors cursor-pointer">
                        <option value="CANDIDATE">Candidate</option>
                        <option value="INTERVIEWER">Interviewer</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-white/50 mb-2 block uppercase tracking-wider">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-brand-primary transition-colors" />
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="input-dark pl-11 w-full bg-editor-bg border border-white/10 rounded-xl py-2.5 outline-none focus:border-brand-primary/50 transition-colors" required />
                      </div>
                    </div>
                  </div>
                  {form.role === 'INTERVIEWER' && (
                    <div>
                      <label className="text-xs font-semibold text-white/50 mb-2 block uppercase tracking-wider">Organization (Optional)</label>
                      <div className="relative group">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-brand-primary transition-colors" />
                        <input type="text" value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })} placeholder="Acme Corp" className="input-dark pl-11 w-full bg-editor-bg border border-white/10 rounded-xl py-2.5 outline-none focus:border-brand-primary/50 transition-colors" />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-semibold text-white/50 mb-2 block uppercase tracking-wider">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-brand-primary transition-colors" />
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="input-dark pl-11 w-full bg-editor-bg border border-white/10 rounded-xl py-2.5 outline-none focus:border-brand-primary/50 transition-colors" required />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs font-semibold text-white/50 mb-2 block uppercase tracking-wider">Create Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 group-focus-within:text-brand-primary transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Min 8 characters"
                        className="input-dark pl-11 pr-11 w-full bg-editor-bg border border-white/10 rounded-xl py-2.5 outline-none focus:border-brand-primary/50 transition-colors"
                        required minLength={8}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Strength meter */}
                    <div className="flex gap-1.5 mt-2">
                      {[1, 2, 3].map((level) => (
                        <div key={level} className={`h-1 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= level ? strengthColors[passwordStrength] : 'bg-white/10'}`} />
                      ))}
                    </div>
                    {passwordStrength > 0 && (
                      <p className={`text-[10px] mt-1 ${passwordStrength === 1 ? 'text-red-400' : passwordStrength === 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {strengthLabels[passwordStrength]}
                      </p>
                    )}
                  </div>

                  <label className="flex items-start gap-3 text-xs text-white/40 cursor-pointer group p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                    <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-white/5" required />
                    <span>I agree to the <a href="#" className="text-brand-primary">Terms of Service</a> and <a href="#" className="text-brand-primary">Privacy Policy</a></span>
                  </label>
                </motion.div>
              )}

              <div className="flex gap-3 pt-2">
                {step === 2 && (
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary py-3 px-6 text-sm">
                    Back
                  </button>
                )}
                <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 text-sm">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : step === 1 ? (
                    <>Continue <ArrowRight className="w-4 h-4" /></>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-white/30 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-primary hover:text-brand-primary-light font-semibold">Sign in</Link>
            </p>
          </div>
        </Tilt3DCard>
      </motion.div>
    </div>
  );
}
