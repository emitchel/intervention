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

	$(".error").html('<button type="button" class="close" data-dismiss="alert">×</button>'+ errorMsg );
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

Utils.unsetProperty = function(property){
	Parse.User.current().unset(property);
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

Utils.removeSpace = function(str){
	return str.replace(/ /g,'');
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

Utils.getPlayerIndex = function(a,obj){
	var i = a.length;
    while (i--) {
       if (a[i].id == obj.id) {
           return i;
       }
    }
    return -1;
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

Utils.showScoreBoard = function(game,listOfPlayers){


	var html = "";
	var questionResults = Parse.Object.extend("questionResults");
			var query = new Parse.Query(questionResults);
			query.equalTo("game", game);
			query.include("user");
			query
			.find({
				success : function(results) {
					html = '<div class="player_wrapper row show-grid">'

					for(var i=0; i<listOfPlayers.length; i++){
						var panel = '<div class="col-xs-4"><div class="panel panel-default">  <div class="panel-heading">    <h3 class="panel-title">NAME</h3>  </div>  <div class="panel-body"><span class="score">SCORE</span></div></div></div>'	
						var score =0;
						for(var j = 0 ; j<results.length; j++){
							if(results[j].get("user").id == listOfPlayers[i].id){
								score += Number(results[j].get("points_received"));
							}
						}

						panel = panel.replace("NAME",listOfPlayers[i].get("displayName"))
						panel = panel.replace("SCORE",String(score));
						html+= panel;
					}

					html +='</div>';
					Utils.showModalData("Scoreboard",html,"Ok",function(){});
				},
				error : function(error) {
					Utils.showError(error.message);
				}
			});

}

Utils.showStats= function(gamerId){
	var user = Parse.Object.extend("User");
	var query = new Parse.Query(user);
	query.get(gamerId,{success:function(foundUser){

		var questionResults = Parse.Object.extend("questionResults");
					var query = new Parse.Query(questionResults);
					query.include("user_guess");
					query.equalTo("user",foundUser);
					query
					.find({
						success : function(results) {
							var html ='';
							var score= 0;
							var unanynamous = [];
							for(var i=0; i<results.length; i++){
								var amountThisRound =Number(results[i].get("points_received"));
								score += amountThisRound;

							}	

							html='<p><h1>Career Score: '+score+'</h1></p>'
							Utils.showModalData("User Stats for " + foundUser.get("displayName"),html,"Ok",function(){});
						},
						error : function(error) {
							Utils.showError(error.message);
						}
					});
	},error:function(object,error){
		Utils.showError(error.message);

	}});
}

Utils.showQuestionHistory = function (game){
		var html = "";
		var questionResults = Parse.Object.extend("questionResults");
			var query = new Parse.Query(questionResults);
			query.equalTo("game", game);
			query.include("question");
			query.include("user");
			query.include("user_guess");
			query
			.find({
				success : function(results) {
					html = '';
					var currentQuestion = results[0].get("question").get("question");
					html = '<p><h4>'+currentQuestion+'</h4></p><table class="table table-striped table-hover "><tr><th>User</th><th>Guess</th><th>Votes Received</th><th>Points Received</th></tr>'
					for(var i=0; i<results.length; i++){
						var thisQuestion = results[i].get("question").get("question");
						var numberOfVotesReceived = results[i].get("numberOfVotes");
						var numberOfPointsReceived = results[i].get("points_received");
						var displayName = results[i].get("user").get("displayName");
						var guess = results[i].get("user_guess").get("text");
						if(thisQuestion!=currentQuestion){
							//on new question, make new header and table
							currentQuestion = thisQuestion;
							html+="</table>"
							html += '<p><h4>'+currentQuestion+'</h4></p><table class="table table-striped table-hover "><tr><th>User</th><th>Guess</th><th>Votes Received</th><th>Points Received</th></tr>'
						} 
							//continue 
							html+='<tr><td>'+displayName+'</td><td>'+guess+'</td><td>'+numberOfVotesReceived+'</td><td>'+numberOfPointsReceived+'</td></tr>';
											
					}

					html +='</table>';
					Utils.showModalData("Question History",html,"Ok",function(){});
				},
				error : function(error) {
					Utils.showError(error.message);
				}
			});
}	

Utils.showModalData = function(heading,bodyHTML, okButtonTxt,callback){
	 var confirmModal = 
      $('<div class="modal fade">' +        
          '<div class="modal-dialog">' +
          '<div class="modal-content">' +
          '<div class="modal-header">' +
            '<a class="close" data-dismiss="modal" >&times;</a>' +
            '<h3>' + heading +'</h3>' +
          '</div>' +

          '<div class="modal-body">' +
            '<p>' + bodyHTML + '</p>' +
          '</div>' +

          '<div class="modal-footer">' +
            '<a href="#!" id="okButton" class="btn btn-primary">' + 
              okButtonTxt + 
            '</a>' +
          '</div>' +
          '</div>' +
          '</div>' +
        '</div>');

    confirmModal.find('#okButton').click(function(event) {
      callback();
      confirmModal.modal('hide');
    }); 

    confirmModal.modal('show');  
}

Utils.confirm = function(heading, question, cancelButtonTxt, okButtonTxt, callback) {

 var confirmModal = 
      $('<div class="modal fade">' +        
          '<div class="modal-dialog">' +
          '<div class="modal-content">' +
          '<div class="modal-header">' +
            '<a class="close" data-dismiss="modal" >&times;</a>' +
            '<h3>' + heading +'</h3>' +
          '</div>' +

          '<div class="modal-body">' +
            '<p>' + question + '</p>' +
          '</div>' +

          '<div class="modal-footer">' +
            '<a href="#!" class="btn" data-dismiss="modal">' + 
              cancelButtonTxt + 
            '</a>' +
            '<a href="#!" id="okButton" class="btn btn-primary">' + 
              okButtonTxt + 
            '</a>' +
          '</div>' +
          '</div>' +
          '</div>' +
        '</div>');

    confirmModal.find('#okButton').click(function(event) {
      callback();
      confirmModal.modal('hide');
    }); 

    confirmModal.modal('show');  
  };