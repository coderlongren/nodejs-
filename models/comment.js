var mongodb = require('./db');

function Comment(name, title, comment) {
  this.name = name;
  this.title = title;
  this.comment = comment;
}

module.exports = Comment;

//存储一条留言信息
Comment.prototype.save = function(callback) {
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