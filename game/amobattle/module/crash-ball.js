/**
 * 滚球
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-04-07
 */
KISSY.add('module/crash-ball', function(S, Draw) {

	function Ball(config) {
		for (var prop in config) {
			if (config.hasOwnProperty(prop)) {
				this[prop] = config[prop];
			}
		}
		this.x = 0;
		this.y = 0;
		this.scale = 30;
		this.balls = [];
		this.bodys = [];
		this.pos = [];
		this.init();
	}
	Ball.prototype.init = function() {

	}
	Ball.prototype.addBall = function(x, y, radius, color) {
		var ball = Draw.drawCircle(x, y, radius, this.stage, {
			color: color,
			dir: true
		});
		ball.radius = radius;
		this.balls.push(ball);
		this.bodys.push(ball.body);
	}
	Ball.prototype.getBlockBodys = function() {
		return this.bodys;
	}
	Ball.prototype.addPos = function(pos) {
		this.pos = pos.concat();
	}
	Ball.prototype.makeBall = function() {
		this.addBall(1300, 50, b2.b2Utils.random(10, 30),
			'rgba(' + b2.b2Utils.random(1, 254) + ',' + b2.b2Utils.random(1, 254) + ',' + b2.b2Utils.random(1, 254) + ', 0.8)');
	}
	Ball.prototype.update = function() {

		Ball._bposx = this.billd.body.GetPosition().x * this.scale;
		Ball._bposy = this.billd.body.GetPosition().y * this.scale;
		this.pos.forEach(bind(function(p, index) {
			if ( Ball._bposx >= p ) {
				this.makeBall();
				this.pos.splice(index, 1);
			}
		}, this));

		this.balls.forEach(bind(function(ball) {
			//是否碰撞
			if ( b2.b2Utils.getDis(Ball._bposx, Ball._bposy,
			ball.body.GetPosition().x*this.scale, ball.body.GetPosition().y*this.scale) <= ball.radius + 12 ) {
				this.ballCrashFunc();
			}
			ball.update();
		}, this));
	}
	Ball.prototype.clear = function() {
		this.balls.forEach(bind(function(ball) {
			this.stage.removeChild(ball.sprite);
			ball = null;
		}, this));
		this.bodys.forEach(function(body) {
			b2.world.DestroyBody(body);
		});
	}

	return Ball;

}, {
	requires: ['module/draw']
});