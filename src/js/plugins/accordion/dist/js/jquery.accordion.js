/*
name:jquery.accordion
verson:0.0.1
author:fengweiqi
email:yakia@gm99.com
github:
blog:fengweiqi.cn
date:2015-03-20
*/ 
;(function($, window, document,undefined) {
	var Privateclass = function(el) {//私有类
			this.el=el;
			this.opts=el.data('accordion');//获取插件参数
			this.data=function(dataName,opts){
				el.data(dataName,opts);
			}
	}
	Privateclass.prototype={
		
	};
	var privateclass;//用于私有类实例化
	var methods = {//对外接口
		init: function(options) {
			var that=this;
			return this.each(function() {
				var $this = $(this);
				var opts = $this.data('accordion');
				if(typeof(opts) == 'undefined') {

					var defaults = {
							globalWidth:'',
							length:3,//长度
							spaceWidth:6,
							expandWidth:720,//展开宽度
							smallWidth:72,//缩小宽度
							expandTime:500,//展开所需时间
							slideAble:true
							
					   };

					opts = $.extend({}, defaults, options);
					$this.data('accordion', opts);
				} else {
					opts = $.extend({}, opts, options);
				}
				privateclass=new Privateclass($this);//实例化
				opts.length = $this.find('li').length;
				// 初始化
				
				opts.globalWidth=$this.find('ul').width();
				opts.spaceWidth=parseInt($this.find('ul li:last').css('margin-left'));
				
				//计算expendWidth
				opts.expandWidth=opts.globalWidth-(opts.spaceWidth+opts.smallWidth)*(opts.length-1);
				$this.find('.expand').width(opts.expandWidth);
				// 展示小图
				$this.find('li:not(".expand")').find('.small').css({
					'z-index':1,
					width:opts.smallWidth,
					opacity:0
				}).animate({
					opacity:1
				}, 1000);
				// 展示大图
				
				$this.find('.expand .big').css({
					'z-index':1,
					width:opts.expandWidth
				}).animate({
					opacity:1
				}, 1000);
				/**
				 * [switchBigSmall 小图大图切换]
				 * @param  {[type]} el [切换选项]
				 * @return {[type]}    [description]
				 */
				
				// 代码在这里运行
				function slide(el){
					// 大图淡入
					$(el).find('.small').css({'z-index':0});
					$(el).find('.big').css('z-index',1).animate({
						width: opts.expandWidth
					}, 100,function(){
						$(el).find('.small').css({'width':0});
					});
					
					$(el).stop().animate({width:opts.expandWidth}, opts.expandTime,function(){
					
						// that.find('li:not(".expand")').find('.big').css('z-index',0);
						// that.find('li:not(".expand")').find('.small').css('z-index',1);
					}).addClass('expand');
				}
				that.find('li').click(function(event) {
					var el=this;
					
					if(!$(this).hasClass('expand')){
						
						// 缩小
						that.find('li').stop().animate({
							width:opts.smallWidth
						},opts.expandTime,function(){
							// 小图淡入
							$(this).find('.small').css({'z-index':0,width:0});
							$(this).find('.big').css({'z-index':0});
							$(this).find('.small').css('z-index',1).animate({
								width:opts.smallWidth},0,function(){
									$(this).find('.big').css({'width':0});
								});
							
						}).removeClass('expand');


						// 展开
						slide(el);
						
					}
					
					
					
				});
				
			});
		}
	};

	$.fn.accordion = function() {
		var method = arguments[0];

		if(methods[method]) {
			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
		} else if( typeof(method) == 'object' || !method ) {
			method = methods.init;
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.accordion' );
			return this;
		}
		
		return method.apply(this, arguments);

	}

})(jQuery, window, document);
