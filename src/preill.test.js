// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { initPrefill } from "./prefill.js";

const LANGUAGE_CONFIG = {
  en: {
    renderLang: "en",
    preferredValues: ["English"]
  },
  es: {
    renderLang: "es",
    preferredValues: ["Spanish"]
  },
  zh: {
    renderLang: "zh",
    preferredValues: ["Simplified Chinese", "Mandarin"]
  }
};

function field(id, value = "", extra = "") {
  return `
    <div class="oneField form-group" id="${id}-container">
      <div class="inputWrapper">
        <input id="${id}" value="${value}" ${extra}>
      </div>
    </div>
  `;
}

function selectField(id, options, selectedValue = "") {
  return `
    <div class="oneField form-group" id="${id}-container">
      <div class="inputWrapper">
        <select id="${id}">
          ${options
            .map(
              option => `
                <option
                  value="${option.value}"
                  ${
                    option.englishValue
                      ? `data-english-value="${option.englishValue}"`
                      : ""
                  }
                  ${
                    option.value === selectedValue
                      ? "selected"
                      : ""
                  }
                >
                  ${option.label}
                </option>
              `
            )
            .join("")}
        </select>
      </div>
    </div>
  `;
}

function buildDom({
  address = "",
  city = "",
  state = "",
  zip = "",
  email = "",
  phone = "",
  employerName = "",
  fullName = "",
  linkInfo = true
} = {}) {
  document.documentElement.innerHTML = `
    <head></head>
    <body>
      <form>
        ${field("tfa_32", address)}
        ${field("tfa_34", city)}
        ${field("tfa_35", state)}
        ${field("tfa_39", zip)}
        ${field("tfa_3", email)}
        ${field("tfa_4", phone)}
        ${field("tfa_444", employerName)}

        ${selectField(
          "tfa_91",
          [
            {
              value: "",
              label: "Choose"
            },
            {
              value: "English",
              label: "English",
              englishValue: "English"
            },
            {
              value: "Spanish",
              label: "Español",
              englishValue: "Spanish"
            },
            {
              value: "Mandarin",
              label: "中文",
              englishValue: "Mandarin"
            }
          ]
        )}

        <div id="tfa_400">
          <input
            id="tfa_388"
            name="tfa_388"
            class="required"
            required
            aria-required="true"
          >
        </div>

        <div class="oneField" id="hidden-required-container">
          <input
            id="hidden-required"
            class="required"
            required
            aria-required="true"
          >
        </div>

        <input
          type="hidden"
          name="tfa_switchedoff"
          value=""
        >

        <div id="tfa_114-D">
          Mobile alerts opt out
        </div>

        <input id="tfa_330" value="${fullName}">
        ${
          linkInfo
            ? `<div id="tfa_331"></div>`
            : ""
        }

        <input id="tfa_445" value="">
        <input id="tfa_442" value="">
        <input id="tfa_446" value="">
      </form>
    </body>
  `;
}

function init(overrides = {}) {
  const employerTypeInput =
    document.getElementById("tfa_388");

  const hiddenRequired = [
    document.getElementById("hidden-required")
  ];

  initPrefill({
    getLang: "en",
    detectedSupportedLang: false,
    employerTypeInput,
    hiddenRequired,
    LANGUAGE_CONFIG,
    ...overrides
  });
}

beforeEach(() => {
  vi.restoreAllMocks();

  buildDom();

  window.history.replaceState(
    {},
    "",
    "/"
  );
});

describe("address prefill handling", () => {
  it("hides the address group when address, city, and ZIP are all prefilled", () => {
    buildDom({
      address: "123 Main St",
      city: "Portland",
      state: "OR",
      zip: "97201"
    });

    init();

    ["tfa_32", "tfa_34", "tfa_35", "tfa_39"].forEach(id => {
      const el = document.getElementById(id);

      expect(el.dataset.prefilled).toBe("true");

      expect(
        document.getElementById(`${id}-container`).style.display
      ).toBe("none");
    });
  });

  it("does not require state to hide the address group", () => {
    buildDom({
      address: "123 Main St",
      city: "Portland",
      zip: "97201"
    });

    init();

    expect(
      document.getElementById("tfa_32").dataset.prefilled
    ).toBe("true");

    expect(
      document.getElementById("tfa_35").dataset.prefilled
    ).toBe("true");

    expect(
      document.getElementById("tfa_35-container").style.display
    ).toBe("none");
  });

  it("keeps the address group visible when city is missing", () => {
    buildDom({
      address: "123 Main St",
      state: "OR",
      zip: "97201"
    });

    init();

    ["tfa_32", "tfa_34", "tfa_35", "tfa_39"].forEach(id => {
      expect(
        document.getElementById(id).dataset.prefilled
      ).toBe("false");

      expect(
        document.getElementById(`${id}-container`).style.display
      ).not.toBe("none");
    });
  });

  it("keeps the address group visible when address is missing", () => {
    buildDom({
      city: "Portland",
      state: "OR",
      zip: "97201"
    });

    init();

    expect(
      document.getElementById("tfa_34").dataset.prefilled
    ).toBe("false");
  });

  it("keeps the address group visible when ZIP is missing", () => {
    buildDom({
      address: "123 Main St",
      city: "Portland",
      state: "OR"
    });

    init();

    expect(
      document.getElementById("tfa_32").dataset.prefilled
    ).toBe("false");
  });
});

describe("ordinary prefilled fields", () => {
  it("hides a prefilled email field", () => {
    buildDom({
      email: "person@example.org"
    });

    init();

    const email =
      document.getElementById("tfa_3");

    expect(email.dataset.prefilled).toBe("true");

    expect(
      document.getElementById("tfa_3-container").style.display
    ).toBe("none");
  });

  it("marks an empty email field as not prefilled", () => {
    buildDom();

    init();

    expect(
      document.getElementById("tfa_3").dataset.prefilled
    ).toBe("false");

    expect(
      document.getElementById("tfa_3-container").style.display
    ).not.toBe("none");
  });

  it("treats whitespace-only values as not prefilled", () => {
    buildDom({
      email: "   "
    });

    init();

    expect(
      document.getElementById("tfa_3").dataset.prefilled
    ).toBe("false");
  });
});

describe("phone prefill validation", () => {
  it("hides a valid 10-digit prefilled phone", () => {
    buildDom({
      phone: "5035551212"
    });

    init();

    const phone =
      document.getElementById("tfa_4");

    expect(phone.dataset.prefilled).toBe("true");

    expect(
      document.getElementById("tfa_4-container").style.display
    ).toBe("none");

    expect(
      document.getElementById("tfa_114-D").style.display
    ).toBe("none");
  });

  it("accepts punctuation in a valid 10-digit phone", () => {
    buildDom({
      phone: "(503) 555-1212"
    });

    init();

    expect(
      document.getElementById("tfa_4").dataset.prefilled
    ).toBe("true");

    expect(
      document.getElementById("tfa_4-container").style.display
    ).toBe("none");
  });

  it("shows an invalid prefilled phone with an inline error", () => {
    buildDom({
      phone: "503-555"
    });

    init();

    const phone =
      document.getElementById("tfa_4");

    const container =
      document.getElementById("tfa_4-container");

    expect(phone.dataset.prefilled).toBe("false");

    expect(container.style.display).not.toBe("none");

    expect(container.classList.contains("errFld")).toBe(true);

    expect(
      container.classList.contains("tfa-inline-error-present")
    ).toBe(true);

    expect(
      phone.getAttribute("aria-invalid")
    ).toBe("true");

    expect(
      container.querySelector(".errMsg")?.textContent
    ).toBe("Please enter a valid phone number");

    expect(
      document.getElementById("tfa_114-D").style.display
    ).not.toBe("none");
  });

  it("does not accept an 11-digit phone beginning with 1", () => {
    buildDom({
      phone: "1-503-555-1212"
    });

    init();

    expect(
      document.getElementById("tfa_4").getAttribute("aria-invalid")
    ).toBe("true");
  });

  it("clears an invalid-phone error as soon as input becomes valid", () => {
    buildDom({
      phone: "503"
    });

    init();

    const phone =
      document.getElementById("tfa_4");

    const container =
      document.getElementById("tfa_4-container");

    expect(
      container.querySelector(".errMsg")
    ).not.toBeNull();

    phone.value = "5035551212";

    phone.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );

    expect(
      container.querySelector(".errMsg")
    ).toBeNull();

    expect(
      phone.hasAttribute("aria-invalid")
    ).toBe(false);

    expect(
      container.classList.contains("errFld")
    ).toBe(false);
  });

  it("restores an error on blur if the phone is still invalid", () => {
    buildDom({
      phone: "503"
    });

    init();

    const phone =
      document.getElementById("tfa_4");

    const container =
      document.getElementById("tfa_4-container");

    const oldError =
      container.querySelector(".errMsg");

    oldError?.remove();

    container.classList.remove(
      "errFld",
      "tfa-inline-error-present"
    );

    phone.removeAttribute("aria-invalid");

    phone.dispatchEvent(
      new Event("blur")
    );

    expect(
      container.querySelector(".errMsg")?.textContent
    ).toBe("Please enter a valid phone number");

    expect(
      phone.getAttribute("aria-invalid")
    ).toBe("true");
  });

  it("clears the error on blur when the corrected phone is valid", () => {
    buildDom({
      phone: "503"
    });

    init();

    const phone =
      document.getElementById("tfa_4");

    const container =
      document.getElementById("tfa_4-container");

    phone.value = "5035551212";

    phone.dispatchEvent(
      new Event("blur")
    );

    expect(
      container.querySelector(".errMsg")
    ).toBeNull();

    expect(
      phone.hasAttribute("aria-invalid")
    ).toBe(false);
  });

  it("does not show an error for an empty phone", () => {
    buildDom({
      phone: ""
    });

    init();

    expect(
      document.getElementById("tfa_4-container")
        .querySelector(".errMsg")
    ).toBeNull();
  });
});

describe("preferred-language prefill", () => {
  it("keeps preferred language visible and required when the detected language is unsupported", () => {
    buildDom();

    init({
      getLang: "fr",
      detectedSupportedLang: false
    });

    const field =
      document.getElementById("tfa_91");

    expect(field.dataset.prefilled).toBe("false");
    expect(field.required).toBe(true);

    expect(
      field.getAttribute("aria-required")
    ).toBe("true");

    expect(
      document.getElementById("tfa_91-container").style.display
    ).not.toBe("none");
  });

  it("selects and hides the matching preferred language for a supported language", () => {
    buildDom();

    const field =
      document.getElementById("tfa_91");

    const inputListener = vi.fn();
    const changeListener = vi.fn();

    field.addEventListener(
      "input",
      inputListener
    );

    field.addEventListener(
      "change",
      changeListener
    );

    init({
      getLang: "es",
      detectedSupportedLang: true
    });

    expect(field.value).toBe("Spanish");
    expect(field.dataset.prefilled).toBe("true");

    expect(
      document.getElementById("tfa_91-container").style.display
    ).toBe("none");

    expect(inputListener).toHaveBeenCalledOnce();
    expect(changeListener).toHaveBeenCalledOnce();
  });

  it("matches options using data-english-value", () => {
    buildDom();

    init({
      getLang: "zh",
      detectedSupportedLang: true
    });

    expect(
      document.getElementById("tfa_91").value
    ).toBe("Mandarin");
  });

  it("leaves preferred language visible when no matching option exists", () => {
    buildDom();

    init({
      getLang: "xx",
      detectedSupportedLang: true,
      LANGUAGE_CONFIG: {
        xx: {
          renderLang: "xx",
          preferredValues: ["Does Not Exist"]
        }
      }
    });

    const field =
      document.getElementById("tfa_91");

    expect(field.dataset.prefilled).toBe("false");

    expect(
      document.getElementById("tfa_91-container").style.display
    ).not.toBe("none");
  });
});

describe("employer prefill", () => {
  it("disables employer-type inputs when employer name is prefilled", () => {
    buildDom({
      employerName: "OHA - Salem"
    });

    init();

    const employer =
      document.getElementById("tfa_444");

    const employerType =
      document.getElementById("tfa_388");

    expect(employer.dataset.prefilled).toBe("true");

    expect(
      document.getElementById("tfa_400").style.display
    ).toBe("none");

    expect(employerType.disabled).toBe(true);
    expect(employerType.required).toBe(false);

    expect(
      employerType.classList.contains("required")
    ).toBe(false);

    expect(
      employerType.getAttribute("aria-required")
    ).toBe("false");
  });

  it("disables and hides hidden required fields when employer is prefilled", () => {
    buildDom({
      employerName: "OHA - Salem"
    });

    init();

    const hidden =
      document.getElementById("hidden-required");

    expect(hidden.disabled).toBe(true);
    expect(hidden.required).toBe(false);

    expect(
      hidden.classList.contains("required")
    ).toBe(false);

    expect(
      hidden.getAttribute("aria-required")
    ).toBe("false");

    expect(
      document.getElementById(
        "hidden-required-container"
      ).style.display
    ).toBe("none");
  });

  it("adds tfa_388 to the switched-off field list", () => {
    buildDom({
      employerName: "OHA - Salem"
    });

    init();

    const switchedOff =
      document.querySelector(
        'input[name="tfa_switchedoff"]'
      );

    expect(switchedOff.value).toBe("tfa_388");
  });

  it("does not duplicate tfa_388 in the switched-off field list", () => {
    buildDom({
      employerName: "OHA - Salem"
    });

    document.querySelector(
      'input[name="tfa_switchedoff"]'
    ).value = "tfa_100,tfa_388";

    init();

    expect(
      document.querySelector(
        'input[name="tfa_switchedoff"]'
      ).value
    ).toBe("tfa_100,tfa_388");
  });

  it("does not alter employer requirements when employer is empty", () => {
    buildDom();

    init();

    const employerType =
      document.getElementById("tfa_388");

    expect(employerType.disabled).toBe(false);
    expect(employerType.required).toBe(true);

    expect(
      document.getElementById("tfa_400").style.display
    ).not.toBe("none");
  });
});

describe("prefill modal", () => {
  it("returns safely when the modal source fields are missing", () => {
    buildDom({
      fullName: "",
      linkInfo: false
    });

    expect(() => init()).not.toThrow();

    expect(
      document.getElementById("hiddenButton")
    ).toBeNull();
  });

  it("creates the modal wrapper and moves existing body content into it", () => {
    buildDom({
      fullName: "Jane Doe"
    });

    init();

    const modalPage =
      document.getElementById("js-modal-page");

    expect(modalPage).not.toBeNull();

    expect(
      modalPage.querySelector("#tfa_330")
    ).not.toBeNull();

    expect(
      document.body.firstElementChild?.id
    ).toBe("hiddenButton");
  });

  it("creates an English hidden modal button", () => {
    buildDom({
      fullName: "Jane Doe"
    });

    init({
      getLang: "en"
    });

    const button =
      document.getElementById("hiddenButton");

    expect(
      button.getAttribute("data-modal-prefix-class")
    ).toBe("simple-animated");

    expect(
      button.getAttribute("data-modal-content-id")
    ).toBe("tfa_327");

    expect(
      button.getAttribute("data-modal-title")
    ).toBe("Are you Jane Doe?");

    expect(
      button.getAttribute("data-modal-close-text")
    ).toBe("Yes, I'm Jane Doe");

    expect(
      button.classList.contains("js-modal")
    ).toBe(true);

    expect(
      button.classList.contains("invisible")
    ).toBe(true);
  });

  it("localizes the modal in Spanish", () => {
    buildDom({
      fullName: "María López"
    });

    init({
      getLang: "es",
      detectedSupportedLang: true
    });

    const button =
      document.getElementById("hiddenButton");

    expect(
      button.getAttribute("data-modal-title")
    ).toBe("¿Es Ud. María López?");

    expect(
      button.getAttribute("data-modal-close-text")
    ).toBe("Sí, soy María López");

    expect(
      document.querySelector(".not-me-button").textContent
    ).toContain("No soy María López");
  });

  it("uses LANGUAGE_CONFIG renderLang for modal localization", () => {
    buildDom({
      fullName: "María López"
    });

    init({
      getLang: "custom",
      detectedSupportedLang: true,
      LANGUAGE_CONFIG: {
        custom: {
          renderLang: "es",
          preferredValues: []
        }
      }
    });

    expect(
      document
        .getElementById("hiddenButton")
        .getAttribute("data-modal-title")
    ).toBe("¿Es Ud. María López?");
  });

  it("falls back to English modal text for an unknown render language", () => {
    buildDom({
      fullName: "Jane Doe"
    });

    init({
      getLang: "xx",
      LANGUAGE_CONFIG: {
        xx: {
          renderLang: "xx",
          preferredValues: []
        }
      }
    });

    expect(
      document
        .getElementById("hiddenButton")
        .getAttribute("data-modal-title")
    ).toBe("Are you Jane Doe?");
  });

  it("truncates the full name used in modal text to 40 characters", () => {
    const longName =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ 12345678901234567890";

    buildDom({
      fullName: longName
    });

    init();

    const expected =
      longName.substring(0, 40);

    expect(
      document
        .getElementById("hiddenButton")
        .getAttribute("data-modal-title")
    ).toBe(`Are you ${expected}?`);
  });

  it("copies cId, aId, and src query parameters into hidden fields", () => {
    buildDom({
      fullName: "Jane Doe"
    });

    window.history.replaceState(
      {},
      "",
      "/?cId=003ABC&aId=001XYZ&src=Newsletter"
    );

    init();

    expect(
      document.getElementById("tfa_445").value
    ).toBe("003ABC");

    expect(
      document.getElementById("tfa_442").value
    ).toBe("001XYZ");

    expect(
      document.getElementById("tfa_446").value
    ).toBe("Newsletter");
  });

  it("uses the default source when src is absent", () => {
    buildDom({
      fullName: "Jane Doe"
    });

    window.history.replaceState(
      {},
      "",
      "/?cId=003ABC&aId=001XYZ"
    );

    init();

    expect(
      document.getElementById("tfa_446").value
    ).toBe("Direct seiu503signup FA");
  });

  it("does not overwrite cId or aId hidden fields when parameters are absent", () => {
    buildDom({
      fullName: "Jane Doe"
    });

    document.getElementById(
      "tfa_445"
    ).value = "existing-contact";

    document.getElementById(
      "tfa_442"
    ).value = "existing-account";

    init();

    expect(
      document.getElementById("tfa_445").value
    ).toBe("existing-contact");

    expect(
      document.getElementById("tfa_442").value
    ).toBe("existing-account");
  });

  it("clicks the hidden modal launcher when cId, aId, and full name exist", () => {
    buildDom({
      fullName: "Jane Doe"
    });

    window.history.replaceState(
      {},
      "",
      "/?cId=003ABC&aId=001XYZ"
    );

    const clickSpy =
      vi.spyOn(
        HTMLButtonElement.prototype,
        "click"
      );

    init();

    expect(clickSpy).toHaveBeenCalled();
  });

  it("does not launch the modal if cId is missing", () => {
    buildDom({
      fullName: "Jane Doe"
    });

    window.history.replaceState(
      {},
      "",
      "/?aId=001XYZ"
    );

    const clickSpy =
      vi.spyOn(
        HTMLButtonElement.prototype,
        "click"
      );

    init();

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it("does not launch the modal if aId is missing", () => {
    buildDom({
      fullName: "Jane Doe"
    });

    window.history.replaceState(
      {},
      "",
      "/?cId=003ABC"
    );

    const clickSpy =
      vi.spyOn(
        HTMLButtonElement.prototype,
        "click"
      );

    init();

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it("creates the not-me button", () => {
    buildDom({
      fullName: "Jane Doe"
    });

    init();

    const button =
      document.querySelector(".not-me-button");

    expect(button).not.toBeNull();

    expect(button.type).toBe("button");

    expect(button.textContent).toContain(
      "I'm not Jane Doe"
    );
  });
});

describe("initPrefill error isolation", () => {
  it("does not throw if initialization encounters missing optional elements", () => {
    document.documentElement.innerHTML = `
      <head></head>
      <body></body>
    `;

    expect(() => {
      initPrefill({
        getLang: "en",
        detectedSupportedLang: false,
        employerTypeInput: null,
        hiddenRequired: [],
        LANGUAGE_CONFIG
      });
    }).not.toThrow();
  });
});

describe("additional prefill branch coverage", () => {
  it("continues when the preferred-language field does not exist", () => {
    document
      .getElementById("tfa_91")
      .remove();

    expect(() => {
      init({
        detectedSupportedLang: true,
        getLang: "es"
      });
    }).not.toThrow();
  });

  it("uses the field parent when no recognized FormAssembly container exists", () => {
    buildDom({
      email: "person@example.org"
    });

    const container =
      document.getElementById("tfa_3-container");

    container.className = "";

    init();

    const inputWrapper =
      document
        .getElementById("tfa_3")
        .parentNode;

    /*
     * getFieldContainer() falls back to field.parentNode
     * when none of its recognized containers exists.
     */
    expect(
      inputWrapper.style.display
    ).toBe("none");
  });

  it("reuses an existing errorMessage element for invalid phone validation", () => {
    buildDom({
      phone: "503"
    });

    const container =
      document.getElementById("tfa_4-container");

    const existingError =
      document.createElement("div");

    existingError.className =
      "errorMessage";

    existingError.textContent =
      "Old error";

    container.appendChild(
      existingError
    );

    init();

    expect(
      container.querySelector(".errorMessage")
    ).toBe(existingError);

    expect(
      existingError.textContent
    ).toBe(
      "Please enter a valid phone number"
    );

    expect(
      container.querySelector(".errMsg")
    ).toBeNull();
  });

  it("handles a missing mobile-alert element for a valid prefilled phone", () => {
    buildDom({
      phone: "5035551212"
    });

    document
      .getElementById("tfa_114-D")
      .remove();

    expect(() => {
      init();
    }).not.toThrow();

    expect(
      document.getElementById("tfa_4").dataset.prefilled
    ).toBe("true");
  });

  it("handles a missing mobile-alert element for an invalid prefilled phone", () => {
    buildDom({
      phone: "503"
    });

    document
      .getElementById("tfa_114-D")
      .remove();

    expect(() => {
      init();
    }).not.toThrow();

    expect(
      document
        .getElementById("tfa_4")
        .getAttribute("aria-invalid")
    ).toBe("true");
  });

  it("handles employer prefill without an employer-type container or input", () => {
    buildDom({
      employerName: "OHA - Salem"
    });

    document
      .getElementById("tfa_400")
      .remove();

    expect(() => {
      initPrefill({
        getLang: "en",
        detectedSupportedLang: false,
        employerTypeInput: null,
        hiddenRequired: [
          null,
          document.getElementById(
            "hidden-required"
          )
        ],
        LANGUAGE_CONFIG
      });
    }).not.toThrow();

    expect(
      document
        .getElementById("hidden-required")
        .disabled
    ).toBe(true);
  });

  it("handles employer prefill when the switched-off hidden field is absent", () => {
    buildDom({
      employerName: "OHA - Salem"
    });

    document
      .querySelector(
        'input[name="tfa_switchedoff"]'
      )
      .remove();

    expect(() => {
      init();
    }).not.toThrow();
  });

  it("matches preferred language using option text when englishValue metadata is absent", () => {
    buildDom();

    const field =
      document.getElementById("tfa_91");

    const spanish =
      [...field.options].find(
        option => option.value === "Spanish"
      );

    delete spanish.dataset.englishValue;

    spanish.textContent = "Spanish";

    init({
      getLang: "es",
      detectedSupportedLang: true
    });

    expect(
      field.value
    ).toBe("Spanish");

    expect(
      field.dataset.prefilled
    ).toBe("true");
  });

  it("matches preferred language using option value when both metadata and text are empty", () => {
    buildDom();

    const field =
      document.getElementById("tfa_91");

    const spanish =
      [...field.options].find(
        option => option.value === "Spanish"
      );

    delete spanish.dataset.englishValue;

    spanish.textContent = "";

    init({
      getLang: "es",
      detectedSupportedLang: true
    });

    expect(
      field.value
    ).toBe("Spanish");

    expect(
      field.dataset.prefilled
    ).toBe("true");
  });

  it("does not recreate js-modal-page when one already exists", () => {
    buildDom({
      fullName: "Jane Doe"
    });

    const existing =
      document.createElement("div");

    existing.id =
      "js-modal-page";

    document.body.appendChild(
      existing
    );

    init();

    expect(
      document.querySelectorAll(
        "#js-modal-page"
      )
    ).toHaveLength(1);

    expect(
      document.getElementById(
        "js-modal-page"
      )
    ).toBe(existing);
  });

  it("ignores unrelated document clicks after modal initialization", () => {
    buildDom({
      fullName: "Jane Doe"
    });

    init();

    const event =
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true
      });

    document.body.dispatchEvent(
      event
    );

    expect(
      event.defaultPrevented
    ).toBe(false);
  });

  it("prevents the default action when the not-me button is clicked", () => {
    buildDom({
      fullName: "Jane Doe"
    });

    init();

    const button =
      document.querySelector(
        ".not-me-button"
      );

    const event =
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true
      });

    /*
     * jsdom does not perform full browser navigation.
     * The useful behavior to assert here is that the
     * handler recognizes the button and cancels its
     * normal action.
     */
    button.dispatchEvent(
      event
    );

    expect(
      event.defaultPrevented
    ).toBe(true);
  });

  it("handles URL parameters whose target hidden field is absent", () => {
    buildDom({
      fullName: "Jane Doe"
    });

    document
      .getElementById("tfa_445")
      .remove();

    window.history.replaceState(
      {},
      "",
      "/?cId=003ABC"
    );

    expect(() => {
      init();
    }).not.toThrow();
  });

  it("isolates failures in both prefill initialization sections", () => {
    buildDom({
      fullName: "Jane Doe"
    });

    const errorSpy =
      vi.spyOn(
        console,
        "error"
      ).mockImplementation(() => {});

    const throwingConfig =
      new Proxy(
        {},
        {
          get() {
            throw new Error(
              "test config error"
            );
          }
        }
      );

    expect(() => {
      initPrefill({
        getLang: "en",
        detectedSupportedLang: true,
        employerTypeInput:
          document.getElementById("tfa_388"),
        hiddenRequired: [],
        LANGUAGE_CONFIG:
          throwingConfig
      });
    }).not.toThrow();

    expect(
      errorSpy
    ).toHaveBeenCalledWith(
      "initPrefilledFields failed:",
      expect.any(Error)
    );

    expect(
      errorSpy
    ).toHaveBeenCalledWith(
      "initPrefillModal failed:",
      expect.any(Error)
    );

    errorSpy.mockRestore();
  });
});