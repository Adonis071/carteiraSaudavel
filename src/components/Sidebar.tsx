import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Settings, LogOut, Wallet, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { logout, currentUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Transações', icon: Receipt, path: '/transactions' },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 w-64 md:w-72">
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-violet-600 p-2 rounded-xl">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-zinc-900 dark:text-white">Carteira Saudável</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                  : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              )
            }
          >
            <item.icon className="mr-3 w-5 h-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
        {/* User Info */}
        <div className="flex items-center px-3">
          <div className="flex-shrink-0">
            {currentUser?.photoURL ? (
              <img className="h-9 w-9 rounded-full border border-zinc-200 dark:border-zinc-700" src={currentUser.photoURL} alt="User" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
          <div className="ml-3 truncate">
            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
              {currentUser?.displayName || 'Usuário'}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate flex items-center">
              <Shield className="w-3 h-3 mr-1 text-green-500" />
              Verificado
            </p>
          </div>
        </div>

        {/* Theme Toggle & Logout */}
        <div className="flex items-center gap-2 px-3">
          <button
            onClick={toggleTheme}
            className="flex-1 flex justify-center items-center py-2 px-3 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
          </button>
          <button
            onClick={() => logout()}
            className="flex items-center justify-center py-2 px-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
