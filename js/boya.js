!
function(a) {
	function b() {
		var b = g.getBoundingClientRect().width;
		b / c > 540 && (b = 540 * c),
		a.rem = b / 16,
		g.style.fontSize = a.rem + "px";
		if(document.body){
			var h = document.body.clientHeight ;
			console.log(h)
			top.setFrame2(h);
		}
	}
	var c, d, e, f = a.document,
	g = f.documentElement,
	h = f.querySelector('meta[name="viewport"]'),
	i = f.querySelector('meta[name="flexible"]');
	if (h) {
		console.warn("将根据已有的meta标签来设置缩放比例");
		var j = h.getAttribute("content").match(/initial\-scale=(["']?)([\d\.]+)\1?/);
		j && (d = parseFloat(j[2]), c = parseInt(1 / d))
	} else if (i) {
		var j = i.getAttribute("content").match(/initial\-dpr=(["']?)([\d\.]+)\1?/);
		j && (c = parseFloat(j[2]), d = parseFloat((1 / c).toFixed(2)))
	}
	if (!c && !d) {
		var k = (a.navigator.appVersion.match(/android/gi), a.navigator.appVersion.match(/iphone/gi)),
		c = a.devicePixelRatio;
		c = k ? c >= 3 ? 3 : c >= 2 ? 2 : 1 : 1,
		d = 1 / c
	}
	if (g.setAttribute("data-dpr", c), !h) if (h = f.createElement("meta"), h.setAttribute("name", "viewport"), h.setAttribute("content", "initial-scale=" + d + ", maximum-scale=" + d + ", minimum-scale=" + d + ", user-scalable=no"), g.firstElementChild) g.firstElementChild.appendChild(h);
	else {
		var l = f.createElement("div");
		l.appendChild(h),
		f.write(l.innerHTML)
	}
	a.dpr = c,
	a.addEventListener("resize",
	function() {
		clearTimeout(e),
		e = setTimeout(b, 100)
	},
	!1),
	a.addEventListener("pageshow",
	function(a) {
		a.persisted && (clearTimeout(e), e = setTimeout(b, 100))
	},
	!1),
	"complete" === f.readyState ? f.body.style.fontSize = 12 * c + "px": f.addEventListener("DOMContentLoaded",
	function() {
		f.body.style.fontSize = 12 * c + "px"
	},
	!1),
	b()
} (window);

function Domready(fn) {
	var done = false, top = true, win = window,
	doc = win.document, root = doc.documentElement,
	add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
	rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
	pre = doc.addEventListener ? '' : 'on',
	init = function(e) {
		if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
		(e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
		if (!done && (done = true)) fn.call(win, e.type || e);
	},
	poll = function() {
		try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
		init('poll');
	};
	if (doc.readyState == 'complete') fn.call(win, 'lazy');
	else {
		if (doc.createEventObject && root.doScroll) {
			try { top = !win.frameElement; } catch(e) { }
			if (top) poll();
		}
		doc[add](pre + 'DOMContentLoaded', init, false);
		doc[add](pre + 'readystatechange', init, false);
		win[add](pre + 'load', init, false);
	}
}



Domready(function(){
	setTimeout(function(){
		var h = document.body.clientHeight;
		top.setFrame2(h);
	},200)
	window.addEventListener('resize',function(){
		var h = document.body.clientHeight;
		top.setFrame2(h);
	},false)
})