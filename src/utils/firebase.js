import firebase from "firebase/app";
import "firebase/firestore";

/** initialize Firebase */
const firebaseConfig = {
  apiKey: "AIzaSyDyq2jsiRdldzTsHgv-mhwqIpl26UghfXs",
  authDomain: "video-chat-4c7a1.firebaseapp.com",
  projectId: "video-chat-4c7a1",
  storageBucket: "video-chat-4c7a1.appspot.com",
  messagingSenderId: "692481784341",
  appId: "1:692481784341:web:857a8d32dcea6c875aec1c",
  measurementId: "G-409E85E7D0",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const firestore = firebase.firestore();