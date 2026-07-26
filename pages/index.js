import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [lessons, setLessons] = useState([]);
  const [user, setUser] = useState(null);
  const [isSubscriber, setIsSubscriber] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', session.user.id)
          .single();
        setIsSubscriber(profile?.subscription_status === 'active');
      }

      const { data } = await supabase
        .from('lessons')
        .select('*, rabbis(name)')
        .order('created_at', { ascending: false })
        .limit(20);
      setLessons(data || []);
    };
    load();
  }, []);

  return (
    <div>
      <nav className="navbar">
        <div>
          <Link href="/">בית</Link>
          <Link href="/premium">פרימיום</Link>
        </div>
        <div>
          {user ? <span>שלום, {user.email}</span> : <Link href="/login" className="btn">התחברות</Link>}
        </div>
      </nav>

      <div className="container">
        <h1>תורה AI - שיעורים ותוכן תורני</h1>
        {lessons.map((lesson) => {
          const locked = lesson.is_premium && !isSubscriber;
          return (
            <div className="card" key={lesson.id}>
              <h3>{lesson.title} {lesson.is_premium && <span className="badge-premium">פרימיום</span>}</h3>
              <p style={{ color: '#666' }}>מאת: {lesson.rabbis?.name}</p>
              {locked ? (
                <p>🔒 תוכן זה זמין למנויים בלבד. <Link href="/premium">הצטרף עכשיו</Link></p>
              ) : (
                <p>{lesson.description}</p>
              )}
            </div>
          );
        })}
        {lessons.length === 0 && <p>עדיין אין שיעורים להצגה. הוסף שורות בטבלת lessons.</p>}
      </div>
    </div>
  );
}
