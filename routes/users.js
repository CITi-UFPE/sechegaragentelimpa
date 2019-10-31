const express = require('express');
const app = express();
const { db } = require('../providers/firebase');

app.post('/', async (req, res) => {
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

app.get('/', async (req, res) => {
  const snapshot = await db.ref('users/').once('value');
  res.send(snapshot.val());
});


module.exports = app;
