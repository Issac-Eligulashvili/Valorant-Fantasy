const apiKey = '65QDNHhlJ9DpoFuMqOXnwEaLIXaYqYdzfs0doMYBmxRM3JNa0uk';

const tournamentURL = 'https://api.pandascore.co/valorant/tournaments';
const playersURL = 'https://api.pandascore.co/valorant/players';

const options = {
     method: 'GET',
     headers: {
          accept: 'application/json',
          authorization: `Bearer 65QDNHhlJ9DpoFuMqOXnwEaLIXaYqYdzfs0doMYBmxRM3JNa0uk`,

     },
     mode: 'no-cors',
};

fetch('https://api.pandascore.co/valorant/leagues', options)
     .then(res => res.json())
     .then(res => console.log(res))
     .catch(err => console.error(err));
