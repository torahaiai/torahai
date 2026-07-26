import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Premium() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      alert('יש להתחבר קודם כדי להירשם למנוי');
      window.location.href = '/login';
      return;
    }

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
