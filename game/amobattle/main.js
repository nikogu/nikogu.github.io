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
	SCALE = b2.SCALE,
	isDebug = false;

//+++++++++++++++++++++++++++++
//游戏入口
//+++++++++++++++++++++++++++++
KISSY.add('main', function(S, Node, Billd, Draw, Scene, Gold, UIText, Thorn, CrashBall, Animation,
	SenceData1, senceData2, senceData3) {

	var $ = Node.all;

	//++++++++++++++++++++++++++++++++++++
	// 初始加载
	//++++++++++++++++++++++++++++++++++++
	var loadingNum = document.getElementById('loading-num'),
		startBtn = $('#btn-start'),
		loadingBox = document.getElementById('loading-box'),
		overBox = document.getElementById('over-box'),
		successBox = document.getElementById('success-box'),
		successOverBox = document.getElementById('success-over-box'),
		levelBtn = $('.btn-level'),
		restartBtn = $('.btn-restart'),
		nextBtn = $('.btn-next'),
		beginBtn = $('.btn-to-begin'),
		tips = $('#tips'),
		count = 0,
		gameStatus = 'init',
		level = 1,
		isPASSALL = false;

	var timmer = setInterval(function() {

		if (count <= 89) {
			count += Math.floor(Math.random() * 10);
		}

		loadingNum.innerHTML = count + '%';

	}, 1000);

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
			src: "res/bg.jpg",
			id: "bg"
		}, {
			src: "res/billd.png",
			id: "billd"
		}, {
			src: "res/billd-anim.gif",
			id: "billd-anim"
		}];
		loader = new createjs.LoadQueue();
		createjs.Sound.alternateExtensions = ['mp3', 'wav', 'ogg'];
		loader.installPlugin(createjs.Sound);
		loader.loadFile({
			src: "res/bg.mp3",
			id: "m-bg"
		});
		loader.loadFile({
			src: "res/crash.wav",
			id: "m-crash"
		});
		loader.loadFile({
			src: "res/success.mp3",
			id: "m-sucess"
		});
		loader.loadFile({
			src: "res/jump.wav",
			id: "m-jump"
		});
		loader.loadFile({
			src: "res/click.wav",
			id: "m-click"
		});
		loader.loadFile({
			src: "res/score.wav",
			id: "m-score"
		});
		loader.loadFile({
			src: "res/over.mp3",
			id: "m-over"
		});
		loader.loadFile({
			src: "res/thron.ogg",
			id: "m-thron"
		});
		loader.loadManifest(manifest);

		loader.on("complete", function() {
			clearInterval(timmer);
			loadingNum.innerHTML = '100%';
			startBtn.css('display', 'block');

			function start() {
				if (gameStatus == 'init') {
					gameStatus = 'ingame';
					loadingBox.style.top = '-500px';
					overBox.style.top = '-500px';
					createjs.Sound.play('m-click');
					tips.hide();
					init();
				}
			}

			$(window).on('keydown', function(e) {
				if (e.keyCode == 13 || e.keyCode == 32) {
					if (gameStatus == 'init') {
						startBtn.fire('click');
					} else if (gameStatus == 'over') {
						restartBtn.fire('click');
					} else if (gameStatus == 'win') {
						nextBtn.fire('click');
					} else if (gameStatus == 'stop') {
						levelBtn.fire('click');
					} else if (gameStatus == 'pass-all') {
						beginBtn.fire('click');
					}
				}
			});

			//游戏开始按钮
			startBtn.on('click', function() {
				start();
			});

			//片头动画按钮
			levelBtn.on('click', function() {
				$('#level-' + level).css('top', '500px');
				createjs.Sound.play('m-click');
				gameStatus = 'ingame';
			});

		});
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

		var bg = new createjs.Bitmap(loader.getResult('bg'));
		stage.addChild(bg);
		//缓存背景
		bg.cache(0, 0, 1900, 1397);


		//+++++++++++++++++++++++++++++++++++
		//具体代码开始
		//+++++++++++++++++++++++++++++++++++

		var DATA = [SenceData1, senceData2, senceData3],
			totalLevel = DATA.length;

		//主角
		var billd,
			scoreText,
			scene,
			update;

		function createGame(DATA) {

			//获取数据
			var mapData = DATA[(level - 1)];

			gameStatus = 'stop';

			//重置窗口大小
			gamePortWidth = mapData.gamePortWidth;
			gamePortHeight = mapData.gamePortHeight;

			createjs.Sound.play('m-bg', {
				loop: -1
			});

			//主角
			billd = new Billd(mapData.billd.x, mapData.billd.y, stage);

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
					if (scoreText.score >= mapData.targetScore) {
						win();
					}
				},
				goldUpdateFunc: function() {
					this.target = {
						x: b2.b2Utils._offset.x,
						y: b2.b2Utils._offset.y
					}
				},
				ballCrashFunc: function() {
					this.billd.dead = true;
					if (gameStatus == 'ingame') {
						over();
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
				if (gameStatus == 'ingame') {
					over();
				}
			});

			b2.b2Utils.cameraFollowUpdate(billd.body, gamePortWidth, gamePortHeight);

			//开头动画设置
			Animation.active('level-' + level);

		}

		//构建游戏
		createGame(DATA);

		b2.b2Utils.cameraFollow(billd.body, {
			debugCanvas: document.getElementById("debug-canvas"),
			stagePortWidth: viewPortWidth,
			stagePortHeight: viewPortHeight,
			gamePortHeight: gamePortHeight,
			gamePortWidth: gamePortWidth,
			spaceW: 400,
			spaceH: 200
		});

		//更新代码
		function update() {
			if (gameStatus == 'stop') {
				return;
			}
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
			gameStatus == 'clear';
			//update = null;
			billd.clear();
			scene.clear();
			scoreText.clear();
			stage.clear();
		}

		//游戏成功
		function win() {
			if (level < totalLevel) {
				gameStatus = 'win';
				createjs.Sound.stop('m-bg');
				createjs.Sound.play('m-sucess');
				successBox.style.top = '0';
				billd.stop = true;
			} else {
				gameStatus = 'pass-all';
				createjs.Sound.stop('m-bg');
				createjs.Sound.play('m-sucess');
				successOverBox.style.top = '0';
				billd.stop = true;
			}
		}

		//游戏结束
		function over() {
			gameStatus = 'over';
			overBox.style.top = '0';
			createjs.Sound.stop('m-bg');
			createjs.Sound.play('m-crash');
			createjs.Sound.play('m-over');
		}

		//重新开始
		restartBtn.on('click', function() {
			if (gameStatus == 'over') {
				loadingBox.style.top = '-500px';
				overBox.style.top = '-500px';
				successBox.style.top = '-500px';
				clear();
				createGame(DATA);
			}
		});

		//下一关
		nextBtn.on('click', function() {
			if (gameStatus == 'win') {
				successBox.style.top = '-500px';
				level++;
				clear();
				createGame(DATA);
			}
		});

		//初始化
		beginBtn.on('click', function() {
			if (gameStatus == 'pass-all') {
				successOverBox.style.top = '-500px';
				level = 1;
				clear();
				createGame(DATA);
			}
		});

		//网格
		if (isDebug) {
			Draw.drawGridding(gamePortWidth, gamePortHeight, 100, stage);
		}

		//+++++++++++++++++++++++++++++++++++
		//具体代码结束
		//+++++++++++++++++++++++++++++++++++

		//setup debug draw
		if (isDebug) {
			document.getElementById("debug-canvas").style.display = 'block';
			b2.b2Utils.debug(document.getElementById("debug-canvas"));
		}

		//循环方法
		function tick() {

			if (gameStatus == 'clear' || gameStatus == 'stop') {
				return;
			}

			update();

			b2.world.Step(
				1 / 60, //frame-rate
				8, //velocity iterations
				3 //position iterations
			);
			if (isDebug) {
				b2.world.DrawDebugData();
			}
			b2.world.ClearForces();

			stage.update();
		}

		//设置绘图
		createjs.Ticker.addEventListener('tick', tick);
		createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
		createjs.Ticker.setInterval(60);
		createjs.Ticker.setFPS(60);

	}

}, {
	requires: ['node',
		'module/billd', 'module/draw', 'module/scene', 'module/gold', 'module/uitext', 'module/thorn', 'module/crash-ball', 'module/animation',
		'data/senceData1', 'data/senceData2', 'data/senceData3'
	]
});
KISSY.use('main');