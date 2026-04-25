'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  User, Mail, Building2, Camera, Bell, Shield, Key,
  Globe, Moon, Sun, Monitor, Palette, Save, Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme';

const TABS = [
  { id: 'profile',       label: 'Profile',       icon: User    },
  { id: 'notifications', label: 'Notifications', icon: Bell    },
  { id: 'security',      label: 'Security',      icon: Shield  },
  { id: 'appearance',    label: 'Appearance',    icon: Palette },
] as const;
type TabId = typeof TABS[number]['id'];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab]   = useState<TabId>('profile');
  const [saved,     setSaved]       = useState(false);
  const { theme, setTheme }         = useTheme();

  /* ── Profile ── */
  const [profile, setProfile] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    role: (session?.user as any)?.role || 'Interviewer',
    org: 'Acme Corp',
    bio: 'Senior engineering manager with 8+ years of experience building scalable systems.',
    timezone: 'Asia/Kolkata',
  });

  // Update state when session loads
  useEffect(() => {
    if (session?.user) {
      setProfile(p => ({
        ...p,
        name: session.user.name || '',
        email: session.user.email || '',
        role: (session.user as any)?.role || 'Interviewer'
      }));
    }
  }, [session]);

  /* ── Notifications ── */
  const [notif, setNotif] = useState({
    emailInterviews: true, emailResults: true, emailWeekly: false,
    pushReminders: true,   pushCandidateJoined: true, pushResults: false,
  });

  /* ── Appearance ── */
  const [uiTheme,    setUiTheme]    = useState<'light'|'dark'|'system'>(theme as 'light'|'dark');
  const [wordWrap,   setWordWrap]   = useState(true);
  const [minimap,    setMinimap]    = useState(false);
  const [fontSize,   setFontSize]   = useState('14px');
  const [tabSize,    setTabSize]    = useState('2 spaces');

  const handleThemeChange = (t: 'light'|'dark'|'system') => {
    setUiTheme(t);
    if (t === 'system') {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(dark ? 'dark' : 'light');
    } else {
      setTheme(t);
    }
  };

  const toggleNotif = (key: keyof typeof notif) =>
    setNotif(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  /* ── helpers ── */
  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className={cn('w-11 h-6 rounded-full transition-all duration-300 relative shrink-0', on ? 'bg-brand-primary' : 'bg-gray-200 dark:bg-editor-border')}>
      <span className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300', on ? 'translate-x-[22px]' : 'translate-x-0.5')} />
    </button>
  );

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-xs font-semibold text-dash-muted dark:text-editor-comment mb-2 block uppercase tracking-wider">{children}</label>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold text-dash-text dark:text-editor-text tracking-tight">Settings</h1>
        <p className="text-sm text-dash-muted dark:text-editor-comment mt-1">Manage your account preferences</p>
      </motion.div>

      <div className="flex gap-8">
        {/* ── Tab Sidebar ── */}
        <motion.nav initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} className="w-52 shrink-0 space-y-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn('w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-brand-primary/10 text-brand-primary'
                  : 'text-dash-muted dark:text-editor-comment hover:text-dash-text dark:hover:text-editor-text hover:bg-gray-100 dark:hover:bg-editor-surface'
              )}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </motion.nav>

        {/* ── Content ── */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex-1 min-w-0 space-y-6">

          {/* ════ PROFILE ════ */}
          {activeTab === 'profile' && (
            <div className="card p-6">
              <h2 className="text-sm font-bold text-dash-text dark:text-editor-text uppercase tracking-wider mb-5">Profile Information</h2>
              {/* Avatar */}
              <div className="flex items-center gap-5 mb-6">
                <div className="relative group cursor-pointer">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">JD</span>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-dash-text dark:text-editor-text">{profile.name}</p>
                  <p className="text-xs text-dash-muted dark:text-editor-comment">{profile.role} · {profile.org}</p>
                  <button className="text-xs text-brand-primary font-medium mt-1 hover:underline">Change avatar</button>
                </div>
              </div>
              {/* Fields */}
              <div className="grid grid-cols-2 gap-4">
                {([
                  { label: 'Full Name', key: 'name', type: 'text', icon: User },
                  { label: 'Email',     key: 'email', type: 'email', icon: Mail },
                  { label: 'Organization', key: 'org', type: 'text', icon: Building2 },
                ] as const).map(f => (
                  <div key={f.key}>
                    <Label>{f.label}</Label>
                    <div className="relative">
                      <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dash-muted dark:text-editor-comment" />
                      <input type={f.type} value={(profile as any)[f.key]} onChange={e => setProfile({ ...profile, [f.key]: e.target.value })} className="input pl-11" />
                    </div>
                  </div>
                ))}
                <div>
                  <Label>Timezone</Label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dash-muted dark:text-editor-comment" />
                    <select value={profile.timezone} onChange={e => setProfile({ ...profile, timezone: e.target.value })} className="input pl-11 appearance-none cursor-pointer">
                      <option>Asia/Kolkata (IST)</option>
                      <option>America/New York (EST)</option>
                      <option>America/Los Angeles (PST)</option>
                      <option>Europe/London (GMT)</option>
                      <option>Asia/Tokyo (JST)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Label>Bio</Label>
                <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} rows={3} className="input resize-none" />
              </div>
            </div>
          )}

          {/* ════ NOTIFICATIONS ════ */}
          {activeTab === 'notifications' && (<>
            <div className="card p-6">
              <h2 className="text-sm font-bold text-dash-text dark:text-editor-text uppercase tracking-wider mb-4">Email Notifications</h2>
              {([
                { key: 'emailInterviews', label: 'Interview reminders',  desc: 'Get notified 30 min before scheduled interviews' },
                { key: 'emailResults',    label: 'Interview results',    desc: 'Email when evaluations are completed' },
                { key: 'emailWeekly',     label: 'Weekly digest',        desc: 'Summary of activity and team performance' },
              ] as { key: keyof typeof notif; label: string; desc: string }[]).map(item => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-dash-border dark:border-editor-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-dash-text dark:text-editor-text">{item.label}</p>
                    <p className="text-xs text-dash-muted dark:text-editor-comment mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle on={notif[item.key]} onToggle={() => toggleNotif(item.key)} />
                </div>
              ))}
            </div>
            <div className="card p-6">
              <h2 className="text-sm font-bold text-dash-text dark:text-editor-text uppercase tracking-wider mb-4">Push Notifications</h2>
              {([
                { key: 'pushReminders',        label: 'Interview reminders',   desc: 'Browser notifications for upcoming interviews' },
                { key: 'pushCandidateJoined',  label: 'Candidate joined',      desc: 'Notify when candidate enters the room' },
                { key: 'pushResults',          label: 'Evaluation complete',   desc: 'Co-interviewers submitted evaluations' },
              ] as { key: keyof typeof notif; label: string; desc: string }[]).map(item => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-dash-border dark:border-editor-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-dash-text dark:text-editor-text">{item.label}</p>
                    <p className="text-xs text-dash-muted dark:text-editor-comment mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle on={notif[item.key]} onToggle={() => toggleNotif(item.key)} />
                </div>
              ))}
            </div>
          </>)}

          {/* ════ SECURITY ════ */}
          {activeTab === 'security' && (<>
            <div className="card p-6">
              <h2 className="text-sm font-bold text-dash-text dark:text-editor-text uppercase tracking-wider mb-5">Change Password</h2>
              <div className="space-y-4 max-w-md">
                {['Current Password','New Password','Confirm Password'].map(lbl => (
                  <div key={lbl}>
                    <Label>{lbl}</Label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dash-muted dark:text-editor-comment" />
                      <input type="password" placeholder="••••••••" className="input pl-11" />
                    </div>
                  </div>
                ))}
                <button className="btn-primary btn-md">Update Password</button>
              </div>
            </div>
            <div className="card p-6">
              <h2 className="text-sm font-bold text-dash-text dark:text-editor-text uppercase tracking-wider mb-4">Connected Accounts</h2>
              {[
                { name: 'Google', desc: 'john@gmail.com', connected: true },
                { name: 'GitHub', desc: 'Not connected',  connected: false },
              ].map(acc => (
                <div key={acc.name} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-editor-surface border border-dash-border dark:border-editor-border mb-3 last:mb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-editor-bg border border-dash-border dark:border-editor-border flex items-center justify-center font-bold text-sm text-dash-text dark:text-editor-text">{acc.name[0]}</div>
                    <div>
                      <p className="text-sm font-semibold text-dash-text dark:text-editor-text">{acc.name}</p>
                      <p className="text-xs text-dash-muted dark:text-editor-comment">{acc.desc}</p>
                    </div>
                  </div>
                  <button className={cn('text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors', acc.connected ? 'text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10' : 'text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20')}>
                    {acc.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
            <div className="card p-6 border-red-200 dark:border-red-500/30">
              <h2 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-2">Danger Zone</h2>
              <p className="text-xs text-dash-muted dark:text-editor-comment mb-4">Permanently delete your account and all associated data.</p>
              <button className="text-xs font-semibold px-4 py-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors">Delete Account</button>
            </div>
          </>)}

          {/* ════ APPEARANCE ════ */}
          {activeTab === 'appearance' && (<>
            <div className="card p-6">
              <h2 className="text-sm font-bold text-dash-text dark:text-editor-text uppercase tracking-wider mb-5">Theme</h2>
              <div className="grid grid-cols-3 gap-4">
                {([
                  { id: 'light',  label: 'Light',  icon: Sun,     preview: 'bg-white' },
                  { id: 'dark',   label: 'Dark',   icon: Moon,    preview: 'bg-gray-900' },
                  { id: 'system', label: 'System', icon: Monitor, preview: 'bg-gradient-to-r from-white to-gray-900' },
                ] as const).map(t => {
                  const active = uiTheme === t.id;
                  return (
                    <button key={t.id} onClick={() => handleThemeChange(t.id)}
                      className={cn('p-4 rounded-xl border-2 transition-all text-center',
                        active ? 'border-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10' : 'border-dash-border dark:border-editor-border hover:border-gray-300 dark:hover:border-editor-comment/40'
                      )}>
                      <div className={cn('w-full h-14 rounded-lg mb-3 border', t.preview, active ? 'border-brand-primary' : 'border-dash-border dark:border-editor-border')} />
                      <div className="flex items-center justify-center gap-1.5">
                        <t.icon className={cn('w-4 h-4', active ? 'text-brand-primary' : 'text-dash-muted dark:text-editor-comment')} />
                        <span className={cn('text-sm font-medium', active ? 'text-brand-primary' : 'text-dash-muted dark:text-editor-comment')}>{t.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-dash-muted dark:text-editor-comment mt-3">
                Active: <span className="font-semibold text-brand-primary capitalize">{uiTheme} mode</span>
              </p>
            </div>

            <div className="card p-6">
              <h2 className="text-sm font-bold text-dash-text dark:text-editor-text uppercase tracking-wider mb-5">Editor Preferences</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <Label>Font Size</Label>
                  <select value={fontSize} onChange={e => setFontSize(e.target.value)} className="input appearance-none cursor-pointer">
                    {['12px','13px','14px','15px','16px','18px'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Tab Size</Label>
                  <select value={tabSize} onChange={e => setTabSize(e.target.value)} className="input appearance-none cursor-pointer">
                    {['2 spaces','4 spaces','Tab'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-dash-border dark:border-editor-border">
                  <div>
                    <p className="text-sm font-medium text-dash-text dark:text-editor-text">Word Wrap</p>
                    <p className="text-xs text-dash-muted dark:text-editor-comment">Wrap long lines in the editor</p>
                  </div>
                  <Toggle on={wordWrap} onToggle={() => setWordWrap(v => !v)} />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-dash-border dark:border-editor-border">
                  <div>
                    <p className="text-sm font-medium text-dash-text dark:text-editor-text">Minimap</p>
                    <p className="text-xs text-dash-muted dark:text-editor-comment">Show code minimap in the editor</p>
                  </div>
                  <Toggle on={minimap} onToggle={() => setMinimap(v => !v)} />
                </div>
              </div>
            </div>
          </>)}

          {/* ── Save ── */}
          <div className="flex justify-end">
            <button onClick={handleSave} className={cn('btn-md rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300', saved ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'btn-primary')}>
              {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
