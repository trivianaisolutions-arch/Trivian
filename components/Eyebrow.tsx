export function Eyebrow({ n, children, className = "" }: { n: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`label flex items-center gap-3 ${className}`}>
      <span className="eyebrow-n text-accent">{n}</span>
      <span aria-hidden="true" className="eyebrow-n h-px w-8 bg-current opacity-30" />
      <span>{children}</span>
    </p>
  );
}
