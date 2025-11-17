import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setToken } from '../store/slices/authSlice';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // trim email to remove accidental leading/trailing spaces
      const payload = { email: email.trim(), password };
      const res = await api.post('/auth/login', payload);
      dispatch(setToken(res.data.access_token));
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  // While redirecting, show small loader
  if (user) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card">You are already signed in — redirecting…</div>
      </div>
    );
  }

  return (
    <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <motion.div
        className="card"
        style={{ maxWidth: 520, width: '100%' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h2 style={{ marginTop: 0 }}>Sign in</h2>
        <div className="small hint" style={{ marginBottom: 12 }}>Access your team ordering dashboard</div>

        <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
          <div>
            <label className="small">Email</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmail(prev => prev.trim())}
            />
          </div>

          <div>
            <label className="small">Password</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <div className="msg-error">{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <motion.button
              className="btn btn-primary"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Signing...' : 'Sign in'}
            </motion.button>
            <div className="small hint">Forgot?</div>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
