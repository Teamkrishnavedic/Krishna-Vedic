import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/account';

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
          alt="Krishnavedic"
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

        <div className="pt-4 border-t border-outline-variant/30 text-[11px] text-outline space-y-1">
          <p>By signing in, you agree to Krishnavedic's terms of service and privacy policy.</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-on-surface-variant">
        <span className="material-symbols-outlined text-sm text-secondary">lock</span>
        <span>256-bit SSL secured • Google Identity Services</span>
      </div>
    </div>
  );
}
