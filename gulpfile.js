/* 静态服务器全局配置 */
var config        = require('./config');

/* Node n内置模块*/
var fs            = require('fs');

/* 第三方模块 */
var gulp          = require('gulp'),
    gutil         = require('gulp-util'),
    gulpif        = require('gulp-if'),
    browserSync   = require('browser-sync'),
    compass       = require('gulp-compass'),
    bs1           = browserSync.create("www"),
    bs2           = browserSync.create("src"),
    reload        = bs1.reload,
    gwatch        = require('gulp-watch'),
    minify_css    = require('gulp-minify-css'),
    color         = require('gulp-color'),
    plumber       = require('gulp-plumber'),
    cmd           = require('node.cmd'),
    webp          = require('gulp-webp');

/* 自定义模块 */
var gulp_copy     = require('./plugins/gulp-copy'),
    css_filter    = require('./plugins/gulp-css-filter');

/* postcss模块 */
var postcss       = require('gulp-postcss'),
    cssnano       = require('cssnano'),
    autoprefixer  = require('autoprefixer');

/* 注册www静态服务器任务 */
gulp.task('www-server',function(){
    bs1.init({
        ui:{
            port:8887
        },
        server:{
            baseDir:config.bs1.baseDir || './www',
            index:config.bs1.index
        },
        port:config.bs1.port || 8888  // 静态资源服务器端口，默认8888端口
    },function(){
        gutil.log(color('WWW服务启动成功...','CYAN'));
    });
});

/* 注册静态资源服务器任务 */
gulp.task('src-server',function(){
    bs2.init({
        ui:{
            port:9000
        },
        server:{
            baseDir:config.bs2.baseDir || './src'
        },
        port:config.bs2.port || 8889,  // 静态资源服务器端口，默认8889端口
        open: false // 禁止自动打开网页
    },function(){
        gutil.log(color('静态资源服务启动成功...','CYAN'));
    });
});

/* compass编译后的css将注入到浏览器里实现更新 */ 
var doCompass = function(){
    gulp.src(config.compass.srcDir)
        .pipe(plumber())
        .pipe(compass({
            css: config.compass.cssDir,
            sass: config.compass.sassDir,
            image: config.compass.imageDir,
            require: ['compass/import-once/activate']
        }))
        .pipe(reload({stream: true}))
}

/* 监听scss文件 */
gulp.task('watch-scss', function () {
    return gwatch('./src/scss/**/*.scss',function(e){
        doCompass();
        gutil.log(color('File ' + e.path + ' was ' + e.event + ', running [watch-scss]','GREEN'));
    });
});

/* 监听css文件 */
gulp.task('watch-css', function () {
    var processors = [
            autoprefixer
        ];

    return gwatch('./src/css/**/*/*.css',function(e){
        var file = e.path;
        var star = file.indexOf('css') + 3,
            end  = file.lastIndexOf('\\');
        var dist = file.substring(0,end);
        gulp.src(file).pipe(postcss(processors)).pipe(gulp.dest(dist));

        gutil.log(color('File ' + e.path + ' was ' + e.event + ', running [watch-css]','GREEN'));
    });
});

/* 监听js文件 */
gulp.task('watch-js', function () {
    return gwatch('./src/js/**/*/*.js',function(e){
        updateTpl();
        gutil.log(color('File ' + e.path + ' was ' + e.event + ', running [watch-js]','GREEN'));
    });
});

/* 监听img文件 */
gulp.task('watch-img', function () {

    return gwatch('./src/img/**/*{jpg,png}',function(e){
        var evt  = e.event,
            path = e.path;
        var arrs = path.split('\\'),
            name = arrs.pop(),
            webpdir = arrs.join('/');

        if(evt == 'add'){
            gulp.src(path)
                .pipe(webp())
                .pipe(gulp.dest(webpdir));
        }else if(evt == 'unlink'){
            gutil.log(color(evt + ' ' + path,'GREEN'));
            var names = name.split('.');
            names.pop();
            names.push('webp');
            webpdir = webpdir + "/";
            fs.unlink(webpdir+names.join('.'),function(err){
                if(err){
                    gutil.log(err);
                }
            });
        }
    });
});

/* 监听gif文件 */
gulp.task('watch-gif', function () {

    return gwatch('./src/img/**/*.gif',function(e){
        var evt  = e.event,
            dirs  = e.path.split('\\'),
            name = dirs.pop(),
            webpdir = dirs.join('/'),
            names = name.split('.');

        names.pop();
        names.push('webp');
        var webpname = names.join('.');

        var webpcmd = new cmd('gif2webp');
        webpcmd.setCwd(webpdir);

        if(evt == 'add'){ // 新增gif文件
            var common = name + ' -m 6 -q 75 -mixed -o ' + webpname;
            webpcmd.exec(common,function(){
                gutil.log(color('Add '+webpname,'GREEN'));
            });
        }else if(evt == 'unlink'){ // 删除gif文件
            gutil.log(color(evt + ' ' + e.path,'GREEN'));
            
            webpdir = webpdir + "/";
            fs.unlink(webpdir + webpname,function(err){
                if(err){
                    gutil.log(err);
                }
            });
        }
    });
});

/* 监听html文件 */
gulp.task('watch-tpl', function () {

    return gwatch('./www/**/*.html',function(e){
        updateTpl();
        gutil.log(color('File ' + e.path + ' was ' + e.event + ', running [watch-tpl]','GREEN'));
    });
});

/* 实时更新html文件 */
var updateTpl = function(){
    gulp.src('./www/**/*.html')
    .pipe(reload({stream: true}));
}

/* 执行copy任务 */
gulp.task('copy', function() {
    gulp_copy.copy({
        path:{
            www:config.copy.www,
            scss:config.copy.scss,
            css:config.copy.css,
            js:config.copy.js,
            img:config.copy.img,
        },
        func:{
            base64:{
                isOn:config.base64.isOn,
                size:config.base64.size
            },
            embed:{
                isOn:config.embed.isOn,
                compressJs:config.embed.compressJs,
                compressCss:config.embed.compressCss
            },
            rev:{
                isOn:config.rev.isOn
            },
            cssFilter:{
                isOn:config.cssFilter.isOn
            },
            minifyHtml:config.isMinifyHTML
        },
        match:config.match
    });
});

gulp.task('default', ['src-server', 'www-server', 'watch-scss', 'watch-tpl', 'watch-css', 'watch-js','watch-img','watch-gif']);