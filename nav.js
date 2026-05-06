/**
 * nav.js — Nexr shared navigation utility
 * Injects: Google Fonts, shared CSS tokens, bottom nav, unread notification badge
 */

// ─── Inject Google Fonts if not already present ──────────────────────────────
export function injectFonts() {
  if (document.querySelector('link[data-nexr-fonts]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.setAttribute("data-nexr-fonts", "1");
  link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=Space+Grotesk:wght@400;500;700&display=swap";
  document.head.prepend(link);
  document.body.style.fontFamily = "'DM Sans', Arial, sans-serif";
}

// ─── Shared CSS token patch ───────────────────────────────────────────────────
export function injectTokens() {
  if (document.querySelector('style[data-nexr-tokens]')) return;
  const style = document.createElement("style");
  style.setAttribute("data-nexr-tokens", "1");
  style.textContent = `
    :root {
      --bg: #050507;
      --panel: rgba(14,14,18,.88);
      --panel2: rgba(18,18,24,.96);
      --soft: rgba(255,255,255,.05);
      --soft2: rgba(255,255,255,.08);
      --line: rgba(255,255,255,.08);
      --text: #f0f0f5;
      --muted: #8888a0;
      --accent: #00e5ff;
      --accent2: #7c3aed;
      --hot: #ff2bd6;
      --danger: #ff4d6d;
      --success: #22d3a0;
      --r-card: 24px;
      --r-pill: 999px;
    }
    body { font-family: 'DM Sans', Arial, sans-serif; }
    .logo { font-family: 'Space Grotesk', Arial, sans-serif !important; }
  `;
  document.head.appendChild(style);
}

// ─── Bottom nav ───────────────────────────────────────────────────────────────
export function injectMobileNav(activePage = "home") {
  injectFonts();
  injectTokens();

  if (!document.querySelector('style[data-nexr-nav]')) {
    const style = document.createElement("style");
    style.setAttribute("data-nexr-nav", "1");
    style.textContent = `
      .bottom-nav {
        display: none;
        position: fixed;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        width: min(420px, 94vw);
        background: rgba(14,14,18,.92);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 999px;
        padding: 10px 8px;
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        box-shadow: 0 8px 40px rgba(0,0,0,.45);
        z-index: 200;
        grid-template-columns: repeat(5, 1fr);
        align-items: center;
      }
      @media (max-width: 860px) { .bottom-nav { display: grid; } }
      .bottom-nav a {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        color: #8888a0;
        font-size: 10px;
        font-weight: 700;
        padding: 6px 4px;
        border-radius: 999px;
        transition: color .18s, background .18s;
        text-decoration: none;
        position: relative;
      }
      .bottom-nav a svg { width: 22px; height: 22px; }
      .bottom-nav a.active { color: #f0f0f5; background: rgba(255,255,255,.07); }
      .bottom-nav a span { display: block; }
      .bottom-nav .create-mobile {
        background: linear-gradient(135deg, #00e5ff, #7c3aed);
        color: black !important;
        width: 46px; height: 46px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        padding: 0;
      }
      .bottom-nav .create-mobile svg { width: 22px; height: 22px; }
      .nav-notif-dot {
        position: absolute;
        top: 4px; right: 10px;
        width: 8px; height: 8px;
        border-radius: 50%;
        background: #ff2bd6;
        border: 2px solid rgba(14,14,18,.92);
        display: none;
      }
      .nav-notif-dot.visible { display: block; }
    `;
    document.head.appendChild(style);
  }

  const nav = document.createElement("nav");
  nav.className = "bottom-nav";
  nav.setAttribute("aria-label", "Main navigation");
  nav.innerHTML = `
    <a class="${activePage === "home" ? "active" : ""}" href="index.html" aria-label="Home">
      <i data-lucide="home"></i><span>Home</span>
    </a>
    <a class="${activePage === "explore" ? "active" : ""}" href="explore.html" aria-label="Explore">
      <i data-lucide="compass"></i><span>Explore</span>
    </a>
    <a class="create-mobile" href="create.html" aria-label="Create post">
      <i data-lucide="plus"></i>
    </a>
    <a class="${activePage === "search" ? "active" : ""}" href="search.html" aria-label="Search">
      <i data-lucide="search"></i><span>Search</span>
    </a>
    <a class="${activePage === "profile" ? "active" : ""}" href="profile.html" aria-label="Profile">
      <i data-lucide="user"></i><span>Me</span>
    </a>
  `;
  document.body.appendChild(nav);
  if (window.lucide) lucide.createIcons();
}

// ─── Live unread notification badge ──────────────────────────────────────────
export function startNotifBadge(db, uid, dotSelector = ".nav-notif-dot") {
  import("https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js")
    .then(({ collection, query, where, onSnapshot }) => {
      const q = query(
        collection(db, "notifications"),
        where("toUserId", "==", uid),
        where("read", "==", false)
      );
      onSnapshot(q, snap => {
        document.querySelectorAll(dotSelector).forEach(dot => {
          dot.classList.toggle("visible", snap.size > 0);
        });
      });
    })
    .catch(console.error);
}