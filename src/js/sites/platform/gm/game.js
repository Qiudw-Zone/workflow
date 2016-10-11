require.config({
    baseUrl: "//10.4.9.25:3001/js/",
    paths: {
        "zepto": "libs/zepto.1.1.6.min",
        "iSlider": "plugin/iSlider/iSlider.min",
        "iSliderAni": "plugin/iSlider/iSlider.animate.min",
        "iSliderBtn": "plugin/iSlider/iSlider.plugin.button.min",
        "iSliderDot": "plugin/iSlider/iSlider.plugin.dot.min",
        "dropload": "plugin/dropload/dropload"
    },
    shim: {
        'zepto':{
            exports: '$'
        },
        'dropload':{
            deps:['zepto']
        }
    }
});

require(['zepto','dropload'],function($){
    $(function(){
        var game = {
            dom:$('#J_game'),
            el:{
                pop:$('#J_pop')
            },
            init:function(){
                this.doDropLoad();

                this.showLoad();

                this.hideLoad();
            },
            doDropLoad:function(){
                var Jgames = $('#J_games_box');
                $("#J_games").dropload({
                    scrollArea:window,
                    loadDownFn:function(me){
                        var html = "";
                        $.ajax({
                            url: '//10.4.9.25:3000/json/games.json',
                            type: 'get',
                            dataType: 'json',
                            success:function(res){
                                console.log(res)
                                for(var i=0; i<4; i++){
                                    html += "<div class=\"g-item\">";
                                    html += "<div class=\"pic-box\"><i class=\"g-type new\"></i><img src=\"//10.4.9.25:3001/img/sites/platform/gm/game-pic.jpg\" alt=\"\" class=\"pic\"><p class=\"g-info\"><span class=\"g-name\">大航海家</span><span class=\"g-size\">454.5M</span></p></div>";
                                    html += "<div class=\"desc-box\"><div class=\"g-descs\"><p class=\"g-desc\">真3D极致画面，无缝大世界! </p><p class=\"g-desc\">珍藏版真钻首饰，每小时送送送！</p></div>";
                                    html += "<a class=\"g-download\">立即下載</a></div>";
                                    html += "<img src=\"//10.4.9.25:3001/img/sites/platform/gm/game-h-pic.png\" alt=\"\" class=\"pic-head\"></div>";
                                }
                                setTimeout(function(){
                                    Jgames.append(html);
                                    me.resetload(); // 每次数据加载完，必须重置
                                },1000);
                            },
                            error:function(xhr){
                                me.resetload();
                            }
                        })
                    }
                });
            },
            showLoad:function(){
                var self = this;
                this.dom.on('click', '.g-download', function(event) {
                    event.preventDefault();
                    self.el.pop.removeClass('hide');
                    self.el.pop.fadeIn('600', function() {
                        
                    });
                });
            },
            hideLoad:function(){
                var self = this;
                this.dom.on('click', '#J_close', function(event) {
                    event.preventDefault();
                    self.el.pop.fadeOut('600', function() {
                        self.el.pop.addClass('hide');
                    });
                });
            }
        }
        game.init();
    })
})