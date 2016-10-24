/**
 * @func     gulp插件之git格式图片webp化
 * @author   寒影
 * @date     2016-10-20
 * @version  1.0
 */

'use strict';

// through2 是一个对 node 的 transform streams 简单封装
var through      = require('through2'),
    gutil        = require('gulp-util'),
    cmd          = require('node.cmd'),
    color        = require('gulp-color');

// 插件名定义
const PLUGIN_NAME = 'gulp-inline-img';

// 插件级别函数 (处理文件)
exports.gifWebp = function(options) {

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
            var dirs  = file.path.split('\\'),
            name = dirs.pop(),
            webpdir = dirs.join('/'),
            names = name.split('.');

            names.pop();
            names.push('webp');
            var webpname = names.join('.');

            var webpcmd = new cmd('gif2webp');
            webpcmd.setCwd(webpdir);

            var common = name + ' -m 6 -q 75 -mixed -o ' + webpname;
            webpcmd.exec(common,function(){
                gutil.log(color('Add '+webpname,'GREEN'));
            });
        }
        // 确保文件进去下一个插件
        done(null, file, enc);
    });
}