define( function( require, exports, module){

    var $ = require('jquery');

    function CommonEvent(){
        this.opts = {
            dialogIndex : 98,
            autoDialog : { },
            forward : encodeURIComponent(window.location.href)
        }
    }

    module.exports = CommonEvent;

    CommonEvent.prototype.showDialog = function( id ){
        var that = this;
        var obj = $('#' + id);
        var popupHeight = obj.height();
        var top = (document.documentElement.clientHeight - popupHeight) / 2 + $(document).scrollTop();
        var left = 0 - Math.ceil(obj.width() / 2);

        $('body').append('<div class="ms-pop-bg" style="width:100%; height:' + $(document).height() +
        'px; background:#000000; opacity:.6; filter:alpha(opacity=60); position:absolute; top:0; z-index:' + that.opts.dialogIndex + ';"></div>');
        that.opts.dialogIndex = that.opts.dialogIndex + 1;
        obj.css({ position: 'absolute', top: top, left: '50%', marginLeft: left, zIndex: that.opts.dialogIndex }).fadeIn();
        that.opts.dialogIndex = that.opts.dialogIndex + 1;
        that.opts.autoDialog[ id ] = setInterval( function(){
            top = (document.documentElement.clientHeight - popupHeight) / 2 + $(document).scrollTop();
            obj.css({ top : top });
        }, 50);
    };

    CommonEvent.prototype.closeDialog = function( id ){
        var that = this;
        clearInterval( that.opts.autoDialog[id] );
        $('.ms-pop-bg').hide().remove();
        $('#' + id).hide();
    };

    CommonEvent.prototype.checkLogin = function(){
        var that = this;
        if( !user ){
            window.location.href = '/login?forward=' + that.opts.forward;
            return false;
        }
    };

//活動FACEBOOK
    CommonEvent.prototype.App = function(){
        this.opts = {
            APP_ID : '',
            link: '',
            picture:'',
            title : '',
            caption : '',
            actions : { 'name': '立即用Facebook玩', 'link':  this.link },
            description: '',
            ref : 'none'
        };
    };


    CommonEvent.prototype.App.init = function( opstions, callback ){
        var that = this;
        var opts = {
            APP_ID : '',
            link: '',
            picture:'',
            title : '',
            caption : '',
            actions : { 'name': '立即用Facebook玩', 'link':  this.link },
            description: '',
            ref : 'none'
        };
        this.opts = $.extend( { }, opts, opstions );
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

    CommonEvent.prototype.App.share = function( success, fail, callback ){
        var that = this.App;
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

    CommonEvent.prototype.App.getLoginStatus = function(){
        var that = this.App;
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                //console.log('Logged in.');
            }
            else {
                that.login();
            }
        });
    };

    CommonEvent.prototype.App.login = function( success, fail ){
        FB.login(function(response) {
            if (response.authResponse) {
                //console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', function(response) {
                    success && typeof success == 'function' && success(response);
                });
            } else {
                fail && typeof fail == 'function' && fail(response);
            }
        });
    };

});