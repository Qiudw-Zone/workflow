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
            dom:$('#J_gift'),
            conf:{
                ppr:75
            },
            init:function(){
                this.initGiftCollapse();
                this.switchGiftFace();
            },
            initGiftCollapse:function(){
                var self = this;
                this.dom.on('click', '.coll-wrap', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var status = $(this).data('foot'),
                        flag   = 0,
                        height = 0;
                    var targetNode = $(this).parents('.a-head').next();
                    if(!status){
                        targetNode.removeClass('scale-down hide').addClass('scale-up');
                        flag = 1;
                        height = (223 / self.conf.ppr) + 'rem';
                    }else{
                        targetNode.removeClass('scale-up').addClass('scale-down');
                        setTimeout(function(){
                            targetNode.addClass('hide');
                        },400);
                    }
                    $(this).data("foot",flag);
                });
            },
            switchGiftFace:function(){
                var self = this;
                var gf = {
                    0:$('#J_m_gifts'),
                    1:$('#J_a_gifts')
                };
                var gd = {
                    0:'gf-desc-a',
                    1:'gf-desc-m'
                }
                var gfNavs = $('.gf-nav'),
                    gfDesc = $("#J_gf_desc");
                var gfIndex = 0;
                this.dom.on('click', '.gf-nav', function(event) {
                    event.preventDefault();
                    var index = $(this).index();
                    if(index === gfIndex) return;
                    gfNavs.eq(gfIndex).removeClass('gf-nav-on');
                    $(this).addClass('gf-nav-on');
                    gfDesc.removeClass(gd[gfIndex]).addClass(gd[index]);
                    gf[index].fadeOut(400, function() {
                        gf[gfIndex].fadeIn(500, function() {
                            gfIndex = index;
                        });
                    });
                });
            }
        }
        game.init();
    })
})