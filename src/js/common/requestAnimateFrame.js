(function() {
    var lastTime = 0;
    var prefix = ['webkit', 'moz', 'ms', 'o'];
    for (var x = 0; x < prefix.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[prefix[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[prefix[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
            window[prefix[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());