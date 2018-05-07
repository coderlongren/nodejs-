var DB = require('./db');
var markdown = require('markdown').markdown;
var mongodb = new DB();
var mongo = require('mongodb');
function Post(name, title, post) {
	this.name = name;
	this.title = title;
	this.post = post;
}
// 导出此模块
module.exports = Post;

Post.prototype.save = function(callback) {
  var date = new Date();
  //存储各种时间格式，方便以后扩展
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
  }
  //要存入数据库的文档
  var post = {
      name: this.name,
      time: time,
      title: this.title,
      post: this.post
  };
  mongodb.insert(post,'posts',function(err,result){
    if(err){
      return callback(err);//错误，返回 err 信息
    }
    callback(null, post);
  });
};

//读取文章及其相关信息
Post.getAll = function(name, callback) {
    var query = {};
    if (name) {
      query.name = name;
    }
    mongodb.find(query,'posts',function(err,docs){
        if (err) {
           return callback(err);//错误，返回 err 信息
         }
         docs.forEach(function (doc) {
  			doc.post = markdown.toHTML(doc.post);
		 });
         callback(null, docs);//成功！err 为 null，并返回存储后的用户文档
    });
};
//获取一篇文章
Post.getOne = function(name,title,callback) {
    var query = {};
    query.name = name;
    query.title = title;
    mongodb.find(query,'posts',function(err,docs){
        if (err) {
           return callback(err);//错误，返回 err 信息
         }
         docs.forEach(function (doc) {
  			doc.post = markdown.toHTML(doc.post);
		 });
         callback(null, docs);//成功！err 为 null，并返回存储后的用户文档
    });
};

//返回原始发表的内容（markdown 格式）
Post.edit = function(name,  title, callback) {
  	var query = {};
    query.name = name;
    query.title = title;
    mongodb.find(query,'posts',function(err,docs){
        if (err) {
           return callback(err);//错误，返回 err 信息
         }
         callback(null, docs);//成功！err 为 null，并返回存储后的用户文档
    });
};

//更新一篇文章及其相关信息
Post.update = function(name, title, post, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新文章内容
      collection.update({
        "name": name,
        "time.day": day,
        "title": title
      }, {
        $set: {post: post}
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};