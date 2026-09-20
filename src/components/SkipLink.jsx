export default function SkipLink({ targetId = 'content', label }) {
  return (
    <a className="skip t-mono-label" href={`#${targetId}`}>
      {label}
    </a>
  );
}
