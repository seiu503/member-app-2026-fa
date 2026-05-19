// prefill.js

export function initPrefill({
  getLang,
  detectedSupportedLang,
  employerTypeInput,
  hiddenRequired = [],
  LANGUAGE_CONFIG = {}
}) {
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

function initPrefilledFields({
  getLang,
  detectedSupportedLang,
  employerTypeInput,
  hiddenRequired,
  LANGUAGE_CONFIG
}) {
  const preferredLanguageF = document.getElementById("tfa_91");
  const addressF = document.getElementById("tfa_32");
  const cityF = document.getElementById("tfa_34");
  const stateF = document.getElementById("tfa_35");
  const zipF = document.getElementById("tfa_39");
  const emailF = document.getElementById("tfa_3");
  const phoneF = document.getElementById("tfa_4");
  const employerNamePrefill = document.getElementById("tfa_444");

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
    const wasPrefilled = field.value && field.value.trim() !== "";

    if (!wasPrefilled) {
      field.dataset.prefilled = "false";
      return;
    }

    field.dataset.prefilled = "true";

    let container;

    if (field.id === "tfa_444") {
      const employerTypeContainer = document.getElementById("tfa_400");

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

      markFieldSwitchedOff("tfa_388");

      hiddenRequired.forEach(f => {
        if (!f) return;

        f.required = false;
        f.removeAttribute("required");
        f.classList.remove("required");
        f.setAttribute("aria-required", "false");
        f.disabled = true;

        const c =
          f.closest(".oneField") ||
          f.closest(".field-container-D, .form-group, .question");

        if (c) c.style.display = "none";
      });

      container = null;
    } else {
      container =
        field.closest(".field-container-D, .form-group, .question") ||
        field.parentNode;
    }

    if (container) {
      container.style.display = "none";
    }
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
  const body = document.querySelector("body");
  const fullNameField = document.getElementById("tfa_330");
  const linkInfo = document.getElementById("tfa_331");

  if (!body || !fullNameField || !linkInfo) return;

  body.insertAdjacentHTML("afterBegin", `<div id="js-modal-page">`);
  body.insertAdjacentHTML("beforeEnd", `</div>`);

  const fullName = fullNameField.value.substring(0, 40);
  const rawLang = (getLang || navigator.language || "en").split("-")[0];
  const lang = LANGUAGE_CONFIG[rawLang]?.renderLang || "en";

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
  hiddenButton.setAttribute("id", "hiddenButton");
  hiddenButton.setAttribute("data-modal-prefix-class", "simple-animated");
  hiddenButton.setAttribute("data-modal-content-id", "tfa_327");
  hiddenButton.setAttribute("data-modal-title", `${text.titlePrefix} ${fullName}?`);
  hiddenButton.setAttribute("data-modal-close-text", `${text.closePrefix} ${fullName}`);
  hiddenButton.setAttribute("data-modal-close-title", `${text.closePrefix} ${fullName}`);
  hiddenButton.setAttribute("class", "js-modal invisible");

  document.body.insertBefore(hiddenButton, document.body.firstChild);

  const urlParams = new URLSearchParams(window.location.search);
  const cId = urlParams.get("cId");
  const aId = urlParams.get("aId");
  const src = urlParams.get("src");

  setFieldValue("tfa_445", cId);
  setFieldValue("tfa_442", aId);
  setFieldValue("tfa_446", src || "Direct seiu503signup FA");

  const linkHtml = `
    <button type="button" class="custom-link-text not-me-button">
      ${text.notMePrefix} ${fullName}
    </button>
  `;

  linkInfo.innerHTML += linkHtml;

  document.addEventListener(
    "click",
    function (e) {
      const notMeButton = e.target.closest(".not-me-button");
      if (!notMeButton) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const cleanUrl = window.location.origin + window.location.pathname;
      window.location.replace(cleanUrl);
    },
    true
  );

  if (cId && aId && fullName) {
    hiddenButton.click();
  }
}

function setFieldValue(id, value) {
  if (!value) return;

  const field = document.getElementById(id);
  if (!field) return;

  field.value = value;
}