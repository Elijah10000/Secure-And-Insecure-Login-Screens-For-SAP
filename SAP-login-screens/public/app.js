// console.log("App.js file loaded.");

// function redirectToSuccessPage() {
//   window.location.href = "success.html";
// }

// function authenticate() {
//   var username = document.forms["myForm"]["username"].value;
//   var password = document.forms["myForm"]["password"].value;
  
//   // send a request to the server to authenticate the user
//   var xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       if (this.responseText === "success") {
//         redirectToSuccessPage();
//       } else {
//         alert("Invalid username or password");
//       }
//     }
//   };
//   xhttp.open("POST", "/authenticate", true);
//   xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//   xhttp.send("username=" + username + "&password=" + password);
// }

// function validateForm() {
//   var username = document.forms["myForm"]["username"].value;
//   var password = document.forms["myForm"]["password"].value;
//   if (username == "" || password == "") {
//     alert("Please fill in all fields");
//     return false;
//   }
//   if (password.length < 6) {
//     alert("Password must be at least 6 characters");
//     return false;
//   }
// }

// console.log("App.js file loaded.");

// function redirectToSuccess() {
//   window.location.href = "success.html";
// }

// document.forms["myForm"].addEventListener("submit", function(event) {
//   event.preventDefault();
//   var username = document.forms["myForm"]["username"].value;
//   var password = document.forms["myForm"]["password"].value;

//   // perform the login logic here
//   // if login is successful, call the function to redirect to success page
//   if (username === "example" && password === "password") {
//     redirectToSuccess();
//   } else {
//     alert("Invalid username or password");
//   }
// });

// function validateForm() {
//   var username = document.forms["myForm"]["username"].value;
//   var password = document.forms["myForm"]["password"].value;
//   if (username == "" || password == "") {
//     alert("Please fill in all fields");
//     return false;
//   }
//   if (password.length < 6) {
//     alert("Password must be at least 6 characters");
//     return false;
//   }
// }


console.log("App.js file loaded.");

function redirectToSuccess() {
  window.location.href = "success.html";
}

document.querySelector('form[name="login-form"]').addEventListener("submit", function(event) {
  event.preventDefault();
  var username = document.forms["loginForm"]["username"].value;
  var password = document.forms["loginForm"]["password"].value;

  // send login credentials to server for validation
  fetch('/login/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => {
    if (response.ok) {
      redirectToSuccess();
    } else {
      alert("Invalid username or password");
    }
  })
  .catch(error => {
    console.error(error);
    alert("Failed to login. Please try again later.");
  });
});

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
