// ─────────────────────────────────────────────
//  WEDDING SITE PASSWORD HASH
//  The actual password lives as a GitHub secret.
//  Only its SHA-256 hash is stored here.
// ─────────────────────────────────────────────
const PASSWORD_HASH = "SET_PASSWORD_HERE";

// Session key used in sessionStorage
const SESSION_KEY = "al_wedding_auth";

function isAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

async function authenticate(input) {
  const encoded = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  if (hashHex === PASSWORD_HASH) {
    sessionStorage.setItem(SESSION_KEY, "true");
    return true;
  }
  return false;
}

function requireAuth() {
  if (isAuthenticated()) return; // already in — do nothing

  // Build the password overlay
  const overlay = document.createElement("div");
  overlay.id = "auth-overlay";
  overlay.innerHTML = `
    <div class="auth-box">
      <p class="auth-eyebrow">Adriana &amp; Lorenzo</p>
      <h2 class="auth-title">6th June 2026</h2>
      <p class="auth-sub">Enter the password to continue</p>
      <div class="auth-field">
        <input
          id="auth-input"
          type="password"
          placeholder="Password"
          autocomplete="current-password"
          autofocus
        />
        <button id="auth-btn">→</button>
      </div>
      <p class="auth-error" id="auth-error"></p>
    </div>
  `;

  // Inject styles
  const style = document.createElement("style");
  style.textContent = `
    #auth-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: var(--blue-bg, var(--green-bg, var(--red-bg, var(--teal-bg, #c5d5e3))));
    }

    .auth-box {
      text-align: center;
      max-width: 380px;
      width: 100%;
      animation: authFadeUp 0.7s ease both;
    }

    .auth-eyebrow {
      font-family: 'Jost', sans-serif;
      font-weight: 200;
      font-size: 0.7rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--blue-dark, currentColor);
      opacity: 0.6;
      margin-bottom: 0.6rem;
    }

    .auth-title {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 300;
      font-size: clamp(2.5rem, 8vw, 4rem);
      color: var(--blue-dark, currentColor);
      letter-spacing: 0.04em;
      margin-bottom: 0.5rem;
    }

    .auth-sub {
      font-family: 'Jost', sans-serif;
      font-weight: 300;
      font-size: 0.8rem;
      letter-spacing: 0.1em;
      color: var(--blue-dark, currentColor);
      opacity: 0.55;
      margin-bottom: 2rem;
    }

    .auth-field {
      display: flex;
      border-bottom: 1px solid currentColor;
      opacity: 0.6;
      transition: opacity 0.2s;
    }
    .auth-field:focus-within { opacity: 1; }

    #auth-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      padding: 0.75rem 0.5rem 0.75rem 0;
      font-family: 'Jost', sans-serif;
      font-weight: 300;
      font-size: 1rem;
      letter-spacing: 0.1em;
      color: inherit;
    }
    #auth-input::placeholder { opacity: 0.4; }

    #auth-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.3rem;
      color: inherit;
      padding: 0 0.25rem;
      opacity: 0.7;
      transition: opacity 0.2s, transform 0.2s;
    }
    #auth-btn:hover { opacity: 1; transform: translateX(3px); }

    .auth-error {
      margin-top: 1rem;
      font-family: 'Jost', sans-serif;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      color: inherit;
      opacity: 0;
      transition: opacity 0.3s;
      min-height: 1.2em;
    }
    .auth-error.visible { opacity: 0.7; }

    @keyframes authFadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes authShake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-6px); }
      80%       { transform: translateX(6px); }
    }
    .auth-shake { animation: authShake 0.4s ease; }
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  document.querySelectorAll("a[href]").forEach(a => {
    a.addEventListener("click", e => {
      if (!isAuthenticated()) e.preventDefault();
    });
  });

  async function attempt() {
    const val = document.getElementById("auth-input").value;
    const errEl = document.getElementById("auth-error");

    if (await authenticate(val)) {
      overlay.style.transition = "opacity 0.5s";
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = "";
      }, 500);
    } else {
      errEl.textContent = "Incorrect password. Please try again.";
      errEl.classList.add("visible");
      document.getElementById("auth-input").value = "";
      document.querySelector(".auth-field").classList.add("auth-shake");
      setTimeout(() => {
        document.querySelector(".auth-field")?.classList.remove("auth-shake");
      }, 400);
    }
  }

  document.getElementById("auth-btn").addEventListener("click", attempt);
  document.getElementById("auth-input").addEventListener("keydown", e => {
    if (e.key === "Enter") attempt();
  });
}

// Run immediately
requireAuth();
