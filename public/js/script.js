//initalize supabase client
let url = 'https://nhlgpgurjjiiooebsouf.supabase.co';
let supabaseAPIKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obGdwZ3VyamppaW9vZWJzb3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzMzIxNTEsImV4cCI6MjA0NTkwODE1MX0.W-SkTjLHni4SBBXTu0Ae_g9K9rM4HF-tJ9MgQ1VcXqc'

const database = supabase.createClient(url, supabaseAPIKey);

//getting the userdata after logging in/signing up
$(document).ready(async function () {
     checkUser();
     let user = await database.auth.getUser();
     user = user.data.user;
     let { data, error } = await database.from("users").select('username').eq('id', user.id);

     $('#usernameText').text(`${data[0].username}`);

     $("#sidebar").on('mouseenter', () => {
          $("#sidebar").addClass('expand');
     }).on('mouseleave', () => {
          $("#sidebar").removeClass('expand');
     })

     $('#accountSettingsBtn').on('click', () => {
          $('#settingsRow').children('.col-9').addClass('d-none');
          $('#accountSettings').removeClass('d-none');
     })

     $('#profileSettingsBtn').on('click', () => {
          $('#settingsRow').children('.col-9').addClass('d-none');
          $('#profileSettings').removeClass('d-none');
     })

     $('#leagueContentContainer').on('click', '.leagueNavLink', function (e) {
          $('.leagueNavLink').removeClass().addClass('leagueNavLink');
          $('.leagueNavLink').not(this).addClass('col-1');
          $(this).addClass('col-3 activeLeagueNavLink');
     })

     $('#leagueContentContainer').on('click', '#leagueNavPlayers', async function () {
          $('#leagueCurrentContent').html(`
               <div class="d-flex mt-4 filterBtnContainer">
                    <div class="filterAvailablePlayersBtn active">
                         All
                    </div>
                    <div class="filterAvailablePlayersBtn">
                         IGL
                    </div>
                    <div class="filterAvailablePlayersBtn">
                         Duelist
                    </div>
                    <div class="filterAvailablePlayersBtn">
                         Controller
                    </div>
                    <div class="filterAvailablePlayersBtn">
                         Sentinel
                    </div>
                    <div class="filterAvailablePlayersBtn">
                         Initiator
                    </div>
                    <div class="filterAvailablePlayersBtn">
                         Flex
                    </div>
               </div>
               
               <div class="w-100 d-block mt-3 flex-grow-1 table-container overflow-y-scroll">
               <table id="currentAvailablePlayersTable" class="w-100">
                    <tr>
                         <th>Player</th>
                         <th>Team</th>
                         <th>Region</th>
                    </tr>
               </table>
               </div>
          `)

          const currentLeagueData = await database.from('leagues').select('').eq('leagueID', sessionStorage.getItem('currentLeagueID'));

          const availablePlayers = currentLeagueData.data[0]['available_players'];

          const response = await database.from('players').select('').in('player', availablePlayers);

          response.data.forEach(player => {
               let region = player.region;

               if (player.region === 'Europe') {
                    region = 'EMEA'
               } else if (player.region === 'APAC') {
                    region = 'Pacific'
               }

               const row = `
                    <tr>
                         <td class="ps-2">${player.player}</td>
                         <td>${player['team_abbr']}</td>
                         <td>${region}</td>
                    </tr>
               `

               $('#currentAvailablePlayersTable').append(row);
          })
     })

     $('#leagueContentContainer').on('click', '.filterAvailablePlayersBtn', async function (e) {
          $('.filterAvailablePlayersBtn').removeClass('active');
          $(e.target).addClass('active');

          const currentLeagueData = await database.from('leagues').select('').eq('leagueID', sessionStorage.getItem('currentLeagueID'));

          const availablePlayers = currentLeagueData.data[0]['available_players'];
          const availablePlayersData = await database.from('players').select('').in('player', availablePlayers);


          const currentPositon = $(e.target).text().trim();

          let filterByPosition = availablePlayersData.data.filter(player => {
               return player.position.includes(currentPositon);
          })

          if (filterByPosition.length === 0) {
               filterByPosition = availablePlayersData.data;
          }

          $('#currentAvailablePlayersTable').html(`
          <tr>
                         <th>Player</th>
                         <th>Team</th>
                         <th>Region</th>
                    </tr>     
          `)

          filterByPosition.forEach(player => {
               let region = player.region;

               if (player.region === 'Europe') {
                    region = 'EMEA'
               } else if (player.region === 'APAC') {
                    region = 'Pacific'
               }

               const row = `
                    <tr>
                         <td class="ps-2 p-1">${player.player}</td>
                         <td>${player['team_abbr']}</td>
                         <td>${region}</td>
                    </tr>
               `

               $('#currentAvailablePlayersTable').append(row);
          })
     })






     function showToast() {
          $('#joinToast').addClass('show');

          setTimeout(() => {
               $('#joinToast').removeClass('show');
          }, 3000);
     }

     const isJoined = sessionStorage.getItem('joined');

     if (document.referrer.includes('join.html') && isJoined === 'false') {
          showToast();
     }
});

