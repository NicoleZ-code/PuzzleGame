
$(function  () {
	var $wrap = $(".wrap");
	var $game_container = $(".game-container")
	var $tile_container = $(".tile-container");
	var $helper = $(".helper");
	var $startBtn = $(".helper .start");
	var $message = $(".game-message");
	var $tile_move = $(".tile-move");
	var $tile_empty = $(".tile-empty");
	var $step = $(".step");
	var $keep_playing_btn = $(".game-message .lower .keep-playing-button");
	var $retry_btn = $(".game-message .lower .retry-button");
	var $newGame = $(".new");
	var $level = $(".level");
	var numberX = 4,numberY = 4;
	var itemW = $tile_container.width()/numberX,itemH =$tile_container.height()/numberY;
	var str = "";
	var imgURL = "cat2.jpg";
	var step = 0;
	var successNum = 0;
	var level = 1;
	var timeLimt = 0;
	var randomArray = [];//[numberX*numberY]
	
	Init();

	function Init() {
		creatTile();
		moveRandom();
		setposition();
		calculateTime();
		Event ();
		setlevel(1);
		$helper.addClass("helper-visiable");
	}

	function creatTile(){
		str = "";
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
	    	 randomArray[i] = i; //error
	    	//randomArray.push(i); //restart error
	    	// console.log(i)
		}
		randomArray.sort(function(){ return 0.5 - Math.random() }) ;

		$(".tile").each(function(i){
			$(this).addClass("tile-"+randomArray[i]);
		});	

	}	
	function Event () {
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
		});		// body...
	}

	$keep_playing_btn.on("click",keepPlaying);
	$retry_btn.on("click",restart);
	$newGame.on("click",restart);
	$startBtn.on("click",function(){
		$helper.removeClass(".helper-visiable");
		$helper.hide();
	});

	function restart(){
		$game_container.removeClass("success");
		$message.hide();
		creatTile();
		moveRandom();
		setposition();
		calculateTime();
		Event ();
		setlevel(level);
		addSteps(0);
	}
	 
	function keepPlaying () {
	 	$game_container.removeClass("success");
		$message.hide();
		creatTile();
		moveRandom();
		setposition();
		calculateTime();
		Event ();
		setlevel(level);
		addSteps(0);	
	} 

	function tileExchangeimg(index1,index2,type){
		$(".tile").removeClass("move-animate");
		if(index1>=0 && index1<=15 && index2>=0 && index2<=15){
			var a_bgp = $(".tile").eq(index1).css("background-position");
			var b_bgp = $(".tile").eq(index2).css("background-position");
			// console.log(index1,index2,type,a_bgp,b_bgp);

			$(".tile").eq(index1).animate({'background-position': b_bgp},50,"easeOutBack");
			$(".tile").eq(index2).animate({'background-position': a_bgp},50,"easeOutBack");

			$(".tile").eq(index1).addClass("move-animate");
			$(".tile").eq(index2).addClass("move-animate");
			validate();
			addSteps(successNum);
		}
	}

	function addSteps(successNum){
		step ++;
		// $step.html(step);
		var zz = Math.ceil(successNum*100/16)+"%" ;
		if(successNum ==16){
			zz = "100%";
		}
		if(successNum ==0){
			$step.html(zz);
		}else{
			$step.html(zz+"<div class=\"addition\">*</div>");
		}
		
	}
	
	function calculateTime(){
		var second = minute = hour = "0";
		
		if(level>3 && timeLimt<200){
			timeLimt = 0;
			setInterval(function(){
				timeLimt ++;
				if(timeLimt < 60){
					second = timeLimt;
				}else if(timeLimt < 3600){
					minute = parseInt(timeLimt/60);
					second = timeLimt%60;
				}else{
					hour = parseInt(timeLimt/3600);
					var tempT = timeLimt%3600;
					minute = parseInt(tempT/60);
					second = tempT%60;			
				}
				$(".time").html(hour+":"+minute+":"+second);
				
				
			},1000);			
		}

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
			$message.show(1500);
			level++;
			
		}else{
			$game_container.removeClass("success");
			$message.hide();
		}
	}
	function setlevel (level) {
		$level.html("level"+level);
		for (var i = 1; i < 7; i++) {
			$wrap.removeClass("level-"+i);
		};
		if (level<7) {
			$wrap.addClass("level-"+level);
		}else{
			$wrap.addClass("level-n");
		} 
		
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

