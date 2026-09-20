import { useRef } from 'react';
import Mono from '../Mono.jsx';
import { useRevealOnce } from '../../hooks/useRevealOnce.js';

const KIND_LABEL = { tool: 'TOOL', model: 'MODEL', risk: 'RISK', note: 'NOTE' };

/**
 * A ledger of one decision cycle. A real table with a hidden caption; rows print in sequence
 * the first time the panel is seen. The risk row is the one accent element in this viewport.
 */
export default function DecisionTrace({ slotLabel, caption, rows }) {
  const ref = useRef(null);
  const printed = useRevealOnce(ref, { threshold: 0.2, rootMargin: '0px' });
  // Step numbers are assigned before render: the risk row shows a mark instead of a number.
  const numbered = rows.map((r, i) =>
    r.kind === 'risk' ? null : rows.slice(0, i + 1).filter((x) => x.kind !== 'risk').length,
  );
  return (
    <div ref={ref} className={`trace${printed ? ' is-printed' : ''}`}>
      <Mono label dim className="trace__slot">
        {slotLabel}
      </Mono>
      <table className="trace__table">
        <caption className="visually-hidden">{caption}</caption>
        <thead className="visually-hidden">
          <tr>
            <th scope="col">Step</th>
            <th scope="col">Actor</th>
            <th scope="col">Call</th>
            <th scope="col">Detail</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const isRisk = r.kind === 'risk';
            return (
              <tr key={r.label + i} className={`trace__row${isRisk ? ' trace__row--risk' : ''}`} style={{ '--row': i }}>
                <td className="trace__index t-mono tnum">
                  {isRisk ? <span className="trace__dot" aria-hidden="true" /> : String(numbered[i]).padStart(2, '0')}
                </td>
                <td className="trace__kind t-mono-label">{KIND_LABEL[r.kind]}</td>
                <td className="trace__label t-mono">{r.label}</td>
                <td className="trace__detail t-mono">{r.detail}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
