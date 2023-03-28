console.log("signup.js file loaded.");
import * as db from "./db.js";
// import { createUser } from './db.js';
import { query } from './db.js';

// query('SELECT * FROM users')
//   .then(result => console.log(result))
//   .catch(error => console.error(error));

function redirectToSuccess() {
  window.location.href = "success.html";
}

const form = document.querySelector('#signup-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = form.elements["username"].value;
  const password = form.elements["password"].value;

  try {
    const response = await fetch('/signup', {
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

function validateForm() {
  const username = document.forms["myForm"]["username"].value;
  const password = document.forms["myForm"]["password"].value;
  if (username == "" || password == "") {
    alert("Please fill in all fields");
    return false;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return false;
  }
  return true;
}
