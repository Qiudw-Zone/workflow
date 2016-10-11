img
    `-- common ：通用模块部分图标
           | -- a.jpg|b.png：该目录下存放不需要合并的图片，背景图或其他特殊图片
           | -- icon：该目录存放需合并sprites的小图标集合
           ` -- icon-xxxxxxxxxx.png     针对与icon文件夹生成的sprites
    --- games：各游戏官网的图片目录，命名规范：以游戏名命名
           | -- mu
                | -- a.jpg|b.png：该目录下存放不需要合并的图片，背景图或其他特殊图片
                | -- icon：该目录存放需合并sprites的小图标集合
                ` -- icon-xxxxxxxxxx.png     针对与icon文件夹生成的sprites
           | -- ......
           ` -- ......
    --- events：各活动的图片目录，命名规范如下：
           | -- 2016：年度
                | -- 03：月份
                     | -- gm_online：活动名文件夹
                            | -- a.jpg|b.png：该目录下存放不需要合并的图片，背景图或其他特殊图片
                            | -- icon：该目录存放需合并sprites的小图标集合
                            ` -- icon-xxxxxxxxxx.png     针对与icon文件夹生成的sprites
                     | -- ......
                     ` -- ......
                | -- 04
                     ` -- ......
           | -- 2017
           ` -- ......
     -- platform：平台基本的图片目录；
             `-- index ：首页模块
                   | -- bg：该目录存放不需要合并的图片，背景图或其他特殊图片
                   | -- icons：该目录存放需合并sprites的小图标集合
                   ` -- icons-xxxxxxxxxx.png     针对与icons文件夹生成的sprites
            | -- pay：储值页，目录规范与index类似
            | -- game.center：游戏中心，目录规范与index类似
            | -- gift.center：礼包中心，目录规范与index类似
            | -- member.center：会员中心，目录规范与index类似
            | -- service.center：客服中心，目录规范与index类似
            | -- article：平台文章列表页及内页