;(function($) {
	
	// Default parameter or options
	var defaults = {
		xmlFilename  : "SampleParameters.xml",
		container    : "scheduler_body", // this is class name of your container
		numWeek      : 5,
		weekName     : ["Monday","Tuesday","Wednesday","Thusday","Friday","Saturday","Sunday"],
		hourFormat   : "12 hour",
		timeduration : 5	
	};
	
	//| Constructor function
	function Scheduler(element, options){
		
		// merge default and user parameters
		this.config = $.extend({},defaults,options);
		this.element = element;
		this.init();
	}
	
	Scheduler.prototype.init = function(){
				
		var $container = $("." + this.config.container);
		
		$container.html("");
		$("<div class='hourTable'>" + createHour() + "</div>").appendTo($container);
		$("<div class='week'>" + createWeek(this.element,this.config.weekName) + "</div>").appendTo($container);
		$("<div class='timeTable'>" + createSlot(this.element,this.config.weekName) + "</div>").appendTo($container);
		
		var cnt = 0;
		for(var k = 0;k < 12;k++)
		{
			if(cnt % this.config.timeduration != 0)
			{
				$(".s"+cnt).remove();
			}	
			cnt += 5;
		}
			
	};
	
	// create Hour
	function createHour(){
		var hourTable = "<table width='500' border='0' cellpadding='0' cellspacing='0'><tbody><tr>";
		for(var k = 0; k < 25; k++){
			if(k == 0) {
				j = 12; 
			}
			else if(k > 12)
			{
				j = k-12;	
			}
			else{
				j = k;	
			}
			hourTable += '<td>' + j + '</td>';
		}
		hourTable += "</tr></tbody></table>"
		
		return hourTable;
	}
	
	// set how many week is available depending on XML file
	function createWeek(xml,weeks){
		var weekName = "<table width='70' border='0' cellpadding='0' cellspacing='0'><tbody>";
		var weekNum = weeks.length;
		for(var i=0; i < weekNum;i++)
		{
			if(weeks[i] == "Saturday" || weeks[i] == "Sunday")
			{
				weekName += "<tr><td class='weekendName'>" + weeks[i] + "</td></tr>";
			}else{
				weekName += "<tr><td>" + weeks[i] + "</td></tr>";
			}
		}
		weekName += "</tbody></table>"
		return weekName;
	}
	
	// create Slot
	function createSlot(xml,weeks){
		var slots = "<table width='481' border='0' cellpadding='0' cellspacing='0'><tbody>";
		var weekNum = weeks.length;
		for(var i=0; i < weekNum;i++)
		{
			$this = 0;
			xml.find('DayRow').each(function() {
				if($(this).find('Desc').text() == weeks[i]){
					$this = $(this);
				}
			});
			
			if((weeks[i] == "Saturday" || weeks[i] == "Sunday"))
			{
				slots += "<tr data-week='"+ weeks[i] +"' class='weekend'>";
			}
			else{
				slots += "<tr data-week='"+ weeks[i] +"'>";
			}
			
			var gateDetail = new Array();
			var gateOT = new Array();
			if($this != 0)
			{
				$this.find('TimeBlock').each(function(){
					var start   = $(this).find('Start').text().substr(0,2);
					var slot    = $(this).find('Start').text().substr(2,4);
					var bgColor = $(this).find('Color').text();
					
					count = $(this).parent().find('TimeBlock').filter(function(){
						return $(this).find('Start').text().substr(0,2) == start;
					}).length;
					
					if(slot != 0)
					{
						if(gateOT[start]){
							gateOT[start] = gateOT[start] + "," + slot;
						}else{
							gateOT[start] = slot;
						}
					}
					
					gateDetail[start] = new Array(count,bgColor,gateOT);
					
				});
			}
						
			for(var t=0; t < 24; t++)
			{
				var time = "00" + t;
				time = time.substr(time.length - 2, time.length);
							
				if(!gateDetail[time])
				{
					slots += "<td data-hour='" + time + "'></td>";
				}
				else{
					slots += "<td data-hour='" + time + "' data-time='" + gateOT[time] + "' style='background:" + gateDetail[time][1] + ";'>" + gateDetail[time][0] + "</td>";	
				}
			}		
			slots += "</tr>";
		}
		slots += "</tbody></table>";
		return slots;
	}
				
	// jQuery plugin definition
	$.fn.scheduler = function(options) {
		
		new Scheduler(this, options);
		// allow jQuery chaining
		return this;
	};
	
}(jQuery));