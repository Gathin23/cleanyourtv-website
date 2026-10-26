// The model year from a Samsung or LG model number, for /not-android's "Which year is my TV?" step.
// Only codes we can read with confidence give a year; anything else says so, and the page shows every year's path.
// Rules and sources: Samsung's own model-code guide (2008–2023 codes), retailer and spec listings for 2024 (D) and
// 2025 (F); LG's year digits and letters as tabled by tab-tv and TheProductAnalyst, with Which? for 2025 (A, 5).
// No Node or React imports, so tools/tv-year.test.mjs can run it with plain `node --test`.

export type YearResult =
  | { kind: "year"; year: number; why: string }
  | { kind: "either"; years: number[]; why: string }
  | { kind: "unknown"; why: string };

const SAMSUNG_LETTER: Record<string, number> = { N: 2018, R: 2019, T: 2020, A: 2021, B: 2022, C: 2023, D: 2024, F: 2025 };
// Crystal UHD and older UHD/SUHD: the letter before the "U" (or "S").
const SAMSUNG_UHD: Record<string, number> = { H: 2014, J: 2015, K: 2016, M: 2017, N: 2018, R: 2019, T: 2020, A: 2021, B: 2022, C: 2023, D: 2024 };
// HD and Full HD sets: a letter then four digits. A to F also meant 2008 to 2013, so only these letters are read.
const SAMSUNG_FHD: Record<string, number> = { H: 2014, J: 2015, K: 2016, M: 2017, N: 2018, R: 2019, T: 2020 };

const LG_OLED: Record<string, number> = { "7": 2017, "8": 2018, "9": 2019, X: 2020, "1": 2021, "2": 2022, "3": 2023, "4": 2024, "5": 2025 };
const LG_LETTER: Record<string, number> = { H: 2016, J: 2017, K: 2018, M: 2019, N: 2020, P: 2021, Q: 2022, R: 2023, T: 2024, A: 2025 };

const clean = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");

function hit(year: number, why: string): YearResult {
  return { kind: "year", year, why };
}
function unknown(code: string): YearResult {
  return { kind: "unknown", why: code ? `We can’t read the year from ${code} with confidence.` : "Type the model number first." };
}

/** Samsung: two type/market letters (QN, UN, QE, UE, GQ, TQ…) and the size, then the series, which carries the year.
 *  A bare series (QN90D, DU7200) works too. */
export function samsungYear(input: string): YearResult {
  const code = clean(input);
  if (!code) return unknown("");
  const m = code.match(/^[A-Z]{2}\d{2,3}(.+)$/);
  const r = m ? samsungSeries(m[1]) : null;
  if (r && r.kind !== "unknown") return r;
  const bare = samsungSeries(code);
  return bare.kind === "unknown" ? unknown(code) : bare;
}

function samsungSeries(s: string): YearResult {
  let x: RegExpMatchArray | null;

  if ((x = s.match(/^LS003/))) return hit(2017, "LS003 is the 2017 Frame.");
  if ((x = s.match(/^LS\d{2}([NRTABCDF])/))) return hit(SAMSUNG_LETTER[x[1]], `The letter after LS${s.slice(2, 4)} is ${x[1]}: ${SAMSUNG_LETTER[x[1]]}.`);
  if ((x = s.match(/^QN\d{2,3}([ABCDF])/))) return hit(SAMSUNG_LETTER[x[1]], `Neo QLED, and the letter after the series number is ${x[1]}: ${SAMSUNG_LETTER[x[1]]}.`);
  if ((x = s.match(/^S\d{2}([BCDF])/))) return hit(SAMSUNG_LETTER[x[1]], `OLED, and the letter after the series number is ${x[1]}: ${SAMSUNG_LETTER[x[1]]}.`);
  if (/^Q900R/.test(s)) return hit(2018, "Q900R is the 2018 8K QLED.");
  if ((x = s.match(/^Q\d{2,3}([RTABCD])/))) return hit(SAMSUNG_LETTER[x[1]], `QLED, and the letter after the series number is ${x[1]}: ${SAMSUNG_LETTER[x[1]]}.`);
  if (/^Q\d[FCD]N/.test(s)) return hit(2018, "QLED with N after the series: 2018.");
  if (/^Q\d[FC]AM/.test(s)) return hit(2017, "QLED with AM after the series: 2017.");
  if (/^Q\dF/.test(s)) return { kind: "either", years: [2017, 2025], why: "Samsung used this QLED name in 2017 and again in 2025." };
  if ((x = s.match(/^U\d{4}F/))) return hit(2025, "Crystal UHD with F at the end: 2025.");
  if ((x = s.match(/^([HJKMNRTABCD])[US]\d{4}/))) return hit(SAMSUNG_UHD[x[1]], `The letter before ${s[1]} is ${x[1]}: ${SAMSUNG_UHD[x[1]]}.`);
  if ((x = s.match(/^([HJKMNRT])\d{4}/))) return hit(SAMSUNG_FHD[x[1]], `HD or Full HD, and the letter before the series is ${x[1]}: ${SAMSUNG_FHD[x[1]]}.`);
  return unknown(s);
}

/** LG: OLED + size + series letter + year digit; LED, NanoCell and QNED carry a year letter. */
export function lgYear(input: string): YearResult {
  const code = clean(input);
  if (!code) return unknown("");
  let x: RegExpMatchArray | null;

  // OLED: size, series letter, year digit (OLED65C4PUA, OLED65C46LA). A bare series like C4 works too.
  if ((x = code.match(/^OLED\d{2,3}([A-Z])([0-9X])/) || code.match(/^([ABCEGMRWZ])([0-9X])$/))) {
    const d = x[2];
    if (d === "6") return { kind: "either", years: [2016, 2026], why: `LG used ${x[1]}6 for both 2016 and 2026 OLEDs.` };
    if (LG_OLED[d]) return hit(LG_OLED[d], `OLED ${x[1]}${d}: the ${d === "X" ? "X" : "digit " + d} means ${LG_OLED[d]}.`);
    return unknown(code);
  }
  // UHD LED: size, U, year letter, series digits (55UQ7570, 65UA7700). 2014's UB and 2026's UB share a letter.
  if ((x = code.match(/^(?:\d{2,3})?U([A-Z])\d{2,4}/))) {
    if (x[1] === "B") return { kind: "either", years: [2014, 2026], why: "LG used UB for both 2014 and 2026." };
    if (LG_LETTER[x[1]]) return hit(LG_LETTER[x[1]], `UHD, and the letter after U is ${x[1]}: ${LG_LETTER[x[1]]}.`);
    return unknown(code);
  }
  // Older Super UHD and NanoCell: SJ, SK, SM.
  if ((x = code.match(/^(?:\d{2,3})?S([JKM])\d{4}/))) return hit(LG_LETTER[x[1]], `The letter after S is ${x[1]}: ${LG_LETTER[x[1]]}.`);
  // NanoCell and QNED. 2024 on: year straight after the tier (QNED80TUC, NANO81A6A). 2020–2023: a market letter,
  // then the year (QNED80URA, NANO80VPA). European 2020–2023 codes have a three-digit tier (QNED826RE).
  if ((x = code.match(/^(?:\d{2,3})?(?:NANO|QNED)(\d{2,3})([A-Z])([A-Z0-9]?)/))) {
    const [, tier, a, b] = x;
    if (tier.length === 2 && (a === "T" || a === "A")) return hit(LG_LETTER[a], `The letter after the tier is ${a}: ${LG_LETTER[a]}.`);
    if (tier.length === 2 && (a === "U" || a === "V") && b && "NPQR".includes(b)) return hit(LG_LETTER[b], `The year letter is ${b}: ${LG_LETTER[b]}.`);
    if (tier.length === 3 && "NPQRT".includes(a)) return hit(LG_LETTER[a], `The letter after the tier is ${a}: ${LG_LETTER[a]}.`);
    return unknown(code);
  }
  return unknown(code);
}
