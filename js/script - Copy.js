$(document).ready(function(){
	var weekDay,dayHour,dayMinute;
	
	function reloadData()
	{
		$.ajax({
			url : "SampleParameters.xml",
			type : "GET",
			dataType : "xml",
			cache : false,
			success : function(xml){
				$(xml).find('DayRow').each(function(){
					var weekName = $(this).find('Desc').text();
					var count = $(this).find('TimeBlock').length;
					var bgColor = $(this).find('BGColor').text();
					//alert(weekName + "-" + count);
					$('[data-week="'+weekName+'"]').find('td').text('');
					$(this).find('TimeBlock').each(function(){
						var col = $(this).find('Row').text();
						count = $(this).parent().find('TimeBlock').filter(function(){
							return $(this).find('Row').text() == col
						}).length;
						//alert($("[data-week='"+weekName+"']").length);
						$("[data-week='"+weekName+"']").find("td:eq("+col+")").html(count).css("background-color",bgColor);
					});
					
					//$("[data-week='"+weekName+"']").find("td:eq(";
				});
			}
		});
	}

	reloadData();
	
	$(".timeTable tr td").click(function(){
		$(".popup,.bgPopup").fadeIn();
		var time = "0" + $(this).data("hour");
		time = time.substr(time.length - 2, time.length);
		weekDay = $(this).parent().data('week');
		dayHour = time;
		$(".currentPick").html(time + ":");
		$.ajax({
			url: 'updateXML.php',
			type: 'POST',
			dataType: 'json',
			data: {day: weekDay , hour: dayHour , getSlot: 'true'},
			success:function(data) {

				var dataArray = [];
				$.each( data ,function(index,value){
					dataArray.push(value.toString());
				});
				var slots = $('.time_slot').find('.slot');
				slots.each(function(index,value){
					var minute = $(this).text();
					minute = minute.replace(':' , '');
					if( $.inArray(minute, dataArray) !== -1 )
					{
						$(this).css({
							background : "#00ff00",
							color      : "#fff"	
						});
					}
					else
					{
						$(this).css({
							background: '#CCCCCC',
							color: '#333333'
						})
					}
				});
			}
		});

	});
	
	$(".closeBtn").click(function(){
		$(".popup,.bgPopup").fadeOut();
	});
	
	$(".slot").click(function(){
		dayMinute = $(this).find('.currentPickMinute').text();
		var $this = $(this);
		$(this).css({
			background : "#00ff00",
			color      : "#fff"	
		});
		$.ajax({
			url: 'updateXML.php',
			type: 'POST',
			dataType:'json',
			data: {day: weekDay , hour: dayHour , minute: dayMinute , update: 'true'},
			success:function(data) {
				reloadData();
				if(data.remove)
				{
					$this.css({
						background: "#CCCCCC",
						color: '#333333'
					})
				}
			}
		});
		
	});
});