'use strict';

var fs          = require('fs'),
    path        = require('path');

var gulp        = require('gulp'),
    through     = require('through2'),
    gutil       = require('gulp-util'),
    gulpif      = require('gulp-if'),
    minify_css  = require('gulp-minify-css'),
    minify_html = require('gulp-htmlmin'),
    color       = require('gulp-color'); // 设置控制台输出颜色

var replace_url = require('./gulp-replace-url'),  // 链接替换处理模块
    gulp_embed  = require('./gulp-embed'),
    gulp_rev    = require('./gulp-rev'),
    css_filter  = require('./gulp-css-filter'),
    img_base    = require('./gulp-base64');

// 插件名定义
const PLUGIN_NAME = 'gulp-copy-file';


// 插件级别函数 (处理文件)

exports.copy = function(options){
    if(!options || !options.path){
        throw new Error("Copy() 参数错误！");
    }

    if(options.path.www){ // 复制模板
        options.path.www.from = options.path.www.from.replace(/\\/g,'/');
        gutil.log(color("复制目录："+options.path.www.from+' 至 '+options.path.www.to,'GREEN'));
        gulp.src(options.path.www.from+'/*')
            .pipe(gulpif(options.func.embed.isOn || false, gulp_embed({
                jsCompress:options.func.embed.compressJs,
                cssCompress:options.func.embed.compressCss,
                match:options.match
            })))
            .pipe(gulpif(options.func.cssFilter.isOn || false, css_filter()))
            .pipe(gulpif(options.func.base64.isOn || false, img_base.imgToBase64({
                size:options.func.base64.size || 3000,
                match:options.match
            })))
            .pipe(replace_url(options.match))
            .pipe(gulpif(options.func.rev.isOn || false, gulp_rev.rev()))
            .pipe(gulpif(options.func.minifyHtml || false, minify_html({collapseWhitespace: true})))
            .pipe(gulp.dest(options.path.www.to));
    }

    if(options.path.scss){ // 复制scss
        options.path.scss.from = options.path.scss.from.replace(/\\/g,'/');
        gutil.log(color("复制目录："+options.path.scss.from+' 至 '+options.path.scss.to,'GREEN'));
        gulp.src(options.path.scss.from+'/*')
            .pipe(gulpif(options.func.base64.isOn || false, img_base.imgToBase64({
                size:options.func.base64.size || 3000,
                match:options.match
            })))
            .pipe(replace_url(options.match))
            .pipe(gulp_rev.rev())
            .pipe(gulp.dest(options.path.scss.to));
    }

    if(options.path.css){ // 复制css
        options.path.css.from = options.path.css.from.replace(/\\/g,'/');
        gutil.log(color("复制目录："+options.path.css.from+' 至 '+options.path.css.to,'GREEN'));
        gulp.src(options.path.css.from+'/*')
            .pipe(gulpif(options.func.base64.isOn || false, img_base.imgToBase64({
                size:options.func.base64.size || 3000,
                match:options.match
            })))
            .pipe(replace_url(options.match))
            .pipe(gulp_rev.rev())
            .pipe(gulp.dest(options.path.css.to));
    }

    if(options.path.js){
        options.path.js.from = options.path.js.from.replace(/\\/g,'/');
        gutil.log(color("复制目录："+options.path.js.from+' 至 '+options.path.js.to,'GREEN'));
        gulp.src(options.path.js.from+'/*')
            .pipe(replace_url(options.match))
            .pipe(gulp.dest(options.path.js.to));
    }

    if(options.path.img){
        options.path.img.from = options.path.img.from.replace(/\\/g,'/');
        gutil.log(color("复制目录："+options.path.img.from+' 至 '+options.path.img.to,'GREEN'));
         gulp.src(options.path.img.from+'/*')
            .pipe(gulp.dest(options.path.img.to));
    }
}
