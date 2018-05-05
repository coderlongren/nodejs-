var Db = require('./db');
var mongodb = new Db();

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;

//存储用户信息
User.prototype.save = function(callback) {
  //要存入数据库的用户文档
  var user = {
      name: this.name,
      password: this.password,
      email: this.email
  };
  
  mongodb.insert(user,'users',function(err,result){
      if(err){
        return callback(err);//错误，返回 err 信息
      }
      callback(null, user);
  });
  
};

//读取用户信息
User.get = function(na, callback) {
    console.log('进入到数据蹭了');
   mongodb.find({name:na},'users',function(err,result){
       if (err) {
          return callback(err);//错误，返回 err 信息
        }
        callback(null, result[0]);//成功！err 为 null，并返回存储后的用户文档
   });
  
};