/**
*
* This page must be the last js loaded at run time. The following are what this class currently depends on
* -Urls.js
*
*
**/

//Private static vars
var app_id = 'mlfonYP5XuHFXO16m8sajJmVgUeYggOHhwaoB5cn';
var js_key = 'GJTanoFjm2AHg8EI1509wsyHfE1K7BgYFiUgieLT';

//Static class that can be used across the entire app
//as long as it's referenced
function Utils(){
}

//Public static vars
Utils.APP_ID = app_id;
Utils.JS_KEY = js_key;

Utils.GAME_ID_MIN = 100000000;
Utils.GAME_ID_MAX = 999999999;//100 000 000


//** DOM READY LOGIC
$(document).ready(function() {
	//Essential init call for Parse
	Parse.initialize(Utils.APP_ID, Utils.JS_KEY);
	//$(".error").hide();
});


/**
*  	Error Handling
* 	There must be a div with class name 'error' on the page
**/
Utils.showError = function(errorMsg){

	$(".error").html(errorMsg );
	$(".error").slideDown("slow");
}

Utils.hideError = function(){
	$(".error").slideUp("slow");
}

/**
* 	Generic useful methods
**/
Utils.getParameterByName = function(name){
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));

}

Utils.goPage = function(pageURL){
	window.location.href = pageURL;
}

Utils.isValidString = function(str){
         //not null                                                //not empty     
return  !(str === null || str === undefined || str == "null") && !(!str || 0 === str.length) 
}

Utils.getCurrentUser = function(){
	//refreshing current user
	Parse.User.current().fetch();
	return Parse.User.current();
}

Utils.userLoggedIn = function(){
	return Parse.User.current() !== null;
}

Utils.logout = function(){
	Parse.User.logOut();
	Utils.goPage(Urls.LOGIN);
}

Utils.sentEnterMethod = function(methodToCall){
$(document).bind('keypress', function(e){
   if(e.which === 13) { // return
     methodToCall();
   }
});
}

Utils.getRandomInt = function(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
