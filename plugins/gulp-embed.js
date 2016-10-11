/**
 * @func     内容内联之gulp插件
 * @author   寒影
 * @date     2016-07-13
 * @version  1.0
 */
'use strict';

// 插件名定义
const PLUGIN_NAME = 'gulp-ctn-inline';

var fs          = require('fs'),
    path        = require('path'),
    gulp        = require('gulp'),
    through     = require('through2'),
    gutil       = require('gulp-util'),
    cheerio     = require('cheerio'),
    uglifyjs    = require("uglify-js");

// 插件级别函数 (处理文件)
function gulpCtnInliner(options){
    return through.obj(function(file, enc, cb){
        if (file.isNull()) {
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        options = options ? options : {};
        options.jsCompress = (options.jsCompress === undefined) ? false : options.jsCompress;
        options.cssCompress = (options.cssCompress === undefined) ? false : options.cssCompress;
        options.pathReg = new RegExp(options.match.before, 'gi');

        var baseDir = __dirname.split('plugins')[0];

        // 获取内容文本
        var ctn = file.contents.toString("utf8");  // buffer转utf8
        var urls = [];
        var $ = cheerio.load(ctn);
        var head = $('head');
        var links   = $('link'),
            scripts = $('script');
        var len = links.length > scripts.length ? links.length : scripts.length;
        for(var i=0; i < len; i++){
            if(links[i]){
                var css = $(links[i]);
                if(css.data('inline')){
                    urls.push(css.attr("href").replace(options.pathReg, ""));
                    css.remove();
                }
            }
            if(scripts[i]){
                var js  = $(scripts[i]);
                if(js.data('inline')){
                    urls.unshift(js.attr("src").replace(options.pathReg, ""));
                    js.remove();
                }
            }
        }
        var cssHtml = '',
            jsHtml  = '';
        for(i=0,len=urls.length; i<len; i++){
            var dir = path.join(baseDir, '/src', urls[i]);
            var ext = path.parse(dir).ext; // 文件后缀
            switch(ext){
                case '.js':{
                    var ctn = '';
                    ctn = options.jsCompress ? uglifyjs.minify(dir,{mangle:true}).code : fs.readFileSync(dir,'utf-8');
                    jsHtml += ctn;
                    break;
                }
                case '.css':{
                    var ctn = '';
                    ctn = options.cssCompress ? fs.readFileSync(dir,'utf-8').replace(/\s/g,'') : fs.readFileSync(dir,'utf-8');
                    cssHtml += ctn;
                    break;
                }
            }
        }
        if(cssHtml){
            cssHtml = "<style type=\"text/css\">\n" + cssHtml + "\n</style>\n";
            head.append(cssHtml);
        }
        if(jsHtml){
            jsHtml = "<script type=\"text/javascript\">\n" + jsHtml + "\n</script>\n";
            head.append(jsHtml);
        }
        file.contents = new Buffer($.html());
        cb(null, file, enc);
    });
}

// 暴露（export）插件主函数
module.exports = gulpCtnInliner;