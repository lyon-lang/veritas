'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight
} from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;
    
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, action: 'login' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to sign in');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-600 to-emerald-700 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <img src="/logo.png" alt="CoreValidate Logo" className="h-12 w-auto object-contain mb-8" />
          <h2 className="text-3xl font-bold mb-4">Welcome back</h2>
          <p className="text-emerald-100 mb-8">Sign in to continue verifying content.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2.5 mb-10">
            <img src="/logo.png" alt="CoreValidate Logo" className="h-9 w-auto object-contain" />
            <span className="text-xl font-semibold text-gray-900">CoreValidate</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h1>
            <p className="text-gray-600">Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: undefined })); }}
                  placeholder="you@company.com"
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${fieldErrors.email ? 'border-red-300' : 'border-gray-200'}`}
                />
              </div>
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: undefined })); }}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${fieldErrors.password ? 'border-red-300' : 'border-gray-200'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 rounded-xl"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-emerald-600 hover:text-emerald-700 font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
