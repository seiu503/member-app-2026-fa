// main_cape.js

import { translations, 
	LANGUAGE_CONFIG, 
	supportedLangs 
	} from "./translations_cape.js";
import { employerTypeTranslations, 
	employerNameTranslations
	} from "../src/translations.js";
import { initEmployerType } from "../src/employerType.js";
import { initPrefill } from "./prefill_cape.js";
import { initValidation } from "./validation_cape.js";
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

	// save language to hidden field to pass to next form if needed

	setFieldValue("tfa_1336", getLang);

	// extract cId from passed query params

  const cId = getParam("cId", window.location.href);

  function setFieldValue(id, value) {
	  if (!value) return;

	  const field = document.getElementById(id);
	  if (!field) return;

	  field.value = value;
	}

	// write cId to hidden CID field

  setFieldValue("tfa_326", cId);

  // check if OMA is from passed query params

  // https://seiu503.tfaforms.net/822?OMA=%%SFA_ONLINEMEMBERAPP__C%%

  const OMAId = getParam("OMA", window.location.href);
  const aId = getParam("aId", window.location.href);

	// write OMA Id to hidden OMA field

  setFieldValue("tfa_390", OMAId);

  if (OMAId) {
  	// this is a continuation from p1 of the OMA. display 'skip' button, hide standalone fields

  	// Find the target element
    const actions = document.querySelector(".actions");
    if (!actions) return; // exit if actions wrapper not found

    // Create skip button
    const skip = document.createElement("input");
    skip.className = "skip";
    skip.id = "skip_button";
    skip.value = "Skip";
    skip['data-original-value'] = "Skip";
    skip.type = "button";

    // Insert skip button after submit
    actions.parentNode.insertBefore(skip, actions.nextSibling);

    // Add event listener to button to redirect to p2
    skip.addEventListener('click', () => {
	    window.location.href = `https://seiu503.tfaforms.net/821?cId=${cId}&aId=${aId}`;
	  });

    // hide anything prefilled (DOB, address, phone, email, employer)

  } else {
  	// this is a blank slate form. hide 'skip' button, display standalone fields
  	const skip = document.getElementById('skip_button');
  	if (skip) skip.style.display = "none";

  	// display standalone fields here (DOB, address, phone, email, employer):

  	
  }

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

    var employerTypeInput = document.getElementById('tfa_1302');

  initDateHelpers({
		mm_tfa: "tfa_1651",
		dd_tfa: "tfa_1664",
		yy_tfa: "tfa_1696",
		dob_tfa: "tfa_1815",
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

	const employerNameElements = {
	  eNameState: document.getElementById("tfa_1308"),
	  eNameHiEd: document.getElementById("tfa_1304"),
	  eNameHCW: document.getElementById("tfa_1309"),
	  eNameNH: document.getElementById("tfa_1306"),
	  eNameLGov: document.getElementById("tfa_1305"),
	  eNamePNP: document.getElementById("tfa_1307"),
	  eNamePHC: document.getElementById("tfa_1310"),
	  eNameRetire: document.getElementById("tfa_1311")
	};

	const hiddenRequired = Object.values(employerNameElements);

	initEmployerType({
	  formEl,
	  getLang,
	  getCurrentLang: () => getLang,
	  employerTypeInput,
	  employerTypeTranslations,
	  employerNameTranslations,
	  translations
	});

	initValidation({
	  formEl,
	  getLang,
	  translations
	});

	initPrefill({
	  getLang,
	  detectedSupportedLang,
	  employerTypeInput,
	  hiddenRequired,
	  LANGUAGE_CONFIG
	});


  // set AID and Agency number on Employer change
  const employerNameFieldIDs = ['tfa_1304', 'tfa_1305', 'tfa_1306', 'tfa_1307', 'tfa_1308', 'tfa_1309', 'tfa_1310', 'tfa_1311'];
  const aIdFieldIDs = ['tfa_1317', 'tfa_1319', 'tfa_1321', 'tfa_1323', 'tfa_1325', 'tfa_1327', 'tfa_1329', 'tfa_1331'];
  const agencyNumberFieldIDs = ['tfa_1318', 'tfa_1320', 'tfa_1322', 'tfa_1324', 'tfa_1326', 'tfa_1328', 'tfa_1330', 'tfa_1332'];

  const employerNameFields = employerNameFieldIDs.map(id => document.getElementById(id));
  const aIdFields = aIdFieldIDs.map(id => document.getElementById(id));
  const agencyNumberFields = agencyNumberFieldIDs.map(id => document.getElementById(id));

  const aIdPrefillCalc = document.getElementById('tfa_1316');
  const agencyNumberPrefillCalc = document.getElementById('tfa_1315');

  const isEmployerPrefilled =
	  document.getElementById("tfa_1303")?.value?.trim() !== "" ||
	  new URLSearchParams(window.location.search).has("aId");

	console.log(`isEmployerPrefilled: ${isEmployerPrefilled}`);
	console.log(`Agency Number: ${agencyNumberPrefillCalc.value}`);

  function clearAllEmployerAccountFields() {
	  [...aIdFields, ...agencyNumberFields].forEach(field => {
	    if (!field) return;

	    field.value = "";
	    field.dispatchEvent(new Event("input", { bubbles: true }));
	    field.dispatchEvent(new Event("change", { bubbles: true }));
	  });

	  if (aIdPrefillCalc) {
	    aIdPrefillCalc.value = "";
	    aIdPrefillCalc.dispatchEvent(new Event("input", { bubbles: true }));
	    aIdPrefillCalc.dispatchEvent(new Event("change", { bubbles: true }));
	  }

	  if (agencyNumberPrefillCalc) {
	    agencyNumberPrefillCalc.value = "";
	    agencyNumberPrefillCalc.dispatchEvent(new Event("input", { bubbles: true }));
	    agencyNumberPrefillCalc.dispatchEvent(new Event("change", { bubbles: true }));
	  }
	}

	function getFirstPopulatedValue(fields) {
	  const populated = fields.find(field => {
	    return field && field.value && field.value.trim() !== "";
	  });

	  return populated ? populated.value.trim() : "";
	}

	function updateEmployerAccountCalcFields() {
		if (isEmployerPrefilled) return;
	  if (aIdPrefillCalc) {
	    aIdPrefillCalc.value = getFirstPopulatedValue(aIdFields);
	    aIdPrefillCalc.dispatchEvent(new Event("input", { bubbles: true }));
	    aIdPrefillCalc.dispatchEvent(new Event("change", { bubbles: true }));
	  }

	  if (agencyNumberPrefillCalc) {
	    agencyNumberPrefillCalc.value = getFirstPopulatedValue(agencyNumberFields);
	    agencyNumberPrefillCalc.dispatchEvent(new Event("input", { bubbles: true }));
	    agencyNumberPrefillCalc.dispatchEvent(new Event("change", { bubbles: true }));
	  }
	}

	function initEmployerAccountFieldSync() {
	  employerNameFields.forEach(field => {
	    field.addEventListener("input", function () {
			  if (isEmployerPrefilled) return;
			  clearAllEmployerAccountFields();
			});

	    field.addEventListener("change", function () {
	    	if (isEmployerPrefilled) return;
	      // Give FormAssembly time to write mapped Salesforce values.
	      setTimeout(updateEmployerAccountCalcFields, 100);
	      setTimeout(updateEmployerAccountCalcFields, 300);
	    });

	    field.addEventListener("typeahead:select", function () {
	    	if (isEmployerPrefilled) return;
	      setTimeout(updateEmployerAccountCalcFields, 100);
	      setTimeout(updateEmployerAccountCalcFields, 300);
	    });
	  });

	  if (formEl) {
		  formEl.addEventListener(
		    "submit",
		    function () {
		      if (isEmployerPrefilled) return;
		      updateEmployerAccountCalcFields();
		    },
		    true
		  );
		}
	}

	

	if (!isEmployerPrefilled) {
	  initEmployerAccountFieldSync();
	}

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
	}

	function updateDatePlaceholders() {
	  const mmSelect = document.getElementById("tfa_1651");
	  const ddSelect = document.getElementById("tfa_1664");
	  const yyyySelect = document.getElementById("tfa_1696");

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

	// set legal language (this block should run AFTER translation blocks)

	const signature = document.getElementById("tfa_386");
	const capeLegalLanguage = document.getElementById("tfa_383").value;
	const combinedLL = document.getElementById("tfa_1314");

	signature.addEventListener('blur', function() {
		combinedLL.value = capeLegalLanguage;
	});
  
});