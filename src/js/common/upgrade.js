define(function(require, exports, module) {

    // 引入jquery
    var $ = require('jquery');
    var Utils = require('utils');
    var utils = new Utils();

    function Upgrade() {

    }
    // 对外暴露接口
    module.exports = Upgrade;

    Upgrade.prototype.init = function() {

        this.unameInputs = $("#register-username");
        this.passwordInputs = $("#register-password,#register-password-confirm");
        this.codeInputs = $("#register-auth-code");
        this._checkLogin();
        this._focusInput();
        this._blurInput();
        this._refreshCode();
        this._submitRegisterForm();

    };

    // 檢測用戶是否已升級
    Upgrade.prototype._checkLogin = function() {

        $.get("//www.gm99.com/ajax/get_user_json", { }, function(response){

            if (response.hasOwnProperty("result") && response.result === 1) {

                // 已升級
                if (response.data.USER_TYPE === 0) {
                    window.location.href = "//www.gm99.com";
                }
            } else {

                // 無登錄狀態
                window.location.href = "//www.gm99.com";
            }
        }, "json");
    };

    // 輸入框聚焦切換icon樣式
    Upgrade.prototype._focusInput = function() {
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
    Upgrade.prototype._blurInput = function() {
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
    Upgrade.prototype._refreshCode = function() {
        var refreshBtn = $('#refresh-register-code,.auth-codes');
        refreshBtn.on('click', function() {
            $(".auth-codes").attr("src", "/verify_image?rnd=" + Math.random());
        });
    };

    // 檢查登錄與註冊表單共用代碼
    Upgrade.prototype._groupOpera = function(inputName, iconName, loginTip, state, tipText, top){
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

    Upgrade.prototype._checkRegisterForm = function(){

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
                $(".auth-codes").click();
                return false;
            } else {
                return true;
            }
        }

    };

    // 提交註冊表單
    Upgrade.prototype._submitRegisterForm = function() {
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
                $.get("//www.gm99.com/ajax/check_code?ckcode=" + $("#register-auth-code").val(), function(response){
                    if (response.result === 0) {
                        var tipText = "驗證碼錯誤，請重新輸入";
                        that._groupOpera($codeInput, $codeIcon, $registerTipError, "defend", tipText, 180);
                        $registerTipError.css("top", "182px");
                        $codeWarnIcon.removeClass("hide");
                        $(".auth-codes").click();
                        return false;
                    } else {
                        $.post("//www.gm99.com/index/binding_submit",{
                            uname: $("#register-username").val(),
                            password: $("#register-password-confirm").val()
                        }, function(res){

                            if (res.hasOwnProperty("result") && res.result === 1) {
                                var forward = $("#data-forward").attr("data-forward");

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
                                $('.auth-codes').click();
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


});

