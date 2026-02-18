export default function IslamicPattern() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] dark:opacity-[0.06]">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="islamic-pattern"
            patternUnits="userSpaceOnUse"
            width="200"
            height="200"
          >
            <circle cx="100" cy="100" r="80" fill="none" stroke="#555450" strokeWidth="1"/>
            <circle cx="100" cy="100" r="40" fill="none" stroke="#C6A94A" strokeWidth="1"/>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
      </svg>
    </div>
  )
}
