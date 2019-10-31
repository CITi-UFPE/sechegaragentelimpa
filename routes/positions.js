const express = require('express');
const app = express();
const { db } = require('../providers/firebase')

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

app.get('/', (req,res) => {
    db.ref('positions/').once('value').then((snapshot) => {
        res.json(snapshot.val());
    });
});

module.exports = app;
