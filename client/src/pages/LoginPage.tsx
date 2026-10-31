import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/account';

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: 'Welcome Back',
        description: 'Signed in successfully',
        variant: 'success',
      });
      navigate(from, { replace: true });
    } catch (err: any) {
      toast({
        title: 'Sign In Failed',
        description: err.response?.data?.error || err.response?.data?.message || err.message || 'Invalid email or password',
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-gutter-mobile py-20">
      <div className="text-center mb-8 space-y-1">
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">
          Account Portal
        </span>
        <h1 className="font-headline-lg text-headline-lg font-serif text-primary">
          Namaste, Welcome Back
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Access your dispatch orders, saved delivery addresses, and harvest allocations.
        </p>
      </div>

      <div className="bg-surface-container-low p-8 border border-outline-variant/30 text-center space-y-6">
        <img
          src="/logo.png"
          alt="Krishna Vedic"
          className="h-16 w-auto mx-auto object-contain rounded-xl shadow-xs"
        />

        <div>
          <h2 className="font-serif text-lg font-bold text-on-surface">Secure 1-Click Sign In</h2>
          <p className="text-xs text-on-surface-variant mt-1 max-w-xs mx-auto">
            Sign in instantly using your Google account. No passwords to remember or reset.
          </p>
        </div>

        {/* Google One-Click Button */}
        <div className="py-2 flex flex-col items-center justify-center">
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  setIsLoading(true);
                  try {
                    await loginWithGoogle(credentialResponse.credential);
                    toast({
                      title: 'Welcome Back',
                      description: 'Signed in with Google successfully',
                      variant: 'success',
                    });
                    navigate(from, { replace: true });
                  } catch (err: any) {
                    toast({
                      title: 'Google Sign In Failed',
                      description: err.response?.data?.message || err.message || 'Could not verify Google account',
                      variant: 'error',
                    });
                  } finally {
                    setIsLoading(false);
                  }
                }
              }}
              onError={() => {
                toast({
                  title: 'Google Sign In',
                  description: 'Google authentication was closed or cancelled',
                  variant: 'error',
                });
              }}
              shape="rectangular"
              text="continue_with"
              width="320"
            />
          </div>

          {isLoading && (
            <p className="text-xs text-secondary font-medium mt-3 animate-pulse">
              Authenticating session...
            </p>
          )}
        </div>

        {/* Traditional Email & Password Login */}
        <div className="pt-4 border-t border-outline-variant/30 space-y-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-outline block">
            Or Sign In with Email
          </span>
          <form onSubmit={handleEmailSubmit} className="space-y-3 text-left">
            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 py-2 px-3 text-xs text-on-surface rounded-full focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 py-2 px-3 text-xs text-on-surface rounded-full focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-primary hover:bg-secondary text-on-primary font-label-md text-xs uppercase tracking-wider font-bold transition-all rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              Sign In
            </button>
          </form>

          <p className="text-xs text-on-surface-variant">
            Don't have an account?{' '}
            <Link to="/register" className="text-secondary font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <div className="pt-3 border-t border-outline-variant/30 text-[11px] text-outline space-y-1">
          <p>By signing in, you agree to Krishna Vedic's terms of service and privacy policy.</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-on-surface-variant">
        <span className="material-symbols-outlined text-sm text-secondary">lock</span>
        <span>256-bit SSL secured • Google Identity Services</span>
      </div>
    </div>
  );
}
