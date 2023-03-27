// console.log("signup.js file loaded.");
import * as db from "./db.js";
import { createUser } from './db.js';
import { query } from './db.js';

query('SELECT * FROM users')
  .then(result => console.log(result))
  .catch(error => console.error(error));


function redirectToSuccess() {
  window.location.href = "success.html";
}

document.querySelector('form[action="/signup"]').addEventListener("submit", async function(event) {
    event.preventDefault();
    var username = document.forms["signupForm"]["username"].value;
    var password = document.forms["signupForm"]["password"].value;
    var confirmPassword = document.forms["signupForm"]["confirm-password"].value;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    await db.createUser(username, password);
    redirectToSuccess();
  } catch (err) {
    console.error(err.stack);
    alert("Failed to signup. Please try again later.");
  }
});

// function validateForm() {
//   var username = document.forms["signupForm"]["username"].value;
//   var password = document.forms["signupForm"]["password"].value;
//   var confirmPassword = document.forms["signupForm"]["confirm-password"].value;
//   if (username == "" || password == "" || confirmPassword == "") {
//     alert("Please fill in all fields");
//     return false;
//   }
//   if (password.length < 6) {
//     alert("Password must be at least 6 characters");
//     return false;
//   }
// }