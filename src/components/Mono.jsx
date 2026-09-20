/** Every mono string goes through Mono: `label` is the uppercase tracked form, `dim` is fg-2. */
export default function Mono({ as = 'span', label = false, dim = false, tnum = true, className = '', children, ...rest }) {
  const Tag = as;
  const cls = [label ? 't-mono-label' : 't-mono', dim && 'dim', tnum && 'tnum', className].filter(Boolean).join(' ');
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}
