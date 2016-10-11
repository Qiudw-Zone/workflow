'use strict';

var fs          = require('fs'),
    path        = require('path');

var gulp        = require('gulp'),
    del         = require('del'),
    through     = require('through2'),
    gutil       = require('gulp-util'),
    gulpif      = require('gulp-if'),
    minify_css  = require('gulp-minify-css'),
    minify_html = require('gulp-htmlmin'),
    color       = require('gulp-color'), // 设置控制台输出颜色
    co          = require('co');

var replace_url = require('./gulp-replace-url'),  // 链接替换处理模块
    gulp_embed  = require('./gulp-embed'),
    gulp_rev    = require('./gulp-rev'),
    css_filter  = require('./gulp-css-filter'),
    img_base    = require('./gulp-base64');

// 插件名定义
const PLUGIN_NAME = 'gulp-copy-file';

var files = {}; // 缓存变动文件的列表

// 插件级别函数 (处理文件)
exports.updateListsInPic = function(options) {
    if(!options || !options.cacheDir){
        throw new Error("缺少参数：用户缓存复制文件的目录（Eg:./cache）");
    }
    if(!options.file){
        throw new Error("缺少参数：被处理文件的完整路径！");
    }
    var file = options.file.replace(/\\/g,'\/');
    options.cacheDir ? options.cacheDir : './cache/';
    options.cacheDir.replace(/\\/g,'/');
    options.cacheDir = (options.cacheDir.lastIndexOf('/') + 1 == options.cacheDir.length) ? options.cacheDir : options.cacheDir + '/';
    var dirs = null;
    var dirGen = function* (){
        dirs = yield copyControler.readDir(options.cacheDir);
    };
    co(dirGen).then(function(){
        if(dirs.length > 0){
            if(file in files) return;
        }else{
            files = {};
        }
        files[file] = file;
        var writeStream = fs.createWriteStream(options.cacheDir+new Date().getTime()+'.txt');
        writeStream.write(file);
        writeStream.end();
    });
}

exports.updateLists = function(options){
    return through.obj(function(file, enc, cb){
        if (file.isNull()) {
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        if(!options || !options.cacheDir){
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, '缺少参数：用户缓存复制文件的目录（Eg:./cache）'));
            return cb();
        }
        var path = file.path;
        var dirs = null;
        options.cacheDir ? options.cacheDir : './cache/';
        options.cacheDir.replace(/\\/g,'/');
        options.cacheDir = (options.cacheDir.lastIndexOf('/') + 1 == options.cacheDir.length) ? options.cacheDir : options.cacheDir + '/';
        var dirGen = function* (){
            dirs = yield copyControler.readDir(options.cacheDir);
        };
        co(dirGen).then(function(){
            if(dirs.length > 0){
                if(path in files) return;
            }else{
                files = {};
            }
            files[path] = path;
            var writeStream = fs.createWriteStream(options.cacheDir+new Date().getTime()+'.txt');
            writeStream.write(path);
            writeStream.end();
        });

        cb(null, file, enc);
    });
}

exports.copy = function(options){
    if(!options || !options.wwwTo || !options.wwwFrom || !options.srcTo || !options.srcFrom || !options.cacheDir){
        throw new Error("Copy() 参数错误！");
    }
    options.cacheDir.replace(/\\/g,'/');
    options.cacheDir = (options.cacheDir.lastIndexOf('/') + 1 == options.cacheDir.length) ? options.cacheDir : options.cacheDir + '/';

    var htmlReg   = new RegExp('\.html|\.htm|\.tpl$'),
        cssReg    = new RegExp('\.scss|\.css|$'),
        jsReg     = new RegExp('\.js$'),
        imgReg    = new RegExp('\.jpg|\.jepg|\.png|.png|.git|.swf$'),
        wwwToDir  = options.wwwTo.replace(/\\/g,'\/')+'\/',
        wwwDir    = options.wwwFrom.replace(/\\/g,'\/'),
        srcToDir  = options.srcTo.replace(/\\/g,'\/')+'\/',
        srcDir    = options.srcFrom.replace(/\\/g,'\/'),
        preDir    = '',
        aimDir    = '';

    var cacheDir = null,
        data     = [];
    var fileGen = function* (){
        cacheDir = yield copyControler.readDir(options.cacheDir);
        for(var i=0,len = cacheDir.length; i<len; i++){
            data.push((yield copyControler.readFile(options.cacheDir+cacheDir[i])).toString());
        }
    };
    co(fileGen).then(function (){
        gutil.log('Has readed files!');

        co(handlerData).then(function(){
            gutil.log('Handler Data Over!');
            del([options.cacheDir + '*.txt']); // 删除cache内部文件
        });
    });

    var handlerData = function* (){
        var imgs = [];
        for(var i=0,l=data.length; i<l; i++){
            var file = data[i].replace(/\\/g,'\/');
            if(imgReg.test(file)){ // 图片
                var end = file.lastIndexOf('\/');
                var imgDir = file.slice(0,end);
                var imgItem = {};
                var srcReg = new RegExp(srcDir);
                var isNewImgDir = true;
                for(var j=0,len=imgs.length; j<len; j++){
                    var imgFrom = imgs[j].from;
                    if(imgDir.indexOf(imgFrom) !== -1){ // imgDir目录被包含
                        isNewImgDir = false;
                        break;
                    }else if(imgFrom.indexOf(imgDir) !== -1){ // imgs[j]目录被包含
                        isNewImgDir = false;
                        imgs[j].from = imgDir;
                        var to = imgDir.replace(srcReg,options.srcTo);
                        imgs[j].to = to;
                        break;
                    }
                }
                if(isNewImgDir){
                    imgs.push({
                        from:imgDir,
                        to:imgDir.replace(srcReg,options.srcTo)
                    });
                }
            }else{
                if(htmlReg.test(file)){
                    preDir = wwwDir;
                    aimDir = wwwToDir;
                }else{
                    preDir = srcDir;
                    aimDir = srcToDir;
                }
                var temp = file.split(preDir)[1];
                var start = 1;
                var end = temp.lastIndexOf('\/');
                var dir = temp.slice(start,end);
                aimDir += dir;

                if(htmlReg.test(file)){ // html处理
                    gulp.src(file)
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
                    .pipe(gulp.dest(aimDir));
                }else if(cssReg.test(file)){ // scss/css处理
                    gulp.src(file)
                    .pipe(gulpif(options.func.base64.isOn || false, img_base.imgToBase64({
                        size:options.func.base64.size || 3000,
                        match:options.match
                    })))
                    .pipe(replace_url(options.match))
                    .pipe(gulp_rev.rev())
                    .pipe(gulp.dest(aimDir));
                }else if(jsReg.test(file)){ // js处理
                    gulp.src(file)
                    .pipe(replace_url(options.match))
                    .pipe(gulp.dest(aimDir));
                }
                gutil.log("复制文件："+file+' 至 '+aimDir);
            }
        }

        // 复制图片
        gutil.log("\n图片复制目录：\n");
        for(var i=0,l=imgs.length; i<l; i++){
            gutil.log('\t'+imgs[i].from + " 至 " + imgs[i].to);

            gulp.src(path.join(imgs[i].from,'/**/*.{jpg,jpeg,png,swf}'))
            .pipe(gulp.dest(imgs[i].to));
        }
    }
}

var copyControler = {

    /**
     * @func    读取目录
     * @param   dir：被读取的目录
     */
    readDir: function (dir){
        return new Promise(function (resolve, reject){
            fs.readdir(dir, function(error, data){
                if (error) reject(error);
                resolve(data);
            });
        });
    },

    /**
     * @func    读取文件
     * @param   file：被读取的文件路径
     */
    readFile: function (file){
        return new Promise(function (resolve, reject){
            fs.readFile(file, function(error, data){
                if (error) reject(error);
                resolve(data);
            });
        });
    },
}