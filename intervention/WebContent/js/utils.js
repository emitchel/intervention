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

//Deprecated
Utils.getCurrentUser = function(){
	//refreshing current user
	Parse.User.current().fetch();
	return Parse.User.current();
}

Utils.getCurrentUser = function(shouldFetch){
	//refreshing current user
	if(shouldFetch){
		Parse.User.current().fetch();
	}
	return Parse.User.current();
}

Utils.userLoggedIn = function(){
	return Parse.User.current() !== null;
}

Utils.logout = function(){
	Parse.User.logOut();
	Utils.goPage(Urls.LOGIN);
}

Utils.setUserProperty = function(property,value){
	Parse.User.current().set(property,value);
	Parse.User.current().save();
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

Utils.formatCode = function(id){
	//1234356789
	//to 123 456 780
		var returnId="";
		//cast to string
		id = String(id)
		//split into char array
		id = id.split("");
		//iterate over each three and add a space in between
		for(var i = 0; i<id.length; i++){
			returnId+=id[i];
			
			//123
			if((i+1)%3==0)
				returnId+=" ";
		}
		
		return returnId;
	
}

Utils.containsPlayer = function(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i].id == obj.id) {
           return true;
       }
    }
    return false;
}
