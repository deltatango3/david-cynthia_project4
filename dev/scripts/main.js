const app = {};

app.apiURL = 'https://statsapi.web.nhl.com/api/v1/';
app.teamURL = 'teams';
app.teamRosterURL = 'roster';
app.playerURL = 'people';
app.recentStatsURL = 'stats?stats=statsSingleSeason&season=';
app.seasons = ['20172018', '20162017','20152016' ];
app.alphabeticalRoster = [];
app.chosenTeamName;
app.currentSeason = '';
app.seasonYear;

//Graph Variables
app.playerAssists = [];
app.playerGoals = [];
app.playerPoints = [];

// make an ajax call to return nhl teams then app.displayTeam is called with data.teams as the argument
app.getData = () => {
  $.ajax({
    url: app.apiURL + app.teamURL,
    method: 'GET',
    dataType: 'json',
  })
  .then((data) => {
    app.displayTeam(data.teams);
  })
}

// loop through each team
// create a variable, teamName that has: 
// - li tag with the attribute of data-id and the value team.id
// - class of team-name 
// - the li contains text, team.name
app.displayTeam = (teams) => {
  //Sort team alphabetically
  teams.sort(function (a, b) {
    let alc = a.name.toLowerCase(),
      blc = b.name.toLowerCase();
    return alc > blc ? 1 : alc < blc ? -1 : 0;
  });

  teams.forEach((team) => {
    const teamContainer = $('<li>').addClass('team');
    const teamImageContainer = $('<div>').addClass('team-image-container');
    const teamImage = $('<img>').addClass('team-image').attr('src', `public/images/logo-${team.id}.png`);
    const teamName = $('<p>').attr('data-id', team.id).attr('data-team-name', team.name).addClass('team-name').text(team.name);
    $(teamImageContainer).append(teamImage);
    $(teamContainer).append(teamImageContainer, teamName);
    $('.teams ul').append(teamContainer);
  })
}; 

// When I click a team, load the roster for that team. I need to get and store the ID from the data-id when I click the team.
// make an ajax call to grab the roster information of the specific team
// pass data (player names) to displayTeamRoster
app.getTeamRoster = (id) => {
  $.ajax({
    url: `${app.apiURL + app.teamURL}/${id}/${app.teamRosterURL}`,
    method: 'GET',
    dataType: 'json',
  })
  .then((teamRoster) => {
    app.displayTeamRoster(teamRoster.roster);
  })
}

// loop through the team roster
// create a list item and adding a class of player-info and attribute data-id with the player's id
// display player name in a p tag
// display jersey number
// display position code add attribute of data-pos to verify if player is goalie
// create displayed data as children to .roster-list
// hide team names

app.displayTeamRoster = (roster) => {
  //Sorting the roster by alphabetical order;
  $('.roster').prepend(`<h2>${app.chosenTeamName}</h2>`);
  roster.sort(function (a, b) {
    let alc = a.person.fullName.toLowerCase(),
      blc = b.person.fullName.toLowerCase();
    return alc > blc ? 1 : alc < blc ? -1 : 0;
  });
  // console.log(app.chosenTeamName);
  roster.forEach((players) => {
    const playerInfo = $('<li>').addClass('player-info').attr('data-id', players.person.id)
    .attr('data-pos', players.position.name).attr('data-name', players.person.fullName).attr('data-number', players.jerseyNumber);
    const playerName = $('<p>').text(players.person.fullName);
    const playerNumber = $('<span>').text(players.jerseyNumber);
    const playerPosition = $('<p>').attr("data-pos", players.position.name).text(players.position.code);
    playerInfo.append(playerNumber, playerName, playerPosition);
    $('.roster-list').append(playerInfo);
  })

  app.addHideClass('.teams');
}

app.getPlayerStats = (season) => {
    $.ajax({
    url: `${app.apiURL + app.playerURL}/${app.playerID}/${app.recentStatsURL + season} `,
    method: 'GET',
    dataType: 'json',
  })
  .then((playerStats) => {
    const statList = playerStats.stats[0].splits[0].stat;
    app.currentSeason = season;
    if (app.playerPosition === 'Goalie') {
      app.displayGoalieStats(statList);
    } else {
      app.displayPlayerStats(statList);
    }
  })
}

app.displayGoalieStats = (player) => {
  app.addHideClass('.roster-list');
  // if goalie display: savePercentage, wins, goalsAgainstAverage, games played, shutouts
  const playerSeasonStatContainer = $('<div>').addClass('season-stats').attr('data-season', app.currentSeason); 
  const playerSavePercentage = $('<p>').text(`Save Percentage: ${player.savePercentage}`);
  const playerWins = $('<p>').text(`Wins: ${player.wins}`);
  const playerGoalsAgainstAverage = $('<p>').text(`Goals Against Average: ${player.goalsAgainstAverage}`);
  const playerGames = $('<p>').text(`Games Played: ${player.games}`);
  const playerShutouts = $('<p>').text(`Shutouts: ${player.shutouts}`);
  $(playerSeasonStatContainer).append(playerSavePercentage, playerWins, playerGoalsAgainstAverage, playerGames, playerShutouts);
  $('.stats').append(playerSeasonStatContainer);
}

// hide roster list
// display goalie stats else display other play stats
app.displayPlayerStats = (player) => {
  app.addHideClass('.roster-list');
  console.log(app.currentSeason);
  console.log(player);

  const playerSeasonStatContainer = $('<div>').addClass('season-stats').attr('data-season', app.currentSeason);
  const playerAssists = $('<p>').text(`assists: ${player.assists}`);
  const playerGoals = $('<p>').text(`goals: ${player.goals}`);
  const playerPoints = $('<p>').text(`points: ${player.points}`);
  const playerGames = $('<p>').text(`games played: ${player.games}`)
  const playerGameWinningGoals = $('<p>').text(`game winning goals: ${player.gameWinningGoals}`)
  const playerPlusMinus = $('<p>').text(`+-: ${player.plusMinus}`);
  $(playerSeasonStatContainer).append(playerAssists, playerGoals, playerPoints, playerGames, playerGameWinningGoals, playerPlusMinus).prepend(app.seasonYear);
  
  $('.stats').append(playerSeasonStatContainer);

  // if ($('.season-stats').data('season') === 20172018) {
  //   $('.seaon-stats:nth-child(1)').append('<div>2017 2018</div>');
  // };

  app.playerAssists.push(player.assists);
  app.playerGoals.push(player.goals);
  app.playerPoints.push(player.points);

}


app.addHideClass = (selector) => {
  $(selector).addClass('hide');
}

// EVENT FUNCTIONS

// listening for a click on the class team-name
// item that is clicked, has its data-id value stored in teamID
// teamID is passed to getTeamRoster
app.getTeamID = () => {
  $('ul').on('click', '.team-name', function() {
    const teamID = $(this).data('id');
    app.chosenTeamName = $(this).data('team-name');
    app.getTeamRoster(teamID);
  })
}

// click event on player
// pass playerID to getPlayerStats
app.getPlayerID = () => {
  $('.roster-list').on('click', '.player-info', function() {
    app.playerID = $(this).data('id');
    app.playerPosition = $(this).data('pos');
    app.seasons.map(app.getPlayerStats);
    
  })
}

app.events = () => {
  app.getTeamID();
  app.getPlayerID();
};

app.init = () => {
  app.getData();
  app.events();
};

$(function() {
  app.init();
})