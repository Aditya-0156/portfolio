import fs from 'node:fs';
const css = fs.readFileSync('src/styles/tokens.css', 'utf8');
const block = (sel) => Object.fromEntries([...css.split(sel)[1].split('}')[0].matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map(m => [m[1], m[2]]));
const lum = (h) => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const cr = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
const text = [['fg-0','bg-0'],['fg-0','bg-1'],['fg-0','bg-2'],['fg-1','bg-0'],['fg-1','bg-1'],['fg-1','bg-2'],['fg-2','bg-0'],['fg-2','bg-1'],['fg-2','bg-2'],['accent-text','bg-0'],['accent-text','bg-1'],['accent-text','bg-2'],['bg-0','fg-0'],['bg-0','fill-hover']];
const nonText = [['accent','bg-0'],['accent','bg-1'],['fg-0','bg-0'],['fg-0','bg-1']];
let bad = 0;
for (const [name, sel] of [['dark', ':root[data-theme="dark"]'], ['light', ':root[data-theme="light"]']]) {
  const t = block(sel);
  for (const [f, b] of text) if (cr(t[f], t[b]) < 4.5) { console.error(`${name}: ${f} on ${b} = ${cr(t[f], t[b]).toFixed(2)} < 4.5`); bad++; }
  for (const [f, b] of nonText) if (cr(t[f], t[b]) < 3) { console.error(`${name}: ${f} on ${b} = ${cr(t[f], t[b]).toFixed(2)} < 3`); bad++; }
}
process.exit(bad ? 1 : 0);
