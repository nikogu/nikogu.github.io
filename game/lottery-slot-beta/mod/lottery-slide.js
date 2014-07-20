/**
 *
 * 滚轮2d
 * 很多尺寸固定，方便处理
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @date 2014-07-20
 *
 */
KISSY.add(function(S, require) {

	var $ = require('node').all,
		Base = require('base'),
		Timeline = require('mod/timeline');

	var Slide = Base.extend({
		initializer: function() {
			this.tm = Timeline.use('lottery-slide-'+this.get('id')).init(1000 / 60);
			this.create();
		},
		create: function() {

			var chip,
				root = $('<div class="slide"></div>'),
				listA = $('<div class="list list-a">'),
				listB = $('<div class="list list-b">');

			for (var i = 0; i < 18; i++) {

				chip = $('<div class="clip"></div>');
				chip.css({
					backgroundImage: 'url("' + this.get('pic') + '")',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center -' + (i * this.get('height')) + 'px'
				})

				listA.append(chip.clone(true));
				listB.append(chip);

			}
			root.append(listA).append(listB);
			this.set('listA', listA);
			this.set('listB', listB);
			this.get('slot').all('.bg').append(root);
		},
		run: function(num, callback) {

			var self = this;
			
			self.tm.clearTasks();
			self.tm.start();

			var top = -num * 100 + 100,
				listA = self.get('listA'),
				listB = self.get('listB'),
				topA = 0,
				topB = 0;

			var vy = 0,
				_vy = Math.random()*10,
				time = 5000,
				ay = 0;

			self.tm.createTask({
				duration: -1,
				onTimeStart: function() {
					topA = parseInt(listA.css('top'));
					topB = parseInt(listB.css('top'));
				},
				onTimeUpdate: function(t) {
					if (t > time) {
						ay = (top - topA) * 0.002;
						vy += ay;
						vy *= 0.91;
						topA += vy;
						topB += vy;
						if ( Math.abs(top - topA)<2 && Math.abs(vy)<1 ) {

							self.tm.stop();

							listA.css('top', top + 'px');

							//呵呵
							if ( num == 8 ) {
								listB.css('top', (top + 900) +'px');
							}

							if ( callback ) {
								callback();
							}
							return;
						}
					} else {
						vy = t / 5000 * 15 + _vy;
						topA += vy;
						topB += vy;
					}


					if (topA >= 900) {
						topA = -900;
					}
					if (topB >= 900) {
						topB = -900;
					}

					listA.css('top', topA + 'px');
					listB.css('top', topB + 'px');
				},
				onTimeEnd: function() {
				}
			});

		}
	}, {
		ATTRS: {
			id: {
				value: 0
			},
			slot: {
				value: ''
			},
			pic: {
				value: ''
			},
			height: {
				value: 50
			},
			listA: {
				value: ''
			},
			listB: {
				value: ''
			}
		}
	});

	return Slide;

});