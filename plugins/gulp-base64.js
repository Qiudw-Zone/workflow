/**
 * @func     gulp插件之base64图片处理
 * @author   寒影
 * @date     2016-07-19
 * @version  1.0
 */

'use strict';

var fs           = require('fs'),
    path         = require('path');

var cheerio      = require('cheerio'),

    // through2 是一个对 node 的 transform streams 简单封装
    through      = require('through2'),
    gutil        = require('gulp-util'),
    he           = require('he'),  // 解决cheerio中文被转码问题
    PluginError  = gutil.PluginError,
    co           = require('co');

var isReplace = false;

// 插件名定义
const PLUGIN_NAME = 'gulp-inline-img';

// 插件级别函数 (处理文件)
exports.imgToBase64 = function(options) {
    if (!options.size) throw new PluginError(PLUGIN_NAME, 'Missing size param!');
    
    if (!isReplace) {
        isReplace = true;
        options.match.before = options.match.before.replace(/\//gi, '\\\/');  // 路径处理
    }
    options.pathReg = new RegExp(options.match.before, 'gi');

    // 创建一个让每个文件通过的 stream 通道
    return through.obj(function(file, enc, done) {
        if (file.isNull()) {
            done(null, file);   // 返回空文件
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return done();
        }
        if (file.isBuffer()) {
            var ext = path.parse(file.path).ext; // 获取图片格式
            if(ext == '.html' || ext == '.htm' || ext == '.tpl'){
                file.contents = baseControler.base_html(file,options);
            }
            if(ext == '.css' || ext == '.scss' || ext == '.js'){
                baseControler.base_src(file,options);
            }
        }

        // 确保文件进去下一个插件
        done(null, file, enc);
    });
}

var baseControler = {
    root:__dirname.split('plugins')[0],
    existGen:function* (file){
        var exist = yield baseControler.existsFile(file);
        return exist;
    },
    existsFile:function (file){
        return new Promise(function (resolve, reject){
            fs.exists(file, function(data){
                resolve(data);
            });
        });
    },
    base_html:function(file, options){
        var contents = file.contents.toString("utf8");  // buffer转utf8
        var $ = cheerio.load(contents);
        var $imgs = $("img");

        for (var i = 0; i < $imgs.length; i++) {
            var $img = $($imgs[i]);

            // 路径处理
            var src = $img.attr('src').replace(options.pathReg, "");
            if(!src) continue;
            src = path.join(this.root, '/src', src);    

            // 获取本地要base64编码的图片信息
            var stat = fs.statSync(src);
            var ext = path.parse(src).ext; // 获取图片格式

            if (stat.size <= options.size) {
                var head = ext === ".png" ? "data:image/png;base64," : "data:image/jpeg;base64,";
                var datauri = fs.readFileSync(src).toString("base64");
                $img.attr("src", head + datauri)
            }
        }
        return new Buffer(he.decode($.html()));
    },
    base_src:function(file, options){
        var self = this;
        var contents = file.contents.toString("utf8");  // buffer转utf8
        contents.replace(/url\((\S+)\)/g,function(str,src){
            src = src.split(')')[0];

            var localSrc = src.replace(options.pathReg, "").replace(/\.\.\//g,"");
            localSrc = path.join(self.root, '/src', localSrc);
            co(self.existGen,localSrc).then(function(value){
                if(!value) return;
                var stat = fs.statSync(localSrc);
                var ext = path.parse(localSrc).ext; // 获取图片格式
                
                if (stat.size <= options.size) {
                    var head = ext === ".png" ? "data:image/png;base64," : "data:image/jpeg;base64,";
                    var datauri = fs.readFileSync(localSrc).toString("base64");
                    var srcReg = new RegExp(src, "g");
                    contents = contents.replace(srcReg,head+datauri);
                    file.contents = new Buffer(contents);   // 重新写回buffer
                }
            });
        });
    }
}
