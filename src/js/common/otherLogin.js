/**
 * Created by zhanglianmin on 2015/3/6.
 */

define( function( require, exports, module ){

    // 引入jquery ,utils
    var $ = require('jquery');

    var utils = require('utils');
    var login = require('common/login');

    var newUtile = new utils();

    function OtherLogin(){
        this.otherLoginDomArr = {
            'facebook' : '<a class="icon-facebook-normal target-other-login-btn" href="/direct_login/facebook?forward=/" title="Facebook快速登入" data-value="faceook"></a>',
            'baha' : '<a id="login-by-baha" class="icon-baha-normal target-other-login-btn" href="javascript:;" title="巴哈快速登入" data-value="baha"></a>',
            'google' : '<a class="icon-google-normal target-other-login-btn" href="/direct_login/google?forward=/" title="Google快速登入"  data-value="google"></a>',
            'yahoo' : '<a class="icon-yahoo-normal target-other-login-btn" href="/direct_login/yahoo_tw?forward=/" title="台灣奇摩帳號快速登入"  data-value="yahoo"></a>',
            'gamebase' : '<a class="icon-gamebase-normal target-other-login-btn" href="/direct_login/gamebase?forward=/" title="基地直接玩遊戲"  data-value="gamebase"></a>',
            '2000fun' : '<a class="icon-2000fun-normal target-other-login-btn" href="/direct_login/2000fun?forward=/" title="2000fun帳號快速登入"  data-value="2000fun"></a>',
            'gamesky' : '<a class="icon-gamesky-normal target-other-login-btn" href="/direct_login/igamer?forward=/" title="遊戲天堂帳號快速登入"  data-value="gamesky"></a>',
            'mycard' : '<a class="icon-mycard-normal target-other-login-btn" href="/mycard_member/request_login?forward=/" title="MyCard帳號快速登入"  data-value="mycard"></a>',
            'rc' : '<a id="login-by-rc" class="icon-rc-normal target-other-login-btn" href="javascript:;" title="RaidCall快速登入"  data-value="rc"></a>',
            'more' : ' <a id="more-login-way" class="icon-more-normal" href="javascript:;"></a>',
            'other' : '<a id="close-login-btn" class="close-login-btn" href="javascript:;"></a><i class="left-triangle"></i>'
        };
        this.cookieName = 'target-other-login-btn';
        this.cookieVal = newUtile.getCookie( this.cookieName );
    }

    OtherLogin.prototype.setHtml = function( objIdArr, sortArr ){
        var that = this, html = '';
        if( that.cookieVal == null ){
            $.each( objIdArr, function( ko, itemo ){
                $.each( sortArr[ko], function( ks, items ){
                    html += that.otherLoginDomArr[items];
                } );
                $('#'+itemo).empty().html( html );
                html = '';
            } );
        }else{
            var newSortArr = that.resetSort( that.cookieVal, sortArr );
            //html += that.otherLoginDomArr[that.cookieVal];
            $.each( objIdArr, function( ko, itemo ){
                $.each( newSortArr[ko], function( ks, items ){
                    //if( that.cookieVal != items ){
                        html += that.otherLoginDomArr[items];
                    //}
                } );
                $('#'+itemo).empty().html( html );
                html = '';
            } );
        }
        return that;
    };

    OtherLogin.prototype.resetSort = function( firstVal, sortArr ){
        var newArr = sortArr;
        if( newArr[0].indexOf( firstVal ) != -1 ){
            var index = newArr[0].indexOf( firstVal), temVal = newArr[0][index];
            newArr[0].splice( index, 1);
            newArr[0].unshift( temVal );
        }else{

            $.each( newArr, function( k, item){
                if( k != 0){
                    var index = item.indexOf( firstVal), temVal = item[index], tem0Val = newArr[0][ newArr[0].length - 2 ];
                    item.splice( index, 1);
                    item.unshift( tem0Val );
                    newArr[0].splice( newArr[0].length - 2, 1);
                    newArr[0].unshift( temVal );
                }
            } );

        }
        return newArr;
    };

    OtherLogin.prototype.resetBind = function(){
        var newLogin = new login(), that = this;
        newLogin._moreWay();
        newLogin._initBahaLoginPart();
        newLogin._initRCLoginPart();

        $('.target-other-login-btn').on('click', function(){
            var thisVal = $(this).attr('data-value');
            newUtile.setCookie( that.cookieName , thisVal, 7);
        });

    };

    module.exports = OtherLogin;

});