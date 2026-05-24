export default function ModalTitle({ children, subtitle }) {
  return (
    <div className="mb-5 pr-8">
      <h2 className="font-display text-lg font-bold text-foreground">{children}</h2>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
