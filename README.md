# Fit For You - אתר סטייל אישי מבוסס AI

אפליקציית אינטרנט להמלצות סטייל אישיות המשתמשת בבינה מלאכותית של Google Gemini. האפליקציה מספקת המלצות לבוש מותאמות אישית על סמך פרמטרים כמו מין, גיל, גובה, סגנון מועדף, סוג אירוע ומזג אוויר.

## 🎯 תכונות עיקריות

- **המלצות סטייל AI**: קבלת המלצות לבוש מותאמות אישית מבוססות Google Gemini AI
- **מערכת משתמשים**: הרשמה, התחברות וניהול פרופיל משתמש
- **מערכת VIP**: משתמשים המתחברים 5 פעמים או יותר הופכים ל-VIP
- **שמירת המלצות**: ההמלצות נשמרות ב-Firestore לצפייה מאוחרת יותר
- **תמיכה דו-לשונית**: עברית ואנגלית
- **עגלת קניות**: ניהול סל קניות עם שמירה מקומית
- **קישורים לאתרי קניות**: קישורים ישירים ל-Amazon, Zara, Farfetch ו-ASOS
- **עיצוב מודרני**: ממשק משתמש רספונסיבי ויפה

## 🛠️ טכנולוגיות

### Frontend
- **HTML5/CSS3**: ממשק משתמש מודרני ורספונסיבי
- **JavaScript (ES6+)**: לוגיקת האפליקציה
- **Firebase**: אימות משתמשים ומסד נתונים (Firestore)
- **Font Awesome**: אייקונים
- **Three.js**: תמיכה עתידית ל-AR/VR

### Backend
- **Node.js**: סביבת ריצה
- **Express.js**: שרת אינטרנט
- **Google Generative AI**: מודל ה-AI להמלצות
- **Firebase Admin SDK**: ניהול משתמשים ונתונים
- **CORS**: אפשור תקשורת בין Frontend ל-Backend

## 📦 מבנה הפרויקט

```
projectWeb-Ai-main/
├── img/                          # תיקיית ה-Frontend
│   ├── index.html               # דף הבית
│   ├── shop.html                # דף חנות
│   ├── blog.html                # דף בלוג
│   ├── about.html               # דף אודות
│   ├── contact.html             # דף יצירת קשר
│   ├── login.html               # דף התחברות
│   ├── cart.html                # דף עגלת קניות
│   ├── my-recommendations.html  # דף ההמלצות שלי
│   ├── sproduct.html            # דף מוצר בודד
│   ├── script.js                # לוגיקת ה-Frontend
│   ├── my-recommendations.js    # לוגיקת ההמלצות
│   ├── style.css                # עיצוב
│   ├── img770/                  # תמונות ולוגו
│   └── backend-server/          # שרת ה-Backend
│       ├── server.js            # קוד השרת
│       ├── package.json         # תלויות Node.js
│       ├── .env.example         # דוגמה לקובץ סביבה
│       └── .env                 # משתני סביבה (לא כלול ב-Git)
└── package.json                 # תלויות ראשיות
```

## 🚀 התקנה והגדרה

### דרישות מוקדמות
- Node.js (גרסה 14 ומעלה)
- npm או yarn
- חשבון Google Cloud עם גישה ל-Gemini API
- חשבון Firebase

### שלבי התקנה

1. **שכפול המאגר**
```bash
git clone <repository-url>
cd projectWeb-Ai-main/projectWeb-Ai-main
```

2. **התקנת תלויות ה-Frontend**
```bash
npm install
```

3. **התקנת תלויות ה-Backend**
```bash
cd img/backend-server
npm install
```

4. **הגדרת משתני סביבה**
```bash
# העתק את קובץ הדוגמה
cp .env.example .env

# ערוך את הקובץ .env והכנס את המפתחות שלך
GEMINI_API_KEY=your_real_gemini_api_key_here
GEMINI_MODEL=models/gemini-flash-latest
```

5. **הגדרת Firebase**
- צור פרויקט חדש ב-[Firebase Console](https://console.firebase.google.com/)
- הפעל Authentication (Email/Password)
- הפעל Firestore Database
- הורד את קובץ ה-service account JSON מ-Firebase Console
- שמור את הקובץ בתיקיית `img/backend-server/` עם השם: `project-web-ai-790a3-firebase-adminsdk-fbsvc-cb2f8598f7.json`
- עדכן את הגדרות Firebase ב-`img/script.js` עם הפרטים של הפרויקט שלך

## 🏃 הרצת הפרויקט

### הרצת השרת (Backend)
```bash
cd img/backend-server
node server.js
```
השרת ירוץ על `http://localhost:3000`

### הרצת ה-Frontend
ישנן שתי אפשרויות:

**אפשרות 1: שימוש ב-Live Server (VS Code)**
1. התקן את התוסף "Live Server" ב-VS Code
2. לחץ לחיצה ימנית על `index.html`
3. בחר "Open with Live Server"
4. האתר יפתח ב-`http://127.0.0.1:5500`

**אפשרות 2: שימוש בשרת HTTP פשוט**
```bash
cd img
npx http-server -p 5500
```

## 📖 שימוש באפליקציה

1. **הרשמה/התחברות**
   - לחץ על "Login" בתפריט העליון
   - הירשם עם אימייל וסיסמה חדשים, או התחבר עם חשבון קיים

2. **קבלת המלצות סטייל**
   - מלא את הטופס בדף הבית:
     - מין (אישה/גבר)
     - גיל
     - גובה (בס"מ)
     - סגנון מועדף (יומיומי, ספורט, אלגנטי, קז'ואל, סטייל רחוב, עסקי, בוהו שיק, מינימליסטי)
     - סוג אירוע (יומיומי, ערב, אירוע מיוחד, עבודה)
     - מזג אוויר (קיץ, חורף, מעבר)
   - לחץ על "קבל המלצות"
   - המערכת תציג המלצה מפורטת עם קישורים לאתרי קניות

3. **צפייה בהמלצות שמורות**
   - לחץ על "ההמלצות שלי" בתפריט (רק למשתמשים מחוברים)
   - תוכל לראות את כל ההמלצות שנשמרו

4. **עגלת קניות**
   - לחץ על סמל הסל בתפריט העליון
   - המוצרים נשמרים ב-LocalStorage

5. **מערכת VIP**
   - לאחר 5 כניסות לאפליקציה, תקבל סטטוס VIP
   - תופיע תגית "👑 משתמש VIP" בתפריט

## 🔧 הגדרות מתקדמות

### שינוי פורט השרת
ערוך את המשתנה `PORT` בקובץ `.env`:
```
PORT=3000
```

### שינוי מודל ה-AI
ערוך את המשתנה `GEMINI_MODEL` בקובץ `.env`:
```
GEMINI_MODEL=models/gemini-pro
```

### שינוי כתובת ה-Frontend
ערוך את ה-CORS ב-`server.js`:
```javascript
app.use(cors({
    origin: 'http://your-frontend-url'
}));
```

## 🐛 פתרון בעיות

### השרת לא עולה
- וודא שהתקנת את כל התלויות: `npm install`
- בדוק שהגדרת נכון את המפתח בקובץ `.env`
- וודא שהפורט 3000 פנוי

### שגיאת CORS
- וודא שהכתובת בהגדרות CORS תואמת את כתובת ה-Frontend שלך

### Firebase לא עובד
- וודא שהגדרת נכון את הפרטים ב-`script.js`
- בדוק שה-service account JSON קיים בתיקייה הנכונה
- וודא שהפעלת Authentication ו-Firestore ב-Firebase Console

### המלצות לא מופיעות
- בדוק שהשרת רץ
- בדוק את ה-Console בדפדפן לשגיאות
- וודא שהמפתח של Gemini API תקין

## 📝 רישיון

פרויקט זה נוצר לצרכי למידה ופיתוח.

## 👥 תורמים

- Eden - פיתוח ועיצוב

## 📧 יצירת קשר

לשאלות והצעות, אנא פתח issue במאגר או צור קשר דרך דף יצירת הקשר באפליקציה.

---

**נהנית מהפרויקט? ⭐ תן לנו כוכב ב-GitHub!**
