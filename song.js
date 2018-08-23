$(function(){
	let id = parseInt(location.search.match(/\bid=([^&]*)/)[1])
	$.get('./song.json').then(function(response){
		let songs = response
		let song = songs.filter(s=>s.id === id)[0]
		//console.log(songs)
		console.log(song)
		let {url,name,lyric,cover,page} = song  ////应用了对象解构,拿到song的url
		initPlayer.call(undefined,url)
		initText(name,lyric)
		setImg(cover,page)
	})
	function setImg(cover,page){
		$('.cover').attr("src",cover)
		$('#style').html(`.page::before{background:transparent url(${page}) no-repeat center;}`)
	}
	function parseLyric(lyric){
		let array = lyric.split('\n')
		let regex = /^\[(.+)\](.*)$/ //以[为开头
		array = array.map(function(string){
			let matches = string.match(regex)
			if(matches){
				return {time:matches[1],words:matches[2]}
			}
		})
		let $lyric = $('.lyric')
		array.map(function(object){
			if(!object) return
		    let $p = $('<p></p>')
		    $p.attr('data-time',object.time).text(object.words)
		    $p.appendTo($lyric.children('.lines'))
		})
	}
	function initText(name,lyric){
		$('.song-description>h1').text(name)
		parseLyric(lyric)
	}
	function initPlayer(url){
		let audio = document.createElement('audio')
	    audio.src = url

	    audio.oncanplay = function(){
	    	audio.play()
	    	$('.disc-container').addClass('playing')//播放时加上动画
	    }
	    $('.icon-play').on('click',function(){
	    	audio.play()
	    	$('.disc-container').addClass('playing')//播放时加上动画
	    })
	    $('.icon-pause').on('click', function(){
	    	audio.pause()
	    	let iTransform = $('.disc-container .cover').css("transform")
	    	let cTransform = $('.disc-container .disc').css("transform")	    	
	    	if(cTransform === 'none'){
	    		$('.disc-container .disc').css({transform:iTransform}) 
	    	}else{
	    	    $('.disc-container .disc').css({transform:iTransform.concat('',cTransform)})	    		
	    	}
	    	
	    	$('.disc-container').removeClass('playing')//播放时加上动画
	    })
	    setInterval(()=>{
            let seconds = audio.currentTime
            let munites = ~~(seconds / 60)
            let left = seconds - munites * 60
            let time = `${pad(munites)}:${pad(left)}`
            let $lines = $('.lines>p')
            let $whileLine
            for(let i = 0;i<$lines.length;i++){
            	let currentLineTime = $lines.eq(i).attr('data-time')
            	let nextLineTime = $lines.eq(i+1).attr('data-time')
            	if($lines.eq(i+1).length !== 0 && currentLineTime < time && nextLineTime > time){
            		$whileLine = $lines.eq(i)
            		break
            	}
            }
            if($whileLine){
            	$whileLine.addClass('active').prev().removeClass('active')
            	let top = $whileLine.offset().top
            	let linesTop = $('.lines').offset().top
            	let delta = top - linesTop - $('.lyric').height()/3
            	$('.lines').css('transform',`translateY(-${delta}px)`)
            }
	    },300)
	    function pad(number){
	    	return number>= 10 ? number + '' : '0' + number
	    }
	}
})
