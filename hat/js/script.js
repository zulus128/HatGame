var playerCount = 6;
var wordsCount = 6;

var words = {
    0: { name: "Слово 1", x: 0, y: 300 },
	1: { name: "Слово 2", x: 880, y: 300 },
	2: { name: "Слово 3", x: 0, y: 450 },
	3: { name: "Слово 4", x: 880, y: 450 },
	4: { name: "Слово 5", x: 0, y: 600 },
	5: { name: "Слово 6", x: 880, y: 600 },
	6: { name: "Слово 7", x: 0, y: 750 },
	7: { name: "Слово 8", x: 880, y: 750 }
}

var players = [];
var curPlayer = -1;
var curWord = -1;

function openEnterPlayersPage(){
	$("#players_box").empty();
	for (var i = 0; i < playerCount; i++) {
		$("#players_box").append('<div><input type="text" tag="'+i+'" class="enter_player" value="Игрок '+i+'"/>'+
			'<div class="radio radio-men radio-active" tag="'+i+'"/><div class="radio radio-women" tag="'+i+'"/></div>'+
			'<div style="clear: both;"></div>');
	}
	$.mobile.changePage( $("#enter_players_page") );
}

function openGamePage(){
	curPlayer = 0;
	console.log(players);
	$.mobile.changePage( $("#game_page") );
}

function nextPlayerEnterWords(){
	if(curPlayer >= 0){
		var pwords = [];
		$(".enter_word").each(function(){
			pwords.push($(this).val());
		});
		players[curPlayer].words = pwords;
	}

	curPlayer++;
	if(players.length <= curPlayer){
		openGamePage();
		return;
	}
	$("#player_name").text(players[curPlayer].name);
	$("#words").empty();
	for (var key in words) {
		if(key >= wordsCount) break;
		var val = words[key];
		$("#words").append('<input style="position: absolute; -webkit-transform: scale(0.4) translate('+val.x+'px, '+val.y+'px);"'+
			' type="text" class="enter_word" value="'+val.name+'" tag="'+key+'" readonly/> ');
	}
	
}

function shuffle( array ) {
    for(var j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
    return true;
}


function getNewWord(){
	curWord++;
	if(curWord >= players[curPlayer].words.length || curWord == 0) {
		curWord = 0;
		shuffle( players[curPlayer].words );
	}
	return players[curPlayer].words[curWord];
}

function removeWord(){
	var rword = $(".word");
	if(rword.length){
		rword.css({'-webkit-transform': 'scale(0.4) translate(0px, -1250px)'});
		setTimeout(function(){
			rword.remove();
		}, 400);
	}
}

function newWord(){
	$("#game_page").append('<div class="word active" style="-webkit-transform: scale(0.25) translate(0px, 600px);">'+
		'<span class="word-text">'+getNewWord()+'</span></div>');
	
	setTimeout(function(){
		$(".word.active").css({'-webkit-transform': 'scale(1) translate(0px, 0px)'});
		$(".word.active").removeClass("active");
	}, 1);
}

var timer = null;
var timeSec = 20;
var leftTime = timeSec;
var timerPause = false;

function tick(){
	if(timerPause) return;
	leftTime--;
	$("#game_txt_time").text(leftTime);
	if(leftTime <= 0){
		stopTimer();
	}
}

function startTimer(){
	timerPause = false;
	leftTime = timeSec;
	$("#game_txt_time").text(leftTime);
	timer = setInterval("tick();", 1000);
	newWord();
}

function stopTimer(){
	if(timer == null) return;
	clearInterval(timer);
	$("#game_txt_time").text(0);
	timer = null;
	removeWord();
}

$(document).ready(function() {
	
	$("#game_btn_play").click(function(){
		if(timer == null){
			startTimer();
		} else {
			removeWord();
			newWord();		
		}
	});	
	
	$("#game_btn_pause").click(function(){
		timerPause = !timerPause;
	});

	$("#game_btn_stop").click(function(){
		stopTimer();
	});	
	
	$(".radio").live("click", function(){
		var id = $(this).attr("tag");
		if(!$(this).hasClass("radio-active")){
			$(".radio[tag='"+id+"']").removeClass("radio-active");	
			$(this).addClass("radio-active");
		}
	});
	
	$(".enter_word").live("click", function(){
		
		if(!$(this).hasClass("active")){
			
			$(".enter_word.active").each(function(){
				var word = words[$(this).attr("tag")];
				$(this).attr("readonly", "readonly");
				$(this).removeClass("active");
				$(this).css({'-webkit-transform': 'scale(0.4) translate('+word.x+'px, '+word.y+'px)'});
			});
		
			$(this).addClass("active");
			$(this).removeAttr("readonly");
			$(this).css({'-webkit-transform': 'scale(1) translate(0px, 0px)'});			
		}
		
	});
	
	$("#words_btn_next").click(function(){
		nextPlayerEnterWords();
	});	
	
	$("#main_btn_start").click(function(){
		openEnterPlayersPage();
	});
	
	$("#players_btn_next").click(function(){
		$(".enter_player").each(function(){
			players[$(this).attr("tag")] = { name : $(this).val()};
		});
	
		nextPlayerEnterWords();
		$.mobile.changePage( $("#enter_words_page") );
	});
	
	$("#main_btn_settings").click(function(){

	});
});

