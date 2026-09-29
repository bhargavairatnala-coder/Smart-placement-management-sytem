import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  KeyRound,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';

interface LoginPageProps {
  initialRole?: 'student' | 'admin';
  onNavigateRegister: () => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialRole = 'student',
  onNavigateRegister,
  onNavigateHome,
}) => {
  const { login } = useAuth();
  const [role, setRole] = useState<'student' | 'admin'>(initialRole);
  const [email, setEmail] = useState(
    initialRole === 'admin' ? 'admin@example.com' : 'student@example.com'
  );
  const [password, setPassword] = useState(
    initialRole === 'admin' ? 'admin123' : 'student123'
  );
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleRoleSwitch = (newRole: 'student' | 'admin') => {
    setRole(newRole);
    setError(null);
    if (newRole === 'admin') {
      setEmail('admin@example.com');
      setPassword('admin123');
    } else {
      setEmail('student@example.com');
      setPassword('student123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    const res = login(email, password, role);
    if (!res.success) {
      setError(res.message);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setError('Please provide a valid registered email address.');
      return;
    }
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotModal(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <button
          onClick={onNavigateHome}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 inline-flex items-center gap-1 transition-colors"
        >
          ← Back to Homepage
        </button>

        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/30">
            {role === 'admin' ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <GraduationCap className="w-6 h-6" />
            )}
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {role === 'admin' ? 'Placement Officer Login' : 'Student Portal Login'}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
            Sign in to manage your placement activities and track drives
          </p>
        </div>

        <div className="mt-6 flex p-1 bg-slate-200/80 rounded-xl">
          <button
            type="button"
            onClick={() => handleRoleSwitch('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'student'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Student Login
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'admin'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin / Officer
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-lg rounded-2xl border border-slate-200/80">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'admin' ? 'admin@example.com' : 'student@example.com'}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-md shadow-indigo-600/20 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50 -mx-6 -mb-8 p-5 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span className="flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                Demo Credentials:
              </span>
              <span className="text-[10px] text-indigo-600 font-semibold uppercase">
                Click to Auto-fill
              </span>
            </div>

            {role === 'student' ? (
              <div
                onClick={() => {
                  setEmail('student@example.com');
                  setPassword('student123');
                }}
                className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs cursor-pointer hover:border-indigo-400 transition-colors"
              >
                <div className="flex justify-between font-mono text-[11px] text-slate-600">
                  <span>
                    Email: <strong className="text-slate-900">student@example.com</strong>
                  </span>
                  <span>
                    Pass: <strong className="text-slate-900">student123</strong>
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  setEmail('admin@example.com');
                  setPassword('admin123');
                }}
                className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs cursor-pointer hover:border-indigo-400 transition-colors"
              >
                <div className="flex justify-between font-mono text-[11px] text-slate-600">
                  <span>
                    Email: <strong className="text-slate-900">admin@example.com</strong>
                  </span>
                  <span>
                    Pass: <strong className="text-slate-900">admin123</strong>
                  </span>
                </div>
              </div>
            )}

            {role === 'student' && (
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={onNavigateRegister}
                    className="font-bold text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Account Password"
        subtitle="Educational Demo: simulates instant verification link dispatch"
      >
        {forgotSuccess ? (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-emerald-800">Password Reset Link Sent!</h4>
            <p className="text-xs text-emerald-700 mt-1">
              In a production system with real SMTP mailers, an encrypted token is sent to{' '}
              <strong>{forgotEmail}</strong>. For this demo, use <code>student123</code>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your registered college email. We will verify your placement record and dispatch
              reset instructions.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Email</label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-600"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
