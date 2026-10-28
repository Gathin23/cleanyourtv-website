// A few lines that run in the <head>, before the first paint, for what only the browser knows (the address's #hash,
// localStorage). The server HTML can't know them, so without this the page would be drawn one way and then move when
// JS arrives: Cloudflare's field data had /not-android's lower sections shifting by 0.4 on hydration.
// Only /not-android needs it for now. app/layout.tsx puts it in the head; not-android.css reads the attributes it sets.
import { BRANDS, NA_STORE } from "./privacy";

const ids = BRANDS.map((b) => b.id).join("|");

/**
 * On /not-android:
 * - data-na-level: the Go further level that will show (#dns opens level 3), so the other two never draw (CSS hides them
 *   until React's own `hidden` takes over). Without JS the attribute is never set and every level reads.
 * - data-na-wait: the guide will open a TV's steps (#samsung-2024, or saved progress), which go in above everything after
 *   the TV picker; that part stays invisible until it has, rather than being pushed down in view. Cleared by the guide,
 *   or after 6 s if JS never runs.
 * - "Every TV, every step" (#all), open in the HTML for readers without JS, folds as soon as the HTML is read, not at
 *   hydration, unless the visit came for it (#all, #all-samsung).
 */
export const NA_PREPAINT = `(function(){try{
if(location.pathname.indexOf("/not-android")!==0)return;
var d=document.documentElement,h=location.hash.slice(1),s=null;
d.dataset.naLevel=h==="dns"?"l3":"l2";
try{s=JSON.parse(localStorage.getItem("${NA_STORE}")||"null")}catch(e){}
if(/^(${ids})(-[a-z0-9-]+)?$/.test(h)||(s&&/^(${ids})$/.test(s.brand||""))){d.dataset.naWait="1";setTimeout(function(){delete d.dataset.naWait},6000)}
if(!/^all/.test(h))document.addEventListener("DOMContentLoaded",function(){var a=document.getElementById("all");if(a){a.open=false;a.dataset.folded="1"}});
}catch(e){}})()`.replace(/\n/g, "");
