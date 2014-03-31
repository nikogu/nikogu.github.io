/**
 * 画图
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-03-23
 */
KISSY.add('module/draw', function(S) {

	//绘画路径
	function drawPath(path, stage, _config) {
		var config = _config || {},
			strokeColor = config.strokeColor || '#000000',
			width = config.width || 1,
			color = config.color || 'rgba(0,0,0,0)';

		var pathShape = new createjs.Shape(),
			first = path[0],
			midPath = [],
			len = path.length;
		for (var i = 0; i < len - 1; i++) {
			midPath.push({
				x: (path[i + 1].x - path[i].x) / 2 + path[i].x,
				y: (path[i + 1].y - path[i].y) / 2 + path[i].y
			});
		}
		//第一条
		pathShape.graphics.setStrokeStyle(width, "round").beginStroke(strokeColor).beginFill(color).moveTo(first.x, first.y);

		for (var j = 0; j < midPath.length; j++) {
			pathShape.graphics.curveTo(path[j].x, path[j].y, midPath[j].x, midPath[j].y);
		}

		//最后一条
		pathShape.graphics.curveTo(path[len - 2].x, path[len - 2].y, path[len - 1].x, path[len - 1].y);

		//pathShape.graphics.closePath();	
		stage.addChild(pathShape);

		//body
		var body = b2.b2Utils.createPathBound(path, 1);
		pathShape.body = body;

		return pathShape;
	}

	//绘画圆
	function drawCircle(x, y, radius, stage, _config) {
		var config = _config || {},
			color = config.color || '#632f00',
			strokeWidth = (config.strokeWidth === undefined) ? 1 : config.strokeWidth,
			strokeColor = config.strokeColor || '#454545',
			deg = config.deg || 0,
			type = config.type || 'd',
			scale = config.scale || 30,
			radius = radius;

		var o = {};
		o.sprite = new createjs.Shape();
		o.sprite.graphics.setStrokeStyle(strokeWidth, 'round').beginStroke(strokeColor)
			.beginFill(color).drawCircle(0, 0, radius);

		o.sprite.x = x;
		o.sprite.y = y;
		o.sprite.regX = 0;
		o.sprite.regY = 0;
		o.sprite.rotation = deg * 180 / Math.PI;
		stage.addChild(o.sprite);

		o.body = b2.b2Utils.createCircle(x, y, radius, {
			type: type,
			angle: deg
		});

		o.update = function() {
			this.sprite.x = this.body.GetPosition().x * scale;
			this.sprite.y = this.body.GetPosition().y * scale;
			this.sprite.rotation = this.body.GetAngle() * 180 / Math.PI;
		}

		return o;
	}

	//绘画三角形
	function drawTrangle(x, y, w, h, dir, stage, _config) {
		var vec = [];
		if ( dir == 'up' ) {
			vec.push([w/2, 0]);
			vec.push([w, h]);
			vec.push([0, h]);
		} else {
			vec.push([w, 0]);
			vec.push([w/2, h]);
			vec.push([0, 0]);
		}

		return drawPolygon(x, y, vec, stage, _config);
	}

	//绘画多边体
	function drawPolygon(x, y, v, stage, _config) {
		var config = _config || {},
			color = config.color || '#632f00',
			strokeWidth = (config.strokeWidth === undefined) ? 1 : config.strokeWidth,
			strokeColor = config.strokeColor || '#454545',
			deg = config.deg || 0,
			type = config.type || 'd',
			scale = config.scale || 30;

		var o = {};
		o.sprite = new createjs.Shape();
		o.sprite.graphics.setStrokeStyle(strokeWidth, 'round').beginStroke(strokeColor)
			.beginFill(color).moveTo(v[0][0], v[0][1]);

		v.forEach(function(vec, index) {
			if (index !== 0) {
				o.sprite.graphics.lineTo(vec[0], vec[1]);
			}
		});

		o.sprite.graphics.closePath();

		o.sprite.x = x;
		o.sprite.y = y;
		o.sprite.rotation = deg * 180 / Math.PI;
		stage.addChild(o.sprite);

		o.body = b2.b2Utils.createPolygon(x, y, v, {
			type: type,
			angle: deg
		});

		o.update = function() {
			this.sprite.x = this.body.GetPosition().x * scale;
			this.sprite.y = this.body.GetPosition().y * scale;
			this.sprite.rotation = this.body.GetAngle() * 180 / Math.PI;
		}

		return o;

	}

	//绘画长方形
	function drawRect(x, y, w, h, stage, _config) {
		var config = _config || {},
			color = config.color || '#632f00',
			strokeWidth = (config.strokeWidth === undefined) ? 1 : config.strokeWidth,
			strokeColor = config.strokeColor || '#454545',
			deg = config.deg || 0,
			type = config.type || 'd',
			scale = config.scale || 30;

		var x = x + w/2,
			y = y + h/2;

		var o = {};
		o.sprite = new createjs.Shape();
		o.sprite.graphics.setStrokeStyle(strokeWidth, 'round').beginStroke(strokeColor)
			.beginFill(color).drawRect(0, 0, w, h);

		o.sprite.x = x;
		o.sprite.y = y;
		o.sprite.regX = w / 2;
		o.sprite.regY = h / 2;
		o.sprite.rotation = deg * 180 / Math.PI;
		stage.addChild(o.sprite);

		o.body = b2.b2Utils.createRect(x, y, w / 2, h / 2, {
			type: type,
			angle: deg
		});

		o.update = function() {
			this.sprite.x = this.body.GetPosition().x * scale;
			this.sprite.y = this.body.GetPosition().y * scale;
			this.sprite.rotation = this.body.GetAngle() * 180 / Math.PI;
		}

		return o;
	}

	return {
		drawPath: drawPath,
		drawRect: drawRect,
		drawCircle: drawCircle,
		drawPolygon: drawPolygon,
		drawTrangle: drawTrangle
	};

}, {
	requires: []
});