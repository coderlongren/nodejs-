var express = require('express');
var router = express.Router();

/* GET home page. */

module.exports = function(app) {
	app.get('/', function(req, res) {
 		 res.render('index', { title: '主页' });
	});
	app.get('/reg', function(req, res) {
 		 res.render('reg', { title: '注册' });
 		 console.log('输入的用户名:' +name);
	});
	app.post('/reg', function(req, res) {
		var name = req.body.name;
		var password = req.body.password;
		var password_repeat = req.body['password_repeat'];
		// if (password != password_repeat) {
		// 	req.flash('error'); // 输入秘密不一致
		// 	return res.redicect('/reg');
		// }
		// else {
		// 	return res.redicect('');
		// }
		console.log('输入的用户名:' +name);
		return res.redirect('/');

	});
	app.get('/login', function(req, res) {
 		 res.render('login', { title: '登录' });
	});
	app.post('/', function(req, res) {
 		 
	});
	app.get('/post', function(req, res) {
 		 res.render('post', { title: '发表' });
	});
	app.post('/post', function(req, res) {
 		 
	});
	app.get('/logout', function(req, res) {

	})


}
