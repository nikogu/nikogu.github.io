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
		Timeline = require('mod/timeline');

	var Roller = Base.extend({
		initializer: function() {
			this.set('height', this.get('width') / 4);

			this.set('radius', Math.floor(this.get('height') * 18 / 2 / Math.PI));

			this.create();

			this.tm = Timeline.use('lottery-roller').init(1000 / 60);

			//两个缓动效果函数，先放着
			var PI = Math.PI,
				sin = Math.sin,
				pow = Math.pow,
				BACK_CONST = 1.70158;

			this.elasticBoth = function(t) {
				var p = 0.45,
					s = p / 4;
				if (t === 0 || (t *= 2) === 2) {
					return t;
				}

				if (t < 1) {
					return -0.5 * (pow(2, 10 * (t -= 1)) *
						sin((t - s) * (2 * PI) / p));
				}
				return pow(2, -10 * (t -= 1)) *
					sin((t - s) * (2 * PI) / p) * 0.5 + 1;
			};

			this.backBoth = function(t) {
				var s = BACK_CONST;
				var m = (s *= 1.525) + 1;

				if ((t *= 2) < 1) {
					return 0.5 * (t * t * (m * t - s));
				}
				return 0.5 * ((t -= 2) * t * (m * t + s) + 2);

			};

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
				total = Math.random() * 10000 + 10000;

			self.tm.createTask({
				duration: total,
				onTimeStart: function() {

				},
				onTimeUpdate: function(t) {
					self.get('node').css('transform', 'rotateX(' + (self.elasticBoth(t / total) * toDeg + self.get('deg')) + 'deg)');
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