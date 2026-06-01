require('dotenv').config(); // טוען משתני סביבה מקובץ .env
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');

// הגדרת Firebase Admin SDK אם קובץ האישורים קיים
let db = null;
let auth = null;
const serviceAccountPath = path.join(__dirname, 'project-web-ai-790a3-firebase-adminsdk-fbsvc-cb2f8598f7.json');
if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    auth = admin.auth();
} else {
    console.warn('Firebase service account JSON not found; auth and click-history features are disabled.');
}

const app = express();
const PORT = process.env.PORT || 3000;
const appId = 'default-app-id';

// הגדרת CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));

app.use(bodyParser.json());

// אימות מפתח ה-API של Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("שגיאה: משתנה הסביבה GEMINI_API_KEY אינו מוגדר בקובץ .env");
    console.error("אנא וודא שיצרת קובץ .env בתיקיית ה-backend-server והגדרת בו את המפתח.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Endpoint: הנתיב לקבלת המלצות
app.post('/api/recommendation', async (req, res) => {
    const { gender, age, height, style, event, weather, language = 'he' } = req.body;
    let clickHistory = 'אין נתונים';

    // אימות המשתמש (אם יש טוקן) רק אם Firebase הוגדר בהצלחה
    if (auth && db && req.headers.authorization) {
        try {
            const idToken = req.headers.authorization.split('Bearer ')[1];
            const decodedToken = await auth.verifyIdToken(idToken);
            const snapshot = await db.collection(`artifacts/${appId}/users/${decodedToken.uid}/clicks`).get();
            clickHistory = snapshot.docs.map(doc => `${doc.data().item} (${doc.data().store})`).join(', ');
        } catch (error) {
            console.error('Error fetching click history:', error);
        }
    }

    // יצירת הפרומפט למודל ה-AI
    const prompt = `
        אתה מודל בינה מלאכותית שמתפקד כסטייליסט אישי אונליין.
        המטרה שלך היא להמליץ למשתמשים על לבוש שמתאים לפרטים האישיים שלהם ולדרישות ספציפיות.
        בהתאם לפרטים הבאים, החזר המלצה מפורטת על לוק שלם (מה ללבוש),
        כולל תיאור של כל פריט לבוש עיקרי (חולצה/טופ, מכנסיים/חצאית, נעליים, אקססוריז),
        הוסף טיפ קטן לסטייל או צבעים מומלצים, ובסיום – תציע שורות חיפוש פשוטות וכלליות
        (ללא גרשיים, ובמילים קצרות וברורות) בפורמט "שם בעברית$$שאילתת חיפוש באנגלית"
        שאפשר להעתיק אותן ישירות לאתרי קניות כמו אמזון או ASOS כדי למצוא בגדים מתאימים.

        התשובה שלך צריכה להיות ב-${language === 'en' ? 'אנגלית' : 'עברית'}. שורות החיפוש בסוף התשובה חייבות להיות בפורמט "שם בעברית$$שאילתת חיפוש באנגלית".
        **חשוב מאוד: עטוף את הכותרות ותתי-הכותרות בתגי HTML כפי שמוצג בדוגמה:**
        - כותרת ראשית: '<h3>ההמלצה האישית שלך:</h3>'
        - כותרות משנה כמו 'הלוק המומלץ:', 'טיפ קטן לסטייל:' עטוף בתג **<strong>**
        - כל פריט לבוש בתוך הלוק המומלץ (כמו חולצה/טופ:, מכנסיים/חצאית:, וכו') עטוף גם הוא בתג **<strong>**
        - כל שורת חיפוש בנפרד (לדוגמה: חצאית מקסי$$linen maxi skirt beige) עטוף בתג **<div class="search-query-item">**
        - שורות החיפוש צריכות להיות תחת כותרת **<div class="search-queries-title">שורות חיפוש מומלצות:</div>**
        - כל פסקה רגילה עטוף בתג **<p>**
        - כל שורות החיפוש יופיעו כבלוק אחד מופרד וכל שורת חיפוש בנפרד תהיה עטופה בתג **<div class="search-query-item">**.
        צור 3-5 שורות חיפוש רלוונטיות.
        
        דוגמה למבנה התשובה:
        <div>
            <h3>ההמלצה האישית שלך:</h3>
            <p>היי! אני שמחה לעזור לך...</p>
            <strong>הלוק המומלץ:</strong>
            <p><strong>חולצה/טופ:</strong> טי-שירט כותנה...</p>
            <p><strong>מכנסיים/חצאית:</strong> חצאית מקסי...</p>
            <p><strong>נעליים:</strong> סנדלים שטוחים...</p>
            <p><strong>אקססוריז:</strong> תיק קש קטן...</p>
            <strong>טיפ קטן לסטייל:</strong>
            <p>שחקי עם אקססוריז!...</p>
            <div class="search-queries-title">שורות חיפוש מומלצות:</div>
            <div class="search-query-item">חצאית מקסי$$linen maxi skirt beige</div>
            <div class="search-query-item">חולצה$$cotton t-shirt women white</div>
            <div class="search-query-item">סנדלים$$flat espadrille sandals women</div>
        </div>

        פרטים של המשתמש:
        מין: ${gender}
        גיל: ${age}
        גובה: ${height} ס"מ
        סגנון מועדף: ${style}
        סוג אירוע: ${event}
        מזג אוויר: ${weather}
        היסטוריית קליקים של המשתמש: ${clickHistory}

        תתחשב בכל הנתונים, לדוגמה גיל, גובה, סגנון, סוג אירוע והיסטוריית קליקים, כדי ליצור המלצה אישית ומדויקת.
        לדוגמה, אם סגנון הוא 'אלגנטי' ואירוע הוא 'ערב', תציע לוק אלגנטי לערב.
        אם מזג האוויר 'חורף', תכלול פריטים חמים.
    `;

    try {
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "models/gemini-flash-latest" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const recommendationText = response.text();

        res.json({ success: true, message: recommendationText });
    } catch (error) {
        console.error("שגיאה ביצירת המלצה ממודל ה-AI:", error);
        res.status(500).json({ success: false, error: "אירעה שגיאה בייצור המלצות הסטייל. אנא נסה שוב מאוחר יותר." });
    }
});

// הרצת השרת
app.listen(PORT, () => {
    console.log(`Backend server listening at http://localhost:${PORT}`);
    console.log(`Open your frontend at http://localhost:5500 (or your Live Server port) and try sending a request.`);
});
