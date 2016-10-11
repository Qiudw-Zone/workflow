define(function(require, exports, module) {

    // 引入jquery
    var $ = require('jquery');
    var Utils = require('utils');
    var utils = new Utils();

    function Activate() {

    }
    // 对外暴露接口
    module.exports = Activate;

    Activate.prototype.init = function() {

        this.unameInputs = $("#bbs-username");
        this._checkUpdate();
        this._focusInput();
        this._blurInput();
        this._submitForm();
    };

    // 檢測用戶是否已升級
    Activate.prototype._checkUpdate = function() {

        $.get("//www.gm99.com/ajax/get_user_json", { }, function(response){

            if (response.hasOwnProperty("result") && response.result === 1) {

                // 如果用戶類型等於0 則顯示升級圖標
                if (response.data.USER_TYPE !== 0) {
                    $("#upgrade-icon").removeClass("hide");
                }

                if(response.data.AVATAR !== ""){
                    $("#my-avatar,#avatar-img").attr("src", response.data.AVATAR);
                } else {
                    $("#my-avatar,#avatar-img").attr("src", "//www.gmresstatic.com/img/common/avatar/avatar-1.png");
                }
            } else {

                // 無登錄狀態
            }
        }, "json");

    };

    // 輸入框聚焦切換icon樣式
    Activate.prototype._focusInput = function() {
        this.unameInputs.on('focus', function() {
            $(this).prev().addClass('username-focus');
        });
    };

    // 輸入框失焦切換icon樣式
    Activate.prototype._blurInput = function() {
        this.unameInputs.on('blur', function() {
            $(this).prev().removeClass('username-focus');
        });
    };

    // 提交註冊表單
    Activate.prototype._submitForm = function() {

        $("#bbs-upgrade-btn").on("click", function(){

            if ($("#bbs-username").val() === "") {
                utils.dialog({
                    content: "請先輸入暱稱哦~"
                });
                return false;
            } else {
                //$("#activate-form").submit();
                $.post("//www.gm99.com/bbs/activate", {
                    bbs_name: $("#bbs-username").val()
                }, function(json){
                    if (json.hasOwnProperty("result") && json.result === 1) {
                        utils.dialog({
                            content: json.msg,
                            yesBtn: false
                        });
                        setTimeout(function(){
                            window.location.href = "//www.gm99.com/bbs";
                        }, 2000);
                    } else {
                        utils.dialog({
                            content: json.msg
                        });
                    }
                }, "json")
            }
        });

        // 按下enter鍵時註冊
        $('#bbs-username').on("keydown", function(e){
            if (e.keyCode == 13 && !e.shiftKey) {
                $("#bbs-upgrade-btn").click();
            }
        });

    };

});

