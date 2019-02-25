var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const {UserModel} = require('../db/models')
const filter = {password:0,__v:0}  //查询时过滤指定的属性
/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

/*router.post('/register',function (req,res) {

  const {username,password} = req.body
  if (username=='admin'){
    res.send({code: 0 , msg:'此用户已存在'})
  } else {
    res.send({code:0,data:{_id:'abc',username,password}})
  }

})*/
//注册路由
router.post('/register',function (req,res) {
  //读取请求参数数据
  const {username, password, type} = req.body
  //处理：判断用户是否已经存在，如果存在，返回提供错误的信息，如果不存在，保存
    //查询（根据username）
  UserModel.findOne({username},function (err,user) {
    //如果user有值(已存在)
    if (user){
      res.send({code:1,msg:'此用户已存在'})
    }else {
      new UserModel({username,type,password:md5(password)}).save(function (error,user) {
        //交给浏览器保存
        res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})//持久化cookie，保存在本地
        //返回包含user的json数据
        const data = {username,type,_id:user._id} // 响应数据中不要携带密码
        res.send({code:0,data})
      })
    }
  })
  //返回响应数据
})

//登录路由
router.post('/login',function (req,res) {
  const {username, password} = req.body
  //根据username和password查询数据库users，如果没有，返回提示错误的信息；如果有，返回登录成功信息(包含user)
  UserModel.findOne({username,password:md5(password)},filter ,function (err,user) {
    if (user){
      //交给浏览器保存
      res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})//持久化cookie，保存在本地
      //返回登录成功信息(包含user)
      res.send({code:0,data:user})
    } else {
      res.send({code:1,msg:'用户名或密码不正确'})
    }
  })
})

//更新用户信息的路由
router.post('/update',function (req,res) {
  //从请求的数据的cookies
  const {userid} = req.cookies
 // const {header,post,info,company,salary} =req.body
  if(!userid){
    return res.send({code:1,msg:'请先登录'})
  }
  //存在，根据userid更新对应的数据库文档数据
  // 得到提交的用户数据
  const user =req.body  //没有_id
  UserModel.findByIdAndUpdate({_id:userid},user,function (error,oldUser) {
    if (!oldUser){
      //通知浏览器删除userid cookie
      res.clearCookie('userid')
      //返回一个提示信息
      res.send({code:1,msg:'请先登录'})
    }else {
      const {_id,username,type} = oldUser
      const data = Object.assign(req.body,{_id,username,type})  //assign 将多个指定的对象进行合并，返回一个合并后的对象
      res.send({code:0,data})
    }
  })
})

//获取用户信息的路由 根据cookie中的userid
router.get('/user', function (req,res) {
  //从请求的数据的cookies
  const {userid} = req.cookies
  if (!userid) {
    res.send({code:1,msg:'请先登录'})
  }
  UserModel.findOne({_id:userid},filter,function (error,user){
    res.send({code:0,data:user})
  })
})
module.exports = router;
