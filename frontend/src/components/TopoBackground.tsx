export function TopoBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="topographic"
            x="0"
            y="0"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 50 Q 25 45, 50 50 T 100 50 T 150 50 T 200 50"
              stroke="#FFD700"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M 0 80 Q 25 75, 50 80 T 100 80 T 150 80 T 200 80"
              stroke="#FFD700"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M 0 110 Q 25 105, 50 110 T 100 110 T 150 110 T 200 110"
              stroke="#FFD700"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M 0 140 Q 25 135, 50 140 T 100 140 T 150 140 T 200 140"
              stroke="#FFD700"
              strokeWidth="1.5"
              fill="none"
            />
            <circle
              cx="50"
              cy="100"
              r="30"
              stroke="#FFD700"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="50"
              cy="100"
              r="40"
              stroke="#FFD700"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="50"
              cy="100"
              r="50"
              stroke="#FFD700"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="150"
              cy="50"
              r="20"
              stroke="#FFD700"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="150"
              cy="50"
              r="30"
              stroke="#FFD700"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="150"
              cy="50"
              r="40"
              stroke="#FFD700"
              strokeWidth="1"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topographic)" />
      </svg>
    </div>
  );
}
