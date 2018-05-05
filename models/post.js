var DB = require('./db');
var mongodb = new DB();
function Post(name, title, post) {
	this.name = name;
	this.title = title;
	this.post = post;
}
// 导出此模块
module.exports = Post;

