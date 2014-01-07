/**
* 3D Graph lib depend on <<animation HTML5>>
*
* @version 0.0.1
* @author niko<nikolikegirl@gmail.com>
* @data 2014-01-07
*/
function Triangle(a, b, c, color, alpha) {
	this.pointA = a;
	this.pointB = b;
	this.pointC = c;
	this.color = color || '#ffffff';
	this.alpha = (alpha === undefined) ? 1 : alpha;
	this.lineWidth = 1;
}
Triangle.prototype.draw = function(ctx) {
	if ( this.isBackface() ) {
		return;
	}
	ctx.save();
	ctx.lineWidth = this.lineWidth;
	ctx.strokeStyle = 'rgba(' + this.parseColor(this.color) + '' + this.alpha + ')';
	ctx.fillStyle = 'rgba(' + this.parseColor(this.color) + '' + this.alpha + ')';
	ctx.beginPath();
	ctx.moveTo(this.pointA.getScreenX(), this.pointA.getScreenY());
	ctx.lineTo(this.pointB.getScreenX(), this.pointB.getScreenY());
	ctx.lineTo(this.pointC.getScreenX(), this.pointC.getScreenY());
	ctx.closePath();
	ctx.fill();
	if (this.lineWidth > 0) {
		ctx.stroke();
	}
	ctx.restore();
}
Triangle.prototype.getDepth = function() {
	return Math.min(this.pointA.z, this.pointB.z, this.pointC.z);
}
Triangle.prototype.isBackface = function() {
	var cax = this.pointC.getScreenX() - this.pointA.getScreenX(),
		cay = this.pointC.getScreenY() - this.pointA.getScreenY(),
		bcx = this.pointB.getScreenX() - this.pointC.getScreenX(),
		bcy = this.pointB.getScreenY() - this.pointC.getScreenY();

	return (cax * bcy < cay * bcx);
}
Triangle.prototype.parseColor = function(color) {

	var color = color.replace(/\s/ig, '');

	if (/#/ig.test(color)) {

		var a = parseInt(color.substr(1, 2), 16),
			b = parseInt(color.substr(3, 2), 16),
			y = parseInt(color.substr(5, 2), 16);

		return a + ',' + b + ',' + y + ',';

	} else if (/rgba/ig.test(color)) {

		var r = color.replace('rgba(', '');
		r = r.replace(/,\d?\.?\d\)/ig, ',');
		return r;

	} else if (/rgb/ig.test(color)) {

		var r = color.replace('rgb(', '');
		r = r.replace(')', ',');
		return r;

	} else {

		return '0,0,0,';

	}
}

function Graph(vpX, vpY, color) {
	this.points = [];
	this.triangles = [];
	this.index = 0;
	this.t_index = 0;
	this.vpX = vpX;
	this.vpY = vpY;
	this.color = color || '#ffffff';
	this.cX = 0;
	this.cY = 0;
	this.cZ = 0;
	this.alpha = 1;
}
Graph.prototype.setCenter = function(x, y, z) {
	this.cX = x;
	this.cY = y;
	this.cZ = z;
	this.points.forEach(function(point) {
		point.setCenter(x, y, z);
	});
}
Graph.prototype.addPoint = function(x, y, z) {
	var point = new Point(x, y, z);
	this.points[this.index++] = point;
	point.setCenter(this.cX, this.cY, this.cZ);
	point.setVanishingPoint(this.vpX, this.vpY);
}
Graph.prototype.addTriangle = function(a, b, c) {
	this.triangles[this.t_index++] = new Triangle(this.points[a], this.points[b], this.points[c], this.color, this.alpha);
}
Graph.prototype.rotate = function(angleY, angleX, angleZ) {
	this.points.forEach(function(point, index) {
		point.rotate(angleY, angleX, angleZ);
	});
}
Graph.prototype.drawT = function(ctx) {
	var that = this;
	that.triangles.sort(function(a, b) {
		return (b.getDepth() - a.getDepth());
	})
	that.triangles.forEach(function(triangle, index) {
		triangle.draw(ctx);
	});
}
Graph.prototype.draw = function(ctx, type) {
	var that = this;
	ctx.save();
	if (type == 'fill') {
		ctx.fillStyle = 'rgba(' + this.parseColor(this.color) + '' + this.alpha + ')';
	}
	ctx.strokeStyle = 'rgba(' + this.parseColor(this.color) + '' + this.alpha + ')';
	ctx.beginPath();
	ctx.moveTo(that.points[0].getScreenX(), that.points[0].getScreenY());
	that.points.forEach(function(point, index) {
		if (index !== 0) {
			ctx.lineTo(point.getScreenX(), point.getScreenY());
		}
	});
	ctx.closePath();
	ctx.stroke();
	if (type == 'fill') {
		ctx.fill();
	}
	ctx.restore();
}
Graph.prototype.parseColor = function(color) {

	var color = color.replace(/\s/ig, '');

	if (/#/ig.test(color)) {

		var a = parseInt(color.substr(1, 2), 16),
			b = parseInt(color.substr(3, 2), 16),
			y = parseInt(color.substr(5, 2), 16);

		return a + ',' + b + ',' + y + ',';

	} else if (/rgba/ig.test(color)) {

		var r = color.replace('rgba(', '');
		r = r.replace(/,\d?\.?\d\)/ig, ',');
		return r;

	} else if (/rgb/ig.test(color)) {

		var r = color.replace('rgb(', '');
		r = r.replace(')', ',');
		return r;

	} else {

		return '0,0,0,';

	}
}