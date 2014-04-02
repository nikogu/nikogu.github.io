/**
 * Billd
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-03-23
 */
KISSY.add('module/billd', function(S) {

	//billd
	function Billd(x, y, stage) {
		this.x = x || 0;
		this.y = y || 0;
		this.ox = this.x;
		this.oy = this.y;
		this.vx = 200 / SCALE;
		this.vy = -220 / SCALE;
		this.ax = 20 / SCALE;
		this.stage = stage;
		this.spriteData = {};
		this.sprite = {};
		this.body = {};
		this.action = 'static';
		this.status = 'static';
		this.statusLeft = false;
		this.statusRight = false;
		this.jumping = true;
		this.dead = false;
		this.stop = false;
		//this.init();
	}
	Billd.prototype.show = function() {
		this.init();
	}
	Billd.prototype.init = function() {
		this.spriteData = new createjs.SpriteSheet({
			"images": [loader.getResult("billd")],
			"frames": {
				"regX": 11,
				"height": 22,
				"count": 30,
				"regY": 11,
				"width": 22
			},
			// define two animations, run (loops, 1.5x speed) and jump (returns to run):
			"animations": {
				"runLeft": [4, 7, "runLeft", 0.2],
				"runRight": [0, 3, "runRight", 0.2],
				"jump": [8, 18, "jump", 0.2],
				"static": [19, 23, "static", 0.2],
				'dead': [24, 29, "dead", 0.2]
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

		if ( this.stop ) {
			this.body.SetAwake(false);
			return;
		}

		//如果...billd挂了
		if (this.dead) {
			if (this.action != 'dead') {
				this.action = 'dead';
				this.sprite.gotoAndPlay('dead');
			}
			this.sprite.x = this.body.GetPosition().x * SCALE;
			this.sprite.y = this.body.GetPosition().y * SCALE;
			this.sprite.rotation = this.body.GetAngle() * 180/Math.PI;
			return;
		}

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

		if (this.statusLeft) {
			this.body.SetAwake(true);
			this.body.SetLinearVelocity(new b2.b2Vec2(-this.vx, this.body.GetLinearVelocity().y));
		} else if (this.statusRight) {
			this.body.SetAwake(true);
			this.body.SetLinearVelocity(new b2.b2Vec2(this.vx, this.body.GetLinearVelocity().y));
		}

		this.sprite.x = this.body.GetPosition().x * SCALE;
		this.sprite.y = this.body.GetPosition().y * SCALE;
	}
	Billd.prototype.go = function() {
		window.addEventListener('keydown', bind(function(e) {
			if (this.dead || this.stop) {
				return;
			}
			switch (e.keyCode) {
				//左
				case 37:
					this.statusLeft = true;
					this.action = 'left';
					//this.body.SetAwake(true);
					//this.body.SetLinearVelocity(new b2.b2Vec2(-this.vx, this.body.GetLinearVelocity().y));
					// if (this.body.GetLinearVelocity().x >= -this.vx) {
					// 	this.body.ApplyImpulse(new b2.b2Vec2(-this.ax, 0), this.body.GetWorldCenter());
					// }
					break;
					//右
				case 39:
					this.statusRight = true;
					this.action = 'right';
					//this.body.SetAwake(true);
					//this.body.SetLinearVelocity(new b2.b2Vec2(this.vx, this.body.GetLinearVelocity().y));
					// if (this.body.GetLinearVelocity().x <= this.vx) {
					// 	this.body.ApplyImpulse(new b2.b2Vec2(this.ax, 0), this.body.GetWorldCenter());
					// }
					break;
					//上
				case 38:
					if (!this.jumping) {
						createjs.Sound.play('m-jump');
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
			if (this.dead || this.stop) {
				return;
			}
			switch (e.keyCode) {
				//左
				case 37:
					this.statusLeft = false;
					this.action = 'static';
					this.body.SetLinearVelocity(new b2.b2Vec2(0, this.body.GetLinearVelocity().y));
					this.body.SetAngularVelocity(0);
					break;
					//右
				case 39:
					this.statusRight = false;
					this.action = 'static';
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
	Billd.prototype.clear = function() {
		this.stage.removeChild(this.sprite);
		b2.world.DestroyBody(this.body);
	}

	return Billd;

}, {
	requires: []
});