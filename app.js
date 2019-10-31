// ==================== EXTERNAL IMPORTS ==================== //

const express = require('express');
const path = require('path');
const cors = require('cors');
const { db } = require('./providers/firebase.db');

const userRoute = require('./routes/users.route');

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

// ==================== ROUTES ==================== //

// ==================== RENDER VIEWS ==================== //

app.get('/', (req, res) => {
    res.sendFile(getViewPath('home'));
});

app.post('/',(req,res) => {
    const key = req.body.lat.toString().replace('.', ',') + req.body.lat.toString().replace('.', ',')
    if(req.body.remove){
        db.ref('positions/').child(key).remove()
    } else {
        db.ref('positions/').child(key).set({
             lat:req.body.lat,
             long:req.body.long
        });
    }
});

app.get('/positions', (req,res) => {
    db.ref('positions/').once('value').then((snapshot) => {
        res.json(snapshot.val());
    });
});

app.use('/users/', userRoute);
// ==================== START SERVER ==================== //

app.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT}`);
});

// ====================================================== //
