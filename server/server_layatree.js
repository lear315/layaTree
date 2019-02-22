var express = require("express");
var bodyParser = require("body-parser"); 
var app = express(); 
app.use(bodyParser.urlencoded({ extended: false }));  
var port = 8066;
var layaTreeVer = "0.9";

app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
});

app.get("/updateInfo",function(req,res){
    console.log("请求url：",req.path);
    console.log("请求参数：",req.query);
    var reqdata = req.query;
    if (reqdata) {
        var curVersion = reqdata.version;
        if (curVersion == layaTreeVer) {
            res.send("LayaTree当前版本是最新的.");
        } else {
            res.send("LayaTree当前版本是不是最新的,请去更新.");
        }
    }
})

app.post("/post",function(req,res){
    console.log("请求参数：",req.body);
    var result = {code:200,msg:"post请求成功"};
    res.send(result);
});


app.listen(port, function(){
   console.log(`服务器运行在${port}端口`);
});