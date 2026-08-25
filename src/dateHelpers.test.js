// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { initDateHelpers } from "./dateHelpers.js";

function buildDom({
  dob = "",
  month = "",
  day = "",
  year = ""
} = {}) {
  document.body.innerHTML = `
    <input id="tfa_113" value="${dob}">

    <select id="tfa_156">
      <option value="">Month</option>
      <option value="01"${month === "01" ? " selected" : ""}>01</option>
      <option value="02"${month === "02" ? " selected" : ""}>02</option>
      <option value="03"${month === "03" ? " selected" : ""}>03</option>
      <option value="04"${month === "04" ? " selected" : ""}>04</option>
      <option value="05"${month === "05" ? " selected" : ""}>05</option>
      <option value="06"${month === "06" ? " selected" : ""}>06</option>
      <option value="07"${month === "07" ? " selected" : ""}>07</option>
      <option value="08"${month === "08" ? " selected" : ""}>08</option>
      <option value="09"${month === "09" ? " selected" : ""}>09</option>
      <option value="10"${month === "10" ? " selected" : ""}>10</option>
      <option value="11"${month === "11" ? " selected" : ""}>11</option>
      <option value="12"${month === "12" ? " selected" : ""}>12</option>
    </select>

    <select id="tfa_157">
      <option value="">Day</option>
      ${
        day
          ? `<option value="${day}" selected>${day}</option>`
          : ""
      }
    </select>

    <select id="tfa_158">
      <option value="">Year</option>
      ${
        year
          ? `<option value="${year}" selected>${year}</option>`
          : ""
      }
    </select>
  `;
}

function init(overrides = {}) {
  initDateHelpers({
    mm_tfa: "tfa_156",
    dd_tfa: "tfa_157",
    yy_tfa: "tfa_158",
    dob_tfa: "tfa_113",
    monthPlaceholder: "Month",
    dayPlaceholder: "Day",
    yearPlaceholder: "Year",
    ...overrides
  });
}

function optionTexts(id) {
  return [...document.getElementById(id).options].map(
    option => option.textContent
  );
}

beforeEach(() => {
  document.documentElement.innerHTML = "<head></head><body></body>";
});

describe("initDateHelpers", () => {
  it("returns safely when a required element is missing", () => {
    document.body.innerHTML = `
      <input id="tfa_113">
      <select id="tfa_156"></select>
    `;

    expect(() => init()).not.toThrow();
  });

  it("sets the supplied placeholders", () => {
    buildDom();

    initDateHelpers({
      mm_tfa: "tfa_156",
      dd_tfa: "tfa_157",
      yy_tfa: "tfa_158",
      dob_tfa: "tfa_113",
      monthPlaceholder: "Mes",
      dayPlaceholder: "Día",
      yearPlaceholder: "Año"
    });

    expect(
      document.getElementById("tfa_156").options[0].textContent
    ).toBe("Mes");

    expect(
      document.getElementById("tfa_157").options[0].textContent
    ).toBe("Día");

    expect(
      document.getElementById("tfa_158").options[0].textContent
    ).toBe("Año");

    expect(
      document.getElementById("tfa_156").options[0].value
    ).toBe("");

    expect(
      document.getElementById("tfa_157").options[0].value
    ).toBe("");

    expect(
      document.getElementById("tfa_158").options[0].value
    ).toBe("");
  });

  it("creates 100 year choices plus the placeholder", () => {
    buildDom();
    init();

    const yearSelect = document.getElementById("tfa_158");
    const currentYear = new Date().getFullYear();

    expect(yearSelect.options).toHaveLength(101);

    expect(yearSelect.options[0].textContent).toBe("Year");
    expect(yearSelect.options[1].textContent).toBe(
      String(currentYear)
    );

    expect(
      yearSelect.options[yearSelect.options.length - 1].textContent
    ).toBe(String(currentYear - 99));
  });

  it("starts with 31 days when no month is selected", () => {
    buildDom();
    init();

    const days = optionTexts("tfa_157");

    expect(days).toHaveLength(32);
    expect(days[0]).toBe("Day");
    expect(days[1]).toBe("01");
    expect(days[31]).toBe("31");
  });

  it("creates 29 days for February", () => {
    buildDom();
    init();

    const month = document.getElementById("tfa_156");

    month.value = "02";
    month.dispatchEvent(new Event("change"));

    const days = optionTexts("tfa_157");

    expect(days).toHaveLength(30);
    expect(days.at(-1)).toBe("29");
    expect(days).not.toContain("30");
    expect(days).not.toContain("31");
  });

  it.each(["04", "06", "09", "11"])(
    "creates 30 days for month %s",
    monthValue => {
      buildDom();
      init();

      const month = document.getElementById("tfa_156");

      month.value = monthValue;
      month.dispatchEvent(new Event("change"));

      const days = optionTexts("tfa_157");

      expect(days).toHaveLength(31);
      expect(days.at(-1)).toBe("30");
      expect(days).not.toContain("31");
    }
  );

  it.each([
    "01",
    "03",
    "05",
    "07",
    "08",
    "10",
    "12"
  ])("creates 31 days for month %s", monthValue => {
    buildDom();
    init();

    const month = document.getElementById("tfa_156");

    month.value = monthValue;
    month.dispatchEvent(new Event("change"));

    const days = optionTexts("tfa_157");

    expect(days).toHaveLength(32);
    expect(days.at(-1)).toBe("31");
  });

  it("preserves a valid selected day when the month changes", () => {
    buildDom();
    init();

    const month = document.getElementById("tfa_156");
    const day = document.getElementById("tfa_157");

    month.value = "01";
    month.dispatchEvent(new Event("change"));

    day.value = "28";

    month.value = "02";
    month.dispatchEvent(new Event("change"));

    expect(day.value).toBe("28");
  });

  it("clears a selected day that does not exist in the new month", () => {
    buildDom();
    init();

    const month = document.getElementById("tfa_156");
    const day = document.getElementById("tfa_157");

    month.value = "01";
    month.dispatchEvent(new Event("change"));

    day.value = "31";

    month.value = "04";
    month.dispatchEvent(new Event("change"));

    expect(day.value).toBe("");
  });

  it("updates the hidden DOB field when month, day, and year are selected", () => {
    buildDom();
    init();

    const month = document.getElementById("tfa_156");
    const day = document.getElementById("tfa_157");
    const year = document.getElementById("tfa_158");
    const dob = document.getElementById("tfa_113");

    const inputListener = vi.fn();
    const changeListener = vi.fn();

    dob.addEventListener("input", inputListener);
    dob.addEventListener("change", changeListener);

    month.value = "06";
    month.dispatchEvent(new Event("change"));

    day.value = "15";
    day.dispatchEvent(new Event("change"));

    year.value = "2000";
    year.dispatchEvent(new Event("change"));

    expect(dob.value).toBe("2000-06-15");

    expect(inputListener).toHaveBeenCalled();
    expect(changeListener).toHaveBeenCalled();
  });

  it("keeps the hidden DOB empty until all three date parts exist", () => {
    buildDom();
    init();

    const month = document.getElementById("tfa_156");
    const day = document.getElementById("tfa_157");
    const dob = document.getElementById("tfa_113");

    month.value = "06";
    month.dispatchEvent(new Event("change"));

    expect(dob.value).toBe("");

    day.value = "15";
    day.dispatchEvent(new Event("change"));

    expect(dob.value).toBe("");
  });

  it("restores the visible selectors from a valid Salesforce date", () => {
    buildDom({
      dob: "1990-11-27"
    });

    init();

    expect(
      document.getElementById("tfa_156").value
    ).toBe("11");

    expect(
      document.getElementById("tfa_157").value
    ).toBe("27");

    expect(
      document.getElementById("tfa_158").value
    ).toBe("1990");
  });

  it("does not restore visible selectors from an invalid DOB format", () => {
    buildDom({
      dob: "11/27/1990"
    });

    init();

    expect(
      document.getElementById("tfa_156").value
    ).toBe("");

    expect(
      document.getElementById("tfa_157").value
    ).toBe("");

    expect(
      document.getElementById("tfa_158").value
    ).toBe("");
  });

  it("does not restore an invalid month from the DOB field", () => {
    buildDom({
      dob: "1990-99-12"
    });

    init();

    expect(
      document.getElementById("tfa_156").value
    ).toBe("");
  });

  it("updates placeholders when a languagechange event is dispatched", () => {
    buildDom();
    init();

    document.dispatchEvent(
      new CustomEvent("languagechange", {
        detail: {
          datePlaceholders: {
            month: "Mes",
            day: "Día",
            year: "Año"
          }
        }
      })
    );

    expect(
      document.getElementById("tfa_156").options[0].textContent
    ).toBe("Mes");

    expect(
      document.getElementById("tfa_157").options[0].textContent
    ).toBe("Día");

    expect(
      document.getElementById("tfa_158").options[0].textContent
    ).toBe("Año");
  });

  it("ignores languagechange events without datePlaceholders", () => {
    buildDom();
    init();

    document.dispatchEvent(
      new CustomEvent("languagechange", {
        detail: {}
      })
    );

    expect(
      document.getElementById("tfa_156").options[0].textContent
    ).toBe("Month");

    expect(
      document.getElementById("tfa_157").options[0].textContent
    ).toBe("Day");

    expect(
      document.getElementById("tfa_158").options[0].textContent
    ).toBe("Year");
  });

  it("preserves selected date values when placeholders are translated", () => {
    buildDom();
    init();

    const month = document.getElementById("tfa_156");
    const day = document.getElementById("tfa_157");
    const year = document.getElementById("tfa_158");

    month.value = "09";
    month.dispatchEvent(new Event("change"));

    day.value = "14";
    year.value = "1995";

    document.dispatchEvent(
      new CustomEvent("languagechange", {
        detail: {
          datePlaceholders: {
            month: "Mes",
            day: "Día",
            year: "Año"
          }
        }
      })
    );

    expect(month.value).toBe("09");
    expect(day.value).toBe("14");
    expect(year.value).toBe("1995");
  });

  it("rebuilds the translated day list according to the currently selected month", () => {
    buildDom();
    init();

    const month = document.getElementById("tfa_156");

    month.value = "02";
    month.dispatchEvent(new Event("change"));

    document.dispatchEvent(
      new CustomEvent("languagechange", {
        detail: {
          datePlaceholders: {
            month: "Mes",
            day: "Día",
            year: "Año"
          }
        }
      })
    );

    const days = optionTexts("tfa_157");

    expect(days[0]).toBe("Día");
    expect(days.at(-1)).toBe("29");
    expect(days).not.toContain("30");
  });

  it("uses default English placeholders when custom placeholders are omitted", () => {
    buildDom();

    initDateHelpers({
      mm_tfa: "tfa_156",
      dd_tfa: "tfa_157",
      yy_tfa: "tfa_158",
      dob_tfa: "tfa_113"
    });

    expect(
      document.getElementById("tfa_156").options[0].textContent
    ).toBe("Month");

    expect(
      document.getElementById("tfa_157").options[0].textContent
    ).toBe("Day");

    expect(
      document.getElementById("tfa_158").options[0].textContent
    ).toBe("Year");
  });
});