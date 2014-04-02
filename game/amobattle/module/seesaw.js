/**
 * 跷跷板
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-04-02
 */
KISSY.add('module/seesaw', function(S, Draw) {

	function Seesaw(config) {
		for (var prop in config) {
			if (config.hasOwnProperty(prop)) {
				this[prop] = config[prop];
			}
		}
		this.seesaws = [];
		this.bodys = [];
	}
	Seesaw.prototype.addSeesaw = function(x, y, w, h, config) {
		var seesaw = Draw.drawSeesaw(x, y, w, h, this.stage, config);
		this.seesaws.push(seesaw);
		this.bodys.push(seesaw.body);
	}
	Seesaw.prototype.makeSeesaw = function(arr) {
		arr.forEach(bind(function(o) {
			this.addSeesaw(o.x, o.y, o.w, o.h, this.stage, o.config);
		},this));
	}
	Seesaw.prototype.update = function() {
		this.seesaws.forEach(function(seesaw) {
			seesaw.update();
		});
	}
	Seesaw.prototype.clear = function() {
		this.seesaws.forEach(bind(function(seesaw) {
			this.stage.removeChild(seesaw.sprite);
			seesaw = null;
		},this));
		this.bodys.forEach(function(body) {
			b2.world.DestroyBody(body);
		});
	}

	return Seesaw;

}, {
	requires: ['module/draw']
});