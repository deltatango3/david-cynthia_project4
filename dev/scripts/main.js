const app = {};

app.apiURL = 'https://statsapi.web.nhl.com/api/v1/';
app.teamURL = 'teams';
app.teamRosterURL = 'roster';
app.playerURL = 'people';
app.recentStatsURL = 'stats?stats=statsSingleSeason&season=20172018';

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

app.displayTeam = (teams) => {
  console.log(teams);
  teams.forEach((team) => {
    const teamName = $('<li>').attr('data-id', team.id).addClass('team-name').text(team.name);
    $('.teams ul').append(teamName);
  })
} 

//When I click a team, load the roster for that team. I need to get and store the ID from the data-id when I click the team.
app.getTeamRoster = (id) => {
  // console.log(id);
  $.ajax({
    url: `${app.apiURL + app.teamURL}/${id}/${app.teamRosterURL}`,
    method: 'GET',
    dataType: 'json',
  })
  .then((teamRoster) => {
    app.displayTeamRoster(teamRoster.roster);
  })
}

app.displayTeamRoster = (roster) => {
  // console.log(roster);
  roster.forEach((players) => {
    const playerInfo = $('<li>').addClass('player-info').attr('data-id', players.person.id);
    const playerName = $('<p>').text(players.person.fullName);
    const playerNumber = $('<span>').text(players.jerseyNumber);
    playerInfo.append(playerNumber, playerName);
    $('.roster-list').append(playerInfo);
  })
  app.addHideClass('.teams');
}

app.getPlayerStats = (id) => {
  // console.log(id);
  $.ajax({
    url: `${app.apiURL + app.playerURL}/${id}/${app.recentStatsURL}`,
    method: 'GET',
    dataType: 'json',
  })
  .then((playerStats) => {
    // console.log(playerStats);
    app.displayPlayerStats(playerStats.stats[0].splits[0].stat);
  })
}
// Need to consider goalie
app.displayPlayerStats = (player) => {
  console.log(player);
  const newStat = `$('<p>').text`;
  app.addHideClass('.roster-list');
  const playerAssists = $('<p>').text(`assists: ${player.assists}`);
  const playerGoals = $('<p>').text(`goals: ${player.goals}`);
  const playerPoints = $('<p>').text(`points: ${player.points}`);
  const playerGames = $('<p>').text(`games played: ${player.games}`)
  $('.stats').append(playerAssists, playerGoals, playerPoints, playerGames);
}

app.addHideClass = (selector) => {
  $(selector).addClass('hide');
}

// EVENT FUNCTIONS
app.getTeamID = () => {
  $('ul').on('click', '.team-name', function() {
    const teamID = $(this).data('id');
    app.getTeamRoster(teamID);
  })
}

app.getPlayerID = () => {
  $('.roster-list').on('click', '.player-info', function() {
    const playerID = $(this).data('id');
    app.getPlayerStats(playerID);
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