/**
 * 游戏开始 link
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-03-16
 */

//++++++++++++++++++++++++++++++++++++
// google font load
//++++++++++++++++++++++++++++++++++++
// WebFont.load({
// 	google: {
// 		families: ['Revalia']
// 	},
// 	loading: function() {
// 		console.log("loading");
// 	},
// 	active: function() {
// 		//loadFunc();
// 	},
// 	inactive: function() {
// 		console.log("inactive")
// 	}
// });
//++++++++++++++++++++++++++++++++++++
// load img
//++++++++++++++++++++++++++++++++++++
// function loadFunc() {
// 	manifest = [{
// 		src: "res/yellow6.png",
// 		id: "yellow1"
// 	}, {
// 		src: "res/yellow2.png",
// 		id: "yellow2"
// 	}, {
// 		src: "res/yellow5.png",
// 		id: "yellow3"
// 	}, {
// 		src: "res/yellow4.png",
// 		id: "yellow4"
// 	}];
// 	loader = new createjs.LoadQueue(false);
// 	loader.addEventListener("complete", init);
// 	loader.loadManifest(manifest);
// }


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
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}

//绑定上下文
function bind(fn, context) {
	return function() {
		fn.apply(context, arguments);
	}
}

var balls = [];
function smallBall(x, y, radius, color, num, gap, stage) {
	var ball;
	for (var i = num; i--;) {
		ball = new createjs.Shape();
		ball.x = x + random(-gap / 2, gap / 2);
		ball.y = y + random(-gap / 2, gap / 2);
		ball.vx = (random(-5, 4) + 1);
		ball.vy = -random(5, 10);
		ball._radius = radius;
		ball.graphics.beginFill(color).drawCircle(radius / 2, radius / 2, radius);
		balls.push(ball);
		stage.addChild(ball);
	}
}

/**
 * 连连看游戏实体
 */
function Link(stage) {
	this.stage = stage;
	this.sprites = [];
	this.linkData = [];
	this.scale = 1;
	this.num = 10;
	this.gap = 50;
	this.w = 50;
	this.h = 50;
	this.chooseBound = undefined;
	this.osprite = undefined;
	this.nsprite = undefined;
	this.isNeedArrange = false;
	this.scroe = 0;
	this.scroeNode = document.getElementById('scroe') || {};
	this.isCanClick = true;
	this.colors = ['#691bbb', '#1faeff', '#00c13f', '#ae113d', '#f4b300'];
	this.typeNum = this.colors.length;
};
//初始化数据
Link.prototype.init = function() {
	this.initData();
	this.creatItem();
};
//初始化数据
//设置坐标等
Link.prototype.initData = function() {
	for (var i = 0; i < this.num; i++) {
		for (var j = 0; j < this.num; j++) {
			this.linkData.push({
				index: i * this.num + j,
				x: j * this.w,
				y: i * this.h,
				type: (((i + 1) % this.typeNum + j) % this.typeNum || 5)
			});
		}
	}
};
//创建元素，根据数据
Link.prototype.creatItem = function() {
	var sprite;
	this.linkData.forEach(bind(function(item, index) {
		//sprite = new createjs.Bitmap(loader.getResult('yellow' + item.type));
		// sprite.graphics.beginFill(this.colors[item.type - 1]).
		// drawPolyStar(this.gap / 2, this.gap / 2, this.gap / 2, 5, 0.6);
		sprite = new createjs.Shape();
		sprite.graphics.setStrokeStyle(2, "round").beginStroke("rgba(0,0,0,0.2)").
		beginFill(this.colors[item.type - 1]).drawCircle(this.gap / 2, this.gap / 2, this.gap / 2);
		sprite.x = item.x;
		sprite.y = item.y;
		sprite.scaleX = this.scale;
		sprite.scaleY = this.scale;
		this.linkData[index].sprite = sprite;
		sprite._linkData = this.linkData[index];
		sprite._linkData.color = this.colors[item.type - 1];
		//绑定交互事件
		sprite.addEventListener('click', bind(this.clickFunc, this));
		this.sprites.push(sprite);
		this.stage.addChild(sprite);
	}, this));
};
//点击事件，移动，判断等
Link.prototype.clickFunc = function(e) {
	if (!this.isCanClick) {
		return;
	}
	this.isCanClick = false;

	var x = e.currentTarget.x,
		y = e.currentTarget.y;

	if (!this.nsprite) {
		this.nsprite = e.currentTarget;
		this.osprite = e.currentTarget;
	} else {
		this.osprite = this.nsprite;
		this.nsprite = e.currentTarget;
	}

	this.stage.removeChild(this.chooseBound);

	//如果是相邻的触发交换事件
	//如果不是则画框
	if (this.chooseBound && this.isAdjacency(this.chooseBound, x, y)) {
		//消除动画
		this.switchAnimation(this.osprite._linkData, this.nsprite._linkData, bind(function() {

			//交换元素
			this.switchItem(this.osprite._linkData, this.nsprite._linkData);

			//探测消除元素
			this.getCleanSprite(bind(function(items) {
				//console.log(items);
				//消除元素
				this.cleanSprite(items);
			}, this));
		}, this));
		this.chooseBound = undefined;
	} else {
		//建立新的选择框
		this.chooseBound = new createjs.Shape();
		this.chooseBound.x = x;
		this.chooseBound.y = y;
		this.chooseBound.graphics.setStrokeStyle(3, "round").beginStroke("rgba(200,0,0,0.5)").
		moveTo(0, 0).
		lineTo(this.w, 0).
		lineTo(this.w, this.h).
		lineTo(0, this.h).closePath();
		this.stage.addChild(this.chooseBound);
		this.isCanClick = true;
	}
	//this.stage.update();
};
//检测是否是相邻元素
Link.prototype.isAdjacency = function(bound, x, y) {
	if (Math.abs(bound.x - x) == this.gap && bound.y == y) {
		return true;
	} else if (Math.abs(bound.y - y) == this.gap && bound.x == x) {
		return true;
	}
}
//消除动画
Link.prototype.switchAnimation = function(oitem, nitem, callback) {
	createjs.Tween.get(oitem.sprite, {
		loop: false
	}).to({
		x: nitem.x,
		y: nitem.y
	}, 1000, createjs.Ease.quartOut);

	createjs.Tween.get(nitem.sprite, {
		loop: false
	}).to({
		x: oitem.x,
		y: oitem.y
	}, 1000, createjs.Ease.quartOut).wait(100).call(callback);
}
//交换元素（点击附加事件）
Link.prototype.switchItem = function(oitem, nitem) {

	var oSprite = oitem.sprite,
		nSprite = nitem.sprite;

	oitem.sprite = nSprite;
	nitem.sprite = oSprite;

	oitem.sprite._linkData = oitem;
	nitem.sprite._linkData = nitem;

	var type = oitem.type;
	oitem.type = nitem.type;
	nitem.type = type;

	var color = oitem.color;
	oitem.color = nitem.color;
	nitem.color = color;

	this.updateLinkDataSprite(oitem);
	this.updateLinkDataSprite(nitem);
}
//更新对应的sprite
Link.prototype.updateLinkDataSprite = function(item) {
	item.sprite.x = item.x;
	item.sprite.y = item.y;
};
//消除动画
Link.prototype.removeAnimation = function(item) {
	var x = item.x + this.gap / 2,
		y = item.y + this.gap / 2;

	smallBall(x, y, 4, item.color, 20, 50, this.stage);
}
//消除符合条件的元素
Link.prototype.cleanSprite = function(arr) {
	if (arr.length < 1) {
		this.isCanClick = true;
		return;
	}
	arr.forEach(bind(function(items) {
		this.scroe += items.length;
		items.forEach(bind(function(item) {
			this.removeAnimation(item);
			this.stage.removeChild(item.sprite);
			item.type = 0;
			item.sprite = {};
		}, this));
	}, this));
	this.scroeNode.innerHTML = this.scroe;
	this.arrangeSprite();
};
//添加新的
Link.prototype.fallDownAnimation = function(nitem, callback) {
	createjs.Tween.get(nitem.sprite, {
		loop: false
	}).to({
		y: nitem.y
	}, 100, createjs.Ease.quartOut).call(callback);
}
Link.prototype.setTargetPosition = function(nitem, oitem) {

	nitem.isNew = true;

	var oSprite = oitem.sprite,
		nSprite = nitem.sprite;

	oitem.sprite = nSprite;
	nitem.sprite = oSprite;

	oitem.sprite._linkData = oitem;
	nitem.sprite._linkData = nitem;

	var type = oitem.type;
	oitem.type = nitem.type;
	nitem.type = type;

	var color = oitem.color;
	oitem.color = nitem.color;
	nitem.color = color;

	//this.updateLinkDataSprite(oitem);
	//this.updateLinkDataSprite(nitem);
}
Link.prototype.arrangeSprite = function() {
	var count = 0,
		isHaveNew = false;
	for (var i = this.linkData.length - this.num; i--;) {
		this.linkData[i].isNew = false;
		if (!this.linkData[i + this.num].type && this.linkData[i].type) {

			//this.fallDownAnimation(this.linkData[i], this.linkData[i + this.num].y);
			//this.switchItem(this.linkData[i + this.num], this.linkData[i]);
			//this.stage.update();
			this.setTargetPosition(this.linkData[i + this.num], this.linkData[i]);
			count++;
		}
	}

	this.linkData.forEach(bind(function(item) {
		if (item.isNew) {
			isHaveNew = true;
			this.fallDownAnimation(item, bind(function() {
				count--;
				if (count == 0) {
					if (this.checkArrange()) {
						this.arrangeSprite();
					} else {
						this.getCleanSprite(bind(function(items) {
							this.cleanSprite(items);
						}, this));
					}
				}
				this.isCanClick = true;
			}, this));
			//this.stage.update();
		}
	}, this));

	if (!isHaveNew) {
		this.isCanClick = true;
	}

	//清理干净
	// if (this.checkArrange()) {
	// 	this.arrangeSprite();
	// } else {
	// 	this.getCleanSprite(bind(function(items) {
	// 		this.cleanSprite(items);
	// 	}, this));
	// }
}
Link.prototype.checkArrange = function() {
	var isNeedArrange = false;
	for (var i = this.linkData.length - this.num; i--;) {
		if (!this.linkData[i + this.num].type && this.linkData[i].type) {
			isNeedArrange = true;
		}
	}
	return isNeedArrange;
}
//核心算法
//获取需要消除的元素
Link.prototype.getCleanSprite = function(callback) {
	var filterItems = [],
		needCleanSprites = [];

	var linkData = this.linkData,
		num = this.num;

	//获取指定元素周围相同type的所有元素
	function matching(i) {
		var matchData = [],
			tempItem = [];
		(function getSameTypeItem(i) {
			if (!linkData[i].isMatch) {
				matchData.push(linkData[i]);
			}
			linkData[i].isMatch = true;
			linkData[i].isSearch = true;
			//获取指定元素的上下左右的元素
			tempItem = [
				linkData[i - 1],
				linkData[i + 1],
				linkData[i - num],
				linkData[i + num]
			];
			//左边右边元素单独处理
			if (i % 10 == 0) {
				tempItem[0] = undefined;
			}
			if ((i - 9) % 10 == 0) {
				tempItem[1] = undefined;
			}
			//遍历需要search和clean的元素
			tempItem.forEach(function(item) {
				if (item && item.type) {
					if (item.type == linkData[i].type && !item.isMatch) {
						item.isMatch = true;
						matchData.push(item);
						if (!item.isSearch) {
							getSameTypeItem(item.index);
						}
					}
				}
			});
		})(i);
		return matchData;
	}

	//获取相同type的元素集合
	for (var i = 0, len = linkData.length; i < len; i++) {
		if (!linkData[i].isMatch) {
			filterItems.push(matching(i));
		}
	}

	//对找到相同数据的元素进行判断（竖横三同）
	filterItems.forEach(function(arr) {
		//匹配长度大于才有可能满足消除条件
		//消除条件，有三个及以上相同横坐标或竖坐标
		var v = {},
			h = {},
			isNeedClean = false;
		if (arr.length >= 3) {
			arr.forEach(function(item, index) {
				if (!v['p' + item.y]) {
					v['p' + item.y] = 1;
				} else {
					v['p' + item.y]++;
				}
				if (!h['p' + item.x]) {
					h['p' + item.x] = 1;
				} else {
					h['p' + item.x]++;
				}
			});
			//判断横坐标竖坐标是否相同元素是否3个以上
			for (var p in v) {
				if (v[p] >= 3) {
					isNeedClean = true;
				}
			}
			if (!isNeedClean) {
				for (var p in h) {
					if (h[p] >= 3) {
						isNeedClean = true;
					}
				} //end of for
			} //end of if
		} //end of if
		//如果超过三个，则需要清除
		if (isNeedClean) {
			needCleanSprites.push(arr);
		}
	});

	if (callback) {
		linkData.forEach(function(link) {
			link.isMatch = false;
			link.isSearch = false;
		});
		callback(needCleanSprites);
	}
};


//++++++++++++++++++++++++++++++++++++
// 程序入口
//++++++++++++++++++++++++++++++++++++
function main() {

	document.getElementById('loading').style.display = 'none';
	var canvas = document.getElementById('canvas');

	var viewPortWidth = canvas.width,
		viewPortHeight = canvas.height;

	//传说中最简单的重新开始
	document.getElementById('btn-restart').addEventListener('click', function() {
		location.reload();
	});

	//创建舞台
	var stage = new createjs.Stage('canvas');
	stage.enableMouseOver(20);
	createjs.Touch.enable(stage);

	//构建背景
	var bg = new createjs.Shape();
	bg.graphics.beginFill('#fffff0').drawRect(0, 0, viewPortWidth, viewPortHeight);
	stage.addChild(bg);

	//构建连连看
	var link = new Link(stage);
	link.init();

	var G = 0.5;
	//循环方法
	function tick() {

		//散射的小球
		balls.forEach(function(ball, index) {
			ball.x += ball.vx;
			ball.vy += G;
			ball.y += ball.vy;
			//超出边界
			if (ball.x + ball._radius < 0 || ball.x > viewPortWidth) {
				balls.splice(index, 1);
				stage.removeChild(ball);
			} else if (ball.y + ball._radius > viewPortHeight || ball.y < 0) {
				balls.splice(index, 1);
				stage.removeChild(ball);
			}
		});

		stage.update();
	}

	//设置绘图
	createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
	createjs.Ticker.setInterval(60);
	createjs.Ticker.setFPS(60);
};

//入口
main();