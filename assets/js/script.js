$(function(){
	
	var note = $('#note'),
		ts = new Date(2012, 10-1, 20),
		newYear = true;
		
	$('#countdown').countdown({
		timestamp	: ts,
		callback	: function(days, hours, minutes, seconds){
			
			var message = "";
			
			//message += days + " day" + ( days==1 ? '':'s' ) + ", ";
			//message += hours + " hour" + ( hours==1 ? '':'s' ) + ", ";
			//message += minutes + " minute" + ( minutes==1 ? '':'s' ) + " and ";
			//message += seconds + " second" + ( seconds==1 ? '':'s' ) + " <br>";
			message += "before registration ends!";
			
			note.html(message);
		}
	});
	
});
