(function(factory) {
	if (typeof define === "function" && define.amd) {
		define(function() {
			return factory();
		});
	} else {
		window.placeholder = factory();
	}
}(function() {
	if (
		navigator.userAgent.indexOf('MSIE 6.0') != -1 
		|| navigator.userAgent.indexOf('MSIE 7.0') != -1 
		|| navigator.userAgent.indexOf('MSIE 8.0') != -1
		|| navigator.userAgent.indexOf('MSIE 9.0') != -1
	) {
		var inputInit = document.getElementsByTagName('input');
		var inputTP = [];
		for (var i = 0; i < inputInit.length; i++) {
			var type = inputInit[i].getAttribute('type');
			if (type == 'text' 
				|| type == "password"

				|| type == "tel"

				|| type == "search"

				|| type == "number"

				|| type == "email"

				) {
				inputTP.push(inputInit[i]);
			}
		}
		for (var i = 0; i < inputTP.length; i++) {
			var placeholder = inputTP[i].getAttribute('placeholder');
			var value = inputTP[i].value;
			if (placeholder != null&&value=='') {
				var inputWrap = document.createElement('label');

				inputWrap.style.display = "inline-block";
				inputWrap.style.position = "relative";
				inputTP[i].parentNode.insertBefore(inputWrap, inputTP[i]);

				var placeholder = inputTP[i].getAttribute('placeholder');

				if (window.getComputedStyle) {

					var computedStyle = getComputedStyle(inputTP[i], null)

				} else {

					var computedStyle = inputTP[i].currentStyle;

				}

				var paddingLeft = computedStyle.paddingLeft;
			

				var fontSize = computedStyle.fontSize;
				var color = computedStyle.color;
				var fontFamily = computedStyle.fontFamily;
				var borderLeft = isNaN(computedStyle.borderLeftWidth) ? 0 : computedStyle.borderLeftWidth;
				var marginTop = computedStyle.marginTop;
				var marginBottom = computedStyle.marginBottom;
				var marginLeft = computedStyle.marginLeft;
				var marginRight = computedStyle.marginRight;
				var float = computedStyle.float;
				var position = computedStyle.position;
				var display = computedStyle.display;
				var top = computedStyle.top;
				var left = computedStyle.left;
				var bottom = computedStyle.bottom;
				var right = computedStyle.right;
				var rInput = inputTP[i].parentNode.removeChild(inputTP[i]);

				rInput.style.marginTop = 0;
				rInput.style.marginBottom = 0;
				rInput.style.marginLeft = 0;
				rInput.style.marginRight = 0;
				rInput.style.position = 'static';
				

				inputWrap.style.marginTop = marginTop;
				inputWrap.style.marginBottom = marginBottom;
				inputWrap.style.marginLeft = marginLeft;
				inputWrap.style.marginRight = marginRight;
				inputWrap.style.position = 'relative';
				inputWrap.style.top = top;
				inputWrap.style.bottom = bottom;
				inputWrap.style.left = left;
				inputWrap.style.right = right;
				
				inputWrap.style.float = float;
				if(display=='block'){
					inputWrap.style.display = display;
				}
				
				inputWrap.appendChild(rInput);

				var span = document.createElement('span');

				span.innerHTML = placeholder;
				span.style.position = "absolute";
				span.style.top = "50%";
				span.style.left = parseInt(paddingLeft, 10) + parseInt(borderLeft, 10) + 'px';
				span.style.fontSize = fontSize;

				span.style.fontFamily = fontFamily;

				span.style.color = color;
				
				

				span.style.filter = "Alpha(opacity=70)";
				

				document.body.appendChild(span);

				span.style.marginTop = -parseInt(span.clientHeight) / 2 + 'px';
				if(rInput.value==''){
					span.style.display = 'inline-block';
				}else{
					span.style.display = 'none';
				}
				span.parentNode.removeChild(span);

				inputWrap.appendChild(span);
				

				(function(i, span) {
					inputTP[i].onfocus = function() {
						span.style.display = "none";

					}
					span.onclick = function() {

						inputTP[i].focus();
					}
					inputTP[i].onblur = function() {
						if (inputTP[i].value == '') {
							span.style.display = "inline-block";
						}
					}
				})(i, span);
			}


		};
	}

}));