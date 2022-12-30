import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
    apiKey: "AIzaSyBxXAkSlCxyjpOeFicsYd_mm9W2KIQBEgA",
    authDomain: "chat-app-7934c.firebaseapp.com",
    projectId: "chat-app-7934c",
    storageBucket: "chat-app-7934c.appspot.com",
    messagingSenderId: "458611726256",
    appId: "1:458611726256:web:e08d808bc70f860f582875"
  };

  export const app = initializeApp(firebaseConfig);
  export const storage = getStorage(app);