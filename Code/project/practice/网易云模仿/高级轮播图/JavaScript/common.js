// JavaScript Document

$(function(){

// time 
	setInterval(function time(){
	var today=new Date();
	var year=today.getFullYear();
	var mon=today.getMonth();
	var day=today.getDate();
	
    var h=today.getHours();
	var m=today.getMinutes();
		  // add a zero in front of numbers<10
	m=checkTime(m);
		  
	function checkTime(i)
		  {
		  if (i<10) 
			{i="0" + i}
			return i
		  }
		  
	$("span#time1").text(year+"-"+mon+"-"+day);
	$("span#time2").text(h+":"+m);
	},300)
	
})


// Cloud Float...
    var $main = $cloud = mainwidth = null;
    var offset1 = 450;
	var offset2 = 0;
	
	var offsetbg = 0;
    
    $(document).ready(
        function () {
            $main = $("#mainBody");
			$body = $("body");
			
            mainwidth = $main.outerWidth();
         
        }
    );

    /// 飘动
    setInterval(function flutter() {
        if (offset1 >= mainwidth) {
            offset1 =  -580;
        }

        if (offset2 >= mainwidth) {
			 offset2 =  -580;
        }
		
        offset1 += 1.1;
		offset2 += 1;
        $cloud1.css("background-position", offset1 + "px 30px")
		
		$cloud2.css("background-position", offset2 + "px 340px")
    }, 70);
	
	
	setInterval(function bg() {
        if (offsetbg >= mainwidth) {
            offsetbg =  -580;
        }

        offsetbg += 0.6;
        $body.css("background-position", -offsetbg + "px 0")
    }, 90 );
	