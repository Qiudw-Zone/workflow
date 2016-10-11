目录结构介绍：
www
    `-- events：各活动的图片目录，命名规范如下：
           | -- 2016：年度
                | -- 03：月份
                     | -- gm_online：活动名文件夹
                            | -- index.html：活动主页面
                            ` -- other.html：活动其它页面
                     | -- ......
                     ` -- ......
                | -- 04
                     ` -- ......
           | -- 2017
           ` -- ......
    --- games：官网模板
           | -- mu：游戏标识
                 | -- index.html：首页
                 | -- list.html：文章列表页
                 | -- article.html：文章内页
                 ` -- server.html：伺服器页
    --- platform：平台模块
           | -- index.html：平台首页
           | -- pay.html：储值页
           | -- service.html：客服页
           ` -- ......