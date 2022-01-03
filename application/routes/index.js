const { request } = require('express');
var express = require('express');
var router = express.Router();
const LifeContract = require('../contract/lifeContract');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/life', function(req, res, next) {
  res.render('life/index', { lifes});
});

router.get('/life/new', function(req, res, next) {
  res.render('life/new', { title: 'Express' });
});

router.post('/life/new', async function(req, res, next) {
  const lifeContract = new LifeContract()
  const life = { id: req.body.id, age: req.body.age, name: req.body.name }
  const result = await lifeContract.createLife(life)
  res.redirect("/life/" + life.id)
});

router.get('/life/:lifeId', async function(req, res, next) {
  const lifeContract = new LifeContract()
  const result = await lifeContract.readLife(req.params.lifeId)
  const life = JSON.parse(result.value)
  res.render('life/show', { life });
});


module.exports = router;
