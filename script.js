/* =========================================================
   PORTFOLIO SCRIPT - Mark Pocholo Ombao
   Features:
   1. Mobile hamburger menu
   2. Smooth scrolling + close menu on click
   3. Active navigation link (scroll spy)
   4. Navbar shadow + scroll-to-top button
   5. Scroll reveal animations
   6. Typing animation
   7. Button interactions (View Project)
   8. Contact form validation
   ========================================================= */

// Tell the CSS that JavaScript is running (used by the .reveal animation)
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Grab elements we need ---------- */
  const navbar    = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navMenu   = document.getElementById("nav-links");
  const navLinks  = document.querySelectorAll(".nav-link");
  const sections  = document.querySelectorAll("main section[id]");
  const toTopBtn  = document.getElementById("to-top");

  /* ---------- 1. MOBILE HAMBURGER MENU ---------- */
  function setMenu(open) {
    navMenu.classList.toggle("open", open);
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
  }

  hamburger.addEventListener("click", () => {
    setMenu(!navMenu.classList.contains("open"));
  });

  // Close the menu when a link is clicked, or when pressing Escape
  navLinks.forEach(link => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

  /* ---------- 2. SMOOTH SCROLLING ----------
     CSS already has "scroll-behavior: smooth", but this JS version
     also works in older browsers and highlights the clicked link. */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const id = anchor.getAttribute("href");
      if (id.length < 2) { e.preventDefault(); return; }   // placeholder "#" links do nothing
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight + 1;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ---------- 3. ACTIVE NAV LINK (scroll spy) ---------- */
  function updateActiveLink() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 120;
    let currentId = sections[0].id;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) currentId = section.id;
    });

    // If we are at the very bottom of the page, highlight the last section
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      currentId = sections[sections.length - 1].id;
    }

    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });
  }

  /* ---------- 4. NAVBAR SHADOW + SCROLL-TO-TOP BUTTON ---------- */
  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
    toTopBtn.classList.toggle("show", window.scrollY > 400);
    updateActiveLink();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on page load

  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 5. SCROLL REVEAL ANIMATION ----------
     Elements with class "reveal" fade in when they enter the screen. */
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);   // animate only once
        }
      });
    }, { threshold: 0.15 });

    // Small delay between cards in the same row for a nicer effect
    revealItems.forEach((item, i) => {
      item.style.transitionDelay = (i % 3) * 0.1 + "s";
      observer.observe(item);
    });
  } else {
    // Very old browser: just show everything
    revealItems.forEach(item => item.classList.add("visible"));
  }

  /* ---------- 6. TYPING ANIMATION ----------
     Types and erases the roles below. Edit the list to add your own. */
  const typingEl = document.getElementById("typing");
  const roles = ["Aspiring Web Developer", "Front-End Learner", "Problem Solver"];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typingEl && !reducedMotion) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting  = false;

    function type() {
      const word = roles[roleIndex];
      typingEl.textContent = word.slice(0, charIndex);

      let delay = deleting ? 45 : 90;

      if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = 1800;                       // pause when a word is complete
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
      }
      charIndex += deleting ? -1 : 1;
      setTimeout(type, delay);
    }
    typingEl.textContent = "";
    type();
  }

  /* ---------- 7. BUTTON INTERACTIONS ----------
     "View Project" buttons currently have href="#".
     Replace the href in index.html with your real link and this
     message will stop appearing automatically. */
  document.querySelectorAll("[data-project]").forEach(btn => {
    btn.addEventListener("click", e => {
      if (btn.getAttribute("href") === "#") {
        e.preventDefault();
        showToast(`"${btn.dataset.project}" link coming soon!`);
      }
    });
  });

  // Small pop-up message at the bottom of the screen
  function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.setAttribute("role", "status");
      Object.assign(toast.style, {
        position: "fixed", left: "50%", bottom: "24px",
        transform: "translateX(-50%) translateY(20px)",
        background: "#1c2358", color: "#fff", padding: "0.7rem 1.2rem",
        border: "1px solid #7c5cff", borderRadius: "8px", fontSize: "0.9rem",
        opacity: "0", transition: "opacity .3s, transform .3s", zIndex: "200"
      });
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";
    });
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(20px)";
    }, 2500);
  }

  /* ---------- 8. CONTACT FORM VALIDATION ----------
     Frontend only: nothing is sent anywhere. */
  const form       = document.getElementById("contact-form");
  const nameInput  = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const msgInput   = document.getElementById("message");
  const statusEl   = document.getElementById("form-status");

  // Show or clear an error under a field
  function setError(input, message) {
    const field = input.closest(".field");
    document.getElementById(input.id + "-error").textContent = message;
    field.classList.toggle("invalid", Boolean(message));
  }

  function validate() {
    let valid = true;
    const name    = nameInput.value.trim();
    const email   = emailInput.value.trim();
    const message = msgInput.value.trim();

    // Name: at least 2 characters
    if (name.length < 2) { setError(nameInput, "Please enter your name."); valid = false; }
    else setError(nameInput, "");

    // Email: simple pattern check (text@text.text)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) { setError(emailInput, "Please enter a valid email address."); valid = false; }
    else setError(emailInput, "");

    // Message: at least 10 characters
    if (message.length < 10) { setError(msgInput, "Message must be at least 10 characters."); valid = false; }
    else setError(msgInput, "");

    return valid;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();                       // stop the page from reloading
    statusEl.className = "form-status";

    if (validate()) {
      statusEl.textContent = `Thanks, ${nameInput.value.trim()}! Your message was sent successfully.`;
      statusEl.classList.add("success");
      form.reset();
      setTimeout(() => { statusEl.textContent = ""; }, 6000);
    } else {
      statusEl.textContent = "Please fix the errors above and try again.";
      statusEl.classList.add("fail");
    }
  });

  // Clear an error as soon as the visitor starts fixing it
  [nameInput, emailInput, msgInput].forEach(input => {
    input.addEventListener("input", () => setError(input, ""));
  });

});
