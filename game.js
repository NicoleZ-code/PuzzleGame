
$(function  () {
	var $game_container = $(".game-container")
	var $tile_container = $(".tile-container");
	var $message = $(".game-message");
	var $tile_move = $(".tile-move");
	var $tile_empty = $(".tile-empty");
	var $step = $(".step");
	var $restart = $(".game-message .lower");
	var $newGame = $(".new");
	var $level = $(".level");
	var numberX = 4,numberY = 4;
	var itemW = $tile_container.width()/numberX,itemH =$tile_container.height()/numberY;
	var str = "";
	var imgURL = "cat2.jpg";
	var step = 0;
	var successNum = 0;
	var level = 1;
	var randomArray = [];//[numberX*numberY]
	
	Init();

	function Init() {
		creatTile();
		moveRandom();
		setposition();
		calculateTime();
		setlevel(1);
	}

	function creatTile(){
		for (var i = 1; i <= numberX; i++) {
			for (var j = 1; j <= numberY; j++) {
				var n = (i-1)*numberX+j ;
				str +="<div class=\"tile  tile-position-"+ i +"-"+j +"\" data-p=\""+n+"\"></div>";
			}//tile-"+n+"
		};
		//str = "<div class='emptybox'><div class='empty'></div> </div>"+ "<div class='tile-empty'></div>"+ "<div class='tile-move'></div>"+ str;
		
		$tile_container.html(str);
	}

	function setposition(){
		for (var i = 1; i <= numberX; i++) {

			for (var j = 1; j <= numberY; j++) {
				var postionX = itemW * (i-1);
				var postionY = itemH * (j-1);
				var n = (i-1)*numberX+j ;
				// var bgURL = "url(" + imgURL +") "+postionX+"px "+postionY +"px no-repeat";
				// $(".tile-"+n).css({			
										
				// });
				$(".tile-position-"+ i +"-"+j).css({
					"top":postionY,
					"left":postionX										
				});

			}
				
			
		};	
		$(".emptybox").css({
			"right":-$tile_container.width()/numberX-10+1,
			"top": "-10px",
		});
	}

	function moveRandom(){
	    for (var i = 1 ; i <=numberX*numberY; i++) {
	    	// randomArray[i] = i; //error
	    	randomArray.push(i);
	    	// console.log(i)
		}
		randomArray.sort(function(){ return 0.5 - Math.random() }) ;

		$(".tile").each(function(i){
			$(this).addClass("tile-"+randomArray[i]);
		});	

	}	

	var x = 0;
	$(".tile").on('swipeLeft',function(e){
		// $(this).removeClass("tile-position-4-1").addClass("tile-position-3-1");		
		// $(this).removeClass("tile-empty");
		tileExchangeimg($(this).index()-x, $(this).index()-x-4, e.type);
	}).on('swipeRight',function(e){		
		// $(this).addClass("tile-empty");
		tileExchangeimg($(this).index()-x,  $(this).index()-x+4, e.type);
	}).on('swipeUp',function(e){

		tileExchangeimg($(this).index()-x,  $(this).index()-x-1, e.type);
	}).on('swipeDown',function(e){
		tileExchangeimg($(this).index()-x,  $(this).index()-x+1, e.type);
	});

	$restart.on("click",restart);
	$newGame.on("click",restart);
	function tileExchangeimg(index1,index2,type){
		if(index1>=0 && index1<=15 && index2>=0 && index2<=15){
			var a_bgp = $(".tile").eq(index1).css("background-position");
			var b_bgp = $(".tile").eq(index2).css("background-position");
			// console.log(index1,index2,type,a_bgp,b_bgp);

			$(".tile").eq(index1).animate({'background-position': b_bgp},100,"easeOutBack");
			$(".tile").eq(index2).animate({'background-position': a_bgp},100,"easeOutBack");

			validate();
			addSteps();
		}
	}

	function addSteps(){
		step ++;
		// $step.html(step);
		var zz = Math.ceil(successNum*100/16)+"%" ;
		if(successNum ==16){
			zz = "100%";
		}
		$step.html(zz+"<div class=\"addition\">*</div>");
	}
	
	function calculateTime(){
		var second = minute = hour = "0";
		var time = 0;
		setInterval(function(){
			time ++;
			if(time < 60){
				second = time;
			}else if(time < 3600){
				minute = parseInt(time/60);
				second = time%60;
			}else{
				hour = parseInt(time/3600);
				var tempT = time%3600;
				minute = parseInt(tempT/60);
				second = tempT%60;			
			}
			$(".time").html(hour+":"+minute+":"+second);
			
			
		},1000);
	}

	function validate(){
		$(".tile").each(function(i){
			var p = $(this).css("background-position").split(" ");
			var x = Math.abs(parseInt(p[0]))/itemW, y = Math.abs(parseInt(p[1]))/itemH;
			var z = x*numberX + y + 1;
			if( i ==0){
				successNum = 0;
			}
			if( i+1 == z){
				successNum++;
			}
		});
		if(successNum == numberX * numberY ){
			$game_container.addClass("success");
			$message.find(".word").html("You Win!");
			$message.removeClass("game-over");
			$message.show(1000);
			level++;
			setlevel (level);
		}else{
			$game_container.removeClass("success");
			$message.hide();
		}
	}
	function setlevel (level) {
		$level.html("level"+level);
		for (var i = 1; i < 7; i++) {
			$game_container.removeClass("level-"+i);
		};
		$game_container.addClass("level-"+level);
	}
	function restart(){
		$game_container.removeClass("success");
		$message.hide();
		Init();
		level++;
	}

	function exchangeSkin (skin) {
		// body...
	}

	// $(".tile").on("touchstart",function(){
	// 	$tile_move.css({
	// 		"background-position":$(this).attr("background-position")
	// 	});
	// });
	// $tile_container.on("touchmove",function(){

	// });
	// $(".tile").on("touchend",function(){
	// 	$tile_move.css({//animate
	// 		"top":$(this).attr("top"),
	// 		"left":$(this).attr("left")
	// 	});
	// });

});

// setTime();
function setTime(){
	var second = null,minute = null ,hour = null;
	setInterval(function(){
		var myDate = new Date();
		second = myDate.getSeconds();
		hour = myDate.getHours();       //获取当前小时数(0-23)
		minute = myDate.getMinutes();     //获取当前分钟数(0-59)
		
		// $(".time .hour").html(hour);
		$(".time").html(minute+":"+second);
		
	},1000/60);
}

