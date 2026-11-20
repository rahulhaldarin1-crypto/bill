import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { UserAccount, WorkspaceData } from '../types/business';
import { api } from '../utils/api';
import { BrandLogo } from './BrandLogo';

interface AuthViewProps {
  onAuthenticated: (user: UserAccount, workspace: WorkspaceData) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (name.trim().length < 2) {
        setError('Please enter your full name (at least 2 characters).');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      const result =
        mode === 'register'
          ? await api.register({ name: name.trim(), email: email.trim(), password })
          : await api.login({ email: email.trim(), password });
      onAuthenticated(result.user, result.workspace);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF4FA] via-[#FFFFFF] to-[#F5F0FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#EFE2F5] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <BrandLogo size={84} className="mb-3" />
          <h1 className="font-display-serif text-2xl font-bold text-[#1F122B]">
            Glamour Galleria
          </h1>
          <p className="text-xs font-medium text-[#9D174D] mt-1">
            Your Style, Our Priority
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#F8EFF9] border border-[#EFE2F5] mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#6D28D9] shadow-xs'
                : 'text-[#6B5B7B] hover:text-[#1F122B]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-[#DB2777] shadow-xs'
                : 'text-[#6B5B7B] hover:text-[#1F122B]'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-[#FECDD3] bg-[#FFF1F2] px-3.5 py-2.5 text-xs font-medium text-[#BE123C]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#4A3B59] mb-1.5">
                Owner / Business Manager Name
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-[#E6D9EE] bg-[#FDFBFE] px-3.5 py-2.5 focus-within:border-[#9333EA]">
                <User className="w-4 h-4 text-[#9333EA] shrink-0" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-transparent text-sm text-[#1F122B] placeholder:text-[#A493B5] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#4A3B59] mb-1.5">
              Email Address
            </label>
            <div className="flex items-center gap-2.5 rounded-xl border border-[#E6D9EE] bg-[#FDFBFE] px-3.5 py-2.5 focus-within:border-[#9333EA]">
              <Mail className="w-4 h-4 text-[#9333EA] shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@glamourgalleria.in"
                className="w-full bg-transparent text-sm text-[#1F122B] placeholder:text-[#A493B5] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A3B59] mb-1.5">
              Password
            </label>
            <div className="flex items-center gap-2.5 rounded-xl border border-[#E6D9EE] bg-[#FDFBFE] px-3.5 py-2.5 focus-within:border-[#9333EA]">
              <Lock className="w-4 h-4 text-[#9333EA] shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-transparent text-sm text-[#1F122B] placeholder:text-[#A493B5] focus:outline-none"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#4A3B59] mb-1.5">
                Confirm Password
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-[#E6D9EE] bg-[#FDFBFE] px-3.5 py-2.5 focus-within:border-[#9333EA]">
                <ShieldCheck className="w-4 h-4 text-[#9333EA] shrink-0" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-transparent text-sm text-[#1F122B] placeholder:text-[#A493B5] focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#DB2777] to-[#7E22CE] text-sm font-semibold text-white hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-60"
          >
            {loading
              ? 'Please wait...'
              : mode === 'register'
              ? 'Create Business Account'
              : 'Sign In to Workspace'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-[#6B5B7B]">
          Your customers, bills, products, and financial reports are securely saved and isolated to your account.
        </p>
      </div>
    </div>
  );
};
