import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import pool from '../lib/db';

export async function getServerSideProps() {
  const { rows } = await pool.query(`
    select lessons.*, rabbis.name as rabbi_name
    from lessons
    join rabbis on rabbis.id = lessons.rabbi_id
    order by lessons.created_at desc
    limit 20
  `);
  return { props: { lessons: JSON.parse(JSON.stringify(rows)) } };
}

export default function Home({ lessons }) {
  const { data: session } = useSession();
  const isSubscriber = session?.user?.subscription_status === 'active';

  return (
    <div>
      <nav className="navbar">
        <div>
          <Link href="/">בית</Link>
          <Link href="/premium">פרימיום</Link>
        </div>
        <div>
          {session ? (
            <>
              <span style={{ marginLeft: 12 }}>שלום, {session.user.email}</span>
              <button onClick={() => signOut()}>התנתק</button>
            </>
          ) : (
            <Link href="/login" className="btn">התחברות</Link>
          )}
        </div>
      </nav>

      <div className="container">
        <h1>תורה AI - שיעורים ותוכן תורני</h1>

        {lessons.map((lesson) => {
          const locked = lesson.is_premium && !isSubscriber;
          return (
            <div className="card" key={lesson.id}>
              <h3>
                {lesson.title}{' '}
                {lesson.is_premium && <span className="badge-premium">פרימיום</span>}
              </h3>
              <p style={{ color: '#666' }}>מאת: {lesson.rabbi_name}</p>
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
