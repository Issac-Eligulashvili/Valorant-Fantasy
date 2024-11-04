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

     if (currentLeagueData.isDrafted) {
          console.log('draft was done');
     } else {

     }
}

$(document).ready(function () {
     buildLeagueHTML();
});