
//mongodb+srv://root:root@cluster0.1xwoa.mongodb.net/?retryWrites=true&w=majority

// 导入 mongoose 模块
const mongoose = require('mongoose');

// 设置默认 mongoose 连接
const mongoDB = 'mongodb+srv://root:root@cluster0.1xwoa.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDB);
// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;
// 取得默认连接
const db = mongoose.connection;

// 将连接与错误事件绑定（以获得连接错误的提示）
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));