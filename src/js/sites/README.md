js
    `--- common ：通用文件
          | -- Utils.js ：工具栏封装，常用例如：收藏，cookies操作等
          | -- Login.js ：登录对象，处理登录模块逻辑，包括验证，提交等操作
          | -- Register.js ：注册对象，处理注册模块逻辑
          | -- Header.js ：通用头部脚本
          | -- FbToolkits.js ：fb工具包：包括分享，邀请好友，点赞功能
          ` -- ......
     --- libs：存放js类库
          | -- require.js
          | -- sea.min.js
          | -- jquery.1.10.1.min.js
          | -- jquery.ui.min.js
          ` -- ......
     --- plugin：多语言插件目录文件夹（可根据实际需要）
     --- plugins：存放jq插件，命名规范：以jquery.pluginname.js的格式，存放插件源文件（便于修改或扩展）与压缩后的文件
          | -- jquery.lazyLoading.js
          | -- jquery.lazyLoading.min.js
          | -- jquery.carouFredSel.js
          | -- jquery.carouFredSel.min.js
          ` -- ......
     --- platform：平台五大模块功能拆分
         | -- index：平台首页
         | -- gift.center：礼包中心
         | -- pay：储值购点
         | -- game.center：游戏中心
         | -- member.center：会员中心
         | -- service.center：客服中心
         ` -- article：文章内页及列表页
     --- games：各游戏官网的js主文件入口，命名规范：以游戏名加点命名
         | -- mu
              | -- main.js：主入口文件
              ` -- otherjs：其它文件入口
         | -- ......
         ` -- ......
     --- events：各游戏活动的js主文件入口，命名规范如下：
         | -- 2016：年度
              | -- 03：月份
                   | -- gm_online：活动名文件夹
                          | -- main.js    该活动主文件入口
                          | -- other.js   其他模块文件，可根据需要自定义
                   | -- ......
                   ` -- ......
              | -- 04
                   ` -- ......
         | -- 2017
         ` -- ......