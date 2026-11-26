
import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

const accountArea = document.getElementById("accountArea");

if (accountArea) {
  const style = document.createElement("style");

  style.textContent = `
    .account-wrap {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .account-user-btn {
      display: flex;
      align-items: center;
      gap: 9px;
      border: 1px solid #dce3e8;
      background: #fff;
      color: #183047;
      padding: 6px 12px 6px 7px;
      border-radius: 30px;
      cursor: pointer;
      font: inherit;
    }

    .account-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #173d35;
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      overflow: hidden;
    }

    .account-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .account-user-name {
      max-width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      font-weight: 600;
    }

    .account-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      width: 245px;
      background: #fff;
      border: 1px solid #e1e7eb;
      border-radius: 12px;
      box-shadow: 0 12px 35px rgba(0,0,0,.15);
      padding: 9px;
      z-index: 9999;
    }

    .account-dropdown[hidden] {
      display: none;
    }

    .account-info {
      padding: 12px;
      border-bottom: 1px solid #edf0f2;
      margin-bottom: 6px;
      overflow-wrap: anywhere;
    }

    .account-info strong {
      display: block;
      color: #183047;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .account-info small {
      color: #71808c;
      font-size: 12px;
    }

    .account-dropdown a,
    .account-logout {
      display: block;
      width: 100%;
      box-sizing: border-box;
      padding: 11px 12px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: #263b4b;
      text-align: left;
      text-decoration: none;
      font: inherit;
      font-size: 14px;
      cursor: pointer;
    }

    .account-dropdown a:hover,
    .account-logout:hover {
      background: #f1f5f4;
    }

    .account-logout {
      color: #b42318;
      border-top: 1px solid #edf0f2;
      margin-top: 5px;
      padding-top: 12px;
    }

    @media(max-width: 600px) {
      .account-user-name {
        display: none;
      }

      .account-dropdown {
        width: 230px;
      }
    }
  `;

  document.head.appendChild(style);

  function showLoggedOut() {
    accountArea.innerHTML = `
      <a class="btn secondary" href="login.html">Login</a>
      <a class="btn" href="register.html">Register</a>
    `;
  }

  function showLoggedIn(user) {
    const displayName = user.displayName || "Candidate";
    const email = user.email || "";
    const initial = displayName.trim().charAt(0).toUpperCase() || "U";

    const avatar = user.photoURL
      ? `<img src="${user.photoURL}" alt="Profile">`
      : initial;

    accountArea.innerHTML = `
      <div class="account-wrap">
        <button
          type="button"
          class="account-user-btn"
          id="accountUserButton"
          aria-expanded="false"
          aria-label="Open account menu"
        >
          <span class="account-avatar">${avatar}</span>
          <span class="account-user-name">${displayName}</span>
          <span aria-hidden="true">⌄</span>
        </button>

        <div class="account-dropdown" id="accountDropdown" hidden>
          <div class="account-info">
            <strong>${displayName}</strong>
            <small>${email}</small>
          </div>

          <a href="candidate-dashboard.html">My Dashboard</a>
          <a href="profile.html">My Profile / Edit Profile</a>
          <a href="candidate-dashboard.html">My Applications</a>
          <a href="jobs.html">Find Jobs</a>

          <button type="button" class="account-logout" id="accountLogout">
            Logout
          </button>
        </div>
      </div>
    `;

    const userButton = document.getElementById("accountUserButton");
    const dropdown = document.getElementById("accountDropdown");
    const logoutButton = document.getElementById("accountLogout");

    userButton.addEventListener("click", () => {
      const isOpening = dropdown.hidden;
      dropdown.hidden = !isOpening;
      userButton.setAttribute("aria-expanded", String(isOpening));
    });

    document.addEventListener("click", (event) => {
      if (!accountArea.contains(event.target)) {
        dropdown.hidden = true;
        userButton.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        dropdown.hidden = true;
        userButton.setAttribute("aria-expanded", "false");
      }
    });

    logoutButton.addEventListener("click", async () => {
      logoutButton.disabled = true;
      logoutButton.textContent = "Signing out...";

      try {
        await signOut(auth);
        window.location.href = "login.html";
      } catch (error) {
        console.error("Logout error:", error);
        alert("Logout failed. Please try again.");
        logoutButton.disabled = false;
        logoutButton.textContent = "Logout";
      }
    });
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      showLoggedIn(user);
    } else {
      showLoggedOut();
    }
  });
}

