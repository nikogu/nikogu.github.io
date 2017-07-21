/**
 * 动画控制
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-04-03
 */
KISSY.add('module/animation', function(S, Node, Draw) {

	var $ = Node.all;

	//动画组织器
	function Animation() {
		this.animations = {};
	}
	Animation.prototype.active = function(name) {
		for ( var prop in this.animations ) {
			if ( this.animations.hasOwnProperty(prop) ) {
				if ( prop == name ) {
					this.animations[prop]();
				}
			}
		}
	}
	Animation.prototype.add = function(name, func) {
		this.animations[name] = func;
	}

	var anim = new Animation();

	//开场一 动画
	anim.add('level-1', function() {
		$('#level-1').css('top', 0);
		var billd = $('#level-1').all('.billd');
		billd.css('left', '40px');

		var talk = $('#level-1').all('.talk');
		talk.css('opacity', 1);
	});

	//开场二 动画
	anim.add('level-2', function() {
		$('#level-2').css('top', 0);
		var billd = $('#level-2').all('.billd');
		billd.css('left', '40px');

		var talk = $('#level-2').all('.talk');
		talk.css('opacity', 1);
	});

	//开场三 动画
	anim.add('level-3', function() {
		$('#level-3').css('top', 0);
		var billd = $('#level-3').all('.billd');
		billd.css('left', '40px');

		var talk = $('#level-3').all('.talk');
		talk.css('opacity', 1);
	});

	return anim;

}, {
	requires: ['node', 'module/draw']
});