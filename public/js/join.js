$(document).ready(async function () {
     const params = new URLSearchParams(window.location.search);
     const uniqueID = params.get('uniqueID');

     if (uniqueID) {
          // Save the unique ID to session storage or wherever needed
          sessionStorage.setItem('uniqueLeagueID', uniqueID);


          setTimeout(() => {
               // Replace the current URL without query parameters
               history.replaceState(null, '', '/join.html');
          }, 10);


          let user = await database.auth.getUser();
          user = user.data.user;

          let username = await database.from('users').select('username').eq('id', user.id);
          username = username.data[0].username;

          const response = await database.from('leagues').select('').eq('leagueID', uniqueID);

          let players = response.data[0].teamsPlaying;

          players.forEach(async player => {
               if (player.playerID === user.id) {
                    sessionStorage.setItem('joined', 'true');
                    window.location.href = "index.html";
               } else {
                    sessionStorage.setItem('joined', 'false');

                    //get all list of current users to be manipulated
                    console.log(players);
                    players.push({
                         playerID: user.id,
                         playerName: username,
                         team: [],
                         isAdmin: false,
                    })

                    const response = await database.from('leagues').update({ teamsPlaying: players }).eq('leagueID', uniqueID);


                    window.location.href = "index.html";
               }
          })
     }
});