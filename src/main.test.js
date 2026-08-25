// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const translations = {
  formtitle: { en: "Join", es: "Únete" },
  submitbutton: { en: "Submit", es: "Enviar" },
  stagingwarning: { en: "Testing only", es: "Solo para pruebas" },
  prefillwarning1: { en: "Customized for", es: "Personalizado para" },
  prefillwarning2: { en: "Not you", es: "No eres tú" },
  employertypelabel: { en: "Employer type", es: "Tipo de empleador" },
  firstname: { en: "First name", es: "Nombre" },
  lastname: { en: "Last name", es: "Apellido" },
  birthdate: { en: "Birth date", es: "Fecha de nacimiento" },
  preferredlanguage: { en: "Preferred language", es: "Idioma preferido" },
  address: { en: "Address", es: "Dirección" },
  addressnote: { en: "Address note", es: "Nota de dirección" },
  city: { en: "City", es: "Ciudad" },
  state: { en: "State", es: "Estado" },
  zip: { en: "ZIP", es: "Código postal" },
  email: { en: "Email", es: "Correo electrónico" },
  emailnote: { en: "Email note", es: "Nota de correo" },
  phone: { en: "Phone", es: "Teléfono" },
  phonenote: { en: "Phone note", es: "Nota de teléfono" },
  smsoptout: { en: "SMS opt out", es: "No recibir SMS" },
  smsoptoutcheckbox: { en: "SMS checkbox", es: "Casilla SMS" },
  poloptout: { en: "Political opt out", es: "No recibir mensajes políticos" },
  poloptoutcheckbox: { en: "Political checkbox", es: "Casilla política" },
  signature: { en: "Signature", es: "Firma" },
  signaturenote: { en: "Signature note", es: "Nota de firma" },
  membershipauthtitle: {
    en: "Membership authorization",
    es: "Autorización de membresía"
  },
  membershipauthll: {
    en: "Membership legal",
    es: "Texto legal de membresía"
  },
  duesauthtitle: {
    en: "Dues authorization",
    es: "Autorización de cuotas"
  },
  duesauthll: {
    en: "Dues legal",
    es: "Texto legal de cuotas"
  },
  mmplaceholder: { en: "Month", es: "Mes" },
  ddplaceholder: { en: "Day", es: "Día" },
  yyyyplaceholder: { en: "Year", es: "Año" }
};

const LANGUAGE_CONFIG = {
  en: {
    pickerLabel: "English",
    nativeLabel: "English",
    preferredValues: ["English"],
    renderLang: "en"
  },
  es: {
    pickerLabel: "Español",
    nativeLabel: "Español",
    preferredValues: ["Spanish"],
    renderLang: "es"
  },
  zh: {
    pickerLabel: "中文",
    nativeLabel: "中文",
    preferredValues: ["Simplified Chinese", "Mandarin"],
    renderLang: "zh"
  }
};

const initEmployerType = vi.fn();
const initValidation = vi.fn();
const initPrefill = vi.fn();
const initDateHelpers = vi.fn();

vi.mock("./translations.js", () => ({
  translations,
  employerTypeTranslations: {},
  employerNameTranslations: {},
  LANGUAGE_CONFIG,
  OTHER_LANGUAGE_LABELS: { French: "Français" },
  supportedLangs: ["en", "es", "zh"]
}));

vi.mock("./employerType.js", () => ({ initEmployerType }));
vi.mock("./validation.js", () => ({ initValidation }));
vi.mock("./prefill.js", () => ({ initPrefill }));
vi.mock("./dateHelpers.js", () => ({ initDateHelpers }));

const employerIds = [
  "tfa_393",
  "tfa_407",
  "tfa_408",
  "tfa_409",
  "tfa_410",
  "tfa_414",
  "tfa_418",
  "tfa_422"
];

const aidIds = [
  "tfa_430",
  "tfa_436",
  "tfa_432",
  "tfa_434",
  "tfa_427",
  "tfa_401",
  "tfa_438",
  "tfa_440"
];

const agencyIds = [
  "tfa_449",
  "tfa_451",
  "tfa_453",
  "tfa_455",
  "tfa_457",
  "tfa_459",
  "tfa_461",
  "tfa_463"
];

function label(id, text = id) {
  return `<label id="${id}">${text}</label>`;
}

function input(id, value = "") {
  return `<input id="${id}" value="${value}">`;
}

function buildDom({ employerPrefill = "" } = {}) {
  document.documentElement.innerHTML = `
    <head><title>Original title</title></head>
    <body>
      <form class="wForm">
        <div class="wFormHeader"></div>
        <h1 class="gform_title">Original form title</h1>
        <input id="submit_button" value="Original submit">
        <div id="tfa_387-HTML"></div>

        ${label("tfa_330-DB", "Original prefill 1")}
        ${label("tfa_330-DA", "Original prefill 2")}
        ${label("tfa_1-L", "Original first")}
        ${label("tfa_2-L", "Original last")}
        ${label("tfa_134-L", "Original DOB")}
        ${label("tfa_91-L", "Original preferred language")}
        ${label("tfa_388-L", "Original employer type")}
        ${label("tfa_32-L", "Original address")}
        ${label("tfa_32-HH", "Original address note")}
        ${label("tfa_34-L", "Original city")}
        ${label("tfa_35-L", "Original state")}
        ${label("tfa_39-L", "Original zip")}
        ${label("tfa_3-L", "Original email")}
        ${label("tfa_3-HH", "Original email note")}
        ${label("tfa_4-L", "Original phone")}
        ${label("tfa_4-HH", "Original phone note")}
        ${label("tfa_114-L", "Original SMS")}
        ${label("tfa_115-L", "Original SMS checkbox")}
        ${label("tfa_122-L", "Original political")}
        ${label("tfa_123-L", "Original political checkbox")}
        ${label("tfa_386-L", "Original signature")}
        ${label("tfa_386-HH", "Original signature note")}
        ${label("tfa_116-L", "Original membership title")}
        <input id="tfa_379-L" value="Membership legal value">
        ${label("tfa_355-L", "Original dues title")}
        <input id="tfa_380-L" value="Dues legal value">
        <input id="tfa_377" value="">
        <input id="tfa_116" type="checkbox">

        <select id="tfa_91">
          <option value="">Choose</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="Mandarin">Mandarin</option>
          <option value="French">French</option>
        </select>

        <input id="tfa_470" value="">
        <input id="tfa_388" value="">
        <input id="tfa_468" value="">

        <select id="tfa_156">
          <option>Original month</option>
        </select>

        <select id="tfa_157">
          <option>Original day</option>
        </select>

        <select id="tfa_158">
          <option>Original year</option>
        </select>

        <input id="tfa_113" value="">

        ${employerIds.map(id => input(id)).join("\n")}
        ${aidIds.map(id => input(id)).join("\n")}
        ${agencyIds.map(id => input(id)).join("\n")}

        ${input("tfa_442")}
        ${input("tfa_126")}
        ${input("tfa_444", employerPrefill)}
        ${input("tfa_469")}
      </form>
    </body>
  `;
}

async function loadMain(url = "https://example.test/") {
  const parsed = new URL(url);

  window.history.replaceState(
    {},
    "",
    `${parsed.pathname}${parsed.search}${parsed.hash}`
  );

  await import("./main.js");

  window.dispatchEvent(new Event("load"));
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.useRealTimers();

  buildDom();

  Object.defineProperty(window.navigator, "language", {
    configurable: true,
    value: "en-US"
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("main.js initialization", () => {
  it("uses lang and tmp1 query parameters and initializes helper modules", async () => {
    await loadMain("https://example.test/?lang=es&tmp1=hello+world");

    expect(document.documentElement.lang).toBe("es");
    expect(document.querySelector(".wForm").dataset.language).toBe("es");
    expect(document.getElementById("tfa_468").value).toBe("hello world");

    expect(initDateHelpers).toHaveBeenCalledWith(
      expect.objectContaining({
        mm_tfa: "tfa_156",
        dd_tfa: "tfa_157",
        yy_tfa: "tfa_158",
        dob_tfa: "tfa_113",
        monthPlaceholder: "Mes",
        dayPlaceholder: "Día",
        yearPlaceholder: "Año"
      })
    );

    expect(initEmployerType).toHaveBeenCalledOnce();
    expect(initValidation).toHaveBeenCalledOnce();

    expect(initPrefill).toHaveBeenCalledWith(
      expect.objectContaining({
        getLang: "es",
        detectedSupportedLang: true,
        LANGUAGE_CONFIG
      })
    );
  });

  it("falls back to the browser language when lang is absent", async () => {
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      value: "es-MX"
    });

    await loadMain();

    expect(document.documentElement.lang).toBe("es");
    expect(document.querySelector(".wForm").dataset.language).toBe("es");
  });

  it("stops safely when the form header is missing", async () => {
    document.querySelector(".wFormHeader").remove();

    await expect(loadMain()).resolves.toBeUndefined();

    expect(document.querySelector(".pickerWrap")).toBeNull();
    expect(initEmployerType).not.toHaveBeenCalled();
  });
});

describe("language UI and translations", () => {
  it("creates the language picker from LANGUAGE_CONFIG", async () => {
    await loadMain("https://example.test/?lang=es");

    const picker = document.getElementById("languagePicker");

    expect(picker).not.toBeNull();

    expect(
      [...picker.options].map(option => [
        option.value,
        option.textContent
      ])
    ).toEqual([
      ["en", "English"],
      ["es", "Español"],
      ["zh", "中文"]
    ]);

    expect(picker.value).toBe("es");
    expect(document.querySelector(".globeSVG svg")).not.toBeNull();
  });

  it("normalizes preferred-language option labels while preserving their English values", async () => {
    await loadMain();

    const options = [
      ...document.getElementById("tfa_91").options
    ];

    const spanish = options.find(
      option => option.dataset.englishValue === "Spanish"
    );

    const mandarin = options.find(
      option => option.dataset.englishValue === "Mandarin"
    );

    const french = options.find(
      option => option.dataset.englishValue === "French"
    );

    expect(spanish.textContent).toBe("Español");
    expect(mandarin.textContent).toBe("中文");
    expect(french.textContent).toBe("Français");
  });

  it("applies initial translations while preserving fallback text", async () => {
    await loadMain("https://example.test/?lang=es");

    expect(document.title).toBe("Únete");

    expect(
      document.querySelector(".gform_title").innerHTML
    ).toBe("Únete");

    expect(
      document.getElementById("submit_button").value
    ).toBe("Enviar");

    expect(
      document.getElementById("tfa_1-L").textContent
    ).toBe("Nombre");

    expect(
      document
        .getElementById("tfa_134-L")
        .classList.contains("reqMark")
    ).toBe(true);

    expect(
      document.getElementById("testWarning").textContent
    ).toContain("Solo para pruebas");
  });

  it("switches languages from the picker and dispatches languagechange details", async () => {
    await loadMain("https://example.test/?lang=en");

    const listener = vi.fn();

    document.addEventListener(
      "languagechange",
      listener
    );

    const picker = document.getElementById(
      "languagePicker"
    );

    picker.value = "es";

    picker.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );

    expect(document.documentElement.lang).toBe("es");

    expect(
      document.querySelector(".wForm").dataset.language
    ).toBe("es");

    expect(
      document.querySelector(".gform_title").innerHTML
    ).toBe("Únete");

    expect(
      document.getElementById("submit_button").value
    ).toBe("Enviar");

    expect(
      document.getElementById("tfa_91").value
    ).toBe("Spanish");

    expect(
      document.getElementById("tfa_156")
        .options[0].textContent
    ).toBe("Mes");

    expect(
      document.getElementById("tfa_157")
        .options[0].textContent
    ).toBe("Día");

    expect(
      document.getElementById("tfa_158")
        .options[0].textContent
    ).toBe("Año");

    expect(listener).toHaveBeenCalledOnce();

    expect(
      listener.mock.calls[0][0].detail
    ).toEqual({
      lang: "es",
      datePlaceholders: {
        month: "Mes",
        day: "Día",
        year: "Año"
      }
    });
  });

  it("switches the rendered language when the preferred-language field changes", async () => {
    await loadMain("https://example.test/?lang=en");

    const field =
      document.getElementById("tfa_91");

    field.value = "Mandarin";

    field.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );

    expect(
      document.documentElement.lang
    ).toBe("zh");

    expect(
      document.getElementById(
        "languagePicker"
      ).value
    ).toBe("zh");

    expect(
      document.getElementById("tfa_470").value
    ).toBe("zh");

    expect(field.value).toBe("Mandarin");
  });
});

describe("employer account field synchronization", () => {
  it("clears account fields immediately when an employer name is edited", async () => {
    await loadMain();

    aidIds.forEach((id, index) => {
      document.getElementById(id).value =
        `AID-${index}`;
    });

    agencyIds.forEach((id, index) => {
      document.getElementById(id).value =
        `AGENCY-${index}`;
    });

    document.getElementById(
      "tfa_442"
    ).value = "OLD-AID";

    document.getElementById(
      "tfa_126"
    ).value = "OLD-AGENCY";

    document
      .getElementById(employerIds[0])
      .dispatchEvent(
        new Event("input", {
          bubbles: true
        })
      );

    expect(
      aidIds.every(
        id =>
          document.getElementById(id).value === ""
      )
    ).toBe(true);

    expect(
      agencyIds.every(
        id =>
          document.getElementById(id).value === ""
      )
    ).toBe(true);

    expect(
      document.getElementById("tfa_442").value
    ).toBe("");

    expect(
      document.getElementById("tfa_126").value
    ).toBe("");
  });

  it("copies the first mapped AID and agency number after an employer changes", async () => {
    vi.useFakeTimers();

    await loadMain();

    document.getElementById(
      "tfa_432"
    ).value = "AID-123";

    document.getElementById(
      "tfa_453"
    ).value = "AGENCY-456";

    document
      .getElementById(employerIds[0])
      .dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );

    await vi.advanceTimersByTimeAsync(100);

    expect(
      document.getElementById("tfa_442").value
    ).toBe("AID-123");

    expect(
      document.getElementById("tfa_126").value
    ).toBe("AGENCY-456");
  });

  it("refreshes account calc fields on form submit", async () => {
    await loadMain();

    document.getElementById(
      "tfa_430"
    ).value = "AID-SUBMIT";

    document.getElementById(
      "tfa_449"
    ).value = "AGENCY-SUBMIT";

    document
      .querySelector("form")
      .dispatchEvent(
        new Event("submit", {
          bubbles: true,
          cancelable: true
        })
      );

    expect(
      document.getElementById("tfa_442").value
    ).toBe("AID-SUBMIT");

    expect(
      document.getElementById("tfa_126").value
    ).toBe("AGENCY-SUBMIT");
  });

  it("does not attach employer-sync behavior when employer data is prefilled", async () => {
    buildDom({
      employerPrefill: "Prefilled Employer"
    });

    await loadMain();

    document.getElementById(
      "tfa_430"
    ).value = "KEEP-AID";

    document.getElementById(
      "tfa_449"
    ).value = "KEEP-AGENCY";

    document
      .getElementById(employerIds[0])
      .dispatchEvent(
        new Event("input", {
          bubbles: true
        })
      );

    expect(
      document.getElementById("tfa_430").value
    ).toBe("KEEP-AID");

    expect(
      document.getElementById("tfa_449").value
    ).toBe("KEEP-AGENCY");
  });

  it("also treats an aId query parameter as prefilled employer data", async () => {
    await loadMain(
      "https://example.test/?aId=001xx000003ABC"
    );

    document.getElementById(
      "tfa_430"
    ).value = "KEEP-AID";

    document
      .getElementById(employerIds[0])
      .dispatchEvent(
        new Event("input", {
          bubbles: true
        })
      );

    expect(
      document.getElementById("tfa_430").value
    ).toBe("KEEP-AID");
  });
});

describe("encoded employer name", () => {
  it("URL-encodes the employer name on initialization, change, and submit", async () => {
    buildDom({
      employerPrefill: "OHA - Salem | OHA"
    });

    await loadMain();

    const employer =
      document.getElementById("tfa_444");

    const encoded =
      document.getElementById("tfa_469");

    expect(encoded.value).toBe(
      "OHA%20-%20Salem%20%7C%20OHA"
    );

    employer.value =
      "ACME & Sons / Portland";

    employer.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );

    expect(encoded.value).toBe(
      "ACME%20%26%20Sons%20%2F%20Portland"
    );

    employer.value = "Final Employer #1";

    document
      .querySelector("form")
      .dispatchEvent(
        new Event("submit", {
          bubbles: true,
          cancelable: true
        })
      );

    expect(encoded.value).toBe(
      "Final%20Employer%20%231"
    );
  });
});

describe("legal language", () => {
  it("writes combined legal language when the membership checkbox blurs", async () => {
    await loadMain();

    document
      .getElementById("tfa_116")
      .dispatchEvent(
        new Event("blur", {
          bubbles: false
        })
      );

    expect(
      document.getElementById("tfa_377").value
    ).toBe(
      "**Membership Authorization: Membership legal value • **Dues Authorization: Dues legal value"
    );
  });
});

describe("additional branch coverage", () => {
  it("handles a missing tmp1 query parameter", async () => {
    await loadMain("https://example.test/");

    expect(
      document.getElementById("tfa_468").value
    ).toBe("");
  });

  it("handles a query parameter with no assigned value", async () => {
    await loadMain(
      "https://example.test/?tmp1&lang=en"
    );

    expect(
      document.getElementById("tfa_468").value
    ).toBe("");
  });

  it("skips language config entries without a picker label", async () => {
    LANGUAGE_CONFIG.hidden = {
      pickerLabel: "",
      nativeLabel: "Hidden",
      preferredValues: ["Hidden"],
      renderLang: "hidden"
    };

    try {
      await loadMain();

      const values = [
        ...document.getElementById("languagePicker").options
      ].map(option => option.value);

      expect(values).not.toContain("hidden");
    } finally {
      delete LANGUAGE_CONFIG.hidden;
    }
  });

  it("rejects picker languages that are not in supportedLangs", async () => {
    LANGUAGE_CONFIG.fr = {
      pickerLabel: "Français",
      nativeLabel: "Français",
      preferredValues: ["French"],
      renderLang: "fr"
    };

    try {
      await loadMain(
        "https://example.test/?lang=en"
      );

      const picker =
        document.getElementById("languagePicker");

      expect(
        [...picker.options].some(
          option => option.value === "fr"
        )
      ).toBe(true);

      picker.value = "fr";

      picker.dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );

      // fr exists in LANGUAGE_CONFIG but not supportedLangs.
      expect(
        document.documentElement.lang
      ).toBe("en");
    } finally {
      delete LANGUAGE_CONFIG.fr;
    }
  });

  it("falls back to the original element text when a translation entry is missing", async () => {
    const original =
      translations.lastname;

    delete translations.lastname;

    try {
      await loadMain(
        "https://example.test/?lang=es"
      );

      expect(
        document.getElementById("tfa_2-L").textContent
      ).toBe("Original last");
    } finally {
      translations.lastname = original;
    }
  });

  it("falls back to original text when both requested and English translations are blank", async () => {
    const original =
      translations.firstname;

    translations.firstname = {
      en: "",
      es: ""
    };

    try {
      await loadMain(
        "https://example.test/?lang=es"
      );

      expect(
        document.getElementById("tfa_1-L").textContent
      ).toBe("Original first");
    } finally {
      translations.firstname = original;
    }
  });

  it("falls back to English when the requested translation is unavailable", async () => {
    await loadMain(
      "https://example.test/?lang=zh"
    );

    /*
     * The test translation map does not provide a zh
     * translation for formtitle, so English should win.
     */
    expect(document.title).toBe("Join");

    expect(
      document.querySelector(".gform_title").innerHTML
    ).toBe("Join");
  });

  it("continues when the form does not have the wForm class", async () => {
    document
      .querySelector(".wForm")
      .classList.remove("wForm");

    const callsBefore =
      initEmployerType.mock.calls.length;

    await loadMain();

    expect(
      document.getElementById("languagePicker")
    ).not.toBeNull();

    expect(
      initEmployerType.mock.calls.length
    ).toBeGreaterThan(callsBefore);
  });

  it("continues when optional translated DOM elements are absent", async () => {
    [
      "submit_button",
      "tfa_387-HTML",
      "tfa_134-L",
      "tfa_330-DB",
      "tfa_330-DA",
      "tfa_32-HH",
      "tfa_3-HH",
      "tfa_4-HH",
      "tfa_386-HH"
    ].forEach(id => {
      document.getElementById(id)?.remove();
    });

    await expect(
      loadMain("https://example.test/?lang=es")
    ).resolves.toBeUndefined();

    expect(
      document.documentElement.lang
    ).toBe("es");
  });

  it("continues when the preferred-language field is absent", async () => {
    document
      .getElementById("tfa_91")
      .remove();

    await loadMain();

    const picker =
      document.getElementById("languagePicker");

    picker.value = "es";

    expect(() => {
      picker.dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );
    }).not.toThrow();

    expect(
      document.documentElement.lang
    ).toBe("es");
  });

  it("falls back to English for an unmapped preferred-language option", async () => {
    await loadMain(
      "https://example.test/?lang=es"
    );

    const field =
      document.getElementById("tfa_91");

    const chooseOption =
      field.options[0];

    /*
     * normalizePreferredLanguagePicklist() assigns
     * an English value of "Choose", which does not
     * belong to any LANGUAGE_CONFIG entry.
     */
    field.value = chooseOption.value;

    field.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );

    expect(
      document.documentElement.lang
    ).toBe("en");

    expect(
      document.getElementById("tfa_470").value
    ).toBe("en");
  });

  it("uses option text when preferred-language englishValue metadata is absent", async () => {
    await loadMain(
      "https://example.test/?lang=es"
    );

    const field =
      document.getElementById("tfa_91");

    const englishOption =
      [...field.options].find(
        option =>
          option.dataset.englishValue === "English"
      );

    delete englishOption.dataset.englishValue;

    englishOption.textContent = "English";

    field.value =
      englishOption.value;

    field.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );

    expect(
      document.documentElement.lang
    ).toBe("en");
  });

  it("switches language even when no matching preferred-language option exists", async () => {
    const originalValues =
      LANGUAGE_CONFIG.es.preferredValues;

    LANGUAGE_CONFIG.es.preferredValues = [
      "Does Not Exist"
    ];

    try {
      await loadMain(
        "https://example.test/?lang=en"
      );

      const picker =
        document.getElementById("languagePicker");

      picker.value = "es";

      picker.dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );

      expect(
        document.documentElement.lang
      ).toBe("es");

      /*
       * No preferred-language option matched,
       * so the existing selection remains.
       */
      expect(
        document.getElementById("tfa_91").value
      ).toBe("");
    } finally {
      LANGUAGE_CONFIG.es.preferredValues =
        originalValues;
    }
  });

  it("handles missing date selectors during a language switch", async () => {
    document
      .getElementById("tfa_156")
      .remove();

    document
      .getElementById("tfa_157")
      .remove();

    document
      .getElementById("tfa_158")
      .remove();

    await loadMain(
      "https://example.test/?lang=en"
    );

    const picker =
      document.getElementById("languagePicker");

    picker.value = "es";

    expect(() => {
      picker.dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );
    }).not.toThrow();

    expect(
      document.documentElement.lang
    ).toBe("es");
  });

  it("handles missing AID and agency-number fields while clearing employer data", async () => {
    document
      .getElementById("tfa_430")
      .remove();

    document
      .getElementById("tfa_449")
      .remove();

    document
      .getElementById("tfa_442")
      .remove();

    document
      .getElementById("tfa_126")
      .remove();

    await loadMain();

    expect(() => {
      document
        .getElementById(employerIds[0])
        .dispatchEvent(
          new Event("input", {
            bubbles: true
          })
        );
    }).not.toThrow();
  });

  it("returns an empty account value when no mapped values are populated", async () => {
    await loadMain();

    document
      .querySelector("form")
      .dispatchEvent(
        new Event("submit", {
          bubbles: true,
          cancelable: true
        })
      );

    expect(
      document.getElementById("tfa_442").value
    ).toBe("");

    expect(
      document.getElementById("tfa_126").value
    ).toBe("");
  });

  it("skips empty mapped values and trims the first populated value", async () => {
    await loadMain();

    document.getElementById(
      "tfa_436"
    ).value = "   AID-SECOND   ";

    document.getElementById(
      "tfa_451"
    ).value = "   AGENCY-SECOND   ";

    document
      .querySelector("form")
      .dispatchEvent(
        new Event("submit", {
          bubbles: true,
          cancelable: true
        })
      );

    expect(
      document.getElementById("tfa_442").value
    ).toBe("AID-SECOND");

    expect(
      document.getElementById("tfa_126").value
    ).toBe("AGENCY-SECOND");
  });

  it("updates account fields after a typeahead selection", async () => {
    vi.useFakeTimers();

    await loadMain();

    document.getElementById(
      "tfa_434"
    ).value = "AID-TYPEAHEAD";

    document.getElementById(
      "tfa_455"
    ).value = "AGENCY-TYPEAHEAD";

    document
      .getElementById(employerIds[0])
      .dispatchEvent(
        new Event("typeahead:select", {
          bubbles: true
        })
      );

    await vi.advanceTimersByTimeAsync(100);

    expect(
      document.getElementById("tfa_442").value
    ).toBe("AID-TYPEAHEAD");

    expect(
      document.getElementById("tfa_126").value
    ).toBe("AGENCY-TYPEAHEAD");

    await vi.advanceTimersByTimeAsync(200);

    expect(
      document.getElementById("tfa_442").value
    ).toBe("AID-TYPEAHEAD");
  });

  it("does nothing when the encoded-employer destination field is missing", async () => {
    document
      .getElementById("tfa_469")
      .remove();

    await expect(
      loadMain()
    ).resolves.toBeUndefined();

    const employer =
      document.getElementById("tfa_444");

    employer.value = "Test Employer";

    expect(() => {
      employer.dispatchEvent(
        new Event("input", {
          bubbles: true
        })
      );
    }).not.toThrow();
  });

  it("preserves the original submit value across language changes", async () => {
    await loadMain(
      "https://example.test/?lang=en"
    );

    const button =
      document.getElementById("submit_button");

    expect(
      button.dataset.originalValue
    ).toBe("Original submit");

    const picker =
      document.getElementById("languagePicker");

    picker.value = "es";

    picker.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );

    expect(
      button.dataset.originalValue
    ).toBe("Original submit");

    expect(
      button.value
    ).toBe("Enviar");
  });
});