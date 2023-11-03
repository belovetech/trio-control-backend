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

type Credential = {
  email: string;
  password: string;
};

const credentials: Credential[] = [
  {
    email: 'usera@gmail.com',
    password: 'P@ssword123',
  },

  {
    email: 'userb@gmail.com',
    password: 'P@ssword234',
  },

  {
    email: 'userc@gmail.com',
    password: 'P@ssword345',
  },
];

const auth = getAuth();

(async function signin(credentials: Credential[]) {
  try {
    for (const credential of credentials) {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credential.email,
        credential.password,
      );

      const user = userCredential.user;
      console.log(await user.getIdToken());
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  }
})(credentials);
