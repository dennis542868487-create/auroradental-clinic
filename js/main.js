/* Aurora Dental Clinic — interaction & motion
   Fails open: if JS is disabled, content is fully visible (CSS reveal states
   only apply after .in / .ready classes are added here). */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header solid-on-scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header && header.classList.contains("over-hero")) {
    var onScroll = function () {
      if (window.scrollY > 40) header.classList.add("solid");
      else header.classList.remove("solid");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");
  var backdrop = document.querySelector(".nav-backdrop");
  function closeNav() {
    if (!nav) return;
    nav.classList.remove("open");
    if (toggle) { toggle.classList.remove("active"); toggle.setAttribute("aria-expanded", "false"); }
    if (backdrop) backdrop.classList.remove("show");
    document.body.classList.remove("nav-open");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (backdrop) backdrop.classList.toggle("show", open);
      document.body.classList.toggle("nav-open", open);
    });
    if (backdrop) backdrop.addEventListener("click", closeNav);
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
  }

  /* ---------- Hero entrance ---------- */
  var hero = document.querySelector(".hero");
  if (hero) {
    if (reduce) hero.classList.add("ready");
    else requestAnimationFrame(function () { setTimeout(function () { hero.classList.add("ready"); }, 60); });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal], [data-reveal-img], [data-stagger]");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.hasAttribute("data-stagger")) {
          var kids = el.children, base = window.innerWidth < 640 ? 60 : 100;
          for (var i = 0; i < kids.length; i++) {
            (function (k, idx) { setTimeout(function () { k.style.opacity = 1; k.style.transform = "none"; }, idx * base); })(kids[i], i);
          }
        }
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Services jump-nav active state ---------- */
  var jumpLinks = document.querySelectorAll(".svc-jumpnav a");
  if (jumpLinks.length && "IntersectionObserver" in window) {
    var map = {};
    jumpLinks.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          jumpLinks.forEach(function (l) { l.classList.remove("active"); });
          if (map[e.target.id]) map[e.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll(".svc[id]").forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Today's hours highlight ---------- */
  var hoursTable = document.querySelector(".hours-table");
  if (hoursTable) {
    var day = new Date().getDay(); // 0 Sun .. 6 Sat
    var row = hoursTable.querySelector('tr[data-day="' + day + '"]');
    if (row) row.classList.add("today");
  }

  /* ---------- Contact form: validation + mailto handoff ---------- */
  var form = document.getElementById("booking-form");
  if (form) {
    var status = form.querySelector(".form-status");
    function setErr(field, on) {
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.toggle("invalid", on);
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements["your-name"];
      var email = form.elements["your-email"];
      var phone = form.elements["tel-598"];
      var msg = form.elements["your-message"];
      var valid = true;
      if (!name.value.trim()) { setErr(name, true); valid = false; } else setErr(name, false);
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (!emailOk) { setErr(email, true); valid = false; } else setErr(email, false);
      if (!valid) {
        var firstBad = form.querySelector(".field.invalid input");
        if (firstBad) firstBad.focus();
        return;
      }
      var body =
        "Full name: " + name.value.trim() + "\n" +
        "Phone number: " + (phone.value.trim() || "(not provided)") + "\n" +
        "Email address: " + email.value.trim() + "\n" +
        "Reason for Appointment: " + (msg.value.trim() || "(not provided)") + "\n";
      var href = "mailto:info@auroradental.clinic" +
        "?subject=" + encodeURIComponent("Appointment request from " + name.value.trim()) +
        "&body=" + encodeURIComponent(body);
      if (status) { status.classList.add("show", "ok"); }
      window.location.href = href;
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
