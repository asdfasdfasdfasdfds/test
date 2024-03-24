import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE,
  messagingSenderId: process.env.REACT_APP_SENDER,
  appId: process.env.REACT_APP_ID,
};

const firebaseConfig2 = {
  apiKey: process.env.REACT_APP_API2,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN2,
  projectId: process.env.REACT_APP_PROJECT_ID2,
  storageBucket: process.env.REACT_APP_STORAGE2,
  messagingSenderId: process.env.REACT_APP_SENDER2,
  appId: process.env.REACT_APP_ID2,
};

const app = initializeApp(firebaseConfig);
const app2 = initializeApp(firebaseConfig2, "yemekhane");
export const firestore = getFirestore(app);
export const db = getFirestore(app2);
