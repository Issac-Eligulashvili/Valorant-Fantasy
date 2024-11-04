$(document).on('click', '.league-link', async function () {
     let currentLeagueName = $(this).find('p').text().trim();
     const response = await database.from('leagues').select('').eq('league-name', currentLeagueName);
     let currentLeagueData = response.data[0];
     let currentLeagueID = currentLeagueData.leagueID;


     if (currentLeagueData.isDrafted) {

     } else {

     }
});

async function getFirstLeague() {
     let user = await database.auth.getUser();
     user = user.data.user;

     const leagues = await database.from('leagues').select('');

     const leaguesUserIsIn = leagues.data.filter(league => {
          return league.teamsPlaying.find(player => player.playerID === user.id);
     })

     return leaguesUserIsIn[0];
}

async function buildLeagueHTML() {
     const currentLeagueData = await getFirstLeague();
     let players = currentLeagueData.teamsPlaying;

     if (currentLeagueData.isDrafted) {
          console.log('draft was done');
     } else {
          $('#leagueLink').val(`http://localhost:3000/join/${currentLeagueData.leagueID}`);
          $('#playersNeeded').text(`${players.length} / ${currentLeagueData.numPlayers}`);

          for (i = 0; i < currentLeagueData.numPlayers; i++) {
               let player = players[i];
               if (player) {
                    if (i === 0) {
                         $('.playersInLeagueList').append(`<li>
                              ${player.playerName}
                              <img src="img/icons/crown.png">
                              </li>`);
                    }
               } else {
                    $('.playersInLeagueList').append(`<li>Team ${i + 1}</li>`)
               }
          }
     }
}

$(document).ready(function () {
     buildLeagueHTML();
     $('#copyLeagueLink').on('click', () => {
          let link = $('#leagueLink');
          link.select();
          document.execCommand('copy');
     })
});