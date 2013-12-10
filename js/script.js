var weekDay,dayHour,dayMinute;
$(document).ready(function(){
		
	reloadData();
	
	$(".timeTable tr td").live("click",function(){
		$this = $(this);
		$(".popup,.bgPopup").fadeIn();
		var time = "0" + $(this).data("hour");
		time = time.substr(time.length - 2, time.length);
		weekDay = $(this).parent().data('week');
		dayHour = time;
		timeType = "";
		if(time > 12){
			time = "0" + Number(time - 12);	
			time = time.substr(time.length - 2, time.length);
			timeType = "24hour";
		}
		$(".currentPick").removeClass("24hour");
		$(".currentPick").html(time + ":").addClass(timeType);
		$('.slot').removeClass("open");
		
		$.ajax({
			url: 'updateXML.php',
			type: 'POST',
			dataType: 'json',
			cache:false,
			async:false,
			data: {day: weekDay , hour: dayHour , getSlot: 'true'},
			success:function(data) {

				var dataArray = [];
				$.each( data ,function(index,value){
					dataArray.push(value.toString());
				});
				var slots = $('.time_slot').find('.slot');
				slots.each(function(index,value){
					var minute = $(this).text();
					if($(this).find(".24hour").length > 0)
					{
						hourT = Number(minute.substr(0,2)) + 12;
						minute = hourT + ":" +  minute.substr(3,5);
					}
	
					minute = minute.replace(':' , '');
					$(this).removeClass("open close");
					if( $.inArray(minute, dataArray) !== -1 )
					{
						$(this).addClass("open");
					}
					else
					{
						$(this).addClass("close");
					}
				});
			}
		});

	});
	
	$(".timeTable tr td").live("hover",function(){
		$(".gateOpTime").remove();
		if($(this).data("time"))
		{
			var tStr = String($(this).data("time"));
			if(tStr.indexOf(",") > -1)
			{
				var arr = $(this).data("time").split(",");
				arr = arr.sort();
				for(i = 0;i < arr.length;i++)
				{
					arr[i] = $(this).data("hour") + ":" + arr[i];
				}
				str = arr.join(" ");
			}
			else{
				var str = "00" + $(this).data("time");
				str = str.slice(-2);
				str = $(this).data("hour") + ":" + str;				
			}
		
			$("<div/>",{
				class : "gateOpTime",
				text  : str
			}).appendTo($(this))
			  .blur(function(){
					setTimeout("$('.gateOpTime').remove()",500);	
				});
		}
	});
	
	$(".closeBtn,.bgPopup").click(function(){
		$(".popup,.bgPopup").fadeOut();
		$(".delete").remove();
	});
	
	$(".slot").live("click",function(){
		$(".delete").remove();
		if($(this).hasClass("open"))
		{
			$("<div class='delete'>Delete<br><span>Click here to delete it</span></div>")
				.appendTo($(this))
				.click(function(){
					updateSlot($(this).parent());
					$(this).remove();
				}).hover(function(){
						
				},function(){
					setTimeout("$('.delete').remove()",500);	
				});
		}
		else{
			updateSlot($(this));	
		}
		
	});

});

$(document).mouseup(function (e)
{
    var container = $(".delete");
	
	if (container.has(e.target).length === 0)
    {
		$(".delete").hide();
    }

});

function updateSlot(slot){
	dayMinute = $(slot).find('.currentPickMinute').text();
	var $this = $(slot);
	$(slot).removeClass("close").addClass("open");
	$.ajax({
		url: 'updateXML.php',
		type: 'POST',
		dataType:'json',
		data: {day: weekDay , hour: dayHour , minute: dayMinute , update: 'true'},
		cache : false,
		success:function(data) {
			reloadData();
			if(data.remove)
			{
				$this.addClass("close").removeClass("open");
			}
		}
	});	
}

function reloadData(){
	$.ajax({
		url : "SampleParameters.xml",
		type : "GET",
		dataType : "xml",
		async : false,
		cache : false,
		success : function(xml){
			$(xml).scheduler();
		}
	});	
}