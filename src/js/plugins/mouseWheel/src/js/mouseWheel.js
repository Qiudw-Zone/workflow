
if (window.addEventListener) {
	// IE9, Chrome, Safari, Opera
	window.addEventListener("mousewheel", MouseWheelHandler, false);
	// Firefox
	window.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
}else window.attachEvent("onmousewheel", MouseWheelHandler);

function MouseWheelHandler(e){
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	document.write(delta);
}