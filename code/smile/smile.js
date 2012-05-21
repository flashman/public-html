$(document).ready( function(){
	text = '';
	sentiments=[];
		
	$.ajax({		
		type: 'GET',
		dataType: 'jsonp',
		crossDomain:'true',
		url: "http://smart-ip.net/geoip-json?callback=jsonp?",
		success: function(data){ 
			loc = data;
			$.ajaxSetup({
				type: 'GET',
				dataType: 'jsonp',
				crossDomain:'true',
				url: "http://search.twitter.com/search.json?"
			})
			
			$.ajax({		
				data:{"geocode": loc.latitude+','+loc.longitude+',1mi',
				'rpp':'100','page':'1','result_type':'recent'},
				success: function(data){
					for(i = 0; i< data.results.length; i++){
						//console.log(data.results[i].text);
						text = text + ' ' + data.results[i].text.replace(/[!@#$%^&*()_+-=\\0-9\'\":;?><,.]/g,'');
					}
					l = text.length;	
					i = 0;
					//while(l>0){
						//subtext = text.substring(l-350,l);						
						$.ajax({		
							type: 'GET',
							dataType: 'jsonp',
							crossDomain:'true',
							jsonp:'jsonp', //url:"http://www.viralheat.com/api/sentiment/review.json?", data:{'text':subtext,'api_key':'OyayNMNq5ec9eLkvj0'},
							url:"http://access.alchemyapi.com/calls/text/TextGetTextSentiment",
							data:{'text':text,'apikey':'16473e58c46e8306d9b4c355af33964bae1bbd8c','outputMode':'json'},
							success: function(data){
								console.log(data);
//								sentiments[i] = data["mood"] == 'negative' ? -1* data["prob"] : data["prob"]; 
//								console.log(sentiments[i]);
							}
						});
					//	l-=350;
					//	i++;
					//}
				}
			});
			
/*			$.ajax({		
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
*/		},
	});	
		    	
});