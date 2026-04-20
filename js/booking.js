/* =========================================================
   booking.js
   Gestion du formulaire de réservation
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bookingForm");
    if (!form) return;

    // Empêche la sélection d'une date passée
    const dateInput = document.getElementById("date");
    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.setAttribute("min", today);
    }

    // Pré-remplit le service si présent en URL (?service=Coiffure)
    const params = new URLSearchParams(window.location.search);
    const preService = params.get("service");
    if (preService) {
        const select = document.getElementById("service");
        if (select) {
            [...select.options].forEach(opt => {
                if (opt.value.toLowerCase() === preService.toLowerCase()) {
                    opt.selected = true;
                }
            });
        }
    }

    form.addEventListener("submit", handleSubmit);
});

/**
 * Traite la soumission du formulaire de réservation.
 * @param {SubmitEvent} e
 */
function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const service = form.service.value;
    const date = form.date.value;
    const time = form.time.value;

    if (!name || !phone || !service || !date || !time) {
        showToast("Veuillez remplir tous les champs.", "error");
        return;
    }

    if (!/^[0-9+\s().-]{6,}$/.test(phone)) {
        showToast("Numéro de téléphone invalide.", "error");
        return;
    }

    const booking = {
        name,
        phone,
        service,
        date,
        time,
        status: "En attente"
    };

    saveBooking(booking);
    showToast("Réservation enregistrée avec succès !", "success");
    form.reset();
}
