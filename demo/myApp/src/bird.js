/**
 * 鸟...
 *
 * @description
 * @this {}
 * @param {number} r This is a number
 * @return {number} r This is a number
 */
var Bird = cc.Sprite.extend({
    rotation: 0,
    vrotation: 0,
    arotation: 0.1,
    spriteAction: null,
    width: 43,
    height: 30,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0,
    G: 0.4,
    stop: 0,
    fallDown: false,
    ctor: function() {
        this._super();
        //初始化
        this.initWithSpriteFrameName("bird1.png");
        //根据屏幕算属性值
        this.arotation *= __GG.scale;
        this.G *= __GG.scale;
    },
    //飞翔
    fly: function() {
        if (!this.fallDown) {
            this.rotation = -30;
            this.vrotation = 0;
            this.vy = 7;
        }
    },
    //更新渲染
    update: function() {
        this.vy -= this.G;
        if (this.vy < -10) {
            this.vy = -10;
        }
        this.y += this.vy;

        if (this.y > 680) {
            this.y = 680;
        }

        this.vrotation += this.arotation;
        this.rotation += this.vrotation;
        if (this.rotation >= 90) {
            this.rotation = 90;
        }

        this.setPosition(cc.p(this.x, this.y));
        this.setRotation(this.rotation);
    },
    handleKey: function(e) {

    },
    handleTouch: function(touchLocation) {

    },
    handleTouchMove: function(touchLocation) {

    }
});