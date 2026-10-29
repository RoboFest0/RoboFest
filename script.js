document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mobile menu
  const setMenu = (isOpen) => {
    nav.classList.toggle("open", isOpen);
    menuButton.textContent = isOpen ? "✕" : "☰";
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  };

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
  }

  // Smooth scroll to sections and keep the URL hash in sync
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = targetId && document.getElementById(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${targetId}`);
    });
  });

  // Reveal elements as they enter the viewport
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  // Highlight the nav item for the section currently in view
  if ("IntersectionObserver" in window && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));
  }

  // Demo-only form; no data is sent to a server
  const interestForm = document.querySelector("#interest-form");
  const formMessage = document.querySelector("#form-message");
  if (interestForm && formMessage) {
    interestForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!interestForm.reportValidity()) return;
      const name = document.querySelector("#name").value.trim() || "there";
      formMessage.textContent = `Thanks, ${name}! This demo form works locally, but registration is not connected to a server yet.`;
      formMessage.classList.add("success");
    });
  }

  // Footer year
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  // 3D button press: works with finger, mouse or pen
  document.querySelectorAll(
    ".main-event-button, .register .submit-button, .events .section-heading > .button-secondary, .hero-actions .button"
  ).forEach((btn) => {
    const release = () => btn.classList.remove("is-pressed");
    btn.addEventListener("pointerdown", () => btn.classList.add("is-pressed"));
    ["pointerup", "pointerleave", "pointercancel"].forEach((type) => btn.addEventListener(type, release));
  });
});
