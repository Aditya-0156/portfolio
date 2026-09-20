// Development-only copy-fit check. Walks the content modules against src/content/limits.js and
// warns about any slot outside its limit. Nothing is ever truncated. Handles the simple key
// grammar (dots, [] for every item, [key=value] filters); composed slots are checked by name.
import limits from '../content/limits.js';

function resolve(root, path) {
  const segs = path.split('.');
  let nodes = [root];
  for (const seg of segs) {
    const m = /^([^[]+)(\[(.*)\])?$/.exec(seg);
    if (!m) return [];
    const key = m[1];
    const filter = m[3];
    const next = [];
    for (const node of nodes) {
      if (node == null || typeof node !== 'object' || !Object.hasOwn(node, key)) continue;
      const v = node[key];
      if (m[2] === undefined) next.push(v);
      else if (Array.isArray(v)) {
        for (const item of v) {
          if (filter === '' || filter === undefined) next.push(item);
          else {
            const [fk, fv] = filter.split('=');
            if (item && item[fk] === fv) next.push(item);
          }
        }
      }
    }
    nodes = next;
  }
  return nodes;
}

export function runCopyFit(content) {
  const problems = [];
  for (const [key, rule] of Object.entries(limits)) {
    if (rule.composed) {
      if (key === 'hero.roleLine' && content.hero) {
        const line = `${content.hero.role} at ${content.hero.company}, ${content.hero.location}`;
        if (line.length > rule.max) problems.push(`${key}: ${line.length} > ${rule.max}`);
      }
      continue;
    }
    const values = resolve(content, key);
    for (const v of values) {
      if (typeof v === 'string') {
        if (rule.max && v.length > rule.max) problems.push(`${key}: ${v.length} > ${rule.max} ("${v.slice(0, 40)}")`);
        if (rule.min && v.length < rule.min) problems.push(`${key}: ${v.length} < ${rule.min}`);
        if (rule.words && v.trim().split(/\s+/).length !== rule.words) problems.push(`${key}: expected ${rule.words} words`);
      } else if (Array.isArray(v)) {
        if (rule.count && rule.count.max && v.length > rule.count.max) problems.push(`${key}: ${v.length} items > ${rule.count.max}`);
        if (rule.count && rule.count.min && v.length < rule.count.min) problems.push(`${key}: ${v.length} items < ${rule.count.min}`);
        if (rule.total && rule.total.max) {
          const total = v.reduce((n, item) => n + (typeof item === 'string' ? item.length : String(item && item.name ? item.name : '').length), 0);
          if (total > rule.total.max) problems.push(`${key}: total ${total} > ${rule.total.max}`);
        }
      }
    }
  }
  if (problems.length) console.warn(`[copy-fit] ${problems.length} slot(s) outside limits:\n  ${problems.join('\n  ')}`);
  return problems;
}
