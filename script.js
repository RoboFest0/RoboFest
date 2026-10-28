document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".nav-link");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
      });
    });
  }

  // Smoothly navigate to matching sections without requiring duplicate IDs.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href").slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${targetId}`);
      }
    });
  });

  // Reveal elements as they enter the viewport.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  // Demo-only form; no data is sent to a server.
  const interestForm = document.querySelector("#interest-form");
  const formMessage = document.querySelector("#form-message");
  if (interestForm && formMessage) {
    interestForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!interestForm.reportValidity()) return;
      const nameField = document.querySelector("#name");
      const name = nameField ? nameField.value.trim() : "there";
      formMessage.textContent = `Thanks, ${name}! This demo form works locally, but registration is not connected to a server yet.`;
      formMessage.classList.add("success");
    });
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Highlight the navigation item for the section currently in view.
  if ("IntersectionObserver" in window && navLinks.length) {
    const sections = document.querySelectorAll("main section[id]");
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
  }
});
document.querySelectorAll(
  '.main-event-button, .register .submit-button, .events .section-heading > .button-secondary, .hero-actions .button'
).forEach(function (btn) {
  var release = function () { btn.classList.remove('is-pressed'); };
  btn.addEventListener('pointerdown', function () { btn.classList.add('is-pressed'); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (e) {
    btn.addEventListener(e, release);
  });
});