(function () {
  "use strict";

  var SUPPORTED_LANGS = [
    "en", "vi", "es", "pt", "fr", "de", "it", "ja", "ko", "zh",
    "th", "id", "ms", "ar", "hi", "tr", "ru", "pl", "nl", "tl",
    "cs", "nb", "da", "el", "fi", "ro", "he", "sv", "hu",
  ];

  var RTL_LANGS = ["ar", "he"];

  var COUNTRY_TO_LANG = {
    VN: "vi", US: "en", GB: "en", CA: "en", AU: "en", NZ: "en",
    MX: "es", ES: "es", AR: "es", CL: "es", CO: "es", PE: "es", VE: "es",
    BR: "pt", PT: "pt",
    FR: "fr",
    DE: "de", AT: "de", CH: "de",
    IT: "it",
    JP: "ja",
    KR: "ko",
    CN: "zh", HK: "zh", TW: "zh",
    TH: "th",
    ID: "id",
    MY: "ms",
    SA: "ar", AE: "ar", EG: "ar",
    IN: "hi",
    TR: "tr",
    RU: "ru", UA: "ru",
    PL: "pl",
    NL: "nl", BE: "nl",
    PH: "tl",
    CZ: "cs",
    NO: "nb",
    DK: "da",
    GR: "el",
    FI: "fi",
    RO: "ro",
    IL: "he",
    SE: "sv",
    HU: "hu",
    PK: "hi", BD: "hi",
  };

  var currentLang = "en";
  var translations = {};

  function isSupported(lang) {
    return SUPPORTED_LANGS.includes(lang);
  }

  function saveLang(lang) {
    try {
      sessionStorage.setItem("user_lang", lang);
    } catch (e) {}
  }

  function getSavedLang() {
    try {
      var lang = sessionStorage.getItem("user_lang");
      if (lang && isSupported(lang)) return lang;
    } catch (e) {}
    return null;
  }

  function getBrowserLang() {
    var nav = navigator.language || "";
    var parts = nav.split("-");
    var primary = (parts[0] || "").toLowerCase();
    if (isSupported(primary)) return primary;
    if (parts[1]) {
      var combined = primary + "-" + parts[1].toUpperCase();
      for (var i = 0; i < SUPPORTED_LANGS.length; i++) {
        var supported = SUPPORTED_LANGS[i];
        if (supported.startsWith(primary) && isSupported(supported)) return supported;
      }
    }
    return null;
  }

  function applyTranslations(dict) {
    var htmlElements = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < htmlElements.length; i++) {
      var el = htmlElements[i];
      var key = el.getAttribute("data-i18n");
      var text = dict[key];
      if (text !== undefined) {
        // Replace {count} placeholders
        if (el.hasAttribute("data-i18n-count")) {
          var count = el.getAttribute("data-i18n-count");
          text = text.replace("{count}", count);
        }
        el.textContent = text;
      }
    }

    var placeholderElements = document.querySelectorAll("[data-i18n-placeholder]");
    for (var j = 0; j < placeholderElements.length; j++) {
      var el2 = placeholderElements[j];
      var key2 = el2.getAttribute("data-i18n-placeholder");
      var text2 = dict[key2];
      if (text2 !== undefined) el2.placeholder = text2;
    }

    var titleElements = document.querySelectorAll("[data-i18n-title]");
    for (var k = 0; k < titleElements.length; k++) {
      var el3 = titleElements[k];
      var key3 = el3.getAttribute("data-i18n-title");
      var text3 = dict[key3];
      if (text3 !== undefined) el3.title = text3;
    }
  }

  // Expose translation function for dynamic use
  window.__i18n_t = function(key) {
    return translations[key] || null;
  };

  window.__i18n_tReplace = function(key, replacements) {
    var text = translations[key] || key;
    for (var r in replacements) {
      text = text.replace("{" + r + "}", replacements[r]);
    }
    return text;
  };

  function setRTL(isRTL) {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = currentLang;
  }

  function applyLanguage(lang) {
    currentLang = lang;
    saveLang(lang);
    applyTranslations(translations);
    setRTL(RTL_LANGS.includes(lang));
  }

  function loadLanguageJson(lang, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/lang/" + lang + ".json", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            translations = JSON.parse(xhr.responseText);
          } catch (e) {
            translations = {};
          }
        } else {
          translations = {};
        }
        callback();
      }
    };
    xhr.onerror = function () {
      translations = {};
      callback();
    };
    xhr.send();
  }

  function init() {
    // Ưu tiên 1: Ngôn ngữ đã lưu
    var savedLang = getSavedLang();
    if (savedLang) {
      loadLanguageJson(savedLang, function () {
        applyLanguage(savedLang);
      });
      return;
    }

    // Ưu tiên 2: Browser language (nhanh, không cần API call)
    var browserLang = getBrowserLang();
    if (browserLang) {
      loadLanguageJson(browserLang, function () {
        applyLanguage(browserLang);
      });
      return;
    }

    // Ưu tiên 3: API detect location
    if (typeof fetch !== "undefined") {
      fetch("/api/detect-location")
        .then(function (res) { return res.json(); })
        .then(function (data) {
          var countryCode = data.countryCode || "";
          var detectedLang = COUNTRY_TO_LANG[countryCode] || null;
          if (!detectedLang || !isSupported(detectedLang)) {
            detectedLang = browserLang || "en";
          }
          loadLanguageJson(detectedLang, function () {
            applyLanguage(detectedLang);
          });
        })
        .catch(function () {
          var fallback = browserLang || "en";
          loadLanguageJson(fallback, function () {
            applyLanguage(fallback);
          });
        });
    } else {
      var fallback2 = browserLang || "en";
      loadLanguageJson(fallback2, function () {
        applyLanguage(fallback2);
      });
    }
  }

  function changeLanguage(lang) {
    if (!isSupported(lang)) return;
    loadLanguageJson(lang, function () {
      applyLanguage(lang);
    });
  }

  function getCurrentLang() {
    return currentLang;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.__i18n = {
    changeLanguage: changeLanguage,
    getCurrentLang: getCurrentLang,
    getSupportedLangs: function () { return SUPPORTED_LANGS.slice(); },
  };
})();
