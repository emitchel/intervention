var app_id = 'mlfonYP5XuHFXO16m8sajJmVgUeYggOHhwaoB5cn';
var js_key = 'GJTanoFjm2AHg8EI1509wsyHfE1K7BgYFiUgieLT';

//Static class that can be used across the entire app
function Utils(){}

Utils.APP_ID = app_id;
Utils.JS_KEY = js_key;

Utils.showError = function(errorMsg){
	$(".error").html("<span class='error'>" + errorMsg + "</span>");
	$(".error").show("slow");
}

Utils.hideError = function(){
	$(".error").hide();
}
//everything that should run onLoad
$(document).ready(function() {
	Parse.initialize(Utils.APP_ID, Utils.JS_KEY);
	
	$(".error").hide();
	
});
