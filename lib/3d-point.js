/**
* 3D Point lib depend on <<animation HTML5>>
*
* @version 0.0.1
* @author niko<nikolikegirl@gmail.com>
* @data 2014-01-07
*/
function Point(x, y, z) {
	this.x = ( x === undefined) ? 0 : x;
	this.y = ( y === undefined) ? 0 : y;
	this.z = ( z === undefined) ? 0 : z;

	this.xpos = this.x;
	this.ypos = this.y;
	this.zpos = this.z;

	this.fl = 250;
	this.vpX = 0;
	this.vpY = 0;
	this.cX = 0;
	this.cY = 0;
	this.cZ = 0;
}

Point.prototype.setVanishingPoint = function(vpX, vpY) {
	this.vpX = vpX;
	this.vpY = vpY;
}

Point.prototype.setCenter = function(x, y, z) {
	this.cX = x;
	this.cY = y;
	this.cZ = z;
}

Point.prototype.rotate = function(angle_xz, angle_yz, angle_xy) {

	var dist_xz = Math.sqrt(this.x*this.x+this.z*this.z),
		deg_xz = Math.atan2(this.z, this.x);

	var cos_xz = Math.cos(angle_xz + deg_xz),
		sin_xz = Math.sin(angle_xz + deg_xz),
		x1 = cos_xz * dist_xz,
		z1 = sin_xz * dist_xz;

	var dist_yz = Math.sqrt(this.y*this.y+z1*z1),
		deg_yz = Math.atan2(this.y, z1);

	var cos_yz = Math.cos(angle_yz + deg_yz),
		sin_yz = Math.sin(angle_yz + deg_yz),
		z2 = cos_yz * dist_yz,
		y1 = sin_yz * dist_yz;

	this.xpos = x1;
	this.ypos = y1;
	this.zpos = z2;

}

Point.prototype.getScreenX = function() {
	var scale = this.fl / ( this.fl + this.zpos + this.cZ);
	return this.vpX + ( this.cX + this.xpos ) * scale;
}

Point.prototype.getScreenY = function() {
	var scale = this.fl / ( this.fl + this.zpos + this.cZ);
	return this.vpY + ( this.cY + this.ypos ) * scale;
}
