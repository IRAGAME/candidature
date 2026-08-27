/**
 * Configuration de l'application.
 *
 * APPS_SCRIPT_URL : URL de la Web App Google Apps Script qui reçoit les
 * candidatures en POST (JSON) et les écrit dans Google Sheets.
 *
 * Après avoir déployé le script (voir backend/Code.gs),
 * collez ici l'URL en https://script.google.com/macros/s/...
 */
const APP_CONFIG = {
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycby4Isc6R7SPUkEdfj105hyYMVDA4tBMShvP15gITRZHvwEaG4Q_P10kmjmWyj5fXqaL/exec",
  SITE_NAME: "IraGame",
  TAGLINE: "Candidatures simplifiées"
};
