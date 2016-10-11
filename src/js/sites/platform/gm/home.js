require.config({
    baseUrl: "//10.4.9.25:3001/js/",
    paths: {
        "zepto": "libs/zepto.1.1.6.min",
        "iSlider": "plugin/iSlider/iSlider.min",
        "iSliderAni": "plugin/iSlider/iSlider.animate.min",
        "iSliderBtn": "plugin/iSlider/iSlider.plugin.button.min",
        "iSliderDot": "plugin/iSlider/iSlider.plugin.dot.min"
    },
    shim: {
        'zepto':{
            exports: '$'
        }
    }
});
    
require(['zepto','iSlider','iSliderAni','iSliderDot'],function($, iSlider){
    $(function(){
        var gm = {
            dom:$('#J_home'),
            init:function(){
                this.initSlide();
            },
            initSlide:function(){
                var lists = [
                    {content: "<a href=\"\"><img src=\"//10.4.9.25:3001/img/sites/platform/gm/slide.jpg\" alt=\"\"></a>"},
                    {content: "<a href=\"\"><img src=\"//10.4.9.25:3001/img/sites/platform/gm/slide1.jpg\" alt=\"\"></a>"},
                    {content: "<a href=\"\"><img src=\"//10.4.9.25:3001/img/sites/platform/gm/slide2.jpg\" alt=\"\"></a>"}
                ]
                var slider = new iSlider({
                    dom:document.getElementById('J_slider'),
                    data:lists,
                    isAutoplay: 1,
                    isLooping: 1,
                    isOverspread: 1, // 背景平铺
                    animateType:'rotate',
                    animateTime: 800,
                    plugins: ['dot']
                });
            }
        }

        gm.init();
    })
});