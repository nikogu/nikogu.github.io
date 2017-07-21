/**
 * 场景三数据
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-04-07
 */
KISSY.add('data/senceData3', function(S) {

	//壁板障碍
	var barriers = [{
		x: 20,
		y: 350,
		w: 100,
		h: 5
	}];

	//钉刺
	var throns = [{
		x: 20,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 50,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 80,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 110,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 140,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 170,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 200,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 230,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 260,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}];
	for (var i = 20; i < 1580; i += 30) {
		throns.push({
			x: i,
			y: 470,
			w: 20,
			h: 30,
			dir: 'up',
			type: 's'
		});
	}

	//金币
	var golds = [{
		x: 50,
		y: 300,
	}, {
		x: 400,
		y: 300,
	}, {
		x: 450,
		y: 300,
	}, {
		x: 500,
		y: 300,
	}, {
		x: 400,
		y: 400,
	}, {
		x: 450,
		y: 400,
	}, {
		x: 500,
		y: 400,
	}, {
		x: 850,
		y: 300,
	}, {
		x: 1100,
		y: 180,
	}, {
		x: 1220,
		y: 80,
	}, {
		x: 1400,
		y: 300,
	}];

	//风车
	var windmill = [];

	//跷跷板
	var seesaw = [{
		x: 400,
		y: 350,
		w: 100,
		h: 5
	}, {
		x: 800,
		y: 350,
		w: 100,
		h: 5
	}, {
		x: 1000,
		y: 200,
		w: 200,
		h: 5
	}, {
		x: 1200,
		y: 100,
		w: 50,
		h: 5
	}, {
		x: 1400,
		y: 200,
		w: 50,
		h: 5
	}];

	//路径
	var path = [];

	var crashBall = [];

	var data = {
		gamePortWidth: 1600,
		gamePortHeight: 500,
		barriers: barriers,
		throns: throns,
		golds: golds,
		path: path,
		windmill: windmill,
		seesaw: seesaw,
		crashBall: crashBall,
		targetScore: golds.length,
		billd: {
			x: 50,
			y: 300
		}
		//targetScore: 1
	};

	return data;

}, {
	requires: []
});