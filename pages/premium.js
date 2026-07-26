import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function Premium() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!session) {
      signIn();
      return;
    }
    setLoading(true);
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id, email: session.user.email }),
    });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="container">
      <h1>הצטרפות למנוי פרימיום</h1>
      <div className="card">
        <h3>מה כלול במנוי:</h3>
        <ul>
          <li>גישה לכל השיעורים הבלעדיים של הרבנים</li>
          <li>תפילות וסגולות מלאות</li>
          <li>אוהל דיגיטלי לקברי צדיקים</li>
          <li>תוכן AI תורני ייחודי</li>
        </ul>
        <button onClick={handleSubscribe} disabled={loading}>
          {loading ? 'טוען...' : 'הירשם עכשיו - 19.90 ש"ח לחודש'}
        </button>
      </div>
    </div>
  );
}
