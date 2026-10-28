import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({ title: 'Admin Session Authenticated', variant: 'success' });
      navigate('/admin');
    } catch (err: any) {
      toast({
        title: 'Authentication Failed',
        description: err.response?.data?.message || 'Invalid administrator credentials',
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-inverse-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-inverse-on-surface">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 bg-surface-container-highest/20 text-tertiary-fixed flex items-center justify-center mx-auto mb-4 border border-outline-variant/30">
          <span className="material-symbols-outlined text-3xl">verified_user</span>
        </div>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-white">
          Krishnavedic Admin Portal
        </h2>
        <p className="mt-2 text-xs text-outline-variant">
          Master Milling Ledger &amp; Store Operations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container-low py-8 px-6 sm:px-10 border border-outline-variant/40 text-on-surface">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@krishnavedic.com"
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 py-2.5 pl-10 pr-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
                <span className="material-symbols-outlined text-base text-outline absolute left-3 top-3 pointer-events-none">
                  mail
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 py-2.5 pl-10 pr-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
                <span className="material-symbols-outlined text-base text-outline absolute left-3 top-3 pointer-events-none">
                  lock
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary hover:bg-secondary text-on-primary font-label-md text-label-md uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying...' : 'Sign In to Dashboard'}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-outline border-t border-outline-variant/30 pt-4">
            Authorized personnel only. All access attempts are recorded in the operational audit log.
          </div>
        </div>
      </div>
    </div>
  );
}
