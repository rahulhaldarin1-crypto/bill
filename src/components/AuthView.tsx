import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { UserAccount, WorkspaceData } from '../types/business';
import { api } from '../utils/api';
import { BrandLogo } from './BrandLogo';

interface AuthViewProps {
  onAuthenticated: (user: UserAccount, workspace: WorkspaceData) => void;
  embedded?: boolean;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onAuthenticated,
  embedded = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.login({ email: email.trim(), password });
      onAuthenticated(result.user, result.workspace);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const card = (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-[#EFE2F5] bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col items-center text-center mb-6">
        <BrandLogo size={84} className="mb-3" />
        <h1 className="font-display-serif text-2xl font-bold text-[#1F122B]">
          Glamour Galleria
        </h1>
        <p className="text-xs font-medium text-[#9D174D] mt-1">
          Your Style, Our Priority
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-[#FECDD3] bg-[#FFF1F2] px-3.5 py-2.5 text-xs font-medium text-[#BE123C]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#4A3B59] mb-1.5">
            Email Address
          </label>
          <div className="flex items-center gap-2.5 rounded-xl border border-[#E6D9EE] bg-[#FDFBFE] px-3.5 py-2.5 focus-within:border-[#9333EA]">
            <Mail className="w-4 h-4 text-[#9333EA] shrink-0" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-transparent text-sm text-[#1F122B] placeholder:text-[#A493B5] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#DB2777] to-[#7E22CE] text-sm font-semibold text-white hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign In to Workspace'}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-[#6B5B7B]">
        Owner login only. Authorized access to Glamour Galleria workspace.
      </p>
    </div>
  );

  if (embedded) {
    return card;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF4FA] via-[#FFFFFF] to-[#F5F0FF] flex items-center justify-center p-4">
      {card}
    </div>
  );
};
