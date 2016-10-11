define(function(require, exports, module) {

    // 引入jquery
    var $ = require('jquery');
    
    function Footer() {
    
    }
    // 对外暴露接口
    module.exports = Footer;

    Footer.prototype.init = function() {

        //this.initFriendLinks();
        this.initFriendLinksEffect();
    };

    Footer.prototype.initFriendLinks = function(){

        // ajax获取友情链接
        $.get("//www.gm99.com/ajax/get_flink",{"type": -1}, function(response){
            var linksTemp = "";

            $.each(response, function(index, info) {
                linksTemp += '<a href="' + info.URL + '" target="_blank">' + info.NAME + '</a>';
            });
            $("#links-inner").html(linksTemp);
        }, "json");
    };

    Footer.prototype.initFriendLinksEffect = function(){

        var $linksInner = $("#links-inner");
        var $topArrow = $("#top-arrow");
        var $bottomArrow = $("#bottom-arrow");

        var timer = setInterval(next,5000);

        // 上一張輪播圖
        function before(){

            if ($linksInner.css("top") === "0px") {
                $linksInner.animate({"top": "-15px"});
            } else {
                $linksInner.animate({"top": "0"});
            }
        }

        function next(){

            if ($linksInner.css("top") === "-15px") {
                $linksInner.animate({"top": "0"});
            } else {
                $linksInner.animate({"top": "-15px"});
            }
        }

        $topArrow.on("click", function(){
            before();
        });
        $bottomArrow.on("click", function(){
            next();
        });

        $linksInner.on("mouseenter", function(){
            clearInterval(timer);
        }).on("mouseleave", function(){
                timer = setInterval(next, 5000);
            });
    };

});

