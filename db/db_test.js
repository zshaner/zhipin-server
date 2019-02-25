/*
使用mongoose  操作mongodb的测试文件
1.连 接 数 据 库
1.1.引 入 mongoose
1.2.连 接 指 定 数 据 库 (URL只 有 数 据 库 是 变 化 的 )
1.3.获 取 连 接 对 象
1.4.绑 定 连 接 完 成 的 监 听 ( 用 来 提 示 连 接 成 功 )
2.得 到 对 应 特 定 集 合 的 Model
2.1.字 义 Schema( 描 述 文 档 结 构 )
2.2.定 义 Model( 与 集 合 对 应 , 可 以 操 作 集 合 )
3. 通 过 Model 或 其 实 例 对 集 合 数 据 进 行 CRUD 操 作
3.1.通 过 Model 实 例 的 save() 添 加 数 据
3.2.通 过 Model 的 find()/findOne() 查 询 多 个 或 一 个 数 据
3.3.通 过 Model 的 findByIdAndUpdate() 更 新 某 个 数 据
3.4.通 过 Model 的 remove() 删 除 匹 配 的 数 据
*/

const md5 = require('blueimp-md5')
// 1.连 接 数 据 库
// 1.1.引 入 mongoose
const mongoose = require('mongoose')
// 1.2.连 接 指 定 数 据 库 (URL只 有 数 据 库 是 变 化 的 )
mongoose.connect('mongodb://localhost:27017/gzhipin_test')
// 1.3.获 取 连 接 对 象
const con = mongoose.connection
// 1.4.绑 定 连 接 完 成 的 监 听 ( 用 来 提 示 连 接 成 功 )
con.on('connected',function () {
    console.log('数据库连接成功')
})

// 2.得 到 对 应 特 定 集 合 的 Model
// 2.1.字 义 Schema( 描 述 文 档 结 构 )
const userSchema = mongoose.Schema({
    username:{type:String,required:true},
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, //用户类型 : dashen/laoban
})
// 2.2.定 义 Model( 与 集 合 对 应 , 可 以 操 作 集 合 )
const UserModel = mongoose.model('user',userSchema)

// 3. 通 过 Model 或 其 实 例 对 集 合 数 据 进 行 CRUD 操 作
// 3.1.通 过 Model 实 例 的 save() 添 加 数 据
function testSave() {
    const user = {
        username: 'xfzhang',
        password: md5('1234'),
        type: 'dashen',
    }
    const userModel = new UserModel(user)
    userModel.save(function (err,user) {
        console.log('save',err,user)
    })
}
//testSave()
// 3.2.通 过 Model 的 find()/findOne() 查 询 多 个 或 一 个 数 据
function testFind() {
    UserModel.find(function (err,users) {
        console.log('find()',err,users)
    })
    UserModel.findOne({_id:'5c6cb46bade8b140ac280ef0'},function (err,user) {
        console.log('findOne()',err,user)
    })
}
//testFind()
// 3.3.通 过 Model 的 findByIdAndUpdate() 更 新 某 个 数 据
function testUpdate() {
    UserModel.findByIdAndUpdate({_id: '5c6cb46bade8b140ac280ef0'}, {username: 'zhao'},
        function (err,user) {
            console.log('Update()',err,user)
        })
}
//testUpdate()
// 3.4.通 过 Model 的 remove() 删 除 匹 配 的 数 据
function testDelete() {
    UserModel.remove({_id: '5ae1241cf2dd541a8c59a981'},
        function (err, result) {
            console.log('remove()', err, result)
        })
}
// testDelete()