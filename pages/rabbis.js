import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Rabbis() {
  const [rabbis, setRabbis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('rabbis').select('*').order('created_at', { ascending: true });
      setRabbis(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div>
      <nav className="navbar">
        <div>
          <Link href="/">בית</Link>
          <Link href="/rabbis">רבנים</Link>
          <Link href="/prayers">תפילות</Link>
          <Link href="/premium">פרימיום</Link>
        </div>
      </nav>

      <div className="hero">
        <h1>הרבנים שלנו</h1>
        <p>מרכז שיעורי התורה של הרבנים המובילים בקהילה</p>
        <div className="gold-line" />
      </div>

      <div className="container">
        {loading && <p style={{ textAlign: 'center' }}>טוען...</p>}

        {!loading && rabbis.length === 0 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <p>עמודי הרבנים בדרך - בקרוב יתווספו כאן פרופילים מלאים עם שיעורים.</p>
            <div className="rabbis-strip" style={{ marginTop: 20 }}>
              <span className="rabbi-chip">הרב יצחק פישחדזי שליט"א</span>
              <span className="rabbi-chip">הרב עזרא שקלים שליט"א</span>
              <span className="rabbi-chip">הרב אור החיים כהן שליט"א</span>
              <span className="rabbi-chip">הרב בניהו שמואלי שליט"א</span>
            </div>
          </div>
        )}

        {rabbis.map((rabbi) => (
          <Link href={`/rabbi/${rabbi.id}`} key={rabbi.id}>
            <div className="card rabbi-card">
              <h3>{rabbi.name}</h3>
              {rabbi.bio && <p style={{ color: '#9FB0C7' }}>{rabbi.bio}</p>}
              <span className="link-arrow">לצפייה בשיעורים ←</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
