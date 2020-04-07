import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app';
import 'firebase/firestore';

Vue.use(firestorePlugin);

const firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyDq661XbgdxOPVUsIm_O_a5Ydl-KScGYII",
        authDomain: "feedal-corona.firebaseapp.com",
        databaseURL: "https://feedal-corona.firebaseio.com",
        projectId: "feedal-corona",
        storageBucket: "feedal-corona.appspot.com",
        messagingSenderId: "1002693179895",
        appId: "1:1002693179895:web:885e07811af830675416f2",
        measurementId: "G-2T602FT2S0"
});

export const db = firebaseApp.firestore();
