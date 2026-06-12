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

  /* ============================================================
     Contact form
     ------------------------------------------------------------
     >>> TO ACTIVATE REAL EMAIL DELIVERY (FormSubmit): <<<
     Paste your FormSubmit AJAX endpoint into FORM_ENDPOINT below,
     e.g.  "https://formsubmit.co/ajax/info@auroradental.clinic"
     - Leave it "" (empty) → form keeps the no-setup mailto fallback.
     - Set it           → form posts directly to that inbox (no mail
                            app needed), keeping validation + inline
                            success message. Change the email anytime
                            by editing this one line.
     See TODO-FORM-SETUP.md for the full step-by-step + activation.
     ============================================================ */
  var FORM_ENDPOINT = ""; // <-- paste FormSubmit AJAX URL here when you have the inbox

  var form = document.getElementById("booking-form");
  if (form) {
    var status = form.querySelector(".form-status");
    var note = form.querySelector(".form-note");
    var submitBtn = form.querySelector("button[type=submit]");

    // If a real endpoint is configured, update the helper copy to match.
    if (FORM_ENDPOINT && note) {
      note.innerHTML = 'Your request is sent straight to our front desk. Prefer to talk? Call us at <a href="tel:6042716733">604-271-6733</a>.';
    }

    function setErr(field, on) {
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.toggle("invalid", on);
    }
    function showStatus(msg, ok) {
      if (!status) return;
      status.innerHTML = msg;
      status.classList.remove("ok", "err");
      status.classList.add("show", ok ? "ok" : "err");
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

      var data = {
        name: name.value.trim(),
        phone: phone.value.trim() || "(not provided)",
        email: email.value.trim(),
        message: msg.value.trim() || "(not provided)"
      };

      // ---- Path A: real delivery via FormSubmit (when configured) ----
      if (FORM_ENDPOINT) {
        if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.label = submitBtn.textContent; submitBtn.textContent = "Sending…"; }
        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            name: data.name,
            phone: data.phone,
            email: data.email,
            message: data.message,
            _subject: "Appointment request from " + data.name
          })
        })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && (res.success === "true" || res.success === true)) {
            showStatus("Thank you! Your appointment request has been sent. We'll be in touch soon. For anything urgent, call <a href=\"tel:6042716733\">604-271-6733</a>.", true);
            form.reset();
          } else { throw new Error("send failed"); }
        })
        .catch(function () {
          // Network/endpoint failure → fall back to mailto so the patient still gets through.
          mailtoFallback(data);
          showStatus("Opening your email app to send the request. If nothing happened, email <a href=\"mailto:info@auroradental.clinic\">info@auroradental.clinic</a> or call 604-271-6733.", true);
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; if (submitBtn.dataset.label) submitBtn.textContent = submitBtn.dataset.label; }
        });
        return;
      }

      // ---- Path B: no-setup mailto fallback (default) ----
      mailtoFallback(data);
      showStatus("Thanks! Your email app should now be open with your request ready to send. If it didn't open, please email <a href=\"mailto:info@auroradental.clinic\">info@auroradental.clinic</a> or call 604-271-6733.", true);
      form.reset();
    });

    function mailtoFallback(data) {
      var body =
        "Full name: " + data.name + "\n" +
        "Phone number: " + data.phone + "\n" +
        "Email address: " + data.email + "\n" +
        "Reason for Appointment: " + data.message + "\n";
      window.location.href = "mailto:info@auroradental.clinic" +
        "?subject=" + encodeURIComponent("Appointment request from " + data.name) +
        "&body=" + encodeURIComponent(body);
    }
  }

  /* ---------- Footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
