async function getLeagues() {
     try {
          const response = await fetch('http://localhost:3000/api/leagues');
          const data = await response.json();

          const VCTLeagues = data[0];

          const filteredByYear = VCTLeagues.series.filter(serie => {
               return serie.year === 2024 && serie.name.indexOf('Game Changers') === -1;
          })

          console.log(filteredByYear);

     } catch (error) {
          console.error('Error fetching players:', error);
     }
}

getLeagues();