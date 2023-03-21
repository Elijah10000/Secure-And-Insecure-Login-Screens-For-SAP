console.log("App.js file loaded.");

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

  function redirectToSuccessPage() {
    window.location.href = 'success.html';
  }

  const submitButton = document.querySelector('input[type="submit"]');
  submitButton.addEventListener('click', redirectToSuccessPage());

  function authenticate() {
    var username = document.forms["myForm"]["username"].value;
    var password = document.forms["myForm"]["password"].value;
    
    // send a request to the server to authenticate the user
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if (this.responseText === "success") {
          window.location.href = "success.html";
        } else {
          alert("Invalid username or password");
        }
      }
    };
    xhttp.open("POST", "/authenticate", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username=" + username + "&password=" + password);
  }

  authenticate();
  return false;
}
