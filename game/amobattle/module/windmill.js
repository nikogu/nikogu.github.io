/**
 * 风车
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-04-02
 */
KISSY.add('module/windmill', function(S, Draw) {

	function Windmill(config) {
		for (var prop in config) {
			if (config.hasOwnProperty(prop)) {
				this[prop] = config[prop];
			}
		}
		this.windmills = [];
		this.bodys = [];
	}
	Windmill.prototype.addWindmill = function(x, y, w, h, config) {
		var windmill = Draw.drawWindmill(x, y, w, h, this.stage, config);
		this.windmills.push(windmill);
		this.bodys.push(windmill.body);
	}
	Windmill.prototype.makeWindmill = function(arr) {
		arr.forEach(bind(function(o) {
			this.addWindmill(o.x, o.y, o.w, o.h, this.stage, o.config);
		},this));
	}
	Windmill.prototype.update = function() {
		this.windmills.forEach(function(windmill) {
			windmill.update();
		});
	}
	Windmill.prototype.clear = function() {
		this.windmills.forEach(bind(function(windmill) {
			this.stage.removeChild(windmill.sprite);
			windmill = null;
		},this));
		this.bodys.forEach(function(body) {
			b2.world.DestroyBody(body);
		});
	}

	return Windmill;

}, {
	requires: ['module/draw']
});