var gutil      = require('gulp-util'),
    through    = require('through2'),
    fs         = require('fs'),
    path         = require('path');

// 读取配置文件
var config     = require('../config');
// var config = fs.readFileSync('filter.json','utf-8');
// config = JSON.parse(config.toString('utf-8'));
// 当前项目名称(根文件夹名称)
var csspath = config.cssFilter.path;
// 预定义样式接收文件路径
var cssBusiness = null;


module.exports = function (options) {

    return through.obj(function (file, enc, cb) {
        options = options || {};
        var self = this;
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        //css路径重置
        // cssBusiness = './'+csspath+'/';

        // 获取html文件内容，并字符串化
        var html = file.contents.toString();

        // 拼接完整的预定义css接受样式表路径
        var linkArr = CssFilter.GetAllLink(html);
        var link = CssFilter.GetMainLink(linkArr);
        if(link){
            var val = CssFilter.GetLinkVal(link);  
            cssBusiness = CssFilter.NoRoot(val);

            // 从html字符串中获取class集合
            var arrClass =  CssFilter.GetClassFromHtml(html);

            // 根据class从样式库中过滤出需要的css
            var styleStr = CssFilter.Filter(arrClass);

            // 将匹配好的库样式，写入当前业务样式表
            CssFilter.ReWriteCss(styleStr);

            file.contents = new Buffer(html);
            self.push(file);
            cb();
        }
    });
};

CssFilter = {
    mainCss:null,
    // 去除根目录
    NoRoot:function(uriStr) {
        var pathReg = new RegExp(config.match.before, 'gi');
        var _root = __dirname.split('plugins')[0];
        var src = uriStr.replace(pathReg,'');
        return path.join(_root, '/src', src);;
    },
    // 从html字符串中过滤出所有预定义class并返回
    GetClassFromHtml:function(htmlStr) {

        // 获取class属性值的正则
        var re = new RegExp('class="([^<>\"]*)"{1}','ig');

        // 存放筛选出来的预定义class
        var classArr = [];
        htmlStr.replace(re,function($0,$1) {
            // 空字符正则
            var r = /\s/;
            
            // 获取class属性值中预定义class部分（预定义class与其他class用'|'分隔）
            var cls = $1.split(' | ')[1];
            // 判断预定义class部分，是否为多个class，是则要先拆分，再合并到classArr中
            if(cls && r.test(cls)){
                classArr = classArr.concat(cls.split(r));
            }else if(cls){
                classArr.push(cls);
            }
        });
        return classArr  
    },
    // 判断业务样式表中是否含有指定class
    HasClass:function(classStr) {
        if(!CssFilter.mainCss){
            CssFilter.mainCss = fs.readFileSync(cssBusiness,'utf-8');
        }  
        var r = new RegExp('\\.'+classStr,'gm');
        return r.test(CssFilter.mainCss);
    },
    // 从css库中获取需要的css
    Filter:function(arrClass) {
        // 获取样式库数据并JSON对象化
        var style = fs.readFileSync(config.cssFilter.cssLib,'utf-8')
        var styleObj = JSON.parse(style);
        var styleStr = '',
            cls = '',
            css = '';

        // 根据class数组匹配样式集合
        for(var i=0,len=arrClass.length;i<len;i++){
            cls = arrClass[i];
            if(!CssFilter.HasClass(cls)){
                css = styleObj[cls];
            }else{
                continue;
            }       
            styleStr += '.'+cls+'{'+css+'}';
        }
        return styleStr; 
    },
    // 重写业务css并补充预定义css
    ReWriteCss:function (styleStr) {
        if(styleStr == '')return;
        styleStr = '/*-start-来自样式库*/'+styleStr+'/*-end-来自样式库*/';
        var style = fs.readFileSync(cssBusiness,'utf-8');
        fs.writeFileSync(cssBusiness, styleStr+style,'utf-8');
    },
    // 从html字符串中获取所有link标签
    GetAllLink:function(htmlStr) {
        var arr = [];
        var re = /<link[^>]+>/gmi;
        htmlStr.replace(re,function($0) {
            arr.push($0);
        });
        return arr;
    },
    // 从link中获取href值
    GetLinkVal:function(linkStr) {
        var re = /href="(\S+)"/,res;
        linkStr.replace(re,function($0,$1) {
            res = $1;
        });
        return res;
    },
    // 从多个link中获取预定义css的接收link
    GetMainLink:function(linkArr) {
        var temp,linkStr;
        for(var i=0,len=linkArr.length;i<len;i++){
            linkStr = linkArr[i];
            temp = /data-css="main"/.test(linkStr);
            if(temp){
                return linkStr;
            }
        }
    }
}