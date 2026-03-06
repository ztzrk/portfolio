/* =========================================================
   PORTFOLIO — script.js
   All animations and interactive effects
   ========================================================= */

(function () {
    "use strict";

    /* ---------------------------------------------------------
     1. PARTICLE CANVAS (Starfield / Constellation)
  --------------------------------------------------------- */
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");
    let particles = [];
    let mouse = { x: null, y: null };
    const PARTICLE_COUNT = 80;
    const CONNECT_DISTANCE = 120;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Subtle mouse attraction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    this.x += dx * 0.002;
                    this.y += dy * 0.002;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6, 182, 212, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = window.innerWidth < 768 ? 40 : PARTICLE_COUNT;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DISTANCE) {
                    const opacity = (1 - dist / CONNECT_DISTANCE) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    // Track mouse on hero section
    document.addEventListener("mousemove", (e) => {
        const heroRect = canvas.getBoundingClientRect();
        if (
            e.clientX >= heroRect.left &&
            e.clientX <= heroRect.right &&
            e.clientY >= heroRect.top &&
            e.clientY <= heroRect.bottom
        ) {
            mouse.x = e.clientX - heroRect.left;
            mouse.y = e.clientY - heroRect.top;
        } else {
            mouse.x = null;
            mouse.y = null;
        }
    });

    window.addEventListener("resize", () => {
        resizeCanvas();
        initParticles();
    });

    resizeCanvas();
    initParticles();
    animateParticles();

    /* ---------------------------------------------------------
     2. TYPING EFFECT
  --------------------------------------------------------- */
    const typedElement = document.getElementById("typed-text");
    const titles = [
        "Full Stack Developer",
        "Frontend Developer",
        "Flutter Developer",
        "Information Systems Student",
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const TYPING_SPEED = 80;
    const DELETING_SPEED = 40;
    const PAUSE_AFTER_TYPE = 2000;
    const PAUSE_AFTER_DELETE = 500;

    function typeEffect() {
        const currentTitle = titles[titleIndex];

        if (!isDeleting) {
            typedElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentTitle.length) {
                isDeleting = true;
                setTimeout(typeEffect, PAUSE_AFTER_TYPE);
                return;
            }
            setTimeout(typeEffect, TYPING_SPEED);
        } else {
            typedElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                setTimeout(typeEffect, PAUSE_AFTER_DELETE);
                return;
            }
            setTimeout(typeEffect, DELETING_SPEED);
        }
    }

    typeEffect();

    /* ---------------------------------------------------------
     3. NAVBAR — scroll & mobile toggle
  --------------------------------------------------------- */
    const navbar = document.getElementById("navbar");
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 60) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    navToggle.addEventListener("click", () => {
        navToggle.classList.toggle("active");
        navMenu.classList.toggle("open");
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navToggle.classList.remove("active");
            navMenu.classList.remove("open");
        });
    });

    /* ---------------------------------------------------------
     4. SCROLL REVEAL (Intersection Observer)
  --------------------------------------------------------- */
    const revealElements = document.querySelectorAll(".reveal");
    const projectCards = document.querySelectorAll(".project-card");
    const timelineItems = document.querySelectorAll(".timeline-item");

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // Project cards — staggered reveal
    const cardObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    const allCards = document.querySelectorAll(
                        ".project-card:not(.hidden)",
                    );
                    const idx = Array.from(allCards).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add("active");
                    }, idx * 100);
                    cardObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 },
    );

    projectCards.forEach((card) => cardObserver.observe(card));

    // Timeline items — staggered reveal
    const timelineObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    timelineObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 },
    );

    timelineItems.forEach((item) => timelineObserver.observe(item));

    /* ---------------------------------------------------------
     5. COUNTER ANIMATION (About stats)
  --------------------------------------------------------- */
    const statNumbers = document.querySelectorAll(".stat-number");

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    animateCounter(entry.target, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 },
    );

    statNumbers.forEach((el) => counterObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(step);
    }

    /* ---------------------------------------------------------
     6. PROJECT FILTER
  --------------------------------------------------------- */
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            // Update active state
            filterButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.dataset.filter;
            projectCards.forEach((card) => {
                if (filter === "all" || card.dataset.category === filter) {
                    card.classList.remove("hidden");
                    // Re-trigger animation
                    card.classList.remove("active");
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            card.classList.add("active");
                        });
                    });
                } else {
                    card.classList.add("hidden");
                }
            });
        });
    });

    /* ---------------------------------------------------------
     7. 3D TILT EFFECT (Project cards)
  --------------------------------------------------------- */
    const tiltCards = document.querySelectorAll(".tilt-card");

    tiltCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform =
                "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
        });
    });

    /* ---------------------------------------------------------
     8. MAGNETIC EFFECT (Buttons and links)
  --------------------------------------------------------- */
    const magneticElements = document.querySelectorAll(".magnetic");

    magneticElements.forEach((el) => {
        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        el.addEventListener("mouseleave", () => {
            el.style.transform = "translate(0, 0)";
        });
    });

    /* ---------------------------------------------------------
     9. CURSOR GLOW (follows mouse)
  --------------------------------------------------------- */
    const cursorGlow = document.getElementById("cursor-glow");

    if (window.matchMedia("(hover: hover)").matches) {
        document.addEventListener("mousemove", (e) => {
            cursorGlow.style.left = e.clientX + "px";
            cursorGlow.style.top = e.clientY + "px";
        });
    }

    /* ---------------------------------------------------------
     10. SMOOTH SCROLL (for anchor links)
  --------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute("href"));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: "smooth" });
            }
        });
    });

    /* ---------------------------------------------------------
     11. ACTIVE NAV LINK (Highlight on scroll)
  --------------------------------------------------------- */
    const sections = document.querySelectorAll(".section");

    const navObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach((link) => {
                        link.classList.remove("active");
                        if (link.getAttribute("href") === `#${id}`) {
                            link.style.color = "var(--accent-cyan)";
                        } else {
                            link.style.color = "";
                        }
                    });
                }
            });
        },
        { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" },
    );

    sections.forEach((section) => navObserver.observe(section));
})();
