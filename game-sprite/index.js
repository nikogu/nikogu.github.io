
var url = './README',
    docNode = $('#doc');

$.get(url, function (data) {
    docNode.html(marked(data));
});

var Timeline = Sprite.Timeline;
var loader = new Loader();
loader.add({
    sprite: 'http://gtms03.alicdn.com/tps/i3/TB1nLrDFVXXXXaNXFXXrhejFFXX-1924-1022.png',
    floor: 'http://gtms02.alicdn.com/tps/i2/TB1Mo2IFVXXXXXBXFXXlfEI0XXX-592-67.png',
    billd: 'http://gtms03.alicdn.com/tps/i3/TB1ZnJ4FVXXXXbcaXXXpVcj2pXX-660-22.png'
});
loader.onprogress(function (e) {

});
loader.onload(function (e) {
    $('#loading-content').hide();
    $('#sprite-content').css('opacity', 1);
    init(e);
});
loader.load();

//初始化
function init(res) {

    var tm = Timeline.use('tm').init(1000 / 60);

    //control
    (function () {

        var sister = new Sprite({
            ctx: document.getElementById('live-anim'),
            res: {
                image: res.sprite.url,
                json: SPRITE_DATA
            },
            spf: 80
        });

        sister.set({
            x: 200,
            y: 50
        });
        sister.run('normal-cowherd-stand');

        $('.c-btn').on('click', function (e) {
            var target = $(this),
                type = target.attr('data-control');

            $('.c-btn-active').removeClass('c-btn-active');
            target.addClass('c-btn-active');

            changeAnim(type);
        });

        function changeAnim(type) {
            var type = type * 1;

            switch (type) {
                case 1:
                    sister.run('normal-cowherd-stand');
                    break;
                case 2:
                    sister.run('normal-cowherd-run');
                    break;
                case 3:
                    sister.run('normal-cowherd-jump');
                    break;
                case 4:
                    sister.run('normal-cowherd-dropdown');
                    break;
                case 5:
                    sister.run(['normal-cowherd-run',
                        'power-cowherd-run',
                        'normal-cowherd-jump',
                        'power-cowherd-jump',
                        'normal-cowherd-stand']);
                    break;
                default:
                    sister.run('normal-cowherd-stand');
                    break;
            }
        }

    })();

    //dom case
    (function () {
        var sister = new Sprite({
            ctx: document.getElementById('case-dom'),
            res: {
                image: res.sprite.url,
                json: SPRITE_DATA
            },
            spf: 80
        });

        sister.set('y', 30);
        sister.run('power-cowherd-run');

        //游戏逻辑定时器
        tm.createTask({
            duration: -1,
            onTimeStart: function () {

            },
            //简单的运动物体
            onTimeUpdate: function () {
                if (sister.get('x') > 990) {
                    sister.set('x', -sister.width);
                } else {
                    sister.set('x', sister.get('x') + 4);
                }
            },
            onTimeEnd: function () {

            }
        });

    })();

    //canvas case
    (function () {
        var canvas = document.getElementById('case-canvas'),
            ctx = canvas.getContext('2d');

        var sister = new Sprite({
            ctx: ctx,
            res: {
                image: res.sprite.image,
                json: SPRITE_DATA
            },
            spf: 80
        });

        sister.play('normal-fairy-run');
        sister.set({
            y: 30,
            regX: sister.width / 2,
            scaleX: -1
        });

        //游戏逻辑定时器
        tm.createTask({
            duration: -1,
            onTimeStart: function () {

            },
            //简单的运动物体
            onTimeUpdate: function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (sister.get('x') > 990) {
                    sister.set('x', -sister.width);
                } else {
                    sister.set('x', sister.get('x') + 4);
                }
                sister.update();
            },
            onTimeEnd: function () {

            }
        });

    })();

    //snap case
    (function () {
        var s = Snap('#case-snap');

        var sister = new Sprite({
            ctx: s,
            res: {
                image: res.sprite.url,
                json: SPRITE_DATA
            },
            spf: 80
        });

        sister.set('y', 30);
        sister.run('normal-cowherd-run');

        //游戏逻辑定时器
        tm.createTask({
            duration: -1,
            onTimeStart: function () {

            },
            //简单的运动物体
            onTimeUpdate: function () {
                if (sister.get('x') > 990) {
                    sister.set('x', -sister.width);
                } else {
                    sister.set('x', sister.get('x') + 4);
                }
            },
            onTimeEnd: function () {

            }
        });

    })();

    //出现billd
    (function () {
        var billd = new Sprite({
            ctx: document.body,
            res: res.billd.url,
            count: 30,
            width: 22,
            height: 22,
            sfp: 50,
            anim: {
                runLeft: [4, 7],
                runRight: [0, 3],
                jump: [9, 18],
                static: [19, 22]
            },
            //自定义属性
            action: '',
            vx: 3
        });

        billd.set({
            x: 100,
            y: 128
        });

        billd.run('static');

        billd.tm.createTask({
            duration: -1,
            onTimeUpdate: function (t) {

                if (billd.action == 'run-left') {
                    billd.set('x', billd.get('x') - billd.vx);
                } else if (billd.action == 'run-right') {
                    billd.set('x', billd.get('x') + billd.vx);
                }

            }
        });

        //39 r
        //37 l
        //38 u
        //40 d
        $(window).on('keydown', function (e) {
            switch (e.keyCode) {
                case 39:
                    billd.action = 'run-right';
                    if (billd.cAnim.getName() != 'runRight') {
                        billd.play('runRight');
                    }
                    break;
                case 37:
                    billd.action = 'run-left';
                    if (billd.cAnim.getName() != 'runLeft') {
                        billd.play('runLeft');
                    }
                    break;
                case 38:
                    if (billd.cAnim.getName() != 'jump') {
                        billd.play('jump');
                        if (!billd.isJumping) {
                            billd.tm.createTask({
                                duration: 800,
                                onTimeStart: function () {
                                    billd._oy = billd.get('y');
                                    billd.isJumping = true;
                                },
                                onTimeUpdate: function (t) {
                                    billd.set('y', billd._oy - Math.sin(t / 800 * Math.PI) * 100);
                                },
                                onTimeEnd: function () {
                                    billd.isJumping = false;
                                    if (billd.action == 'run-left') {
                                        billd.play('runLeft');
                                    } else if (billd.action == 'run-right') {
                                        billd.play('runRight');
                                    } else {
                                        billd.play('static');
                                    }
                                }
                            });
                        }
                    }
                    break;
                default:
                    break;
            }
        });
        $(window).on('keyup', function (e) {
            switch (e.keyCode) {
                case 39:
                    billd.action = '';
                    billd.play('static');
                    break;
                case 37:
                    billd.action = '';
                    billd.play('static');
                    break;
                case 38:
                    break;
                default:
                    break;
            }
        });

    })();

}



