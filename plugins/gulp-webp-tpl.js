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
    gulp        = require('gulp'),
    he          = require('he'),
    through     = require('through2'),
    gutil       = require('gulp-util'),
    cheerio     = require('cheerio');

// 插件级别函数：html/htm/tpl webp化
exports.webpHtml = function(){
    return through.obj(function(file, enc, cb){
        if (file.isNull()) {
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        let ctn = file.contents.toString("utf8");  // buffer转utf8;
        let $ = cheerio.load(ctn);
        let $imgs = $('img');
        for(let i=0,l=$imgs.length; i<l; i++){
            let node = $imgs.eq(i);
            if(node.attr('srcset')) continue;
            if(node.data('webp') == false) continue;

            let alt = node.prop('alt') || '',
                title = node.prop('title') || '',
                src = node.prop('src'),
                name = src.slice(0,src.lastIndexOf('.')),
                html = "<picture><source srcset=\"" + name + ".webp\" src=\"" + name + ".webp\" type=\"image/webp\"><img srcset=\"" + src + "\" src=\"" + src + "\" alt=\"" + alt + "\" title=\"" + title + "\"></picture>"
            node.after(html);
            node.remove();
        }
        file.contents = new Buffer($.html());
        cb(null, file, enc);
    });
}

// 插件级别函数：css webp化
exports.webpCss = function(){
    return through.obj(function(file, enc, cb){
        if (file.isNull()) {
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        let html = '',
            ctn = file.contents.toString("utf8");  // buffer转utf8;

        // 已经注入过webps类，先要剔除
        let rmStart = ctn.indexOf('.webps');
        if(rmStart !== '-1' && ctn.indexOf('.webp') !== -1){
            ctn = ctn.slice(0,rmStart);
        }

        ctn.replace(/url\([\'\"](\S+)[\'\"]\)/g,function(str,src,index){
            src = src.split(')')[0];
            let name = src.slice(0,src.lastIndexOf('.')),
                start = ctn.lastIndexOf('{',index),
                end = ctn.indexOf('}',start) + 1,
                styleCtn = ctn.slice(start,end),
                // 获取类名
                clssEnd = start,
                clssStart = ctn.lastIndexOf('.',clssEnd),
                clss = ctn.slice(clssStart,clssEnd),

                // 获取bg背景属性
                proEnd = ctn.lastIndexOf(':',index),
                proStart = ctn.lastIndexOf(';',index) + 1,
                pro = ctn.slice(proStart,proEnd);

            // background的属性值（除去url）
            let bgVal = '';
            if(pro === 'background'){
                let bgValStart = styleCtn.indexOf(')')+2,
                    bgValEnd = styleCtn.indexOf(';',bgValStart);
                bgValEnd = bgValEnd !== -1 ? bgValEnd : styleCtn.length-1;

                bgVal = styleCtn.slice(bgValStart,bgValEnd); // repeat top ...
            }

            // 获取bg-size属性
            let bsStart = styleCtn.indexOf('background-size:') + 16,
                bgSize = '';

            if(bsStart !== 15) {
                let bsEnd = styleCtn.indexOf(';',bsStart);
                bsEnd = bsEnd === -1 ? styleCtn.indexOf('}') : bsEnd;
                bgSize = styleCtn.slice(bsStart,bsEnd);
            }

            html += ".webps " + clss + "{" + pro + ":url(" + name + ".webp)";
            bgVal && (html += " "+bgVal);
            html += " !important;";
            // bgSize && (html += "background-size:"+bgSize+" !important;");
            html += "}";
        });
        file.contents = new Buffer(ctn+html);
        cb(null, file, enc);
    });
}