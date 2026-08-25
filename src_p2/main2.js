// main2.js

import { translations, 
	LANGUAGE_CONFIG, 
	OTHER_LANGUAGE_LABELS, 
	supportedLangs 
	} from "./translations2.js";
import { initValidation } from "./validation2.js";
import { initDateHelpers } from "../src/dateHelpers.js";

function normalizeTranslationMap(map) {
  return Object.fromEntries(
    Object.entries(map).map(([key, value]) => [key.toLowerCase(), value])
  );
}

const translationsNorm = normalizeTranslationMap(translations);

function getTranslation(map, key, lang, fallbackText = "") {
  if (!map || !key) return fallbackText;

  const entry = map[key.toLowerCase()];
  if (!entry) return fallbackText;

  const value = entry?.[lang];
  if (typeof value === "string" && value.trim()) return value;

  const english = entry?.en;
  if (typeof english === "string" && english.trim()) return english;

  return fallbackText;
}

window.addEventListener("load", function() {

	const formEl = document.querySelector("form");

	// parse query params from url

	function getParam(name, url) {
	  name = name.replace(/[[\]]/g, "\\$&");
	  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
	  const results = regex.exec(url);
	  if (!results) return null;
	  if (!results[2]) return "";
	  return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	// check if language is set in a passed query param

	const lCode = getParam("lang", window.location.href);

	// If not, extract the value of the language the browser is set to:

	let getLang = (lCode || navigator.language || "en").split("-")[0];

	console.log("getLang =", getLang);

	document.documentElement.lang = getLang;
	document.querySelector('.wForm')?.setAttribute('data-language', getLang);

	// extract cId from passed query params

  const cId = getParam("cId", window.location.href);

  function setFieldValue(id, value) {
	  if (!value) return;

	  const field = document.getElementById(id);
	  if (!field) return;

	  field.value = value;
	}

	// write cId to hidden CID field

  setFieldValue("tfa_445", cId);

	// ADD LANGUAGE PICKER TO DOM

		const detectedSupportedLang = supportedLangs.includes(getLang);

    // Find the target element
    const header = document.querySelector(".wFormHeader");
    if (!header) return; // exit if header not found

    // Create wrapper
    const pickerWrap = document.createElement("div");
    pickerWrap.className = "pickerWrap";

    // Create select element
    const select = document.createElement("select");
    select.id = "languagePicker";
    select.className = "languagePicker";

    // Create globe icon
    const globeSVG = document.createElement("span");
		globeSVG.innerHTML = `
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#f1eee9" stroke-width="2" viewBox="0 0 24 24">
		  <circle cx="12" cy="12" r="10"/>
		  <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>
		</svg>`;
		globeSVG.className = "globeSVG";
		

    // Append icon and select to wrapper
    pickerWrap.appendChild(globeSVG);
    pickerWrap.appendChild(select);

    // Add options
    Object.entries(LANGUAGE_CONFIG).forEach(([code, cfg]) => {
		  if (!cfg.pickerLabel) return;

		  const option = document.createElement("option");
		  option.value = code;
		  option.textContent = cfg.pickerLabel;
		  select.appendChild(option);
		});

    // Set current selection
    if (getLang) {
      select.value = getLang;
    }

    // Handle selection change
    select.addEventListener("change", function () {
		  switchLanguage(select.value);
		});

    // Insert picker after header
    header.parentNode.insertBefore(pickerWrap, header.nextSibling);


	initDateHelpers({
		mm_tfa: "tfa_156",
		dd_tfa: "tfa_157",
		yy_tfa: "tfa_158",
		dob_tfa: "tfa_113",
	  monthPlaceholder: getTranslation(
	    translationsNorm,
	    "mmPlaceholder",
	    getLang,
	    "Month"
	  ),
	  dayPlaceholder: getTranslation(
	    translationsNorm,
	    "ddPlaceholder",
	    getLang,
	    "Day"
	  ),
	  yearPlaceholder: getTranslation(
	    translationsNorm,
	    "yyyyPlaceholder",
	    getLang,
	    "Year"
	  )
	});

	applyTranslations();

	initValidation({
	  formEl,
	  getLang,
	  translations
	});

  function getOriginalText(el) {
	  if (!el) return "";
	  if (!el.dataset.originalText) {
	    el.dataset.originalText = el.textContent || "";
	  }
	  return el.dataset.originalText;
	}

	function getOriginalHTML(el) {
	  if (!el) return "";
	  if (!el.dataset.originalHtml) {
	    el.dataset.originalHtml = el.innerHTML || "";
	  }
	  return el.dataset.originalHtml;
	}

	function setText(el, key) {
	  if (!el) return;

	  const fallback = getOriginalText(el);
	  const translated = getTranslation(translationsNorm, key, getLang, fallback);

	  el.textContent = translated;
	}

	function setHTML(el, key) {
	  if (!el) return;

	  const fallback = getOriginalHTML(el);
	  const translated = getTranslation(translationsNorm, key, getLang, fallback);

	  el.innerHTML = translated;
	}

	function applyTranslations() {
	  document.title = getTranslation(translationsNorm, "formTitle", getLang, document.title);

	  Object.entries(translations).forEach(([key, entry]) => {
	    const selectors = [];

			if (entry.selector) selectors.push(entry.selector);

			if (entry.id) {
			  selectors.push(`#${CSS.escape(entry.id)}`);
			}

			if (entry.ids?.length) {
			  entry.ids.forEach(id => {
			    selectors.push(`#${CSS.escape(id)}`);
			  });
			}

			selectors.forEach(selector => {
			  const el = document.querySelector(selector);
			  if (!el) return;

		    const translated = getTranslation(translationsNorm, key, getLang, "");

		    if (entry.mode === "html") {
		      if (!el.dataset.originalHtml) el.dataset.originalHtml = el.innerHTML || "";
		      el.innerHTML = translated || el.dataset.originalHtml;
		      return;
		    }

		    if (entry.mode === "value") {
		      if (!el.dataset.originalValue) el.dataset.originalValue = el.value || "";
		      el.value = translated || el.dataset.originalValue;
		      return;
		    }

		    if (entry.mode === "firstOption") {
				  const option = el.options?.[0] || el.querySelector?.("option:first-child");
				  if (!option) return;

				  if (!option.dataset.originalText) {
				    option.dataset.originalText = option.textContent || "";
				  }

				  option.textContent = translated || option.dataset.originalText;
				  return;
				}

		    if (!el.dataset.originalText) el.dataset.originalText = el.textContent || "";
		    el.textContent = translated || el.dataset.originalText;
		  });

		});

	  const stagingWarning = document.getElementById("tfa_387-HTML");
	  if (stagingWarning) {
	    stagingWarning.innerHTML = `
	      <div style="background-color: rgb(255, 152, 0); padding: 20px;">
	        <div>
	          <p style="display: inline;" id="testWarning" data-testid="testWarning">
	            ${getTranslation(translationsNorm, "stagingWarning", getLang, "This form is for testing only.")}&nbsp;
	          </p>
	          <strong>
	            <a href="https://seiu503signup.org" style="font-weight: bold; font-size: 1.2em;">
	              seiu503signup.org
	            </a>
	          </strong>
	        </div>
	      </div>
	    `;
	  }
	}

	function updateDatePlaceholders() {
	  const mmSelect = document.getElementById("tfa_156");
	  const ddSelect = document.getElementById("tfa_157");
	  const yyyySelect = document.getElementById("tfa_158");

	  if (mmSelect?.options?.[0]) {
	    mmSelect.options[0].textContent = getTranslation(
	      translationsNorm,
	      "mmPlaceholder",
	      getLang,
	      "Month"
	    );
	  }

	  if (ddSelect?.options?.[0]) {
	    ddSelect.options[0].textContent = getTranslation(
	      translationsNorm,
	      "ddPlaceholder",
	      getLang,
	      "Day"
	    );
	  }

	  if (yyyySelect?.options?.[0]) {
	    yyyySelect.options[0].textContent = getTranslation(
	      translationsNorm,
	      "yyyyPlaceholder",
	      getLang,
	      "Year"
	    );
	  }
	}

	function switchLanguage(newLang, options = {}) {
	  if (!supportedLangs.includes(newLang)) return;

	  getLang = newLang;

	  document.documentElement.lang = getLang;
	  document.querySelector(".wForm")?.setAttribute("data-language", getLang);

	  if (select) select.value = getLang;

	  applyTranslations();
	  updateDatePlaceholders();

	  document.dispatchEvent(
	    new CustomEvent("languagechange", {
	      detail: { lang: getLang }
	    })
	  );
	}
  
});