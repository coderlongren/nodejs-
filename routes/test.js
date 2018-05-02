var express = require('express');
var router = express.Router();

/* GET test page. */
// router.get('/', function(req, res, next) {
//   // console.log(req.query.)
//   // res.send('Hello world');
//   res.render('test', { title: '这是一个测试页面', supplies:['任赛龙','王亚可', '张文鸽']});
// });

module.exports = function(app) {
	app.get('/test', function(req, res, next) {
		res.render('test', {title: '这是一个测试页面', supplies:['任赛龙','王亚可', '张文鸽']})
	});
};