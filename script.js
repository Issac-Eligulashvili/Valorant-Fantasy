//initalize supabase client
let url = 'https://nhlgpgurjjiiooebsouf.supabase.co';
let supabaseAPIKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obGdwZ3VyamppaW9vZWJzb3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzMzIxNTEsImV4cCI6MjA0NTkwODE1MX0.W-SkTjLHni4SBBXTu0Ae_g9K9rM4HF-tJ9MgQ1VcXqc'

const database = supabase.createClient(url, supabaseAPIKey);

const signUpFunction = async (email, password, username) => {
     let response = await database
          .auth.signUp({
               email: email,
               password: password,
          })
     if (response.error) {
          alert('There was an error signing up');
     }

     const sigma = await database.from("users").insert({
          username: username,
          email: email,
          id: response.data.user.id,
     });

     window.location.href = 'index.html'

}

$('#signInButton').on('click', () => {
     let email = $('.signUp').find('#emailInput').val();
     let password = $('.signUp').find('#passwordInput').val();
     let username = $('.signUp').find('#usernameInput').val();
     signUpFunction(email, password, username);
})

