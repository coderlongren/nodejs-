var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var settings = require('./settings');// 自己写的配置文件         

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/test')

// 生成一个Express应用
var app = express();

// view engine setup  使用 ejs模板
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // 

app.use(logger('dev')); // 加载日志中间件
app.use(express.json()); // 解析JSon的中间件
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 默认的Node中间件， 指定存放静态文件的目录: public 
app.use(express.static(path.join(__dirname, 'public')));

// 路由控制器
indexRouter(app);
usersRouter(app);
testRouter(app);

// 下面两个中间件用于 处理错误异常
// catch 404 and forward to error handler 
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler 错误中间件
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');  // 使用 render函数渲染模板
});

module.exports = app;
