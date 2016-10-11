define(function(require, exports, module) {

    // 引入jquery
    var $ = require('jquery');

    function fbToolkit() {
        this.opts = {
            APP_ID : '',
            link: '',
            picture:'',
            title : '',
            caption : '',
            actions : { 'name': '立即用Facebook玩', 'link':  this.link },
            description: '',
            ref : 'none'
        }
    }
    // 对外暴露接口
    module.exports = fbToolkit;

    // fb初始化
    fbToolkit.prototype.init = function(opstions, callback) {
        var that = this;
        that.opts = $.extend({ }, that.opts, opstions);
        window.fbAsyncInit = function() {
            FB.init({
                appId      :  that.opts.APP_ID,
                xfbml      : true,
                version    : 'v2.1'
            });
            callback && typeof callback == 'function' && callback(FB);
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/zh_TW/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    };

    // 分享功能
    fbToolkit.prototype.share = function(success, fail, callback){
        var that = this;
        // call the API
        FB.ui({
            method: 'feed',
            link: that.opts.link,
            picture: that.opts.picture,
            name: that.opts.title,
            caption: that.opts.caption,
            actions: that.opts.action,
            description: that.opts.description,
            ref: that.opts.ref
        }, function(response){
            // 記錄用戶的PO文内容
            if( response ) {
                //分享成功執行
                success && typeof success == 'function' && success(response);
            }else{
                //分享失敗執行
                fail && typeof fail == 'function' && fail(response);
            }
            callback && typeof callback == 'function' && callback(response);
        });
    };

});