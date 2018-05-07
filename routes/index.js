var express = require('express');
var crypto  = require('crypto'); // node的核心模块，主要用来加密
var User = require('../models/user.js');
var Post = require('../models/post.js');
var router = express.Router();

/* GET home page. */
module.exports = function(app) {
	app.get('/', function(req, res) {
		Post.getAll(null, function(err, posts) {
			if (err) {
				posts = [];
			}
			res.render('index', { title: '主页',
			posts: posts,
 		 	user: req.session.user,
 		 	success: req.flash('success').toString(),
 		 	error: req.flash('error').toString()
 		 });
		});
	});
	// 添加一些指向用户文章的路由
	app.get('/u/:name/:title', function (req, res) {
	  // 使用req.params.属性 来获得url里面的参数
		Post.getOne(req.params.name, req.params.title,function (err, post) {
	      if (err) {
	        req.flash('error', err); 
	        return res.redirect('/');
	      } 
	      console.log(post[0].post);
	      // var post = post[]
	      res.render('article', {
	        post: post[0].post,
	        time: post[0].time.day,
	        title: post[0].title,
	        user : req.session.user,
	        success : req.flash('success').toString(),
	        error : req.flash('error').toString()
	      });
	    });
	});
	app.get('/edit/:name/:title', checkLogin);
	app.get('/edit/:name/:title', function (req, res) {
	  var currentUser = req.session.user;
	  Post.edit(currentUser.name, req.params.title, function (err, post) {
	    if (err) {
	      req.flash('error', err); 
	      return res.redirect('back');
	    }
	    var tempPost = post[0];
	    res.render('edit', {
	      title: '编辑',
	      post: tempPost,
	      user: req.session.user,
	      success: req.flash('success').toString(),
	      error: req.flash('error').toString()
	    });
	  });
	});


	app.get('/reg', checkNotLogin);
	app.get('/reg', function(req, res) {
 		 res.render('reg', { title: '注册',
 		 	user: req.session.user,
 		 	success: req.flash('success').toString(),
 		 	error: req.flash('error').toString()
 		 });
	});

	app.post('/reg', checkNotLogin);
	app.post('/reg', function(req, res) {
		var name = req.body.name;
		var password = req.body.password;
		var password_repeat = req.body['password_repeat'];
		if (password != password_repeat) {
			req.flash('error','输入秘密不一致'); // 输入秘密不一致
			return res.redirect('/reg');
		}
		var md5 = crypto.createHash('md5');
		var password = md5.update(password).digest('hex');
		var newUser = new User({
			name: name,
			password: password,
			email: req.body.email
		});
		console.log("在注册JS代码里面" + name + ":" + password);
		// console.log('用户名 ： ' + newUser.name + ',' + '密码 ： ' +  newUser.password);
		// 检查用户名是否存在
		User.get(newUser.name, function(err, user) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/reg');
			}
			if (user) {
				req.flash('error', '用户已存在,自动登录');
				console.log("此用户已存在，请登录");
				return res.redirect('/');
			}
			// 不存在此用户，则创建一个新用户
			console.log('不存在此用户需要重建');
			newUser.save(function(err, user) {
				if (err) {
        			req.flash('error', err);
       				return res.redirect('/reg');//注册失败返回主册页
      			}
     		 	req.session.user = user;//用户信息存入 session
     		 	console.log('连接成功了吗');
      			req.flash('success', '注册成功!');
      			res.redirect('/');//注册成功后返回主页
			});
		});
	});
	app.get('/login', checkNotLogin);
	app.get('/login', function(req, res) {
 		res.render('login', {
        title: '登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()});
	});
	app.post('/login',checkNotLogin);
	app.post('/login', function(req, res) {
 		 console.log(req.body.name + ":" + req.body.password);
 		 // 生成密码的MD5 值
 		 var md5 = crypto.createHash('md5');
 		 var password = md5.update(req.body.password).digest('hex');

 		 User.get(req.body.name, function(err,user) {
 		 	if (!user) {
 		 		req.flash('error', '用户不存在');
 		 		return res.redirect('/login'); // 重定向登录界面
 		 	}
 		 	// password是否一致
 		 	if (user.password != password) {
		      	req.flash('error', '密码错误!'); 
		      	return res.redirect('/login');//密码错误则跳转到登录页
		    }

		    //用户名密码都匹配后，将用户信息存入 session
		    req.session.user = user;
		    req.flash('success', '登陆成功!');
		    res.redirect('/');//登陆成功后跳转到主页
 		 })
	});
	app.get('/post',checkLogin);// 如果没登录重定向到登录界面
	app.get('/post', function(req, res) {
 		 res.render('post', { title: '发表', 
 		 	user:req.session.user,
 		 	success: req.flash('success').toString(),
 		 	error: req.flash('error').toString()
 		});
	});
	app.post('/post',checkLogin);
	app.post('/post', function(req, res) {
 		var curUserName = req.session.user.name;
 		var post = new Post(curUserName, req.body.title, req.body.post);
		post.save(function(err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success', '发布成功');
			res.redirect('/');// 发表成功后重定向主页
		});	 
	});
	app.get('/logout',checkLogin);
	app.get('/logout', function(req, res) {
		req.session.user = null;
		req.flash('success', '登出成功！');
		res.redirect('/'); // 重定向主页
	});
	app.get('/upload', checkLogin);
	app.get('/upload', function(req, res) {
		res.render('upload', {
			title: "上传文件",
			user: req.session.user, 
			success : req.flash('success').toString(),
			error : req.flash('error').toString()
		});
	});
	app.post('/upload', checkLogin);
	app.post('/upload', function(req, res) {
		req.flash('success', '文件上传成功');
		res.redirect('/upload');
	});
	app.get('/u/:name', function (req, res) {
  //检查用户是否存在
	  User.get(req.params.name, function (err, user) {
	    if (!user) {
	      req.flash('error', '用户不存在!'); 
	      return res.redirect('/');//用户不存在则跳转到主页
	    }
	    //查询并返回该用户的所有文章
	    Post.getAll(user.name, function (err, posts) {
	      if (err) {
	        req.flash('error', err); 
	        return res.redirect('/');
	      } 
	      res.render('user', {
	        title: user.name,
	        posts: posts,
	        user : req.session.user,
	        success : req.flash('success').toString(),
	        error : req.flash('error').toString()
	      });
	    });
	  }); 
	});


	app.use(function(req, res) {
		res.render('404');
	})

	function checkLogin(req, res, next) {
    	if (!req.session.user) {
     		req.flash('error', '未登录!'); 
      		res.redirect('/login');
    	}
    	next(); //移交控制权
  	}

  function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登录!'); 
      res.redirect('back');
    }
    next();
  }
}
