
(function() {

    var rotateAnim = Amo.keyframes({
        '-webkit-transform': 'rotate(0deg)',
        'transform': 'rotate(0deg)'
    }, {
        '-webkit-transform': 'rotate(360deg)',
        'transform': 'rotate(360deg)'
    }).animate({
        time: -1,
        easing: 'linear'
    });
    var demo1Ins = rotateAnim.run(document.getElementById('demo-1'));

    var code1 = ace.edit('code-1');
    code1.setTheme('ace/theme/xcode');
    code1.getSession().setMode("ace/mode/javascript");
    code1.setReadOnly(true);


    var moveAnim = Amo.keyframes({
        left: '20px'
    }, {
        left: '480px'
    }).animate({
        time: -1,
        // animation-direction: normal|alternate;
        direction: 'alternate'
    });
    var demo2Ins = moveAnim.run($('#demo-2'));
    var code2 = ace.edit('code-2');
    code2.setTheme('ace/theme/xcode');
    code2.getSession().setMode("ace/mode/javascript");
    code2.setReadOnly(true);

    var sizeAnim = Amo.keyframes({
        'border-radius': '10px',
        width: '10px',
        height: '10px'
    }, {
        'border-radius': '120px',
        width: '120px',
        height: '120px'
    }).animate({
        //animate times
        time: 5,
        //once animate duration
        duration: 800,
        direction: 'alternate'
    });

    var demo3Ins = sizeAnim.run($('#demo-3'), function() {
        $('#demo-3').css('background', '#ddd');
    });
    var code3 = ace.edit('code-3');
    code3.setTheme('ace/theme/xcode');
    code3.getSession().setMode("ace/mode/javascript");
    code3.setReadOnly(true);


    var colorAnim = Amo.keyframes({
        0: {
            'background-color': 'red'
        },
        20: {
            'background-color': 'green'
        },
        50: {
            'background-color': 'blue'
        },
        80: {
            'background-color': 'yellow'
        },
        100: {
            'background-color': 'gray'
        }
    }).animate({
        time: -1,
        direction: 'alternate'
    });

    var demo4Ins = colorAnim.run($('.demo-4'));

    var code4 = ace.edit('code-4');
    code4.setTheme('ace/theme/xcode');
    code4.getSession().setMode("ace/mode/javascript");
    code4.setReadOnly(true);


    $('.btn-start').on('click', function() {
        var target = $(this),
            anim = target.attr('data-anim');

        eval(anim+'.start()');
    });
    $('.btn-stop').on('click', function() {
        var target = $(this),
            anim = target.attr('data-anim');

        eval(anim+'.stop()');

    });
    $('.btn-reset').on('click', function() {
        var target = $(this),
            anim = target.attr('data-anim');

        eval(anim+'.reset()');

    });

})();
