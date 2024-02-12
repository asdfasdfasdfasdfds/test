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
  apiKey: "AIzaSyBxe5kmXD8ClLs8TOF84h6e0BMNZVCs0u0",
  authDomain: "battalyemekhane.firebaseapp.com",
  projectId: "battalyemekhane",
  storageBucket: "battalyemekhane.appspot.com",
  messagingSenderId: "391702591939",
  appId: "1:391702591939:web:8dcc6498506d02a054a576",
};

const app = initializeApp(firebaseConfig);
const app2 = initializeApp(firebaseConfig2, "yemekhane");
export const firestore = getFirestore(app);
export const db = getFirestore(app2);
