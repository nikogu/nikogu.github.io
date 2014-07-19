/**
 *
 * lottery-slot
 * 由于计算的麻烦，这里尺寸直接定死，但是理论上是可变的
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @date 2014-07-19
 *
 */

KISSY.add('lottery-slot', function(S, require) {

	var Roller = require('mod/lottery-roller'),
		Base = require('base'),
		$ = require('node').all;

	var Slot = Base.extend({
		initializer: function() {
			this.createWheel();

			this.move();
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
		move: function() {
			var container = this.get('container');

			var cx = container.offset().left + container.width() / 2,
				cy = container.offset().top + container.height() / 2;

			var dx = 0,
				dy = 0;

			var self = this,
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
			width: {
				value: 100
			}
		}
	});

	return Slot;

});