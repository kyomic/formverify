(function(){
	

	$(document).delegate('change','radio',function(e){
		$(this).parent().toggleClass('radio-checked')
	})
})();