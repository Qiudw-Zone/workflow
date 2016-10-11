define(function(require, exports, module) {

    // 引入jquery
    var $ = require('jquery');
    var Utils = require('utils');
    var utils = new Utils();
    require('imgareaselect')($);

    function Login() {

    }
    // 对外暴露接口
    module.exports = Login;

    Login.prototype.init = function() {

        this.loginTab = $('#login-tab');
        this.registerTab = $("#register-tab");
        this.unameInputs = $("#login-username,#register-username,#pop-login-username,#pop-register-username");
        this.passwordInputs = $("#login-password,#register-password,#register-password-confirm,#pop-login-password,#pop-register-password,#pop-register-password-confirm");
        this.codeInputs = $("#login-auth-code,#register-auth-code,#pop-login-auth-code,#pop-register-auth-code");
        this.myAvatar = $("#my-avatar");
        this.closeAvatarPartBtn = $("#close-avatar-part-btn");
        this.saveAvatarBtn = $("#save-avatar-btn");

        this._checkLogin();
        this._changeTab();
        this._focusInput();
        this._blurInput();
        this._refreshCode();
        this._submitLoginForm();
        this._submitRegisterForm();
        this._logout();
        this._moreWay();

        this._popAvatarPower();
        this._submitAvatar();
        this._initUploadAvatarPart();
        this._initBahaLoginPart();
        this._initRCLoginPart();
        this._other();
        this._signin();
    };

    // 檢查用戶是否登錄
    Login.prototype._checkLogin = function() {

        var that = this;

        $.get("http://www.gm99.com/ajax/get_user_json", { }, function(response){

            if (response.hasOwnProperty("result") && response.result === 1) {

                // 登錄狀態，顯示頭像信息，用戶名，玩過的遊戲
                $("#login-before,#logout-state").addClass('hide');
                $("#login-after,#login-state").removeClass('hide');
                $("#loginAccount,#head-login-account").text(response.data.LOGIN_ACCOUNT);
                if(response.data.AVATAR !== ""){
                    $("#my-avatar,#avatar-img").attr("src", response.data.AVATAR);
                } else {
                    $("#my-avatar,#avatar-img").attr("src", "http://www.gmresstatic.com/img/common/avatar/avatar-1.png");
                }

                // 如果用戶類型等於0 則顯示升級圖標
                if (parseInt(response.data.USER_TYPE) !== 0) {
                    $("#upgrade-icon").removeClass("hide");
                }else{
                    var index_vip = '';
                    var index_html = '';
                    if($h_vip.hasOwnProperty('level')){ index_vip = $h_vip.level };
                    index_html = '<a href="/center/?showvip=1"><b class="h_vip'+index_vip+'" title="VIP' + index_vip + '">'+index_vip+'</b></a>';
                    $('.my-name').append(index_html);
                }
                // 玩過的遊戲歷史記錄
                var playListTemp = "";
                var playItemLength = response.data.INDEX_LAST_PLAY.length;

                $.each(response.data.INDEX_LAST_PLAY, function(index, info){

                    if (index < 4 && info.SHOW_INDEX_GAME_SERVERID !== 0) {
                        var gameicon = 'http://www.gmresstatic.com/img/index/bg/default-icon.png';
                        info.SHOW_INDEX_GAME_PICICON !== "" ? gameicon = info.SHOW_INDEX_GAME_PICICON : gameicon;
                        playListTemp += '<div><a href="/play_games/play/server/' + info.SHOW_INDEX_GAME_NAME + '/id/' + info.SHOW_INDEX_GAME_SERVERID + '" target="_blank">';
                        playListTemp += '<img class="history-game-attr history-game-icon" src="' + gameicon + '" alt="'+ info.SHOW_INDEX_GAME_NAME +'" />';
                        playListTemp += '<span class="history-game-attr history-game-name">' + info.SHOW_INDEX_GAME_NAME_CN + '</span>';
                        playListTemp += '<span class="history-game-attr history-game-sid">S' + info.SHOW_INDEX_GAME_SERVERID + '</span>';
                        playListTemp += '</a><ul class="lpy_list"><li>';

                        $.each(info.SHOW_INDEX_GAME_SERVER, function(i, el){
                            playListTemp += '<a href="/play_games/play/server/' + info.SHOW_INDEX_GAME_NAME + '/id/' + el.SERVER_ID + '" target="_blank">';
                            playListTemp += '<em>'+el.SERVER_NAME+'</em>';
                            playListTemp += 'S' + el.SERVER_ID + '</a>';
                        });

                        playListTemp += '</li></ul></div>';

                    }

                });


                // 推薦的遊戲
                var recommendListTemp = "";
                var recommendListLength = 0;

                if (playItemLength === 0) {
                    recommendListLength = response.data.INDEX_RECOMMEND_SERVER.length;
                } else {
                    recommendListLength = response.data.INDEX_RECOMMEND_SERVER.length - 1;
                }

                $.each( response.data.INDEX_RECOMMEND_SERVER, function(index, info) {

                    if (index < recommendListLength && info.GAME_SERVER_ID !== 0) {
                        info.LAST_GAME_PIC_ICON === "" ? info.LAST_GAME_PIC_ICON = "http://www.gmresstatic.com/img/index/bg/default-icon.png" : info.LAST_GAME_PIC_ICON = info.LAST_GAME_PIC_ICON;
                        recommendListTemp += '<a class="all-play-item" href="/play_games/play/server/' + info.GAME_NAME + '/id/' + info.GAME_SERVER_ID + '" target="_blank">';
                        recommendListTemp += '<img class="history-game-attr history-game-icon" src="' + info.LAST_GAME_PIC_ICON + '" alt="'+ info.GAME_NAME_CN +'" />';
                        recommendListTemp += '<span class="history-game-attr history-game-name">' + info.GAME_NAME_CN + '</span>';
                        recommendListTemp += '<span class="history-game-attr history-game-sid">S' + info.GAME_SERVER_ID + '</span>';
                        recommendListTemp += '<span class="history-game-attr history-game-sname">' + info.GAME_SERVER_NAME + '</span>';
                        recommendListTemp += '</a>';
                    }
                });


                if (playItemLength === 0) {
                    $("#has-play-text").addClass("hide");
                }
                if (playItemLength === 3 || playItemLength === 4) {
                    $("#all-play-text").addClass("hide");
                    recommendListTemp = "";
                }

                $("#my-game-history").html(playListTemp);
                $("#login-after").append(recommendListTemp);

                $('.lpy_list').hover(function(){
                    $(this).find('li').show();
                },function(){
                    $(this).find('li').hide();
                });

                $('#si_btn').attr('data-num',response.data.TODAY_IS_SIGN);
                $('#sign_number').html(that.rtnumber(response.data.USER_REAL_INTEGRAL));

                if( response.data.TODAY_IS_SIGN == 1 ){
                    $('#si_btn').html('已簽');
                }

            } else {

                // 無登錄狀態
                $("#login-before,#logout-state").removeClass('hide');
                $("#login-after,#login-state").addClass('hide');
                $(".login-auth-codes").attr("src", "/verify_image?rnd=" + Math.random());
            }
        }, "json");

    };

    // 切換登入與註冊tab
    Login.prototype._changeTab = function() {

        this.loginTab.on('click', function() {

            if ($(this).hasClass('selected')) {
                return false;
            } else {
                $(this).addClass('selected').next().removeClass('selected');
                $('#register-part').addClass('hide');
                $('#login-part-1,#login-part-2,#login-part-3').removeClass('hide');
                $("#circle-warn").addClass("hide");
                $(".login-auth-codes").attr("src", "/verify_image?rnd=" + Math.random());
            }
        });

        this.registerTab.on('click', function() {

            if ($(this).hasClass('selected')) {
                return false;
            } else {
                $(this).addClass('selected').prev().removeClass('selected');
                $('#login-part-1,#login-part-2,#login-part-3').addClass('hide');
                $('#register-part').removeClass('hide');
                $("#circle-error").addClass("hide");
                $('#close-login-btn').click();
                $(".register-auth-codes").attr("src", "/verify_image?rnd=" + Math.random());
            }
        });

    };

    // 輸入框聚焦切換icon樣式
    Login.prototype._focusInput = function() {
        this.unameInputs.on('focus', function() {
            $(this).prev().addClass('username-focus');
        });
        this.passwordInputs.on('focus', function() {
            $(this).prev().addClass('password-focus');
        });
        this.codeInputs.on('focus', function() {
            $(this).prev().addClass('defend-focus');
        });
    };

    // 輸入框失焦切換icon樣式
    Login.prototype._blurInput = function() {
        this.unameInputs.on('blur', function() {
            $(this).prev().removeClass('username-focus');
        });
        this.passwordInputs.on('blur', function() {
            $(this).prev().removeClass('password-focus');
        });
        this.codeInputs.on('blur', function() {
            $(this).prev().removeClass('defend-focus');
        });
    };

    // 刷新驗證碼
    Login.prototype._refreshCode = function() {
        var refreshBtn = $('#refresh-login-code,#refresh-register-code,.auth-codes');
        refreshBtn.on('click', function() {
            $(".auth-codes").attr("src", "/verify_image?rnd=" + Math.random());
        });
    };

    // 檢查登錄與註冊表單共用代碼
    Login.prototype._groupOpera = function(inputName, iconName, loginTip, state, tipText, top){
        if (tipText !== undefined) {
            loginTip.find("p").text(tipText);
        }
        if (top !== undefined) {
            loginTip.css("top" , top + "px");
        }
        inputName.css("border","1px solid #ef7777");
        loginTip.removeClass("hide");
        iconName.addClass(state + "-warn");
        setTimeout(function(){
            inputName.css("border","1px solid #b9b9b9");
            loginTip.addClass("hide");
            iconName.removeClass(state + "-warn");
            $(".state-icon").addClass("hide");
        },15000);
    };

    Login.prototype._checkLoginForm = function(){
        var $uname = $("#login-username").val();
        var $password = $("#login-password").val();
        var $authCode = $("#login-auth-code").val();
        var checkVal = $("#remember").attr('checked');

        var $userInput = $("#login-username");
        var $usernameIcon = $(".username-normal");
        var $loginTipWarn = $("#login-tip-warn");

        var $passwordInput = $("#login-password");
        var $passwordIcon = $(".password-normal");

        var $codeInput = $("#login-auth-code");
        var $codeIcon = $(".defend-normal");
        var $loginTipError = $("#login-tip-error");
        var $codeSuccessIcon = $("#circle-success");
        var $codeWarnIcon = $("#circle-warn");

        var tipText;
        var checkArr = [$uname, $password, $authCode];
        var unameReg = /^[A-Za-z0-9._@-]{4,100}$/; // 驗證輸入是否包括字母、數字、下底線、@
        //var pwdReg = /^[A-Za-z0-9]{6,16}$/; // 驗證輸入是否包括字母、數字

        if (checkVal == 'checked') {
            utils.setCookie('uname', $uname);
        }

        for (var i = 0;i < checkArr.length; i++) {

            if (checkArr[0] === "" || !unameReg.test(checkArr[0])) {
                tipText = "長度為4~16個字元，包括字母、數字、下底線、@、-，郵箱類帳號合法長度為6~100個字元";
                this._groupOpera($userInput, $usernameIcon, $loginTipWarn, "username", tipText, 56);
                return false;
            } else if (checkArr[1] === "" || checkArr[1].length > 16 || checkArr[1].length < 6) {
                tipText = "6-16個字元，包括字母和數字";
                this._groupOpera($passwordInput, $passwordIcon, $loginTipWarn, "password", tipText, 99);
                return false;
            } else if (checkArr[2] === "" || $codeInput.val().length !== 4) {
                tipText = "驗證碼錯誤，請重新輸入";
                this._groupOpera($codeInput, $codeIcon, $loginTipError, "defend", tipText, 140);
                $codeWarnIcon.removeClass("hide");
                $(".login-auth-codes").click();
                return false;
            } else {
                return true;
            }
        }

    };

    Login.prototype._checkRegisterForm = function(){

        var $uname = $("#register-username").val();
        var $password = $("#register-password").val();
        var $passwordConfirm = $("#register-password-confirm").val();
        var $authCode = $("#register-auth-code").val();
        var checkBox = $("#recept-checkbox");

        var $userInput = $("#register-username");
        var $usernameIcon = $(".username-normal");
        var $loginTipWarn = $("#login-tip-warn");

        var $passwordInput1 = $(".register-password");
        var $passwordInput2 = $(".register-password-confirm");
        var $passwordIcon1 = $(".password-normal-1");
        var $passwordIcon2 = $(".password-normal-2");

        var $codeInput = $("#register-auth-code");
        var $codeIcon = $(".defend-normal");
        var $registerTipError = $("#login-tip-error");
        var $codeSuccessIcon = $("#circle-success-2");
        var $codeWarnIcon = $("#circle-warn-2");

        var tipText;
        var checkArr = [$uname, $password, $passwordConfirm, $authCode];
        var unameReg = /^[A-Za-z0-9._@]{6,100}$/; // 驗證輸入是否包括字母、數字、下底線、@
        //var pwdReg = /^[A-Za-z0-9]{6,16}$/; // 驗證輸入是否包括字母、數字

        if (!checkBox.is(':checked')) {
            utils.dialog({
                content: "您還未接受G妹遊戲服務合約書！"
            });
            return false;
        }

        for (var i = 0;i < checkArr.length; i++) {
            if (checkArr[0] === "" || !unameReg.test(checkArr[0])) {
                tipText = "長度為6~16個字元，包括字母、點，數字、下底線、@，郵箱類帳號合法長度為6~100個字元";
                this._groupOpera($userInput, $usernameIcon, $loginTipWarn, "username", tipText, 56);
                return false;
            } else if (checkArr[1] === "" || checkArr[0] === checkArr[1] || checkArr[1].length > 16 || checkArr[1].length < 6) {
                tipText = "6-16個字元，不能與帳號相同。建議您選擇一個不會在其他地方使用到的密碼";
                this._groupOpera($passwordInput1, $passwordIcon1, $loginTipWarn, "password", tipText, 98);
                return false;
            } else if (checkArr[2] === "") {
                tipText = "您還未輸入確認密碼哦，請先輸入~";
                this._groupOpera($passwordInput2, $passwordIcon2, $loginTipWarn, "password", tipText, 141);
                return false;
            } else if (checkArr[1] !== checkArr[2]) {
                tipText = "兩次輸入不一致，請重新確認密碼哦！";
                this._groupOpera($passwordInput1, $passwordIcon1, $loginTipWarn, "password", tipText, 141);
                this._groupOpera($passwordInput2, $passwordIcon2, $loginTipWarn, "password", tipText, 141);
                return false;
            } else if (checkArr[3] === "" || $codeInput.val().length !== 4) {
                tipText = "驗證碼錯誤，請重新輸入";
                this._groupOpera($codeInput, $codeIcon, $registerTipError, "defend", tipText, 180);
                $registerTipError.css("top", "182px");
                $codeWarnIcon.removeClass("hide");
                $(".register-auth-codes").click();
                return false;
            } else {
                return true;
            }
        }

    };

    // 提交登錄表單
    Login.prototype._submitLoginForm = function() {
        var loginBtn = $('#login-btn');
        var that = this;
        loginBtn.on('click', function() {

            // 表單驗證
            if (that._checkLoginForm() === false) {
                return false;
            } else {
                $.get("http://www.gm99.com/ajax/check_code?ckcode=" + $("#login-auth-code").val(), function(response){

                    if (response.result !== 1) {
                        var tipText = "驗證碼錯誤，請重新輸入";
                        that._groupOpera($("#login-auth-code"), $(".defend-normal"), $("#login-tip-error"), "defend", tipText, 140);
                        $("#login-tip-error").css("top", "140px");
                        $("#circle-warn-2").removeClass("hide");
                        $(".login-auth-codes").click();
                        return false;
                    } else {
                        loginBtn.text("登入中...");
                        var forward = $("#data-forward").attr("data-forward");
                        utils.login({
                            'uname': $('#login-username').val(),
                            'password': $('#login-password').val(),
                            'forward': forward,
                            'remember': $('#remember').attr('checked'),
                            'ckcode': $("#login-auth-code").val(),
                            'type': "index"
                        });
                    }
                }, "json");

            }
        });

        // 按下enter鍵時登錄
        $('#login-auth-code,#login-password').on("keydown", function(e){
            if (e.keyCode == 13 && !e.shiftKey) {
                loginBtn.click();
            }
        });
    };

    // 提交註冊表單
    Login.prototype._submitRegisterForm = function() {
        var that = this;
        var registerBtn = $('#register-btn');
        var $codeInput = $("#register-auth-code");
        var $codeIcon = $(".defend-normal");
        var $registerTipError = $("#login-tip-error");
        var $codeWarnIcon = $("#circle-warn-2");

        registerBtn.on('click', function() {

            // 表單驗證
            if (that._checkRegisterForm() === false) {
                return false;
            } else {
                $.get("http://www.gm99.com/ajax/check_code?ckcode=" + $("#register-auth-code").val(), function(response){
                    if (response.result === 0) {
                        var tipText = "驗證碼錯誤，請重新輸入";
                        that._groupOpera($codeInput, $codeIcon, $registerTipError, "defend", tipText, 180);
                        $registerTipError.css("top", "182px");
                        $codeWarnIcon.removeClass("hide");
                        $(".register-auth-codes").click();
                        return false;
                    } else {

                        $.post("http://www.gm99.com/login/register3",{
                            uname: $("#register-username").val(),
                            password: $("#register-password").val(),
                            repassword: $("#register-password-confirm").val(),
                            ckcode: $("#register-auth-code").val(),
                            terms: $("#recept-checkbox").val(),
                            forward: $("#reg-forward").val(),
                            cid: $("#reg-cid").val(),
                            scid: $("#reg-scid").val(),
                            subid: $("#reg-subid").val(),
                            link_id: $("#reg-link-id").val(),
                            game_id: $("#reg-game-id").val(),
                            game_server: $("#reg-game-server").val()
                        }, function(res){

                            if (res.hasOwnProperty("result") && res.result === 1) {
                                var forward = $("#data-forward").attr("data-forward");

                                try{
                                    if( typeof g_YWA_funcs !== 'undefined' ){
                                        g_YWA_funcs.doCustomAction();
                                    }
                                }catch(e){

                                }
                                if (forward == undefined) {
                                    window.location.href = "/";
                                } else {
                                    window.location.href = decodeURIComponent(forward);
                                }
                            } else {
                                var $userInput = $("#register-username");
                                var $usernameIcon = $(".username-normal");
                                var $loginTipWarn = $("#login-tip-warn");

                                that._groupOpera($userInput, $usernameIcon, $loginTipWarn, "username", res.msg, 45);
                                $('.register-auth-codes').click();
                                return false;
                            }
                        }, "json");
                    }
                }, "json");

            }
        });

        // 按下enter鍵時註冊
        $('#register-password-confirm,#register-auth-code').on("keydown", function(e){
            if (e.keyCode == 13 && !e.shiftKey) {
                $("#register-btn").click();
            }
        });
    };


    // 更多登錄方式
    Login.prototype._moreWay = function() {
        var moreWayBtn = $('#more-login-way'),
        closeBtn = $('#close-login-btn'),
        hidePart = $('#hide-login-icons');

        moreWayBtn.on('click', function() {

            if (hidePart.is(":visible")) {
                hidePart.addClass('hide');
            } else {
                hidePart.removeClass('hide');
            }
        });
        closeBtn.on('click', function() {
            hidePart.addClass('hide');
        });
    };

    // 登出按鈕
    Login.prototype._logout = function() {
        var logoutBtn = $('#logout-btn');

        logoutBtn.on('click', function() {
            utils.logout("/");
        });
    };


    // 更換頭像模塊
    Login.prototype._popAvatarPower = function(){
        var that = this;
        // 打開更換頭像彈框
        that.myAvatar.on("click", function(){
            $("#shadow-layer,#pop-avatar-part").fadeIn();
        });

        // 關閉更換頭像彈框
        that.closeAvatarPartBtn.on("click", function(){
            var oldAvatarUrl = $("#my-avatar").attr("src");
            that._destroyAreaSelect();
            $("#shadow-layer,#pop-avatar-part").fadeOut();
            $("#avatar-select-part,#avatar-opera-default-group,#avatar-select-info").show();
            $(".avatar-img").attr("src", oldAvatarUrl).css({
                width: "82px",
                height: "83px",
                marginLeft: 0,
                marginTop: 0
            });
            $("#avatar-upload-part").hide();
        });

    };

    // 提交头像部分
    Login.prototype._submitAvatar = function(){

        // 选择头像
        $("#avatar-select-part a").on("click", function(){
            $("#avatar-select-part a").removeClass("selected");
            $(this).addClass("selected");
            var dataUrl = "http://www.gmresstatic.com/img/common/avatar/avatar-" + $(this).attr("data-index") + ".png";
            var dataUrlIndex = $(this).attr("data-index");
            $("#save-avatar-btn").attr("data-url", dataUrlIndex);
            $("#avatar-img").attr("src", dataUrl);
        });

        // 提交按钮
        $("#save-avatar-btn").on("click", function(){
            var dataUrl = $(this).attr("data-url");
            $.get("http://www.gm99.com/ajax/set_avatar?avatar=" + dataUrl, function(response){

                if (response.hasOwnProperty("result") && response.result === 1) {
                    $("#my-avatar").attr("src", response.avatar);
                    $("#close-avatar-part-btn").click();
                } else {
                    utils.dialog({
                        content: "更新頭像失敗~請重新操作 :("
                    });
                }
            }, "json")
        });

    };

    // 初始化上傳自定義头像部分
    Login.prototype._initUploadAvatarPart = function(){
        var that = this;

        // 首次完成上傳操作，展示裁剪模塊
        window.firstUploadCallback = function(url, result, msg, controllerId){

            if (result === 1) {
                var $thimg = $('.thimg');
                var $avatarimg = $(".avatar-img");
                var thboxL = $('.thbox').width();
                var avatarboxL  = $('.avatar-img-box').width();

                $("#upload-error-info").text("");

                // 獲得上傳圖片url
                that.imgUrl = url;
                that._imgAreaSelectInit(url ,function(){
                    $thimg.attr('src' ,url);
                    $thimg.width(that.$img.width());
                    $thimg.height(that.$img.height());

                    $avatarimg.attr('src' ,url);
                    $avatarimg.width(that.$img.width());
                    $avatarimg.height(that.$img.height());
                } ,function(_selection){
                    var s = thboxL / _selection.width;
                    $thimg.css({
                        width: that.$img.width() * s,
                        height: that.$img.height() * s,
                        marginLeft: -_selection.x1 * s,
                        marginTop: -_selection.y1 * s
                    });

                    var s2 = avatarboxL / _selection.width;
                    $avatarimg.css({
                        width: that.$img.width() * s2,
                        height: that.$img.height() * s2,
                        marginLeft: -_selection.x1 * s2,
                        marginTop: -_selection.y1 * s2
                    });
                });

                // 切換上傳頭像模塊
                $("#avatar-select-part,#avatar-opera-default-group,#avatar-select-info").hide();
                $("#avatar-upload-part").show();
            } else {
                $("#upload-error-info").text("請上傳小於2M的jpg、png、gif格式的文件").css("color", "red");
            }
        };

        // 第二次完成上傳操作
        window.secondUploadCallback = function(url, result, msg, controllerId){

            if (result === 1) {
                that._destroyAreaSelect();
                var $thimg = $('.thimg');
                var $avatarimg = $(".avatar-img");
                var thboxL = $('.thbox').width();
                var avatarboxL  = $('.avatar-img-box').width();

                // 獲得上傳圖片url
                that.imgUrl = url;
                that._imgAreaSelectInit(url ,function(){
                    $thimg.attr('src' ,url);
                    $thimg.width(that.$img.width());
                    $thimg.height(that.$img.height());

                    $avatarimg.attr('src' ,url);
                    $avatarimg.width(that.$img.width());
                    $avatarimg.height(that.$img.height());
                } ,function(_selection){
                    var s = thboxL / _selection.width;
                    $thimg.css({
                        width: that.$img.width() * s,
                        height: that.$img.height() * s,
                        marginLeft: -_selection.x1 * s,
                        marginTop: -_selection.y1 * s
                    });

                    var s2 = avatarboxL / _selection.width;
                    $avatarimg.css({
                        width: that.$img.width() * s2,
                        height: that.$img.height() * s2,
                        marginLeft: -_selection.x1 * s2,
                        marginTop: -_selection.y1 * s2
                    });
                });
            } else {
                utils.dialog({
                    content: msg
                });
            }
        };

        // 提交裁剪座標
        $("#upload-avatar-sure-btn").on("click", function(){
            var x1 = that.selection.x1;
            var y1 = that.selection.y1;
            var width = that.selection.width;
            var height = that.selection.height;

            $.get("http://www.gm99.com/ajax/set_avatar?avatar=" + that.imgUrl + "&x=" + x1 + "&y=" + y1 + "&width=" + width + "&height=" + height, function(response){

                if (response.hasOwnProperty("result") && response.result === 1) {
                    var url = response.avatar;
                    $("#my-avatar,#avatar-img").attr("src", url);

                    $("#close-avatar-part-btn").click();
                    $("#avatar-select-part,#avatar-opera-default-group,#avatar-select-info").show();
                    $("#avatar-upload-part").hide();

                    $(".avatar-img").attr("style", "");
                    that._destroyAreaSelect();

                } else {
                    utils.dialog({
                        content: "更新頭像失敗~請重新操作 :("
                    });
                }
            }, "json");

        });
    };

    // 剪裁信息
    Login.prototype.selection = {};

    // 裁剪图片
    Login.prototype.$img = null;

    // 裁剪圖片url
    Login.prototype.imgUrl = "";

    // 裁剪處理函數
    Login.prototype._imgAreaSelectInit = function(src ,load ,fn){
        var that = this;
        that.$img = $('.photo');
        var $newimg = that.$img.clone();
        that.$img.after($newimg).remove();
        that.$img = $newimg;
        that.$img.on('load' ,function(){
            load();
            that.$img.off('load');
            that.$img.imgAreaSelect({
                aspectRatio: "1:1",
                handles: true,
                onSelectChange: handle,
                onInit: function(){
                    var ias = that.$img.imgAreaSelect({ instance: true }),
                        length = Math.min(that.$img.width() ,that.$img.height());
                    ias.setSelection(0, 0, length, length, true);
                    ias.setOptions({ show: true });
                    handle(that.$img[0] ,ias.getSelection());
                }
            });
            var time;
            // 裁剪处理
            function handle(img, _selection){
                that.selection = _selection;
                clearTimeout(time);
                time = setTimeout(function(){
                    fn(that.selection);
                },0);
            }
        });
        that.$img.attr('src' ,src);
        if(that.$img.width()) that.$img.trigger('load');
    };

    Login.prototype._destroyAreaSelect = function(){
      if (this.$img) {
          var ias = this.$img.imgAreaSelect({ instance: true });
          if (ias) {
              ias.cancelSelection();
          }
          this.$img = null;
      }
    };

    Login.prototype._initBahaLoginPart = function(){

        // 巴哈登錄按鈕
        $("#login-by-baha").on("click",function(){
            $("#shadow-layer,#baha-login-part").fadeIn();
        });

        // 巴哈彈框關閉按鈕
        $("#baha-login-close-btn").on("click",function(){
            $("#shadow-layer,#baha-login-part").fadeOut();
        });
    };

    Login.prototype._initRCLoginPart = function(){

        // 巴哈登錄按鈕
        $("#login-by-rc").on("click",function(){
            $("#shadow-layer,#rc-login-part").fadeIn();
        });

        // 巴哈彈框關閉按鈕
        $("#rc-login-close-btn").on("click",function(){
            $("#shadow-layer,#rc-login-part").fadeOut();
        });
    };

    Login.prototype._other = function(){

        $("#remember").on("click", function(){

            if ($(this).attr("checked") === "checked") {
                $(this).removeAttr("checked");
            } else {
                $(this).attr("checked", "checked");
            }
        });
    };

    Login.prototype._signin = function(){  //签到详情

        var that = this;

        $('#si_exp').on('click', function(){
            that.sign_exp();
        });

        $('#si_btn').on('click', function(){  //签到按钮
            var sicheck = $('#si_btn').attr('data-num');
            if(sicheck != 1){
                that.SIajax();
            }else{
                utils.dialog({
                    content: '您今日已經簽到過咯，請第二天再來簽到哦~'
                });
            }
        });

        $('.sign_in_default').on('click', function(){
            if($('#sign_in_btn').hasClass('sign_in_default')){
                var _time = new Date();
                var getday = _time.getDate();
                var getyear = _time.getFullYear();
                var comp_year = $('.ui-datepicker-year').html();
                var gt = that.SIajax();
                if( gt && getyear == parseInt(comp_year) ){
                    $('.ui-state-default').eq(getday-1).addClass('ui-state-sign');
                };
            }else{
                return;
            };
        });

        $('.sign_main').on('click', 'i.close', function(){
            $(this).parent().fadeOut('fast');
        });
    };

    Login.prototype.SIajax = function(){  //签到接口请求

        var that = this;
        var $item = false;

        $.ajax({
            type: 'get',
            url: '/signin/sign',
            dataType: 'json',
            async: false,
            success: function(json){
                if(json.result==1){

                    $('#si_num').html('+' + json.data.SIGN_GET_INTEGRAL);
                    $('#si_num').css('visibility','visible').stop().animate({ 'top': -46, 'opacity': 0 }, 500, function(){
                        $(this).removeAttr('style');
                    });

                    $('#si_total').html(json.data['CONTINUE_SIGN']);
                    $('#sign_in_btn').attr('class','sign_in_after');
                    $('#sign_number').html(that.rtnumber(json.data.USER_REAL_INTEGRAL));
                    $('#si_btn').attr('data-num',1).html('已簽');
                    $item = true;

                }else{
                    utils.dialog({
                        content: json.msg
                    });
                }
            }
        });

        return $item;

    };

    Login.prototype.sign_exp = function(){
        var _data = '';

        var str = $.ajax({
            type: 'get',
            url: '/signin/signdetail',
            dataType: 'json',
            async: false
        }).responseText;
        if(str !=''){
            if( typeof JSON != 'undefined' ){
                _data = JSON.parse( str );
            }else{
                _data = eval( '(' + str + ')' );
            }
        };

        if(_data.result==1){
            if(_data.data['TODAY_IS_SIGN']==1){
                $('#sign_in_btn').attr('class','sign_in_after');
            };

            $.each(_data.data['MON_SIGN_DATE'], function(idx,el){
                $('.ui-state-default').eq(el-1).addClass('ui-state-sign');
            });

            $('#si_total').html(_data.data['CONTINUE_SIGN']);

            $('.sign_main').fadeIn('fast');
        }else{
            utils.dialog({
                content: _data.msg
            });
        }
    };

    Login.prototype.rtnumber = function(numb){
        var _len = numb.toString().length;
        switch (_len){
            case 1:
                return '0000000'+numb;
            case 2:
                return '000000'+numb;
            case 3:
                return '00000'+numb;
            case 4:
                return '0000'+numb;
            case 5:
                return '000'+numb;
            case 6:
                return '00'+numb;
            case 7:
                return '0'+numb;
            default :
                return numb;
        }
    };


});

