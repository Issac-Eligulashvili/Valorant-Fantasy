let url = 'https://nhlgpgurjjiiooebsouf.supabase.co';
let supabaseAPIKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obGdwZ3VyamppaW9vZWJzb3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzMzIxNTEsImV4cCI6MjA0NTkwODE1MX0.W-SkTjLHni4SBBXTu0Ae_g9K9rM4HF-tJ9MgQ1VcXqc'

const database = supabase.createClient(url, supabaseAPIKey);

let data = {
     'Americas': [
          // { name: 'G2_Esports', players: [] },
          // { name: 'Sentinels', players: [] },
          // { name: '100_Thieves', players: [] },
          // { name: 'Cloud9', players: [] },
          // { name: 'NRG_Esports', players: [] },
          // { name: 'Evil_Geniuses', players: [] },
          // { name: 'FURIA', players: [] },
          // { name: 'MIBR', players: [] },
          // { name: 'LOUD', players: [] },
          // { name: 'Leviatan', players: [] },
          // { name: 'KRU_Esports', players: [] },
     ],
     'Europe': [
          // { name: 'Karmine_Corp', players: [] },
          // { name: 'Fnatic', players: [] },
          // { name: 'Team_Vitality', players: [] },
          // { name: 'Liquid', players: [] },
          // { name: 'BBL_Esports', players: [] },
          // { name: 'Team_Heretics', players: [] },
          // { name: 'NAVI', players: [] },
          // { name: 'KOI', players: [] },
          // { name: 'FUT_Esports', players: [] },
          // { name: 'Gentle_Mates', players: [] },
          // { name: 'GIANTX', players: [] },
     ],
     'APAC': [
          // { name: 'DetonatioN_FocusMe', players: [] },
          // { name: 'DRX', players: [] },
          // { name: 'Gen.G', players: [] },
          // { name: 'Global_Esports', players: [] },
          // { name: 'Paper_Rex', players: [] },
          // { name: 'RRQ', players: [] },
          // { name: 'T1', players: [] },
          // { name: 'Talon_Esports', players: [] },
          // { name: 'Team_Secret', players: [] },
          // { name: 'ZETA_DIVISION', players: [] },
     ],
     'CN': [
          // { name: 'Bilibili_Gaming', players: [] },
          // { name: 'EDG', players: [] },
          // { name: 'Nova_Esports', players: [] },
          // { name: 'Wolves_Esports', players: [] },
          // { name: 'All_Gamers', players: [] },
          // { name: 'JDG', players: [] },
          // { name: 'TYLOO', players: [] },
          // { name: 'Titan Esports Club', players: [] },
          // { name: 'Trace Esports', players: [] },
          // { name: 'Dragon Ranger Gaming', players: [] },
          // { name: 'FPX', players: [] },
     ],
};

let players = [];

// Replace this URL with the target URL

Object.entries(data).forEach(([region, teams]) => {
     if (region === 'CN') {
          teams.forEach(async team => {
               let teamName = team.name.replace('_', ' ');
               const searchURL = `https://www.vlr.gg/search/?q=${encodeURIComponent(teamName)}`

               try {
                    const response = await fetch(searchURL);
                    if (!response.ok) {
                         throw new Error('Network response was not ok');
                    }

                    const html = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');


                    const playerLinkElement = doc.querySelector('.search-item');
                    let teamLink = playerLinkElement.getAttribute('href');

                    if (team.name === 'MIBR') {
                         teamLink = "/team/7386/mibr";
                    }

                    if (team.name === 'Karmine_Corp') {
                         teamLink = '/team/8877/karmine-corp';
                    }

                    const teamSearchURL = `https://www.vlr.gg${teamLink}`

                    console.log(teamSearchURL);
                    try {
                         const response = await fetch(teamSearchURL);

                         const html = await response.text();
                         const parser = new DOMParser();
                         const doc = parser.parseFromString(html, 'text/html');

                         const divs = doc.querySelectorAll('div');

                         divs.forEach(div => {
                              if (div.textContent.includes('players') && div.classList.contains('wf-module-label')) {
                                   const nextDiv = div.nextElementSibling;
                                   const playerElements = nextDiv.querySelectorAll('.team-roster-item');

                                   playerElements.forEach(async player => {
                                        const imageLink = player.querySelector('.team-roster-item-img img').getAttribute('src');
                                        const playerName = player.querySelector('.team-roster-item-name-alias').innerText.trim();

                                        const playerObj = {
                                             name: playerName,
                                             link: imageLink,
                                        }

                                        players.push(playerObj);
                                        let JSONPlayers = JSON.stringify(players)
                                        localStorage.setItem('players', JSONPlayers);
                                   })
                              }
                         })

                         // let playerImagesElements = doc.querySelectorAll('.team-roster-item-img img');
                         // playerImagesElements.forEach(player => {
                         //      console.log(player.getAttribute('src'));
                         // })
                    } catch (error) {

                    }
               } catch (error) {
                    console.error('Error fetching player link:', error);
                    return null;
               }
          })
     }
});

async function smthn() {
     let retreviedPlayers = localStorage.getItem('players');
     retreviedPlayers = JSON.parse(retreviedPlayers);
     retreviedPlayers.forEach(async player => {
          let name = `%${player.name}%`;
          let link = player.link;

          await database.from('players').update({
               'image_link': link,
          }).ilike("player", name);
     })
}

$('.dropdown-item').on('click', (e) => {
     let val = e.target.getAttribute('id');
     displayPlayers(val)
})

async function displayPlayers(region) {
     $('#playersContainer').html('');
     let players = await database.from('players').select();
     if (players.error) {
          console.log('there was an error');
     } else {
          const filteredPlayersByRegion = players.data.filter(player => {
               return player.region === region;
          })

          console.log(filteredPlayersByRegion);

          filteredPlayersByRegion.forEach(player => {
               const name = player.player;
               const position = player.position;
               let team = player.team;
               let link = player.image_link;
               let modifiedContent;

               let url = `https://issac-eligulashvili.github.io/logo-images/${team}.svg`;

               console.log(url);
               fetch(url).then(response => response.text())
                    .then(svgContent => {
                         if (team === '100_Thieves') {
                              team = 'One00_Thieves';
                         }
                         modifiedContent = svgContent.replace('<svg', `<svg class="${team}Logo"`);
                         if (team === 'ZETA_DIVISION') {
                              modifiedContent = modifiedContent.replace('width="30"', 'width="150')
                         }

                         const card = `
               <div class="player-card-container w-100 raleway text-white">
                    <div class="player-card-header d-flex position-relative w-100 ${team}BG">
                         <div class="player-card-header-bgColor"></div>
                         <div id="loudLogo" class="player-card-team-image position-absolute">
                              ${modifiedContent}
                         </div>
                         <div class="player-card-info-container d-flex pt-2 w-100">
                              <div class="player-card-player-image-container">
                                   <img src="${link}" class="player-card-player-image">
                              </div>
                              <div class="flex-grow-1">
                                   <h1>${name}</h1>
                              </div>
                         </div>
                    </div>
               </div>
               `

                         $('#playersContainer').append(card);
                    });
          })
     }




     fetch(url).then(response => response.text())
          .then(svgContent => {
               let modidifiedContent = svgContent.replace('<svg', `<svg class="${team}Logo"`);
               if (team === 'ZETA_DIVISION') {
                    modidifiedContent = modidifiedContent.replace('width="30"', 'width="150')
               }
               $('#loudLogo').append(modidifiedContent);
          });
}

displayPlayers();

//code to get players
// const url = `https://liquipedia.net/valorant/${teamName}`;

//                fetch(url)
//                     .then(response => {
//                          // Check if the response is okay
//                          if (!response.ok) {
//                               throw new Error('Network response was not ok');
//                          }
//                          return response.text(); // Get the HTML text
//                     })
//                     .then(html => {
//                          // Create a new DOMParser instance
//                          const parser = new DOMParser();
//                          // Parse the HTML
//                          const doc = parser.parseFromString(html, 'text/html');

//                          // Use querySelector or querySelectorAll to select elements
//                          const items = doc.querySelectorAll('.roster-card-wrapper');
//                          const players = items[0].querySelectorAll('.Player');
//                          players.forEach(player => {
//                               let name = player.querySelector('a').innerText;
//                               let isIGL = player.querySelector('i').classList.contains('fa-crown');
//                               let position;
//                               if (isIGL) {
//                                    position = ['IGL'];
//                               }

//                               uploadPlayers(name, teamName, region, position);
//                               team.players.push(name);

//                          })
//                     })
//                     .catch(error => {
//                          console.error('Error fetching data:', error);
//                     });
//           })

// initalize supabase client

// async function uploadPlayers(name, teamName, region, position) {
//      let response = await database.from('players').insert({
//           player: name,
//           team: teamName,
//           region: region,
//           position: position,
//      })
// }



