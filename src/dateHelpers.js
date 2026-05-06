// dateHelpers.js

export function initDateHelpers() {
  const dobEl = document.getElementById("tfa_113");

  const mmSelect = document.getElementById("tfa_156");
  const ddSelect = document.getElementById("tfa_157");
  const yyyySelect = document.getElementById("tfa_158");

  if (!dobEl || !mmSelect || !ddSelect || !yyyySelect) return;

  const dateSelects = [mmSelect, ddSelect, yyyySelect];

  function getSelectedValue(el) {
    return el?.value || "";
  }

  function getMaxDay(month) {
    switch (month) {
      case "02":
        return 29;
      case "04":
      case "06":
      case "09":
      case "11":
        return 30;
      default:
        return 31;
    }
  }

  function dateOptions() {
    const mm = getSelectedValue(mmSelect);
    const max = getMaxDay(mm);
    const dates = [""];

    for (let i = 1; i <= max; i++) {
      dates.push(i < 10 ? `0${i}` : String(i));
    }

    return dates;
  }

  function yearOptions() {
    const years = [""];
    const currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= currentYear - 99; i--) {
      years.push(String(i));
    }

    return years;
  }

  function emptyCombo(selectEl) {
    selectEl.options.length = 0;
    return selectEl;
  }

  function populateCombo(selectEl, items) {
    emptyCombo(selectEl);
    selectEl.append(...items.map(item => new Option(item, item)));
  }

  function hasOption(selectEl, value) {
    return Array.from(selectEl.options).some(option => option.value === value);
  }

  function formatSFDate(mm, dd, yyyy) {
    if (!mm || !dd || !yyyy) return "";
    return `${yyyy}-${mm}-${dd}`;
  }

  function updateBirthdateField() {
    dobEl.value = formatSFDate(
      getSelectedValue(mmSelect),
      getSelectedValue(ddSelect),
      getSelectedValue(yyyySelect)
    );

    dobEl.dispatchEvent(new Event("input", { bubbles: true }));
    dobEl.dispatchEvent(new Event("change", { bubbles: true }));
  }

  mmSelect.addEventListener("change", function () {
    const previousDay = getSelectedValue(ddSelect);

    populateCombo(ddSelect, dateOptions());

    if (previousDay && hasOption(ddSelect, previousDay)) {
      ddSelect.value = previousDay;
    }

    updateBirthdateField();
  });

  dateSelects.forEach(field => {
    field.addEventListener("change", updateBirthdateField);
  });

  populateCombo(yyyySelect, yearOptions());
}