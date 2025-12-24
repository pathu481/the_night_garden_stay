function requireAuth() {
  if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "login.html";
}
function loginAdmin(username, password) {
  // Example credentials
  if(username === "admin" && password === "1234"){
    localStorage.setItem("adminLoggedIn", "true");
    window.location.href = "dashboard.html"; // Redirect to dashboard
  } else {
    alert("Invalid credentials");
  }
}
