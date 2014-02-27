/**
* 两个管子一组
*
* @description
* @this {}
* @param x, ctx, viewWidth，生成管子的x位置，环境上下文，外部视图宽度
* @return {number} r This is a number
*/
function PipeGroup(x, ctx, viewWidth) {
    this.spriteAction = null;
    this.scale = 0.5;
    this.width = 130 * this.scale;
    this.height = 810 * this.scale;
    this.sizeX = viewWidth.width || 360;
    this.x = (x || 0)+this.width/2;
    this.y = 0;
    this.vx = -2;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.pipe1 = null;
    this.pipe2 = null;
    this.ctx = ctx;
    this.check = false;
}
//初始化方法
PipeGroup.prototype.init = function() {

    //用于适配屏幕
    this.vx *= __GG.scale;

    //随机生成管子的位置
    var pipeOffset = Math.floor(200 * Math.random()) - 100;
    this.y = 280 + pipeOffset;
    this.y -= 200;

    //the pipe on the top 810x130
    this.pipe1 = new Pipe();
    this.pipe1.setPosition(cc.p(this.x, this.y+505));
    this.pipe1.setScale(this.scale);

    this.pipe2 = new Pipe('u');
    this.pipe2.setPosition(cc.p(this.x, this.y));
    this.pipe2.setScale(this.scale);

    //添加到视图
    this.ctx.addChild(this.pipe1);
    this.ctx.addChild(this.pipe2);

}
//管子组的运动
PipeGroup.prototype.update = function() {
    this.x += this.vx;
    if ( this.x < -this.width/2 ) {
        this.x = this.sizeX + this.width/2;
        this.reset();
    }
    this.draw();
}
//重置管子组
PipeGroup.prototype.reset = function() {
    this.check = false;
    var pipeOffset = Math.floor(320 * Math.random()) - 160;
    this.y = 320 + pipeOffset;
    this.y -= 200;
}
//根据坐标绘画管子组
PipeGroup.prototype.draw = function() {
    this.pipe1.setPosition(cc.p(this.x, this.y+505));
    this.pipe2.setPosition(cc.p(this.x, this.y));
}