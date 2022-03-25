import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDRwZAvIKzLVFwJJ_n_fBl3hTaA_EH_i3g",
  authDomain: "dwf-m6-ale.firebaseapp.com",
  databaseURL: "https://dwf-m6-ale-default-rtdb.firebaseio.com",
  projectId: "dwf-m6-ale",
  storageBucket: "dwf-m6-ale.appspot.com",
  messagingSenderId: "484313522856",
  appId: "1:484313522856:web:c60039b02fb75a79edd89d",
  measurementId: "G-SF6ZRD1PK3",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const rtdb = getDatabase();

export { rtdb, ref, onValue };
