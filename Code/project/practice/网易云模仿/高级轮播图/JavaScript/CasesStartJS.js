// JavaScript Document
//<![CDATA[
	//Cases Start
	if($.support.transition){
		$("#cases>ul>li").hover(function(){
			$("img",this).stop(false,true).transition({
				perspective: '300px',
				rotateY: '180deg',
				opacity: '0'
			});
			$("p",this).css({display:'block',opacity:'0',rotateY: '-180deg'}).stop(false,true).transition({
				perspective: '300px',
				rotateY: '0deg',
				opacity: '1'
			});
		},function(){
			$("img",this).show().stop(false,true).transition({
				perspective: '300px',
				rotateY: '0deg',
				opacity: '1'
			});
			$("p",this).stop(false,true).transition({
				perspective: '300px',
				rotateY: '180deg',
				opacity: '0'
			});
		});
	}else{
		$("#cases>ul>li").hover(function(){
			$("img",this).stop(false,true).slideUp("fast");
			$("p",this).stop(false,true).slideDown("fast");
		},function(){
			$("img",this).stop(false,true).slideDown("fast");
			$("p",this).stop(false,true).slideUp("fast");
		});
	}
	$("#cases>ul>li>img").lazyload({effect:"fadeIn",failurelimit:10});
//]]>
$("#gotop").click(function(){$('body,html').animate({scrollTop:0},500);})
var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");