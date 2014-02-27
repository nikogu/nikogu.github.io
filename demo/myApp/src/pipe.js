/**
* 单个管子，sprite子类
*
* @description
* @this {}
* @param {number} r This is a number
* @return {number} r This is a number
*/
var Pipe = cc.Sprite.extend({
    spriteAction: null,
    width: 75,
    height: 405,
    x: 0,
    y: 0,
    ctor: function(type) {
        this._super();
        this.vx *= __GG.scale;
        if ( type == 'u' ) {
            this.initWithSpriteFrameName("holdback1.png");
        } else {
            this.initWithSpriteFrameName("holdback2.png");
        }
    },
    update: function() {
    },
    handleKey: function(e) {

    },
    handleTouch: function(touchLocation) {

    },
    handleTouchMove: function(touchLocation) {

    }
});