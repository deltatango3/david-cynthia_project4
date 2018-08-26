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
app.seasonYear;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O3FFQ2tJQSxpQkFBb0MsRUFBcEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQ3lCLElBQUksYUFBSixDQUFrQixFQUFsQixDQUR6Qjs7QUFBQTtBQUNFLGdCQUFJLFVBRE47QUFBQTtBQUFBLG1CQUV3QixJQUFJLFdBQUosRUFGeEI7O0FBQUE7QUFFRSxnQkFBSSxRQUZOOztBQUdFO0FBQ0EsZ0JBQUksaUJBQUosQ0FBc0IsSUFBSSxVQUFKLENBQWUsTUFBckM7QUFDQSxnQkFBSSxpQkFBSixDQUFzQixJQUFJLFFBQTFCOztBQUxGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7O2tCQUFlLG9COzs7OztBQVFmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBaEpBLElBQU0sTUFBTSxFQUFaOztBQUVBLElBQUksTUFBSixHQUFhLHNDQUFiO0FBQ0EsSUFBSSxPQUFKLEdBQWMsT0FBZDtBQUNBLElBQUksYUFBSixHQUFvQixRQUFwQjtBQUNBLElBQUksU0FBSixHQUFnQixRQUFoQjtBQUNBLElBQUksY0FBSixHQUFxQix1Q0FBckI7QUFDQSxJQUFJLE9BQUosR0FBYyxDQUFDLFVBQUQsRUFBYSxVQUFiLEVBQXdCLFVBQXhCLENBQWQ7QUFDQSxJQUFJLGtCQUFKLEdBQXlCLEVBQXpCO0FBQ0EsSUFBSSxjQUFKO0FBQ0EsSUFBSSxhQUFKLEdBQW9CLEVBQXBCO0FBQ0EsSUFBSSxVQUFKOztBQUVBLElBQUksa0JBQUosR0FBeUIsdURBQXpCO0FBQ0EsSUFBSSxrQkFBSixHQUF5QixrQ0FBekI7QUFDQSxJQUFJLGFBQUosR0FBb0IsRUFBcEI7O0FBRUE7QUFDQSxJQUFJLE9BQUosR0FBYyxZQUFNO0FBQ2xCLElBQUUsSUFBRixDQUFPO0FBQ0wsU0FBSyxJ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cyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgYXBwID0ge307XG5cbmFwcC5hcGlVUkwgPSAnaHR0cHM6Ly9zdGF0c2FwaS53ZWIubmhsLmNvbS9hcGkvdjEvJztcbmFwcC50ZWFtVVJMID0gJ3RlYW1zJztcbmFwcC50ZWFtUm9zdGVyVVJMID0gJ3Jvc3Rlcic7XG5hcHAucGxheWVyVVJMID0gJ3Blb3BsZSc7XG5hcHAucmVjZW50U3RhdHNVUkwgPSAnc3RhdHM/c3RhdHM9c3RhdHNTaW5nbGVTZWFzb24mc2Vhc29uPSc7XG5hcHAuc2Vhc29ucyA9IFsnMjAxNzIwMTgnLCAnMjAxNjIwMTcnLCcyMDE1MjAxNicgXTtcbmFwcC5hbHBoYWJldGljYWxSb3N0ZXIgPSBbXTtcbmFwcC5jaG9zZW5UZWFtTmFtZTtcbmFwcC5jdXJyZW50U2Vhc29uID0gJyc7XG5hcHAuc2Vhc29uWWVhcjtcblxuYXBwLnRpY2tldG1hc3RlckFwaVVSTCA9ICdodHRwczovL2FwcC50aWNrZXRtYXN0ZXIuY29tL2Rpc2NvdmVyeS92Mi9ldmVudHMuanNvbic7XG5hcHAudGlja2V0bWFzdGVyQXBpS2V5ID0gJ0FhYm1WYkNIQTJ6UGpRb0ExbGI5OGNOMU5ReXVGR0Y0JztcbmFwcC5uZXh0Rml2ZUdhbWVzID0ge307XG5cbi8vIG1ha2UgYW4gYWpheCBjYWxsIHRvIHJldHVybiBuaGwgdGVhbXMgdGhlbiBhcHAuZGlzcGxheVRlYW0gaXMgY2FsbGVkIHdpdGggZGF0YS50ZWFtcyBhcyB0aGUgYXJndW1lbnRcbmFwcC5nZXREYXRhID0gKCkgPT4ge1xuICAkLmFqYXgoe1xuICAgIHVybDogYXBwLmFwaVVSTCArIGFwcC50ZWFtVVJMLFxuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgfSlcbiAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICBhcHAuZGlzcGxheVRlYW0oZGF0YS50ZWFtcyk7XG4gICAgYXBwLmFkZE1vYmlsZU1lbnVJdGVtcyhkYXRhLnRlYW1zKTtcbiAgfSlcbn1cblxuLy8gbG9vcCB0aHJvdWdoIGVhY2ggdGVhbVxuLy8gY3JlYXRlIGEgdmFyaWFibGUsIHRlYW1OYW1lIHRoYXQgaGFzOiBcbi8vIC0gbGkgdGFnIHdpdGggdGhlIGF0dHJpYnV0ZSBvZiBkYXRhLWlkIGFuZCB0aGUgdmFsdWUgdGVhbS5pZFxuLy8gLSBjbGFzcyBvZiB0ZWFtLW5hbWUgXG4vLyAtIHRoZSBsaSBjb250YWlucyB0ZXh0LCB0ZWFtLm5hbWVcbmFwcC5kaXNwbGF5VGVhbSA9ICh0ZWFtcykgPT4ge1xuICAvL1NvcnQgdGVhbSBhbHBoYWJldGljYWxseVxuICBhcHAuc29ydEFycmF5T2JqZWN0cyh0ZWFtcyk7XG5cbiAgLy8gdGVhbXMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAvLyAgIGxldCBhbGMgPSBhLm5hbWUudG9Mb3dlckNhc2UoKSxcbiAgLy8gICAgIGJsYyA9IGIubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAvLyAgIHJldHVybiBhbGMgPiBibGMgPyAxIDogYWxjIDwgYmxjID8gLTEgOiAwO1xuICAvLyB9KTtcblxuICB0ZWFtcy5mb3JFYWNoKCh0ZWFtKSA9PiB7XG4gICAgY29uc3QgdGVhbUNvbnRhaW5lciA9ICQoJzxsaT4nKS5hZGRDbGFzcygndGVhbS1jb250YWluZXInKS5hdHRyKCdkYXRhLWlkJywgdGVhbS5pZCkuYXR0cignZGF0YS10ZWFtLW5hbWUnLCB0ZWFtLm5hbWUpO1xuICAgIGNvbnN0IHRlYW1JdGVtID0gJCgnPGJ1dHRvbj4nKS5hZGRDbGFzcygndGVhbScpO1xuICAgIGNvbnN0IHRlYW1JbWFnZUNvbnRhaW5lciA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ3RlYW0taW1hZ2UtY29udGFpbmVyJyk7XG4gICAgY29uc3QgdGVhbUltYWdlID0gJCgnPGltZz4nKS5hZGRDbGFzcygndGVhbS1pbWFnZScpLmF0dHIoJ3NyYycsIGBwdWJsaWMvaW1hZ2VzL2xvZ28tJHt0ZWFtLmlkfS5wbmdgKS5hdHRyKCdhbHQnLCBgJHt0ZWFtLm5hbWV9IGxvZ29gKTtcbiAgICBjb25zdCB0ZWFtTmFtZSA9ICQoJzxwPicpLmF0dHIoJ2RhdGEtaWQnLCB0ZWFtLmlkKS5hdHRyKCdkYXRhLXRlYW0tbmFtZScsIHRlYW0ubmFtZSkuYWRkQ2xhc3MoJ3RlYW0tbmFtZScpLnRleHQodGVhbS5zaG9ydE5hbWUpO1xuICAgICQodGVhbUltYWdlQ29udGFpbmVyKS5hcHBlbmQodGVhbUltYWdlKTtcbiAgICAkKHRlYW1JdGVtKS5hcHBlbmQodGVhbUltYWdlQ29udGFpbmVyLCB0ZWFtTmFtZSk7XG4gICAgJCh0ZWFtQ29udGFpbmVyKS5hcHBlbmQodGVhbUl0ZW0pXG4gICAgJCgnLnRlYW1zIHVsJykuYXBwZW5kKHRlYW1Db250YWluZXIpO1xuICB9KVxufTsgXG5cbmFwcC5zb3J0QXJyYXlPYmplY3RzID0gKGFycmF5T2JqZWN0cykgPT4ge1xuICBhcnJheU9iamVjdHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIGxldCBhbGMgPSBhLm5hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgIGJsYyA9IGIubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBhbGMgPiBibGMgPyAxIDogYWxjIDwgYmxjID8gLTEgOiAwO1xuICB9KTtcbn1cbmFwcC5hZGRNb2JpbGVNZW51SXRlbXMgPSAodGVhbXMpID0+IHtcbiBhcHAuc29ydEFycmF5T2JqZWN0cyh0ZWFtcyk7XG4gXG4gdGVhbXMuZm9yRWFjaCgodGVhbSkgPT4ge1xuICBjb25zdCB0ZWFtQ29udGFpbmVyID0gJCgnPGxpPicpLmFkZENsYXNzKCd0ZWFtLWNvbnRhaW5lcicpLmF0dHIoJ2RhdGEtaWQnLCB0ZWFtLmlkKS5hdHRyKCdkYXRhLXRlYW0tbmFtZScsIHRlYW0ubmFtZSk7XG4gIGNvbnN0IHRlYW1JdGVtID0gJCgnPGJ1dHRvbj4nKS5hZGRDbGFzcygndGVhbScpO1xuICBjb25zdCB0ZWFtSW1hZ2VDb250YWluZXIgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCd0ZWFtLWltYWdlLWNvbnRhaW5lcicpO1xuICBjb25zdCB0ZWFtSW1hZ2UgPSAkKCc8aW1nPicpLmFkZENsYXNzKCd0ZWFtLWltYWdlJykuYXR0cignc3JjJywgYHB1YmxpYy9pbWFnZXMvbG9nby0ke3RlYW0uaWR9LnBuZ2ApO1xuICBjb25zdCB0ZWFtTmFtZSA9ICQoJzxwPicpLmF0dHIoJ2RhdGEtaWQnLCB0ZWFtLmlkKS5hdHRyKCdkYXRhLXRlYW0tbmFtZScsIHRlYW0ubmFtZSkuYWRkQ2xhc3MoJ3RlYW0tbmFtZScpLnRleHQodGVhbS5zaG9ydE5hbWUpO1xuICAkKHRlYW1JbWFnZUNvbnRhaW5lcikuYXBwZW5kKHRlYW1JbWFnZSk7XG4gICQodGVhbUl0ZW0pLmFwcGVuZCh0ZWFtSW1hZ2VDb250YWluZXIsIHRlYW1OYW1lKTtcbiAgJCh0ZWFtQ29udGFpbmVyKS5hcHBlbmQodGVhbUl0ZW0pXG4gICQoJy5uYXYtbWVudScpLmFwcGVuZCh0ZWFtQ29udGFpbmVyKTtcbiB9KVxufVxuLy8gV2hlbiBJIGNsaWNrIGEgdGVhbSwgbG9hZCB0aGUgcm9zdGVyIGZvciB0aGF0IHRlYW0uIEkgbmVlZCB0byBnZXQgYW5kIHN0b3JlIHRoZSBJRCBmcm9tIHRoZSBkYXRhLWlkIHdoZW4gSSBjbGljayB0aGUgdGVhbS5cbi8vIG1ha2UgYW4gYWpheCBjYWxsIHRvIGdyYWIgdGhlIHJvc3RlciBpbmZvcm1hdGlvbiBvZiB0aGUgc3BlY2lmaWMgdGVhbVxuLy8gcGFzcyBkYXRhIChwbGF5ZXIgbmFtZXMpIHRvIGRpc3BsYXlUZWFtUm9zdGVyXG5hcHAuZ2V0VGVhbVJvc3RlciA9IChpZCkgPT4ge1xuICByZXR1cm4gJC5hamF4KHtcbiAgICB1cmw6IGAke2FwcC5hcGlVUkwgKyBhcHAudGVhbVVSTH0vJHtpZH0vJHthcHAudGVhbVJvc3RlclVSTH1gLFxuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgfSlcbiAgLy8gLnRoZW4oKHRlYW1Sb3N0ZXIpID0+IHtcbiAgLy8gICBhcHAuZGlzcGxheVRlYW1Sb3N0ZXIodGVhbVJvc3Rlci5yb3N0ZXIpO1xuICAvLyB9KVxufVxuXG5hcHAuZ2V0R2FtZURhdGEgPSAoKSA9PiB7XG4gIHJldHVybiAkLmFqYXgoe1xuICAgIHVybDogYXBwLnRpY2tldG1hc3RlckFwaVVSTCxcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgZGF0YToge1xuICAgICAgYXBpa2V5OiBhcHAudGlja2V0bWFzdGVyQXBpS2V5LFxuICAgICAga2V5d29yZDogYXBwLmNob3NlblRlYW1OYW1lLFxuICAgICAgc29ydDogJ2RhdGUsYXNjJyxcbiAgICAgIHNpemU6IFwiM1wiLFxuICAgICAgY2xhc3NpZmljYXRpb25OYW1lOiAnTkhMJ1xuICAgIH1cbiAgfSlcbn1cblxuYXBwLmFnZ3JlZ2F0ZUdhbWVEYXRhID0gKGRhdGEpID0+IHtcbiAgXG4gIGRhdGEgPSBkYXRhLl9lbWJlZGRlZC5ldmVudHM7XG5cbiAgZGF0YS5mb3JFYWNoKChkYXRhKSA9PiB7XG4gICAgY29uc3QgZ2FtZUxpbmsgPSAkKCc8YT4nKS5hZGRDbGFzcygnZ2FtZS1saW5rJykuYXR0cignaHJlZicsIGRhdGEudXJsKS5hdHRyKCd0YXJnZXQnLCAnX2JsYW5rJyk7XG4gICAgY29uc3Qgb3Bwb25lbnRzQ29udGFpbmVyID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnb3Bwb25lbnRzLWNvbnRhaW5lcicpO1xuICAgIGNvbnN0IG9wcG9uZW50cyA9ICQoJzxwPicpLnRleHQoZGF0YS5uYW1lKTtcbiAgICBjb25zdCBnYW1lSW5mb0NvbnRhaW5lciA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ2dhbWUtaW5mby1jb250YWluZXInKTtcbiAgICBjb25zdCBnYW1lRGF0ZSA9ICQoJzxwPicpLmFkZENsYXNzKCdnYW1lLWRhdGUnKS50ZXh0KGRhdGEuZGF0ZXMuc3RhcnQubG9jYWxEYXRlKTtcbiAgICBjb25zdCBnYW1lVGltZSA9ICQoJzxwPicpLmFkZENsYXNzKCdnYW1lLXRpbWUnKS50ZXh0KGRhdGEuZGF0ZXMuc3RhcnQubG9jYWxUaW1lKTtcbiAgICBjb25zdCBidXlOb3cgPSAkKCc8cD4nKS5hZGRDbGFzcygnYnV5LW5vdycpLnRleHQoJ0J1eSBOb3cnKVxuXG4gICAgb3Bwb25lbnRzQ29udGFpbmVyLmFwcGVuZChvcHBvbmVudHMpO1xuICAgIGdhbWVJbmZvQ29udGFpbmVyLmFwcGVuZChnYW1lRGF0ZSwgZ2FtZVRpbWUpO1xuICAgIGdhbWVMaW5rLmFwcGVuZChvcHBvbmVudHNDb250YWluZXIsZ2FtZUluZm9Db250YWluZXIsIGJ1eU5vdyk7XG5cbiAgICAkKCcuZ2FtZXMtY29udGFpbmVyJykuYXBwZW5kKGdhbWVMaW5rKTtcbiAgfSlcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0Um9zdGVyQW5kR2FtZURhdGEoaWQpIHtcbiAgYXBwLnRlYW1Sb3N0ZXIgPSBhd2FpdCBhcHAuZ2V0VGVhbVJvc3RlcihpZCk7XG4gIGFwcC5nYW1lRGF0YSAgPSBhd2FpdCBhcHAuZ2V0R2FtZURhdGEoKTtcbiAgLy8gY29uc29sZS5sb2coYXBwLnRlYW1Sb3N0ZXIucm9zdGVyKTtcbiAgYXBwLmRpc3BsYXlUZWFtUm9zdGVyKGFwcC50ZWFtUm9zdGVyLnJvc3RlcilcbiAgYXBwLmFnZ3JlZ2F0ZUdhbWVEYXRhKGFwcC5nYW1lRGF0YSk7XG59XG5cbi8vIGxvb3AgdGhyb3VnaCB0aGUgdGVhbSByb3N0ZXJcbi8vIGNyZWF0ZSBhIGxpc3QgaXRlbSBhbmQgYWRkaW5nIGEgY2xhc3Mgb2YgcGxheWVyLWluZm8gYW5kIGF0dHJpYnV0ZSBkYXRhLWlkIHdpdGggdGhlIHBsYXllcidzIGlkXG4vLyBkaXNwbGF5IHBsYXllciBuYW1lIGluIGEgcCB0YWdcbi8vIGRpc3BsYXkgamVyc2V5IG51bWJlclxuLy8gZGlzcGxheSBwb3NpdGlvbiBjb2RlIGFkZCBhdHRyaWJ1dGUgb2YgZGF0YS1wb3MgdG8gdmVyaWZ5IGlmIHBsYXllciBpcyBnb2FsaWVcbi8vIGNyZWF0ZSBkaXNwbGF5ZWQgZGF0YSBhcyBjaGlsZHJlbiB0byAucm9zdGVyLWxpc3Rcbi8vIGhpZGUgdGVhbSBuYW1lc1xuXG5hcHAuZGlzcGxheVRlYW1Sb3N0ZXIgPSAocm9zdGVyKSA9PiB7XG4gIC8vU29ydGluZyB0aGUgcm9zdGVyIGJ5IGFscGhhYmV0aWNhbCBvcmRlcjtcbiAgJCgnLmNob3Nlbi10ZWFtLXBhZ2UnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuICAkKCcuZ2FtZXMtY29udGFpbmVyJykuZW1wdHkoKTtcbiAgJCgnLnJvc3Rlci1saXN0JykuZW1wdHkoKTtcbiAgJCgnLm5hdi1tZW51JykuaGlkZSgpO1xuICBcbiAgcm9zdGVyLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICBsZXQgYWxjID0gYS5wZXJzb24uZnVsbE5hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgIGJsYyA9IGIucGVyc29uLmZ1bGxOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIGFsYyA+IGJsYyA/IDEgOiBhbGMgPCBibGMgPyAtMSA6IDA7XG4gIH0pO1xuXG4gIHJvc3Rlci5mb3JFYWNoKChwbGF5ZXJzKSA9PiB7XG4gICAgY29uc3QgcGxheWVySW5mbyA9ICQoJzxsaT4nKS5hZGRDbGFzcygncGxheWVyLWluZm8gYWNjb3JkaW9uJykuYXR0cignZGF0YS1pZCcsIHBsYXllcnMucGVyc29uLmlkKVxuICAgIC5hdHRyKCdkYXRhLXBvcycsIHBsYXllcnMucG9zaXRpb24ubmFtZSkuYXR0cignZGF0YS1uYW1lJywgcGxheWVycy5wZXJzb24uZnVsbE5hbWUpLmF0dHIoJ2RhdGEtbnVtYmVyJywgcGxheWVycy5qZXJzZXlOdW1iZXIpO1xuICAgIGNvbnN0IHBsYXllckluZm9CdXR0b25Db250YWluZXIgPSAkKCc8YnV0dG9uPicpLmFkZENsYXNzKCdwbGF5ZXInKTtcbiAgICBhcHAucGxheWVyQWNjb3JkaW9uQ29udGVudENvbnRhaW5lciA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ2FjY29yZGlvbi1jb250ZW50LWNvbnRhaW5lcicpLmF0dHIoJ2lkJywgcGxheWVycy5wZXJzb24uaWQpO1xuICAgIC8vIGNvbnN0IGZha2VEYXRhID0gJCgnPHA+JykudGV4dCgnZmFrZSBkYXRhIGZha2UgZGF0YScpXG4gICAgY29uc3QgcGxheWVyTmFtZSA9ICQoJzxwPicpLmFkZENsYXNzKCdwbGF5ZXItbmFtZScpLnRleHQocGxheWVycy5wZXJzb24uZnVsbE5hbWUpO1xuICAgIGNvbnN0IHBsYXllck51bWJlciA9ICQoJzxzcGFuPicpLnRleHQocGxheWVycy5qZXJzZXlOdW1iZXIpO1xuICAgIGNvbnN0IHBsYXllclBvc2l0aW9uID0gJCgnPHA+JykuYWRkQ2xhc3MoJ3BsYXllci1udW1iZXInKS5hdHRyKFwiZGF0YS1wb3NcIiwgcGxheWVycy5wb3NpdGlvbi5uYW1lKS50ZXh0KHBsYXllcnMucG9zaXRpb24uY29kZSk7XG4gICAgcGxheWVySW5mb0J1dHRvbkNvbnRhaW5lci5hcHBlbmQocGxheWVyTnVtYmVyLCBwbGF5ZXJQb3NpdGlvbiwgcGxheWVyTmFtZSk7XG4gICAgcGxheWVySW5mby5hcHBlbmQocGxheWVySW5mb0J1dHRvbkNvbnRhaW5lciwgYXBwLnBsYXllckFjY29yZGlvbkNvbnRlbnRDb250YWluZXIpO1xuICAgICQoJy5yb3N0ZXItbGlzdCcpLmFwcGVuZChwbGF5ZXJJbmZvKTtcbiAgfSlcblxuICBhcHAudXBkYXRlSGVhZGVyKGFwcC5jaG9zZW5UZWFtTmFtZSk7XG4gIGFwcC5hZGRIaWRlQ2xhc3MoJy50ZWFtcycpO1xufVxuXG5cblxuYXBwLmdldFBsYXllclN0YXRzID0gKHNlYXNvbikgPT4ge1xuICAgICQuYWpheCh7XG4gICAgdXJsOiBgJHthcHAuYXBpVVJMICsgYXBwLnBsYXllclVSTH0vJHthcHAucGxheWVySUR9LyR7YXBwLnJlY2VudFN0YXRzVVJMICsgc2Vhc29ufSBgLFxuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgfSlcbiAgLnRoZW4oKHBsYXllclN0YXRzKSA9PiB7XG4gICAgY29uc3Qgc3RhdExpc3QgPSBwbGF5ZXJTdGF0cy5zdGF0c1swXS5zcGxpdHNbMF0uc3RhdDtcbiAgICBhcHAuY3VycmVudFNlYXNvbiA9IHNlYXNvbjtcbiAgXG4gICAgaWYgKGFwcC5wbGF5ZXJQb3NpdGlvbiA9PT0gJ0dvYWxpZScpIHtcbiAgICAgIGFwcC5kaXNwbGF5R29hbGllU3RhdHMoc3RhdExpc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcHAuZGlzcGxheVBsYXllclN0YXRzKHN0YXRMaXN0KTtcbiAgICB9XG4gIH0pXG59XG5cbmFwcC5kaXNwbGF5R29hbGllU3RhdHMgPSAocGxheWVyKSA9PiB7XG4gIGFwcC5hZGRIaWRlQ2xhc3MoJy5yb3N0ZXItbGlzdCcpO1xuICBcbiAgLy8gaWYgZ29hbGllIGRpc3BsYXk6IHNhdmVQZXJjZW50YWdlLCB3aW5zLCBnb2Fsc0FnYWluc3RBdmVyYWdlLCBnYW1lcyBwbGF5ZWQsIHNodXRvdXRzXG4gIGNvbnNvbGUubG9nKHBsYXllcilcbiAgY29uc3QgcGxheWVyU2Vhc29uU3RhdENvbnRhaW5lciA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ3NlYXNvbi1zdGF0cycpLmF0dHIoJ2RhdGEtc2Vhc29uJywgYXBwLmN1cnJlbnRTZWFzb24pOyBcbiAgY29uc3QgcGxheWVyU2Vhc29uID0gJCgnPHA+JykudGV4dChhcHAuY3VycmVudFNlYXNvbik7XG4gIGNvbnN0IHBsYXllclNhdmVQZXJjZW50YWdlID0gJCgnPHA+JykudGV4dChgU2F2ZSBQZXJjZW50YWdlOiAke3BsYXllci5zYXZlUGVyY2VudGFnZX1gKTtcbiAgY29uc3QgcGxheWVyV2lucyA9ICQoJzxwPicpLnRleHQoYFdpbnM6ICR7cGxheWVyLndpbnN9YCk7XG4gIGNvbnN0IHBsYXllckdvYWxzQWdhaW5zdEF2ZXJhZ2UgPSAkKCc8cD4nKS50ZXh0KGBHb2FscyBBZ2FpbnN0IEF2ZXJhZ2U6ICR7cGxheWVyLmdvYWxBZ2FpbnN0QXZlcmFnZX1gKTtcbiAgY29uc3QgcGxheWVyR2FtZXMgPSAkKCc8cD4nKS50ZXh0KGBHYW1lcyBQbGF5ZWQ6ICR7cGxheWVyLmdhbWVzfWApO1xuICBjb25zdCBwbGF5ZXJTaHV0b3V0cyA9ICQoJzxwPicpLnRleHQoYFNodXRvdXRzOiAke3BsYXllci5zaHV0b3V0c31gKTtcbiAgJChwbGF5ZXJTZWFzb25TdGF0Q29udGFpbmVyKS5hcHBlbmQocGxheWVyU2Vhc29uLHBsYXllclNhdmVQZXJjZW50YWdlLCBwbGF5ZXJXaW5zLCBwbGF5ZXJHb2Fsc0FnYWluc3RBdmVyYWdlLCBwbGF5ZXJHYW1lcywgcGxheWVyU2h1dG91dHMpO1xuICAkKGAjJHthcHAucGxheWVySUR9YCkuYXBwZW5kKHBsYXllclNlYXNvblN0YXRDb250YWluZXIpO1xufVxuXG4vLyBoaWRlIHJvc3RlciBsaXN0XG4vLyBkaXNwbGF5IGdvYWxpZSBzdGF0cyBlbHNlIGRpc3BsYXkgb3RoZXIgcGxheSBzdGF0c1xuYXBwLmRpc3BsYXlQbGF5ZXJTdGF0cyA9IChwbGF5ZXIpID0+IHtcbiAgYXBwLmFkZEhpZGVDbGFzcygnLnJvc3Rlci1saXN0Jyk7XG4gIFxuICBjb25zdCBwbGF5ZXJTZWFzb25TdGF0Q29udGFpbmVyID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnc2Vhc29uLXN0YXRzJykuYXR0cignZGF0YS1zZWFzb24nLCBhcHAuY3VycmVudFNlYXNvbik7XG4gIGNvbnN0IHBsYXllclNlYXNvbiA9ICQoJzxwPicpLmFkZENsYXNzKCdwbGF5ZXItc2Vhc29uJykudGV4dChhcHAuY3VycmVudFNlYXNvbik7XG4gIGNvbnN0IHBsYXllckFzc2lzdHMgPSAkKCc8cD4nKS50ZXh0KGBhc3Npc3RzOiAke3BsYXllci5hc3Npc3RzfWApO1xuICBjb25zdCBwbGF5ZXJHb2FscyA9ICQoJzxwPicpLnRleHQoYGdvYWxzOiAke3BsYXllci5nb2Fsc31gKTtcbiAgY29uc3QgcGxheWVyUG9pbnRzID0gJCgnPHA+JykudGV4dChgcG9pbnRzOiAke3BsYXllci5wb2ludHN9YCk7XG4gIGNvbnN0IHBsYXllckdhbWVzID0gJCgnPHA+JykudGV4dChgZ2FtZXMgcGxheWVkOiAke3BsYXllci5nYW1lc31gKVxuICBjb25zdCBwbGF5ZXJHYW1lV2lubmluZ0dvYWxzID0gJCgnPHA+JykudGV4dChgZ2FtZSB3aW5uaW5nIGdvYWxzOiAke3BsYXllci5nYW1lV2lubmluZ0dvYWxzfWApXG4gIGNvbnN0IHBsYXllclBsdXNNaW51cyA9ICQoJzxwPicpLnRleHQoYCstOiAke3BsYXllci5wbHVzTWludXN9YCk7XG4gICQocGxheWVyU2Vhc29uU3RhdENvbnRhaW5lcikuYXBwZW5kKHBsYXllclNlYXNvbixwbGF5ZXJBc3Npc3RzLCBwbGF5ZXJHb2FscywgcGxheWVyUG9pbnRzLCBwbGF5ZXJHYW1lcywgcGxheWVyR2FtZVdpbm5pbmdHb2FscywgcGxheWVyUGx1c01pbnVzKTtcbiAgXG4gICQoYCMke2FwcC5wbGF5ZXJJRH1gKS5hcHBlbmQocGxheWVyU2Vhc29uU3RhdENvbnRhaW5lcik7XG5cbiAgLy8gaWYgKCQoJy5zZWFzb24tc3RhdHMnKS5kYXRhKCdzZWFzb24nKSA9PT0gMjAxNzIwMTgpIHtcbiAgLy8gICAkKCcuc2Vhb24tc3RhdHM6bnRoLWNoaWxkKDEpJykuYXBwZW5kKCc8ZGl2PjIwMTcgMjAxODwvZGl2PicpO1xuICAvLyB9O1xuXG59XG5cbmFwcC5hY2NvcmRpb24gPSAoKSA9PiB7XG4gICQoXCIuYWNjb3JkaW9uXCIpLmFjY29yZGlvbih7XG4gICAgY29sbGFwc2libGU6IHRydWUsXG4gICAgaGVhZGVyOiAnYnV0dG9uJyxcbiAgICBoZWlnaHRTdHlsZTogXCJjb250ZW50XCIsXG4gIH0pO1xufVxuXG5hcHAudXBkYXRlSGVhZGVyID0gKGhlYWRpbmcpID0+IHtcbiAgJCgnaGVhZGVyIC5oZXJvIGgxJykudGV4dChoZWFkaW5nKVxufTtcblxuYXBwLmFkZEhpZGVDbGFzcyA9IChzZWxlY3RvcikgPT4ge1xuICAkKHNlbGVjdG9yKS5hZGRDbGFzcygnaGlkZScpO1xufVxuXG4vLyBFVkVOVCBGVU5DVElPTlNcblxuLy8gbGlzdGVuaW5nIGZvciBhIGNsaWNrIG9uIHRoZSBjbGFzcyB0ZWFtLW5hbWVcbi8vIGl0ZW0gdGhhdCBpcyBjbGlja2VkLCBoYXMgaXRzIGRhdGEtaWQgdmFsdWUgc3RvcmVkIGluIHRlYW1JRFxuLy8gdGVhbUlEIGlzIHBhc3NlZCB0byBnZXRUZWFtUm9zdGVyXG5hcHAuZ2V0VGVhbUlEID0gKCkgPT4ge1xuICAkKCd1bCcpLm9uKCdjbGljaycsICcudGVhbS1jb250YWluZXInLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCB0ZWFtSUQgPSAkKHRoaXMpLmRhdGEoJ2lkJyk7XG4gICAgYXBwLmNob3NlblRlYW1OYW1lID0gJCh0aGlzKS5kYXRhKCd0ZWFtLW5hbWUnKTtcbiAgICAvLyBhcHAuZ2V0VGVhbVJvc3RlcihpZCk7XG4gICAgZ2V0Um9zdGVyQW5kR2FtZURhdGEodGVhbUlEKTtcbiAgICAkKCcubWVudS1pY29uJykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgICAvLyBhcHAuZ2V0R2FtZURhdGEoKTtcbiAgfSlcbn1cblxuLy8gY2xpY2sgZXZlbnQgb24gcGxheWVyXG4vLyBwYXNzIHBsYXllcklEIHRvIGdldFBsYXllclN0YXRzXG5hcHAuZ2V0UGxheWVySUQgPSAoKSA9PiB7XG4gICQoJy5yb3N0ZXItbGlzdCcpLm9uKCdjbGljaycsICcucGxheWVyLWluZm8nLCBmdW5jdGlvbigpIHtcbiAgICBhcHAucGxheWVySUQgPSAkKHRoaXMpLmRhdGEoJ2lkJyk7XG4gICAgYXBwLnBsYXllclBvc2l0aW9uID0gJCh0aGlzKS5kYXRhKCdwb3MnKTtcbiAgICBhcHAuc2Vhc29ucy5tYXAoYXBwLmdldFBsYXllclN0YXRzKTtcbiAgICAkKGAjJHthcHAucGxheWVySUR9YCkuZW1wdHkoKTtcbiAgICBhcHAuYWNjb3JkaW9uKCk7XG4gIH0pXG59XG5cbmFwcC5tb2JpbGVOYXZUb2dnbGUgPSAoKSA9PiB7XG4gICQoJy5uYXYtbWVudScpLmhpZGUoKTtcbiAgJCgnLm1lbnUtaWNvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgICAkKCcubmF2LW1lbnUnKS5zbGlkZVRvZ2dsZSgzMDApO1xuICB9KVxufVxuXG5hcHAuZXZlbnRzID0gKCkgPT4ge1xuICBhcHAuZ2V0VGVhbUlEKCk7XG4gIGFwcC5nZXRQbGF5ZXJJRCgpO1xuICBhcHAubW9iaWxlTmF2VG9nZ2xlKCk7XG59O1xuXG5hcHAuaW5pdCA9ICgpID0+IHtcbiAgYXBwLmdldERhdGEoKTtcbiAgYXBwLmV2ZW50cygpO1xufTtcblxuJChmdW5jdGlvbigpIHtcbiAgYXBwLmluaXQoKTtcbn0pIl19
