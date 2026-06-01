import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDfPdz3fMDnwdqaHgamznoS_ktO2gsieVo",
  authDomain: "project-web-ai-790a3.firebaseapp.com",
  projectId: "project-web-ai-790a3",
  storageBucket: "project-web-ai-790a3.firebasestorage.app",
  messagingSenderId: "648698665335",
  appId: "1:648698665335:web:547b6601255108c042a972",
  measurementId: "G-P06507FT0E"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const appId = "default-app-id";

const recommendationsList = document.getElementById("recommendationsList");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    recommendationsList.innerHTML = '<p>אנא התחבר כדי לראות את ההמלצות שלך.</p>';
    return;
  }

  try {
    const userRef = collection(db, `artifacts/${appId}/users/${user.uid}/recommendations`);
    const q = query(userRef, orderBy("savedAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      recommendationsList.innerHTML = '<p>אין עדיין המלצות שמורות.</p>';
      return;
    }

    recommendationsList.innerHTML = '';
    snapshot.forEach(doc => {
      if (doc.id !== 'latest') {
        const data = doc.data();
        const div = document.createElement('div');
        div.className = 'recommendation-card';
        div.innerHTML = `
          <div class="content">${data.recommendation}</div>
          <div class="date">נשמר בתאריך: ${new Date(data.savedAt.seconds * 1000).toLocaleString('he-IL')}</div>
        `;
        recommendationsList.appendChild(div);
      }
    });
  } catch (error) {
    console.error("שגיאה בשליפת המלצות:", error);
    recommendationsList.innerHTML = '<p>אירעה שגיאה בעת שליפת ההמלצות.</p>';
  }
});
