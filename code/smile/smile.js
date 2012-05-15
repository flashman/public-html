$(document).ready( function(){
	happyText=[];
	sadText=[];
	nHappy = 0;
	nSad = 0;
	
	$.ajax({		
		type: 'GET',
		dataType: 'jsonp',
		url: "http://smart-ip.net/geoip-json?callback=jsonp?",
		success: function(data){ 
			loc = data;
			$.ajaxSetup({
				type: 'GET',
				dataType: 'jsonp',
				url: "http://search.twitter.com/search.json?"
			})
			
			$.ajax({		
				data:{"geocode": loc.latitude+','+loc.longitude+',1mi',
				'q':':)','rpp':'100','page':'1','result_type':'recent'},
				success: function(data){ 
					console.log(data.results);
					nHappy = data.results.length;
					$.ajax({
						data:{"geocode": loc.latitude+','+loc.longitude +',1mi', 
						'q':':(','rpp':'100','page':'1','result_type':'recent'},
						success: function(data){ 
							console.log(data.results);
							nSad = data.results.length; 
							console.log(nHappy);
							console.log(nSad);
						}
					});
				},
			});
		},
	});	
		    	
});