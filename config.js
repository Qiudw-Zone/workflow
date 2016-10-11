module.exports = {
    bs1: {  // www服务器配置项
        port: 3000,
        index: 'platform/gm/game.html',
        baseDir: './www'
    },
        bs2: {  // 静态资源服务器配置项
        port: 3001,
        baseDir: "./src"
    },

    // 复制到svn开发目录时是否压缩html，默认值为false；建议给纯html文件文件开启；
    isMinifyHTML: false,  

    // 是否开启postCSS处理，开启则编译时间会加长，默认值为false，建议在上线前开启，可优化css选择器
    isPostCss: false, 

    // 图片base64处理功能
    base64: {
        isOn: true,  // 内联图片开关：表示html里面的图片是否做base64处理，默认值为false
        size: 3000  // 体积范围：表示图片小于3kb的会进行处理，默认值为3000
    },

    // 内容内联功能
    embed:{
        isOn:false, // 是否开启功能
        compressJs:false, // 内联的js是否进行压缩
        compressCss:false // 内联的css是否进行压缩
    },

    // 版本号添加功能
    rev:{
        isOn:false // 是否开启功能
    },
    compass: {
        srcDir: './src/scss/**/*.scss', // compass监听的源目录
        distDir: './src/css', // compass指定生成目录
        cssDir: './src/css',  // compass配置
        sassDir: './src/scss',  // compass配置
        imageDir: './src/img' // compass配置
    },
    // css过滤器功能参数
    cssFilter:{
        isOn:false, // 是否开启功能
        "cssLib":"./base.css.json" // css类库路径
    },
    // 复制功能参数
    copy:{
        cacheDir:'./_temp', // 用于缓存被复制文件路径的目录

        // 复制映射表
        www: {
          from: __dirname + '/www/events/2016/08/xj', // 复制源路径
          // 复制目的路径
          to: 'D:/wion/work/code/events.gm99.com/src/templates/event/gm99/2016/08/xj'  
        },
        scss:{
            from: __dirname + '/src/scss/sites/events/2016/08/xj',
            to:'D:/wion/work/code/mabres.gm99.com/src/scss/sites/events/2016/08/xj'
        },
        css:{
            from:__dirname + '/src/css/sites/events/2016/08/xj',
            to:'D:/wion/work/code/mabres.gm99.com/src/css/sites/events/2016/08/xj'
        },
        js:{
            from:__dirname + '/src/js/sites/events/2016/08/xj',
            to:'D:/wion/work/code/mabres.gm99.com/src/js/sites/events/2016/08/xj'
        },
        img:{
            from:__dirname + '/src/img/sites/events/2016/08/xj',
            to:'D:/wion/work/code/mabres.gm99.com/src/img/sites/events/2016/08/xj'
        },
        src: {
          from: __dirname + '/src',
          to: 'E:/37/svndir/src'
        }
    },
    // 匹配前和替换后的字符串
    match: {
        before: 'http://localhost:8889',
        after: '//mabres.gm99.com'
    }
};