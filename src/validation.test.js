// @vitest-environment jsdom

import {
  beforeAll,
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

function buildDom({
  htmlLang = "en",
  bodyLang = "",
  bodyDatasetLang = ""
} = {}) {
  document.documentElement.innerHTML = `
    <head></head>
    <body
      ${bodyLang ? `lang="${bodyLang}"` : ""}
      ${bodyDatasetLang ? `data-lang="${bodyDatasetLang}"` : ""}
    >
      <form id="test-form">
        <div class="errMsg" id="error-1">
          This field is required.
        </div>

        <div class="errMsg" id="error-2">
          This does not appear to be a valid email address.
        </div>

        <div class="errMsg" id="error-3">
          Please enter a valid 5-digit ZIP code
        </div>

        <div class="errMsg" id="error-4">
          This does not appear to be a valid date.
        </div>

        <div class="errMsg" id="error-5">
          Please enter a valid phone number
        </div>

        <div class="errMsg" id="error-6">
          This date must be between 01/01/1900 and 01/01/2026
        </div>

        <input
          id="submit-input"
          type="submit"
          value="Please wait..."
        >

        <button
          id="submit-button"
          type="submit"
        >
          Please wait...
        </button>
      </form>
    </body>
  `;

  document.documentElement.lang = htmlLang;
}

let validationModule;
let nativeAlertSpy;
let patchedAlert;

async function loadValidation() {
  return validationModule;
}

beforeAll(async () => {
  delete window.__faLocalizedAlertPatched;
  delete window.__faErrorObserverInstalled;

  nativeAlertSpy = vi.fn();
  window.alert = nativeAlertSpy;

  validationModule = await import("./validation.js");

  patchedAlert = window.alert;
});

beforeEach(async () => {
  vi.useFakeTimers();

  /*
   * Reset validation.js's persistent language state BEFORE
   * rebuilding the DOM.
   *
   * validation.js installs a MutationObserver once for the
   * lifetime of the page. Without this reset, rebuilding the
   * DOM can cause the new English messages to be translated
   * using the previous test's language before the current
   * test calls initValidation().
   */
  validationModule.initValidation({
    getLang: "en"
  });

  window.history.replaceState(
    {},
    "",
    "/"
  );

  buildDom();

  /*
   * Let the MutationObserver process the DOM replacement while
   * the active language is still English.
   */
  await Promise.resolve();
  await Promise.resolve();

  nativeAlertSpy.mockClear();

  window.alert = patchedAlert;
});

afterEach(async () => {
  /*
   * Return the module to English before the next test.
   */
  validationModule.initValidation({
    getLang: "en"
  });

  await Promise.resolve();

  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("initValidation", () => {
  it("leaves English validation messages unchanged", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      formEl: document.getElementById("test-form"),
      getLang: () => "en"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe("This field is required.");

    expect(
      document.getElementById("error-2").textContent.trim()
    ).toBe(
      "This does not appear to be a valid email address."
    );
  });

  it("accepts getLang as a function", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      formEl: document.getElementById("test-form"),
      getLang: () => "es"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe("Requerido");
  });

  it("accepts getLang as a string", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      formEl: document.getElementById("test-form"),
      getLang: "es"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe("Requerido");
  });
});

describe("Spanish validation translation", () => {
  it("translates all supported validation messages", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "es"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe("Requerido");

    expect(
      document.getElementById("error-2").textContent.trim()
    ).toBe(
      "Dirección de correo electrónico no válida"
    );

    expect(
      document.getElementById("error-3").textContent.trim()
    ).toBe(
      "Ingrese un código postal válido de 5 dígitos"
    );

    expect(
      document.getElementById("error-4").textContent.trim()
    ).toBe(
      "Ingrese una fecha válida."
    );

    expect(
      document.getElementById("error-5").textContent.trim()
    ).toBe(
      "Ingrese un número de teléfono válido"
    );

    expect(
      document.getElementById("error-6").textContent.trim()
    ).toContain(
      "La fecha debe ser entre"
    );

    expect(
      document.getElementById("error-6").textContent.trim()
    ).toContain(
      "01/01/1900 and 01/01/2026"
    );
  });
});

describe("Russian validation translation", () => {
  it("translates validation messages into Russian", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "ru"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe(
      "Это поле обязательно."
    );

    expect(
      document.getElementById("error-5").textContent.trim()
    ).toBe(
      "Введите действительный номер телефона"
    );
  });
});

describe("Vietnamese validation translation", () => {
  it("translates validation messages into Vietnamese", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "vi"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe(
      "Trường này là bắt buộc."
    );

    expect(
      document.getElementById("error-2").textContent.trim()
    ).toBe(
      "Địa chỉ email này không hợp lệ."
    );
  });
});

describe("Chinese validation translation", () => {
  it("translates validation messages into Chinese", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "zh"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe(
      "此字段为必填项。"
    );

    expect(
      document.getElementById("error-5").textContent.trim()
    ).toBe(
      "请输入有效的电话号码"
    );
  });
});

describe("Arabic validation translation", () => {
  it("translates validation messages into Arabic", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "ar"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe(
      "هذا الحقل مطلوب."
    );

    expect(
      document.getElementById("error-3").textContent.trim()
    ).toBe(
      "يرجى إدخال رمز بريدي صالح مكون من 5 أرقام"
    );
  });
});

describe("Somali validation translation", () => {
  it("translates validation messages into Somali", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "so"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe(
      "Goobtan waa qasab."
    );

    expect(
      document.getElementById("error-4").textContent.trim()
    ).toBe(
      "Tani uma muuqato taariikh sax ah."
    );
  });
});

describe("language detection fallback", () => {
  it("uses document.documentElement.lang when getLang returns English", async () => {
    buildDom({
      htmlLang: "es"
    });

    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: () => "en"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe("Requerido");
  });

  it("uses body lang when html lang is English", async () => {
    buildDom({
      htmlLang: "en",
      bodyLang: "vi"
    });

    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: () => "en"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe(
      "Trường này là bắt buộc."
    );
  });

  it("uses body data-lang as a fallback", async () => {
    buildDom({
      htmlLang: "en",
      bodyDatasetLang: "ru"
    });

    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: () => "en"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe(
      "Это поле обязательно."
    );
  });

  it("uses the lang query parameter as a fallback", async () => {
    buildDom({
      htmlLang: "en"
    });

    window.history.replaceState(
      {},
      "",
      "/?lang=es"
    );

    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: () => "en"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe("Requerido");
  });

  it("uses the language query parameter as a fallback", async () => {
    buildDom({
      htmlLang: "en"
    });

    window.history.replaceState(
      {},
      "",
      "/?language=zh"
    );

    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: () => "en"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe(
      "此字段为必填项。"
    );
  });

  it("reduces regional language codes to their base language", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "es-MX"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe("Requerido");
  });

  it("does nothing for an unsupported language", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "fr"
    });

    expect(
      document.getElementById("error-1").textContent.trim()
    ).toBe(
      "This field is required."
    );
  });
});

describe("submit button localization", () => {
  it("translates an input submit button containing Please wait", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "es"
    });

    expect(
      document.getElementById("submit-input").value
    ).toBe("Espere...");
  });

  it("translates a button element containing Please wait", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "vi"
    });

    expect(
      document.getElementById("submit-button").textContent.trim()
    ).toBe(
      "Vui lòng chờ..."
    );
  });

  it("does not change unrelated submit-button text", async () => {
    document.getElementById(
      "submit-input"
    ).value = "Submit";

    document.getElementById(
      "submit-button"
    ).textContent = "Continue";

    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "es"
    });

    expect(
      document.getElementById("submit-input").value
    ).toBe("Submit");

    expect(
      document.getElementById("submit-button").textContent
    ).toBe("Continue");
  });
});

describe("FormAssembly alert localization", () => {
  it("translates a singular FormAssembly alert", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "es"
    });

    window.alert(
      "The form is not complete and has not been submitted yet. There is 1 problem with your submission."
    );

    expect(nativeAlertSpy).toHaveBeenCalledWith(
      "El formulario no está completo y aún no se ha enviado. Hay 1 problema con su envío."
    );
  });

  it("translates a plural FormAssembly alert", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "es"
    });

    window.alert(
      "The form is not complete and has not been submitted yet. There are 3 problems with your submission."
    );

    expect(nativeAlertSpy).toHaveBeenCalledWith(
      "El formulario no está completo y aún no se ha enviado. Hay 3 problemas con su envío."
    );
  });

  it("passes unrelated alerts through unchanged", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "es"
    });

    window.alert(
      "Something else happened."
    );

    expect(nativeAlertSpy).toHaveBeenCalledWith(
      "Something else happened."
    );
  });

  it("passes FormAssembly alerts through unchanged in English", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "en"
    });

    const message =
      "The form is not complete and has not been submitted yet. There are 2 problems with your submission.";

    window.alert(message);

    expect(nativeAlertSpy).toHaveBeenCalledWith(
      message
    );
  });
});

describe("MutationObserver translation", () => {
  it("translates validation messages inserted after initialization", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "es"
    });

    const newError =
      document.createElement("div");

    newError.className = "errMsg";

    newError.textContent =
      "Please enter a valid phone number";

    document.body.appendChild(
      newError
    );

    await vi.runAllTimersAsync();

    await Promise.resolve();
    await Promise.resolve();

    expect(
      newError.textContent
    ).toBe(
      "Ingrese un número de teléfono válido"
    );
  });

  it("translates changed error text after initialization", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "es"
    });

    const error =
      document.getElementById("error-1");

    error.textContent =
      "Please enter a valid phone number";

    await Promise.resolve();
    await Promise.resolve();

    expect(
      error.textContent
    ).toBe(
      "Ingrese un número de teléfono válido"
    );
  });
});

describe("submit-triggered translations", () => {
  it("reruns translations after form submission", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "es"
    });

    const error =
      document.getElementById("error-1");

    error.textContent =
      "Please enter a valid phone number";

    document
      .getElementById("test-form")
      .dispatchEvent(
        new Event("submit", {
          bubbles: true,
          cancelable: true
        })
      );

    await vi.advanceTimersByTimeAsync(1000);

    expect(
      error.textContent
    ).toBe(
      "Ingrese un número de teléfono válido"
    );
  });

  it("reruns submit-button localization after form submission", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "es"
    });

    const button =
      document.getElementById("submit-input");

    button.value =
      "Please wait...";

    document
      .getElementById("test-form")
      .dispatchEvent(
        new Event("submit", {
          bubbles: true,
          cancelable: true
        })
      );

    await vi.advanceTimersByTimeAsync(1000);

    expect(button.value).toBe(
      "Espere..."
    );
  });
});

describe("click-triggered translations", () => {
  it("reruns validation translation after a click", async () => {
    const { initValidation } =
      await loadValidation();

    initValidation({
      getLang: "vi"
    });

    const error =
      document.getElementById("error-1");

    error.textContent =
      "Please enter a valid phone number";

    document.body.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true
      })
    );

    await vi.advanceTimersByTimeAsync(250);

    expect(
      error.textContent
    ).toBe(
      "Vui lòng nhập số điện thoại hợp lệ"
    );
  });
});

describe("import-time installation", () => {
  it("patches window.alert when the module loads", () => {
    expect(
      window.__faLocalizedAlertPatched
    ).toBe(true);

    expect(patchedAlert).not.toBe(
      nativeAlertSpy
    );
  });

  it("installs the FormAssembly error observer when the module loads", () => {
    expect(
      window.__faErrorObserverInstalled
    ).toBe(true);
  });
});