!
function(a) {
	function b() {
		var b = g.getBoundingClientRect().width;
		b / c > 540 && (b = 540 * c),
		a.rem = b / 16,
		g.style.fontSize = a.rem + "px"
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

/**
 * 
 * Template
 * 
 * **/

;(function(){
	var OUT = ["htmlString='';", "htmlString+=", ";", "htmlString"],
		DICTIONARY = 'break,delete,function,return,typeof,length,'
					+'case,do,if,switch,var,'
					+'catch,else,in,this,void,'
					+'continue,false,instanceof,throw,while,'
					+'debugger,finally,new,true,with,'
					+'default,for,null,try,'
					+'abstract,double,goto,native,static,'
					+'boolean,enum,implements,package,super,'
					+'byte,export,import,private,synchronized,'
					+'char,extends,int,protected,throws,'
					+'class,final,interface,public,transient,'
					+'const,float,long,short,volatile,parseInt,console,log,echo',
		DARR = DICTIONARY.split(',');
	function TemplateEngine(){
		this.openTag = '<@';
		this.closeTag = '@>';
		this.frontStr = 'var ';
		this.repeatDictionary = {};
		this.stop = false;
		this.templateData = {};
		this.keys = {htmlString:true,$data:true};
		for(var i = 0,l = DARR.length;i < l;i++){
			this.keys[DARR[i]] = true;
		}
	}
	TemplateEngine.prototype = {
		exported : function(code){
			var tempCode = '',
				_this = this,
				code = code;

			function exportFront(array,callback) {
				for (var i = 0 , l = array.length; i < l; i++) {
					callback.call(this,array[i], i);
				}
			};
			function exportBehind(code) {
				var code = code.split(_this.closeTag);
				if (code.length === 1) {
					tempCode += _this.htmlStr(code[0]);
				} else {
					tempCode += _this.logicStr(code[0]);
					if (code[1]) {
						tempCode += _this.htmlStr(code[1]);
					}
				}
			};
			exportFront(code.split(this.openTag),exportBehind);
			//return this.frontStr+OUT[0] + tempCode + objName + '.template=' + OUT[3];
			return this.frontStr+OUT[0] + tempCode + 'this.template=' + OUT[3];
		},
		htmlStr : function(code){
			code = code.replace(/>[^<]*<|[^>]*<|>[^<]*/g,function(str){return str.replace(/\s/g,'')});
			if(code.replace(/\s/g,'') == '')return '';
			return OUT[1] + "'" + code.replace(/('|"|\\)/g, '\\$1') + "'" + OUT[2] + '\n';
		},
		logicStr : function(code){
			if (code.indexOf('=') === 0) {
				code = OUT[1]
				+ code.substring(1).replace(/[\s;]*$/, '')
				+ OUT[2];
			}else if(code.split('echo').length > 1){
					var strs = code.split('echo'), _l = strs.length, temCode = strs[0];
					for(var i = 1; i < _l; i++){
						temCode += this.setLogicHtml(strs[i],code);
					}
					code = temCode+strs[_l-1].replace(strs[_l-1].split(';')[0],'');
			}
			this.getKeys(code);
			return code + '\n';
		},
		setLogicHtml : function(s,code){
			var keys = s.split(';')[0];
			code.replace('echo'+keys, '');
			return code = OUT[1]
				+ keys
				+ OUT[2];
		},
		getKeys : function(code){
			var _this = this,
				keys = code.split(/[^\$\w\d]+/);
			for(var i=0,l=keys.length;i<l;i++){
				if(!(keys[i] == "" || /^\d/.test(keys[i]) || this.keys[keys[i]] || this.repeatDictionary[keys[i]] === true )){
					code.split(keys[i-1]+'.'+keys[i]).length == 1 && setKeyValue(keys[i]);
				}
			}
			function setKeyValue(name){
				if(_this.repeatDictionary[name] === true)return;
				var value = '$data["'+name+'"]';
					_this.repeatDictionary[name] = true;
					_this.frontStr += name + '=' + value + ',';
			}
		},
		str2Fn : function(data,str){
			var fn = new Function('$data',str),
				data = data || {};
			this.repeatDictionary = {};
			for(var k in this.templateData){
				data[k] = this.templateData[k];
			}
			this.templateData = {};
			fn.call(this,data);
		},
		assign : function(vars,value){
			if(value != null){
				this.repeatDictionary[vars] = value;
				this.templateData[vars] = value;
			}else{
				if(typeof vars !== 'object' || vars.length){this.stop = true;console.error('Wrong data:' + typeof vars + ':' + vars);return;}
				for(var keys in vars){
					this.repeatDictionary[keys] = vars[keys];
					this.templateData[keys] = vars[keys];
				}
			}
		},
		showLogic : function(){
			this.show = true;
		},
		render : function(tem,data){
			if(this.stop){return;}
			if(!tem || !data){console.error('data or template is lost!');return;}
			var data = data || [],
				logic = this.exported(tem);
			this.show && console.log(logic);
			this.str2Fn(data,logic);
			this.frontStr = 'var ';
			return this.template;
		},
		display : function(tem){
			if(this.stop){return;}
			if(!tem){console.error('template is lost!');return;}
			var logic = this.exported(tem);
			this.show && console.log(logic);
			this.str2Fn(null,logic);
			this.frontStr = 'var ';
			return this.template;
		},
		setTag : function(open,close){
			this.openTag = open;
			this.closeTag = close;
		}
	}
	window['TE'] = function(){
		return new TemplateEngine();
	}
})();



/**
 * 
 * Request
 *   ajax,jsonp
 * 
 * **/
;(function(){
function minMaxRandom(under,over){
	switch(arguments.length){
		case 1: return parseInt(Math.random()*under);
		case 2: return (parseInt(Math.random()*(over-under+1))+parseInt(under));
		default:return 0;
	};
}

function Request() {
};
Request.prototype = {
	ajax : function(args) {
		this.options = {
			type : 'GET',
			dataType : 'text',
			async : true,
			avatar : null,
			contentType : 'application/x-www-form-urlencoded',
			url : 'about:blank',
			data : {},
			success : {},
			error : {}
		};
		if (!args) {
			console.error('please fill in any parameters first!');
			return;
		} else if (!args.url) {
			console.error('url is required parameters, please check your parameters!');
			return;
		} else if (!args.success || typeof args.success != 'function') {
			console.error('the callback function is lost!');
			return;
		}
		this.shift(this.options, args);
		this.send();
	},
	jsonp : function(args) {
		this.options = {
			type : 'JSONP',
			jsonpName : '',
			dataType : 'text',
			async : true,
			avatar : null,
			url : 'about:blank',
			success : function(){},
			data : {}
		};
		if (!args) {
			console.error('please fill in any parameters first!');
			return;
		} else if (!args.url) {
			console.error('url is required parameters, please check your parameters!');
			return;
		} else if (!args.jsonpName) {
			args.jsonpName = 'jsonpCallbackFunctionNo' + new Date().getTime() + minMaxRandom(0, 9999);
		}

		this.shift(this.options, args);
		if (window[this.options.jsonpName] && window[this.options.jsonpName] !== this.options.success) {
			console.error('jsonpName already exists!');
			return;
		}
		window[this.options.jsonpName] = this.options.success;
		this.create();
	},
	create : function() {
		var script = document.createElement('script'), argStr = /[\?]/g.test(this.options.url) ? '&' : '?';
		for (var key in this.options.data) {
			argStr += key + '=' + this.options.data[key] + '&';
		}
		argStr = argStr + 'callback=' + this.options.jsonpName;
		script.async = this.options.async;
		script.src = this.options.url + (argStr == '?' ? '' : argStr);
		document.getElementsByTagName('head')[0].appendChild(script);
	},
	XmlHttp : function() {
		var xmlHttp;
		try {
			xmlhttp = new XMLHttpRequest();
		} catch(e) {
			try {
				xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
		}
		if (!xmlhttp) {
			return false;
		}
		return xmlhttp;
	},
	send : function() {
		var xmlHttp = this.XmlHttp(), linkSign = /[\?]/g.test(this.options.url) ? '&' : '?', argStr = '', _this = this, length = this.options.data ? this.options.data.length : 0;
		for (var key in this.options.data) {
			argStr += key + '=' + this.options.data[key] + '&';
		}
		argStr = argStr.replace(/\&$/g, '');
		if (this.options.type.toUpperCase() == 'GET') {
			xmlHttp.open(this.options.type, this.options.url + (argStr == '' ? '' : linkSign + argStr), this.options.async);
		} else {
			xmlHttp.open(this.options.type, this.options.url, this.options.async);
		}
		xmlHttp.setRequestHeader('Content-Type', this.options.contentType);
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4) {
				if (xmlHttp.status == 200 || xmlHttp.status == 0) {
					if ( typeof _this.options.success == 'function') {
						var responseData = _this.options.dataType == 'text' ? xmlHttp.responseText : xmlHttp.responseXML;
						_this.options.success(responseData, _this.options.dataType,_this.options.avatar);
					}
					xmlHttp = null;
				} else {
					if ( typeof _this.options.error == 'function')
						_this.options.error('Server Status: ' + xmlHttp.status);
				}
			}
		};
		xmlHttp.send(this.options.type.toUpperCase() == 'POST' ? argStr : null);
	},
	shift : function(o, args) {
		for (var i in args) {
			o[i] = args[i];
		};
		return o;
	}
}; 

	
 window['Request'] = function(){
 	return new Request();
 };

})();

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



// 播放器控制
;(function(window,document){
	var box,main,h;
	function init(){
		box = document.querySelector('.music_box');
		main = document.querySelector('.main');
		h = document.documentElement.clientHeight;
		main.style.cssText += ';height:'+ ((h-box.offsetHeight)||h) +'px;'
		return {
			hide : hide,
			show : show
		}
	}
	function hide(){
		box.classList.add('hide');
		box.style.cssText = '';
		main.style.cssText += ';height:100%;'
	}
	function show(t){
		box.style.cssText = '';
		box.classList.remove('on');
		box.classList.remove('hide');
		main.style.cssText += ';height:'+ ((h-box.offsetHeight)||h) +'px;'

		if(t){ // t 显示满屏音乐
			h = document.documentElement.clientHeight;
			box.style.height = h + 'px';
			box.classList.add('on')
		}
	}
	Domready(function(){
		window['MContral'] = init();
	})
	window['MContral'] = function(){};

})(window,document);

/*
 * Cookie
 */
var Cookie={
	read:function(name){
		var value = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
		return (value) ? decodeURIComponent(value[1]) : null;
	},
	write:function(value){
		var str = value.name + '=' + encodeURIComponent(value.value);
			if(value.domain){ str += '; domain=' + value.domain;}
			str += '; path=' + (value.path || '/');
			if(value.day){
				var time = new Date();
				time.setTime(time.getTime()+value.day*24*60*60*1000);
				str += '; expires=' + time.toGMTString();
			}
		document.cookie = str;
		return;
	},
	dispose:function(name,options){
		var opt = options || {};
		opt.name = name;
		opt.day = -1;
		opt.value = 'a';
		this.write(opt);
		return;
	}
}


function UserInfo(){
	var info,
		coo = Cookie.read('BOYA_USER');
	if(coo){
		coo = coo.split(',');
		info = {};
		for(var i=0,l=coo.length;i<l;i++){
			var k = coo[i].split(':');
			info[k[0]] = k[1]
		}
		return info;
	}
	return null;
}

/*
music = {
	item_id: '音频ID',
	title: '音频名称',
	icon: '音频的封面图片',
	album_id: '音频所属的专辑ID',
	subject_list: '音频所属的主题ID列表',
	anchor: '音频主播，后台暂时没有录入的地方，暂为空',
	from: '来自，后台暂时没有录入的地方，暂为空',
	media: '音频链接地址',
	comments : [{
		user : '评论人名称',
		icon : '评论人头像',
		comment : '评论内容',
		time : '评论时间'
	}]
}
*/
function Music(){
	var temp = document.querySelector('#musicTemp').innerHTML,
	box = document.querySelector('.music_box'),
	te= TE(),
	yn = 0,item_id=21,
	a=0,s=0,
	P;
	// 获取音乐
	function getMusic(id,_yn,_a,_s){ // gid 音乐id， time从什么时间点开始播放， type 音乐来源，专辑or主题
		var url = 'http://m.boyakids.cn/', // 获取音乐数据接口
			//url = 'js/data.js', // 获取音乐数据接口
			req = Request();
		item_id = id || item_id;
		yn = _yn || yn;
		a = _a || a;
		s = _s || s;
		req.jsonp({
			url : url,
			data : {
				_c : 'api',
				_a : 'item',
				i : item_id,
				a : a,
				yn : yn,
				s : s
			},
			success : function(data){
				if(data.ok){
					render(data.msg);
				}
				alert('音频加载失败了，稍后在试试吧')
			}
		})

	}

	// 下一首
	function getNextMusic(){ // 当前音乐gid，type音乐来源
		getMusic(null,1,null,null);
	}
	// 上一首
	function getPreMusic(){
		var id = localStorage.getItem('historyList'),
			id = id.split(',');
		if(id.length <= 1){
			console.log('没有上一首了');
			return;
		}
		id.length-=1;
		id = id[id.length-1];

		getMusic(id,null,null,null);
	}

	// 渲染
	function render(data){
		if(!data.item_id){
			if(P){
				P.pause();
			}
			MContral.hide();
			console.log('没有更新音频了')
			return;
		}
		var history = localStorage.getItem('historyList') || '';
		history = history.replace(data.item_id,'').replace(/\,{2,}/,',');
		history += ','+data.item_id;
		history = history.replace(/^\,/,'');
		localStorage.setItem('historyList',history);
		// item_id , 音乐id ， time = 从什么时间开始播
		box.innerHTML = te.render(temp,data);

		// 初始化所有事件
		init();

	}
	function getId(){
		return item_id;
	}

	// 初始化所有事件
	function init(){
		// 音乐播放
		P = Player();
		P.play();
		P.end(getNextMusic);

		// 进度与各种按钮
		Progress(P);
		// 播放，暂停按钮
		Contrals(P);
		// 定时与评论
		AutoClose(P); // 定时
		Comments(); // 评论
	}

	return {
		getMusic : getMusic,
		getNextMusic : getNextMusic,
		getPreMusic : getPreMusic,
		render : render,
		getId : getId
	}

}

function Contrals(player){

	var objs = {
		play : document.querySelector('.btns .play'),
		next : document.querySelector('.btns .next'),
		pre : document.querySelector('.btns .back'),
		mini_play : document.querySelector('.info .play'),
		mini_next : document.querySelector('.info .next'),
		icon : document.querySelector('.big .icon'),
		like : document.querySelector('.like')
	},
	timer,t=8000,current=0,req = Request(),
	state=false;

	function play(){
		objs.play.classList.add('stop');
		objs.mini_play.classList.add('stop');
		player.play();
		objs.icon.classList.add('on');

		state = true;
	}
	function pause(){
		objs.play.classList.remove('stop');
		objs.mini_play.classList.remove('stop');
		objs.icon.classList.remove('on')
		player.pause();
		state = false;
	}
	function contral(e){
		
		e.stopPropagation&&e.stopPropagation();
		e.preventDefault&&e.preventDefault();
		
		var load = player.isLoaded();
		if(!load){
			alert('音乐加载中,请稍后!');
			return;
		}
		if(state){
			pause();
			return;
		}
		play();
	}

	player.ready(function(){
		state = true;
		play();
	});


	function next(){
		__M.getNextMusic();
	}
	function back(){
		__M.getPreMusic();
	}

	objs.play.addEventListener('click',contral,false);
	objs.mini_play.addEventListener('click',contral,false);
	objs.next.addEventListener('click',next,false);
	objs.mini_next.addEventListener('click',next,false);
	objs.pre.addEventListener('click',back,false);


	// 喜欢事件
	function fav(){
		// 是否登录
		var isLogin = UserInfo();
		if(!isLogin){
			console.log('还未登陆');
			document.querySelector('iframe').src = URL.login;
			return;
		}
		// 是否已喜欢
		var state = objs.like.classList.contains('on') ? 1 : 0;
		// 发送数据
		// wait to do ****************************************************************************
		var data = '';
		data += '?uid='+isLogin.uid;
		data += '&';
		req.jsonp({
			url : URL.fav + data,
			success : function(){}
		})
		objs.like.classList.toggle('on');
		var span = objs.like.querySelector('span');
		span.innerHTML = (parseInt(span.innerHTML) + (state?-1:1) ) + '人喜欢';
	}
	objs.like.addEventListener('click',fav,false);


}

// 进度管理
function Progress(player){
	var objs = {
		mini : document.querySelector('.mini .progress'),
		line : document.querySelector('.prog div'),
		point : document.querySelector('.prog span'),
		currentTime : document.querySelector('.progress .start'),
		endTime : document.querySelector('.progress .end')
	};

	function run(c,end){
		objs.mini.style.width = (c/end)*100 + '%';
		objs.line.style.width = (c/end)*100 + '%';
		objs.point.style.left = (c/end)*94 + '%';
		objs.currentTime.innerHTML = Math.floor(c/60) + ':' + parseInt(c%60);
	}

	player.ready(function(end){
		objs.endTime.innerHTML = Math.floor(end/60) + ':' + parseInt(end%60);
	})
	player.progress(run);
}

// player
// 进度条，播放，暂停，总时间，当前时间，定时关闭, 跳转到指定时间播放/
function Player(){
	var video = document.querySelector('#music_audio'),
		objs = {

		},
		state = false, // 播放状态
		currentTime = 0, // 当前时间
		duration = -1, // 音乐时长
		cb = {
			end : false,  // 播放结束 callback
			play : false, // 播放
			pause : false, // 暂停
			progress : false, // 播放进度 callback
			ready : false    // ready callback
		},
		loaded = false; // 是否加载完成
	
	function init(){
		video.addEventListener('canplay',canplay,false);
		video.addEventListener('timeupdate',timeupdate,false);
		video.addEventListener('ended',ended,false)
	}
	function canplay(){
		loaded = true;
		state = true;
		duration = video.duration;
		cb.ready && cb.ready(duration);
	}
	function setReady(_cb){
		cb.ready = _cb;
	}
	function timeupdate(){
		currentTime = video.currentTime;
		// wait to 改变 进度条状态
		cb.progress && cb.progress(currentTime,duration);
	}
	function ended(){
		state = false;
		cb.end && cb.end();
	}

	function play(){
		if(!loaded) return;
		video.play();
		state = true;
		cb.play && cb.play();
	}


	function pause(){
		if(!loaded) return;
		video.pause();
		state = false;
		// wait to  改变 按钮状态
		cb.pause && cb.pause();
	}


	function progress(_cb){
		cb.progress = _cb;

	}
	function setEnd(_cb){
		cb.end = _cb;
	}
	function getDuration(){
		return duration;
	}

	function setProgress(n){
		// n 秒数
		if( (!n&&n!=0) || !loaded) return;
		video.currentTime = Math.min(n*1,duration);
	}
	function getState(){
		return state;
	}
	function isLoaded(){
		return loaded;
	}

	// 销毁
	function distory(){
		video.removeEventListener('canplay',canplay,false);
		video.removeEventListener('timeupdate',timeupdate,false);
		video.removeEventListener('ended',ended,false);
		video = null;
	}
	init();

	return {
		play : play,  // 播放
		pause : pause, // 暂停
		progress : progress, // 进度
		setProgress : setProgress,  // 设置进度
		end : setEnd, // 结束
		duration : getDuration, // 获取总长度
		distory : distory, // 销毁
		ready : setReady,
		getState : getState, // 获取状态
		isLoaded : isLoaded // 是否加载完成
	}
}

// 定时关闭
function AutoClose(video){
	var btn = document.querySelector('.clock'),
		layer = document.querySelector('.setTime'),
		lis = layer.querySelectorAll('li'),
		startTime, // 设置自动结束选项时，结束的起始时间
		endTime, // 结束时间
		option; // 选项 0=不设置， 1=当前音乐结束后 ， 2=10分钟，3=20分钟，4=30分钟



	// localStorage.autoCloseSet = option
	// localStorage.startTime 结束起始时间
	function init(){
		clearState();
		
		btn.classList.add('on');
		var startTime = localStorage.getItem('startTime') || new Date().getTime();
		localStorage.setItem('startTime',startTime);
		endTime = 0;
		if(option == 0){
			endTime = 0;
			btn.classList.remove('on');
			localStorage.removeItem('startTime');
		}
		if(option == 1){
			endTime = video.duration()*1000;
			console.log(endTime)
		}
		if(option == 2){
			endTime = 10*60*1000
		}
		if(option == 3){
			endTime = 20*60*1000
		}
		if(option == 4){
			endTime = 30*60*1000
		}
		option&&setTime(endTime);
		
	}
	function clearState(){
		option = localStorage.getItem('autoCloseSet') || 0;
		for(var i=0,l=lis.length;i<l;i++){
			lis[i].classList.remove('on');
			if(option == i){
				lis[i].classList.add('on');
			}
		}
	}
	function clear(){
		clearTimeout(AutoClose.timer);
		AutoClose.timer = null;
	}
	function setTime(t){
		clear();
		if(t) AutoClose.timer = setTimeout(close,t);
	}

	function handle(){
		var t;
		if(layer) layer.addEventListener('click',function(e){
			var tar= e.target;
			if(tar.nodeName == 'LI'){
				localStorage.setItem('autoCloseSet',tar.getAttribute('data-time'));
				console.log(tar.getAttribute('data-time'))
				init();
			}
			if(t)return;
			t = setTimeout(function(){
				t = null;
				layer.classList.remove('on');
			},1000)
		},false);
		if(btn) btn.addEventListener('click',function(){
			layer.classList.add('on');
		},false)
	}
	init();
	handle();

	function distory(){
		clear();
	}
	AutoClose.distory = distory;

	function close(){
		video&&video.pause();
		clear();
		btn.classList.remove('on');
		// 时间设置为一次性功能，使用后，自动切换会 不设置选项
		localStorage.setItem('autoCloseSet',0);
		localStorage.removeItem('startTime');
		clearState();
	}
}

// 评论控制
function Comments(){
	var layer = document.querySelector('.comments'),
		btn = document.querySelector('.comment'),
		back = layer.querySelector('.back span'),
		input = layer.querySelector('input[type=text]'),
		addBox = layer.querySelector('.add'),
		submit = layer.querySelector('.add div'),
		req = Request();

	function handler(){
		btn.addEventListener('click',show,false);
		back.addEventListener('click',hide,false);
		layer.addEventListener('click',reply,false);
		submit.addEventListener('click',add,false);
		addBox.addEventListener('click',function(e){
			e.stopPropagation();
			e.preventDefault();
		},false);
	}
	function show(){
		layer.classList.add('on')
	}
	function hide(e){
		e.stopPropagation();
		e.preventDefault();
		layer.classList.remove('on');
		//alert(layer.classList)
	}
	function reply(e){
		var tar = find(e.target);
		if(!tar) return;
		var name = tar.getAttribute('data-name');
		input.value = '回复 '+name+': ';
		input.setAttribute('reply_id',tar.getAttribute('data-id'));
		input.setAttribute('reply_name',name);
	}
	function find(t){
		if(!t) return null;
		if(t.nodeName == 'DIV'&&t.className=='item'){
			return t;
		}
		return find(t.parentNode)
	}
	function add(e){
		var v = input.value;
		if(!v || /^回复[^\:]*\: $/.test(v)){
			return;
		}
		// 是否登录
		var isLogin = UserInfo();
		if(!isLogin){
			alert('还未登陆')
			return;
		}
		// wait to 提交数据
		var isreply = v.indexOf(input.getAttribute('data-name')) > -1 ? 1 : 0;
		var data = '?user_id='+isLogin.uid + '&item_id='+ __M.getId() + '&content='+encodeURIComponent(v)+'&reply_id='+isreply;
		req.jsonp({
			url : URL.addComment + data,
			success : function(){}
		})
		append(isLogin,v)
	}
			
	function append(info,con){
		var div = document.createElement('div');
		div.className = 'item';
		div.setAttribute('data-name',isLogin.nickname);
		div.setAttribute('data-id',isLogin.uid);
		var t = new Date(),
			h = t.getHours(),
			m = t.getMinutes();
		div.innerHTML = '<div class="c_icon"><img src="'+isLogin.headimgurl+'"/></div><div class="info"><span>今天 '+h+':'+m+'</span><h1>'+isLogin.nickname+'</h1><p>'+v+'</p></div>';
		document.querySelector('.comments .list').appendChild(div);
	}

	function distory(){
		btn.removeEventListener('click',show,false);
		back.removeEventListener('click',hide,false);
		layer.removeEventListener('click',reply,false);
		submit.removeEventListener('click',add,false);
		btn=back=layer=submit=null;
	}
	Comments.distory = distory;

	handler();

}
