
import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const accountArea = document.getElementById("accountArea");

if (accountArea) {

  const style = document.createElement("style");

  style.textContent = `
    #accountArea {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 100000;
    }

    .account-user-btn {
      display: flex;
      align-items: center;
      gap: 9px;
      border: 1px solid #d7c6a0;
      background: #fff;
      color: #173b35;
      padding: 7px 13px;
      border-radius: 30px;
      cursor: pointer;
      font: inherit;
      font-weight: 600;
    }

    .account-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #173b35;
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

    .account-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      width: 235px;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      box-shadow: 0 12px 35px rgba(0,0,0,.16);
      padding: 10px;
      display: none;
      z-index: 100002;
    }

    .account-dropdown.show {
      display: block;
    }

    .account-user-info {
      padding: 10px;
      border-bottom: 1px solid #eee;
      margin-bottom: 7px;
      overflow-wrap: anywhere;
    }

    .account-user-info strong {
      display: block;
      color: #173b35;
      font-size: 14px;
    }

    .account-user-info small {
      color: #777;
      font-size: 12px;
    }

    .account-dropdown a,
    .account-logout {
      display: block;
      width: 100%;
      box-sizing: border-box;
      text-decoration: none;
      padding: 10px;
      border-radius: 7px;
      color: #333;
      font-size: 14px;
      text-align: left;
      background: transparent;
      border: 0;
      cursor: pointer;
      font-family: inherit;
    }

    .account-dropdown a:hover,
    .account-logout:hover {
      background: #f3f6f4;
      color: #173b35;
    }

    .account-logout {
      border-top: 1px solid #eee;
      margin-top: 6px;
      color: #b42318;
    }

    @media(max-width: 700px) {
      #accountArea {
        margin-top: 10px;
      }

      .account-dropdown {
        right: 0;
      }
    }
  `;

  document.head.appendChild(style);

  accountArea.innerHTML = `
    <a class="btn secondary" href="./login.html">Login</a>
    <a class="btn" href="./register.html">Register</a>
  `;

  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      accountArea.innerHTML = `
        <a class="btn secondary" href="./login.html">Login</a>
        <a class="btn" href="./register.html">Register</a>
      `;
      return;
    }

    let displayName = user.displayName || "My Account";
    let photoURL = user.photoURL || "";
    let isAdmin = false;

    try {
      const adminSnap = await getDoc(doc(db, "admins", user.uid));

      if (adminSnap.exists() &&
          adminSnap.data().status === "active") {
        isAdmin = true;
      }

      const candidateSnap = await getDoc(
        doc(db, "candidates", user.uid)
      );

      if (candidateSnap.exists()) {
        const candidate = candidateSnap.data();
        displayName = candidate.fullName || displayName;
      }

    } catch (error) {
      console.error("Account details:", error);
    }

    const initial = displayName.trim().charAt(0).toUpperCase() || "U";

    const avatar = photoURL
      ? `<img src="${photoURL}" alt="Profile">`
      : initial;

    const dashboardLink = isAdmin
      ? "./admin/dashboard.html"
      : "./candidate-dashboard.html";

    const dashboardLabel = isAdmin
      ? "Admin Dashboard"
      : "My Dashboard";

    accountArea.innerHTML = `
      <button
        type="button"
        class="account-user-btn"
        id="accountUserButton"
        aria-expanded="false"
        aria-label="Open account menu">

        <span class="account-avatar">${avatar}</span>
        <span>My Account</span>
        <span>▾</span>
      </button>

      <div class="account-dropdown" id="accountDropdown">

        <div class="account-user-info">
          <strong>${escapeHTML(displayName)}</strong>
          <small>${escapeHTML(user.email || "")}</small>
        </div>

        <a href="${dashboardLink}">${dashboardLabel}</a>

        ${isAdmin ? "" : `
          <a href="./profile.html">My Profile</a>
          <a href="./candidate-dashboard.html">My Applications</a>
          <a href="./jobs.html">Find Jobs</a>
        `}

        <button type="button" class="account-logout" id="accountLogout">
          Logout
        </button>

      </div>
    `;

    const menuButton = document.getElementById("accountUserButton");
    const dropdown = document.getElementById("accountDropdown");
    const logoutButton = document.getElementById("accountLogout");

    menuButton.addEventListener("click", () => {
      const isOpen = dropdown.classList.toggle("show");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
      if (!accountArea.contains(event.target)) {
        dropdown.classList.remove("show");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });

    logoutButton.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "./login.html";
      } catch (error) {
        alert("Logout failed. Please try again.");
        console.error(error);
      }
    });

  });

}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}
