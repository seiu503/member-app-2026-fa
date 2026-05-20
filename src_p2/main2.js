// main2.js

import { translations, 
	LANGUAGE_CONFIG, 
	OTHER_LANGUAGE_LABELS, 
	supportedLangs 
	} from "./translations2.js";
import { initValidation } from "./validation2.js";
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


	// ************ ELEMENT DEFINITIONS ************ //
	var valueFormTitle = document.getElementsByClassName("gform_title")[0];
	var valueSubmitButton = document.querySelector("#submit_button");
	var stagingWarning = document.getElementById("tfa_387-HTML");
	var firstName = document.getElementById("tfa_1-L"); 
	var lastName = document.getElementById("tfa_2-L");
	var hireDate = document.getElementById("tfa_134-L"); 
	var mailToStreet = document.getElementById("tfa_32-L"); 
	var mailToCity = document.getElementById("tfa_34-L"); 
	var mailToState = document.getElementById("tfa_35-L");
	var mailToZip = document.getElementById("tfa_39-L"); 
	var email = document.getElementById("tfa_3-L"); 
	var membershipConf = document.getElementById("membershipConf");
	var demographicsNote = document.getElementById("tfa_453-HTML");
	var demographicsHeader = document.getElementById("tfa_452-L");
	var raceEthnicityHelperText = document.getElementById("tfa_455-L");
	var africanOrAfricanAmerican = document.getElementById("tfa_456-L");
	var arabAmericanMiddleEasternOrNorthAfrican = document.getElementById("tfa_457-L");
	var asianOrAsianAmerican = document.getElementById("tfa_458-L");
	var hispanicOrLatinx = document.getElementById("tfa_459-L");
	var nativeAmericanOrIndigenous = document.getElementById("tfa_460-L");
	var white = document.getElementById("tfa_461-L");
	var notListed = document.getElementById("tfa_462-L");
	var declined = document.getElementById("tfa_463-L");
	var otherSocialIdentities = document.getElementById("tfa_464-L");
	var lgbtqId = document.getElementById("tfa_466-L");
	var transId = document.getElementById("tfa_470-L");
	var veteranId = document.getElementById("tfa_464-L");
	var disabilityId = document.getElementById("tfa_478-L");
	var deafOrHardOfHearing = document.getElementById("tfa_482-L");
	var blindOrVisuallyImpaired = document.getElementById("tfa_486-L");
	var gender = document.getElementById("tfa_487-L");
	var female = document.getElementById("tfa_500");
	var male = document.getElementById("tfa_501");
	var nonBinary = document.getElementById("tfa_502");
	var notListed2 = document.getElementById("tfa_503");
	var pronouns = document.getElementById("tfa_495-L");
	var sheHer = document.getElementById("tfa_504");
	var heHim = document.getElementById("tfa_505");
	var theyThem = document.getElementById("tfa_506");
	var sheThey = document.getElementById("tfa_507");
	var heThey = document.getElementById("tfa_508");
	var notListed3 = document.getElementById("tfa_509");
	var employmentInfo = document.getElementById("tfa_446-L");
	var jobTitle = document.getElementById("tfa_511-L");
	var worksite = document.getElementById("tfa_386-L");
	var workEmail = document.getElementById("tfa_450-L");
	var workPhone = document.getElementById("tfa_4-L");
	var mailToAddress = document.getElementById("tfa_447-L");
	var fieldHintAddress = document.getElementById("tfa_448-HTML");

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

	  setText(firstName, "firstName");
	  setText(lastName, "lastName");
	  setText(hireDate, "hireDate");
	  setText(mailToStreet, "mailToStreet");
	  setText(mailToCity, "mailToCity");
	  setText(mailToState, "mailToState");
	  setText(mailToZip, "mailToZip");
	  setText(email, "email");
	  setText(membershipConf, "membershipConf");
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