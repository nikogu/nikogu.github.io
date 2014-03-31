/**
 * 金币
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-03-26
 */
KISSY.add('module/gold', function(S) {

	function Gold(config) {
		for (var prop in config) {
			if (config.hasOwnProperty(prop)) {
				this[prop] = config[prop];
			}
		}
		this.golds = [];
	}
	Gold.prototype.make = function(x, y) {
		var gold = new createjs.Shape();
		gold.graphics.setStrokeStyle(1, 'round').beginStroke('#454545').
		beginFill('#ffff00').drawCircle(0, 0, 8);
		gold.raduis = 8;
		gold.gap = 20;
		gold.x = x;
		gold.y = y;
		gold.ax = 0;
		gold.ay = 0;
		gold.vx = 0;
		gold.vy = 0;
		gold.isNeedCollected = false;
		this.stage.addChild(gold);
		this.golds.push(gold);
	}
	Gold.prototype.makeGolds = function(arr) {
		arr.forEach(bind(function(gold) {
			this.make(gold.x, gold.y);
		}, this));
	}
	Gold.prototype.getDis = function(o1, o2) {
		return Math.sqrt((o1.x - o2.x) * (o1.x - o2.x) + (o1.y - o2.y) * (o1.y - o2.y));
	}
	Gold.prototype.update = function() {

		this.updateFunc.call(this);

		this.golds.forEach(bind(function(gold, index) {

			Gold.__bdgd_x = Math.abs(this.billd.body.GetPosition().x * this.scale - gold.x);
			Gold.__bdgd_y = Math.abs(this.billd.body.GetPosition().y * this.scale - gold.y);

			//判断是否相撞
			if (Gold.__bdgd_x <= gold.gap &&
				Gold.__bdgd_y <= gold.gap) {
				if (!gold.isNeedCollected) {
					createjs.Sound.play('m-score');
					gold.isNeedCollected = true;
					this.collectFunc(gold);
				}
			}

			//需要被收集，开始运动
			if (gold.isNeedCollected) {
				gold.ax = (this.target.x - gold.x) * 0.001;
				gold.ay = (this.target.y - gold.y) * 0.001;
			}
			//超过边界，消除
			if (gold.isNeedCollected &&
				(gold.x < b2.b2Utils._offset.x || gold.y + gold.raduis < b2.b2Utils._offset.y)) {
				this.stage.removeChild(gold);
				this.golds.splice(index, 1);
			} else {
				gold.vx += gold.ax;
				gold.vy += gold.ay;
				gold.x += gold.vx;
				gold.y += gold.vy;
			}

		}, this));
	}
	Gold.prototype.clear = function() {
		this.golds.forEach(bind(function(gold) {
			this.stage.removeChild(gold);
		},this));
	}

	return Gold;

}, {
	requires: []
});