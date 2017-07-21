/**
 * 场景
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-03-23
 */
KISSY.add('module/scene', function(S, Draw, Gold, Thorn, Windmill, Seesaw, CrashBall) {

	//Barrier
	function Barrier(stage) {
		this.stage = stage;
		this.barriers = [];
		this.bodys = [];
	}
	Barrier.prototype.create = function(x, y, w, h) {
		var floor = Draw.drawRect(x, y, w, h, this.stage, {
			type: 's'
		});
		this.barriers.push(floor);
		this.bodys.push(floor.body);
	}
	Barrier.prototype.clear = function() {
		this.barriers.forEach(bind(function(barrier) {
			this.stage.removeChild(barrier.sprite);
		}, this));
		this.bodys.forEach(function(body) {
			b2.world.DestroyBody(body);
		});
	}

	//场景管理
	//统一管理障碍，金币，钉刺
	function Scene(config) {

		for (var prop in config) {
			if (config.hasOwnProperty(prop)) {
				this[prop] = config[prop];
			}
		}

		if ( !this.scale ) {
			this.scale = 30;
		}

		this.paths = [];
		this.bound = {};

		this.barrierManager = new Barrier(this.stage);

		this.goldManager = new Gold({
			stage: this.stage,
			billd: this.billd,
			scale: this.scale,
			collectFunc: this.goldCollectFunc,
			updateFunc: this.goldUpdateFunc
		});

		this.thronManager = new Thorn({
			stage: this.stage,
			billd: this.billd,
			scale: this.scale
		});

		this.windmillManager = new Windmill({
			stage: this.stage,
			scale: this.scale
		});

		this.seesawManager = new Seesaw({
			stage: this.stage,
			scale: this.scale
		});

		this.ballManager = new CrashBall({
			stage: this.stage,
			billd: this.billd,
			scale: this.scale,
			ballCrashFunc: this.ballCrashFunc
		});
	}
	Scene.prototype.addBound = function(_w, _h, _ply, _config) {
		this.bound = new createjs.Shape();
		this.bound.graphics.setStrokeStyle(_ply, 'round').beginStroke('#696969').
		moveTo(0, 0).lineTo(_w, 0).lineTo(_w, _h).lineTo(0, _h).closePath();
		this.bound.body = b2.b2Utils.createBound(_w, _h, _ply, _config);
		this.stage.addChild(this.bound);
	}
	Scene.prototype.clearBound = function() {
		b2.world.DestroyBody(this.bound.body);
		this.stage.removeChild(this.bound);
	}
	Scene.prototype.makePath = function(path, _config) {
		if ( path.length > 0 ) {
			this.paths.push(Draw.drawPath(path, this.stage, _config));
		}
	}
	Scene.prototype.clearPath = function() {
		this.paths.forEach(bind(function(path) {
			b2.world.DestroyBody(path.body);
			this.stage.removeChild(path);
		},this));
	}
	Scene.prototype.makeBarriers = function(arr) {
		arr.forEach(bind(function(barrier) {
			this.barrierManager.create(barrier.x, barrier.y, barrier.w, barrier.h);
		}, this));
	}

	//获取需要阻拦的物理body
	Scene.prototype.getBlockBodys = function() {
		var bodys = [];
		//add barrier body
		bodys = bodys.concat(this.barrierManager.bodys);
		//add path body
		this.paths.forEach(function(path) {
			bodys.push(path.body);
		});
		//add bound body
		bodys.push(this.bound.body);
		//add windmill body
		bodys = bodys.concat(this.windmillManager.bodys);
		//add seesaw body
		bodys = bodys.concat(this.seesawManager.bodys);
		return bodys;
	}
	Scene.prototype.getThronBodys = function() {
		return this.thronManager.getBlockBodys();
	}

	//更新
	Scene.prototype.update = function() {
		this.thronManager.update();
		this.goldManager.update();
		this.windmillManager.update();
		this.seesawManager.update();
		this.ballManager.update();
	}

	//根据数据创建场景
	Scene.prototype.build = function(data) {
		if ( !data.path ) {
			data.path = [];
		}
		if ( !data.barriers ) {
			data.barriers = [];
		}
		if ( !data.golds ) {
			data.golds = [];
		}
		if ( !data.throns ) {
			data.throns = [];
		}
		if ( !data.windmill ) {
			data.windmill = [];
		}
		if ( !data.seesaw ) {
			data.seesaw = [];
		}
		if ( !data.crashBall ) {
			data.crashBall = [];
		}

		this.makePath(data.path, {
			color: '#00c13f'
		});
		this.makeBarriers(data.barriers);
		this.goldManager.makeGolds(data.golds);
		this.thronManager.makeThorns(data.throns);
		this.windmillManager.makeWindmill(data.windmill);
		this.seesawManager.makeSeesaw(data.seesaw);
		this.ballManager.addPos(data.crashBall);
	}
	Scene.prototype.clear = function() {
		this.clearPath();
		this.clearBound();
		this.barrierManager.clear();	
		this.thronManager.clear();
		this.windmillManager.clear();
		this.goldManager.clear();
		this.seesawManager.clear();
		this.ballManager.clear();
	}

	return Scene;

}, {
	requires: ['module/draw', 'module/gold', 'module/thorn', 'module/windmill', 'module/seesaw', 'module/crash-ball']
});