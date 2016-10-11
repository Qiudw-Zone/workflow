目录结构介绍：
scss
    `-- common：通用混合宏模块；
    --- helpers：主要包含了项目中关于Sass的工具和帮助之类；
    --- events：各活动的scss目录，命名规范如下：
           | -- 2016：年度
                | -- 03：月份
                     | -- gm_online：活动名文件夹
                            | -- main.scss：主入口样式
                            ` -- other.scss：其它文件样式
                     | -- ......
                     ` -- ......
                | -- 04
                     ` -- ......
           | -- 2017
           ` -- ......
    --- games：官网模板
           | -- mu：游戏标识
                 | -- index.scss：首页样式
                 | -- list.scss：文章列表页样式
                 | -- article.scss：文章内页样式
                 ` -- server.scss：伺服器页样式
    --- platform：平台模块
           | -- index.scss：平台首页样式
           | -- pay.scss：储值页样式
           | -- service.scss：客服页样式
           ` -- ......