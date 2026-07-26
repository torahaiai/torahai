import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return setError(error.message);
      alert('נרשמת בהצלחה! בדוק את המייל לאימות.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setError(error.message);
      router.push('/');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400 }}>
      <h2>{mode === 'login' ? 'התחברות' : 'הרשמה'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">{mode === 'login' ? 'התחבר' : 'הירשם'}</button>
      </form>
      <p style={{ marginTop: 12 }}>
        {mode === 'login' ? (
          <>אין לך חשבון? <a onClick={() => setMode('signup')} style={{ cursor: 'pointer', color: '#1F3B2C' }}>הירשם כאן</a></>
        ) : (
          <>כבר יש לך חשבון? <a onClick={() => setMode('login')} style={{ cursor: 'pointer', color: '#1F3B2C' }}>התחבר כאן</a></>
        )}
      </p>
    </div>
  );
}
