// Every country on /press gets a round flag: each country group in lib/press.ts needs an ISO code in lib/flags.ts and
// its SVG in public/press/flags/, so a new country can't show up on the card without a flag.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { COVERAGE, COVERAGE_COUNTRIES } from "../lib/press.ts";
import { COUNTRY_ISO } from "../lib/flags.ts";

const countries = COVERAGE.filter((g) => g.country).map((g) => g.group);

test("every country group has an ISO code and a flag file", () => {
  for (const c of countries) {
    assert.ok(COUNTRY_ISO[c], `no ISO code for "${c}" in lib/flags.ts`);
    assert.ok(fs.existsSync(`public/press/flags/${COUNTRY_ISO[c]}.svg`), `no public/press/flags/${COUNTRY_ISO[c]}.svg for "${c}"`);
  }
});

test("the flags match the country count", () => {
  assert.equal(countries.length, COVERAGE_COUNTRIES);
  assert.equal(new Set(countries.map((c) => COUNTRY_ISO[c])).size, COVERAGE_COUNTRIES);
});
