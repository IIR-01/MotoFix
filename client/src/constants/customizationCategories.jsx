function PaintIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3c-3 4-5 6.5-5 9a5 5 0 0 0 10 0c0-2.5-2-5-5-9Z" />
      <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function RimIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M6.3 17.7l2.8-2.8M14.9 9.1l2.8-2.8" />
    </svg>
  );
}

function SpoilerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 8h18l-2 3H5L3 8Z" />
      <path d="M7 11v5M17 11v5" />
    </svg>
  );
}

function BodyKitIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 16v-3l2-4a2 2 0 0 1 2-1.2h10A2 2 0 0 1 19 9l2 4v3" />
      <path d="M3 16h18" />
      <circle cx="7" cy="16" r="1.6" />
      <circle cx="17" cy="16" r="1.6" />
    </svg>
  );
}

function BrakeCaliperIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M9 8h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H9" />
    </svg>
  );
}

function DecalsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...props}>
      <path d="M5 19 15 5M11 19 19 8" />
    </svg>
  );
}

export const CATEGORY_META = {
  paint_color: { label: 'Paint Color', icon: PaintIcon },
  rims: { label: 'Rims', icon: RimIcon },
  spoiler: { label: 'Spoiler', icon: SpoilerIcon },
  body_kit: { label: 'Body Kit', icon: BodyKitIcon },
  brake_caliper: { label: 'Brake Caliper', icon: BrakeCaliperIcon },
  decals: { label: 'Decals', icon: DecalsIcon },
};
