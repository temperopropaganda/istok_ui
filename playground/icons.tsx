// Ícones SVG da vitrine (a lib não traz biblioteca de ícones: cada projeto usa a sua).

export function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function InfoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WarningIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
        strokeLinejoin="round"
      />
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
    </svg>
  );
}

export function ErrorIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
    </svg>
  );
}

function StrokeIcon({ d }: { d: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

export function BoldIcon() {
  return <StrokeIcon d="M6 12h9a4 4 0 0 1 0 8H6V4h8a4 4 0 0 1 0 8" />;
}

export function ItalicIcon() {
  return <StrokeIcon d="M19 4h-9M14 20H5M15 4 9 20" />;
}

export function UnderlineIcon() {
  return <StrokeIcon d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16" />;
}

export function SunIcon() {
  return (
    <StrokeIcon d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0" />
  );
}

export function MoonIcon() {
  return <StrokeIcon d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />;
}

export function MenuIcon() {
  return <StrokeIcon d="M4 6h16M4 12h16M4 18h16" />;
}

export function CloseIcon() {
  return <StrokeIcon d="M18 6 6 18M6 6l12 12" />;
}

export function ChevronLeftIcon() {
  return <StrokeIcon d="m15 18-6-6 6-6" />;
}

export function ChevronRightIcon() {
  return <StrokeIcon d="m9 18 6-6-6-6" />;
}
