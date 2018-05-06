var createError = require('http-errors');

/*引入 文件读写模块*/
var fs = require('fs'); 
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var settings = require('./settings');// 自己写的配置文件         
var flash = require('connect-flash');
var multer = require('multer'); // 文件上传模块


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/test')

var session = require('express-session'); // 保存会话的 依赖
var MongoStore = require('connect-mongo')(session);

// 生成一个Express应用
var app = express();

// view engine setup  使用 ejs模板
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // 
app.use(flash());

app.use(logger('dev')); // 加载日志中间件
app.use(logger({stream:accessLog}))
app.use(express.json()); // 解析JSon的中间件
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 默认的Node中间件， 指定存放静态文件的目录: public 
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (err, req, res, next) {
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  next(); // 控制权移交给系统所有
});

// APP使用multer中间件
app.use(multer({
    dest : './public/images',
    rename : function(filedname, filename) {
      return filename;
    }
}));

// 使用 Session中间件
app.use(session({
  secret: settings.cookieSecret, //一个String类型的字符串，作为服务器端生成session的签名。与cookieParser中的一致
  saveUninitialized:false, //在存储一些新数据之前，不创建session
  resave: false, //如果没有发生任何修改不储存session。
    store:new MongoStore({
    url:settings.url,
    //ttl: 3*24*60*60,
    touchAfter:24*3600 //单位是秒，24小时内，无论你发多少个请求，session之后被更新一次
    })
}));


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