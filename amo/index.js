var rotateAnim = Amo.keyframes({
    '-webkit-transform': 'rotate(0deg)'
}, {
    '-webkit-transform': 'rotate(360deg)'
}).animate({
    duration: 5000,
    easing: 'linear',
    time: -1
});

var blinkAnim = Amo.keyframes({
    0: {
        color: '#ff513c'
    },
    20: {
        color: '#51c1ff'
    },
    40: {
        color: '#8eff6b'
    },
    60: {
        color: '#ffa2fc'
    },
    80: {
        color: '#7ae2db'
    },
    100: {
        color: '#ff8462'
    }
}).animate({
    duration: 5000,
    easing: 'linear',
    time: -1
});

var items = document.getElementById('clarinet').getElementsByTagName('div');
Array.prototype.forEach.call(items, function (item, index) {

    var anim = Amo.keyframes({
        width: (Math.random() * 50) + 'px'
    }, {
        width: (Math.random() * 200 + 150) + 'px'
    }).animate({
        duration: Math.floor(Math.random() * 1000) + 500,
        easing: 'ease',
        time: -1,
        direction: 'alternate'
    });

    anim.run(item);
});

rotateAnim.run(document.getElementById('runner'));

blinkAnim.run(document.getElementById('logo'));