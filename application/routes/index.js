var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/life', function(req, res, next) {
  const lifes = [{ name: 'Toshi', age: "25" }, { name: 'Yukari', age: "24" } ]
  res.render('life/index', { lifes});
});

router.get('/life/new', function(req, res, next) {
  res.render('life/new', { title: 'Express' });
});

router.post('/life/new', function(req, res, next) {
  res.render('life/show', { life: { name: 'Toshi', age: "25" } });
});

router.get('/life/:lifeId', function(req, res, next) {
  res.render('life/show', {life: { name: 'Toshi', age: "25" } });
});


module.exports = router;
