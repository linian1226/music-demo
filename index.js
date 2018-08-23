$(function(){
	$.get('./song.json').then(function(response){
		let items =response
		items.forEach((i)=>{
	        let $li = $(`
	        <li>
		    	<a href="./songs.html?id=${i.id}">
		    		<h3>${i.name}</h3>
		    		<svg class="sq">
		    			<use xlink:href="#icon-sq"></use>
		    		</svg>
		    		<p>${i.singer}-${i.name}</p>
		    		<svg class="play">
		    			<use xlink:href="#icon-play-circled"></use>
		    		</svg>
		    	</a>
		    </li>
	             `)
	        
	        $('#latestMusic').append($li)
		})
		$('.latestMusicLoading').remove()
	})
	$('.siteNav').on('click','ol.tabItems>li',function(e){
		let $li = $(e.currentTarget).addClass('active')
		$li.siblings().removeClass('active')
		let index = $li.index()
		$li.trigger('tabChange',index)
		$('.tabContent > li').eq(index).addClass('active')
		    .siblings().removeClass('active')
	})
	$('.siteNav').on('tabChange',function(e,index){
		let $li = $('.tabContent > li').eq(index)
		if($li.attr('data-downloaded') === 'yes'){
			return
		}
		if(index === 1){
			$.get('./song.json').then((response)=>{
				$li.html(`
					<div class="hot">
						<div class="hotop">
							<div class="hotopct">
								<div class="hoticon"></div>
							</div>
					    </div>
					</div>
					<section class="hotMusic">
						<ol id="hotMusic">
						    				
						</ol>
					</section>
			    `)
                let items =response
				items.forEach((i)=>{
			        let $hot = $(`
					    <li>
					    	<a href="./songs.html?id=${i.id}">
					    		<div class="${(i.id<4?'rank':'cred')}">${(i.id<10?0:'')}${i.id}</div>
					    		<div class="sgitem">
					    			<h3>${i.name}</h3>
						    		<svg class="sq">
						    			<use xlink:href="#icon-sq"></use>
						    		</svg>
						    		<p>${i.singer}-${i.name}</p>
						    		<svg class="play">
						    			<use xlink:href="#icon-play-circled"></use>
						    		</svg>
					    		</div>
					    		
					    	</a>
					    </li>
			        `)

			        $('.hotMusic>ol').append($hot)
			    })
			    $('#tab2Loading').remove()
                $li.attr('data-downloaded','yes')
			})
		}
		
	})
	let timer
	$('input#searchSong').on('input',function(e){
		let $input = $(e.currentTarget)
		let value = $input.val().trim()
		$('.input-cover .holder').css({display:"none"})
		if(value === ''){
			$('.input-cover .holder').css({display:"block"})
			return
		}
		if(timer){
			clearTimeout(timer)
		}
		timer = setTimeout(function(){
			search(value).then((result)=>{
                timer = undefined
                if(result.length !== 0){
                	$('#output').text(result.map((r)=>r.name).join(','))
                }else{
                	$('#output').text('没有结果')
                }
			})
		})
	})
	function search(keyword){
		return new Promise((resolve,reject)=>{
			var database = [
			    {"id":1,"name":"山外小楼夜听雨"},
			    {"id":2,"name":"双影"},
			    {"id":3,"name":"鲨影"}
            ]
            let result = database.filter(function(item){
            	return item.name.indexOf(keyword) >=0
            })
            setTimeout(function(){
            	resolve(result)
            },Math.random()*200 +1000)
		})
	}
	window.search = search
})