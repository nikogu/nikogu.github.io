/**
 * billd'S BATTLE
 *
 * @version 0.0.1
 * @author niko<nikolikegirl@gmail.com>
 * @data 2014-3-18
 */

//包配置
KISSY.config({
	packages: [{
		name: "module",
		path: './module',
		ignorePackageNameInUri: true
	}, {
		name: "data",
		path: './data',
		ignorePackageNameInUri: true
	}]
});
KISSY.config({
	debug: true
});

//+++++++++++++++++++++++++++++
//全局函数
//+++++++++++++++++++++++++++++
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
//+++++++++++++++++++++++++++++
//全局变量
//+++++++++++++++++++++++++++++
var loader,
	SCALE = b2.SCALE;

//+++++++++++++++++++++++++++++
//游戏入口
//+++++++++++++++++++++++++++++
KISSY.add('main', function(S, Billd, Draw, Scene, Gold, UIText, Thorn, SenceData1) {

	//++++++++++++++++++++++++++++++++++++
	// 初始加载
	//++++++++++++++++++++++++++++++++++++
	var loadingNum = document.getElementById('loading-num'),
		startBtn = document.getElementById('btn-start'),
		loadingBox = document.getElementById('loading-box'),
		overBox = document.getElementById('over-box'),
		restartBtn = document.getElementById('btn-restart'),
		count = 0,
		isOver = false,
		isStart = false,
		isClear = false;

	var timmer = setInterval(function() {

		if (count <= 89) {
			count += Math.floor(Math.random() * 10);
		}

		loadingNum.innerHTML = count + '%';

	}, 10);

	//++++++++++++++++++++++++++++++++++++
	// 字体加载
	//++++++++++++++++++++++++++++++++++++
	WebFont.load({
		google: {
			families: ['Revalia']
		},
		loading: function() {},
		active: function() {
			loadFunc();
		},
		inactive: function() {}
	});

	//++++++++++++++++++++++++++++++++++++
	// 静态资源加载
	//++++++++++++++++++++++++++++++++++++
	function loadFunc() {
		var manifest = [{
			src: "res/bg.png",
			id: "bg"
		}, {
			src: "res/billd.png",
			id: "billd"
		}, {
			src: "res/bg.mp3",
			id: "m-bg"
		}, {
			src: "res/crash.wav",
			id: "m-crash"
		}, {
			src: "res/success.mp3",
			id: "m-sucess"
		}, {
			src: "res/jump.wav",
			id: "m-jump"
		}, {
			src: "res/click.wav",
			id: "m-click"
		}, {
			src: "res/score.wav",
			id: "m-score"
		}, {
			src: "res/over.mp3",
			id: "m-over"
		}, {
			src: "res/thron.ogg",
			id: "m-thron"
		}];

		loader = new createjs.LoadQueue(false);
		createjs.Sound.alternateExtensions = ['mp3', 'wav', 'ogg'];
		loader.installPlugin(createjs.Sound);

		loader.addEventListener("complete", function() {
			clearInterval(timmer);
			loadingNum.innerHTML = '100%';
			startBtn.style.display = 'block';

			function start() {
				if (isStart) {
					return;
				}
				isStart = true;
				isOver = false;
				loadingBox.style.top = '-500px';
				overBox.style.top = '-500px';
				createjs.Sound.play('m-click');
				init();
			}

			window.addEventListener('keydown', function(e) {
				if (e.keyCode == 13) {
					start();
				}
			});
			startBtn.addEventListener('click', function() {
				start();
			});

			//init();
		});
		loader.loadManifest(manifest);
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

		var gamePortWidth = 1200,
			gamePortHeight = 800;

		var stage = new createjs.Stage('canvas');
		//stage.enableMouseOver(20);

		var bg = new createjs.Bitmap(loader.getResult('bg'));
		var bgBound = bg.getBounds();
		bg.cache(bgBound.x, bgBound.y, bgBound.width, bgBound.height);
		stage.addChild(bg);

		//+++++++++++++++++++++++++++++++++++
		//具体代码开始
		//+++++++++++++++++++++++++++++++++++
		//b2.b2Utils.setDrag(true, debugCanvas);

		var mapData = SenceData1;

		//主角
		var billd,
			scoreText,
			scene,
			update;

		function createGame(mapData) {

			isClear = false;
			createjs.Sound.play('m-bg', {
				loop: -1
			});

			//主角
			billd = new Billd(50, 750, stage);

			//得分显示处理器
			scoreText = new UIText({
				stage: stage,
				text: 'YOUR SCORE: 0',
				style: '18px Revalia',
				color: '#006ac1',
				score: 0,
				update: function() {
					this.sprite.x = b2.b2Utils._offset.x;
					this.sprite.y = b2.b2Utils._offset.y;
				},
				clear: function() {
					this.stage.removeChild(this.sprite);
				}
			});

			//构造场景
			scene = new Scene({
				stage: stage,
				billd: billd,
				scale: SCALE,
				goldCollectFunc: function(gold) {
					scoreText.score++;
					scoreText.setText('YOUR SCORE: ' + scoreText.score);
				},
				goldUpdateFunc: function() {
					this.target = {
						x: b2.b2Utils._offset.x,
						y: b2.b2Utils._offset.y
					}
				}
			});
			//场景初始化
			scene.addBound(gamePortWidth, gamePortHeight, 1);
			scene.build(mapData);

			//billd show
			billd.show();

			//得分文案show
			scoreText.show();

			//碰撞检测障碍
			b2.b2Utils.contactWith(billd.body, scene.getBlockBodys(), function(billdBody, floor) {
				billdBody.master.jumping = false;
				billdBody.master.action = '';
			});

			//碰撞检测钉刺
			b2.b2Utils.contactWith(billd.body, scene.getThronBodys(), function(billdBody, thronBody) {
				billdBody.master.dead = true;
				if (!isOver) {
					createjs.Sound.stop('m-bg');
					createjs.Sound.play('m-crash');
					createjs.Sound.play('m-over');
					over();
					isOver = true;
					//overBox.style.top = '0';
				}
			});

			b2.b2Utils.cameraFollowUpdate(billd.body);
		}

		//构建游戏
		createGame(mapData);

		b2.b2Utils.cameraFollow(billd.body, {
			debugCanvas: document.getElementById("debug-canvas"),
			stagePortWidth: viewPortWidth,
			stagePortHeight: viewPortHeight,
			gamePortHeight: gamePortHeight,
			gamePortWidth: gamePortWidth,
			space: 400
		});

		//更新代码
		function update() {
			//b2.b2Utils.watchDrag();
			scoreText.update();
			b2.b2Utils.startContactListener();
			billd.update();
			scene.update();

			stage.setTransform(b2.b2Utils._camera.x, b2.b2Utils._camera.y);
			b2.b2Utils.watchCamera();
		}

		//清理方法集合
		function clear() {
			isClear = true;
			//update = null;
			billd.clear();
			scene.clear();
			scoreText.clear();
			stage.clear();
		}

		//游戏结束
		function over() {
			overBox.style.top = '0';
		}
		restartBtn.addEventListener('click', function() {
			if (!isOver) {
				return;
			}
			isOver = false;
			loadingBox.style.top = '-500px';
			overBox.style.top = '-500px';
			clear();
			createGame(mapData);
		});

		//+++++++++++++++++++++++++++++++++++
		//具体代码结束
		//+++++++++++++++++++++++++++++++++++

		//setup debug draw
		b2.b2Utils.debug(document.getElementById("debug-canvas"));

		//循环方法
		function tick() {

			if (isClear) {
				return;
			}

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

}, {
	requires: ['module/billd', 'module/draw', 'module/scene', 'module/gold', 'module/uitext', 'module/thorn',
		'data/senceData1'
	]
});
KISSY.use('main');