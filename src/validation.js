// validation.js

export function initValidation({ formEl, getLang }) {
  if (!formEl) return;

  formEl.addEventListener("submit", function () {
    console.log("submitclick");

    setTimeout(() => {
      logFormAssemblyErrors();
      translateValidationMessages(getLang);
    }, 0);

    logMissingRequiredFields(formEl);
  });
}

function logFormAssemblyErrors() {
  const errContainers = document.querySelectorAll(".oneField.errFld");

  console.group("FormAssembly validation errors (.errFld)");
  errContainers.forEach(container => {
    const input = container.querySelector("input, select, textarea");
    const labelEl =
      container.querySelector(".label span") ||
      container.querySelector(".label") ||
      container.querySelector("label");
    const msgEl = container.querySelector(".errMsg");

    console.log({
      id: input && input.id,
      name: input && input.name,
      label: labelEl && labelEl.textContent.trim(),
      errorMessage: msgEl && msgEl.textContent.trim(),
      visible: container.offsetParent !== null,
      container
    });
  });
  console.groupEnd();
}

function logMissingRequiredFields(formEl) {
  const switchedOffValue = formEl.elements["tfa_switchedoff"]?.value || "";
  const switchedOff = new Set(
    switchedOffValue
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
  );

  const missing = [];

  Array.from(formEl.elements).forEach(el => {
    if (!el.name) return;
    if (el.disabled) return;
    if (switchedOff.has(el.name)) return;

    const isRequired =
      el.required ||
      el.getAttribute("aria-required") === "true" ||
      el.dataset.required === "true";

    if (!isRequired) return;

    let hasValue = false;

    switch (el.type) {
      case "checkbox":
      case "radio": {
        const group = formEl.querySelectorAll(
          `[name="${CSS.escape(el.name)}"]`
        );
        hasValue = Array.from(group).some(f => f.checked);
        break;
      }
      case "file":
        hasValue = el.files && el.files.length > 0;
        break;
      default:
        hasValue = el.value != null && el.value.trim() !== "";
    }

    if (!hasValue) missing.push(el);
  });

  console.group("Missing required fields (custom check, FA aware)");
  missing.forEach(el => {
    console.log({
      name: el.name,
      id: el.id,
      type: el.type,
      value: el.value,
      isHiddenType: el.type === "hidden",
      isVisiblyHidden: el.offsetParent === null,
      element: el
    });
  });
  console.groupEnd();
}

const validationMessages = {
  "This field is required.": {
    es: "Requerido",
    ru: "Это поле обязательно.",
    vi: "Trường này là bắt buộc.",
    zh: "此字段为必填项。",
    ar: "هذا الحقل مطلوب.",
    so: "Goobtan waa qasab."
  },
  "This does not appear to be a valid email address.": {
    es: "Dirección de correo electrónico no válida",
    ru: "Похоже, это недействительный адрес электронной почты.",
    vi: "Địa chỉ email này không hợp lệ.",
    zh: "这似乎不是有效的电子邮件地址。",
    ar: "لا يبدو أن هذا عنوان بريد إلكتروني صالح.",
    so: "Tani uma muuqato cinwaan iimayl sax ah."
  },
  "Please enter a valid 5-digit ZIP code": {
    es: "Ingrese un código postal válido de 5 dígitos",
    ru: "Введите действительный 5-значный почтовый индекс",
    vi: "Vui lòng nhập mã ZIP gồm 5 chữ số hợp lệ",
    zh: "请输入有效的 5 位邮政编码",
    ar: "يرجى إدخال رمز بريدي صالح مكون من 5 أرقام",
    so: "Fadlan geli koodh boosto oo sax ah oo 5 lambar ah"
  },
  "This does not appear to be a valid date.": {
    es: "Ingrese una fecha válida.",
    ru: "Похоже, это недействительная дата.",
    vi: "Ngày này không hợp lệ.",
    zh: "这似乎不是有效日期。",
    ar: "لا يبدو أن هذا تاريخ صالح.",
    so: "Tani uma muuqato taariikh sax ah."
  },
  "Please enter a valid phone number": {
    es: "Ingrese un número de teléfono válido",
    ru: "Введите действительный номер телефона",
    vi: "Vui lòng nhập số điện thoại hợp lệ",
    zh: "请输入有效的电话号码",
    ar: "يرجى إدخال رقم هاتف صالح",
    so: "Fadlan geli lambar telefoon oo sax ah"
  },
  "This date must be between": {
    es: "La fecha debe ser entre",
    ru: "Дата должна быть между",
    vi: "Ngày phải nằm trong khoảng",
    zh: "日期必须介于",
    ar: "يجب أن يكون التاريخ بين",
    so: "Taariikhdu waa inay u dhexaysaa"
  }
};

function translateValidationMessages(getLang) {
  const lang = (getLang || "en").split("-")[0];
  if (lang === "en") return;

  document.querySelectorAll(".errMsg, span").forEach(el => {
    Object.entries(validationMessages).forEach(([english, map]) => {
      const translated = map[lang];
      if (translated && el.textContent.includes(english)) {
        el.textContent = el.textContent.replaceAll(english, translated);
      }
    });
  });
}