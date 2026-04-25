'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Code2, LayoutDashboard, Video, FileQuestion, Users,
  BarChart3, Settings, LogOut, Menu, X, Plus, Moon, Sun, Swords,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme';
import { useSession, signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { href: '/dashboard',           icon: LayoutDashboard, label: 'Dashboard'  },
  { href: '/interviews', icon: Video,            label: 'Interviews' },
  { href: '/questions',  icon: FileQuestion,     label: 'Questions'  },
  { href: '/candidates', icon: Users,            label: 'Candidates' },
  { href: '/practice',   icon: Swords,           label: 'Practice'   },
  { href: '/analytics',  icon: BarChart3,        label: 'Analytics'  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();

  const userRole = (session?.user as any)?.role || 'CANDIDATE';
  const isInterviewer = userRole === 'INTERVIEWER' || userRole === 'ADMIN';

  const userInitials = session?.user?.name
    ? session.user.name.substring(0, 2).toUpperCase()
    : session?.user?.email?.substring(0, 2).toUpperCase() || 'U';

  const visibleNavItems = NAV_ITEMS.filter(item => {
    if (!isInterviewer && ['/interviews', '/questions', '/candidates', '/analytics'].includes(item.href)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-dash-bg dark:bg-editor-bg flex transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-editor-bg border-r border-editor-border z-40 transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-60' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-14 border-b border-editor-border shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shrink-0">
            <Code2 className="w-4.5 h-4.5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="text-sm font-bold text-white">
              Hire<span className="text-brand-primary">Codec</span>
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto p-1 rounded hover:bg-editor-surface text-editor-comment"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* New Interview Button */}
        {isInterviewer && (
          <div className="px-3 mt-4 mb-2">
            <Link
              href="/interviews/new"
              className={cn(
                'flex items-center gap-2 rounded-lg text-sm font-medium transition-all',
                'bg-brand-primary text-white hover:bg-brand-primary-dark shadow-lg shadow-brand-primary/25',
                sidebarOpen ? 'px-4 py-2.5' : 'justify-center p-2.5'
              )}
            >
              <Plus className="w-4 h-4" />
              {sidebarOpen && 'New Interview'}
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg text-sm transition-all',
                  sidebarOpen ? 'px-3 py-2' : 'justify-center p-2.5',
                  isActive
                    ? 'bg-brand-primary/10 text-brand-primary font-medium'
                    : 'text-editor-comment hover:text-editor-text hover:bg-editor-surface'
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-editor-border p-3 space-y-1">
          {/* User */}
          <div className={cn(
            'flex items-center gap-2 rounded-lg p-2 hover:bg-editor-surface transition-colors cursor-pointer',
            !sidebarOpen && 'justify-center'
          )}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">{userInitials}</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-editor-text truncate">
                  {session?.user?.name || session?.user?.email || 'User'}
                </p>
                <p className="text-[10px] text-editor-comment truncate capitalize">
                  {((session?.user as any)?.role || 'User').toLowerCase()}
                </p>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              'w-full flex items-center gap-3 rounded-lg text-sm text-editor-comment hover:text-editor-text hover:bg-editor-surface transition-all',
              sidebarOpen ? 'px-3 py-2' : 'justify-center p-2.5'
            )}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 shrink-0 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 shrink-0" />
            )}
            {sidebarOpen && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
          </button>

          {/* Settings */}
          <Link
            href="/settings"
            className={cn(
              'flex items-center gap-3 rounded-lg text-sm text-editor-comment hover:text-editor-text hover:bg-editor-surface transition-all',
              sidebarOpen ? 'px-3 py-2' : 'justify-center p-2.5'
            )}
          >
            <Settings className="w-4 h-4 shrink-0" />
            {sidebarOpen && 'Settings'}
          </Link>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={cn(
              'w-full flex items-center gap-3 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all',
              sidebarOpen ? 'px-3 py-2' : 'justify-center p-2.5'
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          sidebarOpen ? 'ml-60' : 'ml-16'
        )}
      >
        {children}
      </main>
    </div>
  );
}
