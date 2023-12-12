

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";




const firebaseConfig = {
  apiKey: "AIzaSyD5dZl9rNMPkbooYf-Rhim7oncTXtnvL_g",
  authDomain: "its-todo-list.firebaseapp.com",
  databaseURL: "https://its-todo-list-default-rtdb.firebaseio.com",
  projectId: "its-todo-list",
  storageBucket: "its-todo-list.appspot.com",
  messagingSenderId: "138248332688",
  appId: "1:138248332688:web:d2695166b219b02a723f15",
  measurementId: "G-DFZ37S4PPX"
};




const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);

export { app, analytics, db, auth };