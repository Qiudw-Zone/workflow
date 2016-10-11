define(function(require, exports, module) {

    // 引入jquery
    var $ = require('jquery');

    function Utils() {
    }
    // 对外暴露接口
    module.exports = Utils; 

    /*
     * 加入收藏夾
     */
    Utils.prototype.addFavorite = function(url, title) {
        var sURL = url || location.href;
        var sTitle = title || document.title;
        var that = this;

        try {
            window.external.AddFavorite(sURL, sTitle);
        } catch (e) {
            try {
                window.sidebar.addPanel(sTitle, sURL, "");
            } catch (e) {
                that.dialog({
                    content: "加入收藏失敗，請使用Ctrl+D進行添加"
                });
            }
        }
    };

    /*
     * 获取url传过来的参数，js版的$_GET
     * 如当前url为： //www.xxx.com/?cid=123
     * var cid = _GET('cid');
     */
    Utils.prototype._GET = function(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);

        if (r!=null) return unescape(r[2]); return null;
    };

    /**
     * 公共彈窗註冊 帶參數
     * @param url
     * @returns null
     */
    Utils.prototype.comReg= function() {
        var regUrl = '/ajax/register/?forward=/';
        var locationHref = location.href;
        var arrUrl = urlParams( locationHref );

        if( location.href.split('/')[3] != '' ){
            regUrl += location.href.split('/')[3];
        }

        if( (arrUrl.hasOwnProperty('cid') && arrUrl['cid'] > 0) && (arrUrl.hasOwnProperty('scid') && arrUrl['scid'] != null ) ){
            regUrl += '&cid=' +  arrUrl['cid'] + '&scid=' + arrUrl['scid'] + '&subid=' + arrUrl['subid'] + '&link_id=' + arrUrl['link_id'];
        }
        dialog('iframe',regUrl , 760, 640, 'regDL');
    };


    /**
     * 解析url的search
     * @param url
     * @return {Object}
     */
    Utils.prototype.urlParams= function(url) {
        var args = {};
        // 取查询字符串，以 & 符分开成数组
        var pairs = url.substring(url.indexOf("?")+1,url.length).split("&");
        var pairsLen = pairs.length;

        for(var i= 0; i < pairsLen; i++) {
            // 查找 "name=value" 对，若不成对，则跳出循环继续下一对
            var pos = pairs[i].indexOf('=');
            if (pos == -1) continue;

            // 取参数名，參數值
            var argname = pairs[i].substring(0,pos);
            var value = pairs[i].substring(pos+1);

            // 存成对象的一个属性
            args[argname] = decodeURIComponent(value);
        }
        return args;
    };

    /**
     * 設置Cookie
     * @param name
     * @param value
     * @param expires
     */
    Utils.prototype.setCookie= function(name, value, expires) {
        expires = expires ? expires : 1;

        var expireStr = '';
        if (expires > 0) {
            var days = expires;
            var exp = new Date();
            exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
            expireStr = ";expires=" + exp.toUTCString();
        } else {
            expireStr = 0;//此 cookie 将在视窗关闭后失效
        }

        document.cookie = name + "=" + escape(value) + expireStr + ";path=/;domain=gm99.com;";
    };

    /**
     * 獲得Cookie
     * @param name
     * @returns {*}
     */
    Utils.prototype.getCookie= function(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        return null;
    };

    /**
     * 刪除Cookie
     * @param name
     */
    Utils.prototype.delCookie= function(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString();
    };

    /* 复制 */
    Utils.prototype.copyTo= function(txt) {
        var that = this;
        if (window.clipboardData) {
            window.clipboardData.clearData();
            window.clipboardData.setData("Text", txt);
            that.dialog({
                content: "复制成功！"
            });
            return true;
        } else {
            that.dialog({
                content: "主人，目前僅IE瀏覽器支持複製功能，其他瀏覽器請手動記錄喔！"
            });
            return false;
        }
    };

    Utils.prototype.copyData= function(copyText) {
        var that = this;
        if (window.clipboardData)
        {
            window.clipboardData.setData("Text", copyText)
        }
        else
        {
            var flashcopier = 'flashcopier';
            if(!document.getElementById(flashcopier))
            {
                var divholder = document.createElement('div');
                divholder.id = flashcopier;
                document.body.appendChild(divholder);
            }
            document.getElementById(flashcopier).innerHTML = '';
            var divinfo = '<embed src="/js/_clipboard.swf" FlashVars="clipboard='+encodeURIComponent(copyText)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
            document.getElementById(flashcopier).innerHTML = divinfo;
        }
        that.dialog({
            content: "copy成功！"
        });
    };


    Utils.prototype.login = function(params) {
        var uname = params['uname'];
        var password = params['password'];
        var forward = params['forward'];
        var remember = params['remember'];
        var ckcode = params['ckcode'];
        var type = params['type'];
        var that = this;
        $.ajax({
            url:'/login/login3/',
            dataType:'JSON',
            data:{ 'uname': uname, 'password': password, 'forward': forward, 'remember': remember, 'ckcode': ckcode },
            type:'POST',
            success: function(data){
                /*if( data && data.hasOwnProperty('msg') ){
                 alert( data['msg']);
                 }*/
                if (data.hasOwnProperty('result') && data['result'] == 1) {
                    if( data.hasOwnProperty('bbs_sync') && data['bbs_sync'] ){
                        $('head').append( data['bbs_sync'].replace('\\', '') );
                    }
                    if (data.hasOwnProperty('forward')) {
                        setTimeout(function(){
                            window.top.location.href = decodeURIComponent( data['forward']) || '/';
                        }, 1000)
                    }

                } else {

                    if (type === "pop") {
                        $(".pop-login-auth-codes").click();
                    } else if (type === "index") {
                        $(".login-auth-codes").click();
                    }
                    $('#login-btn').text("登入");
                    $("#login-auth-code,#pop-login-auth-code").val("");
                    that.dialog({
                        content: data['msg']
                    });
                }
            }
        });
    };

    Utils.prototype.logout= function(forward) {
        var that = this;

        // 手遊接口同步登出
        $.ajax({
            url : '//mpay.gm99.com/logout.do',
            type : 'get',
            data : { },
            jsonp: 'callback',
            async : true,
            dataType : 'jsonp',
            success : function(json){
                //console.log(json);
            }
        });

        $.ajax({
            url:'/login/logout2?forward=' + forward,
            dataType:'JSON',
            success: function(data){

                if (data.hasOwnProperty('result') && data['result'] == 1) {
                    if (data.hasOwnProperty('bbs_sync') && data['bbs_sync']) {
                        $('head').append(data['bbs_sync'].replace('\\', ''));
                    }
                    if (data.hasOwnProperty('forward')) {
                        setTimeout(function(){
                            window.top.location.href = decodeURIComponent( data['forward']) || '/';
                        }, 1000)
                    }

                }else{
                    that.dialog({
                        content: data['msg']
                    });
                }
            }
        })
    };



    /*通用选项卡函数，带回调
     * API 介绍
     * tag : 选项卡选择器， (必须)
     * curr ： 当前选中的选项卡样式， (最好填)
     * cont ：选项卡内容选择器，数量需和上面的tag个数一致，你懂的。 (必须)
     * more ： 更多按钮选择器，(可选)
     * ev ：触发事件，默认鼠标划过，(可选)
     * before: ev事件未被触发时执行的函数 （可选）
     * callbak ：回调函数，可以让你在每一次切换选项卡的时候做些你想做的事， (可选)
     */
    Utils.prototype._TAG= function(conf) {
        var tag = conf && conf.tag || '.tag',
            curr = conf && conf.curr || 'curr',
            cont = conf && conf.cont || '.tagCont',
            more = conf && conf.more || '.more',
            ev = conf && conf.ev || 'mouseover',
            firstTrigger = conf.firstTrigger || 'yes',
            time = conf && conf.time || 500,
            before = conf && conf.before,
            callback = conf && conf.callback;
        var $tag = $(tag),$cont = $(cont),$more = conf.more ? $(more) : $(document);

        if (firstTrigger == 'yes') {
            $tag.eq(0).addClass(curr);
            $cont.eq(0).stop().show();
        }
        before && before();
        $tag.on(ev,function(){
            var that = $(this);
            var i = that.index(tag);
            that.addClass(curr).siblings(tag).removeClass(curr);
            $cont.hide().eq(i).show();

            if (conf.more) {
                $more.attr('href',that.attr('url'));
            }
            callback && callback(that,i);
        });
    };


    /*跳錨點*/
    Utils.prototype.scrollAnchor= function(anchorName) {
        var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');

        if (anchorName) {
            //        var $this = $('*[name="' + anchorName + '"]');
            var $this = $('#'+anchorName);
            var $this_top = $this.offset().top;
            $body.animate({ scrollTop: $this_top}, 600);
        } else {
            $body.animate({ scrollTop: 0}, 600);
        }
    };


    Utils.prototype.appendScript = function(src){
        var randNum = Math.random();
        var docmentHead = document.getElementsByTagName('head')[0];
        var infoScript= document.createElement("script");
        infoScript.type = "text/javascript";
        infoScript.src = src + "?r=" + randNum;
        docmentHead.appendChild(infoScript);
    };

    // 自定義下拉事件 複雜
    Utils.prototype.slideDownAction = function(selectPart, selectUl, selectLis, selectText, isPlaceText){
        selectPart.hover(function() {
            var $display = selectUl.css("display");
            if ($display === "block") {
                selectUl.stop().slideUp(200);
            } else{
                selectUl.stop().slideDown(200);
            }
        }, function(){
            selectUl.slideUp(200);
        });

        selectLis.on("click", function(){
            if (isPlaceText) {
                selectText.html($(this).html()).attr("data-location",$(this).attr("data-location"));
            }
            selectUl.slideUp(200);
        });
    };

    Utils.prototype.placeholder = function(InputId, preText) {
        var $input = $("#" + InputId);
        $input.css({
            color: "#969696",
            verticalAlign: "middle"
        }).focus(function(){
            if ($input.val() === preText) {
                $input.val("").css({
                    color: "#494949"
                });
            }
        }).blur(function(){
            if ($input.val() === "" || $input.val() === preText) {
                $input.val(preText).css({
                    color: "#969696"
                });
            }
        });
    };

    Utils.prototype.TAplaceholder = function(textareaId, preText) {
        var $textarea = $("#" + textareaId);
        $textarea.css({
            color: "#969696"
        }).focus(function(){
            if ($textarea.text() === preText) {
                $textarea.text("").css({
                    color: "#494949"
                });
            }
        }).blur(function(){
            if ($textarea.text() === "" || $textarea.text() === preText) {
                $textarea.text(preText).css({
                    color: "#969696"
                });
            }
        });
    };

    // 自定義下拉事件 簡單
    Utils.prototype.slideDown = function(selectPart, selectUl, selectText, dataAttr){
        var $selectPart = $("#" + selectPart);
        var $selectUl = $("#" + selectUl);
        var $selectText = $("#" + selectText);

        $selectPart.on("click", function() {
            var $display = $selectUl.css("display");
            var that = $(this);
            if ($display === "block") {
                $selectUl.stop().slideUp(200);
                that.removeClass("active");
            } else{
                $selectUl.stop().slideDown(200);
                that.addClass("active");
            }
        });

        $selectPart.find("li").on("click", function(){
            var $that = $(this);
            var $dataAttr = $(this).attr(dataAttr);
            $selectText.text($that.text()).attr(dataAttr, $dataAttr);
            $selectUl.slideUp(200);
            $selectPart.removeClass("active");
        });

        // 失去焦点
        $('html').mousedown(function(e){
            var $target = $(e.target);
            if(!$target.is($selectPart) && !$selectPart.has($target).length){
                $selectUl.slideUp(200);
                $selectPart.removeClass("active");
            }
        });
    };

    // 獲取對象屬性個數
    Utils.prototype.getPropertyCount = function(object){
        var i, count = 0;
        for(i in object){
            if(object.hasOwnProperty(i)){
                count++;
            }
        }
        return count;
    };

    // 遍历是否在数组中
    Utils.prototype.inArray = function(key, arr){
        for(var i = 0, k = arr.length; i < k; i++){
            if(key === arr[i]){
                return true;
            }
        }
        // 如果不在数组中就会返回false
        return false;
    };

    // 过滤字符串中的html标签和空白
    Utils.prototype.removeHtmlTag = function(str){
        str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
        str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
        return str;
    };

    // GM共用彈框提示
    Utils.prototype.dialog = function(options) {
        this.defaults = {
            yesBtn: true,
            noBtn: false,
            content : "這裡是默認的信息哦",
            url: "javascript:;",
            speed: 400,
            callback: null,
            yesCallback: null,
            noCallback: null
        };
        this.defaults = $.extend({}, this.defaults, options);
        this.init = function(){
            this._create();
            this.defaults.callback && typeof this.defaults.callback == "function" && this.defaults.callback();
        };
        this._create = function() {
            this._dialog = $('<div></div>')
                .addClass('dialog')
                .hide().appendTo('body');
            this._closeBtn = $('<a></a>')
                .attr("href", "javascript:;")
                .addClass('dialog-close-btn')
                .appendTo(this._dialog)
                .on('click', $.proxy(this._close, this));
            this._content = $('<p>' + this.defaults.content + '</p>')
                .addClass('dialog-content')
                .appendTo(this._dialog);
            this._yesBtn = $('<a>確認</a>')
                .addClass('dialog-btns dialog-yes-btn')
                .attr("href", this.defaults.url)
                .appendTo(this._dialog)
                .on('click', $.proxy(this._close, this))
                .on('click', $.proxy(this.defaults.yesCallback, this));
            this._noBtn = $('<a>取消</a>')
                .addClass('dialog-btns dialog-no-btn')
                .attr("href", "javascript:;")
                .appendTo(this._dialog)
                .on('click', $.proxy(this._close, this))
                .on('click', $.proxy(this.defaults.noCallback, this));
            this._shadowLayer = $('<div></div>')
                .addClass('shadow-layer')
                .appendTo("body");
            this._open();
        };
        this._open = function() {
            this.defaults.yesBtn === false ? this._yesBtn.hide() : this._yesBtn.show();
            this.defaults.noBtn === false ? this._noBtn.hide() : this._noBtn.show();
            this.defaults.url !== "javascript:;" ? this._yesBtn.attr("target", "_blank") : this._yesBtn.attr("target", "");
            this.defaults.content.length <= 30 ? this._content.css("margin", "265px 0 0 94px") : this._content.css("margin", "245px 0 0 94px");
            this._dialog.fadeIn(this.defaults.speed);
            this._shadowLayer.fadeIn(this.defaults.speed);
        };
        this._close = function() {
            this._dialog.fadeOut(this.defaults.speed);
            this._shadowLayer.fadeOut(this.defaults.speed, $.proxy(this._destroy, this));
        };
        this._destroy = function() {
            this._dialog.remove();
            this._shadowLayer.remove();
        };
        this.init();
    };

    /*Utils.prototype.copyText = function(id, text){
        //把對象放進 $this
        var $this = $('#'+id);

        $this.attr({'data-clipboard-text': text});
        var clip = new ZeroClipboard($this, {
            moviePath: "//www.gmresstatic.com/js/plugins/zeroclipboard/ZeroClipboard.swf"      //FLASH地址
        });
        clip.on('complete', function (client, args) {
            alert('pop-msg', "複製成功,請按Ctrl+V進行粘貼" );
        });
    }*/


});

