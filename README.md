# Torah AI - אפליקציית אינטרנט

## מה יש כאן
- Next.js (React) - צד לקוח + שרת
- Railway - שרת + Postgres SQL (בסיס נתונים אמיתי)
- NextAuth.js - מערכת התחברות/הרשמה עצמאית (בונים בעצמנו, לא תלויים בשירות חיצוני)
- Stripe - מנויים חודשיים בתשלום

## שלבי התקנה

### 1. הקמת פרויקט ב-Railway
1. גלוש ל-https://railway.app והירשם (אפשר עם GitHub)
2. לחץ "New Project" -> "Provision PostgreSQL"
3. אחרי שנוצר, לחץ על הריבוע של ה-Postgres -> טאב "Connect"
4. העתק את ה-`Postgres Connection URL` -> זה ה-`DATABASE_URL` שלך

### 2. יצירת הטבלאות
1. ב-Railway, לחץ על ה-Postgres -> טאב "Query" (או תתחבר עם כלי כמו TablePlus/DBeaver/psql)
2. הדבק את תוכן הקובץ `sql/schema.sql` והרץ

### 3. משתני סביבה
העתק את `.env.local.example` לקובץ חדש בשם `.env.local` ומלא:
```
DATABASE_URL=<מה שהעתקת מ-Railway>
NEXTAUTH_SECRET=<מחרוזת אקראית - תריץ בטרמינל: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```
פרטי Stripe ממלאים בהמשך (ראה למטה).

### 4. הרצה מקומית
```bash
npm install
npm run dev
```
פתח http://localhost:3000

### 5. הקמת Stripe (לתשלומי מנוי)
1. הרשם ב-https://stripe.com
2. Products -> צור מוצר "מנוי פרימיום" עם מחיר חודשי חוזר (למשל 19.90 ש"ח)
3. העתק את ה-Price ID -> `STRIPE_PRICE_ID`
4. Developers -> API Keys -> העתק Secret Key ו-Publishable Key
5. Developers -> Webhooks -> הוסף endpoint לכתובת: `https://YOUR_DOMAIN/api/webhook`
   - בחר אירועים: `checkout.session.completed`, `customer.subscription.deleted`
   - העתק את ה-Signing Secret -> `STRIPE_WEBHOOK_SECRET`

### 6. הוספת תוכן (רבנים ושיעורים)
כרגע דרך שאילתת SQL ישירה, למשל:
```sql
insert into rabbis (name, bio) values ('הרב יצחק פישחדזי שליט"א', 'ביוגרפיה קצרה כאן...');
insert into lessons (rabbi_id, title, description, is_premium, category)
values ('<מזהה הרב מהטבלה rabbis>', 'שיעור לדוגמה', 'תיאור השיעור', false, 'שיעור יומי');
```
בהמשך נבנה מסך ניהול (Admin) נוח יותר.

### 7. פריסה לאוויר (Deploy)
1. העלה את הקוד ל-GitHub
2. ב-Railway: New -> Deploy from GitHub repo (בחר את הריפו הזה)
3. הוסף את כל משתני הסביבה מה-`.env.local` בהגדרות הפרויקט ב-Railway
4. Railway ייתן לך כתובת אינטרנט חיה - אפשר לחבר דומיין מותאם אישית

## מבנה הטבלאות העיקריות
- **users** - משתמשים, סיסמה מוצפנת (bcrypt), סטטוס מנוי
- **rabbis** - שם, ביו, תמונה לכל רב
- **lessons** - שיעורים, מקושרים לרב, עם דגל `is_premium`
- **follows** - מעקב משתמשים אחרי רבנים

## מה עוד כדאי להוסיף בהמשך
- מסך ניהול (Admin) להעלאת שיעורים בלי SQL ישיר
- אוהל דיגיטלי (מפה של קברי צדיקים)
- מאגר תפילות/סגולות לפי קטגוריות
- לוח שנה עברי וזמני היום
- התראות Push כשעולה שיעור חדש
