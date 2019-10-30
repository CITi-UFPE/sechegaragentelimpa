// ==================== EXTERNAL IMPORTS ==================== //

const express = require('express');
const path = require('path');
const cors = require('cors');
const firebase = require('firebase');

require('dotenv').config();

// ==================== INTERNAL IMPORTS ==================== //

// ==================== GLOBAL VARIABLES ==================== //

const app = express();

// ==================== MIDDLEWARE ==================== //

app.use(cors());
app.use(express.json());
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/static', express.static(path.join(__dirname, 'static')));

// ==================== FUNCTIONS ==================== //

// returns the full path of the passed view
const getViewPath = view => path.join(__dirname, `views/${view}/${view}.html`);

// ==================== DATABASE ==================== //
firebase.initializeApp({
    apiKey: "AIzaSyA9S4Wy6neP65df7tW3t-QejHbxDOsXfH8",
    authDomain: "sechegaragentelimpa-9d9d0.firebaseapp.com",
    databaseURL: "https://sechegaragentelimpa-9d9d0.firebaseio.com",
    projectId: "sechegaragentelimpa-9d9d0",
    storageBucket: "sechegaragentelimpa-9d9d0.appspot.com",
    messagingSenderId: "372909306254",
    appId: "1:372909306254:web:66b0febebba812852af4df",
    measurementId: "G-YX93175YCL"
  })
  
  const db = firebase.database();
// ==================== ROUTES ==================== //

// ==================== RENDER VIEWS ==================== //

app.get('/', (req, res) => {
    res.sendFile(getViewPath('home'));
});

app.post('/', async (req, res) => {
  try {
      const key = req.body.lat.toString().replace('.', ',') + req.body.lat.toString().replace('.', ',')
      if (req.body.remove) {
          await db.ref('positions/').child(key).remove();
          res.send('deleted');
      } else {
          await db.ref('positions/').child(key).set({
              lat: req.body.lat,
              long: req.body.long
          });
          res.send('created');
      }
  } catch (err) {
      console.log(err);
      res.status(500).send(err);
  }
});

// db.ref('positions').set(''); 

app.get('/positions', (req,res) => {
    db.ref('positions/').once('value').then((snapshot) => {
        res.json(snapshot.val());
    });
});

app.post('/user', async (req, res) => {
    try {
        const { 
            id,
            img,
            name,
        } = req.body;
    
        await db.ref('users/').child(id).set({
            img,
            name,
        });
    } catch (err) {
        res.send(err);
    }
});

app.get('/users', async (req, res) => {
    const snapshot = await db.ref('users/').once('value');
    res.send(snapshot.val());
});

// ==================== START SERVER ==================== //

app.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT}`);
});

// ====================================================== //
