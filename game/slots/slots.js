/**
 * 游戏开始 slots
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-03-08
 */

//++++++++++++++++++++++++++++++++++++
// google font load
//++++++++++++++++++++++++++++++++++++
WebFont.load({
	google: {
		families: ['Revalia']
	},
	loading: function() {
		console.log("loading");
	},
	active: function() {
		loadFunc();
	},
	inactive: function() {
		console.log("inactive")
	}
});

//++++++++++++++++++++++++++++++++++++
// load img
//++++++++++++++++++++++++++++++++++++
function loadFunc() {
	manifest = [{
		src: "res/yellow1.png",
		id: "yellow0"
	}, {
		src: "res/yellow2.png",
		id: "yellow1"
	}, {
		src: "res/yellow3.png",
		id: "yellow2"
	}, {
		src: "res/yellow4.png",
		id: "yellow3"
	}, {
		src: "res/yellow5.png",
		id: "yellow4"
	}, {
		src: "res/yellow6.png",
		id: "yellow5"
	}];

	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", init);
	loader.loadManifest(manifest);
}


//++++++++++++++++++++++++++++++++++++
// 工具函数
//++++++++++++++++++++++++++++++++++++
function colorToRGB(_color, a) {
	var color = _color.replace('#', '');
	var r = parseInt(color.slice(0, 2), 16),
		g = parseInt(color.slice(2, 4), 16),
		b = parseInt(color.slice(4, 6), 16),
		a = (a === undefined) ? 1 : a;

	return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

//随机数
function random(min, max) {
	return Math.floor(Math.random()*(max+1-min))+min;
}

//绑定上下文
function bind(fn, context) {
	return function() {
		fn.apply(context, arguments);
	}
}

//++++++++++++++++++++++++++++++++++++
// 圆形按钮
//++++++++++++++++++++++++++++++++++++
function CircleButton(conf) {
	this.initialize(conf);
}

CircleButton.prototype = new createjs.Container();
CircleButton.prototype.Container_initialize = CircleButton.prototype.initialize;
CircleButton.prototype.initialize = function(conf) {

	this.Container_initialize();

	if (!conf) {
		conf = {};
	}

	//按钮属性
	this.x = conf.x || 0;
	this.y = conf.y || 0;
	this.label = conf.label || '';
	this.radius = conf.radius || 40;
	this.color = conf.color || 'rgba(100,0,0,1)';
	this.font = conf.font || '14px Arial';
	this.bgColor = conf.bgColor || 'rgba(0,0,0,1)';
	this.strokeColor = conf.strokeColor || '#000000';
	this.handleClick = conf.handleClick || function() {};

	this.disable = false;

	//按钮文字
	var text = new createjs.Text();
	text.font = this.font;
	text.color = this.color;
	text.text = this.label;
	text.textBaseline = 'top';
	text.textAlign = 'center';

	var width = text.getMeasuredWidth();
	var height = text.getMeasuredHeight();
	text.x = 0;
	text.y = -height / 2;

	//背景图形
	this.background = new createjs.Shape();
	this.background.graphics.beginFill(this.bgColor).
	setStrokeStyle(2, 'round').
	beginStroke(this.strokeColor).
	drawCircle(0, 0, this.radius);
	this.background.alpha = 1;

	//阴影设定
	this.oshadow = new createjs.Shadow('rgba(0,0,0,0.8)', 2, 2, 10);
	this.nshadow = new createjs.Shadow('rgba(0,0,0,0.2)', 2, 2, 10);
	this.background.shadow = this.oshadow;

	this.addChild(this.background, text);

	//交互处理
	this.mouseChildren = false;

	this.on('click', bind(this.handleClick, this));

	this.on('mousedown', bind(function() {
		this.background.shadow = this.nshadow;
	}, this));
	this.on('mouseup', bind(function() {
		this.background.shadow = this.oshadow;
	}, this));

	this.on('mouseover', bind(function() {
		this.background.alpha = 1;
	}, this));
	this.on('mouseout', bind(function() {
		this.background.alpha = 0.9;
	}, this));
}
CircleButton.prototype.resetSD = function() {
	this.background.shadow = this.oshadow;
}

//++++++++++++++++++++++++++++++++++++
// 创建老虎机的窗口
//++++++++++++++++++++++++++++++++++++
function createBox(x, y, dir) {
	var box = new createjs.Shape();
	var width = 60,
		height = 90,
		curveDis = 8;

	box.graphics.
	beginLinearGradientFill(["rgba(34,34,34,1)", "rgba(243,243,193,1)", "rgba(243,243,193,1)", "rgba(34,34,34,1)"], [0, 0.1, 0.9, 1], 0, 0, 0, height).
	moveTo(0, 0).
	lineTo(width, 0).
	quadraticCurveTo(width + curveDis, height / 2, width, height).
	lineTo(0, height).
	quadraticCurveTo(-curveDis, height / 2, 0, 0).
	closePath();

	box.shadow = new createjs.Shadow("rgba(34,34,34,1)", 0, 0, 10);

	box.x = x || 0;
	box.y = y || 0;
	return box;
}

//++++++++++++++++++++++++++++++++++++
// 创建老虎机的元素
//++++++++++++++++++++++++++++++++++++
function createPic(img, x, y, index) {
	var pic = new createjs.Bitmap(img);
	pic.x = x || 45;
	pic.y = y || 120;
	pic.vy = 20;
	pic.scaleX = 0.7;
	pic.scaleY = 0.7;
	pic.index = index;
	return pic;
}

//++++++++++++++++++++++++++++++++++++
// 创建老虎机的元素列表
//++++++++++++++++++++++++++++++++++++
function PicList(imgs, x) {
	this.imgs = imgs || [];
	this.pics = [];
	this.x = x || 0;
	this.y = 0;
	this.vy = 20;
	this.height = 71;
	//第一张图的初始起点，其它图一次向上堆积
	this.beginPoint = 120;
	this.bound = {
		top: 50,
		bottom: 190,
		center: 125,
		height: 140
	};
	this.len = this.imgs.length;
	this.needStop = false;
	this.needPause = false;
	this.needRool = false;
	this.pauseTime = 0;
	this.leftTime = 0;
	this.stopIndex = 0;
	this.callback;
	this.rs = {};
	this.init();
}
PicList.prototype.init = function() {
	this.y = this.beginPoint - this.len * this.height;
	this.imgs.forEach(bind(function(img, index) {
		this.pics.push(createPic(img, this.x, this.beginPoint - index * this.height, index));
	}, this));
}
PicList.prototype.render = function(stage) {
	this.pics.forEach(bind(function(pic) {
		stage.addChild(pic);
	}, this));
}
PicList.prototype.easing = function(callback) {
	if (this.leftTime < 1000) {
		if (!this.rs.a) {
			this.rs.a = 1;
			this.setVY(16);
		}
	} else if (this.leftTime < 1500) {
		if (!this.rs.b) {
			this.rs.b = 1;
			this.setVY(12);
		}
	} else if (this.leftTime < 2000) {
		if (!this.rs.c) {
			this.rs.c = 1;
			this.setVY(8);
		}
	} else if (this.leftTime < 2500) {
		if (!this.rs.d) {
			this.rs.d = 1;
			this.setVY(4);
		}
	} else if (this.leftTime > 3000) {
		if (!this.rs.e) {
			this.rs.e = 1;
			this.setVY(1);
			callback();
		}
	}
}
PicList.prototype.roll = function() {

	if (!this.needRool) {
		return;
	}

	if (this.needPause) {
		this.leftTime = new Date().getTime() - this.pauseTime;
		this.easing(bind(function() {
			this.needPause = false;
			this.needStop = true;
		}, this));
	}

	this.pics.forEach(bind(function(pic) {

		pic.y += this.vy;

		if (this.needStop && pic.index == this.stopIndex) {
			if (pic.y == this.beginPoint) {
				this.stop();
			}
		}

		if (pic.y >= this.bound.bottom) {
			pic.y = this.beginPoint - (this.len - 1) * this.height + (pic.y - this.bound.bottom);
		}
		//需要手动修改比例
		if (pic.y > this.bound.top) {
			var dis = Math.abs(pic.y - this.bound.center);
			pic.alpha = (1 - dis / this.bound.height / 2);
			pic.scaleY = (1 - dis / this.bound.height / 2) * 0.4 + 0.3;
		}

	}, this));
}
PicList.prototype.setVY = function(vy) {
	this.vy = vy;
}
PicList.prototype.active = function(vy) {
	this.needStop = false;
	this.needPause = false;
	this.needRool = true;
	this.setVY((vy || 20));
	this.rs = {};
}
PicList.prototype.pause = function(stopIndex, callback) {
	if (this.needPause) {
		return;
	}
	this.stopIndex = stopIndex || 0;
	this.needPause = true;
	this.pauseTime = new Date().getTime();
	this.callback = callback || function() {};
}
PicList.prototype.stop = function() {
	this.needStop = false;
	this.setVY(0);
	this.needRool = false;
	this.callback();
}

//++++++++++++++++++++++++++++++++++++
// 程序入口
//++++++++++++++++++++++++++++++++++++
function init() {

	document.getElementById('loading').style.display = 'none';

	var viewPortWidth = 300,
		viewPortHeight = 300;

	//创建舞台
	var stage = new createjs.Stage('canvas');
	stage.enableMouseOver(20);
	createjs.Touch.enable(stage);

	//绿背景
	var bg = new createjs.Shape();
	bg.graphics.beginFill('rgba(54,78,16,1)').drawRect(0, 0, viewPortWidth, viewPortHeight);
	stage.addChild(bg);

	//转盘容器
	var box1 = createBox(40, 100);
	stage.addChild(box1);

	var box2 = createBox(120, 100);
	stage.addChild(box2);

	var box3 = createBox(200, 100);
	stage.addChild(box3);

	//图片列表
	var picList1 = new PicList([
		loader.getResult('yellow0'),
		loader.getResult('yellow1'),
		loader.getResult('yellow2'),
		loader.getResult('yellow3'),
		loader.getResult('yellow4'),
		loader.getResult('yellow5')
	], 45);
	picList1.render(stage);

	var picList2 = new PicList([
		loader.getResult('yellow0'),
		loader.getResult('yellow3'),
		loader.getResult('yellow5'),
		loader.getResult('yellow4'),
		loader.getResult('yellow1'),
		loader.getResult('yellow2')
	], 125);
	picList2.render(stage);

	var picList3 = new PicList([
		loader.getResult('yellow0'),
		loader.getResult('yellow5'),
		loader.getResult('yellow2'),
		loader.getResult('yellow3'),
		loader.getResult('yellow4'),
		loader.getResult('yellow1')
	], 205);
	picList3.render(stage);

	//遮盖
	var cover1 = new createjs.Shape();
	cover1.graphics.beginFill('rgba(54,78,16,1)').drawRect(0, 189, viewPortWidth, 111);
	stage.addChild(cover1);

	var cover2 = new createjs.Shape();
	cover2.graphics.beginFill('rgba(54,78,16,1)').drawRect(0, 0, viewPortWidth, 101);
	stage.addChild(cover2);

	//logo
	var logo = new createjs.Text();
	logo.font = '40px Revalia';
	logo.color = '#fffff0';
	logo.text = '- SLOT -';
	logo.textBaseline = 'top';
	logo.textAlign = 'center';
	logo.x = viewPortWidth/2;
	logo.y = 20;
	stage.addChild(logo);

	//开始按钮
	var isCanClickStart = true;	
	var isCanClickEnd = false;
	var endBtn;
	var startBtn = new CircleButton({
		x: 200,
		y: 250,
		radius: 16,
		label: 'S',
		color: '#ffffff',
		bgColor: '#44cd44',
		strokeColor: '#333333',
		font: '14px Revalia',
		handleClick: function() {
			if ( !isCanClickStart ) {
				return;
			}
			isCanClickStart = false;
			picList1.active();
			setTimeout(function() {
				picList2.active();
			}, 500);
			setTimeout(function() {
				picList3.active();
				isCanClickEnd = true;
				endBtn.resetSD();
			}, 1000);
		}
	});
	stage.addChild(startBtn);

	//结束按钮
	endBtn = new CircleButton({
		x: 250,
		y: 250,
		radius: 16,
		label: 'E',
		color: '#ffffff',
		bgColor: '#c10000',
		strokeColor: '#333333',
		font: '14px Revalia',
		handleClick: function() {
			if ( !isCanClickEnd ) {
				return;
			}
			isCanClickEnd = false;
			picList1.pause(random(0, 4), function() {
				console.log('stop-1');
			});
			setTimeout(function() {
				picList2.pause(random(0, 4), function() {
					console.log('stop-2');
				});
			}, 500);
			setTimeout(function() {
				picList3.pause(random(0, 4), function() {
					isCanClickStart = true;
					startBtn.resetSD();
					console.log('stop-3');
				});
			}, 1000);
		}
	});
	stage.addChild(endBtn);

	//循环方法
	function tick() {
		picList1.roll();
		picList2.roll();
		picList3.roll();
		stage.update();
	}

	//设置绘图
	createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
	createjs.Ticker.setInterval(60);
	createjs.Ticker.setFPS(60);

};