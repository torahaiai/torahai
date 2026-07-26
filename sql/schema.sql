-- ============================================
-- Torah AI - סכמת מסד נתונים (Postgres רגיל - Railway)
-- ============================================

create extension if not exists "pgcrypto";

-- טבלת משתמשים (במקום Supabase Auth - בונים בעצמנו)
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  full_name text,
  is_subscriber boolean default false,
  stripe_customer_id text,
  subscription_status text default 'inactive', -- active / canceled / inactive
  subscription_end date,
  created_at timestamptz default now()
);

-- טבלת רבנים
create table rabbis (
  id uuid primary key default gen_random_uuid(),
  name text not null,               -- לדוגמה: 'הרב יצחק פישחדזי שליט"א'
  bio text,
  image_url text,
  created_at timestamptz default now()
);

-- טבלת שיעורים/תוכן
create table lessons (
  id uuid primary key default gen_random_uuid(),
  rabbi_id uuid references rabbis(id) on delete cascade,
  title text not null,
  description text,
  media_url text,                   -- קישור לוידאו/אודיו
  media_type text check (media_type in ('video','audio','text')),
  is_premium boolean default false, -- האם תוכן זה דורש מנוי
  category text,                    -- למשל: 'תפילות', 'סגולות', 'שיעור יומי'
  created_at timestamptz default now()
);

-- טבלת מעקב אחרי רבנים (משתמש עוקב אחרי רב)
create table follows (
  user_id uuid references users(id) on delete cascade,
  rabbi_id uuid references rabbis(id) on delete cascade,
  primary key (user_id, rabbi_id)
);
