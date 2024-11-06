$(document).on('click', '.league-link', async function () {
     let currentLeagueName = $(this).find('p').text().trim();

     sessionStorage.setItem('currentLeagueName', currentLeagueName);

     const response = await database.from('leagues').select('').eq('league-name', currentLeagueName);
     let currentLeagueData = response.data[0];

     let currentLeagueDataID = currentLeagueData.leagueID;
});

async function getFirstLeague() {
     let user = await database.auth.getUser();
     user = user.data.user;

     const leagues = await database.from('leagues').select('');

     const leaguesUserIsIn = leagues.data.filter(league => {
          return league.teamsPlaying.find(player => player.playerID === user.id);
     })

     return leaguesUserIsIn[0].leagueID;
}

async function buildLeagueHTML() {
     let currentLeagueDataID;

     let user = await database.auth.getUser();
     user = user.data.user;

     if (sessionStorage.getItem('currentLeagueID') === null) {
          currentLeagueDataID = await getFirstLeague();
          sessionStorage.setItem('currentLeagueID', currentLeagueDataID);
     } else {
          let response = await database.from('leagues').select('').eq('league-name', sessionStorage.getItem('currentLeagueName'));
          sessionStorage.setItem('currentLeagueID', response.data[0]['leagueID'])
          currentLeagueDataID = sessionStorage.getItem('currentLeagueID');
     }

     const response = await database.from('leagues').select('').eq('leagueID', currentLeagueDataID);

     let currentLeagueData = response.data[0];

     let players = currentLeagueData.teamsPlaying;

     let currentPlayer = players.filter(player => {
          return player.playerID === user.id;
     });

     if (currentLeagueData.isDrafted) {
          console.log('draft was done');
     } else {
          const isAdmin = currentPlayer[0].isAdmin;
          let deleteLeagueBtn = '';
          if (isAdmin) {
               deleteLeagueBtn = `
                    <div class="p-2 deleteLeagueBtn ms-auto pointer" type="button" data-bs-toggle="modal" data-bs-target="#confirmLeagueDelete">
                         Delete League
                    </div>
               `
          }

          $('#leagueContentContainer').html(`
               <div class="row p-0 h-100 m-0">
                    <div class="col-12 p-3 d-flex flex-column" style="height: 100vh;">
                         <div class="d-flex align-items-center">
                              <img src="img/icons/game.png" style="width: 32px; height: 32px;">
                              <h5 class="raleway ms-2 text-white m-0">${currentLeagueData['league-name']}</h5>
                         </div>
                         <div class="league-info-container mt-4 p-3 raleway text-white d-flex flex-column flex-grow-1 overflow-y-hidden">
                              <div class="row p-0 m-0 gx-2">
                                   <div class="col-3 leagueNavLink activeLeagueNavLink pointer" id="leagueNavDraft">
                                        <div class=" leagueNavLinkBG d-flex">
                                             <span class="material-symbols-outlined">
                                                  note_alt
                                             </span>
                                             <p class="m-0">Draft</p>
                                        </div>
                                   </div>
                                   <div class="col-1 leagueNavLink pointer" id="leagueNavTeam">
                                        <div class="leagueNavLinkBG d-flex">
                                             <span class="material-symbols-outlined">
                                                  groups
                                             </span>
                                             <p class="my-0 ms-1">Team</p>
                                        </div>
                                   </div>
                                   <div class="col-1 leagueNavLink pointer" id="leagueNavPlayers">
                                        <div class="leagueNavLinkBG d-flex">
                                             <span class="material-symbols-outlined">
                                                  person
                                             </span>
                                             <p class="my-0 ms-1">Players</p>
                                        </div>
                                   </div>
                                   ${deleteLeagueBtn}
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
                                                  <div id="copyLeagueLink" class="d-flex pointer">
                                                       <span class="material-symbols-outlined">
                                                            content_copy
                                                       </span>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                                   <div class="mt-4 d-flex flex-column flex-grow-1 overflow-y-hidden">
                                   <div id="playersInLeague" class="d-flex flex-column overflow-y-hidden">
                                             <div>
                                                  <h6 class="mb-0">Teams in league</h6>
                                                  <p class="subtext m-0" style="font-size: 12px;">This is the list of all
                                                  current
                                                  teams</p>
                                             </div>
                                             <ol class="mt-3 playersInLeagueList overflow-y-scroll">
                                             </ol>
                                        </div>
                                   </div>
                              </div>
                              <div class="modal fade" id="confirmLeagueDelete" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog">
                                             <div class="modal-content">
                                                  <div class="modal-header border-0">
                                                       <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                  </div>
                                                  <div class="modal-body border-0 d-flex flex-column justify-content-center align-items-center">
                                                       <span class="material-symbols-outlined" style="font-size: 10rem; color: orange;">
                                                            error          
                                                       </span>
                                                       <h2 class="text-white raleway mt-2">Are you sure?</h2>
                                                       <p class="raleway subtext">This is process can't be undone</p>
                                                  </div>
                                                  <div class="modal-footer border-0 justify-content-center">
                                                       <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                       <button type="button" class="btn btn-primary" style="background-color: #FD4556;" id="deleteLeagueBtn">Delete League</button>
                                                  </div>
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