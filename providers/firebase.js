const firebase = require('firebase');

require('dotenv').config();

firebase.initializeApp({
    apiKey: process.env.API_KEY,
    authDomain: "sechegaragentelimpa-9d9d0.firebaseapp.com",
    databaseURL: "https://sechegaragentelimpa-9d9d0.firebaseio.com",
    projectId: "sechegaragentelimpa-9d9d0",
    storageBucket: "sechegaragentelimpa-9d9d0.appspot.com",
    messagingSenderId: "372909306254",
    appId: "1:372909306254:web:66b0febebba812852af4df",
    measurementId: "G-YX93175YCL"
})

module.exports = {
    db: firebase.database(),
}