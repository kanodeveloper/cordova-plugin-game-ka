var events = {};


var addEventListener = function( eventName, fn )
{
    if( events.hasOwnProperty( eventName ) === false )
    {
        events[ eventName ] = [];
    }

    events[ eventName ].push( fn );

    return function()
    {
        removeEventListener( eventName, fn );
    }
}



var removeEventListener = function( eventName, fn )
{
    if( arguments.length === 0 )
    {
        events = {};
    }
    else
    {
        if( events.hasOwnProperty( eventName ) )
        {
        	if(typeof fn === 'undefined')
        	{
        		events[eventName] = [];
        	}
        	else
        	{
	            var eventCallbacks = events[ eventName ];
	            for( var i in eventCallbacks )
	            {
	                if( eventCallbacks[ i ] === fn )
	                {
	                    eventCallbacks.splice( i, 1 );
	                    break;
	                }
	            }
        	}
        }
    }
}


var triggerEvent = function( eventName )
{
    var slicedArgs = Array.prototype.slice.call( arguments, 1 );

    if( events.hasOwnProperty( eventName ) )
    {
        var eventCallbacks = events[ eventName ];
        for( var i in eventCallbacks )
        {
            eventCallbacks[ i ].apply( this, slicedArgs );
        }
    }
}


var Game = {

    _loggedin: false,

    on:function()
    {
    	return addEventListener.apply(this, arguments);
    },

    off:function()
    {
    	removeEventListener.apply(this, arguments);
    },

    subscribe:function()
    {
    	return addEventListener.apply(this, arguments);
    },

    unsubscribe:function()
    {
    	removeEventListener.apply(this, arguments);
    },

    setUp: function( successCallback, failCallback )
    {
        var self = this;
        cordova.exec( function( result )
        {
			if(typeof successCallback !== 'undefined')
			{
				successCallback(result);
			}

            triggerEvent( 'setupSuccess', result );
        }, function( error )
        {
            if(typeof failCallback !== 'undefined')
			{
				failCallback(error);
			}

            triggerEvent( 'setupFailed', error );
        }, "Game", "setUp", [] )
    },

    login: function(  successCallback, failCallback )
    {
        var self = this;
        cordova.exec( function( result )
        {
            var playerDetails = result;
            self._loggedin = true;


            if( self.onLoginSucceeded )
            {
                self.onLoginSucceeded( playerDetails );
            }

			if(typeof successCallback !== 'undefined')
			{
				successCallback(playerDetails);
			}

            triggerEvent( 'loginSuccess', playerDetails );

        }, function( error )
        {



            if( self.onLoginFailed )
            {
                self.onLoginFailed( error );
            }

			if(typeof failCallback !== 'undefined')
			{
				failCallback( error );
			}

            triggerEvent( 'loginFailed', error );

        }, "Game", "login", [] );
    },

    logout: function(successCallback, failCallback)
    {
        var self = this;
        cordova.exec( function( result )
            {
                self._loggedin = false;

				triggerEvent( 'logoutSuccess', result );

				if(typeof successCallback !== 'undefined')
				{
					successCallback( result );
				}

            },
            function( error )
            {
                triggerEvent( 'logoutFailed', error );

				if(typeof failCallback !== 'undefined')
				{
					failCallback( error );
				}

            }, "Game", "logout", [] );
    },

    isLoggedIn: function()
    {
        return this._loggedin;
    },

    submitScore: function( leaderboardId, score,  successCallback, failCallback )
    {
        var self = this;

        cordova.exec( function( result )
            {


                if( self.onSubmitScoreSucceeded )
                {
                    self.onSubmitScoreSucceeded( result );
                }

				if(typeof successCallback !== 'undefined')
				{
					successCallback( result );
				}

                triggerEvent( 'submitScoreSuccess', result );
                triggerEvent( 'submitScoreSuccess-' + leaderboardId, result );

            },
            function( error )
            {


                if( self.onSubmitScoreFailed )
                {
                    self.onSubmitScoreFailed( error );
                }

				if(typeof failCallback !== 'undefined')
				{
					failCallback( error );
				}

                triggerEvent( 'submitScoreFailed', error );
                triggerEvent( 'submitScoreFailed-' + leaderboardId, error );

            }, "Game", "submitScore", [ leaderboardId, score ] );
    },

    showLeaderboard: function( leaderboardId, successCallback, failCallback )
    {
        cordova.exec(
            function( result )
            {
				if(typeof successCallback !== 'undefined')
				{
					successCallback( result );
				}

                triggerEvent( 'showLeaderboardSuccess', result );
                triggerEvent( 'showLeaderboardSuccess-' + leaderboardId, result );
            },
            function( error )
            {
				if(typeof failCallback !== 'undefined')
				{
					failCallback( error );
				}

                triggerEvent( 'showLeaderboardFailed', error );
                triggerEvent( 'showLeaderboardFailed-' + leaderboardId, error );
            }, "Game", "showLeaderboard", [ leaderboardId ] );
    },

    showLeaderboards: function(successCallback, failCallback)
    {
        cordova.exec(
            function( result )
            {
				if(typeof successCallback !== 'undefined')
				{
					successCallback( result );
				}

                triggerEvent( 'showLeaderboardsSuccess', result );
            },
            function( error )
            {

				if(typeof failCallback !== 'undefined')
				{
					failCallback( error );
				}

                triggerEvent( 'showLeaderboardsFailed', error );
            }, "Game", "showLeaderboards", [] );
    },

    getPlayerScore: function( leaderboardId,  successCallback, failCallback )
    {
        var self = this;
        cordova.exec( function( result )
            {
                var playerScore = result;

                if( self.onGetPlayerScoreSucceeded )
                {
                    self.onGetPlayerScoreSucceeded( playerScore );
                }

				if(typeof successCallback !== 'undefined')
				{
					successCallback( playerScore );
				}

                triggerEvent( 'getPlayerScoreSuccess', result );
                triggerEvent( 'getPlayerScoreSuccess-' + leaderboardId, result );
            },
            function( error )
            {


                if( self.onGetPlayerScoreFailed )
                {
                    self.onGetPlayerScoreFailed( error );
                }

				if(typeof failCallback !== 'undefined')
				{
					failCallback( error );
				}

                triggerEvent( 'getPlayerScoreFailed', error );
                triggerEvent( 'getPlayerScoreFailed-' + leaderboardId, error );

            }, "Game", "getPlayerScore", [ leaderboardId ] );
    },


    unlockAchievement: function( achievementId,  successCallback, failCallback )
    {
        var self = this;
        cordova.exec( function( result )
            {


                if( self.onUnlockAchievementSucceeded )
                {
                    self.onUnlockAchievementSucceeded( result );
                }

				if( typeof successCallback !== 'undefined')
				{
					successCallback( result );
				}

                triggerEvent( 'unlockAchievementSuccess', result );
                triggerEvent( 'unlockAchievementSuccess-' + achievementId, result );
            },
            function( error )
            {


                if( self.onUnlockAchievementFailed )
                {
                    self.onUnlockAchievementFailed( error );
                }

				if( typeof failCallback !== 'undefined')
				{
					failCallback( error );
				}
                triggerEvent( 'unlockAchievementFailed', error );
                triggerEvent( 'unlockAchievementFailed-' + achievementId, error );

            }, "Game", "unlockAchievement", [ achievementId ] );
    },


    incrementAchievement: function( achievementId, incrementalStepOrCurrentPercent,  successCallback, failCallback )
    {
        var self = this;
        cordova.exec( function( result )
            {


                if( self.onIncrementAchievementSucceeded )
                {
                    self.onIncrementAchievementSucceeded( result );
                }

				if( typeof successCallback !== 'undefined')
				{
					successCallback( result );
				}

                triggerEvent( 'incrementAchievementSuccess', result );
                triggerEvent( 'incrementAchievementSuccess-' + achievementId, result );
            },
            function( error )
            {


                if( self.onIncrementAchievementFailed )
                {
                    self.onIncrementAchievementFailed( error );
                }

				if(typeof failCallback !== 'undefined')
				{
					failCallback( error );
				}

                triggerEvent( 'incrementAchievementFailed', result );
                triggerEvent( 'incrementAchievementFailed-' + achievementId, result );

            }, "Game", "incrementAchievement", [ achievementId, incrementalStepOrCurrentPercent ] );
    },

    showAchievements: function(successCallback, failCallback)
    {
        cordova.exec(
            function( result )
            {
				if( typeof successCallback !== 'undefined' )
				{
					successCallback( result );
				}

                triggerEvent( 'showAchievementsSuccess', result );
            },
            function( error )
            {
				if( typeof failCallback !== 'undefined' )
				{
					failCallback( error );
				}

                triggerEvent( 'showAchievementsFailed', error );
            }, "Game", "showAchievements", [] );
    },

    resetAchievements: function(successCallback, failCallback)
    {
        var self = this;
        cordova.exec( function( result )
            {
                if( self.onResetAchievementsSucceeded )
                {
                    self.onResetAchievementsSucceeded( result );
                }

				if( typeof successCallback !== 'undefined')
				{
					successCallback( result );
				}

                triggerEvent( 'resetAchievementsSuccess', result );
            },

            function( error )
            {
                if( self.onResetAchievementsFailed )
                {
                    self.onResetAchievementsFailed( error );
                }

				if( typeof failCallback !== 'undefined' )
				{
					failCallback( error );
				}

                triggerEvent( 'resetAchievementsFailed', error );

            }, "Game", "resetAchievements", [] );
    },
    getPlayerImage: function(successCallback, failCallback)
    {
        var self = this;
        cordova.exec( function( result )
            {
                var playerImageUrl = result;
                if( self.onGetPlayerImageSucceeded )
                {
                    self.onGetPlayerImageSucceeded( playerImageUrl );
                }

				if( typeof successCallback !== 'undefined' )
				{
					successCallback( result );
				}

                triggerEvent( 'getPlayerImageSuccess', result );
            },
            function( error )
            {
                if( self.onGetPlayerImageFailed )
                {
                    self.onGetPlayerImageFailed( error );
                }

				if( typeof failCallback !== 'undefined' )
				{
					failCallback( error );
				}

                triggerEvent( 'getPlayerImageFailed', error );

            }, "Game", "getPlayerImage", [] );
    },
    onSetupSucceeded: null,
    onSetupFailed: null,
    onLoginSucceeded: null,
    onLoginFailed: null,
    onSubmitScoreSucceeded: null,
    onSubmitScoreFailed: null,
    onGetPlayerScoreSucceeded: null,
    onGetPlayerScoreFailed: null,
    onUnlockAchievementSucceeded: null,
    onUnlockAchievementFailed: null,
    onIncrementAchievementSucceeded: null,
    onIncrementAchievementFailed: null,
    onResetAchievementsSucceeded: null,
    onResetAchievementsFailed: null,
    onGetPlayerImageSucceeded: null,
    onGetPlayerImageFailed: null
}

module.exports = Game;