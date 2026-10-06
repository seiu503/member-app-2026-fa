// employerType.js

export function initEmployerType({
  formEl,
  getLang,
  getCurrentLang,
  employerTypeInput,
  employerTypeTranslations,
  employerNameTranslations,
  translations,
  eNameStateId,
  eNameHiEdId,
  eNameHCWId,
  eNameNHId,
  eNameLGovId,
  eNamePNPId,
  eNamePHCId,
  eNameRetireId
}) {
  if (!employerTypeInput) return;

  const eNameState = document.getElementById(eNameStateId); // tfa_410
  const eNameHiEd = document.getElementById(eNameHiEdId); // tfa_393
  const eNameHCW = document.getElementById(eNameHCWId); // tfa_414
  const eNameNH = document.getElementById(eNameNHId); // tfa_408
  const eNameLGov = document.getElementById(eNameLGovId); // tfa_407
  const eNamePNP = document.getElementById(eNamePNPId); // tfa_409
  const eNamePHC = document.getElementById(eNamePHCId); // tfa_418
  const eNameRetire = document.getElementById(eNameRetireId); // tfa_422

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

  const employerNameFields = hiddenRequired.filter(Boolean);

  let employerTypeEnglishValue = "";

  function getLangCode() {
    return (getCurrentLang?.() || document.documentElement.lang || getLang || "en").split("-")[0];
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

  function setEmployerNameLabel(field) {
    if (!field) return;

    const label = document.getElementById(`${field.id}-L`);
    if (!label) return;

    const lang = getLangCode();

    label.textContent =
      translations?.employerNameLabel?.[lang] ||
      translations?.employerNameLabel?.en ||
      "Employer Name";
  }

function updateEmployerNameFields() {
    const englishValue =
      getEmployerTypeEnglishFromDisplayed(employerTypeInput.value) ||
      employerTypeInput.dataset.englishValue ||
      employerTypeEnglishValue;

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

      setEmployerNameLabel(toShow);
    }
  }

  function translateEmployerTypeSuggestions() {
    const lang = getLangCode();
    const translations = employerTypeTranslations[lang];
    if (!translations) return;

    const listbox = document.getElementById(
      `${employerTypeInput.id}_listbox`
    );
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

    employerTypeEnglishValue = englishValue;
    employerTypeInput.dataset.englishValue = englishValue;

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

  const employerTypeListbox =
    document.getElementById(
      `${employerTypeInput.id}_listbox`
    );

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

        const $ = window.jQuery;

        const wrapper =
          employerNameField.closest(".twitter-typeahead") ||
          fieldWrapper;

        /*
         * formAssembly's typeahead markup differs btw forms
         * clear every real text input associated with this field
         * not just the input reference we initialized with
         */
        const typeaheadInputs = Array.from(
          fieldWrapper.querySelectorAll(
            'input[type="text"]:not(.tt-hint)'
          )
        );

        const inputsToClear = [
          employerNameField,
          textInput,
          ...typeaheadInputs
        ].filter(
          (field, index, array) =>
            field &&
            array.indexOf(field) === index
        );

        /*
         * ask typeahead to clear its internal state
         * wherever the api is attached
         */
        inputsToClear.forEach(field => {
          if (
            $ &&
            $.fn &&
            typeof $.fn.typeahead === "function"
          ) {
            try {
              $(field).typeahead("val", "");
            } catch (error) {
              // fall through to direct dom clearing below
            }
          }

          field.value = "";
          field.setAttribute("value", "");
          field.dataset.englishValue = "";
        });

        /*
         * clear typeahead hint
         */
        const hint =
          wrapper?.querySelector(".tt-hint");

        if (hint) {
          hint.value = "";
          hint.setAttribute("value", "");
        }

        /*
         * remove translated overlay
         * restore translated field label
         */
        clearTranslatedSelectedValue(
          employerNameField
        );

        setEmployerNameLabel(
          employerNameField
        );

        /*
         * notify FA after every underlying value is empty
         */
        inputsToClear.forEach(field => {
          field.dispatchEvent(
            new Event("input", {
              bubbles: true
            })
          );

          field.dispatchEvent(
            new Event("change", {
              bubbles: true
            })
          );
        });

        /*
         * some typeahead handlers update state after 
         * click event completes. enforce empty value on
         * next event-loop turn
         */
        setTimeout(() => {
          inputsToClear.forEach(field => {
            field.value = "";
            field.setAttribute("value", "");
            field.dataset.englishValue = "";
          });

          if (hint) {
            hint.value = "";
            hint.setAttribute("value", "");
          }

          clearTranslatedSelectedValue(
            employerNameField
          );

          setEmployerNameLabel(
            employerNameField
          );
        }, 0);

        return;
      }

	    // employer Type field
      if (textInput.id === employerTypeInput.id) {
        e.preventDefault();
        e.stopPropagation();

        employerTypeEnglishValue = "";
        employerTypeInput.dataset.englishValue = "";
        employerTypeInput.value = "";
        textInput.value = "";

        clearEmployerNameFields(hiddenRequired);
        updateEmployerNameFields();

        textInput.dispatchEvent(new Event("input", { bubbles: true }));
        textInput.dispatchEvent(new Event("change", { bubbles: true }));

        return;
      }
	  },
	  true
	);

  if (formEl) {
    formEl.addEventListener(
      "submit",
      function () {
        const englishValue =
          getEmployerTypeEnglishFromDisplayed(employerTypeInput.value) ||
          employerTypeInput.dataset.englishValue ||
          employerTypeEnglishValue;

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

	employerNameFields.forEach(field => {
	  initDynamicTypeaheadTranslation(field, employerNameTranslations);
	});

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

      setEmployerNameLabel(input);

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
  const wrapper =
    input.closest(".twitter-typeahead") ||
    input.parentElement;

  if (!wrapper) return null;

  wrapper.style.position = "relative";

  let overlay =
    wrapper.querySelector(
      ".translated-typeahead-value"
    );

  if (!overlay) {
    overlay = document.createElement("span");
    overlay.className =
      "translated-typeahead-value";

    overlay.style.position = "absolute";
    overlay.style.pointerEvents = "none";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.boxSizing = "border-box";
    overlay.style.background = "transparent";
    overlay.style.zIndex = "2";

    wrapper.appendChild(overlay);
  }

  const inputStyles =
    window.getComputedStyle(input);

  const wrapperRect =
    wrapper.getBoundingClientRect();

  const inputRect =
    input.getBoundingClientRect();

  overlay.style.left =
    `${inputRect.left - wrapperRect.left}px`;

  overlay.style.top =
    `${inputRect.top - wrapperRect.top}px`;

  overlay.style.width =
    `${inputRect.width}px`;

  overlay.style.height =
    `${inputRect.height}px`;

  overlay.style.paddingLeft =
    inputStyles.paddingLeft;

  overlay.style.paddingRight =
    inputStyles.paddingRight;

  overlay.style.setProperty(
    "font-family",
    inputStyles.fontFamily,
    "important"
  );

  overlay.style.setProperty(
    "font-size",
    inputStyles.fontSize,
    "important"
  );

  overlay.style.setProperty(
    "font-weight",
    inputStyles.fontWeight,
    "important"
  );

  overlay.style.setProperty(
    "line-height",
    inputStyles.lineHeight,
    "important"
  );

  overlay.style.color = "inherit";

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

  document.addEventListener("languagechange", function () {
    translateEmployerTypeSuggestions();

    employerNameFields.forEach(field => {
      translateAndSortTypeahead(field, employerNameTranslations);
      showTranslatedSelectedValue(field, employerNameTranslations);

      if (!field.disabled) {
        setEmployerNameLabel(field);
      }
    });
  });
}



