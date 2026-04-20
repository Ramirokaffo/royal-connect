/* =========================================================
   storage.js
   Couche d'accès aux données – simulation via LocalStorage
   Clé utilisée : "bookings"
   ========================================================= */

const STORAGE_KEY = "bookings";

/**
 * Récupère la liste des réservations depuis le LocalStorage.
 * @returns {Array<Object>}
 */
function getBookings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error("Erreur de lecture du LocalStorage :", e);
        return [];
    }
}

/**
 * Enregistre une nouvelle réservation.
 * @param {Object} booking
 */
function saveBooking(booking) {
    const bookings = getBookings();
    booking.id = Date.now();
    booking.createdAt = new Date().toISOString();
    bookings.push(booking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

/**
 * Supprime une réservation par son index.
 * @param {number} index
 */
function deleteBooking(index) {
    const bookings = getBookings();
    if (index < 0 || index >= bookings.length) return;
    bookings.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

/**
 * Met à jour une réservation existante.
 * @param {number} index
 * @param {Object} updatedData
 */
function updateBooking(index, updatedData) {
    const bookings = getBookings();
    if (index < 0 || index >= bookings.length) return;
    bookings[index] = { ...bookings[index], ...updatedData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

/**
 * Vide totalement les réservations (utilitaire).
 */
function clearBookings() {
    localStorage.removeItem(STORAGE_KEY);
}
