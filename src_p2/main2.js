// main.js

import { translations, 
	employerTypeTranslations, 
	employerNameTranslations, 
	LANGUAGE_CONFIG, 
	OTHER_LANGUAGE_LABELS, 
	supportedLangs 
	} from "./translations2.js";
import { initEmployerType } from "./employerType2.js";
import { initValidation } from "./validation2.js";
import { initPrefill } from "./prefill2.js";
import { initDateHelpers } from "./dateHelpers2.js";

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

	// check if tmp1 is set in a passed query param

	const tmp1 = getParam("tmp1", window.location.href);

	// If so, assign it to the hidden tmp1 field

	document.getElementById("tfa_468").value = tmp1;

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
		  switchLanguage(select.value, {
		    syncPreferredLanguageField: true
		  });
		});

    // Insert picker after header
    header.parentNode.insertBefore(pickerWrap, header.nextSibling);


	// ************ ELEMENT DEFINITIONS ************ //
	var valueFormTitle = document.getElementsByClassName("gform_title")[0];
	var valueSubmitButton = document.querySelector("#submit_button");
	var stagingWarning = document.getElementById("tfa_387-HTML");
	var prefillWarning1 = document.getElementById("tfa_330-DB"); // span inside this is 'This form is customized especially for'
	var prefillWarning2 = document.getElementById("tfa_330-DA"); // span inside this is 'If this is not you, do not complete this form!'
	var firstName = document.getElementById("tfa_1-L"); 
	var lastName = document.getElementById("tfa_2-L");
	var birthDate = document.getElementById("tfa_134-L"); 
	// var mmPlaceholder = document.getElementById("tfa_156").options[0];
	// var ddPlaceholder = document.getElementById("tfa_157").options[0];
	// var yyyyPlaceholder = document.getElementById("tfa_158").options[0];
	var preferredLanguage = document.getElementById("tfa_91-L"); 
	// var employer = document.getElementById("tfa_22-L"); 
	var employerTypeLabel = document.getElementById('tfa_388-L');
	var employerTypeInput = document.getElementById('tfa_388');
	var address = document.getElementById("tfa_32-L"); 
	var addressNote = document.getElementById("tfa_32-HH");
	var city = document.getElementById("tfa_34-L"); 
	var state = document.getElementById("tfa_35-L");
	var zip = document.getElementById("tfa_39-L"); 
	var email = document.getElementById("tfa_3-L"); 
	var emailNote = document.getElementById("tfa_3-HH");
	var phone = document.getElementById("tfa_4-L"); 
	var phoneNote = document.getElementById("tfa_4-HH");
	var smsOptOut = document.getElementById("tfa_114-L");
	var smsOptOutCheckbox = document.getElementById("tfa_115-L");
	// var membershipAuthBlock = document.getElementById("tfa_350-HTML"); 
	// var duesAuthBlock = document.getElementById("tfa_351-HTML"); 
	var polOptOut = document.getElementById("tfa_122-L"); 
	var polOptOutCheckbox = document.getElementById("tfa_123-L"); 
	var signature = document.getElementById("tfa_386-L");
	var signatureNote = document.getElementById("tfa_386-HH");
	var membershipAuthTitle = document.getElementById("tfa_116-L");
	var membershipAuthLL = document.getElementById("tfa_379-L");
	var duesAuthTitle = document.getElementById("tfa_355-L");
	var duesAuthLL = document.getElementById("tfa_380-L");
	var combinedLL = document.getElementById("tfa_377"); // jcl
	const preferredLanguageField = document.getElementById("tfa_91");

	normalizePreferredLanguagePicklist();

	function getPreferredLanguageCodeFromField(field) {
	  if (!field) return "en";

	  const selectedOption = field.options[field.selectedIndex];
	  const englishValue =
	    selectedOption?.dataset.englishValue ||
	    selectedOption?.textContent?.trim() ||
	    field.value;

	  const matchedConfig = Object.values(LANGUAGE_CONFIG).find(cfg =>
	    cfg.preferredValues.includes(englishValue)
	  );

	  return matchedConfig?.renderLang || "en";
	}

	if (preferredLanguageField) {
	  preferredLanguageField.addEventListener("change", function () {
		  const selectedOption =
		    preferredLanguageField.options[preferredLanguageField.selectedIndex];

		  const selectedEnglishValue =
		    selectedOption?.dataset.englishValue || "";

		  const newLang = getPreferredLanguageCodeFromField(preferredLanguageField);

		  if (!newLang) return;

		  switchLanguage(newLang, {
		    syncPreferredLanguageField: false
		  });

		  normalizePreferredLanguagePicklist();

		  setPreferredLanguageValue(selectedEnglishValue, {
		    fireEvents: false
		  });
		});
	}

	initDateHelpers({
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
	  eNameState: document.getElementById("tfa_410"),
	  eNameHiEd: document.getElementById("tfa_393"),
	  eNameHCW: document.getElementById("tfa_414"),
	  eNameNH: document.getElementById("tfa_408"),
	  eNameLGov: document.getElementById("tfa_407"),
	  eNamePNP: document.getElementById("tfa_409"),
	  eNamePHC: document.getElementById("tfa_418"),
	  eNameRetire: document.getElementById("tfa_422")
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
  const employerNameFieldIDs = ['tfa_393', 'tfa_407', 'tfa_408', 'tfa_409', 'tfa_410', 'tfa_414', 'tfa_418', 'tfa_422'];
  const aIdFieldIDs = ['tfa_430', 'tfa_436', 'tfa_432', 'tfa_434', 'tfa_427', 'tfa_401', 'tfa_438', 'tfa_440'];
  const agencyNumberFieldIDs = ['tfa_449', 'tfa_451', 'tfa_453', 'tfa_455', 'tfa_457', 'tfa_459', 'tfa_461', 'tfa_463'];

  const employerNameFields = employerNameFieldIDs.map(id => document.getElementById(id));
  const aIdFields = aIdFieldIDs.map(id => document.getElementById(id));
  const agencyNumberFields = agencyNumberFieldIDs.map(id => document.getElementById(id));

  const aIdPrefillCalc = document.getElementById('tfa_442');
  const agencyNumberPrefillCalc = document.getElementById('tfa_126');

  const isEmployerPrefilled =
	  document.getElementById("tfa_444")?.value?.trim() !== "" ||
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

	function setPreferredLanguageValue(englishValue, options = {}) {
	  const { fireEvents = false } = options;
	  const field = document.getElementById("tfa_91");
	  if (!field || !englishValue) return false;

	  const option = Array.from(field.options).find(opt => {
	    return opt.dataset.englishValue === englishValue;
	  });

	  if (!option) return false;

	  field.value = option.value;
	  option.selected = true;

	  if (fireEvents) {
	    field.dispatchEvent(new Event("input", { bubbles: true }));
	    field.dispatchEvent(new Event("change", { bubbles: true }));
	  }

	  return true;
	}

	function normalizePreferredLanguagePicklist() {
	  const field = document.getElementById("tfa_91");
	  if (!field) return;

	  const preferredValueToNativeLabel = {};

	  Object.values(LANGUAGE_CONFIG).forEach(cfg => {
	    cfg.preferredValues.forEach(value => {
	      preferredValueToNativeLabel[value] = cfg.nativeLabel;
	    });
	  });

	  Object.assign(preferredValueToNativeLabel, OTHER_LANGUAGE_LABELS);

	  Array.from(field.options).forEach(option => {
	    if (!option.textContent.trim()) return;

	    if (!option.dataset.englishValue) {
	      option.dataset.englishValue = option.textContent.trim();
	    }

	    const englishValue = option.dataset.englishValue;

	    if (preferredValueToNativeLabel[englishValue]) {
	      option.textContent = preferredValueToNativeLabel[englishValue];
	    }
	  });
	}

	function applyTranslations() {
	  document.title = getTranslation(translationsNorm, "formTitle", getLang, document.title);

	  setHTML(valueFormTitle, "formTitle");
	  if (valueSubmitButton) {
		  valueSubmitButton.dataset.originalValue ||= valueSubmitButton.value || "";
		  valueSubmitButton.value = getTranslation(
			  translationsNorm,
			  "submitButton",
			  getLang,
			  valueSubmitButton.dataset.originalValue
			);
		}

	  if (stagingWarning) {
	    stagingWarning.innerHTML = `
	      <div style="background-color: rgb(255, 152, 0); padding: 20px;">
	        <div>
	          <p style="display: inline;" id="testWarning" data-testid="testWarning">
	            ${getTranslation(
							  translationsNorm,
							  "stagingWarning",
							  getLang,
							  "This form is for testing only."
							)}&nbsp;
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

	  setText(prefillWarning1, "prefillWarning1");
	  setText(prefillWarning2, "prefillWarning2");
	  setText(employerTypeLabel, "employerTypeLabel");
	  setText(firstName, "firstName");
	  setText(lastName, "lastName");
	  setText(birthDate, "birthDate");

	  if (birthDate) {
	    birthDate.classList.add("reqMark");
	    birthDate.style.cssText += "font-size:inherit!important;font-style:inherit!important;";
	  }

	  setText(preferredLanguage, "preferredLanguage");
	  setText(address, "address");
	  setText(addressNote, "addressNote");
	  setText(city, "city");
	  setText(state, "state");
	  setText(zip, "zip");
	  setText(email, "email");
	  setText(emailNote, "emailNote");
	  setText(phone, "phone");
	  setText(phoneNote, "phoneNote");
	  setText(smsOptOut, "smsOptOut");
	  setText(smsOptOutCheckbox, "smsOptOutCheckbox");
	  setText(polOptOut, "polOptOut");
	  setText(polOptOutCheckbox, "polOptOutCheckbox");
	  setText(signature, "signature");
	  setText(signatureNote, "signatureNote");
	  setText(membershipAuthTitle, "membershipAuthTitle");
	  setText(membershipAuthLL, "membershipAuthLL");
	  setText(duesAuthTitle, "duesAuthTitle");
	  setText(duesAuthLL, "duesAuthLL");

	  if (combinedLL && membershipAuthLL && duesAuthLL) {
	    combinedLL.value = `** Membership Authorization: ${membershipAuthLL.textContent} ** Dues Deduction / Checkoff Authorization: ${duesAuthLL.textContent}`;
	  }

	}

	function setPreferredLanguageFieldFromLang(lang) {
	  if (!preferredLanguageField) return;

	  const targets = LANGUAGE_CONFIG[lang]?.preferredValues;
	  if (!targets) return;

	  const option = Array.from(preferredLanguageField.options).find(opt => {
	    const englishValue = opt.dataset.englishValue || opt.textContent.trim();
	    return targets.includes(englishValue);
	  });

	  if (option) {
	    preferredLanguageField.value = option.value;
	    option.selected = true;
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

	  const { syncPreferredLanguageField = true } = options;

	  getLang = newLang;

	  document.documentElement.lang = getLang;
	  document.querySelector(".wForm")?.setAttribute("data-language", getLang);

	  if (select) select.value = getLang;

	  if (syncPreferredLanguageField) {
	    setPreferredLanguageFieldFromLang(getLang);
	  }

	  applyTranslations();
	  updateDatePlaceholders();

	  document.dispatchEvent(
	    new CustomEvent("languagechange", {
	      detail: { lang: getLang }
	    })
	  );
	}
  

	// set legal language (this block should run AFTER translation blocks)
	const membershipCheckbox = document.getElementById("tfa_116");
	// const duesAuthCheckbox = document.getElementById("tfa_380");
	const membershipAuthLanguage = membershipAuthLL.value;
	const duesAuthLanguage = duesAuthLL.value;

	membershipCheckbox.addEventListener('blur', function() {
		const combinedLegalLanguage = `**Membership Authorization: ${membershipAuthLanguage} • **Dues Authorization: ${duesAuthLanguage}`
		combinedLL.value = combinedLegalLanguage;

	});
});