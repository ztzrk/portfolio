/* =========================================================
   AFLAH ALIFU — script.js
   Minimalist interactions: Theme Switch, Copy Email, Reveal
   ========================================================= */

(function () {
    "use strict";

    /* ---------------------------------------------------------
     1. LIGHT / DARK THEME TOGGLE
    --------------------------------------------------------- */
    const root = document.documentElement;
    const themeToggle = document.getElementById("theme-toggle");
    const themeLabel = document.getElementById("theme-label");

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        if (themeLabel) {
            themeLabel.textContent = theme === "dark" ? "Light" : "Dark";
        }
    }

    const savedTheme = localStorage.getItem("aa-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
        applyTheme(savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const current = root.getAttribute("data-theme") || "light";
            const next = current === "light" ? "dark" : "light";
            applyTheme(next);
            localStorage.setItem("aa-theme", next);
        });
    }

    /* ---------------------------------------------------------
     2. ONE-CLICK COPY EMAIL
    --------------------------------------------------------- */
    const copyBtn = document.getElementById("copy-email-btn");

    if (copyBtn) {
        copyBtn.addEventListener("click", async () => {
            const email = copyBtn.dataset.email || "ralif877@gmail.com";
            try {
                await navigator.clipboard.writeText(email);
                const prev = copyBtn.textContent;
                copyBtn.textContent = "Copied ✓";
                setTimeout(() => {
                    copyBtn.textContent = prev;
                }, 2000);
            } catch (_) {
                window.location.href = `mailto:${email}`;
            }
        });
    }

    /* ---------------------------------------------------------
     3. SUBTLE SCROLL REVEAL
    --------------------------------------------------------- */
    const reveals = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
        );

        reveals.forEach((el) => observer.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add("active"));
    }
})();
