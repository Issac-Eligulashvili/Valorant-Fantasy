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

     $('.leagueNavLink').on('click', function (e) {
          $('.leagueNavLink').removeClass().addClass('leagueNavLink');
          $('.leagueNavLink').not(this).addClass('col-1');
          $(this).addClass('col-3 activeLeagueNavLink')
     })
});

