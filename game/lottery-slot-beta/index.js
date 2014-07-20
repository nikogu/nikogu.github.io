/**
 *
 * lottery-slot
 * beta 0.0.1
 * 很多细节未优化
 * 由于计算的麻烦，这里尺寸直接定死，但是理论上是可变的
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @date 2014-07-19
 *
 */

KISSY.add('lottery-slot', function(S, require) {

	var supports = (function() {
		var div = document.createElement('div'),
			vendors = 'Webkit Moz O ms'.split(' '),
			len = vendors.length;
		return function(prop) {
			var dstyle = div.style;
			if (prop in dstyle) return true;
			prop = prop.replace(/^[a-z]/, function(val) {
				return val.toUpperCase();
			});
			while (len--) {
				if (vendors[len] + prop in dstyle) {
					return true;
				}
			}
			return false;
		};
	})();

	var Roller = require('mod/lottery-roller'),
		Slide = require('mod/lottery-slide'),
		Base = require('base'),
		$ = require('node').all;

	var Slot = Base.extend({
		initializer: function() {

			//切换 3d 2d 开关
			if (supports('transform')) {
				this.get('container').all('.wrap-3d').show();
				this.createWheel();
				this.moveWheel();
			} else {
				this.createSlide();
				this.moveSlide();
				this.get('container').all('.wrap-2d').show();
			}

		},
		createSlide: function() {
			//简单的2D适配，尺寸固定了
			var slide;
			for (var i = this.get('rollersNum'); i--;) {
				slide = new Slide({
					slot: this.get('container'),
					pic: this.get('pic'),
					id: i
				});
				this.get('slides').push(slide);
			}
		},
		createWheel: function() {
			var roller;
			for (var i = this.get('rollersNum'); i--;) {
				roller = new Roller({
					slot: this.get('container'),
					pic: this.get('pic'),
					width: this.get('width')
				});
				this.get('rollers').push(roller);
			}
		},
		moveSlide: function() {
			var self = this;

			var container = self.get('container');

			//点击交互
			var isClick = false,
				count = 3;

			container.on('click', function() {
				if (isClick) {
					return;
				}
				count = 3;
				isClick = true;

				S.each(self.get('slides'), function(item) {
					item.run(Math.floor(Math.random() * 9), function() {
						count--;
						if (count <= 0) {
							isClick = false;
						}
					});
				});
			});
		},
		moveWheel: function() {
			var self = this;

			var container = self.get('container');

			var cx = container.offset().left + container.width() / 2,
				cy = container.offset().top + container.height() / 2;

			var dx = 0,
				dy = 0,
				radio = 0.1;

			$(document).on('mousemove', function(e) {

				dx = (e.clientX - cx) * radio;
				dy = (e.clientY - cy) * radio;

				container.css('transform', 'perspective(800px) rotateX(' + dy + 'deg) rotateY(' + dx + 'deg)');

			});

			//点击交互
			var isClick = false,
				count = 3;
			container.on('click', function() {
				if (isClick) {
					return;
				}
				count = 3;
				isClick = true;

				S.each(self.get('rollers'), function(item) {
					item.run(Math.floor(Math.random() * 9), function() {
						count--;
						if (count <= 0) {
							isClick = false;
						}
					});
				});
			});

		}
	}, {
		ATTRS: {
			pic: {
				value: ''
			},
			container: {
				value: ''
			},
			rollersNum: {
				value: 3
			},
			rollers: {
				value: []
			},
			slides: {
				value: []
			},
			width: {
				value: 100
			}
		}
	});

	return Slot;

});