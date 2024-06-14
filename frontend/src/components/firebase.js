// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyCSz9atjam15VW6ZfKhCmkYqxkKIOEb3p8",
    authDomain: "evaluation-system-2ad69.firebaseapp.com",
    projectId: "evaluation-system-2ad69",
    storageBucket: "evaluation-system-2ad69.appspot.com",
    messagingSenderId: "794004257787",
    appId: "1:794004257787:web:34b4d4093a080d43f2295e",
    measurementId: "G-9286N8WXCZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);