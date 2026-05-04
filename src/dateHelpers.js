// dateHelpers.js

export function initDateHelpers() {
  const dobEl = document.getElementById("tfa_113");

  const mmSelect = document.getElementById("tfa_156");
  const ddSelect = document.getElementById("tfa_157");
  const yyyySelect = document.getElementById("tfa_158");

  if (!dobEl || !mmSelect || !ddSelect || !yyyySelect) return;

  const dateSelects = [mmSelect, ddSelect, yyyySelect];

  function getSelectedText(el) {
    return el?.options?.[el.selectedIndex]?.text || "";
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
    const mm = getSelectedText(mmSelect);
    const max = getMaxDay(mm);
    const dates = [];

    for (let i = 1; i <= max; i++) {
      dates.push(i < 10 ? `0${i}` : String(i));
    }

    dates.unshift("");
    return dates;
  }

  function yearOptions() {
    const years = [];
    const currentYear = new Date().getFullYear();

    for (let i = currentYear - 99; i <= currentYear; i++) {
      years.unshift(String(i));
    }

    years.unshift("");
    return years;
  }

  function emptyCombo(selectEl) {
    selectEl.options.length = 1;
    return selectEl;
  }

  function populateCombo(selectEl, items) {
    selectEl.append(...items.map(item => new Option(item, item)));
  }

  function formatSFDate(mm, dd, yyyy) {
    if (!mm || !dd || !yyyy) return "";

    return `${yyyy}-${mm}-${dd}`;
  }

  function updateBirthdateField() {
    dobEl.value = formatSFDate(
      getSelectedText(mmSelect),
      getSelectedText(ddSelect),
      getSelectedText(yyyySelect)
    );

    dobEl.dispatchEvent(new Event("input", { bubbles: true }));
    dobEl.dispatchEvent(new Event("change", { bubbles: true }));
  }

  mmSelect.addEventListener("change", function () {
    populateCombo(emptyCombo(ddSelect), dateOptions());
    updateBirthdateField();
  });

  dateSelects.forEach(field => {
    field.addEventListener("change", updateBirthdateField);
  });

  populateCombo(emptyCombo(yyyySelect), yearOptions());
}