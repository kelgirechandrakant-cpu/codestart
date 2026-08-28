const { initializeApp } = require('firebase/app');
const { getAuth, signInWithPopup, GoogleAuthProvider } = require('firebase/auth');

const app = initializeApp({ apiKey: 'test-key' });
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

try {
  signInWithPopup(auth, provider).catch(e => console.log('ERROR MESSAGE:', e.message));
} catch(e) {
  console.log('SYNC ERROR:', e.message);
}
