const app = {};

app.apiURL = 'https://statsapi.web.nhl.com/api/v1/';
app.teamURL = 'teams'

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
  console.log('display Team call');
  teams.forEach((team) => {
    const teamName = $('<li>').attr('data-id', team.id).addClass('team-name').text(team.name);
    $('.teams ul').append(teamName);
  })
} 

app.events = () => {
  $('ul').on('click', '.team-name', function () {
    console.log('click');
  })
};

app.init = () => {
  app.getData();
  app.events();
};

$(function() {
  app.init();
})