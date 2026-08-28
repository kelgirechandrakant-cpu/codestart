const { signInWithPopup, GoogleAuthProvider } = require('firebase/auth');
const provider = new GoogleAuthProvider();
try {
  signInWithPopup({}, provider).catch(e => console.log('ASYNC ERROR:', e.message));
} catch(e) {
  console.log('SYNC ERROR:', e.message);
}
