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
     sessionStorage.setItem('currentLeagueID', currentLeagueData.leagueID);
     let players = currentLeagueData.teamsPlaying;

     if (currentLeagueData.isDrafted) {
          console.log('draft was done');
     } else {
          $('#leagueContentContainer').html(`
               <div class="row p-0 h-100 m-0">
                    <div class="col-12 p-3 d-flex flex-column" style="height: 100vh;">
                         <div class="d-flex align-items-center">
                              <img src="img/icons/game.png" style="width: 32px; height: 32px;">
                              <h5 class="raleway ms-2 text-white m-0">Rizzlers</h5>
                         </div>
                         <div class="league-info-container mt-4 p-3 raleway text-white d-flex flex-column flex-grow-1 overflow-y-hidden">
                              <div class="row p-0 m-0 gx-2">
                                   <div class="col-3 leagueNavLink activeLeagueNavLink" id="leagueNavDraft">
                                        <div class=" leagueNavLinkBG d-flex">
                                             <span class="material-symbols-outlined">
                                                  note_alt
                                             </span>
                                             <p class="m-0">Draft</p>
                                        </div>
                                   </div>
                                   <div class="col-1 leagueNavLink" id="leagueNavTeam">
                                        <div class="leagueNavLinkBG d-flex">
                                             <span class="material-symbols-outlined">
                                                  groups
                                             </span>
                                             <p class="my-0 ms-1">Team</p>
                                        </div>
                                   </div>
                                   <div class="col-1 leagueNavLink" id="leagueNavPlayers">
                                        <div class="leagueNavLinkBG d-flex">
                                             <span class="material-symbols-outlined">
                                                  person
                                             </span>
                                             <p class="my-0 ms-1">Players</p>
                                        </div>
                                   </div>
                              </div>
                              <div id="leagueCurrentContent" class="d-flex flex-column flex-grow-1 overflow-y-hidden">
                                   <div class="invFriendsLinkContainer p-3 mt-4">
                                        <div class="d-flex justify-content-between">
                                             <div>
                                                  <h6 class="mb-0">Invite friends to play</h6>
                                                  <p class="subtext" style="font-size: 12px;">Copy the link and share with
                                                       your
                                                       friends</p>
                                             </div>
                                             <div>
                                                  <h6 id="playersNeeded">
                                                       ${players.length} / ${currentLeagueData.numPlayers}
                                                  </h6>
                                             </div>
                                        </div>

                                        <div class="mt-3">
                                             <div id="leagueInvLinkInput">
                                                  <label for="leagueLink"></label>
                                                  <input class="m-0" id="leagueLink" name="leagueLink" type="text"></input>
                                                  <div id="copyLeagueLink" class="d-flex">
                                                       <span class="material-symbols-outlined">
                                                            content_copy
                                                       </span>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                                   <div class="mt-4">
                                   <div id="playersInLeague">
                                             <div>
                                                  <h6 class="mb-0">Teams in league</h6>
                                                  <p class="subtext m-0" style="font-size: 12px;">This is the list of all
                                                  current
                                                  teams</p>
                                             </div>
                                             <ol class="mt-3 playersInLeagueList">
                                             </ol>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>     
          `)

          $('#leagueLink').val(`http://localhost:3000/join/${currentLeagueData.leagueID}`);

          for (i = 0; i < currentLeagueData.numPlayers; i++) {
               let player = players[i];
               console.log(player);
               if (player) {
                    if (i === 0) {
                         $('.playersInLeagueList').append(`<li>
                              ${player.playerName}
                              <img src="img/icons/crown.png">
                              </li>`);
                    } else {
                         $('.playersInLeagueList').append(`<li>
                              ${player.playerName}
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
     $('#leagueContentContainer').on('click', '#copyLeagueLink', () => {
          console.log('clicked');
          let link = $('#leagueLink');
          console.log(link);
          link.select();
          document.execCommand('copy');
     })
});