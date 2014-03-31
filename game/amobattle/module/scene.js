/**
 * 场景
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-03-23
 */
KISSY.add('module/scene', function(S, Draw, Gold, Thorn) {

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
			this.stage.removeChild(barrier);
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
		})
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
		this.paths.push(Draw.drawPath(path, this.stage, _config));
	}
	Scene.prototype.clearPath = function() {
		this.paths.forEach(bind(function(path) {
			b2.world.DestroyBody(path.body);
			stage.removeChild(path);
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
		return bodys;
	}
	Scene.prototype.getThronBodys = function() {
		return this.thronManager.getBlockBodys();
	}

	//更新
	Scene.prototype.update = function() {
		this.thronManager.update();
		this.goldManager.update();
	}

	//根据数据创建场景
	Scene.prototype.build = function(data) {
		if ( data.path.length > 0 ) {
			this.makePath(data.path);
		}
		this.makeBarriers(data.barriers);
		this.goldManager.makeGolds(data.golds);
		this.thronManager.makeThorns(data.throns);
	}
	Scene.prototype.clear = function() {
		this.clearPath();
		this.clearBound();
		this.barrierManager.clear();	
		this.thronManager.clear();
		this.goldManager.clear();
	}

	return Scene;

}, {
	requires: ['module/draw', 'module/gold', 'module/thorn']
});