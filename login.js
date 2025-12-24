console.log("login.js loaded");

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "1234") {
    localStorage.setItem("adminLoggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error").innerText =
      "Invalid username or password";
  }
}
