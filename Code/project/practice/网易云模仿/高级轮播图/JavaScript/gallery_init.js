$(document).ready(function () {
    $('#myRoundabout').roundabout({
        shape: 'figure8',
        minOpacity: 1
    });
    $('#myRoundabout li:first')
        .children('a')
        .attr('href', $('#myRoundabout li:first').children(':hidden').val());

    $('#myRoundabout').autoPlay();
});

$.fn.autoPlay = function () {
    if ($(this).children('li').length == 5) {
        $(this)
            .unbind('mousemove')
            .unbind('mouseout')
            .mousemove(cTimer)
            .mouseout(createTimer);
        createTimer();
    }
}
var animTimer;
var index = 0;
function pageClick() {
    $('#myRoundabout li:eq(' + index + ')').click();
    index++;
    if (index > 4) {
        index = 0;
    }
    createTimer();
}

function createTimer() {
    animTimer = setTimeout('pageClick()', 3000);
}

function cTimer() {
    clearTimeout(animTimer);
}

function ScrollImgTop() {
    var speed = 15;
    var scroll_begin = document.getElementById("scroll_begin");
    var scroll_end = document.getElementById("scroll_end");
    var scroll_div = document.getElementById("scroll_div");
    scroll_end.innerHTML = scroll_begin.innerHTML
    function Marquee() {
        if (scroll_end.offsetTop - scroll_div.scrollTop <= 0)
            scroll_div.scrollTop -= scroll_begin.offsetHeight
        else
            scroll_div.scrollTop++
    }
    var MyMar = setInterval(Marquee, speed)
    scroll_div.onmouseover = function () { clearInterval(MyMar) }
    scroll_div.onmouseout = function () { MyMar = setInterval(Marquee, speed) }
}
