export default function SvgScrollDown({ className }) {
  return (
    <svg
      className={`${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 100"
      width="60"
      height="100"
    >
      <defs>
        <style>{`
          .a-dot { fill: #4B73FF; animation: scrollDot 1.8s cubic-bezier(0.4,0,0.2,1) infinite; }
          .a-ch  { fill: none; stroke: #4B73FF; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
          .a-ch1 { animation: fadeCh 1.8s ease infinite 0s; }
          .a-ch2 { animation: fadeCh 1.8s ease infinite 0.22s; }
          @keyframes scrollDot {
            0%   { transform: translateY(0px);  opacity: 1;   }
            50%  { transform: translateY(14px); opacity: 0.2; }
            100% { transform: translateY(0px);  opacity: 1;   }
          }
          @keyframes fadeCh {
            0%   { opacity: 0.15; }
            50%  { opacity: 1;    }
            100% { opacity: 0.15; }
          }
        `}</style>
      </defs>
      <rect
        x="10"
        y="5"
        width="40"
        height="60"
        rx="20"
        ry="20"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
      />
      <circle className="a-dot" cx="30" cy="24" r="4" />
      <polyline className="a-ch a-ch1" points="20,74 30,84 40,74" />
      <polyline className="a-ch a-ch2" points="20,83 30,93 40,83" />
    </svg>
  );
}
