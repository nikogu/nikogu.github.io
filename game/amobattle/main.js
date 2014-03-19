/**
 * billd'S BATTLE
 *
 * @version 0.0.1
 * @author niko<nikolikegirl@gmail.com>
 * @data 2014-3-18
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

//加载器
function loadFunc() {
	manifest = [{
		src: "res/bg.png",
		id: "bg"
	}, {
		src: "res/billd.png",
		id: "billd"
	}];

	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", init);
	loader.loadManifest(manifest);
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

function drawPath(path, stage, _config) {
	var config = _config || {},
		color = config.color || '#000000',
		width = config.width || 1,
		fill = config.fill || undefined;

	var pathShape = new createjs.Shape(),
		first = path[0],
		midPath = [],
		len = path.length;
	for (var i = 0; i < len - 1; i++) {
		midPath.push({
			x: (path[i + 1].x - path[i].x) / 2 + path[i].x,
			y: (path[i + 1].y - path[i].y) / 2 + path[i].y
		});
	}
	//第一条
	if ( fill ) {
		pathShape.graphics.setStrokeStyle(width, "round").beginStroke(color).beginFill(fill).moveTo(first.x, first.y);
	} else {
		pathShape.graphics.setStrokeStyle(width, "round").beginStroke(color).moveTo(first.x, first.y);
	}

	for (var j = 0; j < midPath.length; j++) {
		pathShape.graphics.curveTo(path[j].x, path[j].y, midPath[j].x, midPath[j].y);
	}

	//最后一条
	pathShape.graphics.curveTo(path[len - 2].x, path[len - 2].y, path[len - 1].x, path[len - 1].y);

	//pathShape.graphics.closePath();	
	stage.addChild(pathShape);
	return pathShape;
}

function init() {

	//+++++++++++++++++++++++++++++++++++
	// 创建舞台
	// 设置初始化变量
	//+++++++++++++++++++++++++++++++++++
	var canvas = document.getElementById('canvas'),
		debugCanvas = document.getElementById('debug-canvas');

	var viewPortWidth = canvas.width,
		viewPortHeight = canvas.height;

	var gamePortWidth = 1600,
		gamePortHeight = 800;

	var stage = new createjs.Stage('canvas');
	//stage.enableMouseOver(20);

	var bg = new createjs.Bitmap(loader.getResult('bg'));
	stage.addChild(bg);

	var SCALE = b2.SCALE;

	//+++++++++++++++++++++++++++++++++++
	//具体代码开始
	//+++++++++++++++++++++++++++++++++++
	//b2.b2Utils.setDrag(true, debugCanvas);


	//billd
	function Billd(x, y, stage) {
		this.x = x || 0;
		this.y = y || 0;
		this.vx = 200 / SCALE;
		this.vy = -300 / SCALE;
		this.ax = 20 / SCALE;
		this.stage = stage;
		this.spriteData = {};
		this.sprite = {};
		this.body = {};
		this.action = 'static';
		this.status = 'static';
		this.jumping = true;
		this.init();
	}
	Billd.prototype.init = function() {
		this.spriteData = new createjs.SpriteSheet({
			"images": [loader.getResult("billd")],
			"frames": {
				"regX": 11,
				"height": 22,
				"count": 24,
				"regY": 11,
				"width": 22
			},
			// define two animations, run (loops, 1.5x speed) and jump (returns to run):
			"animations": {
				"runLeft": [4, 7, "runLeft", 0.2],
				"runRight": [0, 3, "runRight", 0.2],
				"jump": [8, 18, "jump", 0.2],
				"static": [19, 23, "static", 0.2]
			}
		});
		this.sprite = new createjs.Sprite(this.spriteData, "static");
		this.sprite.scaleX = 1;
		this.sprite.scaleY = 1;
		this.sprite.x = this.x;
		this.sprite.y = this.y;
		this.sprite.framerate = 30;
		this.stage.addChild(this.sprite);
		this.body = b2.b2Utils.createCircle(this.x, this.y, 11, {
			restitution: 0,
			friction: 0.9
		});
		this.body.master = this;
		this.go();
	}
	Billd.prototype.update = function() {

		if (this.jumping || this.action == 'up') {
			if (this.status != 'jump') {
				this.sprite.gotoAndPlay('jump');
			}
			this.status = 'jump';
		} else if (this.body.GetLinearVelocity().x * SCALE > 10) {
			if (this.status != 'right') {
				this.sprite.gotoAndPlay('runRight');
			}
			this.status = 'right';
		} else if (this.body.GetLinearVelocity().x * SCALE < -10) {
			if (this.status != 'left') {
				this.sprite.gotoAndPlay('runLeft');
			}
			this.status = 'left';
		} else {
			if (this.status != 'static') {
				this.sprite.gotoAndPlay('static');
			}
			this.status = 'static';
		}

		this.sprite.x = this.body.GetPosition().x * SCALE;
		this.sprite.y = this.body.GetPosition().y * SCALE;
	}
	Billd.prototype.go = function() {
		window.addEventListener('keydown', bind(function(e) {
			switch (e.keyCode) {
				//左
				case 37:
					this.action = 'left';
					this.body.SetAwake(true);
					//this.body.SetLinearVelocity(new b2.b2Vec2(-this.vx, this.body.GetLinearVelocity().y));
					if (this.body.GetLinearVelocity().x >= -this.vx) {
						this.body.ApplyImpulse(new b2.b2Vec2(-this.ax, 0), this.body.GetWorldCenter());
					}
					break;
					//右
				case 39:
					this.action = 'right';
					this.body.SetAwake(true);
					if (this.body.GetLinearVelocity().x <= this.vx) {
						this.body.ApplyImpulse(new b2.b2Vec2(this.ax, 0), this.body.GetWorldCenter());
					}
					//this.body.SetLinearVelocity(new b2.b2Vec2(this.vx, this.body.GetLinearVelocity().y));
					break;
					//上
				case 38:
					if (!this.jumping) {
						this.jumping = true;
						this.action = 'up';
						this.body.SetAwake(true);
						this.body.SetLinearVelocity(new b2.b2Vec2(this.body.GetLinearVelocity().x, this.vy));
					}
					break;
				default:
					break;
			}
		}, this));
		window.addEventListener('keyup', bind(function(e) {
			switch (e.keyCode) {
				//左
				case 37:
					//右
				case 39:
					this.action = 'static';
					//this.body.SetActive(false);
					//this.body.SetLinearDamping(10);
					this.body.SetLinearVelocity(new b2.b2Vec2(0, this.body.GetLinearVelocity().y));
					this.body.SetAngularVelocity(0);
					break;
					//上
				case 38:
					break;
				default:
					break;
			}
		}, this));
	}

	var billd = new Billd(100, 100, stage);

	//地图
	var path = [{
		x: 100,
		y: 800
	}, {
		x: 150,
		y: 780
	}, {
		x: 200,
		y: 760
	}, {
		x: 250,
		y: 740
	}, {
		x: 300,
		y: 710
	}, {
		x: 350,
		y: 680
	}, {
		x: 400,
		y: 660
	}, {
		x: 450,
		y: 620
	}, {
		x: 500,
		y: 600
	}, {
		x: 550,
		y: 580
	}, {
		x: 600,
		y: 540
	}, {
		x: 650,
		y: 520
	}, {
		x: 700,
		y: 500
	}, {
		x: 750,
		y: 520,
	}, {
		x: 800,
		y: 560
	}, {
		x: 850,
		y: 580
	}, {
		x: 900,
		y: 600
	}, {
		x: 950,
		y: 700
	}, {
		x: 1000,
		y: 800
	}];

	var bound = b2.b2Utils.createBound(gamePortWidth, gamePortHeight, 1, {
		friction: 0.9
	});
	var floor = b2.b2Utils.createPathBound(path, 1);
	var floorSprite = drawPath(path, stage, {
		fill: '#449944'
	});

	b2.b2Utils.contactWith(billd.body, floor, function(body, floor) {
		body.master.jumping = false;
	});

	b2.b2Utils.contactWith(billd.body, bound, function(body, bound) {
		body.master.jumping = false;
	});

	//更新代码
	function update() {
		//b2.b2Utils.watchDrag();
		b2.b2Utils.startContactListener();
		billd.update();

		stage.setTransform(b2.b2Utils._camera.x, b2.b2Utils._camera.y);
		b2.b2Utils.watchCamera();
	}

	//+++++++++++++++++++++++++++++++++++
	//具体代码结束
	//+++++++++++++++++++++++++++++++++++

	//setup debug draw
	b2.b2Utils.debug(document.getElementById("debug-canvas"));
	b2.b2Utils.cameraFollow(billd.body, {
		debugCanvas: document.getElementById("debug-canvas"),
		stagePortWidth: viewPortWidth,
		stagePortHeight: viewPortHeight,
		gamePortHeight: gamePortHeight,
		gamePortWidth: gamePortWidth,
		space: 400
	});

	//循环方法
	function tick() {
		update();

		b2.world.Step(
			1 / 60, //frame-rate
			8, //velocity iterations
			3 //position iterations
		);
		b2.world.DrawDebugData();
		b2.world.ClearForces();

		stage.update();
	}

	//设置绘图
	createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
	createjs.Ticker.setInterval(60);
	createjs.Ticker.setFPS(60);

}