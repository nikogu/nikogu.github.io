/**
 * 主场景
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-2-27
 */
var FlappyLayer = cc.Layer.extend({
    isMouseDown: false,
    helloImg: null,
    helloLabel: null,
    circle: null,
    sprite: null,
    spriteFrameIndex: 0,
    spriteAction: null,
    spriteRepeat: null,
    Anchro: null,
    pipes: [],
    _size: null,
    stop: false,
    x: 0,
    y: 0,
    shakeDeg: 0,
    score: 0,
    gameOverLayer: null,
    gamestep: 'begin',
    bind: function(fn, context) {
        return function() {
            fn.apply(context, arguments);
        }
    },
    init: function() {
        //初始设置
        var selfPointer = this;

        var size = cc.Director.getInstance().getWinSize();
        this._size = size;
        this._super();
        this.setTouchEnabled(true);
        cc.canvas.style.cursor = 'pointer';

        //音效
        this.FLY_MUSIC = "res/sound/fly.ogg";
        this.SCORE_MUSIC = "res/sound/score.ogg";
        this.CRASH_MUSIC = "res/sound/crash.ogg";
        //this.BG_MUSIC = "res/sound/bg.mp3";
        this.audioEngine = cc.AudioEngine.getInstance();
        //this.audioEngine.playMusic(this.BG_MUSIC, false);

        //添加close button
        var closeItem = cc.MenuItemImage.create(
            "res/CloseNormal.png",
            "res/CloseSelected.png",
            function() {
                history.go(-1);
            }, this);
        closeItem.setAnchorPoint(cc.p(0.5, 0.5));
        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.PointZero());
        this.addChild(menu, 1);
        closeItem.setPosition(cc.p(size.width - 20, 20));

        //add bg ground
        var groundBg = cc.Sprite.create("res/bg.png", cc.rect(0, 0, 720, 1280));
        groundBg.setScale(0.5);
        groundBg.setPosition(cc.p(size.width / 2, size.height / 2));
        var ground = cc.Layer.create();
        ground.addChild(groundBg);
        this.addChild(ground);

        //add plist，sprite资源
        var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames("res/flappy_packer.plist", "res/flappy_packer.png");
        cache.addSpriteFrames("res/flappy_frame.plist", "res/flappy_packer.png");

        //add pipe
        var pipe = new PipeGroup(size.width * 2, this, size);
        pipe.init();
        this.pipes.push(pipe);

        var pipe2 = new PipeGroup(size.width * 2.6, this, size);
        pipe2.init();
        this.pipes.push(pipe2);

        //add floor
        this.floorBg1 = cc.Sprite.create("res/ground.png");
        this.floorBg1.vx = 2 * __GG.scale;
        this.floorBg1.x = 0;
        this.floorBg1.width = 360;
        this.floorBg1.setScale(0.5);
        this.floorBg1.setPosition(cc.p(size.width / 2, 70));

        this.floorBg2 = cc.Sprite.create("res/ground.png");
        this.floorBg2.vx = 2 * __GG.scale;
        this.floorBg2.x = size.width;
        this.floorBg2.width = 360;
        this.floorBg2.setScale(0.5);
        this.floorBg2.setPosition(cc.p(size.width * 2, 70));

        var floor = cc.Layer.create();
        floor.addChild(this.floorBg1);
        floor.addChild(this.floorBg2);
        this.addChild(floor);

        //add bird
        this.sprite = new Bird();
        this.sprite.x = size.width / 2 - 100;
        this.sprite.y = size.height / 2 + 30;
        this.sprite.setPosition(cc.p(this.sprite.x, this.sprite.y));
        this.sprite.setScale(0.5);
        this.addChild(this.sprite);

        //bird的sprite动画        
        var frame1 = cache.getSpriteFrame("bird1.png");
        var frame2 = cache.getSpriteFrame("bird2.png");
        var frame3 = cache.getSpriteFrame("bird3.png");
        var animFrames = [];
        animFrames.push(frame1);
        animFrames.push(frame2);
        animFrames.push(frame3);
        var animation = cc.Animation.create(animFrames, 0.2);

        //create an animate with this animation
        this.spriteAction = cc.Animate.create(animation);

        //this.sprite.runAction(this.spriteAction);
        //var seq = cc.Sequence.create(this.spriteAction);
        this.spriteRepeat = cc.RepeatForever.create(this.spriteAction);
        //this.spriteRepeat = cc.Repeat.create(this.spriteAction, 1000);
        //var rotate = cc.RotateTo.create(10, 90);
        //this.sprite.runAction(rotate);
        this.sprite.runAction(this.spriteRepeat);

        //add game-over tips
        this.gameOverLayer = cc.Layer.create();
        this.gameOverLayer.y = -640;
        this.gameOverLayer.vy = 20;
        this.gameOverLayer.setPosition(cc.p(0, -640));
        this.addChild(this.gameOverLayer);

        //game over text
        this.gameOverLayer.gameOverTip = cc.Sprite.createWithSpriteFrameName("gameover.png");
        this.gameOverLayer.gameOverTip.setScale(0.5);
        this.gameOverLayer.gameOverTip.setPosition(cc.p(size.width / 2, 500));
        this.gameOverLayer.addChild(this.gameOverLayer.gameOverTip);

        //game over info
        this.gameOverLayer.gameOverBoard = cc.Sprite.createWithSpriteFrameName("base.png");
        this.gameOverLayer.gameOverBoard.setScale(0.5);
        this.gameOverLayer.gameOverBoard.setPosition(cc.p(size.width / 2, 380));
        this.gameOverLayer.addChild(this.gameOverLayer.gameOverBoard);

        //score now
        this.gameOverLayer.scoreText = cc.LabelTTF.create(this.score.toString(), "Audiowide", 24);
        this.gameOverLayer.scoreText.setFontName("Audiowide");
        this.gameOverLayer.scoreText.enableStroke('#333333', 2, false);
        this.gameOverLayer.scoreText.setPosition(cc.p(size.width / 2 + 90, 395));

        //best num
        if (!localStorage.getItem('best_score')) {
            localStorage.setItem('best_score', this.score);
        }
        this.gameOverLayer.bestScore = cc.LabelTTF.create(localStorage.getItem('best_score').toString(), "Audiowide", 24);
        this.gameOverLayer.bestScore.setFontName("Audiowide");
        this.gameOverLayer.bestScore.enableStroke('#333333', 2, false);
        this.gameOverLayer.bestScore.setPosition(cc.p(size.width / 2 + 90, 345));

        this.gameOverLayer.addChild(this.gameOverLayer.scoreText);
        this.gameOverLayer.addChild(this.gameOverLayer.bestScore);

        //replay btn
        var replaySprite = cc.Sprite.createWithSpriteFrameName("start.png");

        var replayBtn = cc.MenuItemLabel.create(replaySprite, function() {
            this.resetGame();
        }, this);

        this.gameOverLayer.replayMenu = cc.Menu.create(replayBtn);

        this.gameOverLayer.replayMenu.setScale(0.5);
        this.gameOverLayer.replayMenu.setPosition(cc.p(15, 80));
        this.gameOverLayer.addChild(this.gameOverLayer.replayMenu);

        //game start
        this.gameStartLayer = cc.Layer.create();
        var beginTips = cc.Sprite.createWithSpriteFrameName("getready.png");
        beginTips.setScale(0.5);
        beginTips.setPosition(cc.p(size.width / 2, 500));
        var learnTips = cc.Sprite.createWithSpriteFrameName("click.png");
        learnTips.setScale(0.5);
        learnTips.setPosition(cc.p(size.width / 2, 380));

        this.gameStartLayer.addChild(beginTips);
        this.gameStartLayer.addChild(learnTips);
        this.addChild(this.gameStartLayer);

        //count
        this.countTips = cc.LabelTTF.create(this.score.toString(), "Audiowide", 40);
        this.countTips.setFontName("Audiowide");
        this.countTips.enableStroke('#333333', 2, false);
        this.countTips.setPosition(cc.p(size.width / 2, 560));
        this.addChild(this.countTips);

        this.schedule(this.update);

        return true;
    },
    menuCloseCallback: function(sender) {
        cc.Director.getInstance().end();
    },
    onTouchesBegan: function(touches, event) {
        if (this.gamestep == 'begin') {
            this.gamestep = 'now';
            this.gameStartLayer.setPosition(cc.p(0, -640));
        }
        this.playFlayEffect();
        this.sprite.fly();
    },
    onTouchesMoved: function(touches, pEvent) {},
    onTouchesEnded: function(touches, event) {},
    onTouchesCancelled: function(touches, event) {},
    onEnter: function() {
        this._super();
    },
    playFlayEffect: function() {
        this.audioEngine.playEffect(this.FLY_MUSIC, false);
    },
    playScoreEffect: function() {
        this.audioEngine.playEffect(this.SCORE_MUSIC, false);
    },
    playCrashEffect: function() {
        this.audioEngine.playEffect(this.CRASH_MUSIC, false);
    },
    resetGame: function() {
        this.gamestep = 'begin';

        //reset pipe
        this.pipes[0].x = this._size.width * 2;
        this.pipes[1].x = this._size.width * 2.6;

        this.pipes[0].reset();
        this.pipes[1].reset();

        this.pipes[0].draw();
        this.pipes[1].draw();

        //reset bird
        this.sprite.x = this._size.width / 2 - 100;
        this.sprite.y = this._size.height / 2 + 30;
        this.sprite.rotate = 0;
        this.sprite.setRotation(this.sprite.rotate);
        this.sprite.setPosition(cc.p(this.sprite.x, this.sprite.y));
        this.sprite.fallDown = false;

        //reset begin
        this.gameStartLayer.setPosition(cc.p(0, 0));

        //reset overlayer
        this.gameOverLayer.y = -640;
        this.gameOverLayer.vy = 20;
        this.gameOverLayer.setPosition(cc.p(0, this.gameOverLayer.y));

        //reset score
        this.score = 0;

        //other
        this.showGameInfo.isExec = false;
        this.shake.otime = 0;
        this.shake.stop = false;
        this.shakeDeg = 0;
        this.countTips.setString(this.score.toString());
        this.countTips.setPosition(cc.p(this._size.width / 2, 560));

    },
    showGameInfo: function(callback) {
        if (this.gameOverLayer.y < 0) {
            this.gameOverLayer.y += this.gameOverLayer.vy;
        } else {
            this.gameOverLayer.y = 0;
            if (callback) {
                callback();
            }
        }
        if (!this.showGameInfo.isExec) {
            this.showGameInfo.isExec = true;
            this.gameOverLayer.scoreText.setString(this.score.toString());
            if (localStorage.getItem('best_score') * 1 < this.score) {
                this.gameOverLayer.bestScore.setString(this.score.toString());
                localStorage.setItem('best_score', this.score);
            }
        }
        this.gameOverLayer.setPosition(cc.p(0, this.gameOverLayer.y));
    },
    shake: function(dis, deg, time, callback) {
        if (this.shake.stop) {
            return;
        }
        if (!this.shake.otime) {
            this.shake.otime = new Date().getTime();
        }
        if (new Date().getTime() - this.shake.otime > time) {
            this.shake.stop = true;;
            this.x = 0;
            if (callback) {
                callback();
            }
            return;
        }
        this.shakeDeg += deg;
        if (this.shakeDeg >= 360) {
            this.shakeDeg = 0;
        }
        this.x = dis * Math.sin(this.shakeDeg * Math.PI / 180);
    },
    overCal: function() {
        this.shake(5, 60, 180, this.bind(function() {
            this.sprite.fallDown = true;
        }, this));
        this.setPosition(this.x, 0);
    },
    collision: function() {
        //floor
        if (this.sprite.y - this.sprite.height < 140) {
            this.playCrashEffect();
            this.gamestep = 'soon-over';
        }

        //pipe
        this.pipes.forEach(this.bind(function(pipe) {
            //x => y
            if (this.sprite.x + this.sprite.width / 2 >= pipe.x - pipe.width / 2 &&
                this.sprite.x <= pipe.x + pipe.width / 2) {
                if (this.sprite.y - this.sprite.height / 2 <= pipe.y + pipe.height / 2 ||
                    this.sprite.y + this.sprite.height / 2 >= pipe.y + pipe.height / 2 + 100) {
                    this.playCrashEffect();
                    this.gamestep = 'soon-over';
                }
            }
        }, this));
    },
    updateScore: function() {
        //check point
        this.pipes.forEach(this.bind(function(pipe) {
            if (pipe.x + pipe.width < this.sprite.x && !pipe.check) {
                pipe.check = true;
                this.playScoreEffect();
                this.score++;
            }
        }, this));
        this.countTips.setString(this.score.toString());
    },
    moveFloor: function() {
        //move floor
        this.floorBg1.x -= this.floorBg1.vx;
        this.floorBg2.x -= this.floorBg2.vx;

        if (this.floorBg1.x <= -this.floorBg1.width) {
            this.floorBg1.x = this.floorBg1.width;
        }
        if (this.floorBg2.x <= -this.floorBg2.width) {
            this.floorBg2.x = this.floorBg2.width;
        }

        this.floorBg1.setPosition(cc.p(this.floorBg1.x + this._size.width / 2, 70));
        this.floorBg2.setPosition(cc.p(this.floorBg2.x + this._size.width / 2, 70));

    },
    update: function(dt) {

        //game step
        if (this.gamestep == 'begin') {
            this.moveFloor();
        } else if (this.gamestep == 'now') {

            //bird update
            this.sprite.update();

            //collision detection
            this.collision();

            //move pipe
            this.pipes.forEach(this.bind(function(pipe) {
                pipe.update();
            }, this));

            //update score
            this.updateScore();

            //move floor
            this.moveFloor();

        } else if (this.gamestep == 'soon-over') {
            if (this.sprite.fallDown) {
                if (this.sprite.y - this.sprite.height > 140) {
                    this.sprite.update();
                } else {
                    this.sprite.y = 140 + this.sprite.height / 2;
                    this.sprite.setPosition(cc.p(this.sprite.x, this.sprite.y));
                    this.sprite.setRotation(90);
                    this.gamestep = 'show-over';
                }
            }
            this.overCal();
        } else if (this.gamestep == 'show-over') {
            this.countTips.setPosition(cc.p(0, -640));
            this.showGameInfo(this.bind(function() {}, this));
        }

    },
    onKeyUp: function(e) {

    },
    onKeyDown: function(e) {}
});

var FlappyScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new FlappyLayer();
        layer.init();
        this.addChild(layer);
    }
});