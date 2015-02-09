//绑定上下文
function proxy(fn, context) {
    return function () {
        fn.apply(context, arguments);
    }
}

var Loader = function () {

    //资源文件列表
    this.manifest = [];

    //加载计数
    this.loadCount = 0;

    //资源数据
    this.res = {};

    this._onprogress = function () {
    };

    this._onload = function () {
    };

};

//原型方法
(function () {

    var p = Loader.prototype;

    /**
     * 加载资源
     * @method add
     * @param {String|Object} res 图片资源
     * @return {this}
     */
    p.add = function (arg1, arg2) {
        //如果有name则是单个
        if (arg2) {
            this.manifest.push({
                id: arg1,
                url: arg2
            });
            //多个
        } else {
            for (var prop in arg1) {
                this.manifest.push({
                    id: prop,
                    url: arg1[prop]
                });
            }
        }
    };

    /**
     * 并行加载图片方法
     * @method _load
     * @return {this}
     * @private
     */
    p._load = function () {

        for (var i = this.resNum; i--;) {

            this.res[this.manifest[i].id] = {
                url: this.manifest[i].url,
                width: 0,
                height: 0
            };

            //音频文件
            if (this.isAudio(this.res[this.manifest[i].id])) {

                (proxy(function (i) {

                    this._loadAudio(i);

                }, this))(i);

                //图片文件
            } else {
                (proxy(function (i) {

                    this._loadImg(i);

                }, this))(i);
            }

        }

    };

    //加载进程
    p._loadProgress = function () {
        this.loadCount++;

        this._onprogress.call(this, {
            totalNum: this.resNum,
            currentNum: this.loadCount - 1,
            currentRes: this.manifest[this.loadCount - 1]
        });

        if (this.loadCount === this.resNum) {
            this._onload.call(this, this.res);
        }
    };

    //加载音频
    p._loadAudio = function (i) {

        try {
            var audio = new Audio();

            this.res[this.manifest[i].id].audio = audio;

            audio.addEventListener('canplaythrough', proxy(function () {
                this._loadProgress();
            }, this));

            if (/\.mp3$/.test(this.manifest[i].url)) {
                audio.innerHTML = '<source src="' + this.manifest[i].url + '" type="audio/mpeg">';
            } else if (/\.wav$/.test(this.manifest[i].url)) {
                audio.innerHTML = '<source src="' + this.manifest[i].url + '" type="audio/wav">';
            } else if (/\.ogg$/.test(this.manifest[i].url)) {
                audio.innerHTML = '<source src="' + this.manifest[i].url + '" type="audio/ogg">';
            } else {
                audio.src = this.manifest[i].url;
            }

        } catch (e) {
            throw new Error(this.manifest[i].url + ' load fail');
            this._loadProgress();
        }

    };

    //load image
    p._loadImg = function (i) {
        try {
            var img = new Image();

            this.res[this.manifest[i].id].image = img;

            img.onload = proxy(function () {

                this.res[this.manifest[i].id].width = img.width;
                this.res[this.manifest[i].id].height = img.height;

                this._loadProgress();

            }, this);
            img.src = this.manifest[i].url;
        } catch (e) {
            throw new Error(this.manifest[i].url + ' load fail');
            this._loadProgress();
        }
    };

    /**
     * 开始加载
     * @method load
     * @return {this}
     */
    p.load = function () {

        this.resNum = this.manifest.length;

        this._load();

    };

    p.isAudio = function (res) {
        return /\.mp3$|\.ogg$|\.wav$/.test(res.url);
    };

    //加载
    p.onprogress = function (callback) {
        this._onprogress = callback;
    }
    p.onload = function (callback) {
        this._onload = callback;
    }

})();
