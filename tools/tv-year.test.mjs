// Unit tests for lib/tvYear.ts, the /not-android model-year decoder. Run with `npm test` (node --test, Node 22.18 or newer
// for the built-in TypeScript stripping). Every code here is a real model number; the expected year is the one its
// listings give, and codes that can't be read with confidence must say so instead of guessing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { lgYear, samsungYear } from "../lib/tvYear.ts";

const year = (fn, code) => {
  const r = fn(code);
  return r.kind === "year" ? r.year : r.kind === "either" ? r.years.join("/") : "unknown";
};

const SAMSUNG = {
  // 2025: F
  QN65QN90FAFXZA: 2025, QN65S90F: 2025, UN55U8000FFXZA: 2025, UE65U8000F: 2025, QE55QN93F: 2025, QN65LS03F: 2025,
  // 2024: D
  QN65S90D: 2024, QN65QN90D: 2024, QN65QN90DAFXZA: 2024, QN55LS03D: 2024, UN55DU7200: 2024, UN55DU7200FXZA: 2024,
  QN65Q60D: 2024, GQ65QN90DAT: 2024, TQ65QN90D: 2024, QE65S95D: 2024, QN85QN900D: 2024,
  // 2023: C
  UN55CU8000: 2023, QN65QN90C: 2023, QN65S90C: 2023, QN55LS03C: 2023, QN85QN900C: 2023, QN65Q80C: 2023,
  // 2022: B
  UE55BU8000: 2022, QN65QN85B: 2022, QE55S95B: 2022, QN55LS03B: 2022, QN65Q80B: 2022,
  // 2021: A
  UN55AU8000: 2021, QN65QN90A: 2021, QN55LS03A: 2021, QN65Q80A: 2021,
  // 2020: T
  QN65Q80T: 2020, QN65Q80TAFXZA: 2020, QN65Q900TSFXZA: 2020, UN55TU8000: 2020, UE43TU7100: 2020, UN43T5300: 2020, QN43LS03T: 2020,
  // 2019: R
  UN65RU7100: 2019, QN65Q90R: 2019, QN82Q950RB: 2019, QN55LS03R: 2019,
  // 2018: N, and the 2018 8K Q900R
  UN55NU7100: 2018, QN65Q7FN: 2018, QE55Q9FN: 2018, QN65Q8DN: 2018, QN65Q900R: 2018, UN32N5300: 2018, QN55LS03N: 2018,
  // older
  UN55MU8000: 2017, QN65Q7FAM: 2017, UN65KS8000: 2016, UE48JU6400: 2015, UN55HU8550: 2014,
  // bare series and messy typing
  QN90D: 2024, DU7200: 2024, S90D: 2024, "qn65 qn90d": 2024, "QN-65QN90D": 2024,
  // can't tell, so it must not guess
  QN65Q7F: "2017/2025",
  UN55D6000: "unknown", // D + four digits was 2011's Full HD letter
  QN65QN90H: "unknown",
  LST7T: "unknown",
  HELLO: "unknown",
  "": "unknown",
};

const LG = {
  // OLED: series letter + year digit, X for 2020
  OLED65C5PUA: 2025, OLED65C4PUA: 2024, OLED65C4: 2024, OLED65C46LA: 2024, OLED65G4WUA: 2024, OLED65C3PUA: 2023, OLED77M3: 2023,
  OLED55C2PUA: 2022, OLED48A2: 2022, OLED65C1PUB: 2021, OLED65CXPUA: 2020, OLED65GXPUA: 2020, OLED65C9PUA: 2019, OLED55B9: 2019,
  OLED65C8PUA: 2018, OLED65W8: 2018, OLED65B7P: 2017, C4: 2024, CX: 2020,
  // UHD LED: U + year letter
  "65UA7700PUB": 2025, "65UA73006LA": 2025, "43UT8000": 2024, "55UR8000": 2023, "55UQ7570PUJ": 2022, "55UP7000PUA": 2021,
  "50UN7300": 2020, "65UM7300PUA": 2019, "55UK6300": 2018, "43UJ6300": 2017, "55UH6150": 2016,
  // NanoCell and QNED
  "55NANO81A6A": 2025, "50NANO81T6A": 2024, "55NANO75UQA": 2022, "75NANO80VPA": 2021, "55NANO85UNA": 2020, "55NANO796NF": 2020,
  "65QNED85AUA": 2025, "50QNED82A6B": 2025, "65QNED80TUC": 2024, "65QNED80URA": 2023, "75QNED826RE": 2023, "65QNED85UQA": 2022, "65QNED90UPA": 2021,
  "55SM8600": 2019, "55SK8000": 2018,
  // can't tell
  OLED65C6PUA: "2016/2026", "65UB8500": "2014/2026", OLED65CS6LA: "unknown", "65QNED9M": "unknown", XYZ123: "unknown", "": "unknown",
};

test("Samsung model years", () => {
  for (const [code, want] of Object.entries(SAMSUNG)) assert.equal(year(samsungYear, code), want, code);
});

test("LG model years", () => {
  for (const [code, want] of Object.entries(LG)) assert.equal(year(lgYear, code), want, code);
});

test("a Samsung code is not read as LG and the other way round", () => {
  assert.equal(year(lgYear, "QN65QN90D"), "unknown");
  assert.equal(year(samsungYear, "OLED65C4PUA"), "unknown");
});
