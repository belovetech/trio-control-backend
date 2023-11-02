import * as firebase from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBXJmXFSbgML_VPFpGtOQyhwrzsjBAtENM',
  authDomain: 'trio-control.firebaseapp.com',
  projectId: 'trio-control',
  storageBucket: 'trio-control.appspot.com',
  messagingSenderId: '869310323962',
  appId: '1:869310323962:web:44b2ec535a74882853bd43',
  measurementId: 'G-8FNPN4W87K',
};
firebase.initializeApp(firebaseConfig);

// Initialize Firebase
const email = 'userc@gmail.com';
const password = 'P@ssword345';

const auth = getAuth();

(async function signin() {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;
    console.log(await user.getIdToken());
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  }
})();
