const API = "https://blue-tooth-f141.josuwa2.workers.dev";

// 1. Core API Request function
async function apiRequest(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" }
  };
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(API + endpoint, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// 2. Auth Functions
async function login(username, password) {
  const data = await apiRequest("/api/login", "POST", { username, password });
  localStorage.setItem("pos_user", JSON.stringify(data.user));
  return data.user;
}

function logout() {
  localStorage.removeItem("pos_user");
  window.location.href = "index.html";
}

function getCurrentUser() {
  const user = localStorage.getItem("pos_user");
  return user ? JSON.parse(user) : null;
}

// 3. Route Protection (Ensures a cashier can't open the kitchen page, etc.)
function protectRoute(requiredRole) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html"; // Not logged in, go to login
  } else if (user.role !== requiredRole) {
    alert("Unauthorized access. Redirecting...");
    window.location.href = user.role === 'cashier' ? "cashier.html" : "kitchen.html";
  }
}
