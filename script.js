/*
  Iron Turf — interactions
  - Sticky header styling on scroll
  - Mobile menu open/close with accessibility attributes
  - Smooth scrolling with sticky header offset
  - Active nav link highlighting based on section in view
*/

(() => {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const links = Array.from(document.querySelectorAll(".nav__link"));
  const year = document.getElementById("year");

  const sections = Array.from(document.querySelectorAll("section[id]"));

  // Footer year
  if (year) year.textContent = String(new Date().getFullYear());

  // Helpers
  const headerHeight = () => (header ? header.offsetHeight : 0);
  const isMobile = () => window.matchMedia("(max-width: 859px)").matches;

  // Mobile menu
  const closeMenu = () => {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  const openMenu = () => {
    if (!nav || !toggle) return;
    nav.classList.add("is-open");
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("is-open");
      if (isOpen) closeMenu();
      else openMenu();
    });

    // Close if user clicks outside the menu (mobile)
    document.addEventListener("click", (e) => {
      if (!isMobile()) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      const clickedInside = nav.contains(target) || toggle.contains(target);
      if (!clickedInside) closeMenu();
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (!isMobile()) return;
      if (e.key === "Escape") closeMenu();
    });
  }

  // Smooth scroll with header offset
  const smoothScrollTo = (el) => {
    const y = el.getBoundingClientRect().top + window.scrollY - headerHeight() + 6;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      smoothScrollTo(target);
      if (isMobile()) closeMenu();
    });
  });

  // Header styling + active section logic
  const setActiveLink = (id) => {
    links.forEach((l) => {
      const href = l.getAttribute("href") || "";
      l.classList.toggle("is-active", href === `#${id}`);
    });
  };

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 12);

    // Find current section
    const current = sections
      .slice()
      .reverse()
      .find((s) => {
        const top = s.getBoundingClientRect().top + window.scrollY;
        return y + headerHeight() + 110 >= top;
      });

    if (current) setActiveLink(current.id);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    // If switching to desktop, ensure menu isn't stuck open
    if (!isMobile()) closeMenu();
  });

  onScroll();
})();

