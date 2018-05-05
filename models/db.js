var MongoClient = require('mongodb').MongoClient;
var settings = require('../settings');
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