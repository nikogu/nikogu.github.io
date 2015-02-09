/**
 * jiayi.wu
 *
 * @author niko
 * @date 2015
 */

//入口+swiper
(function () {

    function setStep(from, to, node, duration, len) {
        var n = node;
        var h = n.html();
        var arr = h.split('');
        arr.splice(arr.length-(len||2), 0, '<span>');
        arr.push('</span>');
        h = arr.join('');
        n.html(h);

        var stepNode = node.find('span');

        var duration = duration || 1000;
        var cur = from;

        (function tick() {
            if ( cur < to ) {
                cur++;
                stepNode.html(cur);
                setTimeout(tick, duration);
            }
        })();

    }

    //流程处理
    var flowNote = [];

    var flowExec = [];

    //1
    flowExec.push(function() {
        setTimeout(function() {
            var slide = $('.swiper-slide').eq(0),
                article = slide.find('.article'),
                nextNode = slide.find('.next');

            $('#J_time-1').typeTo('2015.1.17');

            var duration = 2000;

            var t = 2000,
                spans = article.find('span');

            spans.each(function(index, item) {
                setTimeout(function() {
                    $(item).css('opacity', 1);
                    if ( index == spans.length-1 ) {
                        nextNode.css('opacity', 1);
                    }
                }, t);
                t += duration;
            });
        }, 500);
    });

    //2
    flowExec.push(function() {

        var slide = $('.swiper-slide').eq(1),
            article = slide.find('.article'),
            nextNode = slide.find('.next');

        $('#J_time-2').typeTo('2015.1.18');

        var t = 2000,
            duration = 1000,
            spans = article.find('span');

        setTimeout(function() {
            setStep(18, 23, $('#J_time-2'));
        }, t+100);
        spans.each(function(index, item) {
            setTimeout(function() {
                $(item).css('opacity', 1);
                if ( index == spans.length-1 ) {
//                    nextNode.css('opacity', 1);
                    $('#J_tips-2').typeTo('不知道从什么时候，听你说自己的事情，是让我最开心事情 ^_^');
                    setTimeout(function() {
                        nextNode.css('opacity', 1);
                    }, 2000);
                }
            }, t);
            t += duration;
        });
    });

    //3
    flowExec.push(function() {

        var slide = $('.swiper-slide').eq(2),
            article = slide.find('.article'),
            nextNode = slide.find('.next');

        $('#J_time-3').typeTo('2015.1.24');

        var t = 2000,
            duration = 1000,
            spans = article.find('span');

        spans.each(function(index, item) {
            setTimeout(function() {
                $(item).css('opacity', 1);
                if ( index == spans.length-1 ) {
                    nextNode.css('opacity', 1);
                }
            }, t);
            t += duration;
        });

    });

    //4
    flowExec.push(function() {
        var slide = $('.swiper-slide').eq(3),
            article = slide.find('.article'),
            nextNode = slide.find('.next');

        $('#J_time-4').typeTo('2015');

        var t = 2000,
            duration = 1000,
            spans = article.find('span');

        setTimeout(function() {
            setStep(2015, 9999, $('#J_time-4'), 100, 4);
        }, t+100);

        spans.each(function(index, item) {
            setTimeout(function() {
                $(item).css('opacity', 1);
                if ( index == spans.length-1 ) {
                    window._love();
                    setTimeout(function() {
                        $('#logo').typeTo('love 7。');
                    }, 4500);
                }
            }, t);
            t += duration;
        });

    });

    function flow(index) {
        if ( flowNote[index] ) {
            return;
        }
        flowNote[index] = 1;

        flowExec[index]();
    }

    var loader = new Loader();
    loader.add({
        'img1': './res/a.jpg',
        'img2': './res/hobit.png',
        'img3': './res/panda.gif'
    });

    loader.onload(function() {


        $('.swiper-container').css('opacity', 1);

        //主程序
        var loadingNode = $('#loading');
        var isCanGoTo = true;

        var swiper = new Swiper('.swiper-container', {
            mode: 'vertical',
            speed: 1000,
            onFirstInit: function() {
                init();
                flow(0);
            },
            onSlideNext: function(swiper) {
                flow(swiper.activeIndex);
                isCanGoTo = true;
            }
        });

        function init() {

            loadingNode.fadeOut(function() {
                loadingNode.remove();
            });

            $('.next').on('click', function() {
                if ( isCanGoTo ) {
                    isCanGoTo = false;
                    swiper.swipeNext(true);
                }
            });
        }
    });
    loader.load();

    $('#song')[0].play();

})();

