'use strict';
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(root);
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory(root);
    }
}(this, function(exports) {
    exports.onerror = function(msg, url, line, col, error) {
        // 没有URL不上报！上报也不知道错误
        if (msg === "Script error." && !url) {
            return true;
        }
        function Reporter() {
            this.USE_LOG = true; // 是否关闭控制台错误显示
            this.JSONP_CALL_URL = '//events.gm99.com/frontend/receive'; // 错误反馈接口
            this.SAMPLING = 0.8; // 设置采样率，默认为80%的命中率
        };
        Reporter.prototype.__needReport = function(sampling) {
            // 设置采样率区间: 0~1
            return Math.random() <= sampling;
        };
        Reporter.prototype.__request = function(reqUrl) {
            var oldReq = document.getElementById(reqUrl);
            if (oldReq) {
                // 如果页面中注册了调用的监控服务，则重新调用
                oldReq.setAttribute("src", reqUrl);
                return;
            } else {
                // 如果未注册该监控服务，则注册并请求之
                var req = new Image();
                req.setAttribute("src", reqUrl);
                req.setAttribute("id", reqUrl);
                document.body.appendChild(req);
            }
        };
        Reporter.prototype.__send = function(rootUrl, postJson) {
            var paramStr = "?", reqUrl = "";    // json参数处理为字符串
            for (var prop in postJson) {
                if (prop === "url") {
                    paramStr += prop + "=" + encodeURIComponent(postJson[prop]);
                } else {
                    paramStr += "&" + prop + "=" + encodeURIComponent(postJson[prop]);
                }
            }
            reqUrl = rootUrl + paramStr;
            this.__request(reqUrl);
        };
        Reporter.prototype.bootstrap = function() {
            var __self = this;
            // 关闭控制台错误显示
            if (!__self.USE_LOG) {
                return true;
            }
            // 采用异步的方式能使脚本的异常数降低了10倍
            setTimeout(function() {
                var data = {};
                // 不一定所有浏览器都支持col参数
                col = col || (window.event && window.event.errorCharacter) || 0;
                data.url = url || "";
                data.pos = 'Line:' + line + ',Col:' + col;
                data.ua = navigator.userAgent;
                data.time = (new Date()).toLocaleDateString().replace(/\//g, "-");
                data.msg = msg;
                // 上报错误
                __self.__needReport(__self.SAMPLING) ? __self.__send(__self.JSONP_CALL_URL, data) : null;
            }, 0);
        };
        new Reporter().bootstrap();
    };
}));