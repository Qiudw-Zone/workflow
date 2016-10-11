目录结构介绍，目录与scss保持平行：
css
    `-- events：各活动的css目录，命名规范如下：
           | -- 2016：年度
                | -- 03：月份
                     | -- gm_online：活动名文件夹
                            | -- main.css：主入口样式
                            ` -- other.css：其它文件样式
                     | -- ......
                     ` -- ......
                | -- 04
                     ` -- ......
           | -- 2017
           ` -- ......
    --- games：官网模板
           | -- mu：游戏标识
                 | -- index.css：首页样式
                 | -- list.css：文章列表页样式
                 | -- article.css：文章内页样式
                 ` -- server.css：伺服器页样式
    --- platform：平台模块
           | -- index.css：平台首页样式
           | -- pay.css：储值页样式
           | -- service.css：客服页样式
           ` -- ......