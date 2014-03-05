/**
 * 游戏开始 flappy amo
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-03-04
 */
(function() {

	//全局系统变量
	//缩小比例值
	var _scale = 0.4,
		_viewPortWidth = 288,
		_viewPortHeight = 512;

	//你好，我是amo
	var amo,
		ground,
		floor1,
		floor2,
		pipes,
		pipe1,
		piep2,
		bg,
		pipeVx = -200,
		score = 0,
		jumpVoice,
		bgVoice,
		creashVoice,
		scoreVoice,
		beginLogo,
		endLogo,
		endText,
		endInfo,
		scoreText,
		bestScoreText,
		replay,
		count,
		blurX,
		blurY;

	var gameStep = 'begin';

	//资源预加载
	function preload() {

		game.load.image('bg', 'res/bg.png');
		game.load.image('ground', 'res/ground.png');
		game.load.image('amo', 'res/amo.png');
		game.load.image('pipe', 'res/pipe.png');
		game.load.image('green-pipe', 'res/green-pipe.png');
		game.load.image('begin-logo', 'res/begin-logo.png');
		game.load.image('gameover', 'res/gameover.png');
		game.load.image('gameinfo', 'res/gameinfo.png');
		game.load.image('btn', 'res/btn.png');
		game.load.spritesheet('amo', 'res/amo.png', 100, 88);

		//music
		game.load.audio('jump', ['res/sound/fly.ogg', 'res/sound/fly.bg']);
		game.load.audio('bg', ['res/sound/bg.mp3']);
		game.load.audio('crash', ['res/sound/crash.ogg']);
		game.load.audio('score', ['res/sound/score.ogg']);

		game.load.script('filterX', './BlurX.js');
    	game.load.script('filterY', './BlurY.js');

	}

	//重置
	function reset() {
		//amo的重置
		amo.x = 50;
		amo.y = 0;
		amo._jumpCount = 0;

		//管子的重置
		pipeVx = -200;
		pipe1.body.velocity.x = 0;
		pipe2.body.velocity.x = 0;
		pipe1.x = _viewPortWidth;
		pipe2.x = _viewPortWidth;

		//结束动画的重置
		endLogo.y = 500;

		//开始动画的重置
		beginLogo.y = 150;
		beginLogoTween.resume();

		//变量
		game.canvas.style.cursor = 'pointer';
		score = 0;
		count.setText('0')
		gameStep = 'begin';

	}

	//设置模糊
	function setBlur() {
		bg.filters = [blurX, blurY];
		floor1.filters = [blurX, blurY];
		floor2.filters = [blurX, blurY];
		amo.filters = [blurX, blurY];
		pipe1.filters = [blurX, blurY];
		pipe2.filters = [blurX, blurY];
	}
	function reBlur() {
		bg.filters = null;
		floor1.filters = null;
		floor2.filters = null;
		amo.filters = null;
		pipe1.filters = null;
		pipe2.filters = null;
	}

	//初始化
	function create() {

		//remove loading
		document.getElementById('loading').style.display = 'none';

		blurX = game.add.filter('BlurX');
		blurY = game.add.filter('BlurY');
		game.canvas.style.cursor = 'pointer';

		//++++++++++++++++++++++++++++++++++++
		//音效
		//++++++++++++++++++++++++++++++++++++
		jumpVoice = game.add.audio('jump', 1, true);

		bgVoice = game.add.audio('bg', 1, true);
		bgVoice.play('', 0, 1, true);

		crashVoice = game.add.audio('crash', 1, true);
		scoreVoice = game.add.audio('score', 1, true);

		//++++++++++++++++++++++++++++++++++++
		//设置背景
		//++++++++++++++++++++++++++++++++++++
		bg = game.add.sprite(0, 0, 'bg');
		bg.scale.setTo(_scale, _scale);
		bg.inputEnabled = true;
		

		//++++++++++++++++++++++++++++++++++++
		//设置管子
		//++++++++++++++++++++++++++++++++++++
		pipes = game.add.group();
		pipe1 = pipes.create(_viewPortWidth, _viewPortHeight - 200, 'pipe');
		pipe1.scale.setTo(_scale, _scale);
		pipe1.body.immovable = true;
		pipe1.body.velocity.x = 0;

		pipe2 = pipes.create(_viewPortWidth, _viewPortHeight - 200, 'green-pipe');
		pipe2.scale.setTo(_scale, _scale);
		pipe2.body.immovable = true;
		pipe2.body.velocity.x = 0;

		// 管子运动检测
		function eventHander(pipe1, pipe2) {
			score++;
			scoreVoice.play();
			count.setText(score.toString());
			pipe1.body.velocity.x = 0;
			pipe1.x = _viewPortWidth;
			pipe1.y = (Math.random() * 100 - 50) + _viewPortHeight - 200;
			pipe2.body.velocity.x = pipeVx;

			if (pipeVx > -300) {
				pipeVx = -(Math.floor(score / 5) * 50 + 200);
				floor1.body.velocity.x = pipeVx;
				floor2.body.velocity.x = pipeVx;
			}
		}
		pipe1.events.onOutOfBounds.add(function() {
			eventHander(pipe1, pipe2);
		}, pipe1);

		pipe2.events.onOutOfBounds.add(function() {
			eventHander(pipe2, pipe1);
		}, pipe1);

		//++++++++++++++++++++++++++++++++++++
		//设置ground
		//++++++++++++++++++++++++++++++++++++
		ground = game.add.group();
		floor1 = ground.create(0, _viewPortHeight - 112, 'ground');
		floor1.scale.setTo(_scale, _scale);
		floor1.body.velocity.x = pipeVx;
		floor1.body.immovable = true;
		floor1.body.checkCollision.left = false;
		floor1.body.checkCollision.right = false;

		floor2 = ground.create(_viewPortWidth, _viewPortHeight - 112, 'ground');
		floor2.scale.setTo(_scale, _scale);
		floor2.body.velocity.x = pipeVx;
		floor2.body.immovable = true;
		floor2.body.checkCollision.left = false;
		floor2.body.checkCollision.right = false;

		//++++++++++++++++++++++++++++++++++++
		//记分	
		//++++++++++++++++++++++++++++++++++++
		var text = score.toString();
		var style = {
			font: "bold 30pt Arial",
			fill: "#ffffff",
			align: "center",
			stroke: "#333333",
			strokeThickness: 3
		};
		count = game.add.text(game.world.centerX, 150, text, style);
		count.anchor.setTo(0.5, 0.5);
		count.y = -50;

		//++++++++++++++++++++++++++++++++++++
		//设置开场动画场景
		//++++++++++++++++++++++++++++++++++++
		beginLogo = game.add.sprite(game.world.centerX, 150, 'begin-logo');
		beginLogo.anchor.setTo(0.5, 0.5);
		beginLogoTween = game.add.tween(beginLogo).to({
			alpha: 0
		}, 200, Phaser.Easing.Linear.None, true, 0, 200, true);

		//++++++++++++++++++++++++++++++++++++
		//结束动画场景
		//++++++++++++++++++++++++++++++++++++
		endLogo = game.add.group();
		endText = endLogo.create(game.world.centerX, 100, 'gameover');
		endText.anchor.setTo(0.5, 0.5);
		endText.scale.setTo(_scale, _scale);

		endInfo = endLogo.create(game.world.centerX, 200, 'gameinfo');
		endInfo.anchor.setTo(0.5, 0.5);
		endInfo.scale.setTo(_scale, _scale);

		//添加分数
		var text = score.toString();
		var style = {
			font: "bold 16pt Arial",
			fill: "#ffffff",
			align: "center",
			stroke: "#333333",
			strokeThickness: 2
		};

		scoreText = game.add.text(game.world.centerX + 75, 188, text, style);
		scoreText.anchor.setTo(0.5, 0.5);

		endLogo.add(scoreText);

		//添加最佳
		if (!localStorage.getItem('best_score')) {
			localStorage.setItem('best_score', 0);
		}
		var text = localStorage.getItem('best_score');
		var style = {
			font: "bold 16pt Arial",
			fill: "#ffffff",
			align: "center",
			stroke: "#333333",
			strokeThickness: 2
		};

		bestScoreText = game.add.text(game.world.centerX + 75, 230, text, style);
		bestScoreText.anchor.setTo(0.5, 0.5);

		endLogo.add(bestScoreText);

		//重玩按钮
		replay = game.add.button(game.world.centerX, 300, 'btn', reset, this, 1, 0, 2);
		replay.anchor.setTo(0.5, 0.5);
		replay.scale.setTo(_scale, _scale);
		endLogo.add(replay);

		endLogo.y = 500;


		//++++++++++++++++++++++++++++++++++++
		//设置amo
		//++++++++++++++++++++++++++++++++++++
		amo = game.add.sprite(50, 0, 'amo');
		amo.scale.setTo(_scale, _scale);
		amo.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);

		//amo的重力
		amo.body.gravity.y = 1000;
		amo.body.bounce.y = 0;
		amo.body.collideWorldBounds = true;
		amo._jumpCount = 0;

		setBlur();

		//++++++++++++++++++++++++++++++++++++
		//amo向上，点击事件
		//++++++++++++++++++++++++++++++++++++
		bg.events.onInputDown.add(function() {

			if (gameStep == 'begin') {

				gameStep = 'now';
				pipe1.body.velocity.x = pipeVx;
				beginLogoTween.pause();

				game.add.tween(beginLogo).to({
					y: -200
				}, 1000, Phaser.Easing.Linear.None, true);

				count.y = 100;

				reBlur();
			}

			if (gameStep != 'now') {
				return;
			}

			amo.animations.stop();
			amo.frame = 1;
			if (amo.body.touching.down) {
				amo._jumpCount = 0;
			}
			if (amo._jumpCount < 4) {
				amo._jumpCount++;
				amo.body.velocity.y = -500;
			}
			jumpVoice.play();

		}, this);

	}

	//++++++++++++++++++++++++++++++++++++
	//每帧更新
	//++++++++++++++++++++++++++++++++++++
	function update() {

		if (gameStep == 'begin') {


		} else if (gameStep == 'now') {
			//游戏结束
			// o1, o2, collideCallback, processCallback, callbackContext
			game.physics.collide(amo, pipes, function() {
				crashVoice.play();
				amo.animations.stop();
				amo.frame = 8;

				scoreText.setText(score.toString());
				if (localStorage.getItem('best_score') < score) {
					localStorage.setItem('best_score', score);
				}
				bestScoreText.setText(localStorage.getItem('best_score').toString());
				game.add.tween(endLogo).to({
					y: 0
				}, 200, Phaser.Easing.Linear.None, true);

				count.y = -50;

				setBlur();

				gameStep = 'over';

			}, null, this);

		} else if (gameStep == 'over') {

			pipe1.body.velocity.x = 0;
			pipe2.body.velocity.x = 0;

		}

		//持续运行的
		game.physics.collide(amo, ground, function() {
			amo.animations.play('run');
		});

		//floor
		if (floor1.x < -_viewPortWidth) {
			floor1.x = _viewPortWidth;
		}
		if (floor2.x < -_viewPortWidth) {
			floor2.x = _viewPortWidth;
		}


	}

	//渲染
	function render() {}

	//phaser实例
	var game = new Phaser.Game(_viewPortWidth, _viewPortHeight, Phaser.AUTO, '', {
		preload: preload,
		create: create,
		update: update,
		render: render
	});

})();