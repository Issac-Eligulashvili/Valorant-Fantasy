$(document).ready(function () {
     const params = new URLSearchParams(window.location.search);
     const uniqueID = params.get('uniqueID');

     if (uniqueID) {
          // Save the unique ID to session storage or wherever needed
          sessionStorage.setItem('uniqueLeagueID', uniqueID);


          setTimeout(() => {
               // Replace the current URL without query parameters
               history.replaceState(null, '', '/join.html');
          }, 10);
     }
});