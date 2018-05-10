var MongoClient = require('mongodb').MongoClient;
var settings = require('../settings');
var markdown = require('markdown').markdown;
function Db(){
 this.url = settings.url; 
}
module.exports = Db;

// 自定义的 insert方法, prototype公用属性
Db.prototype.insert = function(data,col,cb){

  var insertData = function(db,callback) { 
     
    //连接到表col
    var collection = db.collection(col);
    //插入数据
    collection.insert(data, function(err, result) { 
        if(err)
        {
            console.log('Error:'+ err);
            return cb(err);
        }
        callback(null,result);
    });
  }
 
  MongoClient.connect(this.url, function(err, db) {
    console.log("连接成功！");
    insertData(db, function(newerr,result) {
        db.close();
        cb(null,result);
    });
  }); 
}
// 自定义的 查找方法
Db.prototype.find = function(data,col,cb){

 var selectData = function(db, callback) {  
  //连接到表  
  var collection = db.collection(col);
  //查询数据
  var whereStr = data;
  collection.find(whereStr).sort({
    time: -1
  }).toArray(function(err, result) {
    if(err)
    {
      return cb(err);
    } 
    callback(null,result);
  });
}
 
 MongoClient.connect(this.url, function(err, db) {
  console.log("连接成功！");
  selectData(db, function(newerr,result) {
    db.close();
    cb(null,result);
  });
 });
}


Db.prototype.findOne = function(data,col,cb){
  MongoClient.connect(this.url, function(err, db) {
    console.log("连接成功！");
    var collection = db.collection(col);
    collection.findOne({
      "name":data.name,
      "time.day":data.time,
      "title":data.title
    }, function(err, doc) {
      db.close();
        if (err) {
          return callback(err);
        }
        //解析 markdown 为 html
        doc.post = markdown.toHTML(doc.post);
        cb(null, doc);//返回查询的一篇文章
      });
    });
};
 Db.prototype.findEdit = function(data,col,cb){
  MongoClient.connect(this.url, function(err, db) {
    console.log("连接成功！");
    var collection = db.collection(col);
    collection.findOne({
      "name":data.name,
      "time.day":data.time,
      "title":data.title
    }, function(err, doc) {
      db.close();
        if (err) {
          return callback(err);
        }
        //解析 markdown 为 html
        // doc.post = markdown.toHTML(doc.post);
        cb(null, doc);//返回查询的一篇文章
      });
    });
};


Db.prototype.update = function(data,col,cb){
  MongoClient.connect(this.url, function(err, db) {
    console.log("连接成功！");
    var whereStr  = {"name":data.name,"time.day":data.time,"title":data.title};
    var updateStr = {$set: {"post":data.post}};
    var collection = db.collection(col);
    collection.updateOne(whereStr, updateStr, function(err, res) {
        if (err) throw err;
        console.log("文档更新成功");
        cb(null);
        db.close();
    });
    });
};
// MongoDB 删除数据
Db.prototype.delete = function(data,col,cb){
  MongoClient.connect(this.url, function(err, db) {
    console.log("连接成功！");
    var whereStr  = {"name":data.name,"time.day":data.time, "title":data.title};
    var collection = db.collection(col);
    collection.deleteOne(whereStr,  function(err, res) {
        if (err) throw err;
        console.log("文档删除成功");
        cb(null);
        db.close();
    });
    });
};

//更新一篇文章及其相关信息
Db.prototype.delete = function(data,col,cb){
  MongoClient.connect(this.url, function(err, db) {
    console.log("连接成功！");
    var whereStr  = {"name":data.name,"time.day":data.time, "title":data.title};
    var collection = db.collection(col);
    collection.deleteOne(whereStr,  function(err, res) {
        if (err) throw err;
        console.log("文档删除成功");
        cb(null);
        db.close();
    });
    });
};

Db.prototype.updateComment = function(data, col, cb) {
  MongoClient.connect(this.url, function(err, db) {
    console.log("连接成功");
    var whereStr = {"name": data.name, "time.day": data.time, "title":data.title};
    var updateStr = {$push: {"comments":data.comment}};
    var collection = db.collection(col);
    collection.update(whereStr, updateStr, function(err, res) {
      if (err) {
        throw err; // 出现异常
      }
      console.log("评论提交成功");
      cb(null);
      db.close();
    })
  });
};
