/**
 * ============================================================
 * Stitch Global - Application Portal
 * Backend Google Apps Script (Google Sheets)
 * ============================================================
 *
 * Ce script reçoit les candidatures envoyées depuis candidature.html
 * (POST en JSON) et les enregistre dans une feuille de calcul Google Sheets.
 *
 * ------------------------------------------------------------
 * CONFIGURATION (à faire une seule fois) :
 * ------------------------------------------------------------
 * 1. Créez une feuille de calcul Google Sheets.
 * 2. Dans le menu "Extensions" > "Apps Script", collez tout ce fichier.
 * 3. Sauvegardez et Déployez > Nouveau déploiement > Web app.
 *    - Exécuter en tant que : Moi
 *    - Accès : Tout le monde (ou "Toute personne disposant du lien")
 * 4. Copiez l'URL du Web App et collez-la dans assets/js/config.js
 *    (variable APPS_SCRIPT_URL).
 *
 * La première ligne de la feuille sert d'en-tête (colonnes) et est
 * créée automatiquement au premier envoi.
 * ============================================================
 */

// Nom du fichier/onglet où les données seront écrites.
const SHEET_NAME = "Candidatures";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet();
    ensureHeaders(sheet, data);
    writeRow(sheet, data);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", reference: data.reference || "" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Accessible via GET pour vérifier que le script fonctionne.
function doGet(e) {
  if (e && e.parameter && e.parameter.action === "universities") {
    const country = e.parameter.country || "";
    if (!country) {
      return jsonResponse({ result: "error", message: "Pays manquant." });
    }

    const response = UrlFetchApp.fetch(
      "http://universities.hipolabs.com/search?country=" + encodeURIComponent(country),
      { muteHttpExceptions: true }
    );
    if (response.getResponseCode() !== 200) {
      return jsonResponse({ result: "error", message: "Universités indisponibles." });
    }
    return ContentService
      .createTextOutput(response.getContentText())
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ result: "ok", message: "Stitch Global API active." }))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

// Construit / complète l'en-tête de colonnes à partir des clés de la candidature.
function ensureHeaders(sheet, data) {
  const firstRow = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];
  const headers = firstRow.filter(String); // colonnes existantes

  // Champs simples (hors tableaux)
  Object.keys(data).forEach(function (key) {
    if (Array.isArray(data[key])) return;
    if (headers.indexOf(key) === -1) headers.push(key);
  });

  // Compétences : liste concaténée
  if (Array.isArray(data.competences)) {
    if (headers.indexOf("competences") === -1) headers.push("competences");
  }

  if (headers.length > 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
  }
}

function writeRow(sheet, data) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const competencesStr = (data.competences || []).join(", ");

  const row = headers.map(function (key) {
    let value = data[key];
    if (key === "competences") value = competencesStr;
    return value !== undefined ? String(value) : "";
  });

  sheet.appendRow(row);
}
