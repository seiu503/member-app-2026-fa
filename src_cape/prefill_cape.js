// prefill.js

export function initPrefill({
  getLang,
  detectedSupportedLang,
  employerTypeInput,
  hiddenRequired = [],
  LANGUAGE_CONFIG = {}
}) {
  console.log('initPrefill cape');
  initPrefilledFields({
    getLang,
    detectedSupportedLang,
    employerTypeInput,
    hiddenRequired,
    LANGUAGE_CONFIG
  });

  initPrefillModal({
    getLang,
    LANGUAGE_CONFIG
  });
}

function getFieldContainer(field) {
  if (!field) return null;

  return (
    field.closest(".field-container-D, .form-group, .question, .oneField") ||
    field.parentElement
  );
}

function isValidUSPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length === 10;
}

function showPrefilledField(field) {
  const container = getFieldContainer(field);

  if (container) {
    container.style.removeProperty("display");
  }

  field.dataset.prefilled = "false";
}

function hidePrefilledField(field) {
  console.log(`hiding prefilled field: ${field}`);
  const container = getFieldContainer(field);

  if (container) {
    container.style.display = "none";
  }

  field.dataset.prefilled = "true";
}

function showFieldValidationError(field, message) {
  const container = getFieldContainer(field);
  if (!container) return;

  container.style.removeProperty("display");
  container.classList.add("errFld", "tfa-inline-error-present");

  field.setAttribute("aria-invalid", "true");

  let errorElement =
    container.querySelector(".errMsg") ||
    container.querySelector(".errorMessage");

  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "errMsg";
    errorElement.setAttribute("role", "alert");

    const inputWrapper =
      field.closest(".inputWrapper") ||
      field.parentElement;

    if (inputWrapper?.parentNode) {
      inputWrapper.insertAdjacentElement("afterend", errorElement);
    } else {
      container.appendChild(errorElement);
    }
  }

  errorElement.textContent = message;
}

function clearFieldValidationError(field) {
  const container = getFieldContainer(field);
  if (!container) return;

  container.classList.remove("errFld", "tfa-inline-error-present");
  field.removeAttribute("aria-invalid");

  const errorElement =
    container.querySelector(".errMsg") ||
    container.querySelector(".errorMessage");

  if (errorElement) {
    errorElement.remove();
  }
}

function validatePrefilledPhone(field) {
  if (!field) return true;

  const value = field.value.trim();

  if (!value) {
    return true;
  }

  if (!isValidUSPhone(value)) {
    showPrefilledField(field);

    showFieldValidationError(
      field,
      "Please enter a valid phone number"
    );

    return false;
  }

  clearFieldValidationError(field);
  return true;
}

function initPrefilledFields({
  getLang,
  detectedSupportedLang,
  employerTypeInput,
  hiddenRequired,
  LANGUAGE_CONFIG
}) {
  console.log('initPrefilledFields cape');
  const preferredLanguageF = document.getElementById("tfa_1798");
  const addressF = document.getElementById("tfa_32");
  const cityF = document.getElementById("tfa_34");
  const stateF = document.getElementById("tfa_35");
  const zipF = document.getElementById("tfa_39");
  const emailF = document.getElementById("tfa_3");
  const phoneF = document.getElementById("tfa_4");
  const employerNamePrefill = document.getElementById("tfa_1303");

  handleAddressPrefillGroup({
	  addressF,
	  cityF,
	  stateF,
	  zipF
	});

	handlePreferredLanguagePrefill({
    preferredLanguageF,
    getLang,
    detectedSupportedLang,
    LANGUAGE_CONFIG
  });

  const prefillFieldList = [
    emailF,
    phoneF,
    employerNamePrefill
  ].filter(Boolean);

  prefillFieldList.forEach(field => {
    const wasPrefilled =
      typeof field.value === "string" &&
      field.value.trim() !== "";

    if (!wasPrefilled) {
      field.dataset.prefilled = "false";
      return;
    }

    /*
     * A prefilled phone must be valid before it can be hidden.
     */
    if (field.id === "tfa_4") {
      const phoneIsValid = validatePrefilledPhone(field);

      if (!phoneIsValid) {
        /*
         * Invalid prefilled phone stays visible.
         * The mobile-alert opt-out also stays visible.
         */
        showMobileAlertsOptOut();

        field.addEventListener("input", function () {
          if (isValidUSPhone(field.value)) {
            clearFieldValidationError(field);
          }
        });

        field.addEventListener("blur", function () {
          if (field.value.trim() && !isValidUSPhone(field.value)) {
            showFieldValidationError(
              field,
              "Please enter a valid phone number"
            );
          } else {
            clearFieldValidationError(field);
          }
        });

        return;
      }

      /*
       * The phone came from prefill and is valid.
       * Hide both the phone and the mobile-alert opt-out.
       */
      hideMobileAlertsOptOut();
    }

    field.dataset.prefilled = "true";

    if (field.id === "tfa_1303") {
      const employerTypeContainer =
        document.getElementById("tfa_1301");

      if (employerTypeContainer) {
        employerTypeContainer.style.display = "none";
      }

      if (employerTypeInput) {
        employerTypeInput.required = false;
        employerTypeInput.removeAttribute("required");
        employerTypeInput.classList.remove("required");
        employerTypeInput.setAttribute("aria-required", "false");
        employerTypeInput.disabled = true;
      }

      markFieldSwitchedOff("tfa_1302");

      hiddenRequired.forEach(hiddenField => {
        if (!hiddenField) return;

        hiddenField.required = false;
        hiddenField.removeAttribute("required");
        hiddenField.classList.remove("required");
        hiddenField.setAttribute("aria-required", "false");
        hiddenField.disabled = true;

        const container = getFieldContainer(hiddenField);

        if (container) {
          container.style.display = "none";
        }
      });

      return;
    }

    hidePrefilledField(field);
  });
}

function handleAddressPrefillGroup({
  addressF,
  cityF,
  stateF,
  zipF
}) {
  const addressFields = [addressF, cityF, stateF, zipF].filter(Boolean);

  const hasAddress = !!addressF && addressF.value.trim() !== "";
	const hasCity = !!cityF && cityF.value.trim() !== "";
	const hasZip = !!zipF && zipF.value.trim() !== "";

  const shouldHideAddressGroup = hasAddress && hasCity && hasZip;

  addressFields.forEach(field => {
    field.dataset.prefilled = shouldHideAddressGroup ? "true" : "false";

    const container =
      field.closest(".field-container-D, .form-group, .question") ||
      field.parentNode;

    if (container) {
      if (shouldHideAddressGroup) {
			  container.style.display = "none";
			} else {
			  container.style.removeProperty("display");
			}
    }
  });
}

function handlePreferredLanguagePrefill({
  preferredLanguageF,
  getLang,
  detectedSupportedLang,
  LANGUAGE_CONFIG
}) {
  if (!preferredLanguageF) return;

  const container =
    preferredLanguageF.closest(".field-container-D, .form-group, .question") ||
    preferredLanguageF.parentNode;

  if (!detectedSupportedLang) {
    preferredLanguageF.dataset.prefilled = "false";
    preferredLanguageF.required = true;
    preferredLanguageF.setAttribute("aria-required", "true");

    if (container) container.style.removeProperty("display");
    return;
  }

  const preferredValues = LANGUAGE_CONFIG[getLang]?.preferredValues || [];
  const desiredValues = new Set(preferredValues);

  const matchingOption = Array.from(preferredLanguageF.options).find(option => {
    const englishValue =
      option.dataset.englishValue ||
      option.textContent.trim() ||
      option.value.trim();

    return desiredValues.has(englishValue);
  });

  if (!matchingOption) {
    preferredLanguageF.dataset.prefilled = "false";
    if (container) container.style.removeProperty("display");
    return;
  }

  preferredLanguageF.value = matchingOption.value;
  matchingOption.selected = true;

  preferredLanguageF.dataset.prefilled = "true";

  preferredLanguageF.dispatchEvent(new Event("input", { bubbles: true }));
  preferredLanguageF.dispatchEvent(new Event("change", { bubbles: true }));

  if (container) {
    container.style.display = "none";
  }
}

function markFieldSwitchedOff(fieldName) {
  const switchedOffField = document.querySelector('input[name="tfa_switchedoff"]');
  if (!switchedOffField) return;

  const parts = switchedOffField.value
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  if (!parts.includes(fieldName)) {
    parts.push(fieldName);
    switchedOffField.value = parts.join(",");
  }
}

function initPrefillModal({
  getLang,
  LANGUAGE_CONFIG
}) {
  console.log("initPrefillModal cape");

  const body = document.body;
  const modalContent = document.getElementById("tfa_327");
  const fullNameField = document.getElementById("tfa_330");
  const linkInfo = document.getElementById("tfa_331");

  if (!body || !modalContent || !fullNameField || !linkInfo) {
    console.warn("CAPE prefill modal missing required elements", {
      body,
      modalContent,
      fullNameField,
      linkInfo
    });

    return;
  }

  /*
   * Prevent this form's initialization from adding a second launcher.
   */
  if (document.getElementById("hiddenButton")) {
    console.warn("CAPE prefill modal already initialized");
    return;
  }

  const fullName = fullNameField.value.trim().substring(0, 40);

  if (!fullName) {
    return;
  }

  const rawLanguage =
    typeof getLang === "function"
      ? getLang()
      : getLang || navigator.language || "en";

  const languageCode =
    String(rawLanguage).toLowerCase().split("-")[0];

  const lang =
    LANGUAGE_CONFIG[languageCode]?.renderLang ||
    languageCode ||
    "en";

  const modalText = {
    en: {
      titlePrefix: "Are you",
      closePrefix: "Yes, I'm",
      notMePrefix: "I'm not"
    },
    es: {
      titlePrefix: "¿Es Ud.",
      closePrefix: "Sí, soy",
      notMePrefix: "No soy"
    },
    ru: {
      titlePrefix: "Это вы,",
      closePrefix: "Да, это я,",
      notMePrefix: "Я не"
    },
    vi: {
      titlePrefix: "Quý vị có phải là",
      closePrefix: "Vâng, tôi là",
      notMePrefix: "Tôi không phải là"
    },
    zh: {
      titlePrefix: "您是",
      closePrefix: "是的，我是",
      notMePrefix: "我不是"
    },
    ar: {
      titlePrefix: "هل أنت",
      closePrefix: "نعم، أنا",
      notMePrefix: "أنا لست"
    },
    so: {
      titlePrefix: "Ma waxaad tahay",
      closePrefix: "Haa, waxaan ahay",
      notMePrefix: "Ma ihi"
    }
  };

  const text = modalText[lang] || modalText.en;

  const hiddenButton = document.createElement("button");

  hiddenButton.type = "button";
  hiddenButton.id = "hiddenButton";
  hiddenButton.className = "js-modal invisible";

  hiddenButton.setAttribute(
    "data-modal-prefix-class",
    "simple-animated"
  );

  hiddenButton.setAttribute(
    "data-modal-content-id",
    "tfa_327"
  );

  hiddenButton.setAttribute(
    "data-modal-title",
    `${text.titlePrefix} ${fullName}?`
  );

  hiddenButton.setAttribute(
    "data-modal-close-text",
    `${text.closePrefix} ${fullName}`
  );

  hiddenButton.setAttribute(
    "data-modal-close-title",
    `${text.closePrefix} ${fullName}`
  );

  body.insertBefore(hiddenButton, body.firstChild);

  const urlParams =
    new URLSearchParams(window.location.search);

  const cId = urlParams.get("cId");
  const aId = urlParams.get("aId");
  const omaId = urlParams.get("OMA");
  const src = urlParams.get("src");

  setFieldValue("tfa_326", cId);
  setFieldValue("tfa_1316", aId);
  setFieldValue("tfa_390", omaId);
  setFieldValue("tfa_1335", src || "Direct seiu503signup FA");

  if (omaId) {
    console.log("CAPE modal skipped because OMA is present", {
      omaId
    });
    return;
  }

  /*
   * tfa_330 already contains the explanatory text and name.
   * Only add the red "not me" button to tfa_331.
   */
  linkInfo.innerHTML = `
    <button
      type="button"
      class="custom-link-text not-me-button"
    >
      ${text.notMePrefix} ${fullName}
    </button>
  `;

  document.addEventListener(
    "click",
    function handleNotMeClick(event) {
      const notMeButton =
        event.target.closest(".not-me-button");

      if (!notMeButton) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const cleanUrl =
        window.location.origin +
        window.location.pathname;

      window.location.replace(cleanUrl);
    },
    true
  );

  /*
   * Modal opens only on 'blank slate' CAPE; not on OMA redirect
   */
  const hasContactId = Boolean(cId);
  const hasAccountId = Boolean(aId);
  const hasOmaId = Boolean(omaId);

  const shouldOpenModal =
    Boolean(fullName) &&
    hasContactId &&
    hasAccountId &&
    !hasOmaId;

  console.log("CAPE modal launch check", {
    cId,
    aId,
    omaId,
    fullName,
    shouldOpenModal
  });

  if (shouldOpenModal) {
    hiddenButton.click();
  }
}

function setFieldValue(id, value) {
  if (value === null || value === undefined || value === "") {
    return;
  }

  const field = document.getElementById(id);
  if (!field) return;

  field.value = value;

  field.dispatchEvent(
    new Event("input", { bubbles: true })
  );

  field.dispatchEvent(
    new Event("change", { bubbles: true })
  );
}

function hideElementById(id) {
  const element = document.getElementById(id);

  if (element) {
    element.style.display = "none";
  }
}

function showElementById(id) {
  const element = document.getElementById(id);

  if (element) {
    element.style.removeProperty("display");
  }
}

function hideMobileAlertsOptOut() {
  hideElementById("tfa_114-D");
}

function showMobileAlertsOptOut() {
  showElementById("tfa_114-D");
}