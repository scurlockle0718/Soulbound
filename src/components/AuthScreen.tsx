import { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, Sparkles, Scroll } from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: (user: { id: string; email: string; username: string }) => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { signIn, signUp } = await import('../utils/api');
      
      const result = mode === 'signin' 
        ? await signIn(email, password)
        : await signUp(email, password, username);

      if (result.success && result.user) {
        onAuthSuccess(result.user);
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-5 bg-gradient-to-b from-[#2a2a4e] to-[#1a1a2e] overflow-y-auto">
      <div className="w-full max-w-md my-auto py-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl text-[#e6be8a] mb-2 sm:mb-3 tracking-wider" style={{ fontFamily: 'serif' }}>
            Soulbound
          </h1>
          <p className="text-[#a8a8b8] text-sm">Your adventure awaits</p>
        </div>

        {/* Auth Card */}
        <div className="w-full bg-[#16213e]/80 backdrop-blur-sm rounded-3xl border border-[#e6be8a]/20 p-5 sm:p-6">
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setMode('signin');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-lg transition-all text-sm sm:text-base ${
              mode === 'signin'
                ? 'bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] text-white'
                : 'bg-[#1a1a2e]/50 text-[#a8a8b8] hover:bg-[#1a1a2e]'
            }`}
          >
            <LogIn className="w-4 h-4 inline mr-2" />
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-lg transition-all text-sm sm:text-base ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] text-white'
                : 'bg-[#1a1a2e]/50 text-[#a8a8b8] hover:bg-[#1a1a2e]'
            }`}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username (signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-[#e8e8e8] text-sm mb-2">Username (Optional)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8a8b8]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Traveler"
                  className="w-full bg-[#1a1a2e]/50 border border-[#e6be8a]/20 rounded-lg pl-11 pr-4 py-3 text-[#e8e8e8] placeholder:text-[#a8a8b8]/50 focus:outline-none focus:border-[#4a90e2] transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-[#e8e8e8] text-sm mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8a8b8]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="traveler@teyvat.com"
                className="w-full bg-[#1a1a2e]/50 border border-[#e6be8a]/20 rounded-lg pl-11 pr-4 py-3 text-[#e8e8e8] placeholder:text-[#a8a8b8]/50 focus:outline-none focus:border-[#4a90e2] transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[#e8e8e8] text-sm mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8a8b8]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-[#1a1a2e]/50 border border-[#e6be8a]/20 rounded-lg pl-11 pr-4 py-3 text-[#e8e8e8] placeholder:text-[#a8a8b8]/50 focus:outline-none focus:border-[#4a90e2] transition-colors"
              />
            </div>
            {mode === 'signup' && (
              <p className="text-[#a8a8b8] text-xs mt-1">Minimum 6 characters</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#4a90e2] to-[#7b68ee] text-white py-3 rounded-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        {/* Info Text */}
        <div className="mt-6 text-center">
          <p className="text-[#a8a8b8] text-xs">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
              }}
              className="text-[#4a90e2] hover:text-[#7b68ee] transition-colors"
            >
              {mode === 'signin' ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="mt-6 sm:mt-8 space-y-2 text-center pb-6">
        <div className="flex items-center justify-center gap-2 text-[#a8a8b8] text-xs sm:text-sm">
          <Sparkles className="w-4 h-4 text-[#e6be8a] flex-shrink-0" />
          <span>Your progress is automatically saved</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-[#a8a8b8] text-xs sm:text-sm">
          <Scroll className="w-4 h-4 text-[#e6be8a] flex-shrink-0" />
          <span>Access your adventure from any device</span>
        </div>
      </div>
      </div>
    </div>
  );
}
