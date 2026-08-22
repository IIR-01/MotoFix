// Signature visual for the auth screens: a dashed route connecting a
// stranded driver to a nearby mechanic — the actual core mechanic of
// MotoFix's roadside assistance flow, not a decorative abstraction.
export default function RoutePanel() {
  return (
    <div className="hidden md:flex md:w-[42%] bg-primary-red text-white flex-col justify-between p-10 lg:p-14">
      <a href="/" className="font-display font-semibold text-2xl tracking-tight">
        MOTO<span className="text-light-red-bg">FIX</span>
      </a>

      <div className="flex flex-col gap-8">
        <p className="font-display font-medium text-3xl lg:text-[40px] leading-[1.1]">
          Roadside help,
          <br />
          dispatched in minutes.
        </p>

        <div className="flex gap-4 items-stretch">
          <svg width="20" height="140" viewBox="0 0 20 140" fill="none" className="shrink-0">
            <circle cx="10" cy="10" r="7" fill="white" />
            <circle cx="10" cy="10" r="3" fill="#D62839" />
            <line x1="10" y1="22" x2="10" y2="112" stroke="white" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
            <circle cx="10" cy="124" r="9" fill="white" />
            <path d="M10 118v12M5 124h10" stroke="#D62839" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="flex flex-col justify-between py-0.5">
            <div>
              <p className="font-medium text-sm">You</p>
              <p className="text-light-red-bg/80 text-xs mt-0.5">Broken down, sharing your location</p>
            </div>
            <div>
              <p className="font-medium text-sm">Verified mechanic</p>
              <p className="text-light-red-bg/80 text-xs mt-0.5">Accepted, on the way</p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 pt-2 border-t border-white/20 text-sm">
          <span>Parts marketplace</span>
          <span>Roadside assistance</span>
          <span>AI customization</span>
        </div>
      </div>

      <p className="text-xs text-light-red-bg/70">MotoFix &mdash; A project for CSE471 of Section: 02 Group 10</p>
    </div>
  );
}