import pool from '../../lib/db';

export async function getServerSideProps({ params }) {
  const { id } = params;

  const rabbiResult = await pool.query('select * from rabbis where id = $1', [id]);
  const lessonsResult = await pool.query(
    'select * from lessons where rabbi_id = $1 order by created_at desc',
    [id]
  );

  if (rabbiResult.rows.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      rabbi: JSON.parse(JSON.stringify(rabbiResult.rows[0])),
      lessons: JSON.parse(JSON.stringify(lessonsResult.rows)),
    },
  };
}

export default function RabbiPage({ rabbi, lessons }) {
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
