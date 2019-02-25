/*
包含n个操作数据库集合数据的model模块
*/
/* 包 含 n个 能 操 作 mongodb 数 据 库 集 合 的 model的 模 块
1.连 接 数 据 库 1.1. 引 入 mongoose 1.2. 连 接 指 定 数 据 库 (URL只 有 数 据 库 是 变 化 的 )
1.3.获 取 连 接 对 象
1.4.绑 定 连 接 完 成 的 监 听 ( 用 来 提 示 连 接 成 功 )
2.定 义 出 对 应 特 定 集 合 的 Model并 向 外 暴 露
2.1.字 义 Schema( 描 述 文 档 结 构 )
2.2.定 义 Model( 与 集 合 对 应 ,可 以 操 作 集 合 )
2.3.向 外 暴 露 Model
*/

// 1.连 接 数 据 库
// 1.1.引 入 mongoose
const mongoose = require('mongoose')
// 1.2.连 接 指 定 数 据 库 (URL只 有 数 据 库 是 变 化 的 )
mongoose.connect('mongodb://localhost:27017/gzhipin')
// 1.3.获 取 连 接 对 象
const con = mongoose.connection
// 1.4.绑 定 连 接 完 成 的 监 听 ( 用 来 提 示 连 接 成 功 )
con.on('connected',function () {
    console.log('数据库连接成功')
})

// 2.得 到 对 应 特 定 集 合 的 Model
// 2.1.字 义 Schema( 描 述 文 档 结 构 )
const userSchema = mongoose.Schema({
    username: {type: String, required: true}, //用 户 名
    password: {type: String, required: true}, //密 码
    type: {type: String, required: true}, //用 户 类 型 : dashen/laoban
    header: {type: String}, //头 像 名 称
    post: {type: String}, //职 位
    info: {type: String}, //个 人 或 职 位 简 介
    company: {type: String}, // 公 司 名 称
    salary: {type: String} // 工 资
})
// 2.2.定 义 Model( 与 集 合 对 应 , 可 以 操 作 集 合 )
const UserModel = mongoose.model('user',userSchema)
//2.3.向 外 暴 露 Model
//module.exports=xxxx
//exports.xxxx=value  exports.yyyy=value
exports.UserModel = UserModel