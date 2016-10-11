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

require(['zepto'],function($){
    $(function(){
        var infos = {
            dom:$('#J_info'),
            conf:{
                ppr:75
            },
            init:function(){
                
                this.switchInfosFace();
            },
            switchInfosFace:function(){
                var self = this;
                var ifs = {
                    0:$('#J_zx'),
                    1:$('#J_hk')
                };
                var ifNavs = $('.if-nav');
                var ifIndex = 0;
                this.dom.on('click', '.if-nav', function(event) {
                    event.preventDefault();
                    var index = $(this).index();
                    if(index === ifIndex) return;
                    ifNavs.eq(ifIndex).removeClass('if-nav-on');
                    $(this).addClass('if-nav-on');
                    ifs[index].fadeOut(400, function() {
                        ifs[ifIndex].fadeIn(500, function() {
                            ifIndex = index;
                        });
                    });
                });
            }
        }
        infos.init();
    })
})