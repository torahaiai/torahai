import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);

      // הרשמה הצליחה - מתחברים אוטומטית
      const result = await signIn('credentials', { redirect: false, email, password });
      if (result.error) return setError(result.error);
      router.push('/');
    } else {
      const result = await signIn('credentials', { redirect: false, email, password });
      if (result.error) return setError('אימייל או סיסמה שגויים');
      router.push('/');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400 }}>
      <h2>{mode === 'login' ? 'התחברות' : 'הרשמה'}</h2>
      <form onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <input
            type="text"
            placeholder="שם מלא"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
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
