// dateHelpers.js

export function initDateHelpers({
  mm_tfa,
  dd_tfa,
  yy_tfa,
  dob_tfa,
  monthPlaceholder,
  dayPlaceholder,
  yearPlaceholder
} = {}) {
  console.log('initDateHelpers');
  console.log(mm_tfa,
  dd_tfa,
  yy_tfa,
  dob_tfa);
  const dobEl = document.getElementById(dob_tfa); // "tfa_113"

  const mmSelect = document.getElementById(mm_tfa); // "tfa_156"
  const ddSelect = document.getElementById(dd_tfa); // "tfa_157"
  const yyyySelect = document.getElementById(yy_tfa); // "tfa_158"

  if (!dobEl || !mmSelect || !ddSelect || !yyyySelect) return;

  let mmPlaceholder = monthPlaceholder;
  let ddPlaceholder = dayPlaceholder;
  let yyyyPlaceholder = yearPlaceholder;

  console.log(mmPlaceholder, ddPlaceholder, yyyyPlaceholder);

  if (mmSelect.options[0]) {
    mmSelect.options[0].textContent = mmPlaceholder;
    mmSelect.options[0].value = "";
  }

  function getSelectedText(selectEl) {
    const option = selectEl?.options?.[selectEl.selectedIndex];

    if (!option || option.value === "") {
      return "";
    }

    return option.textContent?.trim() || "";
  }

  function setSelectByText(selectEl, text) {
    if (!selectEl || !text) return false;

    const option = Array.from(selectEl.options).find(opt => {
      return opt.textContent.trim() === text || opt.value === text;
    });

    if (!option) return false;

    selectEl.value = option.value;
    option.selected = true;
    return true;
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

  function buildDayOptions(month) {
    const max = getMaxDay(month || "01");
    const days = [ddPlaceholder];

    for (let i = 1; i <= max; i++) {
      days.push(i < 10 ? `0${i}` : String(i));
    }

    return days;
  }

  function buildYearOptions() {
    const years = [yyyyPlaceholder];
    const currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= currentYear - 99; i--) {
      years.push(String(i));
    }

    return years;
  }

  function populateSelect(selectEl, items, previousText) {
    selectEl.options.length = 0;

    items.forEach((item, index) => {
      const value = index === 0 ? "" : item;
      selectEl.appendChild(new Option(item, value));
    });

    if (previousText) {
      setSelectByText(selectEl, previousText);
    }
  }

  function refreshDayOptions() {
    const previousDay = getSelectedText(ddSelect);
    const month = getSelectedText(mmSelect);

    populateSelect(ddSelect, buildDayOptions(month), previousDay);
  }

  document.addEventListener("languagechange", function (event) {
    const placeholders = event.detail?.datePlaceholders;

    if (!placeholders) return;

    mmPlaceholder = placeholders.month;
    ddPlaceholder = placeholders.day;
    yyyyPlaceholder = placeholders.year;

    const selectedMonth = getSelectedText(mmSelect);
    const selectedDay = getSelectedText(ddSelect);
    const selectedYear = getSelectedText(yyyySelect);

    if (mmSelect.options[0]) {
      mmSelect.options[0].textContent = mmPlaceholder;
      mmSelect.options[0].value = "";
    }

    populateSelect(
      ddSelect,
      buildDayOptions(selectedMonth),
      selectedDay
    );

    populateSelect(
      yyyySelect,
      buildYearOptions(),
      selectedYear
    );
  });

  function formatSFDate(mm, dd, yyyy) {
    if (!mm || !dd || !yyyy) return "";
    return `${yyyy}-${mm}-${dd}`;
  }

  function updateBirthdateField() {
    const mm = getSelectedText(mmSelect);
    const dd = getSelectedText(ddSelect);
    const yyyy = getSelectedText(yyyySelect);

    dobEl.value = formatSFDate(mm, dd, yyyy);

    dobEl.dispatchEvent(new Event("input", { bubbles: true }));
    dobEl.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function restoreVisibleFieldsFromDob() {
    const dobValue = dobEl.value || "";
    const match = dobValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) return;

    const [, yyyy, mm, dd] = match;

    setSelectByText(mmSelect, mm);
    refreshDayOptions();
    setSelectByText(ddSelect, dd);
    setSelectByText(yyyySelect, yyyy);
  }

  populateSelect(yyyySelect, buildYearOptions(), getSelectedText(yyyySelect));
  refreshDayOptions();
  restoreVisibleFieldsFromDob();

  mmSelect.addEventListener("change", function () {
    refreshDayOptions();
    updateBirthdateField();
  });

  ddSelect.addEventListener("change", updateBirthdateField);
  yyyySelect.addEventListener("change", updateBirthdateField);

  if (dobEl.value) {
    restoreVisibleFieldsFromDob();
  }
}