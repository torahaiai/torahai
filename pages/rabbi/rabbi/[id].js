import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function RabbiPage() {
  const router = useRouter();
  const { id } = router.query;
  const [rabbi, setRabbi] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data: rabbiData } = await supabase.from('rabbis').select('*').eq('id', id).single();
      setRabbi(rabbiData);
      const { data: lessonsData } = await supabase.from('lessons').select('*').eq('rabbi_id', id).order('created_at', { ascending: false });
      setLessons(lessonsData || []);
    };
    load();
  }, [id]);

  if (!rabbi) return <div className="container">טוען...</div>;

  return (
    <div className="container">
      <h1>{rabbi.name}</h1>
      <p>{rabbi.bio}</p>
      <h3>שיעורים</h3>
      {lessons.map((lesson) => (
        <div className="card" key={lesson.id}>
          <h4>{lesson.title} {lesson.is_premium && <span className="badge-premium">פרימיום</span>}</h4>
          <p>{lesson.description}</p>
        </div>
      ))}
    </div>
  );
}
