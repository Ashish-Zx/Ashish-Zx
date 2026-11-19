import type { Project } from '@/lib/content';

const labels = {
  shield: 'Incident response',
  layers: 'Document retrieval',
  workflow: 'Agent orchestration',
  code: 'Source repository',
};

export function ProjectArt({ icon }: { icon: Project['icon'] }) {
  return (
    <div className={`project-art art-${icon}`} aria-hidden="true">
      <svg
        viewBox="0 0 332 150"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {icon === 'shield' && (
          <g>
            <circle
              cx="166"
              cy="74"
              r="64"
              opacity=".19"
              strokeDasharray="2 4"
            />
            <circle cx="166" cy="74" r="50" opacity=".27" />
            <circle cx="166" cy="74" r="35" opacity=".28" />
            <path
              d="M166 13v122M37 74h258M117 25l98 98m0-98-98 98"
              opacity=".22"
            />
            <path
              d="M26 74h28l9-9 13 18 12-30 12 21h28l11-13 12 26 14-45 13 57 13-25h25l10-11 9 20 11-30 11 21h50"
              strokeWidth="1.35"
            />
            <circle className="art-dot" cx="165" cy="42" r="3" />
            <circle className="art-dot" cx="246" cy="53" r="2.5" />
            <path
              d="M126 39h-9v10m89-10h9v10m-89 62h-9v-10m89 10h9v-10"
              opacity=".48"
            />
          </g>
        )}
        {icon === 'layers' && (
          <g strokeLinejoin="round">
            <path
              d="M35 74h52m158 0h52M166 15v120M58 38h37l24 15m155 59h-39l-24-15"
              opacity=".32"
              strokeDasharray="3 4"
            />
            <path
              className="art-plane"
              d="m166 73 68 26-68 27-68-27Z"
              opacity=".43"
            />
            <path
              className="art-plane"
              d="m166 56 68 26-68 27-68-27Z"
              opacity=".61"
            />
            <path
              className="art-plane"
              d="m166 38 68 26-68 27-68-27Z"
              opacity=".78"
            />
            <path className="art-plane" d="m166 20 68 26-68 27-68-27Z" />
            <path
              d="m140 44 22-8m-22 15 36-13m-23 16 35-13m-24 18 35-13"
              opacity=".77"
            />
            <circle className="art-dot" cx="58" cy="38" r="2.3" />
            <circle className="art-dot" cx="274" cy="112" r="2.3" />
          </g>
        )}
        {(icon === 'workflow' || icon === 'code') && (
          <g>
            <path
              d="M55 75h55m112 0h55M125 71c-13 0-14-31-38-31H66m59 39c-13 0-14 31-38 31H66m141-39c13 0 14-31 38-31h21m-59 39c13 0 14 31 38 31h21"
              opacity=".62"
            />
            <path
              d="M166 15v120m-62-13 124-94m-124 0 124 94"
              strokeDasharray="2 5"
              opacity=".23"
            />
            <circle cx="166" cy="75" r="46" opacity=".26" />
            <circle cx="166" cy="75" r="31" className="art-plane" />
            {icon === 'workflow' ? (
              <path d="m153 75 13-12 13 12-13 12Zm13-12v24m-13-12h26" />
            ) : (
              <path d="m159 68-8 7 8 7m14-14 8 7-8 7m-4-15-6 16" />
            )}
            {[
              [66, 40],
              [55, 75],
              [66, 110],
              [266, 40],
              [277, 75],
              [266, 110],
            ].map(([cx, cy]) => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r="3.5"
                className="art-dot"
              />
            ))}
          </g>
        )}
      </svg>
      <span>{labels[icon]}</span>
    </div>
  );
}
