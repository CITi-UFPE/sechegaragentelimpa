const router = require('express').Router();
const { db } = require('../providers/firebase.db');

console.log('object');

router.route('/').post(async (req, res) => {
  try {
    const {
      id,
      img,
      name,
    } = req.body;

    console.log('object');

    await db.ref('users/').child(id).set({
      img,
      name,
    });
  } catch (err) {
    res.send(err);
  }
});

router.route('/').get(async (req, res) => {
  const snapshot = await db.ref('users/').once('value');
  res.send(snapshot.val());
});


module.exports = router;
