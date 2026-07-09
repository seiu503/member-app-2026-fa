// validation_cape.js

console.log("validation_cape.js loaded");


const i18n = {
  es: {
    pleaseWait: "Espere...",
    alert: n =>
      `El formulario no está completo y aún no se ha enviado. Hay ${n} problema${n === 1 ? "" : "s"} con su envío.`,
    messages: {
      "This field is required.": "Requerido",
      "This does not appear to be a valid email address.": "Dirección de correo electrónico no válida",
      "Please enter a valid 5-digit ZIP code": "Ingrese un código postal válido de 5 dígitos",
      "This does not appear to be a valid date.": "Ingrese una fecha válida.",
      "Please enter a valid phone number": "Ingrese un número de teléfono válido",
      "This date must be between": "La fecha debe ser entre"
    }
  },

  ru: {
    pleaseWait: "Пожалуйста, подождите...",
    alert: n =>
      `Форма не заполнена и еще не отправлена. Количество проблем: ${n}.`,
    messages: {
      "This field is required.": "Это поле обязательно.",
      "This does not appear to be a valid email address.": "Похоже, это недействительный адрес электронной почты.",
      "Please enter a valid 5-digit ZIP code": "Введите действительный 5-значный почтовый индекс",
      "This does not appear to be a valid date.": "Похоже, это недействительная дата.",
      "Please enter a valid phone number": "Введите действительный номер телефона",
      "This date must be between": "Дата должна быть между"
    }
  },

  vi: {
    pleaseWait: "Vui lòng chờ...",
    alert: n =>
      `Biểu mẫu chưa hoàn tất và chưa được gửi. Có ${n} lỗi trong nội dung bạn gửi.`,
    messages: {
      "This field is required.": "Trường này là bắt buộc.",
      "This does not appear to be a valid email address.": "Địa chỉ email này không hợp lệ.",
      "Please enter a valid 5-digit ZIP code": "Vui lòng nhập mã ZIP gồm 5 chữ số hợp lệ",
      "This does not appear to be a valid date.": "Ngày này không hợp lệ.",
      "Please enter a valid phone number": "Vui lòng nhập số điện thoại hợp lệ",
      "This date must be between": "Ngày phải nằm trong khoảng"
    }
  },

  zh: {
    pleaseWait: "请稍候...",
    alert: n =>
      `表单尚未完成，尚未提交。您的提交中有 ${n} 个问题。`,
    messages: {
      "This field is required.": "此字段为必填项。",
      "This does not appear to be a valid email address.": "这似乎不是有效的电子邮件地址。",
      "Please enter a valid 5-digit ZIP code": "请输入有效的 5 位邮政编码",
      "This does not appear to be a valid date.": "这似乎不是有效日期。",
      "Please enter a valid phone number": "请输入有效的电话号码",
      "This date must be between": "日期必须介于"
    }
  },

  ar: {
    pleaseWait: "يرجى الانتظار...",
    alert: n =>
      `النموذج غير مكتمل ولم يتم إرساله بعد. يوجد ${n} مشكلة في الإرسال.`,
    messages: {
      "This field is required.": "هذا الحقل مطلوب.",
      "This does not appear to be a valid email address.": "لا يبدو أن هذا عنوان بريد إلكتروني صالح.",
      "Please enter a valid 5-digit ZIP code": "يرجى إدخال رمز بريدي صالح مكون من 5 أرقام",
      "This does not appear to be a valid date.": "لا يبدو أن هذا تاريخ صالح.",
      "Please enter a valid phone number": "يرجى إدخال رقم هاتف صالح",
      "This date must be between": "يجب أن يكون التاريخ بين"
    }
  },

  so: {
    pleaseWait: "Fadlan sug...",
    alert: n =>
      `Foomka lama dhammaystirin welina lama dirin. Waxaa jira ${n} qalad gudbintaada.`,
    messages: {
      "This field is required.": "Goobtan waa qasab.",
      "This does not appear to be a valid email address.": "Tani uma muuqato cinwaan iimayl sax ah.",
      "Please enter a valid 5-digit ZIP code": "Fadlan geli koodh boosto oo sax ah oo 5 lambar ah",
      "This does not appear to be a valid date.": "Tani uma muuqato taariikh sax ah.",
      "Please enter a valid phone number": "Fadlan geli lambar telefoon oo sax ah",
      "This date must be between": "Taariikhdu waa inay u dhexaysaa"
    }
  }
};


let currentGetLang = () => "en";

function getCurrentLang() {
  const candidates = [
    typeof currentGetLang === "function" ? currentGetLang() : currentGetLang,
    document.documentElement.lang,
    document.body?.lang,
    document.body?.dataset?.lang,
    new URLSearchParams(window.location.search).get("lang"),
    new URLSearchParams(window.location.search).get("language"),
    document.querySelector("[lang]")?.getAttribute("lang"),
    document.querySelector("html")?.getAttribute("lang")
  ];

  const found = candidates
    .map(value => String(value || "").trim().toLowerCase())
    .find(value => value && value !== "en");

  return (found || "en").split("-")[0];
}


function patchAlert() {
  if (window.__faLocalizedAlertPatched) return;
  window.__faLocalizedAlertPatched = true;

  const originalAlert = window.alert;

  window.alert = function (message) {
    const lang = getCurrentLang();
    const dict = i18n[lang];

    console.log("FA alert intercepted:", message, "lang:", lang);

    if (dict && typeof message === "string") {
      const match = message.match(
        /The form is not complete and has not been submitted yet\. There (?:is|are) (\d+) problems? with your submission\./i
      );

      if (match) {
        return originalAlert.call(window, dict.alert(Number(match[1])));
      }
    }

    return originalAlert.call(window, message);
  };
}

function observeFormAssemblyErrors() {
  if (window.__faErrorObserverInstalled) return;
  window.__faErrorObserverInstalled = true;

  new MutationObserver(runTranslations).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["value", "class", "style"]
  });

  document.addEventListener(
    "submit",
    () => {
      setTimeout(runTranslations, 0);
      setTimeout(runTranslations, 50);
      setTimeout(runTranslations, 250);
      setTimeout(runTranslations, 1000);
    },
    true
  );

  document.addEventListener(
    "click",
    () => {
      setTimeout(runTranslations, 0);
      setTimeout(runTranslations, 50);
      setTimeout(runTranslations, 250);
    },
    true
  );
}

function observeSubmitButton() {
  // This can be global because buttons may not exist yet
  document.addEventListener(
    "submit",
    () => {
      setTimeout(translateSubmitButtons, 0);
      setTimeout(translateSubmitButtons, 50);
      setTimeout(translateSubmitButtons, 250);
      setTimeout(translateSubmitButtons, 1000);
    },
    true
  );
}

function runTranslations() {
  console.log("running translations", getCurrentLang());
  translateValidationMessages();
  translateSubmitButtons();
}

function translateSubmitButtons() {
  const lang = getCurrentLang();
  const dict = i18n[lang];
  if (!dict) return;

  document
    .querySelectorAll("input[type='submit'], button[type='submit']")
    .forEach(btn => {
      if (btn.tagName === "INPUT" && /please wait/i.test(btn.value)) {
        btn.value = dict.pleaseWait;
      } else if (/please wait/i.test(btn.textContent)) {
        btn.textContent = dict.pleaseWait;
      }
    });
}

export function initValidation({ formEl, getLang }) {
  console.log("initValidation called");

  if (typeof getLang === "function") {
    currentGetLang = getLang;
  } else if (typeof getLang === "string") {
    currentGetLang = () => getLang;
  }

  runTranslations();
}

function translateValidationMessages() {
  const lang = getCurrentLang();
  if (lang === "en") return;

  const dict = i18n[lang];
  if (!dict) return;

  document.querySelectorAll(".errMsg").forEach(el => {
    let text = el.textContent || "";

    Object.entries(dict.messages).forEach(([english, translated]) => {
      text = text.replaceAll(english, translated);
    });

    if (el.textContent !== text) {
      console.log("Translated error:", el.textContent, "=>", text);
      el.textContent = text;
    }
  });
}

/*
 * RUN IMMEDIATELY ON BUNDLE LOAD
 * NOT inside initValidation()
 */
(function installFormAssemblyLocalization() {
  patchAlert();
  observeFormAssemblyErrors();
  observeSubmitButton();
})();