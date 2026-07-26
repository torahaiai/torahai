import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Navbar({ rightContent }) {
  const [prayersOpen, setPrayersOpen] = useState(false);
  const [rabbisOpen, setRabbisOpen] = useState(false);
  const [rabbis, setRabbis] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('rabbis').select('id, name').order('created_at', { ascending: true });
      setRabbis(data || []);
    };
    load();
  }, []);

  const toggleRabbis = () => {
    setRabbisOpen((v) => !v);
    setPrayersOpen(false);
  };
  const togglePrayers = () => {
    setPrayersOpen((v) => !v);
    setRabbisOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link href="/">בית</Link>

        <div className="nav-dropdown">
          <button type="button" className="nav-dropdown-btn" onClick={togglePrayers}>
            תפילות ▾
          </button>
          {prayersOpen && (
            <div className="nav-dropdown-menu">
              <Link href="/prayers#morning" onClick={() => setPrayersOpen(false)}>תפילות בוקר</Link>
              <Link href="/prayers#road" onClick={() => setPrayersOpen(false)}>תפילת הדרך</Link>
              <Link href="/prayers#health" onClick={() => setPrayersOpen(false)}>לרפואה</Link>
              <Link href="/prayers#parnasa" onClick={() => setPrayersOpen(false)}>לפרנסה והצלחה</Link>
            </div>
          )}
        </div>

        <div className="nav-dropdown">
          <button type="button" className="nav-dropdown-btn" onClick={toggleRabbis}>
            רבנים ▾
          </button>
          {rabbisOpen && (
            <div className="nav-dropdown-menu">
              {rabbis.length === 0 && (
                <>
                  <span className="nav-dropdown-static">הרב יצחק פישחדזי שליט"א</span>
                  <span className="nav-dropdown-static">הרב עזרא שקלים שליט"א</span>
                  <span className="nav-dropdown-static">הרב אור החיים כהן שליט"א</span>
                  <span className="nav-dropdown-static">הרב בניהו שמואלי שליט"א</span>
                </>
              )}
              {rabbis.map((r) => (
                <Link href={`/rabbi/${r.id}`} key={r.id} onClick={() => setRabbisOpen(false)}>
                  {r.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/premium">פרימיום</Link>
      </div>

      <div>{rightContent}</div>
    </nav>
  );
}
