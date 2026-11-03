import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { ShieldCheck, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto px-gutter-mobile py-20">
      <div className="text-center mb-8 space-y-1">
        <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">
          Join Krishna Vedic
        </span>
        <h1 className="font-headline-lg text-headline-lg font-serif text-primary">
          Create an Account
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Enjoy priority cold-press dispatch notifications, saved addresses, and harvest allocations.
        </p>
      </div>

      <div className="bg-surface-container-low p-8 border border-outline-variant/30 text-center space-y-6">
        <div className="w-16 h-16 bg-[#f4f4ec] border border-[#e5e2da] rounded-full flex items-center justify-center mx-auto text-[#6e3418]">
          <span className="material-symbols-outlined text-3xl">local_florist</span>
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-on-surface">1-Click Fast Registration</h2>
          <p className="text-xs text-on-surface-variant mt-1 max-w-xs mx-auto">
            Create your account instantly with Google. No registration forms or password setup required.
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
                      title: 'Welcome to Krishna Vedic',
                      description: 'Account registered and signed in with Google',
                      variant: 'success',
                    });
                    navigate('/account');
                  } catch (err: any) {
                    toast({
                      title: 'Registration Failed',
                      description: err.response?.data?.message || err.message || 'Could not register with Google',
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
              text="signup_with"
              width="320"
            />
          </div>

          {isLoading && (
            <p className="text-xs text-secondary font-medium mt-3 animate-pulse">
              Creating your harvest account...
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-outline-variant/30 text-xs text-on-surface-variant leading-relaxed text-left space-y-2">
          <p className="text-[11px] text-outline">
            By registering, you confirm you are 18+ years of age and consent to the collection of your name and email to manage orders in accordance with the{' '}
            <Link to="/privacy" target="_blank" className="text-secondary underline font-semibold hover:text-primary">
              DPDP Act 2023 Privacy Policy
            </Link>{' '}
            and agree to our{' '}
            <Link to="/terms" target="_blank" className="text-secondary underline font-semibold hover:text-primary">
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-1.5 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          <span>Verified Google Identity • Passwordless Authentication</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-outline">
          <Lock className="w-3.5 h-3.5 text-primary" />
          <span>256-Bit SSL Secured &amp; Indian DPDP Act Compliant</span>
        </div>
      </div>
    </div>
  );
}
