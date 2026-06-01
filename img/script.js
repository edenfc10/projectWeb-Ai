import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'default-app-id';

window.firebaseApp = app;
window.firebaseAuth = auth;
window.firestoreDb = db;
window.appId = appId;
window.isAuthReady = true;

document.addEventListener('DOMContentLoaded', () => {
    const styleFormSection = document.getElementById('style-form-section');
    const recommendationsArea = document.getElementById('recommendationsArea');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const loginNavLink = document.getElementById('loginLink');
    const logoutNavLink = document.getElementById('logoutLink');
    const showRegisterLink = document.getElementById('showRegisterLink');
    const showLoginLink = document.getElementById('showLoginLink');
    const languageSwitch = document.getElementById('language-switch');

    const API_ENDPOINT_URL = 'http://localhost:3000/api/recommendation';

    let currentLanguage = languageSwitch ? languageSwitch.value : 'he';

    function showSection(sectionToShow, hideOthers = true) {
        const sections = [styleFormSection, loginSection, registerSection];
        sections.forEach(section => {
            if (section) {
                section.style.display = section === sectionToShow ? 'block' : hideOthers ? 'none' : section.style.display;
            }
        });
    }
    const cartButtons = document.querySelectorAll(".add-to-cart");

cartButtons.forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();

    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const image = button.dataset.image;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    showCustomMessageBox('המוצר נוסף לסל!', 'success');
  });
});


    function updateNavbar(user) {
    const userDisplay = document.getElementById('userDisplay');
    const recommendationsLink = document.getElementById('recommendationsLink');
if (recommendationsLink) {
  recommendationsLink.style.display = user ? 'block' : 'none';
}


    if (user) {
        if (loginNavLink) loginNavLink.style.display = 'none';
        if (logoutNavLink) logoutNavLink.style.display = 'block';

        if (userDisplay) {
            userDisplay.style.display = 'block';
            userDisplay.textContent = `שלום, ${user.email}`;
            userDisplay.style.fontWeight = 'bold';
        }
    } else {
        if (loginNavLink) loginNavLink.style.display = 'block';
        if (logoutNavLink) logoutNavLink.style.display = 'none';

        if (userDisplay) {
            userDisplay.style.display = 'none';
            userDisplay.textContent = '';
        }
    }
}
    auth.onAuthStateChanged(user => {
    console.log("Auth state changed:", user ? user.email : "No user");
    updateNavbar(user);

    if (!user) {
        // הסתר הכל פרט להתחברות
        showSection(loginSection);
        document.querySelectorAll('section').forEach(sec => {
            if (sec !== loginSection) sec.style.display = 'none';
        });
        document.getElementById('header').style.display = 'none'; // גם הסתרת header
    } else {
        // הצג מחדש את כל התוכן
        document.getElementById('header').style.display = 'flex'; // או block תלוי בקוד שלך
        document.querySelectorAll('section').forEach(sec => {
            sec.style.display = 'block';
        });
        showSection(styleFormSection); // ובנוסף הדגש את ההמלצה
        const userId = user.uid;
        // בדיקת סטטוס VIP
const profileRef = doc(db, `artifacts/${appId}/users/${userId}/user_profiles`, userId);
getDoc(profileRef).then(docSnap => {
  if (docSnap.exists()) {
    const userData = docSnap.data();
    const vipDiv = document.getElementById('vipBadge');
if (userData.isVIP && vipDiv) {
    vipDiv.style.display = 'inline'; // או 'block' לפי הסגנון שלך
}

  }
});


// שליפת ההמלצה האחרונה
const recRef = doc(db, `users/${userId}/recommendations`, 'latest');
getDoc(recRef).then(docSnap => {
    if (docSnap.exists()) {
        const savedRec = docSnap.data().recommendation;
        if (savedRec) {
            displayRecommendations(savedRec);
            console.log("הוצגה המלצה שמורה מהדאטהבייס");
        }
    } else {
        console.log("אין המלצה שמורה עבור המשתמש");
    }
}).catch(err => {
    console.error("שגיאה בשליפת המלצה שמורה:", err);
});


    }
});
    if (loginNavLink) {
        loginNavLink.addEventListener('click', (event) => {
            event.preventDefault();
            console.log("Login link clicked");
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                showSection(loginSection);
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    if (logoutNavLink) {
        logoutNavLink.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                await signOut(auth);
                showCustomMessageBox('התנתקת בהצלחה!', 'success', () => {
                    window.location.href = 'index.html';
                });
            } catch (error) {
                console.error("Logout error:", error);
                showCustomMessageBox('שגיאה בהתנתקות. נסה שוב.', 'error');
            }
        });
    }

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (event) => {
            event.preventDefault();
            console.log("Show register link clicked");
            showSection(registerSection);
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (event) => {
            event.preventDefault();
            console.log("Show login link clicked");
            showSection(loginSection);
        });
    }

    if (languageSwitch) {
        languageSwitch.addEventListener('change', (event) => {
            currentLanguage = event.target.value;
            console.log(`Language switched to: ${currentLanguage}`);
            document.documentElement.lang = currentLanguage;
            document.documentElement.style.direction = currentLanguage === 'he' ? 'rtl' : 'ltr';
            if (document.querySelector('#style-form-section h2')) {
                document.querySelector('#style-form-section h2').textContent = currentLanguage === 'he' ? 'קבל המלצה מבוססת AI' : 'Get AI-Based Recommendations';
            }
            if (document.querySelector('#styleForm button')) {
                document.querySelector('#styleForm button').textContent = currentLanguage === 'he' ? 'קבל המלצות' : 'Get Recommendations';
            }
        });
    }

    const styleForm = document.getElementById('styleForm');
    if (styleForm) {
        styleForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(styleForm);
            const userPreferences = {};
            for (let [key, value] of formData.entries()) {
                if (["age", "height", "weight"].includes(key)) {
                    userPreferences[key] = parseInt(value, 10);
                } else {
                    userPreferences[key] = value;
                }
            }

            const payload = {
                gender: userPreferences.gender,
                age: userPreferences.age,
                height: userPreferences.height,
                style: userPreferences.stylePreference,
                event: userPreferences.event,
                weather: userPreferences.weather,
                language: currentLanguage
            };

            console.log("Sending payload to backend:", payload);
            recommendationsArea.innerHTML = '<p>טוען המלצות...</p>';

            try {
                const response = await fetch(API_ENDPOINT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                console.log("Response status:", response.status);
                const data = await response.json();
                console.log("Response data:", data);

                if (!response.ok) {
                    throw new Error(data.error || `HTTP error! status: ${response.status}`);
                }

                if (data.success && data.message) {
                    displayRecommendations(data.message);
                    showCustomMessageBox('המלצות הסטייל נטענו בהצלחה!', 'success');
                } else {
                    throw new Error(data.error || 'שגיאה בקבלת המלצות מהשרת');
                }
            } catch (error) {
                console.error("Fetch error:", error.message);
                recommendationsArea.innerHTML = `<p>שגיאה: ${error.message}. נסה שוב.</p>`;
                showCustomMessageBox(error.message || 'שגיאה בקבלת המלצות מהשרת. נסה שוב.', 'error');
            }
        });
    }

    async function displayRecommendations(recommendationText) {
        recommendationsArea.innerHTML = '';

        if (recommendationText && typeof recommendationText === 'string') {
            const tempDiv = document.createElement('div');
            // ניקוי קידוד קוד HTML אם קיים
            const cleanedText = recommendationText.replace(/```html/g, '').replace(/```/g, '');
            tempDiv.innerHTML = cleanedText;


            const searchQueriesTitle = tempDiv.querySelector('.search-queries-title');
            const searchQueryItems = tempDiv.querySelectorAll('.search-query-item');

            const processedSearchItems = [];
            searchQueryItems.forEach(item => {
                const fullText = item.textContent.trim();
                const parts = fullText.split('$$');

                let hebrewItemName, englishSearchQuery;
                if (parts.length === 2) {
                    hebrewItemName = parts[0].trim();
                    englishSearchQuery = parts[1].trim();
                } else {
                    hebrewItemName = fullText;
                    englishSearchQuery = fullText;
                    console.warn("Model did not adhere to 'Hebrew$$English' format for:", fullText);
                }
                processedSearchItems.push({ hebrewItemName, englishSearchQuery });
                item.remove();
            });

            recommendationsArea.innerHTML = tempDiv.innerHTML;

            const searchLinksContainer = document.createElement('div');
            searchLinksContainer.className = 'search-links-container mt-4';

            if (searchQueriesTitle) {
                searchLinksContainer.appendChild(searchQueriesTitle);
            }

            processedSearchItems.forEach(item => {
                const encodedQuery = encodeURIComponent(item.englishSearchQuery);

                const links = {
                    'Amazon': `https://www.amazon.com/s?k=${encodedQuery}`,
                    'Zara': `https://www.zara.com/il/en/search?searchTerm=${encodedQuery}`,
                    'Farfetch': `https://www.farfetch.com/il/shopping/women/items.aspx?q=${encodedQuery}`,
                    'ASOS': `https://www.asos.com/search/?q=${encodedQuery}`
                };

                const itemCategoryWrapper = document.createElement('div');
                itemCategoryWrapper.style.marginBottom = '15px';

                Object.entries(links).forEach(([storeName, url]) => {
                    const linkSpan = document.createElement('span');
                    linkSpan.style.marginRight = '20px';

                    const link = document.createElement('a');
                    link.href = url;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.textContent = item.hebrewItemName;
                    link.style.fontWeight = 'bold';

                    const storeNameText = document.createElement('span');
                    storeNameText.textContent = ` (${storeName})`;
                    storeNameText.style.fontSize = '0.9em';
                    storeNameText.style.color = '#555';

                    linkSpan.appendChild(link);
                    linkSpan.appendChild(storeNameText);
                    itemCategoryWrapper.appendChild(linkSpan);
                });
                searchLinksContainer.appendChild(itemCategoryWrapper);
            });

            recommendationsArea.appendChild(searchLinksContainer);
            // שמור המלצה ב-Firestore עבור המשתמש המחובר
const user = auth.currentUser;
if (user && recommendationText) {
    const userId = user.uid;

    // שמירת ההמלצה האחרונה (latest)
    const latestRef = doc(db, `artifacts/${appId}/users/${userId}/recommendations`, 'latest');
    await setDoc(latestRef, {
        recommendation: recommendationText,
        savedAt: new Date()
    });

    // שמירת ההמלצה גם עם מזהה ייחודי להיסטוריה
    const recId = `rec-${Date.now()}`;
    const historyRef = doc(db, `artifacts/${appId}/users/${userId}/recommendations`, recId);
    await setDoc(historyRef, {
        recommendation: recommendationText,
        savedAt: new Date()
    });

    console.log("ההמלצה נשמרה בהצלחה (latest + היסטוריה)");
}


        } else {
            recommendationsArea.innerHTML = '<p>לא התקבל טקסט המלצה תקין מהשרת.</p>';
        }
    }

    function showCustomMessageBox(message, type = 'info', onConfirm = null) {
        const messageBox = document.createElement('div');
        messageBox.className = `custom-message-box ${type}`;
        messageBox.innerHTML = `<p>${message}</p><button>אישור</button>`;
        document.body.appendChild(messageBox);

        const button = messageBox.querySelector('button');
        button.focus();
        button.onclick = () => {
            messageBox.remove();
            if (onConfirm) {
                onConfirm();
            }
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                messageBox.remove();
                if (onConfirm) {
                    onConfirm();
                }
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }
    async function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    console.log("Attempting registration with:", email);

    if (!email || !password) {
        showCustomMessageBox('אנא מלא את כל השדות.', 'error');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userId = user.uid;

        console.log("User registered:", userId, email);

        await setDoc(doc(db, `users/${userId}/user_profiles`, userId), {
            email: email,
            createdAt: new Date().toISOString()
        });

        console.log("User profile saved to Firestore");

        showCustomMessageBox('ההרשמה בוצעה בהצלחה! כעת ניתן להתחבר.', 'success', () => {
            document.getElementById('registerForm').reset();
            showSection(loginSection);
        });

    } catch (error) {
        console.error("Registration error:", error.code, error.message);
        let errorMessage = 'אירעה שגיאה בהרשמה.';

        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'כתובת אימייל זו כבר בשימוש. אנא התחבר.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'הסיסמה חלשה מדי. אנא בחר סיסמה חזקה יותר (לפחות 6 תווים).';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'כתובת אימייל לא חוקית.';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'שגיאת רשת. בדוק את חיבור האינטרנט שלך.';
        }

        showCustomMessageBox(errorMessage, 'error');
    }
}



    async function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        console.log("Attempting login with:", email);
        if (!email || !password) {
            showCustomMessageBox('אנא מלא את כל השדות.', 'error');
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Login successful:", userCredential.user.email);
            await incrementLoginCount(userCredential.user.uid);
            showCustomMessageBox('התחברת בהצלחה!', 'success', () => {
                console.log("Redirecting to index.html after login confirmation");
                if (!window.location.pathname.includes('index.html')) {
                    window.location.href = 'index.html';
                } else {
                    showSection(styleFormSection);
                }
            });
        } catch (error) {
            console.error("Login error:", error.code, error.message);
            let errorMessage = 'שם משתמש או סיסמה שגויים.';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'משתמש לא נמצא. אנא הירשם.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'סיסמה שגויה.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'כתובת אימייל לא חוקית.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'שגיאת רשת. בדוק את חיבור האינטרנט שלך.';
            }
            showCustomMessageBox(errorMessage, 'error');
        }
    }
    async function incrementLoginCount(userId) {
  const userRef = doc(db, `artifacts/${appId}/users/${userId}/user_profiles`, userId);

  try {
    // נשלב עדכון לכניסה ראשונית
    await setDoc(userRef, {
      lastLogin: new Date().toISOString(),
    }, { merge: true });

    // שליפת הפרופיל הנוכחי
    const docSnap = await getDoc(userRef);
    let currentCount = 0;
    let isAlreadyVIP = false;

    if (docSnap.exists()) {
      const data = docSnap.data();
      currentCount = data.loginCount || 0;
      isAlreadyVIP = data.isVIP || false;
    }

    const newCount = currentCount + 1;
    const updateData = {
      loginCount: newCount,
      lastLogin: new Date().toISOString()
    };

    // אם עבר את הסף ועדיין לא VIP – נעדכן
    if (!isAlreadyVIP && newCount >= 5) {
      updateData.isVIP = true;
      console.log("🚀 המשתמש הפך ל-VIP!");
    }

    await setDoc(userRef, updateData, { merge: true });

  } catch (error) {
    console.error("שגיאה בעדכון מונה כניסות / VIP:", error);
  }
}

 


    waitForAuthReady(() => {
        console.log("Attaching event listeners to forms");
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.removeAttribute('onsubmit');
            loginForm.addEventListener('submit', (event) => {
                console.log("Login form submitted");
                handleLogin(event);
            });
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.removeAttribute('onsubmit');
            registerForm.addEventListener('submit', (event) => {
                console.log("Register form submitted");
                handleRegister(event);
            });
        }
    });

    function waitForAuthReady(callback) {
        if (window.isAuthReady) {
            console.log("Auth ready, executing callback");
            callback();
        } else {
            console.log("Waiting for auth to be ready...");
            const checkInterval = setInterval(() => {
                if (window.isAuthReady) {
                    console.log("Auth ready after wait, executing callback");
                    clearInterval(checkInterval);
                    callback();
                }
            }, 100);
        }
    }
});