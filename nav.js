export function injectMobileNav(activePage = "home") {
  const nav = document.createElement("nav");
  nav.className = "bottom-nav";

  nav.innerHTML = `
    <a class="${activePage === "home" ? "active" : ""}" href="index.html">
      <i data-lucide="home"></i>
      <span>Home</span>
    </a>

    <a class="${activePage === "explore" ? "active" : ""}" href="explore.html">
      <i data-lucide="compass"></i>
      <span>Explore</span>
    </a>

    <a class="create-mobile" href="create.html">
      <i data-lucide="plus"></i>
    </a>

    <a class="${activePage === "search" ? "active" : ""}" href="search.html">
      <i data-lucide="search"></i>
      <span>Search</span>
    </a>

    <a class="${activePage === "profile" ? "active" : ""}" href="profile.html">
      <i data-lucide="user"></i>
      <span>Profile</span>
    </a>
  `;

  document.body.appendChild(nav);

  if (window.lucide) {
    lucide.createIcons();
  }
}