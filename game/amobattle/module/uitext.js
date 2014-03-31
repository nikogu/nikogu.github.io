/**
 * 文字封装
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-03-27
 */
KISSY.add('module/uitext', function(S) {

	function UIText( config ) {
		for ( var prop in config ) {
			if ( config.hasOwnProperty(prop) ) {
				this[prop] = config[prop];	
			}
		}
		this.x = 0;
		this.y = 0;
		//this.init();
	}
	UIText.prototype.show = function() {
		this.init();
	}
	UIText.prototype.init = function() {
		this.sprite = new createjs.Text(this.text, this.style, this.color);
		this.sprite.x = this.x;
		this.sprite.y = this.y;
		this.stage.addChild(this.sprite);
	}
	UIText.prototype.setText = function(text) {
		this.sprite.text = text;
	}

	return UIText;

}, {
	requires: []
});