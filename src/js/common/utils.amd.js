/**
 * 公共工具库
 * @param  {[type]} factory [description]
 * @return {[type]}         [description]
 */
(function(factory){
    if (typeof define === "function" && define.amd) {
        define([], function() {
            return factory();
        });
    }else{
        window.utils = factory();
    }
}(function(){ 
    

    return {
        
        AddFavorite: AddFavorite,
        _GET: _GET,
        _TAG: _TAG,
        logout: logout,
        cookie: cookie,
        checkAll: checkAll,
        scrollAnchor: scrollAnchor,
        focus_blur: focus_blur,
        countDown: countDown,
        strLen:strLen,
        subString:subString
      
    };

   


    // GBK字符集实际长度计算
    function strLen(str){
        var realLength = 0;
        var len = str.length;
        var charCode = -1;
        for(var i = 0; i < len; i++){
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) { 
                realLength += 1;
            }else{ 
                // 如果是中文则长度加3
                realLength += 2;
            }
        } 
        return realLength;
    }


    //截取字符串 包含中文处理  
    //(串,长度,增加...)  
    function subString(str, len, hasDot) {
        var newLength = 0;
        var newStr = "";
        var chineseRegex = /[^\x00-\xff]/g;
        var singleChar = "";
        var strLength = str.replace(chineseRegex, "**").length;
        for (var i = 0; i < strLength; i++) {
            singleChar = str.charAt(i).toString();
            if (singleChar.match(chineseRegex) != null) {
                newLength += 2;
            } else {
                newLength++;
            }
            if (newLength > len) {
                break;
            }
            newStr += singleChar;
        }

        if (hasDot && strLength > len) {
            newStr += "...";
        }
        return newStr;
    }

    /*加入收藏夾*/
    function AddFavorite(url, title){

    	var sURL = url || location.href;
    	var sTitle = title || document.title;

    	try {
    		window.external.addFavorite(sURL, sTitle);
    	} catch (e) {
    		try {
    			window.sidebar.addPanel(sTitle, sURL, "");
    		} catch (e) {
    			alert("Add to favorites faild, please press Ctrl+D");
    		}
    	}
    }



    /*
    * 获取url传过来的参数，js版的$_GET
    * 如当前url为： //www.xxx.com/?cid=123
    * var cid = _GET('cid');
    */
    function _GET(name){
    	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    	var r = window.location.search.substr(1).match(reg);

    	if (r!=null) return unescape(r[2]); return null;
    }



    /*通用选项卡函数，带回调
    * API 介绍
    * tag : 选项卡选择器， (必须)
    * curr ： 当前选中的选项卡样式， (最好填)
    * cont ：选项卡内容选择器，数量需和上面的tag个数一致，你懂的。 (必须)
    * more ： 更多按钮选择器，(可选)
    * ev ：触发事件，默认鼠标划过，(可选)
    * before: ev事件未被触发时执行的函数 （可选）
    * callbak ：回调函数，可以让你在每一次切换选项卡的时候做些你想做的事， (可选)
    */
    function _TAG(conf){
        var tag = conf && conf.tag || '.tag',
            curr = conf && conf.curr || 'curr',
            cont = conf && conf.cont || '.tagCont',
            more = conf && conf.more || '.more',
            ev = conf && conf.ev || 'mouseover',
            time = conf && conf.time || 500,
            before = conf && conf.before,
            callback = conf && conf.callback;
        var $tag = $(tag),$cont = $(cont),$more = conf.more ? $(more) : $(document);
        $tag.eq(0).addClass(curr);
        $cont.eq(0).stop().fadeIn(200);
        before && before();
        $tag.on(ev,function(){
            var that = $(this);
            var i = that.index(tag);
            that.addClass(curr).siblings(tag).removeClass(curr);
            $cont.fadeOut(time).eq(i).fadeIn(time);
            if (conf.more){
                $more.attr('href',that.attr('url'));
            };
            callback && callback(that,i);
        });
    }

    function logout(forward) {

        $.ajax({
            url: (window.passPortUrl?passPortUrl:'')+'/account/login/logout/',
            type: 'GET',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            }
        }).done(function(json){
            if (json.result == 1){
                if(json['data']['url'] && json['data']['url'].length > 0){
                    $.ajax({
                        url:json.data.url[0],
                        type:'get',
                        data:{},
                        dataType:'jsonp',
                        success:function(M){
                            window.location.href = json.data.forward;
                        }
                    });
                }else{
                    window.location.href = forward || '/';
                }
            }
        })
    }

    /*多选框全选功能*/
    function checkAll(name){
    	var boxes = document.getElementsByName(name);
    	for(var i=0;i<boxes.length;i++){
    		if (boxes[i].checked){
    			boxes[i].checked = false;
    		}else{
    			boxes[i].checked = true;
    		}
    	}
    }

    /*
    * cookie操作函数
    * name  @string cookie的名称
    * value @string  设置对应的值，该参数为空时， 则是取出该cookie
    * options @object 可设置cookie有效期，域名等参数
    */
    function cookie(name,value,options){
    	if(typeof value!='undefined'){
    		options=options||{};
    		if(value===null){
    			value='';
    			options.expires=-1;
    		}
    		var expires='';
    		if(options.expires&&(typeof options.expires=='number'||options.expires.toUTCString)){
    			var date;
    			if(typeof options.expires=='number') {
    				date=new Date();
    				date.setTime(date.getTime()+(options.expires*24*60*60*1000));
    			}else{
    				date=options.expires;
    			}
    			expires='; expires='+date.toUTCString();
    		}
    		var path=options.path ? '; path='+options.path:'; path=/';
    		var domain=options.domain ? '; domain=' + options.domain : '';
    		var secure=options.secure ? '; secure':'';
    		document.cookie=[name,'=',encodeURIComponent(value),expires,path,domain,secure].join('');
    	}else{
    		var cookieValue=null;
    		if(document.cookie&&document.cookie!=''){
    			var cookies=document.cookie.split(';');
    			for(var i= 0; i < cookies.length; i++){
    				var cookie = jQuery.trim(cookies[i]);
    				if(cookie.substring(0,name.length+1)==(name+'=')){
    					cookieValue=decodeURIComponent(cookie.substring(name.length+1));
    					break;
    				}
    			}
    		}
    		return cookieValue;
    	}
    }


    /*
    * 类似于 php 的in_array()
    * Demo   
    * var arr = [1,2,3,5];
    * alert(arr.in_array(4)); 
    */
    Array.prototype.in_array = function(e){ 
    	for(i=0;i<this.length && this[i]!=e;i++); 
    	return !(i==this.length); 
    }

    /*跳錨點*/
    function scrollAnchor( anchorName ){
        var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
        if( anchorName ){
            var $this = $('#'+anchorName);
            var $this_top = $this.offset().top;
            $body.animate({ scrollTop: $this_top}, 600);
        }else{
            $body.animate({ scrollTop: 0}, 600);
        }

    }

    // 输入框焦点处理，
    function focus_blur(el,default_val){//输入框焦点处理
          el.focus(function(event) {
            var now_val=$(this).val();
           
            if(now_val==default_val){
                $(this).val('');
             }
          });
         el.blur(function(event) {
           var now_val=$(this).val();
           if(now_val===''){
              $(this).val(default_val);
           }
         });
       };
    // // 倒计时函数，返回{
    // 		day: countDay, //剩余天数
    // 		hour: countHour, //剩余小时
    // 		minute: countMinute, 
    // 		second: countSecond
    // }
    // 可以使用setInterval不断获取剩余时间
     function countDown(endDate) {//endDate 结束日期
            var now = new Date();
            
            var deadline = new Date(endDate);
            //本地时间与格林威治标准时间 (GMT) 的分钟差 
            var timeDiff = now.getTimezoneOffset();
            //此处有些不解，如果把分钟差转化成毫秒应该是timeDiff*60*1000，但是这样返回的数据不正确！ 
            var leave = Math.abs(deadline.getTime() - now.getTime() + timeDiff * 60);
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var countDay = Math.floor(leave / day);
            //var countHour = Math.floor((leave - day*countDay)/hour); 两种计算思路 
            var countHour = Math.floor(leave / hour - countDay * 24);
            var countMinute = Math.floor(leave / minute) - countDay * 24 * 60 - countHour * 60;
            var countSecond = Math.floor(leave / 1000) - countDay * 24 * 60 * 60 - countHour * 60 * 60 - countMinute * 60;
            var outStr = "";
            var json = {
                day: countDay,
                hour: countHour,
                minute: countMinute,
                second: countSecond
            };
            return json;

        }
}));
