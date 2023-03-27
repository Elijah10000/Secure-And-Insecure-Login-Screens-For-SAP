console.log("App.js file loaded.");
import { createUser } from './db.js';
import { query } from './db.js';

query('SELECT * FROM users')
  .then(result => console.log(result))
  .catch(error => console.error(error));

function redirectToSuccess() {
  window.location.href = "success.html";
}

const form = document.querySelector('#login-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = form.elements.username.value;
  const password = form.elements.password.value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    console.log(data); // Do something with response data
  } catch (error) {
    console.error(error);
  }
});


// document.querySelector('form[name="login-form"]').addEventListener("submit", function(event) {
//   event.preventDefault();
//   var username = document.forms["loginForm"]["username"].value;
//   var password = document.forms["loginForm"]["password"].value;

//   // send login credentials to server for validation
//   fetch('/login/authenticate', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ username, password })
//   })
//   .then(response => {
//     if (response.ok) {
//       redirectToSuccess();
//     } else {
//       alert("Invalid username or password");
//     }
//   })
//   .catch(error => {
//     console.error(error);
//     alert("Failed to login. Please try again later.");
//   });
// });

function validateForm() {
  var username = document.forms["myForm"]["username"].value;
  var password = document.forms["myForm"]["password"].value;
  if (username == "" || password == "") {
    alert("Please fill in all fields");
    return false;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return false;
  }
}
