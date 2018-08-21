$(function(){
	$.get('./song.json').then(function(response){
		let items =response
		items.forEach((i)=>{
	        let $li = $(`
	        <li>
		    	<a href="./songs.html?id=${i.id}">
		    		<h3>${i.name}</h3>
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
			$.get('./page1.json').then((response)=>{
                $li.text(response.content)
                $li.attr('data-downloaded','yes')
			})
		}else if(index === 2){
            $.get('./page2.json').then((response)=>{
                $li.text(response.content)
                $li.attr('data-downloaded','yes')
			})
		}
	})
})