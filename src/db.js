import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCPBHXebSbe3P9tMRz0RI-z6sEI8yrtTmM",
  authDomain: "projectmonitor-bfddb.firebaseapp.com",
  projectId: "projectmonitor-bfddb",
  storageBucket: "projectmonitor-bfddb.appspot.com",
  messagingSenderId: "100999010397",
  appId: "1:100999010397:web:ad4a43baa746d912ba15b4",
  measurementId: "G-PY7YFS0NFN"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp.firestore();
