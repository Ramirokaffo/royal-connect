/* =========================================================
   admin.js
   Tableau de bord d'administration – gestion des réservations
   ========================================================= */

let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("bookingsTable")) return;

    setupFilters();
    renderBookings();

    const clearBtn = document.getElementById("clearAllBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", async () => {
            const ok = await showConfirm({
                title: "Tout supprimer ?",
                message: "Cette action effacera <strong>toutes</strong> les réservations de manière définitive.",
                confirmText: "Tout supprimer",
                danger: true
            });
            if (!ok) return;
            clearBookings();
            renderBookings();
            showToast("Toutes les réservations ont été supprimées.", "info");
        });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            const ok = await showConfirm({
                title: "Se déconnecter ?",
                message: "Vous allez quitter l'espace administrateur.",
                confirmText: "Déconnexion"
            });
            if (!ok) return;
            adminLogout();
            window.location.href = "login.html";
        });
    }
});

/* ---------- Filtres ---------- */
function setupFilters() {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            renderBookings();
        });
    });
}

/* ---------- Rendu ---------- */
function renderBookings() {
    const tbody = document.querySelector("#bookingsTable tbody");
    const empty = document.getElementById("emptyState");
    const stats = document.getElementById("statsBar");
    if (!tbody) return;

    const all = getBookings();
    const filtered = all.filter(b => {
        if (currentFilter === "pending") return b.status === "En attente";
        if (currentFilter === "validated") return b.status === "Validé";
        return true;
    });

    // Statistiques
    if (stats) {
        const pending = all.filter(b => b.status === "En attente").length;
        const validated = all.filter(b => b.status === "Validé").length;
        stats.innerHTML = `
            <div class="stat-card"><span class="stat-num">${all.length}</span><span class="stat-label">Total</span></div>
            <div class="stat-card pending"><span class="stat-num">${pending}</span><span class="stat-label">En attente</span></div>
            <div class="stat-card validated"><span class="stat-num">${validated}</span><span class="stat-label">Validées</span></div>
        `;
    }

    tbody.innerHTML = "";

    if (filtered.length === 0) {
        if (empty) empty.style.display = "block";
        return;
    }
    if (empty) empty.style.display = "none";

    filtered.forEach(booking => {
        const originalIndex = all.indexOf(booking);
        const tr = document.createElement("tr");
        const statusClass = booking.status === "Validé" ? "status-validated" : "status-pending";

        tr.innerHTML = `
            <td data-label="Nom"><strong>${escapeHtml(booking.name)}</strong></td>
            <td data-label="Téléphone">${escapeHtml(booking.phone)}</td>
            <td data-label="Service">${escapeHtml(booking.service)}</td>
            <td data-label="Date">${formatDate(booking.date)}</td>
            <td data-label="Heure">${escapeHtml(booking.time)}</td>
            <td data-label="Statut"><span class="status-badge ${statusClass}">${booking.status}</span></td>
            <td data-label="Actions" class="actions-cell">
                ${booking.status !== "Validé"
                    ? `<button class="btn-action btn-validate" data-idx="${originalIndex}" title="Valider">✓</button>`
                    : ""}
                <button class="btn-action btn-delete" data-idx="${originalIndex}" title="Supprimer">✕</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".btn-validate").forEach(btn =>
        btn.addEventListener("click", () => validateBooking(parseInt(btn.dataset.idx, 10)))
    );
    tbody.querySelectorAll(".btn-delete").forEach(btn =>
        btn.addEventListener("click", () => removeBooking(parseInt(btn.dataset.idx, 10)))
    );
}

/* ---------- Actions ---------- */
function validateBooking(index) {
    updateBooking(index, { status: "Validé" });
    renderBookings();
    showToast("Réservation validée.", "success");
}

async function removeBooking(index) {
    const all = getBookings();
    const b = all[index];
    const who = b ? `<strong>${escapeHtml(b.name)}</strong> — ${escapeHtml(b.service)}` : "cette réservation";
    const ok = await showConfirm({
        title: "Supprimer la réservation ?",
        message: `Voulez-vous vraiment supprimer la réservation de ${who} ?<br>Cette action est irréversible.`,
        confirmText: "Supprimer",
        danger: true
    });
    if (!ok) return;
    deleteBooking(index);
    renderBookings();
    showToast("Réservation supprimée.", "info");
}

/* ---------- Utils ---------- */
function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
