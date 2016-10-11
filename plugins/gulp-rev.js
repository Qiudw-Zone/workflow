/**
 * @func     内容内联之gulp插件
 * @author   寒影
 * @date     2016-07-13
 * @version  1.0
 */
'use strict';

// 插件名定义
const PLUGIN_NAME = 'gulp-embed';

var fs          = require('fs'),
    path        = require('path'),
    gulp        = require('gulp'),
    he          = require('he'),
    // crypto      = require('crypto'),
    through     = require('through2'),
    // gutil       = require('gulp-util'),
    cheerio     = require('cheerio');

// 插件级别函数
exports.rev = function(options){
    return through.obj(function(file, enc, cb){
        if (file.isNull()) {
            console.log(12)
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        var ext = path.parse(file.path).ext; // 获取图片格式
        if(ext == '.html' || ext == '.htm' || ext == '.tpl'){
            file.contents = revControler.rev_html(file,options);
        }
        if(ext == '.css'){
            file.contents = revControler.rev_css(file,options);
        }
        cb(null, file, enc);
    });
}

var revControler = {
    getMd5:function(file){
        var md5 = null;
        try{
            var data = fs.readFileSync(file);
            var hash = crypto.createHash('md5');
            hash.update(data.toString(),'utf8');
            md5 = hash.digest('hex');
        }catch(e){}
        return md5;
    },
    getStamp:function(){
        return new Date().getTime();
    },
    rev_html:function(fileBuf,options){
        var ctn = fileBuf.contents.toString("utf8");  // buffer转utf8
        var $ = cheerio.load(ctn),
            links = $('link'),
            scripts = $('script'),
            imgs = $('img');

        var css = null,
            href = null;
        for(var i=0,l=links.length; i<l; i++){
            css = $(links[i]);
            href = css.attr('href');
            css.attr('href',href+'?v='+revControler.getStamp());
        }
        var js = null,
            src = null;
        for(var i=0,l=scripts.length; i<l; i++){
            js = $(scripts[i]);
            src = js.attr('src');
            js.attr('src',src+'?v='+revControler.getStamp());
        }
        var img = null;
        for(var i=0,l=imgs.length; i<l; i++){
            img = $(imgs[i]);
            src = img.attr('src');
            img.attr('src',src+'?v='+revControler.getStamp());
        }
        return new Buffer(he.decode($.html()));
    },
    rev_css:function(fileBuf,options){
        var ctn = fileBuf.contents.toString("utf8");  // buffer转utf8

        ctn.replace(/url\((\S+)\)/g,function(str,src){
            ctn = ctn.replace(src,src + '?v=' + revControler.getStamp());
            // fileBuf.contents = new Buffer(ctn);   // 重新写回buffer
        });
        return new Buffer(ctn);
    }
}