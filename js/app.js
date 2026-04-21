/* =========================================================
   app.js
   Logique UI commune à toutes les pages
   - Menu mobile
   - Mise en évidence du lien actif
   - Notifications toast
   - Année dynamique dans le footer
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    highlightActiveLink();
    updateFooterYear();
    setupHeroCarousel();
});

/* ---------- Carrousel du hero (page d'accueil) ---------- */
function setupHeroCarousel() {
    const slides = document.querySelectorAll("#heroCarousel .hero-slide");
    const dots = document.querySelectorAll("#heroCarousel .hero-dot");
    if (slides.length < 2) return;

    let idx = 0;
    let timer = null;
    const DELAY = 5000;

    const goTo = (i) => {
        slides[idx].classList.remove("active");
        dots[idx]?.classList.remove("active");
        idx = (i + slides.length) % slides.length;
        slides[idx].classList.add("active");
        dots[idx]?.classList.add("active");
    };

    const start = () => { timer = setInterval(() => goTo(idx + 1), DELAY); };
    const stop = () => { if (timer) clearInterval(timer); };

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            stop();
            goTo(i);
            start();
        });
    });

    start();
}

/* ---------- Menu mobile (burger) ---------- */
function setupMobileMenu() {
    const burger = document.querySelector(".burger");
    const navLinks = document.querySelector(".nav-links");
    if (!burger || !navLinks) return;

    burger.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        burger.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach(a =>
        a.addEventListener("click", () => {
            navLinks.classList.remove("open");
            burger.classList.remove("active");
        })
    );
}

/* ---------- Lien actif dans la navbar ---------- */
function highlightActiveLink() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(link => {
        const href = link.getAttribute("href");
        if (href === path) link.classList.add("active");
    });
}

/* ---------- Footer year ---------- */
function updateFooterYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Toast notification ---------- */
/**
 * Affiche une notification temporaire.
 * @param {string} message
 * @param {"success"|"error"|"info"} type
 */
function showToast(message, type = "success") {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
        <span class="toast-msg">${message}</span>
    `;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
        toast.classList.remove("show");
        toast.addEventListener("transitionend", () => toast.remove(), { once: true });
    }, 3500);
}


/* ---------- Authentification admin (démo front-end) ---------- */
const ADMIN_CREDENTIALS = { username: "admin", password: "royal2025" };
const AUTH_KEY = "rb_admin_auth";

function isAdminAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === "1";
}

function adminLogin(username, password) {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem(AUTH_KEY, "1");
        return true;
    }
    return false;
}

function adminLogout() {
    sessionStorage.removeItem(AUTH_KEY);
}

/* ---------- Modal de confirmation ---------- */
/**
 * Affiche une boîte de dialogue de confirmation stylée.
 * @param {Object} opts
 * @param {string} [opts.title="Confirmation"]
 * @param {string} opts.message
 * @param {string} [opts.confirmText="Confirmer"]
 * @param {string} [opts.cancelText="Annuler"]
 * @param {boolean} [opts.danger=false]
 * @returns {Promise<boolean>}
 */
function showConfirm({
    title = "Confirmation",
    message = "",
    confirmText = "Confirmer",
    cancelText = "Annuler",
    danger = false
} = {}) {
    return new Promise(resolve => {
        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop";
        backdrop.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
                <div class="modal-icon ${danger ? "danger" : ""}">${danger ? "⚠" : "?"}</div>
                <h3 id="modalTitle" class="modal-title">${title}</h3>
                <p class="modal-message">${message}</p>
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline modal-cancel">${cancelText}</button>
                    <button type="button" class="btn ${danger ? "btn-danger" : "btn-primary"} modal-confirm">${confirmText}</button>
                </div>
            </div>
        `;
        document.body.appendChild(backdrop);

        // Focus sur le bouton confirmation
        const confirmBtn = backdrop.querySelector(".modal-confirm");
        const cancelBtn = backdrop.querySelector(".modal-cancel");
        requestAnimationFrame(() => {
            backdrop.classList.add("show");
            confirmBtn.focus();
        });

        const close = (result) => {
            backdrop.classList.remove("show");
            backdrop.addEventListener("transitionend", () => backdrop.remove(), { once: true });
            document.removeEventListener("keydown", onKey);
            resolve(result);
        };

        const onKey = (e) => {
            if (e.key === "Escape") close(false);
            if (e.key === "Enter") close(true);
        };

        confirmBtn.addEventListener("click", () => close(true));
        cancelBtn.addEventListener("click", () => close(false));
        backdrop.addEventListener("click", (e) => {
            if (e.target === backdrop) close(false);
        });
        document.addEventListener("keydown", onKey);
    });
}
