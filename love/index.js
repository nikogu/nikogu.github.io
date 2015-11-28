/**
 * lw.l
 *
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

    flowExec.push(function() {
        var slide = $('.swiper-slide').eq(0),
            article = slide.find('.article'),
            nextNode = slide.find('.next');

        $('#J_time-1').typeTo('2015.11.28');

        var t = 2000,
            duration = 1000,
            spans = article.find('span');

        spans.each(function(index, item) {
            setTimeout(function() {
                $(item).css('opacity', 1);
                if ( index == spans.length-1 ) {
                    window._love();
                    setTimeout(function() {
                        $('#logo').typeTo('To L.WL');
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

})();

