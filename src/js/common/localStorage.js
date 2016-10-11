define(function(require, exports, module){

    function LocalStorage() {
        this.ls = window.localStorage ? window.localStorage : window.globalStorage[strDomain];
    }

    // 对外暴露接口
    module.exports = LocalStorage;

    LocalStorage.prototype.isSupported = function() {
        var supported;

        if (typeof localStorage == 'undefined' || typeof JSON == 'undefined') {
            console.log("對不起，您的瀏覽器不支持localStorage！: (");
            supported = false;
        } else {
            supported = true;
        }

        return supported;
    };

    LocalStorage.prototype.setItem = function(key, value, lifetime) {
        if (!this.isSupported){
            return false;
        }

        // 默認為60s
        if (typeof lifetime == 'undefined'){
            lifetime = 60000;
        }

        this.ls.setItem(key, JSON.stringify(value));
        var time = new Date();
        this.ls.setItem('gm99_ctd_' + key, (time.getYear() + 1900) + "/" + time.getMonth() + "/" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
        this.ls.setItem('gm99_ct_' + key, time.getTime());
        this.ls.setItem('gm99_lt_' + key, lifetime);
    };

    LocalStorage.prototype.getItem = function(key) {
        if (!this.isSupported){
            return false;
        }

        var time = new Date();
        if (time.getTime() - this.ls.getItem('gm99_ct_' + key) > this.ls.getItem('gm99_lt_' + key)) {
            this.ls.removeItem(key);
            this.ls.removeItem('gm99_ctd_' + key);
            this.ls.removeItem('gm99_ct_' + key);
            this.ls.removeItem('gm99_lt_' + key);
            return false;
        }
        return JSON.parse(this.ls.getItem(key));
    };

    LocalStorage.prototype.removeItem = function(key) {
        if (!this.isSupported){
            return false;
        }

        this.ls.removeItem(key);
        this.ls.removeItem('gm99_ctd_' + key);
        this.ls.removeItem('gm99_ct_' + key);
        this.ls.removeItem('gm99_lt_' + key);
        return true;
    };

});


