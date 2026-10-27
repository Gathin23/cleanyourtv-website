// Every model year the /not-android decoder can read must light one of the brand's year buttons, so a decoded
// model number never falls back to "here are all of them" (2021 Samsungs did until the 2019–2021 group).
import { test } from "node:test";
import assert from "node:assert/strict";
import { BRANDS, choiceOf } from "../lib/privacy.ts";
import { samsungYear } from "../lib/tvYear.ts";

const samsung = BRANDS.find((b) => b.id === "samsung");

test("every Samsung year from 2018 on lands on a year button", () => {
  for (let y = 2018; y <= 2025; y++) assert.notEqual(choiceOf(samsung, String(y)), null, String(y));
});

test("a 2021 Samsung model number lands on 2019–2021", () => {
  for (const code of ["UN55AU8000FXZA", "QN65Q60AAFXZA", "QN65QN90A"]) {
    const r = samsungYear(code);
    assert.equal(r.kind, "year", code);
    assert.equal(choiceOf(samsung, String(r.year)), "2019-2021", code);
  }
});
