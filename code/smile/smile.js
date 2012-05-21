$(document).ready( function(){

	var m = Math;
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var t; // timeout for animation
    
	var centerX = canvas.width / 2;
	var centerY = canvas.height / 2;
	var radius = 300;

	drawFace(0);
		
	$.ajaxSetup({
		type: 'GET',
		dataType: 'jsonp',
		crossDomain:'true',
	})
	
	$.ajax({		
		url: "http://smart-ip.net/geoip-json?callback=jsonp?",
		success: function(data){ 
			loc = data;
			$('#city').text( (data.city).toUpperCase());
			getTweetsByLocal(data.latitude, data.longitude, getSentiment);	
		}
	});	

	getTweetsByLocal = function(lat,lng,callback){
		var text = '';
	
		$.ajax({
			url: "http://search.twitter.com/search.json?",		
			data:{"geocode": lat+','+lng+',1mi',
			'rpp':'100','page':'1','result_type':'recent'},
			success: function(data){
				//assemble tweets into single symbol free text string
				for(i = 0; i< data.results.length; i++){
					text = text + ' ' + data.results[i].text.replace(/[@#$%^&*_+-=\\0-9\'\";?><,.]/g,'');
				}
				console.log(text)
				callback(text);
			}
		});
	}
	
	getSentiment = function(text){
		$.ajax({		
			jsonp:'jsonp',
			url:"http://access.alchemyapi.com/calls/text/TextGetTextSentiment",	data:{'text':text,'apikey':'16473e58c46e8306d9b4c355af33964bae1bbd8c','outputMode':'json'},
			success: function(data){
				console.log(data.docSentiment);
				drawFace(data.docSentiment.score);
			}
		});
	}
	
	function drawFace(s){
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.beginPath();
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context.lineWidth = 5;
		context.strokeStyle = "white";
		context.stroke();
		context.beginPath();
		context.arc(centerX-radius/2.5, centerY-radius/3, radius/7, 0, 2 * Math.PI, false);
		context.stroke();
		context.beginPath();
		context.arc(centerX+radius/2.5, centerY-radius/3, radius/7, 0, 2 * Math.PI, false);
		context.stroke();	
		drawSmile(s);
	}
	
	function drawSmile(s){
		context.beginPath();
		if(s>0.05 ){
			context.arc(centerX, centerY-radius/3.5, radius*(1-0.2),  Math.PI*(1/2 - 1/4),  Math.PI*(1/2 + 1/4), false);
		}
		else if(s<-0.05){
			context.arc(centerX, centerY + radius, radius*(1-0.2),  Math.PI*(3/2 - 1/4),  Math.PI*(3/2 + 1/4), false);		
		}
		else{
			context.moveTo(centerX-radius/1.8,centerY+radius/3.5)
			context.lineTo(centerX+radius/1.8,centerY+radius/3.5)			
		}
		context.stroke();
	}

});

