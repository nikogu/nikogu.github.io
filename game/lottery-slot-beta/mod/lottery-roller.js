/**
 *
 * 滚轮
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @date 2014-07-19
 *
 */

KISSY.add(function(S, require) {

	var Base = require('base'),
		$ = require('node').all,
		Timeline = require('mod/timeline'),
		Easing = require('mod/lottery-effect');

	var Roller = Base.extend({
		initializer: function() {
			this.set('height', this.get('width') / 4);

			this.set('radius', Math.floor(this.get('height') * 18 / 2 / Math.PI));

			this.create();

			this.tm = Timeline.use('lottery-roller').init(1000 / 60);


			this.swing = function(t) {
				return 0.5 - (cos(t * PI) / 2);
			};
			//cubic-bezier(0.57, -0.03, 0.57, 1.1)
			this.elasticOut = function(t) {
				var p = 0.4,
					s = p / 4;
				if (t === 0 || t === 1) {
					return t;
				}
				return pow(2, -10 * t) * sin((t - s) * (2 * PI) / p) + 1;
			}

			this.effect = Easing.cubicBezier(0.57, -0.03, 0.57, 1.1);

			//this.move();	
		},
		move: function() {
			var self = this;

			var node = self.get('node');
			self.deg = 0;
			setInterval(function() {
				node.css('transform', 'rotateX(' + (self.deg += 5) + 'deg)');
			}, 1000 / 60);
		},
		create: function() {
			var root = $('<div class="roller"></div>'),
				chip = '';

			var leftCircle = $('<div class="left-circle"></div>'),
				rightCircle = $('<div class="right-circle"></div>');

			leftCircle.css({
				width: this.get('radius') * 2,
				height: this.get('radius') * 2,
				transform: 'rotateY(90deg) translateZ(' + (this.get('width') / 2) + 'px)',
				top: '-' + (this.get('radius') - this.get('height') / 2),
				marginLeft: '-' + this.get('radius') + 'px'
			});
			rightCircle.css({
				width: this.get('radius') * 2,
				height: this.get('radius') * 2,
				transform: 'rotateY(90deg) translateZ(-' + (this.get('width') / 2) + 'px)',
				top: '-' + (this.get('radius') - this.get('height') / 2),
				marginLeft: '-' + this.get('radius') + 'px'
			});

			root.css({
				width: this.get('width'),
				height: this.get('height')
			});

			root.append(leftCircle);

			for (var i = 0; i < 18; i++) {

				chip = $('<div class="chip"></div>');
				chip.css({
					backgroundImage: 'url("' + this.get('pic') + '")',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center -' + (i * this.get('height')) + 'px',
					transform: 'rotateX(' + (i * 20) + 'deg) translateZ(' + this.get('radius') + 'px)',
					width: this.get('width'),
					height: this.get('height')
				})

				root.append(chip);
			}

			root.append(rightCircle);

			this.set('node', root);
			this.get('slot').append(root);
		},
		run: function(num, callback) {
			var self = this;

			var toDeg = num * 40 + 3600,
				total = Math.random() * 5000 + 5000;

			self.tm.createTask({
				duration: total,
				onTimeStart: function() {

				},
				onTimeUpdate: function(t) {
					self.get('node').css('transform', 'rotateX(' + (self.effect(t / total) * toDeg + self.get('deg')) + 'deg)');
				},
				onTimeEnd: function() {
					self.get('node').css('transform', 'rotateX(' + (toDeg + self.get('deg')) + 'deg)');
					self.set('deg', (toDeg + self.get('deg') - 3600));
					if (callback) {
						callback();
					}
				}
			});

		}
	}, {
		ATTRS: {
			pic: {
				value: ''
			},
			width: {
				value: 100
			},
			height: {
				value: 0
			},
			slot: {
				value: ''
			},
			node: {
				value: ''
			},
			radius: {
				value: 0
			},
			deg: {
				value: 0
			}
		}
	});

	return Roller;

});