
//this object should only be called when
//we're ready to calculate the scores of a given question / game
var CalculateScores = function(game,question,callbackWhenFinished){
	var me = this;
	this.game = game;
	this.question = question;

	var numberOfVotes = 0;
	var minimumNumberOfVotesForMost = 0;
	//players who were voted for
	// var players = [];//of player

	//players who participated
	var participants = [];
	function setMostVotes(votes){
		if(votes%2==0){
			votes+=1;
		}

		minimumNumberOfVotesForMost = Math.ceil(votes/2);
	}

	// function player(user){
	// 	var me = this;
	// 	this.votes = 1;
	// 	this.user = user;

	// 	this.increment = function(){
	// 		me.votes+=1;
	// 	}

	// 	this.id = function(){
	// 		return me.user.id;
	// 	}
	// }

	function participant(user,guess){
		var me = this;
		this.user = user;
		this.score = 0;
		this.guess = guess;
		this.votes = 0;
		
		this.highestVoted = false;
		this.tiedWithHighestVotes = false;
		
		this.id = function(){
			return me.user.id;
		}

		this.increment = function(){
			me.votes+=1;
		}

	}

	this.init = function(){
		getGameAnswers();
	}

	
	
	function setQuestionResults(participants,index){
		if(index<participants.length){
			var participant = participants[index];
			var questionResults = Parse.Object.extend("questionResults");
			var query = new Parse.Query(questionResults);
			query.equalTo("question",me.question);
			query.equalTo("user",participant.user);
			query.equalTo("game",me.game);
			
			query.first({
			
				success: function(foundResult) {
					if(foundResult==undefined || foundResult.length==0){
						 var questionResults = Parse.Object.extend("questionResults");
						var result = new questionResults();
						result.set("game",me.game);
						result.set("user",participant.user);
						result.set("question",me.question);
						result.set("numberOfVotes",Number(participant.votes));
						result.set("points_received",Number(participant.score));
						result.set("user_guess",participant.guess);
						
						result.save(null, {
							success: function(result) {
							// Execute any logic that should take place after the object is saved.
							setQuestionResults(participants,++index);
							console.log("questionResult created");
						},
						error: function(result, error) {
							// Execute any logic that should take place if the save fails.
							// error is a Parse.Error with an error code and message.
							Utils.showError(error.message);
						}
					});
				} else {
					
					
					foundResult.set("numberOfVotes",Number(participant.votes));
					foundResult.set("points_received",Number(participant.score));
					foundResult.set("user_guess",participant.guess);
					foundResult.save(null, {
						success: function(newresult) {
							// Execute any logic that should take place after the object is saved.
							setQuestionResults(participants,++index);
							console.log("result updated");
						},
						error: function(newGame, error) {
							// Execute any logic that should take place if the save fails.
							// error is a Parse.Error with an error code and message.
							console.log(error.message)
						}
					});
				}

			},
			error: function(lock, error) {
				Utils.showError(error.message);
			}
			
		});
			
		} else {
			callbackWhenFinished();
		}
	}

	function checkParticipantGuesses(participants){
		//iterate through all participant check their guess (none, some, most);
	//if they guessed none, there better not be any players that exist with their id
	//if they guessed some, there must be a player with their id
							//&& the number of votes should be <minNumOfVotesForMost
	//if they guessed most, there must be a player with their id
							//&& the number of votes shoulder be >= minNumOfVotesForMost
	//if they guessed all, there must be a player with their id 
							//&& the number of votes shoulder == num of totall votes

		for(var i =0;i<participants.length;i++){
			var participant = participants[i];
			var guess = participant.guess.get("text");


			if(guess=="None"){
				if(participant.votes==0){
					participant.score = 3;
				}
			} else if (guess =="Some"){
				if(participant.votes > 0 && participant.votes < minimumNumberOfVotesForMost){
					participant.score = 1;
				}
			} else if(guess=="Most"){
				if(participant.votes >= minimumNumberOfVotesForMost){
					participant.score = 3;
				}
			} else if(guess= "All"){
				if(participant.votes == numberOfVotes){
					participant.score = 6;
				}
			}

			participants[i] = participant;
		}

		setQuestionResults(participants,0);

	}

	function makeParticipants(gameAnswers){
		
		function participantsContain(a, obj) {
		    var i = a.length;
		    while (i--) {
		       if (a[i].user.id == obj.id) {
		           return true;
		       }
		    }
		    return false;
		}

		function participantIndex(a, obj) {
		    var i = a.length;
		    while (i--) {
		       if (a[i].user.id == obj.id) {
		           return i;
		       }
		    }
		    return -1;
		}
		// for(var i=0;i<gameAnswers.length;i++){
		// 	//make a player() class every time a player is voted for (unless it's creatd)
		// 	//increment votes for each player.
		// 	var playerChosen = gameAnswer[i].get("player_chosen")
		// 	if(!Utils.containsPlayer(players,playerChosen)){
		// 		//add it to the list
		// 		var newPlayer = new player(playerChosen);
		// 		players.push(newPlayer);
		// 	} else {
		// 		//increment their score
		// 		var index = Utils.getPlayerIndex(players,playerChosen);
		// 		players[index].increment();
		// 	}

		// 	//making the participants
		// 	var newParticipant = new participant(gameAnswer[i].get("user"),gameAnswer[i].get("guess"));
		// 	particpants.push(newParticipant);
		// }

		for(var i=0;i<gameAnswers.length;i++){
			//making the participants
			var newParticipant = new participant(gameAnswers[i].get("user"),gameAnswers[i].get("guess"));
			participants.push(newParticipant);
		}

		for(var i=0;i<gameAnswers.length;i++){
			var playerChosen = gameAnswers[i].get("player_chosen")
			if(participantsContain(participants,playerChosen)){
				//increment their score
				var index = participantIndex(participants,playerChosen);
				participants[index].increment();
			}
		}

		checkParticipantGuesses(participants);
	}

	function getGameAnswers(){
		var gameAnswers = Parse.Object.extend("gameAnswers");
		var query = new Parse.Query(gameAnswers);
		query.equalTo("game",game);
		query.equalTo("question",currentquestion);
		query.include("user");
		query.include("guess");
		query.include("player_chosen");
		query
		.find({
			success : function(results) {
				if(results.length > 0){
					numberOfVotes = results.length;
					setMostVotes(numberOfVotes);
					makeParticipants(results);
				} else {
					Utils.showError("<strong>Awkward...</strong> No one answered to this question...");
				}
			}, 
			error : function(error) {
				Utils.showError(error.message);
			}
		});

	}

}
