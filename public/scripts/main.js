(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var getRosterAndGameData = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return app.getTeamRoster(id);

          case 2:
            app.teamRoster = _context.sent;
            _context.next = 5;
            return app.getGameData();

          case 5:
            app.gameData = _context.sent;

            // console.log(app.teamRoster.roster);
            app.displayTeamRoster(app.teamRoster.roster);
            app.aggregateGameData(app.gameData);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getRosterAndGameData(_x) {
    return _ref.apply(this, arguments);
  };
}();

// loop through the team roster
// create a list item and adding a class of player-info and attribute data-id with the player's id
// display player name in a p tag
// display jersey number
// display position code add attribute of data-pos to verify if player is goalie
// create displayed data as children to .roster-list
// hide team names

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = {};

app.apiURL = 'https://statsapi.web.nhl.com/api/v1/';
app.teamURL = 'teams';
app.teamRosterURL = 'roster';
app.playerURL = 'people';
app.recentStatsURL = 'stats?stats=statsSingleSeason&season=';
app.seasons = ['20172018', '20162017', '20152016'];
app.alphabeticalRoster = [];
app.chosenTeamName;
app.currentSeason = '';

app.ticketmasterApiURL = 'https://app.ticketmaster.com/discovery/v2/events.json';
app.ticketmasterApiKey = 'AabmVbCHA2zPjQoA1lb98cN1NQyuFGF4';
app.nextFiveGames = {};

// make an ajax call to return nhl teams then app.displayTeam is called with data.teams as the argument
app.getData = function () {
  $.ajax({
    url: app.apiURL + app.teamURL,
    method: 'GET',
    dataType: 'json'
  }).then(function (data) {
    app.displayTeam(data.teams);
    app.addMobileMenuItems(data.teams);
  });
};

// loop through each team
// create a variable, teamName that has: 
// - li tag with the attribute of data-id and the value team.id
// - class of team-name 
// - the li contains text, team.name
app.displayTeam = function (teams) {
  //Sort team alphabetically
  app.sortArrayObjects(teams);

  // teams.sort(function (a, b) {
  //   let alc = a.name.toLowerCase(),
  //     blc = b.name.toLowerCase();
  //   return alc > blc ? 1 : alc < blc ? -1 : 0;
  // });

  teams.forEach(function (team) {
    var teamContainer = $('<li>').addClass('team-container').attr('data-id', team.id).attr('data-team-name', team.name);
    var teamItem = $('<button>').addClass('team');
    var teamImageContainer = $('<div>').addClass('team-image-container');
    var teamImage = $('<img>').addClass('team-image').attr('src', 'public/images/logo-' + team.id + '.png').attr('alt', team.name + ' logo');
    var teamName = $('<p>').attr('data-id', team.id).attr('data-team-name', team.name).addClass('team-name').text(team.shortName);
    $(teamImageContainer).append(teamImage);
    $(teamItem).append(teamImageContainer, teamName);
    $(teamContainer).append(teamItem);
    $('.teams ul').append(teamContainer);
  });
};

app.sortArrayObjects = function (arrayObjects) {
  arrayObjects.sort(function (a, b) {
    var alc = a.name.toLowerCase(),
        blc = b.name.toLowerCase();
    return alc > blc ? 1 : alc < blc ? -1 : 0;
  });
};
app.addMobileMenuItems = function (teams) {
  app.sortArrayObjects(teams);

  teams.forEach(function (team) {
    var teamContainer = $('<li>').addClass('team-container').attr('data-id', team.id).attr('data-team-name', team.name);
    var teamItem = $('<button>').addClass('team');
    var teamImageContainer = $('<div>').addClass('team-image-container');
    var teamImage = $('<img>').addClass('team-image').attr('src', 'public/images/logo-' + team.id + '.png');
    var teamName = $('<p>').attr('data-id', team.id).attr('data-team-name', team.name).addClass('team-name').text(team.shortName);
    $(teamImageContainer).append(teamImage);
    $(teamItem).append(teamImageContainer, teamName);
    $(teamContainer).append(teamItem);
    $('.nav-menu').append(teamContainer);
  });
};
// When I click a team, load the roster for that team. I need to get and store the ID from the data-id when I click the team.
// make an ajax call to grab the roster information of the specific team
// pass data (player names) to displayTeamRoster
app.getTeamRoster = function (id) {
  return $.ajax({
    url: app.apiURL + app.teamURL + '/' + id + '/' + app.teamRosterURL,
    method: 'GET',
    dataType: 'json'
  });
  // .then((teamRoster) => {
  //   app.displayTeamRoster(teamRoster.roster);
  // })
};

app.getGameData = function () {
  return $.ajax({
    url: app.ticketmasterApiURL,
    method: 'GET',
    dataType: 'json',
    data: {
      apikey: app.ticketmasterApiKey,
      keyword: app.chosenTeamName,
      sort: 'date,asc',
      size: "3",
      classificationName: 'NHL'
    }
  });
};

app.aggregateGameData = function (data) {

  data = data._embedded.events;

  data.forEach(function (data) {
    var gameLink = $('<a>').addClass('game-link').attr('href', data.url).attr('target', '_blank');
    var opponentsContainer = $('<div>').addClass('opponents-container');
    var opponents = $('<p>').text(data.name);
    var gameInfoContainer = $('<div>').addClass('game-info-container');
    var gameDate = $('<p>').addClass('game-date').text(data.dates.start.localDate);
    var gameTime = $('<p>').addClass('game-time').text(data.dates.start.localTime);
    var buyNow = $('<p>').addClass('buy-now').text('Buy Now');

    opponentsContainer.append(opponents);
    gameInfoContainer.append(gameDate, gameTime);
    gameLink.append(opponentsContainer, gameInfoContainer, buyNow);

    $('.games-container').append(gameLink);
  });
};

app.displayTeamRoster = function (roster) {
  //Sorting the roster by alphabetical order;
  $('.chosen-team-page').removeClass('hide');
  $('.games-container').empty();
  $('.roster-list').empty();
  $('.nav-menu').hide();

  roster.sort(function (a, b) {
    var alc = a.person.fullName.toLowerCase(),
        blc = b.person.fullName.toLowerCase();
    return alc > blc ? 1 : alc < blc ? -1 : 0;
  });

  roster.forEach(function (players) {
    var playerInfo = $('<li>').addClass('player-info accordion').attr('data-id', players.person.id).attr('data-pos', players.position.name).attr('data-name', players.person.fullName).attr('data-number', players.jerseyNumber);
    var playerInfoButtonContainer = $('<button>').addClass('player');
    app.playerAccordionContentContainer = $('<div>').addClass('accordion-content-container').attr('id', players.person.id);
    // const fakeData = $('<p>').text('fake data fake data')
    var playerName = $('<p>').addClass('player-name').text(players.person.fullName);
    var playerNumber = $('<span>').text(players.jerseyNumber);
    var playerPosition = $('<p>').addClass('player-number').attr("data-pos", players.position.name).text(players.position.code);
    playerInfoButtonContainer.append(playerNumber, playerPosition, playerName);
    playerInfo.append(playerInfoButtonContainer, app.playerAccordionContentContainer);
    $('.roster-list').append(playerInfo);
  });

  app.updateHeader(app.chosenTeamName);
  app.addHideClass('.teams');
};

app.getPlayerStats = function (season) {
  $.ajax({
    url: app.apiURL + app.playerURL + '/' + app.playerID + '/' + (app.recentStatsURL + season) + ' ',
    method: 'GET',
    dataType: 'json'
  }).then(function (playerStats) {
    var statList = playerStats.stats[0].splits[0].stat;
    app.currentSeason = season;

    if (app.playerPosition === 'Goalie') {
      app.displayGoalieStats(statList);
    } else {
      app.displayPlayerStats(statList);
    }
  });
};

app.displayGoalieStats = function (player) {
  app.addHideClass('.roster-list');

  // if goalie display: savePercentage, wins, goalsAgainstAverage, games played, shutouts
  console.log(player);
  var playerSeasonStatContainer = $('<div>').addClass('season-stats').attr('data-season', app.currentSeason);
  var playerSeason = $('<p>').text(app.currentSeason);
  var playerSavePercentage = $('<p>').text('Save Percentage: ' + player.savePercentage);
  var playerWins = $('<p>').text('Wins: ' + player.wins);
  var playerGoalsAgainstAverage = $('<p>').text('Goals Against Average: ' + player.goalAgainstAverage);
  var playerGames = $('<p>').text('Games Played: ' + player.games);
  var playerShutouts = $('<p>').text('Shutouts: ' + player.shutouts);
  $(playerSeasonStatContainer).append(playerSeason, playerSavePercentage, playerWins, playerGoalsAgainstAverage, playerGames, playerShutouts);
  $('#' + app.playerID).append(playerSeasonStatContainer);
};

// hide roster list
// display goalie stats else display other play stats
app.displayPlayerStats = function (player) {
  app.addHideClass('.roster-list');

  var playerSeasonStatContainer = $('<div>').addClass('season-stats').attr('data-season', app.currentSeason);
  var playerSeason = $('<p>').addClass('player-season').text(app.currentSeason);
  var playerAssists = $('<p>').text('assists: ' + player.assists);
  var playerGoals = $('<p>').text('goals: ' + player.goals);
  var playerPoints = $('<p>').text('points: ' + player.points);
  var playerGames = $('<p>').text('games played: ' + player.games);
  var playerGameWinningGoals = $('<p>').text('game winning goals: ' + player.gameWinningGoals);
  var playerPlusMinus = $('<p>').text('+-: ' + player.plusMinus);
  $(playerSeasonStatContainer).append(playerSeason, playerAssists, playerGoals, playerPoints, playerGames, playerGameWinningGoals, playerPlusMinus);

  $('#' + app.playerID).append(playerSeasonStatContainer);

  // if ($('.season-stats').data('season') === 20172018) {
  //   $('.seaon-stats:nth-child(1)').append('<div>2017 2018</div>');
  // };
};

app.accordion = function () {
  $(".accordion").accordion({
    collapsible: true,
    header: 'button',
    heightStyle: "content"
  });
};

app.updateHeader = function (heading) {
  $('header .hero h1').text(heading);
};

app.addHideClass = function (selector) {
  $(selector).addClass('hide');
};

// EVENT FUNCTIONS

// listening for a click on the class team-name
// item that is clicked, has its data-id value stored in teamID
// teamID is passed to getTeamRoster
app.getTeamID = function () {
  $('ul').on('click', '.team-container', function () {
    var teamID = $(this).data('id');
    app.chosenTeamName = $(this).data('team-name');
    // app.getTeamRoster(id);
    getRosterAndGameData(teamID);
    $('.menu-icon').toggleClass('open');
    // app.getGameData();
  });
};

// click event on player
// pass playerID to getPlayerStats
app.getPlayerID = function () {
  $('.roster-list').on('click', '.player-info', function () {
    app.playerID = $(this).data('id');
    app.playerPosition = $(this).data('pos');
    app.seasons.map(app.getPlayerStats);
    $('#' + app.playerID).empty();
    app.accordion();
  });
};

app.mobileNavToggle = function () {
  $('.nav-menu').hide();
  $('.menu-icon').on('click', function () {
    $(this).toggleClass('open');
    $('.nav-menu').slideToggle(300);
  });
};

app.events = function () {
  app.getTeamID();
  app.getPlayerID();
  app.mobileNavToggle();
};

app.init = function () {
  app.getData();
  app.events();
};

$(function () {
  app.init();
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O3FFQ2lJQSxpQkFBb0MsRUFBcEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQ3lCLElBQUksYUFBSixDQUFrQixFQUFsQixDQUR6Qjs7QUFBQTtBQUNFLGdCQUFJLFVBRE47QUFBQTtBQUFBLG1CQUV3QixJQUFJLFdBQUosRUFGeEI7O0FBQUE7QUFFRSxnQkFBSSxRQUZOOztBQUdFO0FBQ0EsZ0JBQUksaUJBQUosQ0FBc0IsSUFBSSxVQUFKLENBQWUsTUFBckM7QUFDQSxnQkFBSSxpQkFBSixDQUFzQixJQUFJLFFBQTFCOztBQUxGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7O2tCQUFlLG9COzs7OztBQVFmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBL0lBLElBQU0sTUFBTSxFQUFaOztBQUVBLElBQUksTUFBSixHQUFhLHNDQUFiO0FBQ0EsSUFBSSxPQUFKLEdBQWMsT0FBZDtBQUNBLElBQUksYUFBSixHQUFvQixRQUFwQjtBQUNBLElBQUksU0FBSixHQUFnQixRQUFoQjtBQUNBLElBQUksY0FBSixHQUFxQix1Q0FBckI7QUFDQSxJQUFJLE9BQUosR0FBYyxDQUFDLFVBQUQsRUFBYSxVQUFiLEVBQXdCLFVBQXhCLENBQWQ7QUFDQSxJQUFJLGtCQUFKLEdBQXlCLEVBQXpCO0FBQ0EsSUFBSSxjQUFKO0FBQ0EsSUFBSSxhQUFKLEdBQW9CLEVBQXBCOztBQUVBLElBQUksa0JBQUosR0FBeUIsdURBQXpCO0FBQ0EsSUFBSSxrQkFBSixHQUF5QixrQ0FBekI7QUFDQSxJQUFJLGFBQUosR0FBb0IsRUFBcEI7O0FBRUE7QUFDQSxJQUFJLE9BQUosR0FBYyxZQUFNO0FBQ2xCLElBQUUsSUFBRixDQUFPO0FBQ0wsU0FBSyxJQUFJLE1BQUosR0FBYSxJ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OiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgYXBwID0ge307XG5cbmFwcC5hcGlVUkwgPSAnaHR0cHM6Ly9zdGF0c2FwaS53ZWIubmhsLmNvbS9hcGkvdjEvJztcbmFwcC50ZWFtVVJMID0gJ3RlYW1zJztcbmFwcC50ZWFtUm9zdGVyVVJMID0gJ3Jvc3Rlcic7XG5hcHAucGxheWVyVVJMID0gJ3Blb3BsZSc7XG5hcHAucmVjZW50U3RhdHNVUkwgPSAnc3RhdHM/c3RhdHM9c3RhdHNTaW5nbGVTZWFzb24mc2Vhc29uPSc7XG5hcHAuc2Vhc29ucyA9IFsnMjAxNzIwMTgnLCAnMjAxNjIwMTcnLCcyMDE1MjAxNicgXTtcbmFwcC5hbHBoYWJldGljYWxSb3N0ZXIgPSBbXTtcbmFwcC5jaG9zZW5UZWFtTmFtZTtcbmFwcC5jdXJyZW50U2Vhc29uID0gJyc7XG5cbmFwcC50aWNrZXRtYXN0ZXJBcGlVUkwgPSAnaHR0cHM6Ly9hcHAudGlja2V0bWFzdGVyLmNvbS9kaXNjb3ZlcnkvdjIvZXZlbnRzLmpzb24nO1xuYXBwLnRpY2tldG1hc3RlckFwaUtleSA9ICdBYWJtVmJDSEEyelBqUW9BMWxiOThjTjFOUXl1RkdGNCc7XG5hcHAubmV4dEZpdmVHYW1lcyA9IHt9O1xuXG4vLyBtYWtlIGFuIGFqYXggY2FsbCB0byByZXR1cm4gbmhsIHRlYW1zIHRoZW4gYXBwLmRpc3BsYXlUZWFtIGlzIGNhbGxlZCB3aXRoIGRhdGEudGVhbXMgYXMgdGhlIGFyZ3VtZW50XG5hcHAuZ2V0RGF0YSA9ICgpID0+IHtcbiAgJC5hamF4KHtcbiAgICB1cmw6IGFwcC5hcGlVUkwgKyBhcHAudGVhbVVSTCxcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIGRhdGFUeXBlOiAnanNvbicsXG4gIH0pXG4gIC50aGVuKChkYXRhKSA9PiB7XG4gICAgYXBwLmRpc3BsYXlUZWFtKGRhdGEudGVhbXMpO1xuICAgIGFwcC5hZGRNb2JpbGVNZW51SXRlbXMoZGF0YS50ZWFtcyk7XG4gIH0pXG59XG5cbi8vIGxvb3AgdGhyb3VnaCBlYWNoIHRlYW1cbi8vIGNyZWF0ZSBhIHZhcmlhYmxlLCB0ZWFtTmFtZSB0aGF0IGhhczogXG4vLyAtIGxpIHRhZyB3aXRoIHRoZSBhdHRyaWJ1dGUgb2YgZGF0YS1pZCBhbmQgdGhlIHZhbHVlIHRlYW0uaWRcbi8vIC0gY2xhc3Mgb2YgdGVhbS1uYW1lIFxuLy8gLSB0aGUgbGkgY29udGFpbnMgdGV4dCwgdGVhbS5uYW1lXG5hcHAuZGlzcGxheVRlYW0gPSAodGVhbXMpID0+IHtcbiAgLy9Tb3J0IHRlYW0gYWxwaGFiZXRpY2FsbHlcbiAgYXBwLnNvcnRBcnJheU9iamVjdHModGVhbXMpO1xuXG4gIC8vIHRlYW1zLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgLy8gICBsZXQgYWxjID0gYS5uYW1lLnRvTG93ZXJDYXNlKCksXG4gIC8vICAgICBibGMgPSBiLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgLy8gICByZXR1cm4gYWxjID4gYmxjID8gMSA6IGFsYyA8IGJsYyA/IC0xIDogMDtcbiAgLy8gfSk7XG5cbiAgdGVhbXMuZm9yRWFjaCgodGVhbSkgPT4ge1xuICAgIGNvbnN0IHRlYW1Db250YWluZXIgPSAkKCc8bGk+JykuYWRkQ2xhc3MoJ3RlYW0tY29udGFpbmVyJykuYXR0cignZGF0YS1pZCcsIHRlYW0uaWQpLmF0dHIoJ2RhdGEtdGVhbS1uYW1lJywgdGVhbS5uYW1lKTtcbiAgICBjb25zdCB0ZWFtSXRlbSA9ICQoJzxidXR0b24+JykuYWRkQ2xhc3MoJ3RlYW0nKTtcbiAgICBjb25zdCB0ZWFtSW1hZ2VDb250YWluZXIgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCd0ZWFtLWltYWdlLWNvbnRhaW5lcicpO1xuICAgIGNvbnN0IHRlYW1JbWFnZSA9ICQoJzxpbWc+JykuYWRkQ2xhc3MoJ3RlYW0taW1hZ2UnKS5hdHRyKCdzcmMnLCBgcHVibGljL2ltYWdlcy9sb2dvLSR7dGVhbS5pZH0ucG5nYCkuYXR0cignYWx0JywgYCR7dGVhbS5uYW1lfSBsb2dvYCk7XG4gICAgY29uc3QgdGVhbU5hbWUgPSAkKCc8cD4nKS5hdHRyKCdkYXRhLWlkJywgdGVhbS5pZCkuYXR0cignZGF0YS10ZWFtLW5hbWUnLCB0ZWFtLm5hbWUpLmFkZENsYXNzKCd0ZWFtLW5hbWUnKS50ZXh0KHRlYW0uc2hvcnROYW1lKTtcbiAgICAkKHRlYW1JbWFnZUNvbnRhaW5lcikuYXBwZW5kKHRlYW1JbWFnZSk7XG4gICAgJCh0ZWFtSXRlbSkuYXBwZW5kKHRlYW1JbWFnZUNvbnRhaW5lciwgdGVhbU5hbWUpO1xuICAgICQodGVhbUNvbnRhaW5lcikuYXBwZW5kKHRlYW1JdGVtKVxuICAgICQoJy50ZWFtcyB1bCcpLmFwcGVuZCh0ZWFtQ29udGFpbmVyKTtcbiAgfSlcbn07IFxuXG5hcHAuc29ydEFycmF5T2JqZWN0cyA9IChhcnJheU9iamVjdHMpID0+IHtcbiAgYXJyYXlPYmplY3RzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICBsZXQgYWxjID0gYS5uYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICBibGMgPSBiLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gYWxjID4gYmxjID8gMSA6IGFsYyA8IGJsYyA/IC0xIDogMDtcbiAgfSk7XG59XG5hcHAuYWRkTW9iaWxlTWVudUl0ZW1zID0gKHRlYW1zKSA9PiB7XG4gYXBwLnNvcnRBcnJheU9iamVjdHModGVhbXMpO1xuIFxuIHRlYW1zLmZvckVhY2goKHRlYW0pID0+IHtcbiAgY29uc3QgdGVhbUNvbnRhaW5lciA9ICQoJzxsaT4nKS5hZGRDbGFzcygndGVhbS1jb250YWluZXInKS5hdHRyKCdkYXRhLWlkJywgdGVhbS5pZCkuYXR0cignZGF0YS10ZWFtLW5hbWUnLCB0ZWFtLm5hbWUpO1xuICBjb25zdCB0ZWFtSXRlbSA9ICQoJzxidXR0b24+JykuYWRkQ2xhc3MoJ3RlYW0nKTtcbiAgY29uc3QgdGVhbUltYWdlQ29udGFpbmVyID0gJCgnPGRpdj4nKS5hZGRDbGFzcygndGVhbS1pbWFnZS1jb250YWluZXInKTtcbiAgY29uc3QgdGVhbUltYWdlID0gJCgnPGltZz4nKS5hZGRDbGFzcygndGVhbS1pbWFnZScpLmF0dHIoJ3NyYycsIGBwdWJsaWMvaW1hZ2VzL2xvZ28tJHt0ZWFtLmlkfS5wbmdgKTtcbiAgY29uc3QgdGVhbU5hbWUgPSAkKCc8cD4nKS5hdHRyKCdkYXRhLWlkJywgdGVhbS5pZCkuYXR0cignZGF0YS10ZWFtLW5hbWUnLCB0ZWFtLm5hbWUpLmFkZENsYXNzKCd0ZWFtLW5hbWUnKS50ZXh0KHRlYW0uc2hvcnROYW1lKTtcbiAgJCh0ZWFtSW1hZ2VDb250YWluZXIpLmFwcGVuZCh0ZWFtSW1hZ2UpO1xuICAkKHRlYW1JdGVtKS5hcHBlbmQodGVhbUltYWdlQ29udGFpbmVyLCB0ZWFtTmFtZSk7XG4gICQodGVhbUNvbnRhaW5lcikuYXBwZW5kKHRlYW1JdGVtKVxuICAkKCcubmF2LW1lbnUnKS5hcHBlbmQodGVhbUNvbnRhaW5lcik7XG4gfSlcbn1cbi8vIFdoZW4gSSBjbGljayBhIHRlYW0sIGxvYWQgdGhlIHJvc3RlciBmb3IgdGhhdCB0ZWFtLiBJIG5lZWQgdG8gZ2V0IGFuZCBzdG9yZSB0aGUgSUQgZnJvbSB0aGUgZGF0YS1pZCB3aGVuIEkgY2xpY2sgdGhlIHRlYW0uXG4vLyBtYWtlIGFuIGFqYXggY2FsbCB0byBncmFiIHRoZSByb3N0ZXIgaW5mb3JtYXRpb24gb2YgdGhlIHNwZWNpZmljIHRlYW1cbi8vIHBhc3MgZGF0YSAocGxheWVyIG5hbWVzKSB0byBkaXNwbGF5VGVhbVJvc3RlclxuYXBwLmdldFRlYW1Sb3N0ZXIgPSAoaWQpID0+IHtcbiAgcmV0dXJuICQuYWpheCh7XG4gICAgdXJsOiBgJHthcHAuYXBpVVJMICsgYXBwLnRlYW1VUkx9LyR7aWR9LyR7YXBwLnRlYW1Sb3N0ZXJVUkx9YCxcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIGRhdGFUeXBlOiAnanNvbicsXG4gIH0pXG4gIC8vIC50aGVuKCh0ZWFtUm9zdGVyKSA9PiB7XG4gIC8vICAgYXBwLmRpc3BsYXlUZWFtUm9zdGVyKHRlYW1Sb3N0ZXIucm9zdGVyKTtcbiAgLy8gfSlcbn1cblxuYXBwLmdldEdhbWVEYXRhID0gKCkgPT4ge1xuICByZXR1cm4gJC5hamF4KHtcbiAgICB1cmw6IGFwcC50aWNrZXRtYXN0ZXJBcGlVUkwsXG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgIGRhdGE6IHtcbiAgICAgIGFwaWtleTogYXBwLnRpY2tldG1hc3RlckFwaUtleSxcbiAgICAgIGtleXdvcmQ6IGFwcC5jaG9zZW5UZWFtTmFtZSxcbiAgICAgIHNvcnQ6ICdkYXRlLGFzYycsXG4gICAgICBzaXplOiBcIjNcIixcbiAgICAgIGNsYXNzaWZpY2F0aW9uTmFtZTogJ05ITCdcbiAgICB9XG4gIH0pXG59XG5cbmFwcC5hZ2dyZWdhdGVHYW1lRGF0YSA9IChkYXRhKSA9PiB7XG4gIFxuICBkYXRhID0gZGF0YS5fZW1iZWRkZWQuZXZlbnRzO1xuXG4gIGRhdGEuZm9yRWFjaCgoZGF0YSkgPT4ge1xuICAgIGNvbnN0IGdhbWVMaW5rID0gJCgnPGE+JykuYWRkQ2xhc3MoJ2dhbWUtbGluaycpLmF0dHIoJ2hyZWYnLCBkYXRhLnVybCkuYXR0cigndGFyZ2V0JywgJ19ibGFuaycpO1xuICAgIGNvbnN0IG9wcG9uZW50c0NvbnRhaW5lciA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ29wcG9uZW50cy1jb250YWluZXInKTtcbiAgICBjb25zdCBvcHBvbmVudHMgPSAkKCc8cD4nKS50ZXh0KGRhdGEubmFtZSk7XG4gICAgY29uc3QgZ2FtZUluZm9Db250YWluZXIgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdnYW1lLWluZm8tY29udGFpbmVyJyk7XG4gICAgY29uc3QgZ2FtZURhdGUgPSAkKCc8cD4nKS5hZGRDbGFzcygnZ2FtZS1kYXRlJykudGV4dChkYXRhLmRhdGVzLnN0YXJ0LmxvY2FsRGF0ZSk7XG4gICAgY29uc3QgZ2FtZVRpbWUgPSAkKCc8cD4nKS5hZGRDbGFzcygnZ2FtZS10aW1lJykudGV4dChkYXRhLmRhdGVzLnN0YXJ0LmxvY2FsVGltZSk7XG4gICAgY29uc3QgYnV5Tm93ID0gJCgnPHA+JykuYWRkQ2xhc3MoJ2J1eS1ub3cnKS50ZXh0KCdCdXkgTm93JylcblxuICAgIG9wcG9uZW50c0NvbnRhaW5lci5hcHBlbmQob3Bwb25lbnRzKTtcbiAgICBnYW1lSW5mb0NvbnRhaW5lci5hcHBlbmQoZ2FtZURhdGUsIGdhbWVUaW1lKTtcbiAgICBnYW1lTGluay5hcHBlbmQob3Bwb25lbnRzQ29udGFpbmVyLGdhbWVJbmZvQ29udGFpbmVyLCBidXlOb3cpO1xuXG4gICAgJCgnLmdhbWVzLWNvbnRhaW5lcicpLmFwcGVuZChnYW1lTGluayk7XG4gIH0pXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFJvc3RlckFuZEdhbWVEYXRhKGlkKSB7XG4gIGFwcC50ZWFtUm9zdGVyID0gYXdhaXQgYXBwLmdldFRlYW1Sb3N0ZXIoaWQpO1xuICBhcHAuZ2FtZURhdGEgID0gYXdhaXQgYXBwLmdldEdhbWVEYXRhKCk7XG4gIC8vIGNvbnNvbGUubG9nKGFwcC50ZWFtUm9zdGVyLnJvc3Rlcik7XG4gIGFwcC5kaXNwbGF5VGVhbVJvc3RlcihhcHAudGVhbVJvc3Rlci5yb3N0ZXIpXG4gIGFwcC5hZ2dyZWdhdGVHYW1lRGF0YShhcHAuZ2FtZURhdGEpO1xufVxuXG4vLyBsb29wIHRocm91Z2ggdGhlIHRlYW0gcm9zdGVyXG4vLyBjcmVhdGUgYSBsaXN0IGl0ZW0gYW5kIGFkZGluZyBhIGNsYXNzIG9mIHBsYXllci1pbmZvIGFuZCBhdHRyaWJ1dGUgZGF0YS1pZCB3aXRoIHRoZSBwbGF5ZXIncyBpZFxuLy8gZGlzcGxheSBwbGF5ZXIgbmFtZSBpbiBhIHAgdGFnXG4vLyBkaXNwbGF5IGplcnNleSBudW1iZXJcbi8vIGRpc3BsYXkgcG9zaXRpb24gY29kZSBhZGQgYXR0cmlidXRlIG9mIGRhdGEtcG9zIHRvIHZlcmlmeSBpZiBwbGF5ZXIgaXMgZ29hbGllXG4vLyBjcmVhdGUgZGlzcGxheWVkIGRhdGEgYXMgY2hpbGRyZW4gdG8gLnJvc3Rlci1saXN0XG4vLyBoaWRlIHRlYW0gbmFtZXNcblxuYXBwLmRpc3BsYXlUZWFtUm9zdGVyID0gKHJvc3RlcikgPT4ge1xuICAvL1NvcnRpbmcgdGhlIHJvc3RlciBieSBhbHBoYWJldGljYWwgb3JkZXI7XG4gICQoJy5jaG9zZW4tdGVhbS1wYWdlJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcbiAgJCgnLmdhbWVzLWNvbnRhaW5lcicpLmVtcHR5KCk7XG4gICQoJy5yb3N0ZXItbGlzdCcpLmVtcHR5KCk7XG4gICQoJy5uYXYtbWVudScpLmhpZGUoKTtcbiAgXG4gIHJvc3Rlci5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgbGV0IGFsYyA9IGEucGVyc29uLmZ1bGxOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICBibGMgPSBiLnBlcnNvbi5mdWxsTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBhbGMgPiBibGMgPyAxIDogYWxjIDwgYmxjID8gLTEgOiAwO1xuICB9KTtcblxuICByb3N0ZXIuZm9yRWFjaCgocGxheWVycykgPT4ge1xuICAgIGNvbnN0IHBsYXllckluZm8gPSAkKCc8bGk+JykuYWRkQ2xhc3MoJ3BsYXllci1pbmZvIGFjY29yZGlvbicpLmF0dHIoJ2RhdGEtaWQnLCBwbGF5ZXJzLnBlcnNvbi5pZClcbiAgICAuYXR0cignZGF0YS1wb3MnLCBwbGF5ZXJzLnBvc2l0aW9uLm5hbWUpLmF0dHIoJ2RhdGEtbmFtZScsIHBsYXllcnMucGVyc29uLmZ1bGxOYW1lKS5hdHRyKCdkYXRhLW51bWJlcicsIHBsYXllcnMuamVyc2V5TnVtYmVyKTtcbiAgICBjb25zdCBwbGF5ZXJJbmZvQnV0dG9uQ29udGFpbmVyID0gJCgnPGJ1dHRvbj4nKS5hZGRDbGFzcygncGxheWVyJyk7XG4gICAgYXBwLnBsYXllckFjY29yZGlvbkNvbnRlbnRDb250YWluZXIgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdhY2NvcmRpb24tY29udGVudC1jb250YWluZXInKS5hdHRyKCdpZCcsIHBsYXllcnMucGVyc29uLmlkKTtcbiAgICAvLyBjb25zdCBmYWtlRGF0YSA9ICQoJzxwPicpLnRleHQoJ2Zha2UgZGF0YSBmYWtlIGRhdGEnKVxuICAgIGNvbnN0IHBsYXllck5hbWUgPSAkKCc8cD4nKS5hZGRDbGFzcygncGxheWVyLW5hbWUnKS50ZXh0KHBsYXllcnMucGVyc29uLmZ1bGxOYW1lKTtcbiAgICBjb25zdCBwbGF5ZXJOdW1iZXIgPSAkKCc8c3Bhbj4nKS50ZXh0KHBsYXllcnMuamVyc2V5TnVtYmVyKTtcbiAgICBjb25zdCBwbGF5ZXJQb3NpdGlvbiA9ICQoJzxwPicpLmFkZENsYXNzKCdwbGF5ZXItbnVtYmVyJykuYXR0cihcImRhdGEtcG9zXCIsIHBsYXllcnMucG9zaXRpb24ubmFtZSkudGV4dChwbGF5ZXJzLnBvc2l0aW9uLmNvZGUpO1xuICAgIHBsYXllckluZm9CdXR0b25Db250YWluZXIuYXBwZW5kKHBsYXllck51bWJlciwgcGxheWVyUG9zaXRpb24sIHBsYXllck5hbWUpO1xuICAgIHBsYXllckluZm8uYXBwZW5kKHBsYXllckluZm9CdXR0b25Db250YWluZXIsIGFwcC5wbGF5ZXJBY2NvcmRpb25Db250ZW50Q29udGFpbmVyKTtcbiAgICAkKCcucm9zdGVyLWxpc3QnKS5hcHBlbmQocGxheWVySW5mbyk7XG4gIH0pXG5cbiAgYXBwLnVwZGF0ZUhlYWRlcihhcHAuY2hvc2VuVGVhbU5hbWUpO1xuICBhcHAuYWRkSGlkZUNsYXNzKCcudGVhbXMnKTtcbn1cblxuXG5cbmFwcC5nZXRQbGF5ZXJTdGF0cyA9IChzZWFzb24pID0+IHtcbiAgICAkLmFqYXgoe1xuICAgIHVybDogYCR7YXBwLmFwaVVSTCArIGFwcC5wbGF5ZXJVUkx9LyR7YXBwLnBsYXllcklEfS8ke2FwcC5yZWNlbnRTdGF0c1VSTCArIHNlYXNvbn0gYCxcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIGRhdGFUeXBlOiAnanNvbicsXG4gIH0pXG4gIC50aGVuKChwbGF5ZXJTdGF0cykgPT4ge1xuICAgIGNvbnN0IHN0YXRMaXN0ID0gcGxheWVyU3RhdHMuc3RhdHNbMF0uc3BsaXRzWzBdLnN0YXQ7XG4gICAgYXBwLmN1cnJlbnRTZWFzb24gPSBzZWFzb247XG4gIFxuICAgIGlmIChhcHAucGxheWVyUG9zaXRpb24gPT09ICdHb2FsaWUnKSB7XG4gICAgICBhcHAuZGlzcGxheUdvYWxpZVN0YXRzKHN0YXRMaXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBwLmRpc3BsYXlQbGF5ZXJTdGF0cyhzdGF0TGlzdCk7XG4gICAgfVxuICB9KVxufVxuXG5hcHAuZGlzcGxheUdvYWxpZVN0YXRzID0gKHBsYXllcikgPT4ge1xuICBhcHAuYWRkSGlkZUNsYXNzKCcucm9zdGVyLWxpc3QnKTtcbiAgXG4gIC8vIGlmIGdvYWxpZSBkaXNwbGF5OiBzYXZlUGVyY2VudGFnZSwgd2lucywgZ29hbHNBZ2FpbnN0QXZlcmFnZSwgZ2FtZXMgcGxheWVkLCBzaHV0b3V0c1xuICBjb25zb2xlLmxvZyhwbGF5ZXIpXG4gIGNvbnN0IHBsYXllclNlYXNvblN0YXRDb250YWluZXIgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdzZWFzb24tc3RhdHMnKS5hdHRyKCdkYXRhLXNlYXNvbicsIGFwcC5jdXJyZW50U2Vhc29uKTsgXG4gIGNvbnN0IHBsYXllclNlYXNvbiA9ICQoJzxwPicpLnRleHQoYXBwLmN1cnJlbnRTZWFzb24pO1xuICBjb25zdCBwbGF5ZXJTYXZlUGVyY2VudGFnZSA9ICQoJzxwPicpLnRleHQoYFNhdmUgUGVyY2VudGFnZTogJHtwbGF5ZXIuc2F2ZVBlcmNlbnRhZ2V9YCk7XG4gIGNvbnN0IHBsYXllcldpbnMgPSAkKCc8cD4nKS50ZXh0KGBXaW5zOiAke3BsYXllci53aW5zfWApO1xuICBjb25zdCBwbGF5ZXJHb2Fsc0FnYWluc3RBdmVyYWdlID0gJCgnPHA+JykudGV4dChgR29hbHMgQWdhaW5zdCBBdmVyYWdlOiAke3BsYXllci5nb2FsQWdhaW5zdEF2ZXJhZ2V9YCk7XG4gIGNvbnN0IHBsYXllckdhbWVzID0gJCgnPHA+JykudGV4dChgR2FtZXMgUGxheWVkOiAke3BsYXllci5nYW1lc31gKTtcbiAgY29uc3QgcGxheWVyU2h1dG91dHMgPSAkKCc8cD4nKS50ZXh0KGBTaHV0b3V0czogJHtwbGF5ZXIuc2h1dG91dHN9YCk7XG4gICQocGxheWVyU2Vhc29uU3RhdENvbnRhaW5lcikuYXBwZW5kKHBsYXllclNlYXNvbixwbGF5ZXJTYXZlUGVyY2VudGFnZSwgcGxheWVyV2lucywgcGxheWVyR29hbHNBZ2FpbnN0QXZlcmFnZSwgcGxheWVyR2FtZXMsIHBsYXllclNodXRvdXRzKTtcbiAgJChgIyR7YXBwLnBsYXllcklEfWApLmFwcGVuZChwbGF5ZXJTZWFzb25TdGF0Q29udGFpbmVyKTtcbn1cblxuLy8gaGlkZSByb3N0ZXIgbGlzdFxuLy8gZGlzcGxheSBnb2FsaWUgc3RhdHMgZWxzZSBkaXNwbGF5IG90aGVyIHBsYXkgc3RhdHNcbmFwcC5kaXNwbGF5UGxheWVyU3RhdHMgPSAocGxheWVyKSA9PiB7XG4gIGFwcC5hZGRIaWRlQ2xhc3MoJy5yb3N0ZXItbGlzdCcpO1xuICBcbiAgY29uc3QgcGxheWVyU2Vhc29uU3RhdENvbnRhaW5lciA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ3NlYXNvbi1zdGF0cycpLmF0dHIoJ2RhdGEtc2Vhc29uJywgYXBwLmN1cnJlbnRTZWFzb24pO1xuICBjb25zdCBwbGF5ZXJTZWFzb24gPSAkKCc8cD4nKS5hZGRDbGFzcygncGxheWVyLXNlYXNvbicpLnRleHQoYXBwLmN1cnJlbnRTZWFzb24pO1xuICBjb25zdCBwbGF5ZXJBc3Npc3RzID0gJCgnPHA+JykudGV4dChgYXNzaXN0czogJHtwbGF5ZXIuYXNzaXN0c31gKTtcbiAgY29uc3QgcGxheWVyR29hbHMgPSAkKCc8cD4nKS50ZXh0KGBnb2FsczogJHtwbGF5ZXIuZ29hbHN9YCk7XG4gIGNvbnN0IHBsYXllclBvaW50cyA9ICQoJzxwPicpLnRleHQoYHBvaW50czogJHtwbGF5ZXIucG9pbnRzfWApO1xuICBjb25zdCBwbGF5ZXJHYW1lcyA9ICQoJzxwPicpLnRleHQoYGdhbWVzIHBsYXllZDogJHtwbGF5ZXIuZ2FtZXN9YClcbiAgY29uc3QgcGxheWVyR2FtZVdpbm5pbmdHb2FscyA9ICQoJzxwPicpLnRleHQoYGdhbWUgd2lubmluZyBnb2FsczogJHtwbGF5ZXIuZ2FtZVdpbm5pbmdHb2Fsc31gKVxuICBjb25zdCBwbGF5ZXJQbHVzTWludXMgPSAkKCc8cD4nKS50ZXh0KGArLTogJHtwbGF5ZXIucGx1c01pbnVzfWApO1xuICAkKHBsYXllclNlYXNvblN0YXRDb250YWluZXIpLmFwcGVuZChwbGF5ZXJTZWFzb24scGxheWVyQXNzaXN0cywgcGxheWVyR29hbHMsIHBsYXllclBvaW50cywgcGxheWVyR2FtZXMsIHBsYXllckdhbWVXaW5uaW5nR29hbHMsIHBsYXllclBsdXNNaW51cyk7XG4gIFxuICAkKGAjJHthcHAucGxheWVySUR9YCkuYXBwZW5kKHBsYXllclNlYXNvblN0YXRDb250YWluZXIpO1xuXG4gIC8vIGlmICgkKCcuc2Vhc29uLXN0YXRzJykuZGF0YSgnc2Vhc29uJykgPT09IDIwMTcyMDE4KSB7XG4gIC8vICAgJCgnLnNlYW9uLXN0YXRzOm50aC1jaGlsZCgxKScpLmFwcGVuZCgnPGRpdj4yMDE3IDIwMTg8L2Rpdj4nKTtcbiAgLy8gfTtcblxufVxuXG5hcHAuYWNjb3JkaW9uID0gKCkgPT4ge1xuICAkKFwiLmFjY29yZGlvblwiKS5hY2NvcmRpb24oe1xuICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxuICAgIGhlYWRlcjogJ2J1dHRvbicsXG4gICAgaGVpZ2h0U3R5bGU6IFwiY29udGVudFwiLFxuICB9KTtcbn1cblxuYXBwLnVwZGF0ZUhlYWRlciA9IChoZWFkaW5nKSA9PiB7XG4gICQoJ2hlYWRlciAuaGVybyBoMScpLnRleHQoaGVhZGluZylcbn07XG5cbmFwcC5hZGRIaWRlQ2xhc3MgPSAoc2VsZWN0b3IpID0+IHtcbiAgJChzZWxlY3RvcikuYWRkQ2xhc3MoJ2hpZGUnKTtcbn1cblxuLy8gRVZFTlQgRlVOQ1RJT05TXG5cbi8vIGxpc3RlbmluZyBmb3IgYSBjbGljayBvbiB0aGUgY2xhc3MgdGVhbS1uYW1lXG4vLyBpdGVtIHRoYXQgaXMgY2xpY2tlZCwgaGFzIGl0cyBkYXRhLWlkIHZhbHVlIHN0b3JlZCBpbiB0ZWFtSURcbi8vIHRlYW1JRCBpcyBwYXNzZWQgdG8gZ2V0VGVhbVJvc3RlclxuYXBwLmdldFRlYW1JRCA9ICgpID0+IHtcbiAgJCgndWwnKS5vbignY2xpY2snLCAnLnRlYW0tY29udGFpbmVyJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgdGVhbUlEID0gJCh0aGlzKS5kYXRhKCdpZCcpO1xuICAgIGFwcC5jaG9zZW5UZWFtTmFtZSA9ICQodGhpcykuZGF0YSgndGVhbS1uYW1lJyk7XG4gICAgLy8gYXBwLmdldFRlYW1Sb3N0ZXIoaWQpO1xuICAgIGdldFJvc3RlckFuZEdhbWVEYXRhKHRlYW1JRCk7XG4gICAgJCgnLm1lbnUtaWNvbicpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG4gICAgLy8gYXBwLmdldEdhbWVEYXRhKCk7XG4gIH0pXG59XG5cbi8vIGNsaWNrIGV2ZW50IG9uIHBsYXllclxuLy8gcGFzcyBwbGF5ZXJJRCB0byBnZXRQbGF5ZXJTdGF0c1xuYXBwLmdldFBsYXllcklEID0gKCkgPT4ge1xuICAkKCcucm9zdGVyLWxpc3QnKS5vbignY2xpY2snLCAnLnBsYXllci1pbmZvJywgZnVuY3Rpb24oKSB7XG4gICAgYXBwLnBsYXllcklEID0gJCh0aGlzKS5kYXRhKCdpZCcpO1xuICAgIGFwcC5wbGF5ZXJQb3NpdGlvbiA9ICQodGhpcykuZGF0YSgncG9zJyk7XG4gICAgYXBwLnNlYXNvbnMubWFwKGFwcC5nZXRQbGF5ZXJTdGF0cyk7XG4gICAgJChgIyR7YXBwLnBsYXllcklEfWApLmVtcHR5KCk7XG4gICAgYXBwLmFjY29yZGlvbigpO1xuICB9KVxufVxuXG5hcHAubW9iaWxlTmF2VG9nZ2xlID0gKCkgPT4ge1xuICAkKCcubmF2LW1lbnUnKS5oaWRlKCk7XG4gICQoJy5tZW51LWljb24nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG4gICAgJCgnLm5hdi1tZW51Jykuc2xpZGVUb2dnbGUoMzAwKTtcbiAgfSlcbn1cblxuYXBwLmV2ZW50cyA9ICgpID0+IHtcbiAgYXBwLmdldFRlYW1JRCgpO1xuICBhcHAuZ2V0UGxheWVySUQoKTtcbiAgYXBwLm1vYmlsZU5hdlRvZ2dsZSgpO1xufTtcblxuYXBwLmluaXQgPSAoKSA9PiB7XG4gIGFwcC5nZXREYXRhKCk7XG4gIGFwcC5ldmVudHMoKTtcbn07XG5cbiQoZnVuY3Rpb24oKSB7XG4gIGFwcC5pbml0KCk7XG59KSJdfQ==
