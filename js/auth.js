//initalize global variables needed for this. 
let user;

//initalize supabase client
let url = 'https://nhlgpgurjjiiooebsouf.supabase.co';
let supabaseAPIKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obGdwZ3VyamppaW9vZWJzb3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzMzIxNTEsImV4cCI6MjA0NTkwODE1MX0.W-SkTjLHni4SBBXTu0Ae_g9K9rM4HF-tJ9MgQ1VcXqc'

const database = supabase.createClient(url, supabaseAPIKey);
//create singup functionality
const signUpFunction = async (email, password, username) => {
     let response = await database
          .auth.signUp({
               email: email,
               password: password,
          })
     if (response.error) {
          alert('There was an error signing up');
     }

     const userID = response.data.user.id

     await database.from("users").insert({
          username: username,
          email: email,
          id: userID,
     })
     window.location.href = 'login.html';
}

//adding the signup functionality to the signup button
$('#signInButton').on('click', () => {
     let email = $('.signUp').find('#emailInput').val();
     let password = $('.signUp').find('#passwordInput').val();
     let username = $('.signUp').find('#usernameInput').val();
     signUpFunction(email, password, username);
})

//creating login functionality
const signInFunction = async (email, password) => {
     let response = await database
          .auth.signInWithPassword({
               email: email,
               password: password,
          });
     if (response.error) {
          alert('Incorrect email or password');
     } else {
          console.log('User successfully')
          console.log(response.data);
     }
}

$('#logInButton').on('click', () => {
     let email = $('.logIn').find('#emailInput').val();
     let password = $('.logIn').find('#passwordInput').val();
     console.log(email, password);
     signInFunction(email, password);
})

//check if there is an active user right now and if not redirect to the login page.
async function checkUser() {
     let response = await database.auth.getUser();

     if (response.data.user) {
          console.log('there is a user logged in right now');
     } else {
          console.log('no user currently logged in');
     }
}

checkUser();