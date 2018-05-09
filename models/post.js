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
      post: this.post,
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
Post.getOne = function(name,day,title,callback) {
    var query = {};
    query.name = name;
    query.title = title;
    query.time = day;
    console.log(query.toString());
    mongodb.findOne(query,'posts',function(err,docs){
        if (err) {
           return callback(err);//错误，返回 err 信息
         }
         callback(null, docs);//成功！err 为 null，并返回存储后的用户文档
    });
};

//返回原始发表的内容（markdown 格式）
Post.edit = function(name, day, title, callback) {
  	var query = {};
    query.name = name;
    query.title = title;
    query.time = day;
    mongodb.findEdit(query,'posts',function(err,docs){
        if (err) {
           return callback(err);//错误，返回 err 信息
         }
         callback(null, docs);//成功！err 为 null，并返回存储后的用户文档
    });
};

//更新一篇文章及其相关信息
Post.update = function(name,day, title, post, callback) {
    var query = {};
    query.name = name;
    query.title = title;
    query.post = post;
    query.time = day;
 	mongodb.update(query, 'posts', function(err) {
 		if (err) {
 			return callback(err);
 		}
 		callback(null);
 	});
};

//删除一篇文章
Post.remove = function(name,day, title, callback) {
	var query = {};
    query.name = name;
    query.title = title;
    query.time = day;
 	mongodb.delete(query, 'posts', function(err) {
 		if (err) {
 			return callback(err);
 		}
 		callback(null);
 	});
};