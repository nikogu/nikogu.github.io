/**
 * 场景二数据
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-04-07
 */
KISSY.add('data/senceData2', function(S) {

	//壁板障碍
	var barriers = [{
		x: 0,
		y: 500,
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
		x: 60,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 100,
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
		x: 180,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 220,
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
	}, {
		x: 300,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 340,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 380,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 420,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 460,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}]

	//金币
	var golds = [{
		x: 100,
		y: 700
	}, {
		x: 200,
		y: 600
	}, {
		x: 300,
		y: 550
	}, {
		x: 400,
		y: 500
	}, {
		x: 500,
		y: 550
	}, {
		x: 600,
		y: 480
	}, {
		x: 700,
		y: 450
	}, {
		x: 800,
		y: 400
	}, {
		x: 900,
		y: 350
	}, {
		x: 1000,
		y: 300
	}, {
		x: 1100,
		y: 250
	}, {
		x: 1200,
		y: 150
	}, {
		x: 1300,
		y: 100
	}, {
		x: 1350,
		y: 50
	}, {
		x: 1400,
		y: 100
	}, {
		x: 1500,
		y: 200
	}];

	//风车
	var windmill = [];

	//跷跷板
	var seesaw = [];

	//路径
	var path = [{
		x: 0,
		y: 800
	}, {
		x: 30,
		y: 780
	}, {
		x: 50,
		y: 760
	}, {
		x: 100,
		y: 720
	}, {
		x: 150,
		y: 650
	}, {
		x: 180,
		y: 640
	}, {
		x: 200,
		y: 630
	}, {
		x: 240,
		y: 610
	}, {
		x: 300,
		y: 590
	}, {
		x: 320,
		y: 560
	}, {
		x: 340,
		y: 550
	}, {
		x: 400,
		y: 530
	}, {
		x: 420,
		y: 540
	}, {
		x: 440,
		y: 560
	}, {
		x: 500,
		y: 600
	}, {
		x: 520,
		y: 580
	}, {
		x: 540,
		y: 560
	}, {
		x: 580,
		y: 520
	}, {
		x: 640,
		y: 500
	}, {
		x: 680,
		y: 480
	}, {
		x: 700,
		y: 460
	}, {
		x: 740,
		y: 440
	}, {
		x: 800,
		y: 420
	}, {
		x: 820,
		y: 410
	}, {
		x: 840,
		y: 400
	}, {
		x: 900,
		y: 380
	}, {
		x: 930,
		y: 360
	}, {
		x: 1000,
		y: 320
	}, {
		x: 1100,
		y: 280
	}, {
		x: 1140,
		y: 240
	}, {
		x: 1180,
		y: 220
	}, {
		x: 1200,
		y: 200
	}, {
		x: 1250,
		y: 150
	}, {
		x: 1300,
		y: 120
	}, {
		x: 1360,
		y: 100
	}, {
		x: 1380,
		y: 120
	}, {
		x: 1400,
		y: 140,
	}, {
		x: 1420,
		y: 160
	}, {
		x: 2000,
		y: 800
	}];

	var crashBall = [
		0,
		20,
		100,
		200,
		300,
		400,
		500,
		550,
		600,
		650,
		700,
		800,
		850,
		900,
		950,
		1000,
		1100,
		1200
	];

	var data = {
		gamePortWidth: 1600,
		gamePortHeight: 800,
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
			y: 750
		}
		//targetScore: 1
	};

	return data;

}, {
	requires: []
});