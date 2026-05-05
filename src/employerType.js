// employerType.js

export function initEmployerType({
  formEl,
  getLang,
  employerTypeInput,
  employerTypeTranslations,
  employerNameTranslations,
  translations
}) {
  if (!employerTypeInput) return;

  const eNameState = document.getElementById("tfa_410");
  const eNameHiEd = document.getElementById("tfa_393");
  const eNameHCW = document.getElementById("tfa_414");
  const eNameNH = document.getElementById("tfa_408");
  const eNameLGov = document.getElementById("tfa_407");
  const eNamePNP = document.getElementById("tfa_409");
  const eNamePHC = document.getElementById("tfa_418");
  const eNameRetire = document.getElementById("tfa_422");

  const hiddenRequired = [
    eNameState,
    eNameHiEd,
    eNameHCW,
    eNameNH,
    eNameLGov,
    eNamePNP,
    eNamePHC,
    eNameRetire
  ];

  const employerNameFields = [
	  document.getElementById("tfa_410"), // State
	  document.getElementById("tfa_393"), // Higher Ed
	  document.getElementById("tfa_414"), // HCW
	  document.getElementById("tfa_408"), // Nursing Home
	  document.getElementById("tfa_407"), // Local Gov
	  document.getElementById("tfa_409"), // PNP
	  document.getElementById("tfa_418"), // Private Homecare
	  document.getElementById("tfa_422")  // Retiree
	].filter(Boolean);

  let employerTypeEnglishValue = "";

  function getLangCode() {
    return (getLang || document.documentElement.lang || "en").split("-")[0];
  }

  function getEmployerTypeTranslation(englishValue) {
    const lang = getLangCode();
    return employerTypeTranslations[lang]?.[englishValue] || englishValue;
  }

  function getEmployerTypeEnglishFromDisplayed(displayedValue) {
    const clean = (displayedValue || "").trim();
    if (!clean) return "";

    const allLanguageMaps = Object.values(employerTypeTranslations);

    if (allLanguageMaps.some(langMap => clean in langMap)) {
      return clean;
    }

    for (const langMap of allLanguageMaps) {
      for (const [english, translated] of Object.entries(langMap)) {
        if (translated === clean) return english;
      }
    }

    return clean;
  }

  function setEmployerTypeDisplay(englishValue) {
    if (!englishValue) return;

    employerTypeEnglishValue = englishValue;
    employerTypeInput.dataset.englishValue = englishValue;
    employerTypeInput.value = getEmployerTypeTranslation(englishValue);
  }

  function clearEmployerNameFields(fields) {
    fields.forEach(field => {
      if (!field) return;

      const container = field.closest(".oneField");
      if (container) container.style.display = "none";

      field.required = false;
      field.classList.remove("required");
      field.setAttribute("aria-required", "false");
      field.disabled = true;
      field.value = "";

      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  function hideEmployerNameFields() {
    hiddenRequired.forEach(field => {
      if (!field) return;

      const container = field.closest(".oneField");
      if (container) container.style.display = "none";

      field.disabled = true;
    });
  }

  function updateEmployerNameFields() {
    const englishValue =
      employerTypeEnglishValue ||
      employerTypeInput.dataset.englishValue ||
      getEmployerTypeEnglishFromDisplayed(employerTypeInput.value);

    hideEmployerNameFields();

    let toShow = null;

    switch (englishValue) {
      case "State Agency":
        toShow = eNameState;
        break;

      case "Higher Education":
        toShow = eNameHiEd;
        break;

      case "Homecare or Personal Support Worker":
      case "State Homecare or Personal Support":
        toShow = eNameHCW;
        break;

      case "Nursing Home":
        toShow = eNameNH;
        break;

      case "Local Government (City, County, School District)":
        toShow = eNameLGov;
        break;

      case "Non-Profit":
        toShow = eNamePNP;
        break;

      case "Private Homecare Agency":
        toShow = eNamePHC;
        break;

      default:
        toShow = null;
    }

    if (toShow) {
		  const container = toShow.closest(".oneField");
		  if (container) container.style.display = "";
		  toShow.disabled = false;

		  const label = document.getElementById(`${toShow.id}-L`);
		  const lang = getLangCode();

		  if (label) {
		    label.textContent =
		      translations?.employerNameLabel?.[lang] ||
		      translations?.employerNameLabel?.en ||
		      "Employer Name";
		  }
		}
  }

  function translateEmployerTypeSuggestions() {
    const lang = getLangCode();
    const translations = employerTypeTranslations[lang];
    if (!translations) return;

    const listbox = document.getElementById("tfa_388_listbox");
    if (!listbox) return;

    listbox.querySelectorAll(".tt-suggestion").forEach(option => {
      const englishValue =
        option.getAttribute("data-english-value") ||
        getEmployerTypeEnglishFromDisplayed(option.textContent);

      if (!englishValue) return;

      option.setAttribute("data-english-value", englishValue);

      const translatedValue = translations[englishValue];

      if (translatedValue && option.textContent.trim() !== translatedValue) {
        option.textContent = translatedValue;
      }
    });
  }

  function handleEmployerTypeInput() {
    const englishValue = getEmployerTypeEnglishFromDisplayed(employerTypeInput.value);

    employerTypeEnglishValue = englishValue;
    employerTypeInput.dataset.englishValue = englishValue;

    updateEmployerNameFields();

    setTimeout(() => {
      setEmployerTypeDisplay(englishValue);
      translateEmployerTypeSuggestions();
    }, 0);
  }

  function handleEmployerTypeCommit() {
    const englishValue = getEmployerTypeEnglishFromDisplayed(employerTypeInput.value);

    setEmployerTypeDisplay(englishValue);
    updateEmployerNameFields();
  }

  employerTypeInput.addEventListener("input", handleEmployerTypeInput);
  employerTypeInput.addEventListener("change", handleEmployerTypeCommit);
  employerTypeInput.addEventListener("typeahead:select", handleEmployerTypeCommit);
  employerTypeInput.addEventListener("blur", handleEmployerTypeCommit);
  employerTypeInput.addEventListener("focus", () => {
    setTimeout(translateEmployerTypeSuggestions, 100);
  });

  const employerTypeListbox = document.getElementById("tfa_388_listbox");

  if (employerTypeListbox) {
    const observer = new MutationObserver(() => {
      setTimeout(translateEmployerTypeSuggestions, 0);
    });

    observer.observe(employerTypeListbox, {
      childList: true,
      subtree: true
    });
  }

  document.addEventListener(
	  "click",
	  function (e) {
	    const clearIcon = e.target.closest(".tt-clear");
	    if (!clearIcon) return;

	    const fieldWrapper = clearIcon.closest(".inputWrapper");
	    if (!fieldWrapper) return;

	    const textInput = fieldWrapper.querySelector(
	      'input:not(.tt-hint)[type="text"]'
	    );

	    if (!textInput) return;

	    // Employer Name fields
	    const employerNameField = employerNameFields.find(field => {
	      return field && field.id === textInput.id;
	    });

	    if (employerNameField) {
	      e.preventDefault();
	      e.stopPropagation();

	      clearTranslatedSelectedValue(employerNameField);

	      employerNameField.value = "";
	      employerNameField.dataset.englishValue = "";

	      employerNameField.dispatchEvent(new Event("input", { bubbles: true }));
	      employerNameField.dispatchEvent(new Event("change", { bubbles: true }));

	      return;
	    }

	    // Employer Type field
	    if (textInput.id === employerTypeInput.id) {
	      e.preventDefault();
	      e.stopPropagation();

	      employerTypeEnglishValue = "";
	      employerTypeInput.dataset.englishValue = "";

	      textInput.value = "";
	      textInput.dispatchEvent(new Event("input", { bubbles: true }));
	      textInput.dispatchEvent(new Event("change", { bubbles: true }));

	      clearEmployerNameFields(hiddenRequired);
	    }
	  },
	  true
	);

  if (formEl) {
    formEl.addEventListener(
      "submit",
      function () {
        const englishValue =
          employerTypeEnglishValue ||
          employerTypeInput.dataset.englishValue ||
          getEmployerTypeEnglishFromDisplayed(employerTypeInput.value);

        if (englishValue) {
          employerTypeInput.value = englishValue;
        }

        setTimeout(() => {
          if (englishValue) setEmployerTypeDisplay(englishValue);
        }, 100);
      },
      true
    );
  }

  translateEmployerTypeSuggestions();

  // initDynamicTypeaheadTranslation(employerTypeInput, normalizeEmployerTypeTranslations());

	employerNameFields.forEach(field => {
	  initDynamicTypeaheadTranslation(field, employerNameTranslations);
	});

	function normalizeEmployerTypeTranslations() {
	  const normalized = {};

	  Object.entries(employerTypeTranslations).forEach(([lang, langMap]) => {
	    Object.entries(langMap).forEach(([english, translated]) => {
	      if (!normalized[english]) normalized[english] = { en: english };
	      normalized[english][lang] = translated;
	    });
	  });

	  return normalized;
	}

	function translateAndSortTypeahead(input, translationMap) {
	  if (!input || !translationMap) return;

	  const lang = getLangCode();
	  const listbox = document.getElementById(`${input.id}_listbox`);
	  if (!listbox) return;

	  const suggestions = Array.from(listbox.querySelectorAll(".tt-suggestion"));

	  suggestions.forEach(option => {
	    const englishValue =
	      option.dataset.englishValue ||
	      getEnglishFromDisplayed(option.textContent, translationMap);

	    if (!englishValue) return;

	    option.dataset.englishValue = englishValue;

	    const translatedValue =
	      translationMap[englishValue]?.[lang] ||
	      translationMap[englishValue]?.en ||
	      englishValue;

	    option.textContent = translatedValue;
	  });

	  suggestions
	    .sort((a, b) =>
	      a.textContent.trim().localeCompare(
	        b.textContent.trim(),
	        lang,
	        { sensitivity: "base" }
	      )
	    )
	    .forEach(option => {
	      option.parentNode.appendChild(option);
	    });
	}

	function getEnglishFromDisplayed(displayedValue, translationMap) {
	  const clean = (displayedValue || "").trim();
	  if (!clean) return "";

	  if (translationMap[clean]) return clean;

	  for (const [english, langMap] of Object.entries(translationMap)) {
	    if (Object.values(langMap).includes(clean)) {
	      return english;
	    }
	  }

	  return clean;
	}

	function initDynamicTypeaheadTranslation(input, translationMap) {
	  if (!input || !translationMap) return;

	  let isTranslating = false;

	  function runTranslation() {
		  if (isTranslating) return;

		  isTranslating = true;

		  const delays = [100, 250, 500, 900];

		  delays.forEach((delay, index) => {
		    setTimeout(() => {
		      translateAndSortTypeahead(input, translationMap);

		      if (index === delays.length - 1) {
		        isTranslating = false;
		      }
		    }, delay);
		  });
		}

	  input.addEventListener("focus", runTranslation);

	  input.addEventListener("input", function () {
	    clearTranslatedSelectedValue(input);

	    if (input.value.trim()) {
	      runTranslation();
	    }
	  });

	  input.addEventListener("change", function () {
	    setTimeout(() => {
	      showTranslatedSelectedValue(input, translationMap);
	    }, 50);
	  });

	  input.addEventListener("typeahead:select", function () {
	    setTimeout(() => {
	      showTranslatedSelectedValue(input, translationMap);
	    }, 50);
	  });

	  input.addEventListener("blur", function () {
	    setTimeout(() => {
	      showTranslatedSelectedValue(input, translationMap);
	    }, 50);
	  });
	}

	function getTranslatedValue(englishValue, translationMap) {
  const lang = getLangCode();

  return (
    translationMap?.[englishValue]?.[lang] ||
    translationMap?.[englishValue]?.en ||
    englishValue
  );
}

function ensureDisplayOverlay(input) {
  const wrapper = input.closest(".twitter-typeahead") || input.parentElement;
  if (!wrapper) return null;

  wrapper.style.position = "relative";

  let overlay = wrapper.querySelector(".translated-typeahead-value");

  if (!overlay) {
    overlay = document.createElement("span");
    overlay.className = "translated-typeahead-value";

    overlay.style.position = "absolute";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.pointerEvents = "none";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.paddingLeft = "inherit";
    overlay.style.font = "inherit";
    overlay.style.color = "inherit";
    overlay.style.background = "transparent";
    overlay.style.zIndex = "2";

    wrapper.appendChild(overlay);
  }

  return overlay;
}

function showTranslatedSelectedValue(input, translationMap) {
  if (!input || !input.value) return;

  const englishValue = getEnglishFromDisplayed(input.value, translationMap);
  const translatedValue = getTranslatedValue(englishValue, translationMap);

  input.dataset.englishValue = englishValue;

  const overlay = ensureDisplayOverlay(input);
  if (!overlay) return;

  overlay.textContent = translatedValue;

  // Hide real English text, but keep the real value for FormAssembly/Salesforce
  input.style.color = "transparent";
  input.style.caretColor = "transparent";
}

function clearTranslatedSelectedValue(input) {
  const wrapper = input.closest(".twitter-typeahead") || input.parentElement;
  const overlay = wrapper?.querySelector(".translated-typeahead-value");

  if (overlay) overlay.textContent = "";

  input.style.color = "";
  input.style.caretColor = "";
  input.dataset.englishValue = "";
}
}



