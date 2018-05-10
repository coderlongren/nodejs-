var DB = require('./db');
var mongodb = new DB();
function Comment(name, day, title, comment) {
  this.name = name;
  this.day = day;
  this.title = title;
  this.comment = comment;
}

module.exports = Comment;

//存储一条留言信息
Comment.prototype.save = function(callback) {
    var query = {};
    query.name = this.name;
    query.title = this.title;
    query.time = this.day;
    query.comment = this.comment;
  mongodb.updateComment(query, 'posts', function(err) {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
};