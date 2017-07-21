/**
 * 场景一数据
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-03-29
 */
KISSY.add('data/senceData1', function(S) {

	//壁板障碍
	var barriers = [{
		x: 0,
		y: 700,
		w: 1100,
		h: 5
	}, {
		x: 100,	
		y: 600,
		w: 1100,
		h: 5
	}, {
		x: 0,
		y: 500,
		w: 1100,
		h: 5
	}, {
		x: 850,
		y: 400,
		w: 100,
		h: 5
	}, {
		x: 200,
		y: 400,
		w: 100,
		h: 5
	}, {
		x: 100,
		y: 100,
		w: 5,
		h: 300
	}, {
		x: 100,
		y: 100,
		w: 100,
		h: 5
	}, {
		x: 200,
		y: 200,
		w: 100,
		h: 5
	}];

	//钉刺
	var throns = [{
		x: 100,
		y: 770,
		w: 20,
		h: 30,
		dir: 'up',
		type: 's'
	}, {
		x: 250,
		y: 705,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 300,
		y: 705,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 350,
		y: 705,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 450,
		y: 770,
		w: 20,
		h: 30,
		dir: 'up',
		type: 's'
	}, {
		x: 500,
		y: 770,
		w: 20,
		h: 30,
		dir: 'up',
		type: 's'
	}, {
		x: 550,
		y: 770,
		w: 20,
		h: 30,
		dir: 'up',
		type: 's'
	}, {
		x: 600,
		y: 705,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 650,
		y: 770,
		w: 20,
		h: 30,
		dir: 'up',
		type: 's'
	}, {
		x: 700,
		y: 770,
		w: 20,
		h: 30,
		dir: 'up',
		type: 's'
	}, {
		x: 750,
		y: 770,
		w: 20,
		h: 30,
		dir: 'up',
		type: 's'
	}, {
		x: 850,
		y: 705,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 900,
		y: 705,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 950,
		y: 705,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 1100,
		y: 770,
		w: 20,
		h: 30,
		dir: 'up',
		type: 's'
	}
	//第二层
	, {
		x: 1000,
		y: 670,
		w: 20,
		h: 30,
		dir: 'up',
		type: 's'
	}, {
		x: 900,
		y: 605,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 850,
		y: 605,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 800,
		y: 605,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 750,
		y: 605,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 700,
		y: 670,
		w: 20,
		h: 30,
		dir: 'up',
		type: 's'
	}, {
		x: 650,
		y: 670,
		w: 20,
		h: 30,
		dir: 'up',
		type: 's'
	}, {
		x: 600,
		y: 670,
		w: 20,
		h: 30,
		dir: 'up',
		type: 's'
	}, {
		x: 550,
		y: 605,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 500,
		y: 670,
		w: 20,
		h: 30,
		dir: 'up',
		type: 's'
	}, {
		x: 450,
		y: 605,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 400,
		y: 670,
		w: 20,
		h: 30,
		dir: 'up',
		type: 's'
	}, {
		x: 300,
		y: 670,
		w: 20,
		h: 30,
		dir: 'up',
		type: 's'
	}, {
		x: 200,
		y: 605,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}
	//第四层
	, {
		x: 0,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}, {
		x: 50,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}, {
		x: 100,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}, {
		x: 150,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}, {
		x: 200,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}, {
		x: 250,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}, {
		x: 300,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}, {
		x: 350,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}, {
		x: 400,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}, {
		x: 450,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}, {
		x: 500,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}, {
		x: 550,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}, {
		x: 600,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}, {
		x: 650,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}, {
		x: 700,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}, {
		x: 750,
		y: 460,
		w: 30,
		h: 40,
		dir: 'up',
		type: 's'
	}
	//层
	, {
		x: 150,
		y: 105,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 400,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 440,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 480,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 520,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}, {
		x: 560,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 'd'
	}
	//最顶层
	, {
		x: 1100,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 1050,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 1000,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 950,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 900,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 850,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}, {
		x: 800,
		y: 0,
		w: 20,
		h: 30,
		dir: 'down',
		type: 's'
	}
	]

	//金币
	var golds = [{
		x: 100,
		y: 750
	}, {
		x: 200,
		y: 770
	}, {
		x: 250,
		y: 770
	}, {
		x: 300,
		y: 770
	}, {
		x: 350,
		y: 770
	}, {
		x: 400,
		y: 770
	}, {
		x: 580,
		y: 750
	}, {
		x: 800,
		y: 720
	}, {
		x: 1000,
		y: 720
	}, {
		x: 1150,
		y: 700
	}
	//第三层
	,{
		x: 200,
		y: 580
	},{
		x: 240,
		y: 580
	},{
		x: 280,
		y: 580
	},{
		x: 320,
		y: 580
	},{
		x: 360,
		y: 580
	},{
		x: 400,
		y: 580
	},{
		x: 440,
		y: 580
	},{
		x: 580,
		y: 580
	},{
		x: 620,
		y: 580
	},{
		x: 660,
		y: 580
	},{
		x: 700,
		y: 580
	}
	//第四层
	, {
		x: 800,
		y: 380
	}, {
		x: 840,
		y: 380
	}, {
		x: 880,
		y: 380
	}, {
		x: 500,
		y: 380
	}, {
		x: 540,
		y: 380
	}, {
		x: 580,
		y: 380
	}, {
		x: 240,
		y: 380
	}, {
		x: 240,
		y: 180
	}, {
		x: 150,
		y: 80
	}
	//第四层右边
	, {
		x: 920,
		y: 480
	}, {
		x: 960,
		y: 480
	}, {
		x: 1000,
		y: 480
	}
	//风车右
	, {
		x: 700,
		y: 150	
	}, {
		x: 700,
		y: 200	
	}
	];

	//风车
	var windmill = [
		{
			x: 500, 
			y: 150, 
			w: 100,
			h: 10	
		}
	];

	//跷跷板
	var seesaw = [
		{
			x: 450,
			y: 400,
			w: 200,
			h: 5
		}
	];

	//路径
	var path = [];

	var data = {
		gamePortWidth: 1200,
		gamePortHeight: 800,
		barriers: barriers,
		throns: throns,
		golds: golds,
		path: path,
		windmill: windmill,
		seesaw: seesaw,
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