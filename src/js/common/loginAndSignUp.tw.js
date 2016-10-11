//台湾通用注册登陆模块

define(['utils', 'jquery', 'lang'], function(utils, $, lang) {
	// 用户名输入限制
	function checkUname($box) {
		var val = $box.find('.uname').val();

		var length = utils.strLen(val);
		var $notice = $box.find('.unameNotice');


		// 不能小于6个汉字
		if (length < 6) {
			$notice.css({
				'visibility': 'visible',
				'color': 'red'
			});
			$notice.html(lang.tw.unameLength);
			return false;
		} else {
			$notice.css({
				'visibility': 'visible',
				'color': '#0f0'
			});
		
			$notice.html(lang.tw.unameRight);
			return true;
		}
	}
	// 密码输入限制
	function checkPassword($box,el) {
		var val = $(el).val();
		
		var length = utils.strLen(val);
	
		var passwordVal = $box.find(".password").val();
		var confirmPassWordVal = $box.find(".confirmPassword").val();

		if ($(el).hasClass('password')) {
			var $notice = $box.find(".passwordNotice");
		} else if ($(el).hasClass('confirmPassword')) {
			var $notice = $box.find(".confirmPasswordNotice");
		}

		// 6-16 个字符
		if (length < 6 || length > 16) {

			$notice.css({
				'visibility': 'visible',
				'color': 'red'
			});
			$notice.html(lang.tw.passwordLength);
			return false;
		} else {

			$notice.css({
				'visibility': 'visible',
				'color': '#0f0'
			});
			$notice.html(lang.tw.passwordRight);


			if (passwordVal != confirmPassWordVal && confirmPassWordVal != ''&&$box.attr('id')=='signUpBox') {
				var $notice = $box.find(".passwordNotice,.confirmPasswordNotice");
				$notice.css({
					'visibility': 'visible',
					'color': 'red'
				});
				$notice.html(lang.tw.passwordNotMatch);
				return false;
			} else if (passwordVal == confirmPassWordVal && passwordVal != ''&&$box.attr('id')=='signUpBox') {
				var $notice = $box.find(".passwordNotice,.confirmPasswordNotice");
				$notice.css({
					'color': '#0f0'
				});
				$notice.html(lang.tw.passwordRight);
				return true;
			}else{
				return true;
			}

		}
	}

	//协议限制
    function checkAgreeMent(){
        if($("#signUpBox .checkNo").hasClass('checked')){
            return true;
        }else{
            alert(lang.tw.agreementMsg);
            return false;
        }
    }
    // 协议
    $('.agreeText').bind('touchstart', function(event) {
    	window.open('//www.gm99.com/agreement.htm');
    });
    function device(){
				var userAgent = navigator.userAgent;  
           		var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
           		
           		for(var i=0;i<Agents.length;i++){
           			if(userAgent.indexOf(Agents[i])!=-1){
           				switch(Agents[i]){
           					case 'iPhone':return 'mobile_iPhone';break;
           					case 'SymbianOS':return 'mobile_SymbianOS';break;
           					case 'Windows Phone':return 'mobile_WindowsPhone';break;
           					case 'iPad':return 'pad_iPad';break;
           					case 'iPod':return 'pad_iPod';break;
           					case 'Android':
	           					if(userAgent.indexOf('Mobile')!=-1){
			           				return 'mobile_Android';
			           			}else{
			           				return 'pad_Android';
			           			};break;

           				}
           			}
           		}

           		
			}
			
    var scid = utils._GET('scid')==null?'':utils._GET('scid');
			var cid = utils._GET('cid')==null?'':utils._GET('cid');
			var subid = utils._GET('subid')==null?device():utils._GET('subid')+'_'+device();
	return {

		// 注册
		register: function(options, callback) {
			var defaults = {

					
				}
				// 判断参数，如果第一个参数是函数，则设为callback
			var opts = defaults;
			if (typeof arguments[0] == 'object') {
				var opts = $.extend(defaults, options);
			} else if (typeof arguments[0] == 'function') {

				var callback = arguments[0];
			}

			// 协议
			$(".checkNo").on('touchstart',function(event) {
				if($(this).hasClass('checked')){
					$(this).removeClass('checked');
				}else{
					$(this).addClass('checked');
				}
			});

			
			var jsonpOnlyOne = 0;
			
			$("body").delegate('#register', 'touchstart', function(event) {

				
				if (
					checkUname($("#signUpBox")) 
					&& checkPassword($("#signUpBox"),$("#signUpBox .password")) 
					&& checkPassword($("#signUpBox"),$("#signUpBox .confirmPassword"))
					&& checkAgreeMent()
				) {
					var login_account = $('#signUpBox .uname').val(),
						password = $('#signUpBox .confirmPassword').val();

					var data = {
						login_account: login_account,
						password: password,
						sub_channel:scid,
						channel:cid,
						sub_id: subid,
						game_id:42

					}
					if (jsonpOnlyOne == 0) {
						jsonpOnlyOne = 1;
						$.ajax({
							url: '//www.gm99.com/api/register',
							type: 'GET',
							dataType: 'jsonp',
							data: data
						})
						.done(function(json) {
							jsonpOnlyOne = 0;
							
							typeof callback == 'function'?callback(json):false;
							
						})
						.fail(function() {
							jsonpOnlyOne = 0;
						});
					}

				}

			});
		},


		// 注册
		login: function(options, callback) {
			var defaults = {

					
				}
				// 判断参数，如果第一个参数是函数，则设为callback
			var opts = defaults;
			if (typeof arguments[0] == 'object') {
				var opts = $.extend(defaults, options);
			} else if (typeof arguments[0] == 'function') {

				var callback = arguments[0];
			}

			var jsonpOnlyOne = 0;
			var scid = utils._GET('scid')==null?'':utils._GET('scid');
			var cid = utils._GET('cid')==null?'':utils._GET('cid');

			$("body").delegate('#login', 'touchstart', function(event) {

				
				if (
					checkUname($("#loginBox")) 
					&& checkPassword($("#loginBox"),$("#loginBox .password")) 
					
				) {
					var login_account = $('#loginBox .uname').val(),
						password = $('#loginBox .password').val();
						console.log(3333);
					var data = {
						forward:window.location.href,
						uname: login_account,
						password: password,
						scid:scid,
						cid:cid,
						sub_id: subid

					}
					if (jsonpOnlyOne == 0) {
						jsonpOnlyOne = 1;
						$.ajax({
							url: '//www.gm99.com/login/login/',
							type: 'POST',
							dataType: 'html',
							data: data
						})
						.done(function(json) {
							jsonpOnlyOne = 0;
							
							typeof callback == 'function'?callback(json):false;
							
						})
						.fail(function() {
							jsonpOnlyOne = 0;
						});
					}

				}

			});
		}


		
	}
});