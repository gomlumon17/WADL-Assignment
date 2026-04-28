const API = "http://localhost:3000/api/users";

function setButtonLoading(buttonId, isLoading, originalText) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  if (isLoading) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;
  } else {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// Register
async function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const role = document.getElementById("role").value.trim();
  const github = document.getElementById("github").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !role || !github || !password) {
    return alert("Please fill in all fields.");
  }

  setButtonLoading("registerBtn", true);

  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, email, role, github, password })
    });

    const data = await res.json();
    
    if (res.ok || data.success) {
      alert("Registered Successfully! Please log in.");
      // Pre-fill email in localStorage to help identify them later
      localStorage.setItem("userEmail", email);
      window.location.href = "login.html";
    } else {
      alert(data.message || "Registration failed.");
    }
  } catch (error) {
    alert("Network error. Please try again later.");
    console.error(error);
  } finally {
    setButtonLoading("registerBtn", false, `<span>Register</span> <i class="fa-solid fa-user-plus"></i>`);
  }
}

// Login
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    return alert("Please enter both email and password.");
  }

  setButtonLoading("loginBtn", true);

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email); // Save email to identify current user
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Invalid credentials.");
    }
  } catch (error) {
    alert("Network error. Please try again later.");
    console.error(error);
  } finally {
    setButtonLoading("loginBtn", false, `<span>Login</span> <i class="fa-solid fa-arrow-right"></i>`);
  }
}

// Load Users & Render Dashboard
// Load User Profile
async function loadUsers() {
  try {
    const token = localStorage.getItem("token");
    const currentUserEmail = localStorage.getItem("userEmail");
    
    const res = await fetch(API, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    const users = await res.json();
    const myProfileContainer = document.getElementById("myProfileContainer");
    myProfileContainer.innerHTML = "";

    if (Array.isArray(users)) {
      // Find ONLY the currently logged-in user
      const currentUser = users.find(user => user.email === currentUserEmail);

      if (currentUser) {
        const userRole = currentUser.role || "Member";
        const userGithub = currentUser.github || "N/A";

        myProfileContainer.innerHTML = `
          <div class="my-profile-card">
            <div class="user-card-content">
              <div class="user-avatar">
                <i class="fa-solid fa-circle-user"></i>
              </div>
              <div class="user-details">
                <h4>${currentUser.name}</h4>
                <p><i class="fa-solid fa-envelope"></i> ${currentUser.email}</p>
                <p><i class="fa-solid fa-briefcase"></i> ${userRole}</p>
                <p><i class="fa-brands fa-github"></i> ${userGithub}</p>
              </div>
            </div>
          </div>
        `;
      } else {
        myProfileContainer.innerHTML = "<p>User profile not found.</p>";
      }
    } else {
      myProfileContainer.innerHTML = "<p>Error loading profile data.</p>";
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
    document.getElementById("myProfileContainer").innerHTML = "<p>Network error loading profile.</p>";
  }
}

// Logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  window.location.href = "login.html";
}

// Auto load on dashboard
if (window.location.pathname.includes("dashboard.html")) {
  if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
  } else {
    loadUsers();
  }
}