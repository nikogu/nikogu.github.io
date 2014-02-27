var AnimationMaker = (function() {
	var animations = [];
	var count = 0;
	var animType = {};

	function create(target, o, type, during) {
		var animation = new AnimationSingle({
			id: count++,
			target: target,
			o: o,
			type: type,
			during: during
		});
		animations.push(animation);
		return animation;
	};

	function addAnimType(name, callback) {
		animType[name] = callback;
	}

	function getAnimType(name, percent) {
		return animType[name](percent);
	}
	//default type
	addAnimType('easein', function(percent) {
		return Math.pow(percent, 2);
	});
	addAnimType('easeout', function(percent) {
		return 1 - Math.pow(1 - percent, 2);
	});
	addAnimType('easeinout', function(percent) {
		return percent - Math.sin(percent * 2 * Math.PI) / (2 * Math.PI);
	});
	addAnimType('elastic', function(percent) {
		return ((1 - Math.cos(percent * Math.PI * 4)) * (1 - percent)) + percent;
	});

	return {
		create: create,
		addAnimType: addAnimType,
		getAnimType: getAnimType
	}
})();

function AnimationSingle(conf) {
	this.id = conf.id || 0;
	this.target = conf.target;
	this.o = conf.o;
	this.during = conf.during;
	this.type = conf.type;
	this.props = {};
	this.otime = undefined;
	this.ntime = 0;
	this.percent = 0;
	this.overtime = 0;
	this.stop = false;
	this.typeCal = {};

	for (var prop in this.o) {
		if (this.o.hasOwnProperty(prop)) {
			this.addProp(prop, this.target[prop], this.o[prop]);
		}
	}
}

AnimationSingle.prototype.addProp = function(prop, from, to) {
	this.props[prop] = {
		from: from,
		to: to
	}
}
AnimationSingle.prototype.getProp = function(prop) {
	if (this.stop) {
		return this.props[prop].to;
	}
	return this.props[prop].from + (this.props[prop].to - this.props[prop].from) * AnimationMaker.getAnimType(this.type, this.percent);
}

AnimationSingle.prototype.run = function(callback) {
	if (this.stop) {
		if (callback) {
			callback();
		}
		return;
	}
	this.ntime = new Date().getTime();
	if (!this.otime) {
		this.otime = this.ntime;
	}
	this.overtime = this.ntime - this.otime;
	this.percent = this.overtime / this.during;
	if (this.overtime >= this.during) {
		this.stop = true;
	}
	for (var prop in this.props) {
		this.target[prop] = this.getProp(prop);
	}
	if (callback) {
		callback();
	}
}