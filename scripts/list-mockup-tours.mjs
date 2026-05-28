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

const files = walk("components/mockups");
for (const f of files) {
  const c = fs.readFileSync(f, "utf8");
  const tags = [...c.matchAll(/data-tour="([^"]+)"/g)].map((m) => m[1]);
  if (tags.length === 0) continue;
  console.log(`\n=== ${path.basename(f)} ===`);
  for (const t of tags) console.log("  ", t);
}
