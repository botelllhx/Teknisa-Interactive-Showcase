import fs from "fs";
import path from "path";

function walk(dir) {
  const out = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) out.push(...walk(p));
    else if (f.name.endsWith(".tsx") || f.name.endsWith(".ts")) out.push(p);
  }
  return out;
}

const flowFiles = walk("data/flows");
const flowTargets = new Map();
for (const f of flowFiles) {
  const c = fs.readFileSync(f, "utf8");
  const re = /targetSelector:\s*['"`]\[data-tour="([^"]+)"\]['"`]/g;
  let m;
  while ((m = re.exec(c)) !== null) {
    if (!flowTargets.has(m[1])) flowTargets.set(m[1], []);
    flowTargets.get(m[1]).push(f);
  }
}

const mockupFiles = walk("components/mockups").concat(walk("components/companions"));
const mockupTags = new Set();
for (const f of mockupFiles) {
  const c = fs.readFileSync(f, "utf8");
  // Both forms:
  //   data-tour="literal"
  //   data-tour={cond ? "literal" : undefined}
  // The first re is also matched by the second (which extracts ANY
  // quoted literal that follows a data-tour={ ... ).
  const reLiteral = /data-tour="([^"]+)"/g;
  let m;
  while ((m = reLiteral.exec(c)) !== null) mockupTags.add(m[1]);
  // Capture full data-tour={...} expression, then extract ALL quoted
  // strings inside it. Filters: must look like a tour selector
  // (lowercase letters + digits + hyphens, contains hyphen, 5+ chars).
  const reExpr = /data-tour=\{([^}]*?)\}/g;
  while ((m = reExpr.exec(c)) !== null) {
    const inner = m[1];
    const reInner = /"([a-z][a-z0-9-]+)"/g;
    let n;
    while ((n = reInner.exec(inner)) !== null) {
      if (n[1].includes("-") && n[1].length >= 5) {
        mockupTags.add(n[1]);
      }
    }
  }
}

const missing = [];
for (const [target, files] of flowTargets) {
  if (!mockupTags.has(target)) missing.push({ target, files });
}

console.log("=== Missing targets (flow references but mockup does not define) ===");
for (const { target, files } of missing) {
  console.log(target, "<-", files.map((f) => path.basename(f)).join(", "));
}
console.log();
console.log("Total missing:", missing.length);
console.log("Total flow targets:", flowTargets.size);
console.log("Total mockup tags:", mockupTags.size);
