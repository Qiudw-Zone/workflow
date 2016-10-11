define(function(require, exports, module) {

    // 引入jquery
    var $ = require('jquery');
    var Utils = require('utils');
    var utils = new Utils();

    function Header() {
    }
    // 对外暴露接口
    module.exports = Header;
    
    Header.prototype.init = function() {
        document.domain = "gm99.com";

        this.$logoutStatePart = $("#logout-state");
        this.$loginStatePart = $("#login-state");
        this.$accoutName = $("#head-login-account");

        this.$popLoginDom = $('<div id="pop-login-part" class="pop-login-part"><a class="pop-close-btn" href="javascript:;"></a><div class="login-part pop-inner-part"><div class="log-reg-change"><a class="pop-login-tab selected" href="javascript:;">會員登入</a> <a class="pop-register-tab" href="javascript:;">快速註冊</a></div><div id="pop-login-part-1" class="inputs-part"><p class="row"><i class="input-icon username-normal"></i> <input id="pop-login-username" class="user-inputs username-input" type="text" placeholder="帳號" /></p><p class="row"><i class="input-icon password-normal"></i> <input id="pop-login-password" class="user-inputs password-input" type="password" placeholder="密碼" /></p><p class="row"><i class="input-icon defend-normal"></i> <input id="pop-login-auth-code" class="user-inputs auth-code" type="text" placeholder="驗證碼" /> <i id="circle-success" class="state-icon circle-success hide"></i> <i id="circle-warn" class="state-icon circle-warn hide"></i> <span class="auth-code-text"><img class="auth-codes pop-login-auth-codes" src="#" /></span> <a id="pop-refresh-login-code" href="javascript:;" class="refresh-normal"></a></p><p class="row"><input type="checkbox" id="pop-remember" class="remember" checked="checked" value="1"><label class="label" for="pop-remember">記住登入</label><a class="find-password" href="//service.gm99.com/center?type=password" target="_blank">找回密碼</a></p><p class="row"><a id="pop-login-btn" href="javascript:;" class="login-btn">登入</a></p></div><div id="pop-login-part-2" class="another-login-text"><i class="right-triangle"></i><p>使用其他帳號登入</p></div><div id="pop-login-part-3" class="another-login-icons"><a class="icon-facebook-normal" href="/direct_login/facebook?forward=/" title="Facebook快速登入"></a><a id="pop-login-by-baha" class="icon-baha-normal" href="javascript:;" title="巴哈快速登入"></a><a class="icon-google-normal" href="/direct_login/google?forward=/" title="Google快速登入"></a><a class="icon-gamebase-normal" href="/direct_login/gamebase?forward=/" title="基地直接玩遊戲"></a><a class="icon-yahoo-normal" href="/direct_login/yahoo_tw?forward=/" title="台灣奇摩帳號快速登入"></a><a class="icon-2000fun-normal" href="/direct_login/2000fun?forward=/" title="2000fun帳號快速登入"></a><a class="icon-gamesky-normal" href="/direct_login/igamer?forward=/" title="遊戲天堂帳號快速登入"></a><a class="icon-mycard-normal hide" href="/mycard_member/request_login?forward=/" title="MyCard帳號快速登入"></a><a id="pop-login-by-rc" class="icon-rc-normal" href="javascript:;" title="RaidCall快速登入"></a></div></div><div id="pop-login-tip-warn" class="pop-login-tip warn hide"><i class="right-arrow"></i><p></p></div><div id="pop-login-tip-error" class="pop-login-tip error hide"><i class="right-arrow"></i><p></p></div></div>');
        this.$popRegisterDom = $('<div id="pop-register-part" class="pop-register-part"><a class="pop-close-btn" href="javascript:;"></a> <div id="register-part" class="inputs-part pop-inner-part"><div class="log-reg-change"><a class="pop-login-tab" href="javascript:;">會員登入</a> <a class="pop-register-tab selected" href="javascript:;">快速註冊</a></div><p class="row"><i class="input-icon username-normal"></i> <input id="pop-register-username" class="user-inputs username-input" type="text" placeholder="帳號" /></p><p class="row"><i class="input-icon password-normal"></i> <input id="pop-register-password" class="user-inputs password-input" type="password" placeholder="密碼" /></p><p class="row"><i class="input-icon password-normal"></i> <input id="pop-register-password-confirm" class="user-inputs password-input" type="password" placeholder="確認密碼" /></p><p class="row"><i class="input-icon defend-normal"></i> <input id="pop-register-auth-code" class="user-inputs auth-code" type="text" placeholder="驗證碼" /> <i id="circle-success-2" class="state-icon circle-success hide"></i> <i id="circle-warn-2" class="state-icon circle-warn hide"></i> <span class="auth-code-text"><img class="auth-codes pop-register-auth-codes" src="#" /></span> <a id="pop-refresh-register-code" href="javascript:;" class="refresh-normal"></a></p><p class="row"><input type="checkbox" id="pop-recept-checkbox" class="remember" checked value="1"><label class="label" for="pop-recept-checkbox">我接受G妹遊戲<a class="service-book" href="/agreement.htm" target="_black">服務合約書</a></label></p><p class="row"><a id="pop-register-btn" href="javascript:;" class="login-btn">立即註冊</a></p></div><div id="pop-login-tip-warn" class="pop-login-tip warn hide"><i class="right-arrow"></i><p></p></div><div id="pop-login-tip-error" class="pop-login-tip error hide"><i class="right-arrow"></i><p></p></div></div>');

        this.$registerBtn = $("#header-register-btn");
        this.$loginBtn = $("#header-login-btn");

        this.$closeBtn = this.$popLoginDom.find(".pop-close-btn");
        this.$closeBtn2 = this.$popRegisterDom.find(".pop-close-btn");

        this.$loginTab = this.$popRegisterDom.find(".pop-login-tab");
        this.$registerTab = this.$popLoginDom.find(".pop-register-tab");

        this.$PLogNameInput = this.$popLoginDom.find("#pop-login-username");
        this.$PRegNameInput = this.$popRegisterDom.find("#pop-register-username");
        this.$PLogPwdInput = this.$popLoginDom.find("#pop-login-password");
        this.$PRegPwdInput = this.$popRegisterDom.find("#pop-register-password");
        this.$PRegPwd2Input = this.$popRegisterDom.find("#pop-register-password-confirm");
        this.$PLogCodeInput = this.$popLoginDom.find("#pop-login-auth-code");
        this.$PRegCodeInput = this.$popRegisterDom.find("#pop-register-auth-code");

        this.$PLogRefreshBtn = this.$popLoginDom.find('#pop-refresh-login-code');
        this.$PRegRefreshBtn = this.$popRegisterDom.find('#pop-refresh-register-code');
        this.$PImgRefreshBtn1 = this.$popLoginDom.find('.pop-login-auth-codes');
        this.$PImgRefreshBtn2 = this.$popRegisterDom.find('.pop-register-auth-codes');

        this.$loginSubmitBtn = this.$popLoginDom.find("#pop-login-btn");
        this.$registerSubmitBtn = this.$popRegisterDom.find("#pop-register-btn");

        this.$addFavour = $(".add-favour");
        this.$dropdown = $(".dropdown");
        this.$btnAddFavour = $("#btn-add-favour");

        this.$popLoginByBahaBtn = this.$popLoginDom.find("#pop-login-by-baha");
        this.$popBahaCloseBtn = $("#pop-baha-login-close-btn");

        this.$popLoginByRCBtn = this.$popLoginDom.find("#pop-login-by-rc");
        this.$popRCCloseBtn = $("#pop-rc-login-close-btn");

        this._checkState();
        this._checkMessage();
        this._logout();
        this._popDom();
        this._closeDom();
        this._changeDom();

        this._focusInput();
        this._blurInput();
        this._refreshCode();

        this._submitLoginForm();
        this._submitRegisterForm();
        this._addFav();
        this._initBahaLoginPart();
        this._initRCLoginPart();
        this._other();
    };

    Header.prototype._checkState = function(){
        var that = this;
        $.get("//www.gm99.com/ajax/get_user_json", { }, function(response){

            if (response.hasOwnProperty("result") && response.result === 1) {

                // 登錄狀態，顯示頭像信息，用戶名，玩過的遊戲
                that.$logoutStatePart.addClass('hide');
                that.$loginStatePart.removeClass('hide');
                that.$accoutName.text(response.data.LOGIN_ACCOUNT);

                if (parseInt(response.data.USER_TYPE) !== 0) {
                    $("#header-upgrade-icon").removeClass("hide");
                }
            } else {

                // 無登錄狀態
                that.$logoutStatePart.removeClass('hide');
                that.$loginStatePart.addClass('hide');
            }
        }, "json");

    };

    Header.prototype._checkMessage = function(){
        $.get("//www.gm99.com/message_api/new_detect", { }, function(result){

            // 1有新消息 0无新消息
            if (result == 1) {
                $(".email-count,.red-circle").removeClass("hide");
            } else {
                $(".email-count,.red-circle").addClass("hide");
            }
        }, "text")
    };

    Header.prototype._logout = function() {
        var logoutBtn = $('#header-logout-btn');

        logoutBtn.on('click', function() {
            utils.logout("/");
        });
    };

    Header.prototype._popDom = function(){
        var that = this;

        // 註冊按鈕彈出註冊層
        that.$registerBtn.on("click", function(){
            //that.$shadowLayerDom.appendTo("body");
            that.$popLoginDom.appendTo("body");
            that.$popRegisterDom.appendTo("body");
            $("#shadow-layer,#pop-register-part").fadeIn();
            $(".pop-register-auth-codes").attr("src", "/verify_image?rnd=" + Math.random());
        });

        // 登入按鈕彈出登入層
        that.$loginBtn.on("click", function(){
            //that.$shadowLayerDom.appendTo("body");
            that.$popLoginDom.appendTo("body");
            that.$popRegisterDom.appendTo("body");
            $("#shadow-layer,#pop-login-part").fadeIn();
            $(".pop-login-auth-codes").attr("src", "/verify_image?rnd=" + Math.random());
        });
    };

    // 關閉彈出層按鈕
    Header.prototype._closeDom = function(){
        var that = this;
        that.$closeBtn.on("click", function(){
            $("#shadow-layer,#pop-login-part,#pop-register-part").fadeOut();
        });

        that.$closeBtn2.on("click", function(){
            $("#shadow-layer,#pop-login-part,#pop-register-part").fadeOut();
        });
    };

    // 彈出層tab切換
    Header.prototype._changeDom = function(){
        var that = this;

        that.$loginTab.on("click", function(){

            if ($(this).hasClass('selected')) {
                return false;
            } else {
                $("#pop-register-part").fadeOut();
                $("#pop-login-part").fadeIn();
                $(".pop-login-auth-codes").attr("src", "/verify_image?rnd=" + Math.random());
            }
        });

        that.$registerTab.on("click", function(){

            if ($(this).hasClass('selected')) {
                return false;
            } else {
                $("#pop-login-part").fadeOut();
                $("#pop-register-part").fadeIn();
                $(".pop-register-auth-codes").attr("src", "/verify_image?rnd=" + Math.random());
            }
        });
    };

    // 輸入框聚焦切換icon樣式
    Header.prototype._focusInput = function() {
        this.$PLogNameInput.on('focus', function() {
            $(this).prev().addClass('username-focus');
        });
        this.$PRegNameInput.on('focus', function() {
            $(this).prev().addClass('username-focus');
        });

        this.$PLogPwdInput.on('focus', function() {
            $(this).prev().addClass('password-focus');
        });
        this.$PRegPwdInput.on('focus', function() {
            $(this).prev().addClass('password-focus');
        });
        this.$PRegPwd2Input.on('focus', function() {
            $(this).prev().addClass('password-focus');
        });

        this.$PLogCodeInput.on('focus', function() {
            $(this).prev().addClass('defend-focus');
        });
        this.$PRegCodeInput.on('focus', function() {
            $(this).prev().addClass('defend-focus');
        });
    };

    // 輸入框失焦切換icon樣式
    Header.prototype._blurInput = function() {
        this.$PLogNameInput.on('blur', function() {
            $(this).prev().removeClass('username-focus');
        });
        this.$PRegNameInput.on('blur', function() {
            $(this).prev().removeClass('username-focus');
        });

        this.$PLogPwdInput.on('blur', function() {
            $(this).prev().removeClass('password-focus');
        });
        this.$PRegPwdInput.on('blur', function() {
            $(this).prev().removeClass('password-focus');
        });
        this.$PRegPwd2Input.on('blur', function() {
            $(this).prev().removeClass('password-focus');
        });

        this.$PLogCodeInput.on('blur', function() {
            $(this).prev().removeClass('defend-focus');
        });
        this.$PRegCodeInput.on('blur', function() {
            $(this).prev().removeClass('defend-focus');
        });
    };

    // 刷新驗證碼
    Header.prototype._refreshCode = function() {
        var that = this;

        that.$PLogRefreshBtn.on('click', function() {
            that.$PImgRefreshBtn1.attr("src", "/verify_image?rnd=" + Math.random());
        });
        that.$PRegRefreshBtn.on('click', function() {
            that.$PImgRefreshBtn2.attr("src", "/verify_image?rnd=" + Math.random());
        });
        that.$PImgRefreshBtn1.on('click', function() {
            that.$PImgRefreshBtn1.attr("src", "/verify_image?rnd=" + Math.random());
        });
        that.$PImgRefreshBtn2.on('click', function() {
            that.$PImgRefreshBtn2.attr("src", "/verify_image?rnd=" + Math.random());
        });
    };

    // 檢查登錄與註冊表單共用代碼
    Header.prototype._groupOpera = function(inputName, iconName, loginTip, state, tipText, top){

        if (tipText !== undefined) {
            loginTip.find("p").text(tipText);
        }

        if (top !== undefined) {
            loginTip.css("top" , top + "px");
        }

        inputName.css("border","1px solid #ef7777");
        loginTip.removeClass("hide");
        iconName.addClass(state + "-warn");

        // 15s後tip消失
        setTimeout(function(){
            inputName.css("border","1px solid #b9b9b9");
            loginTip.addClass("hide");
            iconName.removeClass(state + "-warn");
            $(".state-icon").addClass("hide");
        },15000);
    };

    Header.prototype._checkLoginForm = function(){
        var $uname = this.$PLogNameInput.val();
        var $password = this.$PLogPwdInput.val();
        var $authCode = this.$PLogCodeInput.val();
        var checkVal = this.$popLoginDom.find("#remember").attr('checked');

        var $userInput = this.$PLogNameInput;
        var $usernameIcon = this.$popLoginDom.find(".username-normal");
        var $loginTipWarn = this.$popLoginDom.find("#pop-login-tip-warn");

        var $passwordInput = this.$PLogPwdInput;
        var $passwordIcon = this.$popLoginDom.find(".password-normal");

        var $codeInput = this.$PLogCodeInput;
        var $codeIcon = this.$popLoginDom.find(".defend-normal");
        var $loginTipError = this.$popLoginDom.find("#pop-login-tip-error");
        var $codeSuccessIcon = this.$popLoginDom.find("#circle-success");
        var $codeWarnIcon = this.$popLoginDom.find("#circle-warn");

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
                this._groupOpera($userInput, $usernameIcon, $loginTipWarn, "username", tipText, 85);
                return false;
            } else if (checkArr[1] === "" || checkArr[1].length > 16 || checkArr[1].length < 6) {
                tipText = "6-16個字元，包括字母和數字，不能與帳號相同";
                this._groupOpera($passwordInput, $passwordIcon, $loginTipWarn, "password", tipText, 128);
                return false;
            } else if (checkArr[2] === "" || $codeInput.val().length !== 4) {
                tipText = "驗證碼錯誤，請重新輸入";
                this._groupOpera($codeInput, $codeIcon, $loginTipError, "defend", tipText, 170);
                $codeWarnIcon.removeClass("hide");
                this.$PImgRefreshBtn1.click();
                return false;
            } else {
                return true;
            }
        }
    };

    Header.prototype._checkRegisterForm = function(){
        var that = this;
        var $uname = this.$PRegNameInput.val();
        var $password = this.$PRegPwdInput.val();
        var $passwordConfirm = this.$PRegPwd2Input.val();
        var $authCode = this.$PRegCodeInput.val();
        var checkBox = this.$popRegisterDom.find("#pop-recept-checkbox");

        var $userInput = this.$PRegNameInput;
        var $usernameIcon = this.$popRegisterDom.find(".username-normal");
        var $loginTipWarn = this.$popRegisterDom.find("#pop-login-tip-warn");

        var $passwordInput1 = this.$PRegPwdInput;
        var $passwordInput2 = this.$PRegPwd2Input;
        var $passwordIcon1 = this.$popRegisterDom.find(".password-normal-1");
        var $passwordIcon2 = this.$popRegisterDom.find(".password-normal-2");

        var $codeInput = this.$PRegCodeInput;
        var $codeIcon = this.$popRegisterDom.find(".defend-normal");
        var $registerTipError = this.$popRegisterDom.find("#pop-login-tip-error");
        var $codeSuccessIcon = this.$popRegisterDom.find("#circle-success-2");
        var $codeWarnIcon = this.$popRegisterDom.find("#circle-warn-2");

        var tipText;
        var checkArr = [$uname, $password, $passwordConfirm, $authCode];
        var unameReg = /^[A-Za-z0-9._@]{6,100}$/; // 驗證輸入是否包括字母、數字、下底線、@
        var pwdReg = /^[A-Za-z0-9]{6,16}$/; // 驗證輸入是否包括字母、數字

        if (!checkBox.is(':checked')) {
            utils.dialog({
                content: "您還未接受G妹遊戲服務合約書！"
            });
            return false;
        }

        for (var i = 0;i < checkArr.length; i++) {

            if (checkArr[0] === "" || !unameReg.test(checkArr[0])) {
                tipText = "長度為6~16個字元，包括字母、數字、下底線、@，郵箱類帳號合法長度為6~100個字元";
                this._groupOpera($userInput, $usernameIcon, $loginTipWarn, "username", tipText, 84);
                return false;
            } else if (checkArr[1] === "" || checkArr[0] === checkArr[1] || checkArr[1].length > 16 || checkArr[1].length < 6) {
                tipText = "6-16個字元，包括字母和數字，不能與帳號相同。建議您選擇一個不會在其他地方使用到的密碼";
                this._groupOpera($passwordInput1, $passwordIcon1, $loginTipWarn, "password", tipText, 127);
                return false;
            } else if (checkArr[2] === "" || checkArr[0] === checkArr[2] || checkArr[1].length > 16 || checkArr[1].length < 6) {
                tipText = "6-16個字元，包括字母和數字，不能與帳號相同。建議您選擇一個不會在其他地方使用到的密碼";
                this._groupOpera($passwordInput2, $passwordIcon2, $loginTipWarn, "password", tipText, 170);
                return false;
            } else if (checkArr[1] !== checkArr[2]) {
                tipText = "兩次輸入不一致，請重新確認密碼哦！";
                this._groupOpera($passwordInput1, $passwordIcon1, $loginTipWarn, "password", tipText, 170);
                this._groupOpera($passwordInput2, $passwordIcon2, $loginTipWarn, "password", tipText, 170);
                return false;
            } else if (checkArr[3] === "" || $codeInput.val().length !== 4) {
                tipText = "驗證碼錯誤，請重新輸入";
                this._groupOpera($codeInput, $codeIcon, $registerTipError, "defend", tipText, 210);
                $registerTipError.css("top", "210px");
                $codeWarnIcon.removeClass("hide");
                that.$PImgRefreshBtn2.click();
                return false;
            } else {
                return true;
            }
        }
    };

    Header.prototype._submitLoginForm = function(){
        var that = this;
        var $codeInput = this.$PLogCodeInput;
        var $codeIcon = this.$popLoginDom.find(".defend-normal");
        var $loginTipError = this.$popLoginDom.find("#pop-login-tip-error");
        var $codeWarnIcon = this.$popLoginDom.find("#circle-warn");

        that.$loginSubmitBtn.on("click", function(){

            // 表單驗證
            if (that._checkLoginForm() === false) {
                return false;
            } else {
                $.get("//www.gm99.com/ajax/check_code?ckcode=" + that.$PLogCodeInput.val(), function(response){

                    if (response.result === 0) {
                        var tipText = "驗證碼錯誤，請重新輸入";
                        that._groupOpera($codeInput, $codeIcon, $loginTipError, "defend", tipText, 170);
                        $codeWarnIcon.removeClass("hide");
                        that.$PImgRefreshBtn1.click();
                        return false;
                    } else {
                        utils.login({
                            'uname': that.$PLogNameInput.val(),
                            'password': that.$PLogPwdInput.val(),
                            'forward': '/',
                            'remember': that.$popLoginDom.find('#pop-remember').attr('checked'),
                            'ckcode': that.$PLogCodeInput.val(),
                            'type': 'pop'
                        });
                    }
                }, "json");
            }
        });

        // 聚焦密碼框或驗證碼框，按下enter鍵時登錄
        that.$PLogPwdInput.on("keydown", function(e){
            if (e.keyCode == 13 && !e.shiftKey) {
                that.$loginSubmitBtn.click();
            }
        });
        that.$PLogCodeInput.on("keydown", function(e){
            if (e.keyCode == 13 && !e.shiftKey) {
                that.$loginSubmitBtn.click();
            }
        });
    };

    Header.prototype._submitRegisterForm = function(){
        var $codeInput = this.$PRegCodeInput;
        var $codeIcon = this.$popRegisterDom.find(".defend-normal");
        var $registerTipError = this.$popRegisterDom.find("#pop-login-tip-error");
        var $codeSuccessIcon = this.$popRegisterDom.find("#circle-success-2");
        var $codeWarnIcon = this.$popRegisterDom.find("#circle-warn-2");
        var that = this;

        that.$registerSubmitBtn.on("click", function(){

            // 表單驗證
            if (that._checkRegisterForm() === false) {
                return false;
            } else {
                $.get("//www.gm99.com/ajax/check_code?ckcode=" + that.$PRegCodeInput.val(), function(response){

                    if (response.result === 0) {
                        var tipText = "驗證碼錯誤，請重新輸入";
                        that._groupOpera($codeInput, $codeIcon, $registerTipError, "defend", tipText, 210);
                        $registerTipError.css("top", "210px");
                        $codeWarnIcon.removeClass("hide");
                        that.$PImgRefreshBtn2.click();
                        return false;
                    } else {
                        $.post("//www.gm99.com/login/register3",{
                            uname: that.$PRegNameInput.val(),
                            password: that.$PRegPwdInput.val(),
                            repassword: that.$PRegPwd2Input.val(),
                            ckcode: that.$PRegCodeInput.val(),
                            terms: "checked",
                            forward: "/",
                            cid: "0",
                            scid: "",
                            subid: "0",
                            link_id: "0",
                            game_id: "0",
                            game_server: ""
                        }, function(res){

                            try{
                                if( typeof g_YWA_funcs !== 'undefined' ){
                                    g_YWA_funcs.doCustomAction();
                                }
                            }catch(e){

                            }

                            if (res.hasOwnProperty("result") && res.result === 1) {
                                window.location.href = "/";
                            } else {
                                that.$PImgRefreshBtn2.click();
                                utils.dialog({
                                    content: res.msg
                                });
                            }
                        }, "json");
                    }

                }, "json");
            }
        });

        // 按下enter鍵時註冊
        that.$PRegPwd2Input.on("keydown", function(e){
            if (e.keyCode == 13 && !e.shiftKey) {
                that.$registerSubmitBtn.click();
            }
        });
        that.$PRegCodeInput.on("keydown", function(e){
            if (e.keyCode == 13 && !e.shiftKey) {
                that.$registerSubmitBtn.click();
            }
        });
    };

    Header.prototype._addFav = function(){
        var that = this;

        // 加入最愛部分(鼠標經過收藏顯示下拉內容)
        that.$addFavour.on("click",function(){
            var $display = that.$dropdown.css("display");

            if ($display === "block") {
                that.$dropdown.addClass("hide");
                $(this).css({
                    "border": "1px solid transparent",
                    "backgroundColor": "transparent"
                });
            } else {
                that.$dropdown.removeClass("hide");
                $(this).css({
                    "border": "1px solid #aaa",
                    "backgroundColor": "#f4f4f4"
                });
            }
        });

        // 加入最愛
        that.$btnAddFavour.on("click", function(){
            var Utils = require('./utils');
            var utilsObj = new Utils();
            utilsObj.addFavorite('//www.gm99.com/','G妹遊戲：愛遊戲，愛G妹！');
        });

        // 點擊文檔任何位置消失最愛下拉模塊
        $(document).click(function(e){

            if (!$(e.target).hasClass("add-favour")) {
                var $display = that.$dropdown.css("display");

                if ($display === "block") {
                    that.$dropdown.addClass("hide");
                    that.$addFavour.css({
                        "border": "1px solid transparent",
                        "backgroundColor": "transparent"
                    });
                }
            }
        });

    };

    // 初始化巴哈圖層模塊
    Header.prototype._initBahaLoginPart = function(){
        var that = this;

        // 巴哈登錄按鈕
        this.$popLoginByBahaBtn.on("click",function(){
            $("#pop-baha-login-part").fadeIn();
        });

        // 巴哈彈框關閉按鈕
        this.$popBahaCloseBtn.on("click",function(){
            $("#pop-baha-login-part").fadeOut();
        });
    };

    // 初始化RC圖層模塊
    Header.prototype._initRCLoginPart = function(){
        var that = this;

        // RC登錄按鈕
        this.$popLoginByRCBtn.on("click",function(){
            $("#pop-rc-login-part").fadeIn();
        });

        // RC彈框關閉按鈕
        this.$popRCCloseBtn.on("click",function(){
            $("#pop-rc-login-part").fadeOut();
        });
    };


    Header.prototype._other = function(){

        this.$popLoginDom.find("#pop-remember").on("click", function(){

            if ($(this).attr("checked") === "checked") {
                $(this).removeAttr("checked");
            } else {
                $(this).attr("checked", "checked");
            }
        });
    };

});

