import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, loginWithGoogle, isAdmin, isStaff } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // If already authenticated as an admin or staff, redirect straight to /admin
  useEffect(() => {
    if (isAdmin || isStaff) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, isStaff, navigate]);

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
        description: err.response?.data?.message || err.response?.data?.error || 'Invalid administrator credentials',
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      setIsLoading(true);
      try {
        await loginWithGoogle(credentialResponse.credential);
        toast({ title: 'Admin Session Authenticated with Google', variant: 'success' });
        navigate('/admin');
      } catch (err: any) {
        toast({
          title: 'Google Sign In Failed',
          description: err.response?.data?.message || err.message || 'Access restricted to authorized administrators.',
          variant: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-inverse-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-inverse-on-surface">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 bg-surface-container-highest/20 text-tertiary-fixed flex items-center justify-center mx-auto mb-4 border border-outline-variant/30 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-3xl">verified_user</span>
        </div>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-white">
          Krishna Vedic Admin Portal
        </h2>
        <p className="mt-2 text-xs text-outline-variant">
          Master Milling Ledger &amp; Store Operations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container-low py-8 px-6 sm:px-10 border border-outline-variant/40 text-on-surface rounded-3xl shadow-lg space-y-6">
          {/* 1-Click Google Admin Sign In */}
          <div className="flex flex-col items-center justify-center space-y-3 pb-6 border-b border-outline-variant/30">
            <span className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">
              Authorized Admin 1-Click Sign In
            </span>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                toast({
                  title: 'Google Sign In Cancelled',
                  description: 'Google authentication dialog was closed',
                  variant: 'error',
                });
              }}
              shape="rectangular"
              text="continue_with"
              width="320"
            />
          </div>

          {/* Email / Password Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="text-center">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-outline">
                Or Sign In with Email &amp; Password
              </span>
            </div>

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
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 py-2.5 pl-10 pr-3 text-sm text-on-surface rounded-full focus:outline-none focus:border-primary"
                />
                <span className="material-symbols-outlined text-base text-outline absolute left-3.5 top-3 pointer-events-none">
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
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 py-2.5 pl-10 pr-3 text-sm text-on-surface rounded-full focus:outline-none focus:border-primary"
                />
                <span className="material-symbols-outlined text-base text-outline absolute left-3.5 top-3 pointer-events-none">
                  lock
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary hover:bg-secondary text-on-primary font-label-md text-label-md uppercase tracking-wider font-bold transition-all rounded-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm active:scale-95"
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
