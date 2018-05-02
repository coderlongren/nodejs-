var express = require('express');
var router = express.Router();

/* GET query page. */
router.get('/', function(req, res, next) {
  console.log(req.query.)
  res.render('test', { title: '这是一个测试页面' });
});

module.exports = router;