/**
 * 刺
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-03-29
 */
KISSY.add('module/thorn', function(S, Draw) {

	function Thorn(config) {
		for (var prop in config) {
			if (config.hasOwnProperty(prop)) {
				this[prop] = config[prop];
			}
		}
		this.x = 0;
		this.y = 0;
		this.scale = 30;
		this.thorns = [];
		this.bodys = [];
		this.fallsThrons = [];
		this.init();
	}
	Thorn.prototype.init = function() {

	}
	Thorn.prototype.addThron = function(x, y, w, h, dir, type) {
		var thorn = Draw.drawTrangle(x, y, w, h, dir, this.stage, {
			color: '#ff2e12',
			type: type
		});
		if ( type != 's' ) {
			thorn.body.SetActive(false);
			this.fallsThrons.push(thorn);
		}
		this.thorns.push(thorn);
		this.bodys.push(thorn.body);
	}
	Thorn.prototype.getBlockBodys = function() {
		return this.bodys;
	}
	Thorn.prototype.makeThorns = function(arr) {
		arr.forEach(bind(function(thorn) {
			this.addThron(thorn.x, thorn.y, thorn.w, thorn.h, thorn.dir, thorn.type);
		}, this));
	}
	Thorn.prototype.update = function() {
		this.fallsThrons.forEach(bind(function(thorn, index) {

			Thorn.__bbx = this.billd.body.GetPosition().x;
			Thorn.__bby = this.billd.body.GetPosition().y;
			Thorn.__tbx = thorn.body.GetPosition().x;
			Thorn.__tby = thorn.body.GetPosition().y;
			Thorn.__byty = (Thorn.__bby-Thorn.__tby)*this.scale;

			if ( Math.abs(Thorn.__bbx-Thorn.__tbx)*this.scale<60 &&
			Thorn.__byty < 100 && 
			Thorn.__byty > 0 ) {
				createjs.Sound.play('m-thron');
				thorn.body.SetActive(true);
				this.fallsThrons.splice(index, 1);
			}

		},this));

		this.thorns.forEach(function(thorn) {
			thorn.update();
		});
	}
	Thorn.prototype.clear = function() {
		this.thorns.forEach(bind(function(thron) {
			this.stage.removeChild(thron.sprite);
			throns = null;
		},this));
		this.bodys.forEach(function(body) {
			b2.world.DestroyBody(body);
		});
	}

	return Thorn;

}, {
	requires: ['module/draw']
});