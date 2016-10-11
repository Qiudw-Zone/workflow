'use strict';

var through = require('through2'); // through2 是一个对 node 的 transform streams 简单封装
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var isReplace = false;

// 插件名定义
const PLUGIN_NAME = 'gulp-replace-url';

// 插件级别函数 (处理文件)
function gulpReplaceUrl(match) {
    if (!match) throw new PluginError(PLUGIN_NAME, 'Missing match config!');

    /*if (!isReplace) {
        isReplace = true;
        match.before = match.before.replace(/\\\\/gi, '');
    }*/
    var options = options || {};
    match.before = match.before.replace(/\\/gi, '');
    options.replaceReg = new RegExp(match.before, 'gi');

    // 创建一个让每个文件通过的 stream 通道
    return through.obj(function(file, enc, done) {
        if (file.isNull()) {
            done(null, file);   // 返回空文件
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return done();
        }
        // 这里需要延迟执行，否则会因为在前一个的base64替换流异步而先被执行该流，导致url替换被覆盖回去
        setTimeout(function(){
            if (file.isBuffer()) {
                var contents = file.contents.toString("utf8");  // buffer转utf8
                contents = contents.replace(options.replaceReg, match.after);   // 字符串匹配替换
                file.contents = new Buffer(contents);   // 重新写回buffer
            }
            // 确保文件进去下一个插件
            done(null, file, enc);
        },500);
                
    });
}

// 暴露（export）插件主函数
module.exports = gulpReplaceUrl;
