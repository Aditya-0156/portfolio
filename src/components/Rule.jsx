import { useRef } from 'react';
import { useRevealOnce } from '../hooks/useRevealOnce.js';

/**
 * A 1 px hairline. `draw` (default) scales it in from the left the first time it enters the
 * viewport; `intro` marks the rules the hero timeline draws instead; `strong` uses the
 * stronger hairline colour.
 */
export default function Rule({ strong = false, draw = true, intro = false, className = '' }) {
  const ref = useRef(null);
  const revealed = useRevealOnce(ref);
  const cls = [
    'rule',
    strong && 'rule--strong',
    intro ? 'rule--intro' : draw && 'rule--draw',
    !intro && draw && revealed && 'is-drawn',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <hr ref={ref} className={cls} aria-hidden="true" />;
}
