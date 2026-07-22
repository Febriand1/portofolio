import React, { useState } from 'react';
import * as OTPAuth from 'otpauth';
import { useAuth } from '../hooks/useAuth';

const totpSecret = import.meta.env.VITE_TOTP_SECRET;

const totp = new OTPAuth.TOTP({
  issuer: 'Dirga Febrian Portfolio',
  label: 'Admin',
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  secret: totpSecret,
});

const SecurityPanel: React.FC = () => {
  const { login } = useAuth();
  const [otpInput, setOtpInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const delta = totp.validate({
      token: otpInput.trim(),
      window: 1,
    });

    if (delta !== null) {
      login();
    } else {
      setLoginError(
        'Kode OTP salah atau telah kedaluwarsa. Silakan coba lagi.',
      );
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-card-custom border border-border-light rounded-xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold font-heading text-neutral-dark mb-2">
            Panel Keamanan
          </h1>
          <p className="text-sm text-neutral-500 font-sans">
            Masukkan kode 6-digit Authenticator Anda
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Kode Verifikasi 6-Digit
            </label>
            <input
              type="text"
              maxLength={6}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
              placeholder="000 000"
              className="w-full text-center px-4 py-3 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-brand font-mono text-xl tracking-widest"
              autoFocus
            />
          </div>

          {loginError && (
            <p className="text-xs text-red-500 font-medium text-center">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
          >
            Verifikasi & Masuk
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecurityPanel;
